import { URL } from "url";

const nextConfig = {
  images: {
    domains: [new URL(process.env.NEXT_PUBLIC_CONVEX_URL).hostname],
  },
};

export default nextConfig;
