import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://static.cloudflareinsights.com", 
              "style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com", 
              "img-src 'self' data: blob:", 
              "font-src 'self' data: https://cdnjs.cloudflare.com",
              "connect-src 'self'",
              "media-src 'self'",
              "object-src 'none'",
              "child-src 'self'",
              "worker-src 'self' blob:", 
              "frame-ancestors 'none'", 
              "base-uri 'self'",
              "form-action 'self'"
            ].join('; ')
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ]
  }
};

export default nextConfig;