/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  productionBrowserSourceMaps: true,
  env: {
    NEXT_PUBLIC_MORALIS_API_KEY: process.env.NEXT_PUBLIC_MORALIS_API_KEY,
  },
  images: {
    domains: [
      'cryptologos.cc',
      'imgur.com',
      'assets.coingecko.com',
      'pancakeswap.finance',
      '1999239926-files.gitbook.io',
      'www.spiritswap.finance',
      'assets.spooky.fi',
      's2.coinmarketcap.com',
      's3.coinmarketcap.com',
      'images.unsplash.com',
      'wallet-asset.matic.network',
      'polygonscan.com',
      'baby-upload.s3.ap-southeast-1.amazonaws.com',
      'app.knightswap.financial'
    ],
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },

}

module.exports = nextConfig
