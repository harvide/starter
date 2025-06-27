import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'
import Image from 'next/image'

export const metadata = {
  metadataBase: new URL('https://starter.harvide.com'),
  title: {
    template: '%s - Harvide Starter',
  },
  description: 'Never handle flows manually again. Kickstart your next project with pre-configured authentication, UI components, and best practices baked in.',
  applicationName: 'Harvide Starter',
  generator: 'Next.js',
  appleWebApp: {
    title: 'Harvide Starter',
  },
  other: {
    'msapplication-TileImage': '/ms-icon-144x144.png',
    'msapplication-TileColor': '#fff'
  },
  twitter: {
    site: '@harvide',
    card: 'summary_large_image',
    title: 'Harvide Starter',
    description: 'Never handle flows manually again. Kickstart your next project with pre-configured authentication, UI components, and best practices baked in.',
    creator: '@harvide',
    images: [
      {
        url: 'https://www.harvide.com/logo/small-dark-white.svg',
        alt: 'Harvide Logo',
      },
    ],
  }
}

export default async function RootLayout({ children }: {
  children: React.ReactNode
}) {
  const navbar = (
    <Navbar
      logo={
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '1rem',
        }}>
          <Image
            src="https://www.harvide.com/logo/small-dark-white.svg"
            alt="Harvide Logo"
            width={30}
            height={30}
            priority
            style={{
              marginRight: '0.5rem',
              filter: 'brightness(0.2) grayscale',
              padding: '0.25rem',
              borderRadius: '0.25rem',
              border: '1px solid var(--border)',
              backgroundColor: '#fff',
            }}
          />
          <span>@harvide/starter</span>
        </div>
      }
      projectLink='https://github.com/harvide/starter'
      chatLink='https://discord.gg/jmm8PMCn9W'
    />
  )
  const pageMap = await getPageMap()
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head faviconGlyph="✦" />
      <body>
        <Layout
          // banner={<Banner storageKey="Starter Pro">Starter Pro is out!</Banner>}
          navbar={navbar}
          footer={<Footer>MIT {new Date().getFullYear()} © Harvide.</Footer>}
          editLink="Edit this page on GitHub"
          docsRepositoryBase="https://github.com/harvide/starter/blob/master/apps/docs"
          sidebar={{ defaultMenuCollapseLevel: 1 }}
          pageMap={pageMap}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}