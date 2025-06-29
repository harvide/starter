import { MetadataRoute } from 'next';
import config from '../../../../starter.config';

export default function robots(): MetadataRoute.Robots {
    const { url } = config.branding;
    const sitemapUrl = `${url}/sitemap.xml`;

    return {
        rules: config.seo.robots.rules,
        sitemap: sitemapUrl,
    };
}
