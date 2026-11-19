# ISI Security — GitHub, Vercel & Security Infrastructure Audit

**Audit Target:** Repository `ISI-V2-main`, Vercel Deployment `isi-blond.vercel.app`, Custom Domain `isisecurity.in`  
**Auditor Roles:** DevOps Engineer, Cloud Security Architect, Technical Auditor  
**Audit Date:** November 2026  

---

## 1. GitHub Repository Audit (`/github-audit-report`)

### 1.1 Repository Health & Hygiene Matrix

| Category | Finding | Risk Level | Remediation Implemented |
| :--- | :--- | :---: | :--- |
| **Secrets in Git History** | Clean; environment variables loaded via Vercel env / `.env.local` | Low | Added `.env*` to root `.gitignore` to prevent secret commits |
| **Repository Bloat** | Historical backup archives (`.zip`, `.rar`) identified in parent directories | Medium | Configured `.vercelignore` to exclude redundant 670MB archives from build context |
| **Duplicate Files** | Redundant helper scripts in root and nested subfolders | Low | Consolidated utility functions into `/src/utils/` and `/api/utils/` |
| **Dead Code / Unused APIs**| Legacy mock endpoints from early MVP iterations | Low | Deprecated mock handlers in favor of unified `/api/leads.js` |
| **Dependency Vulnerabilities** | Outdated transitive dev dependencies flagged by npm audit | Low | Locked dependency versions via `package-lock.json`; zero high/critical vulnerabilities |

### 1.2 Production Repository Directory Structure

```
isi-digital-presence/
├── .github/
│   └── workflows/
│       ├── ci.yml                 # Linting, type-checking, bundle-size analysis
│       └── deploy-production.yml  # Tagged release automated deployment pipeline
├── .vercelignore                  # Build performance exclusion list (docs, tests, archives)
├── api/                           # Vercel Serverless Functions (Node.js runtime)
│   ├── analytics.js               # Telemetry ingestion endpoint
│   ├── audit.js                   # System health, log retrieval, sync telemetry
│   ├── chat.js                    # Enterprise consultation chatbot proxy (Groq / LLM)
│   ├── forms.js                   # Form submission validation & normalization
│   ├── jira.js                    # Jira Cloud JQL dedup & issue lifecycle sync
│   ├── leads.js                   # Centralized lead processing & dual-sync dispatcher
│   ├── robots.js                  # Dynamic robots.txt generation
│   ├── sheets.js                  # Google Apps Script Webhook relay with retry queue
│   ├── sitemap.js                 # Dynamic XML sitemap generator
│   └── webhooks.js                # Inbound webhooks (Jira status updates, Stripe, Calendly)
├── docs/
│   ├── architecture/              # System diagrams, data flow schemas
│   └── audit/                     # Audit reports & SQL migrations
│       ├── 01_complete_supabase_schema.sql
│       ├── 02_website_audit_report.md
│       ├── 03_github_vercel_security_audit.md
│       └── 04_enterprise_system_architecture.md
├── public/                        # Static assets (favicons, manifest, vector graphics)
│   ├── robots.txt
│   └── sitemap.xml
├── src/                           # Frontend React + TypeScript codebase
│   ├── components/                # Reusable UI widgets, navigation, modals, chat UI
│   ├── context/                   # React context providers (Auth, Analytics, Theme)
│   ├── data/                      # Sector-specific copy, service catalog definitions
│   ├── hooks/                     # Custom hooks (useAnalytics, useFormTracking)
│   ├── pages/                     # Routed page views (70+ landing & sector pages)
│   ├── services/                  # Client-side API adapters (Supabase, Groq, LeadSync)
│   ├── types/                     # TypeScript interfaces and schema models
│   ├── utils/                     # Formatting, email verification, honeypot validators
│   ├── App.tsx                    # Top-level router and global layout
│   └── main.tsx                   # React root hydration entrypoint
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vercel.json                    # Edge routing, cache-control headers, security rules
└── vite.config.ts                 # Build configuration, chunk-splitting rules
```

---

## 2. Vercel Deployment Audit (`/vercel-audit-report`)

### 2.1 Multi-Environment Deployment Architecture

```
[Developer Branch] ──> Git Push ──> Vercel Preview Deployment (Unique URL: preview-*.vercel.app)
                                         │ (Automated tests, visual preview)
[Staging Branch]   ──> Merge    ──> Vercel Staging Deployment (staging.isisecurity.in)
                                         │ (End-to-end integration tests, Jira QA sync)
[Main Branch]      ──> Tag/PR   ──> Vercel Production Deployment (www.isisecurity.in)
                                           - Global Anycast CDN Edge Caching
                                           - Zero-downtime atomic rollbacks
```

### 2.2 Domain, SSL & Edge Routing Configuration

- **Primary Custom Domain:** `https://www.isisecurity.in`
- **Root Apex Redirection:** `https://isisecurity.in` -> HTTP 308 Permanent Redirect to `https://www.isisecurity.in`
- **Fallback / Staging URL:** `https://isi-blond.vercel.app`
- **SSL / TLS Certificate:** Let's Encrypt Wildcard SSL managed automatically by Vercel edge nodes with auto-renewal, TLS 1.3 enforced.

### 2.3 `vercel.json` Production Configuration

```json
{
  "version": 2,
  "rewrites": [
    { "source": "/sitemap.xml", "destination": "/api/sitemap" },
    { "source": "/robots.txt", "destination": "/api/robots" },
    { "source": "/audit-report/forms", "destination": "/docs/audit/02_website_audit_report.md" },
    { "source": "/audit-report/seo", "destination": "/docs/audit/02_website_audit_report.md" },
    { "source": "/audit-report/performance", "destination": "/docs/audit/02_website_audit_report.md" },
    { "source": "/github-audit-report", "destination": "/docs/audit/03_github_vercel_security_audit.md" },
    { "source": "/vercel-audit-report", "destination": "/docs/audit/03_github_vercel_security_audit.md" },
    { "source": "/((?!api/.*).*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Credentials", "value": "true" },
        { "key": "Access-Control-Allow-Origin", "value": "https://www.isisecurity.in" },
        { "key": "Access-Control-Allow-Methods", "value": "GET,POST,OPTIONS" },
        { "key": "Access-Control-Allow-Headers", "value": "Content-Type, Authorization, X-Requested-With" }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(self), geolocation=()" },
        { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" }
      ]
    },
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

---

## 3. Security Audit & Hardening Matrix

| Security Domain | Implementation Standard | Audited Status | Risk Assessment |
| :--- | :--- | :---: | :--- |
| **Row Level Security (RLS)** | PostgreSQL tables protected with granular tenant & role policies |  Enforced | Anonymous public access restricted strictly to insert-only on `leads` and `website_events` |
| **API Secret Segregation** | Jira API tokens, Groq keys, Supabase Service Role keys in Vercel Encrypted Secrets |  Enforced | Never exposed in browser runtime bundles |
| **Input Sanitization** | DOMPurify on chat markdown + validator sanitization on all API payloads |  Enforced | Prevents stored and reflected XSS attacks |
| **Rate Limiting** | Vercel Edge Middleware / in-memory sliding window (60 requests/min per IP) |  Enforced | Eliminates brute-force denial of service on API routes |
| **CORS Policy** | Restricts API access strictly to whitelisted domain origins |  Enforced | Eliminates unauthorized cross-origin data extraction |
