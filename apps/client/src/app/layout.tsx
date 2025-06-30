import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '@repo/ui/globals.css';
import { Toaster } from '@repo/ui/components/sonner';
import { AdminCheckWrapper } from '@/components/wrapper/admin-check-wrapper';
import config from '../../../../starter.config';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: config.seo.title,
    template: `%s | ${config.branding.name}`,
  },
  description: config.seo.description,
  keywords: config.seo.keywords,
  authors: [{ name: config.branding.name, url: config.branding.url }],
  creator: config.branding.name,
  openGraph: {
    title: config.seo.openGraph.enabled ? config.seo.title : undefined,
    description: config.seo.openGraph.enabled
      ? config.seo.description
      : undefined,
    url: config.branding.url,
    siteName: config.branding.name,
    images: config.seo.openGraph.enabled
      ? [
          {
            url: config.seo.openGraph.imageUrl,
            width: 1200,
            height: 630,
            alt: config.seo.openGraph.imageAlt,
          },
        ]
      : [],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AdminCheckWrapper />
        <Toaster />
        {children}
      </body>
    </html>
  );
}
