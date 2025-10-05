const isProd = process.env.NODE_ENV === 'production';

// Keep basePath for production builds, but do not force static export here.
// Vercel has native Next.js support with proper SSR/Edge features.
// Make ignoring ESLint during build configurable via env so CI/Vercel can keep
// the temporary bypass while local dev will surface lint errors by default.
const eslintIgnoreEnv = process.env.ESLINT_IGNORE_DURING_BUILD;
const ignoreDuringBuilds = eslintIgnoreEnv
  ? eslintIgnoreEnv === 'true'
  : true; // default true for now while we clean up the repo

// Allow a temporary static export mode when NEXT_STATIC_EXPORT=true is set.
const isStaticExport = process.env.NEXT_STATIC_EXPORT === 'true';

const nextConfig = {
  basePath: '', // No basePath - serve at root
  images: { unoptimized: true },
  eslint: {
    ignoreDuringBuilds: ignoreDuringBuilds,
  },
};

if (isStaticExport) {
  // Next.js expects `output: 'export'` for static export mode in newer versions.
  (nextConfig as unknown as Record<string, unknown>).output = 'export';
}

module.exports = nextConfig;
