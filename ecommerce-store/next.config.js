/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ["res.cloudinary.com","localhost"],
    },
    eslint: {
      ignoreDuringBuilds: true, // Ignore ESLint errors during the build
    },
    typescript: {
      // Optional: to disable TypeScript type checking during builds
      ignoreBuildErrors: true,
    },
  };
  
  module.exports = nextConfig;

  // /** @type {import('next').NextConfig} */
// const nextConfig = {
//     images: {
//         domains: [
//             "res.cloudinary.com"
//         ]
//     }
// }

// module.exports = nextConfig
