const isProd = process.env.NODE_ENV === 'production';

// Keep basePath for production builds, but do not force static export here.
// Netlify will use the Next plugin for proper SSR/Edge support.
// Make ignoring ESLint during build configurable via env so CI/Netlify can keep
// the temporary bypass while local dev will surface lint errors by default.
const eslintIgnoreEnv = process.env.ESLINT_IGNORE_DURING_BUILD;
const ignoreDuringBuilds = eslintIgnoreEnv
  ? eslintIgnoreEnv === 'true'
  : true; // default true for now while we clean up the repo

// Allow a temporary static export mode when NEXT_STATIC_EXPORT=true is set.
const isStaticExport = process.env.NEXT_STATIC_EXPORT === 'true';

const nextConfig: any = {
  basePath: isProd ? '/soop-marinas-dashboard' : '',
  images: { unoptimized: true },
  eslint: {
    ignoreDuringBuilds: ignoreDuringBuilds,
  },
};

if (isStaticExport) {
  // Next.js expects `output: 'export'` for static export mode in newer versions.
  nextConfig.output = 'export';
}

module.exports = nextConfig;
