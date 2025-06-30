import type { MetadataRoute } from 'next';
import config from '../../../../starter.config';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: config.branding.name,
    short_name: config.branding.name,
    description: config.seo.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#fff',
    icons: [
      {
        src: '/favicons/web-app-manifest-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/favicons/web-app-manifest-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
