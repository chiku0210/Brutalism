import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/engine",
        destination: "/#darkroom",
        permanent: true,
      },
      {
        source: "/blueprint",
        destination: "/#blueprint",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
