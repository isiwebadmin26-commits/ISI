/**
 * Dynamic XML Sitemap & Robots Generator for ISI Security Website
 * Standard: Google Search Console / Sitemaps XML Protocol 0.9
 * Target: Vercel Production Deployment & Local Builds
 * 
 * Automatically detects:
 * 1. All static & core application routes from src/App.tsx
 * 2. Dynamic Service Categories from src/data/service-categories.ts
 * 3. Dynamic Industry Verticals from src/data/verticals-detail-data.ts
 * 4. Dynamic Blog Articles from src/data/blogs-data.ts and src/data/blogs/*.ts
 * 5. Accurate lastmod timestamps from source file modification times
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

export const BASE_URL = 'https://www.isisecurity.in';

// Helper to escape XML special characters
export function escapeXml(unsafe) {
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Format Date object to YYYY-MM-DD (W3C Datetime format)
export function formatDate(date) {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}

// Get file modification date or fallback to default
export function getFileDate(relPath, fallbackDate = new Date()) {
  try {
    const fullPath = path.join(rootDir, relPath);
    if (fs.existsSync(fullPath)) {
      return formatDate(fs.statSync(fullPath).mtime);
    }
  } catch (e) {
    // ignore
  }
  return formatDate(fallbackDate);
}

/**
 * Route metadata mapping: assigns SEO priority and change frequency
 */
export function getRouteMetadata(routePath) {
  if (routePath === '/') {
    return { priority: '1.0', changefreq: 'weekly' };
  }
  if (
    routePath === '/contact' ||
    routePath === '/academy' ||
    routePath === '/courses' ||
    routePath === '/services/security' ||
    routePath === '/services/integrated-facility-management'
  ) {
    return { priority: '0.9', changefreq: 'weekly' };
  }
  if (
    routePath.startsWith('/services/') ||
    routePath.startsWith('/verticals') ||
    routePath === '/about' ||
    routePath === '/career' ||
    routePath === '/blog' ||
    routePath === '/capabilities' ||
    routePath === '/offerings' ||
    routePath === '/schoolsafety' ||
    routePath === '/campussafety' ||
    routePath === '/modernliving' ||
    routePath === '/cashlogistics' ||
    routePath === '/securevaluelogistics' ||
    routePath === '/commandcenter' ||
    routePath === '/smartcity' ||
    routePath === '/masstransportation' ||
    routePath === '/traveltourism' ||
    routePath === '/gccitparks' ||
    routePath === '/eventmanagement'
  ) {
    return { priority: '0.8', changefreq: 'monthly' };
  }
  if (
    routePath.startsWith('/blog/') ||
    routePath === '/customers' ||
    routePath === '/partners' ||
    routePath.startsWith('/lp/')
  ) {
    return { priority: '0.7', changefreq: 'monthly' };
  }
  if (routePath === '/sitemap') {
    return { priority: '0.5', changefreq: 'monthly' };
  }
  if (
    routePath.includes('policy') ||
    routePath.includes('terms')
  ) {
    return { priority: '0.3', changefreq: 'yearly' };
  }
  return { priority: '0.6', changefreq: 'monthly' };
}

/**
 * Discover all blog article slugs from data files
 */
export function getBlogSlugs() {
  const blogDir = path.join(rootDir, 'src/data/blogs');
  const mainBlogsFile = path.join(rootDir, 'src/data/blogs-data.ts');
  const files = [mainBlogsFile];

  if (fs.existsSync(blogDir)) {
    const dirFiles = fs.readdirSync(blogDir).filter(f => f.endsWith('.ts') || f.endsWith('.js'));
    files.push(...dirFiles.map(f => path.join(blogDir, f)));
  }

  const slugs = new Map();
  files.forEach(file => {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      const matches = [...content.matchAll(/slug:\s*["']([^"']+)["']/g)];
      const fileDate = formatDate(fs.statSync(file).mtime);
      matches.forEach(m => {
        if (!slugs.has(m[1])) {
          slugs.set(m[1], fileDate);
        }
      });
    }
  });

  return slugs;
}

