import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..", "..");

const configPath = path.join(projectRoot, "tools", "seo", "routes.json");
const sitemapPath = path.join(projectRoot, "public", "sitemap.xml");

function normalizeUrl(siteUrl, routePath) {
  const trimmedSite = siteUrl.replace(/\/+$/, "");
  const normalizedPath = routePath === "/" ? "/" : `/${routePath.replace(/^\/+/, "")}`;
  return `${trimmedSite}${normalizedPath === "/" ? "/" : normalizedPath}`;
}

function buildSitemapXml(siteUrl, routes) {
  const today = new Date().toISOString().slice(0, 10);
  const urlNodes = routes
    .map((route) => {
      const loc = normalizeUrl(siteUrl, route.path);
      return [
        "  <url>",
        `    <loc>${loc}</loc>`,
        `    <lastmod>${today}</lastmod>`,
        `    <changefreq>${route.changefreq}</changefreq>`,
        `    <priority>${route.priority}</priority>`,
        "  </url>",
      ].join("\n");
    })
    .join("\n");

  return [
    "<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
    "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">",
    urlNodes,
    "</urlset>",
    "",
  ].join("\n");
}

async function main() {
  const rawConfig = await readFile(configPath, "utf8");
  const config = JSON.parse(rawConfig);

  if (!config.siteUrl || !Array.isArray(config.routes) || config.routes.length === 0) {
    throw new Error("Invalid tools/seo/routes.json. Expected siteUrl and non-empty routes array.");
  }

  const xml = buildSitemapXml(config.siteUrl, config.routes);
  await writeFile(sitemapPath, xml, "utf8");

  console.log(`Generated sitemap at ${sitemapPath}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
