import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // ⬅️ هذا هو المطلوب الآن
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
