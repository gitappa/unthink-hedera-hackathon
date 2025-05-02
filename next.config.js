/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;


// import type { NextConfig } from 'next';

// const nextConfig: NextConfig = {
  
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
//   images: { unoptimized: true },
//   // Remove or comment out the following line if using static export:
//   // output: 'export',
//   // Add any other custom configurations here
// };

// export default nextConfig;

