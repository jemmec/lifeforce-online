/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix: process.env.PUBLIC_URL ? `/${process.env.PUBLIC_URL}/` : '/',
  tsconfigPath: "tsconfig.json"
}
module.exports = nextConfig
