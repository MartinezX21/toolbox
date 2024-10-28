/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'toolbox.kamvusoft.com',
                port: '',
                pathname: '/files/**',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '8080',
                pathname: '/files/**',
            },
        ],
    }
};

export default nextConfig;
