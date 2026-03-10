
# Villa Coco Website

Marketing website for Villa Coco Kožino, built with React, Vite, and TypeScript.

## Tech Stack

- React
- Vite
- TypeScript

## Getting Started

Install dependencies:

```bash
npm install
  ```

Start the development server:

```bash
npm run dev
  ```

## Available Scripts

- `npm run dev` — Start local development server
- `npm run build:prod` — Build minified production bundle
- `npm run build` — Generate sitemap + build production bundle
- `npm run preview` — Preview production build locally
- `npm run preview:prod` — Serve production bundle on `http://localhost:4173`
- `npm run seo:sitemap` — Regenerate `public/sitemap.xml` from `tools/seo/routes.json`
- `npm run seo:check` — Validate sitemap, robots, canonical setup, indexability, redirects, and Googlebot fetchability
- `npm run predeploy:seo` — Run build plus all SEO/indexing checks before deployment

## SEO / Google Indexing Guardrails

This project includes proactive checks to prevent common Google Search Console indexing issues:

- `public/sitemap.xml` is generated from `tools/seo/routes.json`.
- `public/robots.txt` must include the canonical sitemap URL.
- Canonical + robots meta are set per route in `src/app/components/Layout.tsx`.
- `npm run seo:check` fails the build if critical indexing issues are detected.

Recommended deployment workflow:

```bash
npm run predeploy:seo
```

## Lighthouse / Performance Audits

Run Lighthouse only against the production preview server, not `npm run dev`.

```bash
npm run build:prod
npm run preview:prod
```

Then audit `http://localhost:4173`.

  