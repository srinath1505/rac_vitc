import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root — a parent-level package-lock.json otherwise makes
  // Next infer the wrong root and mis-trace files.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
