const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  output: 'export',           // ← wichtig!
  basePath: isProd ? '/dashboard' : '',
  images: { unoptimized: true },
};

module.exports = nextConfig;
