import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Contributor avatars on the homepage.
    remotePatterns: [{ protocol: "https", hostname: "avatars.githubusercontent.com", pathname: "/**" }],
  },
};

export default nextConfig;
