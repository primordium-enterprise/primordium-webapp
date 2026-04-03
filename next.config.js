/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    if (!config.resolve.fallback) {
      config.resolve.fallback = {};
    }
    config.resolve.fallback["@react-native-async-storage/async-storage"] = false;
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        port: '',
      }
    ]
  }
}

module.exports = nextConfig
