/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client"],
  },
  webpack: (config) => {
    // pdfjs-dist secara opsional mencoba pakai package 'canvas' (khusus Node.js).
    // Karena kita hanya pakai pdfjs-dist di browser, modul ini tidak dibutuhkan
    // dan harus diabaikan supaya proses build tidak gagal mencarinya.
    config.resolve.alias.canvas = false;
    return config;
  },
};

export default nextConfig;
