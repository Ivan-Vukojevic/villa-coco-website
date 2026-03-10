import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..", "..");

const configPath = path.join(projectRoot, "tools", "seo", "routes.json");
const sitemapPath = path.join(projectRoot, "public", "sitemap.xml");
const robotsPath = path.join(projectRoot, "public", "robots.txt");
const indexHtmlPath = path.join(projectRoot, "index.html");
const vercelConfigPath = path.join(projectRoot, "vercel.json");

const errors = [];
const warnings = [];

function addError(message) {
  errors.push(message);
}

function addWarning(message) {
  warnings.push(message);
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeSiteUrl(url) {
  return url.replace(/\/+$/, "");
}

function joinUrl(siteUrl, routePath) {
  const normalizedSiteUrl = normalizeSiteUrl(siteUrl);
  const normalizedPath = routePath === "/" ? "/" : `/${routePath.replace(/^\/+/, "")}`;
  return `${normalizedSiteUrl}${normalizedPath === "/" ? "/" : normalizedPath}`;
}

async function safeRead(filePath, label) {
  try {
    return await readFile(filePath, "utf8");
  } catch {
    addError(`${label} is missing at ${filePath}`);
    return "";
  }
}

function validateSitemapStructure(sitemap) {
  if (!sitemap) {
    return;
  }

  if (!sitemap.includes("<urlset") || !sitemap.includes("</urlset>")) {
    addError("sitemap.xml is missing <urlset> root structure.");
  }

  const locMatches = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]?.trim());
  if (locMatches.length === 0) {
    addError("sitemap.xml does not contain any <loc> URLs.");
  }

  return locMatches;
}

function validateSitemapUrls(siteUrl, routes, sitemapLocs) {
  const expected = new Set(routes.map((route) => joinUrl(siteUrl, route.path)));
  const actual = new Set(sitemapLocs);

  for (const url of expected) {
    if (!actual.has(url)) {
      addError(`sitemap.xml is missing expected URL: ${url}`);
    }
  }

  for (const url of actual) {
    if (!url.startsWith(siteUrl)) {
      addWarning(`sitemap.xml URL uses a different host than configured siteUrl: ${url}`);
    }
  }
}

function validateRobots(siteUrl, robots) {
  if (!robots) {
    return;
  }

  const sitemapDirective = `${siteUrl}/sitemap.xml`;
  const hasSitemapDirective = new RegExp(`^Sitemap:\\s*${escapeRegex(sitemapDirective)}\\s*$`, "mi").test(robots);

  if (!hasSitemapDirective) {
    addError(`robots.txt must contain: Sitemap: ${sitemapDirective}`);
  }

  if (/Disallow:\s*\/\s*$/mi.test(robots)) {
    addError("robots.txt disallows the whole site (Disallow: /). Public pages would not be indexable.");
  }
}

function validateCanonicalAndIndexability(siteUrl, routes, indexHtml) {
  if (!indexHtml) {
    return;
  }

  const canonicalMatch = indexHtml.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
  if (!canonicalMatch) {
    addError("index.html is missing a canonical link tag.");
  } else {
    const canonicalHref = canonicalMatch[1].trim();
    if (canonicalHref !== `${siteUrl}/`) {
      addWarning(`index.html canonical is ${canonicalHref}. Expected homepage canonical ${siteUrl}/.`);
    }
  }

  const hasNoindex = /<meta\s+name=["']robots["']\s+content=["'][^"']*noindex/i.test(indexHtml);
  if (hasNoindex) {
    addError("index.html includes a noindex robots tag. Public pages may become non-indexable.");
  }

  if (routes.length === 0) {
    addError("No routes configured in tools/seo/routes.json, cannot verify canonical coverage.");
  }
}

function validateRedirectChains(siteUrl, vercelConfigRaw) {
  if (!vercelConfigRaw) {
    addWarning("vercel.json is missing. Redirect checks were skipped.");
    return;
  }

  let config;
  try {
    config = JSON.parse(vercelConfigRaw);
  } catch {
    addError("vercel.json is not valid JSON.");
    return;
  }

  const redirects = Array.isArray(config.redirects) ? config.redirects : [];
  if (redirects.length === 0) {
    addWarning("No redirects configured in vercel.json. Ensure your preferred domain canonicalization is handled elsewhere.");
    return;
  }

  if (redirects.length > 1) {
    addWarning("Multiple redirects detected. Verify they do not form chains for Googlebot.");
  }

  const destinationUrls = redirects
    .map((redirect) => redirect?.destination)
    .filter((value) => typeof value === "string");

  const duplicateDestinations = destinationUrls.filter((value, index) => destinationUrls.indexOf(value) !== index);
  if (duplicateDestinations.length > 0) {
    addWarning("Duplicate redirect destinations found. Re-check for unintended redirect behavior.");
  }

  if (!destinationUrls.some((destination) => destination.startsWith(siteUrl))) {
    addWarning(`Redirect destinations do not appear to use the configured canonical host (${siteUrl}).`);
  }
}

async function validateFetchability(siteUrl) {
  if (process.env.SEO_SKIP_REMOTE_FETCH === "1") {
    addWarning("Remote fetch checks skipped because SEO_SKIP_REMOTE_FETCH=1.");
    return;
  }

  const targets = [
    { label: "homepage", url: `${siteUrl}/` },
    { label: "sitemap", url: `${siteUrl}/sitemap.xml` },
  ];

  for (const target of targets) {
    try {
      const response = await fetch(target.url, {
        redirect: "manual",
        headers: {
          "user-agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
        },
      });

      if (response.status >= 300 && response.status < 400) {
        addWarning(`${target.label} returned a redirect (${response.status}) at ${target.url}. Avoid redirect hops for Googlebot fetches.`);
      }

      if (!response.ok && (response.status < 300 || response.status >= 400)) {
        addError(`${target.label} returned HTTP ${response.status} at ${target.url}.`);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      addWarning(`Could not fetch ${target.label} (${target.url}): ${message}`);
    }
  }
}

async function main() {
  const configRaw = await safeRead(configPath, "SEO routes config");
  if (!configRaw) {
    finish();
    return;
  }

  let config;
  try {
    config = JSON.parse(configRaw);
  } catch {
    addError("tools/seo/routes.json is not valid JSON.");
    finish();
    return;
  }

  const siteUrl = normalizeSiteUrl(config.siteUrl || "");
  const routes = Array.isArray(config.routes) ? config.routes : [];

  if (!siteUrl || !siteUrl.startsWith("https://")) {
    addError("tools/seo/routes.json must define an https siteUrl.");
  }

  const sitemap = await safeRead(sitemapPath, "sitemap.xml");
  const robots = await safeRead(robotsPath, "robots.txt");
  const indexHtml = await safeRead(indexHtmlPath, "index.html");
  const vercelConfigRaw = await safeRead(vercelConfigPath, "vercel.json");

  const sitemapLocs = validateSitemapStructure(sitemap) || [];

  if (siteUrl) {
    validateSitemapUrls(siteUrl, routes, sitemapLocs);
    validateRobots(siteUrl, robots);
    validateCanonicalAndIndexability(siteUrl, routes, indexHtml);
    validateRedirectChains(siteUrl, vercelConfigRaw);
    await validateFetchability(siteUrl);
  }

  finish();
}

function finish() {
  if (warnings.length > 0) {
    console.warn("\nSEO Indexing Warnings:");
    for (const warning of warnings) {
      console.warn(`- ${warning}`);
    }
  }

  if (errors.length > 0) {
    console.error("\nSEO Indexing Errors:");
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  console.log("SEO indexing checks passed.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
