/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  webpack: {
    cache: false,
  },
}

module.exports = nextConfig