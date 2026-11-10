// api/sitemap.js - Vercel Serverless API Route for Dynamic Sitemap XML
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  try {
    // 1. Try reading the pre-generated sitemap from public or dist
    const possiblePaths = [
      path.join(process.cwd(), 'dist', 'sitemap.xml'),
      path.join(process.cwd(), 'public', 'sitemap.xml'),
      path.join(process.cwd(), 'sitemap.xml')
    ];

    let xml = null;
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        xml = fs.readFileSync(p, 'utf8');
        break;
      }
    }

    // 2. If not found on disk, dynamically generate using the generator
    if (!xml) {
      const { generateSitemapXml } = await import('../scripts/generate-sitemap.js');
      xml = generateSitemapXml();
    }

    // Set standard SEO XML headers
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=43200');
    return res.status(200).send(xml);
  } catch (error) {
    console.error('Error serving sitemap.xml:', error);
    return res.status(500).setHeader('Content-Type', 'text/plain').send('Error generating dynamic sitemap');
  }
}

