/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "tpahvxkhnvqhnvmwletn.supabase.co", // رابط السوبابيس الخاص بك
            },
            {
                protocol: "https",
                hostname: "images.unsplash.com", // رابط صور الإعلانات
            },
        ],
    },
};

export default nextConfig;
