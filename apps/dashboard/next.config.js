/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@saas-chat/ui', '@saas-chat/core-types'],
};

module.exports = nextConfig;

