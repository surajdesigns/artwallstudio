/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  images: {
    qualities: [25, 50, 75, 90, 100],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
