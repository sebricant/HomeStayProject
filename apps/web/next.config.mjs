/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ["@alleppey/ui", "@alleppey/database"],
    experimental: {
        // serverActions: true, // Enabled by default in modern Next.js
    },
    eslint: {
        ignoreDuringBuilds: true, // Temporary for migration
    },
};

export default nextConfig;