/**
 * Discover dynamic service categories
 */
export function getServiceCategories() {
  const file = path.join(rootDir, 'src/data/service-categories.ts');
  const categories = [];

  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    const fileDate = formatDate(fs.statSync(file).mtime);
    const matches = [...content.matchAll(/id:\s*["']([^"']+)["'],\s*type:\s*["']([^"']+)["']/g)];
    matches.forEach(m => {
      categories.push({
        path: `/services/${m[2]}/${m[1]}`,
        lastmod: fileDate
      });
    });
  }

  return categories;
}

/**
 * Discover primary industry vertical pages
 */
export function getVerticals() {
  const file = path.join(rootDir, 'src/data/verticals-detail-data.ts');
  const verticals = [];
  const primaryVerticalIds = ['logistics', 'hospitality', 'bfsi', 'education', 'manufacturing', 'drones'];
  const fileDate = fs.existsSync(file) ? formatDate(fs.statSync(file).mtime) : formatDate(new Date());

  primaryVerticalIds.forEach(id => {
    verticals.push({
      path: `/verticals/${id}`,
      lastmod: fileDate
    });
  });

  return verticals;
}

/**
 * Discover static and landing pages from src/App.tsx
 */
export function getAppRoutes() {
  const appFile = path.join(rootDir, 'src/App.tsx');
  const staticRoutes = [];

  // Always include home page
  staticRoutes.push({
    path: '/',
    lastmod: getFileDate('src/pages/Index.tsx')
  });

  if (!fs.existsSync(appFile)) {
    return staticRoutes;
  }

  const content = fs.readFileSync(appFile, 'utf8');

  // Map lazy imports to find component source files
  const lazyImports = new Map();
  const lazyMatches = [...content.matchAll(/const\s+(\w+)\s*=\s*lazyWithRetry\(\(\)\s*=>\s*import\(["']([^"']+)["']\)/g)];
  lazyMatches.forEach(m => {
    let importPath = m[2];
    if (importPath.startsWith('./')) {
      importPath = 'src/' + importPath.slice(2);
    }
    if (!importPath.endsWith('.tsx') && !importPath.endsWith('.ts')) {
      importPath += '.tsx';
    }
    lazyImports.set(m[1], importPath);
  });

  // Blacklist routes that should never appear in sitemap.xml
  const excludedPrefixes = ['/admin', '/analytics', '/404', '/api'];
  const excludedExact = [
    '/lp/facility-management/thank-you', // conversion thank you page (noindex)
    '/solutions',                        // redirect to /capabilities
    '/need-protection-money-properties-vip-escort-services' // spam 410 route
  ];

  const routeMatches = [...content.matchAll(/\{\s*path:\s*["']([^"']+)["'](?:,\s*element:\s*<([^>\s/]+))?/g)];

  routeMatches.forEach(m => {
    const p = m[1];
    const comp = m[2];

    // Exclude dynamic route patterns with ':' (handled separately)
    if (p.includes(':')) return;

    // Exclude exact matches and prefixes
    if (excludedExact.includes(p)) return;
    if (excludedPrefixes.some(prefix => p.startsWith(prefix))) return;

    // Exclude React Router redirects
    if (comp === 'Navigate') return;

    const compFile = lazyImports.get(comp) || `src/pages/${comp}.tsx`;
    staticRoutes.push({
      path: p,
      lastmod: getFileDate(compFile)
    });
  });

  return staticRoutes;
}

/**
 * Compile all routes into a sorted, deduplicated URL entry list
 */
export function getSitemapData() {
  const urlMap = new Map();

  // 1. Static and App Routes
  const appRoutes = getAppRoutes();
  appRoutes.forEach(r => {
    const meta = getRouteMetadata(r.path);
    urlMap.set(r.path, {
      loc: `${BASE_URL}${r.path === '/' ? '/' : r.path}`,
      lastmod: r.lastmod,
      changefreq: meta.changefreq,
      priority: meta.priority
    });
  });

  // 2. Service Category Routes
  const categories = getServiceCategories();
  categories.forEach(c => {
    const meta = getRouteMetadata(c.path);
    urlMap.set(c.path, {
      loc: `${BASE_URL}${c.path}`,
      lastmod: c.lastmod,
      changefreq: meta.changefreq,
      priority: meta.priority
    });
  });

  // 3. Vertical Routes
  const verticals = getVerticals();
  verticals.forEach(v => {
    const meta = getRouteMetadata(v.path);
    urlMap.set(v.path, {
      loc: `${BASE_URL}${v.path}`,
      lastmod: v.lastmod,
      changefreq: meta.changefreq,
      priority: meta.priority
    });
  });

  // 4. Blog Posts
  const blogs = getBlogSlugs();
  blogs.forEach((lastmod, slug) => {
    const p = `/blog/${slug}`;
    const meta = getRouteMetadata(p);
    urlMap.set(p, {
      loc: `${BASE_URL}${p}`,
      lastmod,
      changefreq: meta.changefreq,
      priority: meta.priority
    });
  });

  // Sort URLs by priority descending, then path ascending
  return Array.from(urlMap.values()).sort((a, b) => {
    const pDiff = parseFloat(b.priority) - parseFloat(a.priority);
    if (pDiff !== 0) return pDiff;
    return a.loc.localeCompare(b.loc);
  });
}

/**
 * Generate standard Google Search Console compliant sitemap XML
 */
export function generateSitemapXml() {
  const entries = getSitemapData();

  const xmlEntries = entries.map(item => `  <url>
    <loc>${escapeXml(item.loc)}</loc>
    <lastmod>${escapeXml(item.lastmod)}</lastmod>
    <changefreq>${escapeXml(item.changefreq)}</changefreq>
    <priority>${escapeXml(item.priority)}</priority>
  </url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlEntries}
</urlset>
`;
}

/**
 * Generate standard robots.txt content
 */
export function generateRobotsTxt() {
  return `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /

# Protected Admin & Internal Dashboards
Disallow: /admin
Disallow: /admin/
Disallow: /analytics
Disallow: /api/

# Private Conversion & Utility Pages
Disallow: /lp/facility-management/thank-you
Disallow: /need-protection-money-properties-vip-escort-services

# Host & Sitemap specification
Host: ${BASE_URL}
Sitemap: ${BASE_URL}/sitemap.xml
`;
}

/**
 * Execute generation and write files to public/ and dist/
 */
export function writeSitemapAndRobots() {
  console.log('🔍 Generating dynamic sitemap.xml and robots.txt...');

  const sitemapXml = generateSitemapXml();
  const robotsTxt = generateRobotsTxt();

  const publicDir = path.join(rootDir, 'public');
  const distDir = path.join(rootDir, 'dist');

  // Ensure public directory exists
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Write to public/
  const publicSitemap = path.join(publicDir, 'sitemap.xml');
  const publicRobots = path.join(publicDir, 'robots.txt');

  fs.writeFileSync(publicSitemap, sitemapXml, 'utf8');
  fs.writeFileSync(publicRobots, robotsTxt, 'utf8');
  console.log(`✅ Written ${publicSitemap}`);
  console.log(`✅ Written ${publicRobots}`);

  // Write to dist/ if it exists (for pre-built or post-build flows)
  if (fs.existsSync(distDir)) {
    const distSitemap = path.join(distDir, 'sitemap.xml');
    const distRobots = path.join(distDir, 'robots.txt');
    fs.writeFileSync(distSitemap, sitemapXml, 'utf8');
    fs.writeFileSync(distRobots, robotsTxt, 'utf8');
    console.log(`✅ Synchronized to ${distSitemap}`);
    console.log(`✅ Synchronized to ${distRobots}`);
  }

  const entries = getSitemapData();
  console.log(`🎉 Dynamic Sitemap generation complete! Total indexed URLs: ${entries.length}`);
}

// Run directly when executed via Node CLI
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)) {
  writeSitemapAndRobots();
}

