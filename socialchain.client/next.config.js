/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['ipfs.io'],
    unoptimized:true
  },
}

module.exports = nextConfig
