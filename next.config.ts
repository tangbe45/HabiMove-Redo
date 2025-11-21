import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https", // or 'http'
        hostname: "images.unsplash.com", // Replace with the actual hostname of your image source
        port: "", // Optional: Specify if a custom port is used
        pathname: "/**", // Adjust the pathname pattern as needed
      },
      {
        protocol: "https", // or 'http'
        hostname: "randomuser.me", // Replace with the actual hostname of your image source
        port: "", // Optional: Specify if a custom port is used
        pathname: "/**", // Adjust the pathname pattern as needed
      },
      {
        protocol: "http", // or 'http'
        hostname: "localhost", // Replace with the actual hostname of your image source
        port: "3000", // Optional: Specify if a custom port is used
        pathname: "/**", // Adjust the pathname pattern as needed
      },
      // Add more patterns for other external image sources if needed
    ],
  },
};

export default nextConfig;
