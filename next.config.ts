import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [
      { source: "/shop/trousers", destination: "/shop/joggers", permanent: true },
      { source: "/products/off-duty-joggers", destination: "/shop/joggers", permanent: true },
    ];
  },
};

export default nextConfig;
