import { config } from '@repo/config';
import type { MetadataRoute } from 'next';
import { getPageMap } from 'nextra/page-map';

function transformPageMapToSitemap(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pageMap: any,
  baseUrl: string
): MetadataRoute.Sitemap {
  const sitemapEntries: MetadataRoute.Sitemap = [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function traverse(pages: any) {
    for (const page of pages) {
      if (page.kind === 'MdxPage') {
        sitemapEntries.push({
          url: `${baseUrl}${page.route}`,
          lastModified: new Date().toISOString(),
          changeFrequency: 'yearly', // Adjust as needed
          priority: 1.0, // Adjust as needed
        });
      } else if (page.kind === 'Folder') {
        traverse(page.children);
      }
    }
  }

  traverse(pageMap);
  return sitemapEntries;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!config.seo?.sitemap?.enabled) {
    return [];
  }

  const baseUrl = config.seo.sitemap.baseUrl || config.branding.url;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pageMap: any = await getPageMap();

  return transformPageMapToSitemap(pageMap, baseUrl);
}
