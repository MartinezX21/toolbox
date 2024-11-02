/** @type {import('next').NextConfig} */
const nextConfig = {
    distDir: 'build',
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'api-toolbox.kamvusoft.com',
                port: '',
                pathname: '/toolbox-api/files/**',
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