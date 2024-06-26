/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/files/getFile/**',
      },
      {
        protocol: 'http',
        hostname: '18.118.8.253',
        pathname: '/files/getFile/**',
      },
    ],
  },
};

export default nextConfig;
