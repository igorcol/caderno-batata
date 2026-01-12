import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

// Configurações do PWA
const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    disableDevLogs: true,
  },
});

// configuração normal do Next.js
const nextConfig: NextConfig = {
  /* config options here */
};


export default withPWA(nextConfig);