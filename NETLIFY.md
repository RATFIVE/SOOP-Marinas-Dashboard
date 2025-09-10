Netlify deployment notes

This project uses Next.js (app router). To deploy a dynamic Next app on Netlify we use the official Netlify plugin `@netlify/plugin-nextjs`.

Steps:
1. Add the repository to Netlify.
2. Set build command: `pnpm build` and publish directory: handled by the plugin (keep `publish = ".next"` in `netlify.toml`).
3. In Netlify site settings > Environment, add:
   - `NEXT_PUBLIC_MAPBOX_TOKEN` = your Mapbox public token
   - optionally `NEXT_PUBLIC_MAPBOX_STYLE_DAY` and `NEXT_PUBLIC_MAPBOX_STYLE_NIGHT`
4. Ensure the `netlify.toml` in repo includes the plugin (already added).

Notes:
- We removed `output: 'export'` from `next.config.ts` to allow SSR/edge features via the Netlify plugin.
- Do not commit secret tokens to the repo. Use Netlify environment variables.
- If you prefer a static export, revert `next.config.ts` and use `pnpm run export` instead.
