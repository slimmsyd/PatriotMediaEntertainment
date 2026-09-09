import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Parent Code_Projects/package-lock.json made Turbopack treat that folder
  // as the project root, so client-manifest module IDs pointed at the wrong
  // node_modules and @swc/helpers hashes broke on restart.
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      {
        // Event photos the client uploads through /admin land in Vercel Blob.
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
