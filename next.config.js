const ipfsGateway =
  process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://gateway.pinata.cloud'
const ipfsGatewayUrl = new URL(ipfsGateway)

/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  images: {
    domains: [ipfsGateway.replace('https://', '')],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.zora.co',
        pathname: '/renderer/**',
      },
      {
        protocol: ipfsGatewayUrl.protocol.replace(':', ''),
        hostname: ipfsGatewayUrl.hostname,
        port: ipfsGatewayUrl.port,
        pathname: `${ipfsGatewayUrl.pathname}/**`,
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/token/:tokenid',
        destination: '/?tokenid=:tokenid',
      },
    ]
  },
}

module.exports = nextConfig
