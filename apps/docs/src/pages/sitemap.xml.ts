import { getPageMap } from 'nextra/page-map'
import { NextApiResponse, NextApiRequest } from 'next'

//
// this needs to be loaded from a shared location
//
const BASE_URL = 'https://starter.harvide.com';

function generateSiteMap(pageMap: any) {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    function traverse(pageMap: any) {
        for (const page of pageMap) {
            if (page.kind === 'MdxPage') {
                xml += `
    <url>
        <loc>${BASE_URL}${page.route}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <priority>1.0</priority>
    </url>`;
            } else if (page.kind === 'Folder') {
                traverse(page.children);
            }
        }
    }

    traverse(pageMap);

    xml += `
</urlset>`;

    return xml;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const pageMap = await getPageMap()
    const sitemap = generateSiteMap(pageMap);

    res.setHeader('Content-Type', 'text/xml');
    res.write(sitemap);
    res.end();
}
