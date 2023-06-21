/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            'firebasestorage.googleapis.com',
            'images.pexels.com',
            'images.unsplash.com'
        ],
    }
}

module.exports = nextConfig
