import { Head } from 'nextra/components';
import { getPageMap } from 'nextra/page-map';
import { Footer, Layout, Navbar } from 'nextra-theme-docs';
import './globals.css';
import Image from 'next/image';

export const metadata = {
  metadataBase: new URL('https://starter.harvide.com'),
  title: {
    template: '%s - Harvide Starter',
  },
  description:
    'Never handle flows manually again. Kickstart your next project with pre-configured authentication, UI components, and best practices baked in.',
  applicationName: 'Harvide Starter',
  generator: 'Next.js',
  appleWebApp: {
    title: 'Harvide Starter',
  },
  other: {
    'msapplication-TileImage': '/ms-icon-144x144.png',
    'msapplication-TileColor': '#fff',
  },
  twitter: {
    site: '@harvide',
    card: 'summary_large_image',
    title: 'Harvide Starter',
    description:
      'Never handle flows manually again. Kickstart your next project with pre-configured authentication, UI components, and best practices baked in.',
    creator: '@harvide',
    images: [
      {
        url: 'https://starter.harvide.com/images/harvide-starter-banner.png',
        alt: 'Harvide Starter Banner',
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navbar = (
    <Navbar
      chatLink="https://discord.gg/jmm8PMCn9W"
      logo={
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '1rem',
          }}
        >
          <Image
            alt="Harvide Logo"
            height={30}
            priority
            src="https://www.harvide.com/logo/small-dark-white.svg"
            style={{
              marginRight: '0.5rem',
              filter: 'brightness(0.2) grayscale',
              padding: '0.25rem',
              borderRadius: '0.25rem',
              border: '1px solid var(--border)',
              backgroundColor: '#fff',
            }}
            width={30}
          />
          <span>@harvide/starter</span>
        </div>
      }
      projectLink="https://github.com/harvide/starter"
    />
  );
  const pageMap = await getPageMap();
  return (
    <html dir="ltr" lang="en" suppressHydrationWarning>
      <Head faviconGlyph="✦" />
      <body>
        <Layout
          // banner={<Banner storageKey="Starter Pro">Starter Pro is out!</Banner>}
          docsRepositoryBase="https://github.com/harvide/starter/blob/master/apps/docs"
          editLink="Edit this page on GitHub"
          footer={<Footer>MIT {new Date().getFullYear()} © Harvide.</Footer>}
          navbar={navbar}
          pageMap={pageMap}
          sidebar={{ defaultMenuCollapseLevel: 1 }}
        >
          {children}
        </Layout>
      </body>
    </html>
  );
}
