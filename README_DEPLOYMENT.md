# ISI V2 Production Deployment Guide & Documentation
**Package Archive:** `ISIV2-119-10-2026.tar`  
**Generated Date:** 2026-10-19  
**Application Target:** ISI V2 (Industrial Security Integrated)  
**Production URL:** https://isi-v2.vercel.app/  

---

## 1. Overview & Contents of this Archive

This deployment archive contains the production-ready distribution and deployment configurations for ISI V2.

### Archive Manifest
- `dist/`: High-performance production build generated via Vite, TypeScript, and PostCSS. Includes:
  - Optimized HTML5 entry point (`dist/index.html`)
  - Minified CSS bundles with responsive scrollbar hiding utilities (`dist/assets/index-*.css`)
  - Split and code-split JS bundles (`react-core`, `leaflet-vendor`, `recharts-vendor`, individual page chunks)
  - Pre-compressed Brotli (`.br`) and Gzip (`.gz`) assets for ultra-fast CDN loading
  - Production `.htaccess` pre-configured with SPA routing, cache expiration policies, and security headers
- `vercel.json`: Vercel routing rules supporting SPA fallback (`/(.*) -> /index.html`) and `/api/(.*)` serverless functions.
- `api/`: Serverless Node.js endpoints (Jira lead capture, Analytics tracking, Corporate email, Network intelligence).
- `.htaccess`: Apache/cPanel root configuration with URL rewriting, 301 canonical redirects, and mime types.
- `README.md`: Deployment instructions, environment variables, and quality audit details.

---

## 2. Environment Variables & Configuration

> **Security Notice:** Do NOT commit `.env` or `.env.local` files containing live API credentials to public repositories or client-accessible locations.

Configure the following variables in your hosting environment (e.g., Vercel Project Settings > Environment Variables, or server environment):

| Variable Name | Required | Description | Example / Target |
|---|---|---|---|
| `VITE_JIRA_URL` | Optional | Atlassian Jira Cloud instance domain | `https://your-domain.atlassian.net` |
| `VITE_JIRA_PROJECT_KEY` | Optional | Jira Project Key for security issues/leads | `ISI` |
| `VITE_JIRA_ISSUE_TYPE` | Optional | Default Jira Issue Type | `Task` |
| `JIRA_API_TOKEN` | Server-only | Atlassian API Token (used in `/api/jira.js`) | `* * *` |
| `JIRA_USER_EMAIL` | Server-only | Atlassian service account email | `devops@isi.example` |
| `GOOGLE_SHEET_WEBHOOK_URL`| Optional | Google Apps Script Webhook for CRM sync | `https://script.google.com/macros/s/.../exec` |
| `SMTP_HOST` | Server-only | Mail transfer agent for corporate email | `smtp.gmail.com` |
| `SMTP_USER` | Server-only | SMTP authentication username | `notifications@isi.example` |
| `SMTP_PASS` | Server-only | SMTP authentication application password | `* * *` |

---

## 3. Hosting & Deployment Instructions

### A. Vercel Deployment (Recommended)
1. Extract or clone this repository to your Vercel project or run:
   ```bash
   vercel --prod
   ```
2. Ensure Build Settings are configured:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build` (or deploy pre-built `dist`)
   - **Output Directory:** `dist`
3. Verify that `vercel.json` rewrite rules are present in the project root.

### B. cPanel / Apache Deployment
1. Upload the files inside `dist/` directly into your cPanel `public_html/` root (or extract `ISI_public_html_*.tar`).
2. Ensure `.htaccess` is uploaded to `public_html/` (enable "Show Hidden Files" in cPanel File Manager).
3. Confirm Apache modules `mod_rewrite`, `mod_headers`, and `mod_mime` are enabled.
4. Test direct navigation to `/courses`, `/academy`, `/services/security`, `/contact` to confirm SPA fallback works without 404 errors.

### C. Node.js / Express Deployment
If serving through the included Node.js server:
```bash
npm install --production
node server.js
```
The server binds to port `process.env.PORT || 5000` and automatically serves `dist/` with SPA fallback.

---

## 4. Key Updates Implemented in this Release

### 1. Academy Course Benefits & Systematic Architecture
- **C-DAC MEPZ Technology Courses (`/courses`):**
  - Updated all 9 flagship programs (AI & Deep Learning, Cyber Security & SOC, IoT & Embedded Systems, Automotive Cyber & EV Security, HPC & Cloud Architectures, Robotics & Industrial Automation, Quantum Computing, Master Trainer, and IEEE BLP).
  - Implemented 7 systematic dimensions per course: `benefits`, `learningOutcomes`, `skillsAcquired`, `practicalApplications`, `careerRelevance`, `intendedAudience`, and `prerequisites`.
  - Added interactive "Dedicated Course Benefits & Outcomes Directory" with multi-column outcome cards and quick-switch tabs.
- **ISI Academy Track Programs (`/academy`):**
  - Comprehensive catalog covering Guarding & Security Operations (18 courses), Facility Management (7 courses), and Technology & Cyber (10 courses).
  - Added dedicated benefits matrices and interactive modal views detailing syllabus, lab infrastructure, target career roles, and prerequisites.
  - Zero fabricated certifications or guarantees: fully aligned with real-world industry standards and existing institutional capabilities.

### 2. Complete Removal of Horizontal Scrollbar (Visual Bug Fix)
- Root Cause: TrustBar badges container had `overflow-x-auto` without properly active scrollbar hiding styles in standard Windows Chromium/Edge browsers.
- Solution:
  - Enabled `@tailwind-scrollbar-hide` in `tailwind.config.ts`.
  - Defined explicit `.scrollbar-hide` and `.no-scrollbar` cross-browser rules in `src/index.css` covering `scrollbar-width: none`, `-ms-overflow-style: none`, and `::-webkit-scrollbar { display: none; }`.
  - Upgraded `TrustBar.tsx` layout to responsive flex-wrap on desktop and hidden scrollbar with touch dragging on mobile viewports.

### 3. Code Audit & Fixes
- Removed duplicate JavaScript function declaration `sanitizeEmailContent` in `AdCampaign_AppsScript.js`.
- Verified TypeScript compilation: `npx tsc --noEmit` passed with 0 errors.
- Verified ESLint rules: `npm run lint` passed with 0 errors.
- Verified production build: `npm run build` succeeded with clean output and Brotli asset compression.

---

## 5. Verification & Quality Audit Results

- **Lint Status:** Passed (0 errors, 0 warnings)
- **TypeCheck Status:** Passed (0 errors)
- **Build Status:** Passed (Exit code 0, all chunks emitted)
- **Archive File:** `ISIV2-119-10-2026.tar`
- **Integrity Validation:** Archive created with tar, validated with tar listing and clean test extraction.
