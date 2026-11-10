// api/robots.js - Vercel Serverless API Route for Dynamic robots.txt
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  try {
    const possiblePaths = [
      path.join(process.cwd(), 'dist', 'robots.txt'),
      path.join(process.cwd(), 'public', 'robots.txt'),
      path.join(process.cwd(), 'robots.txt')
    ];

    let content = null;
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        content = fs.readFileSync(p, 'utf8');
        break;
      }
    }

    if (!content) {
      const { generateRobotsTxt } = await import('../scripts/generate-sitemap.js');
      content = generateRobotsTxt();
    }

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=43200');
    return res.status(200).send(content);
  } catch (error) {
    console.error('Error serving robots.txt:', error);
    return res.status(500).setHeader('Content-Type', 'text/plain').send('User-agent: *\nAllow: /\n');
  }
}

