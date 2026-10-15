import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const workspaceDir = path.resolve(__dirname, '..');
const distDir = path.join(workspaceDir, 'dist');
const tarDir = path.join(workspaceDir, 'tar files');

if (!fs.existsSync(tarDir)) {
  fs.mkdirSync(tarDir, { recursive: true });
}

// Ensure .htaccess in public and dist match
const publicHtaccess = path.join(workspaceDir, 'public', '.htaccess');
const distHtaccess = path.join(distDir, '.htaccess');
const rootHtaccess = path.join(workspaceDir, '.htaccess');

if (fs.existsSync(publicHtaccess)) {
  const content = fs.readFileSync(publicHtaccess, 'utf8');
  fs.writeFileSync(distHtaccess, content, 'utf8');
  fs.writeFileSync(rootHtaccess, content, 'utf8');
  console.log('✓ Synchronized .htaccess across public, dist, and workspace root');
}

// Generate Date Stamp
const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, '0');
const dd = String(today.getDate()).padStart(2, '0');
const dateStr = `${yyyy}-${mm}-${dd}`;

const tarDistName = `dist_${dateStr}.tar`;
const tarDistPath = path.join(tarDir, tarDistName);

console.log(`📦 Packaging ${tarDistName} starting with 'dist/' prefix...`);
execSync(`tar -cf "${tarDistPath}" dist`, { cwd: workspaceDir, stdio: 'inherit' });

const stat = fs.statSync(tarDistPath);
console.log(`✅ Successfully created: ${tarDistName} (${(stat.size / 1024 / 1024).toFixed(2)} MB)`);

// Also create cPanel root package (extracts directly into public_html without nested 'dist/' folder)
const tarRootName = `ISI_public_html_${dateStr}.tar`;
const tarRootPath = path.join(tarDir, tarRootName);
console.log(`📦 Packaging ${tarRootName} (direct public_html extraction)...`);
execSync(`tar -C dist -cf "${tarRootPath}" .`, { cwd: workspaceDir, stdio: 'inherit' });
const rootStat = fs.statSync(tarRootPath);
console.log(`✅ Successfully created: ${tarRootName} (${(rootStat.size / 1024 / 1024).toFixed(2)} MB)`);
