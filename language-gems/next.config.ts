import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const config: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  }
};

export default config;
