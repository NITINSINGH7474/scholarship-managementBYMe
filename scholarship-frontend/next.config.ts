import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.DOCKER_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api"}/:path*`,
      },
    ];
  },
};

export default nextConfig;
