/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  assetPrefix: process.env.PUBLIC_URL ? `/${process.env.PUBLIC_URL}/` : '/',
}

module.exports = nextConfig
