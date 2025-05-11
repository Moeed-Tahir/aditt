/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'rixdrbokebnvidwyzvzo.supabase.co',
      'lh3.googleusercontent.com' // Optional: if you use Google auth with avatars
    ],
    // Optional: if you want to use custom loaders or other image optimizations
    // loader: 'custom',
    // path: 'https://example.com/',
  },
  // ... other Next.js config options you might have
};

export default nextConfig;