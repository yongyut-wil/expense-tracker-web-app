import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  reactStrictMode: false,
  serverExternalPackages: [],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push({
        'sharp': 'commonjs sharp',
      });
    }
    return config;
  },
};

export default withNextIntl(nextConfig);
