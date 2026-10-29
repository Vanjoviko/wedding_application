import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Undangan bergantung pada database per request; Partial Prerender
     membuat notFound() terkirim setelah status 200, sehingga 404 jadi 200.
     Karena itu cacheComponents dimatikan. */
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [
      {
        source: "/:slug",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Referrer-Policy", value: "no-referrer" },
        ],
      },
    ];
  },
};

export default nextConfig;
