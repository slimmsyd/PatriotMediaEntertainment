import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Parent Code_Projects/package-lock.json made Turbopack treat that folder
  // as the project root, so client-manifest module IDs pointed at the wrong
  // node_modules and @swc/helpers hashes broke on restart.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
