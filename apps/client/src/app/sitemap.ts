import { MetadataRoute } from 'next';
import config from '../../../../starter.config';

export default function sitemap(): MetadataRoute.Sitemap {
    if (!config.seo?.sitemap?.enabled) {
        return [];
    }

    const baseUrl = config.seo.sitemap.baseUrl || config.branding.url;

    const sitemapEntries: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 1,
        },
    ];

    // You can add more dynamic routes here based on your application's pages or data.
    // For example, if you have a blog, you might fetch blog post slugs from a database
    // and add them as sitemap entries.
    //
    // See https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap#generating-a-sitemap-using-code-js-ts
    //
    // Example:
    // const posts = await getBlogPostsFromDatabase();
    // posts.forEach(post => {
    //   sitemapEntries.push({
    //     url: `${baseUrl}/blog/${post.slug}`,
    //     lastModified: new Date(post.updatedAt),
    //     changeFrequency: 'weekly',
    //     priority: 0.7,
    //   });
    // });

    return sitemapEntries;
}
