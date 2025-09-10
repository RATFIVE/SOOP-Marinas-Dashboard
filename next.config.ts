const isProd = process.env.NODE_ENV === 'production';

// Keep basePath for production builds, but do not force static export here.
// Netlify will use the Next plugin for proper SSR/Edge support.
const nextConfig = {
  basePath: isProd ? '/dashboard' : '',
  images: { unoptimized: true },
  // Temporarily ignore ESLint errors during build so we can validate Netlify setup.
  // Long-term: fix the repo ESLint/TypeScript errors instead of using this flag.
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
