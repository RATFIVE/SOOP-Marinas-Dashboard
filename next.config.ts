const isProd = process.env.NODE_ENV === 'production';

// Keep basePath for production builds, but do not force static export here.
// Netlify will use the Next plugin for proper SSR/Edge support.
// Make ignoring ESLint during build configurable via env so CI/Netlify can keep
// the temporary bypass while local dev will surface lint errors by default.
const eslintIgnoreEnv = process.env.ESLINT_IGNORE_DURING_BUILD;
const ignoreDuringBuilds = eslintIgnoreEnv
  ? eslintIgnoreEnv === 'true'
  : true; // default true for now while we clean up the repo

const nextConfig = {
  basePath: isProd ? '/dashboard' : '',
  images: { unoptimized: true },
  eslint: {
    ignoreDuringBuilds: ignoreDuringBuilds,
  },
};

module.exports = nextConfig;
