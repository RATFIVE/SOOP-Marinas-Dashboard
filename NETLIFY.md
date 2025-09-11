Netlify deployment notes

This project uses Next.js (app router). To deploy a dynamic Next app on Netlify we use the official Netlify plugin `@netlify/plugin-nextjs`.

Steps:
1. Add the repository to Netlify.
2. Set build command: `pnpm build` and publish directory: handled by the plugin (keep `publish = ".next"` in `netlify.toml`).
   - Note: The repo currently defaults `ESLINT_IGNORE_DURING_BUILD=true` to avoid failing builds while lint issues are fixed. Set `ESLINT_IGNORE_DURING_BUILD=false` in Netlify if you want builds to run ESLint.
3. (Kein Mapbox Token mehr nötig – Leaflet + OpenStreetMap Tiles werden verwendet.)
   - Optional: set `ESLINT_IGNORE_DURING_BUILD=false` to re-enable linting in CI once fixes are applied.
4. Ensure the `netlify.toml` in repo includes the plugin (already added).

Notes:
- We removed Mapbox; no public token secrets required for the base map (OSM tiles). Consider using a tile proxy or a provider with API key for production usage / higher traffic.
- We removed `output: 'export'` from `next.config.ts` to allow SSR/edge features via the Netlify plugin.
- If you prefer a static export, revert `next.config.ts` and use `pnpm run export` instead.

BasePath note:
- `next.config.ts` sets `basePath` to `/soop-marinas-dashboard` when `NODE_ENV=production`. If you want the site served at root `/`, remove or adjust `basePath` before deploying.
