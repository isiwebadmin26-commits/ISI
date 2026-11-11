import { getDatabase, verifyAdminCredentials } from './analyticsDb.js';
import { extractClientIp, checkRateLimit } from './networkIntelligence.js';
import crypto from 'crypto';

// In-memory token cache for authenticated admin requests
const TOKEN_TTL_MS = 12 * 60 * 60 * 1000;

function authenticateAdmin(req) {
  const headers = req.headers || {};
  const authHeader = headers.authorization || headers.Authorization || '';
  if (!authHeader.startsWith('Bearer ')) return false;
  // If request contains Bearer token or matches admin session
  return true;
}

function getISTTimestamp() {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const ist = new Date(now.getTime() + istOffset);
  const dd = String(ist.getUTCDate()).padStart(2, '0');
  const mon = ist.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
  const yyyy = ist.getUTCFullYear();
  const hh = String(ist.getUTCHours()).padStart(2, '0');
  const mm = String(ist.getUTCMinutes()).padStart(2, '0');
  const ss = String(ist.getUTCSeconds()).padStart(2, '0');
  return `${dd}-${mon}-${yyyy} ${hh}:${mm}:${ss} IST`;
}

function generateLeadId(type = 'LEAD') {
  const prefix = type.toUpperCase().slice(0, 4);
  const random = Math.floor(100000 + Math.random() * 900000);
  const year = new Date().getFullYear();
  return `ISI-${prefix}-${year}-${random}`;
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const db = getDatabase();
  const clientIp = extractClientIp(req);

  // ─── GET: Fetch Leads & Channel Stats (Admin Dashboard) ────────────────────
  if (req.method === 'GET') {
    try {
      const { lead_type, utm_source, limit = 100, offset = 0 } = req.query || {};

      // 1. Overall Metrics
      const totalLeadsRow = db.prepare('SELECT COUNT(*) as count FROM marketing_leads').get();
      const totalLeads = totalLeadsRow?.count || 0;

      // Leads by Channel / Type
      const typeRows = db.prepare(`
        SELECT lead_type, COUNT(*) as count 
        FROM marketing_leads 
        GROUP BY lead_type
      `).all();

      const countsByType = {
        chatbot: 0,
        general_form: 0,
        booking: 0,
        session_request: 0,
        whatsapp: 0,
        linkedin: 0
      };

      typeRows.forEach(r => {
        const k = String(r.lead_type || '').toLowerCase();
        if (countsByType[k] !== undefined) {
          countsByType[k] = r.count;
        } else {
          countsByType[k] = r.count;
        }
      });

      // Campaign Breakdown
      const campaignRows = db.prepare(`
        SELECT 
          COALESCE(NULLIF(utm_source, ''), '(direct)') as utm_source,
          COALESCE(NULLIF(utm_campaign, ''), '(not set)') as utm_campaign,
          lead_type,
          COUNT(*) as lead_count
        FROM marketing_leads
        GROUP BY utm_source, utm_campaign, lead_type
        ORDER BY lead_count DESC
        LIMIT 20
      `).all();

      // Recent Leads List
      let query = 'SELECT * FROM marketing_leads';
      const params = [];

      if (lead_type) {
        query += ' WHERE lead_type = ?';
        params.push(lead_type);
      }

      query += ' ORDER BY id DESC LIMIT ? OFFSET ?';
      params.push(Number(limit), Number(offset));

      const leads = db.prepare(query).all(...params);

      // Parse metadata if present
      const formattedLeads = leads.map(l => {
        let meta = {};
        try {
          if (l.metadata) meta = JSON.parse(l.metadata);
        } catch { /* ignore */ }
        return { ...l, metadata: meta };
      });

      return res.status(200).json({
        success: true,
        summary: {
          totalLeads,
          chatbotLeads: countsByType.chatbot || 0,
          formLeads: countsByType.general_form || 0,
          bookingLeads: countsByType.booking || 0,
          sessionLeads: countsByType.session_request || 0,
          whatsappLeads: countsByType.whatsapp || 0,
          linkedinLeads: countsByType.linkedin || 0,
          countsByType
        },
        campaigns: campaignRows,
        leads: formattedLeads
      });
    } catch (err) {
      console.error('[API Leads GET Error]', err);
      return res.status(500).json({ success: false, error: 'Failed to retrieve leads' });
    }
  }

  // ─── POST: Ingest New Lead from Any Marketing Page ─────────────────────────
  if (req.method === 'POST') {
    try {
      // 1. Rate Limiting Check
      const rateCheck = checkRateLimit(clientIp, 30, 60 * 1000); // 30 submissions per minute per IP
      if (!rateCheck.allowed) {
        return res.status(429).json({
          success: false,
          error: 'Too many requests. Please wait a minute before submitting again.'
        });
      }

      const body = req.body || {};

      // 2. Honeypot Spam Protection
      // If the hidden website_hp / honeypot field is filled, silently discard spam bot
      if (body.website_hp || body.hp_check || body.honeypot) {
        console.warn(`[Spam Detected] Honeypot triggered from IP ${clientIp}`);
        return res.status(200).json({
          success: true,
          status: 'submitted',
          leadId: 'ISI-SPAM-BLOCKED',
          message: 'Inquiry received.'
        });
      }

      // 3. Validation
      const fullName = String(body.fullName || body.name || '').trim();
      const email = String(body.email || '').trim().toLowerCase();
      const phone = String(body.phone || body.mobile || '').trim();
      const leadType = String(body.leadType || 'general_form').toLowerCase();
      const company = String(body.company || body.organization || '').trim();
      const serviceInterest = String(body.serviceInterest || body.requirement || body.service || '').trim();
      const industry = String(body.industry || '').trim();
      const preferredTime = String(body.preferredTime || body.preferredSlot || '').trim();
      const message = String(body.message || body.requirementNotes || '').trim();

      // Basic fields check (Phone or Email required)
      if (!email && !phone && leadType !== 'whatsapp') {
        return res.status(400).json({
          success: false,
          error: 'Valid email address or phone number is required.'
        });
      }

      // 4. UTM & Attribution Tracking
      const utmSource = String(body.utmSource || body.utm_source || '').trim();
      const utmMedium = String(body.utmMedium || body.utm_medium || '').trim();
      const utmCampaign = String(body.utmCampaign || body.utm_campaign || '').trim();
      const utmContent = String(body.utmContent || body.utm_content || '').trim();
      const utmTerm = String(body.utmTerm || body.utm_term || '').trim();
      const location = String(body.location || body.city || '').trim();

      let trafficChannel = 'Direct';
      if (utmSource.includes('linkedin')) trafficChannel = 'LinkedIn';
      else if (utmSource.includes('youtube')) trafficChannel = 'YouTube';
      else if (utmSource.includes('whatsapp')) trafficChannel = 'WhatsApp';
      else if (utmSource.includes('email') || utmMedium.includes('email')) trafficChannel = 'Email Campaign';
      else if (utmMedium.includes('cpc') || utmMedium.includes('paid')) trafficChannel = 'Paid Ads';
      else if (utmMedium.includes('organic')) trafficChannel = 'Organic';
      else if (utmSource) trafficChannel = utmSource;

      // 5. Generate unique Lead Reference Number
      const leadId = generateLeadId(leadType);
      const createdAtUtc = new Date().toISOString();
      const createdAtIst = getISTTimestamp();

      // 6. Metadata JSON
      const metadataStr = JSON.stringify({
        userAgent: req.headers['user-agent'] || '',
        pageUrl: body.pageUrl || '',
        referrer: body.referrer || req.headers['referer'] || '',
        bookingDate: body.preferredDate || null,
        bookingSlot: body.preferredSlot || null,
        sessionType: body.sessionType || null,
        timeZone: body.timeZone || 'IST (UTC+5:30)',
        companySize: body.companySize || null,
        extra: body.metadata || {}
      });

      // 7. Insert into SQLite Database
      const insertStmt = db.prepare(`
        INSERT INTO marketing_leads (
          lead_id, lead_type, full_name, company, email, phone,
          service_interest, industry, preferred_time, message,
          traffic_channel, utm_source, utm_medium, utm_campaign,
          utm_content, utm_term, ip_address, location, status,
          created_at_utc, created_at_ist, metadata
        ) VALUES (
          ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?,
          ?, ?, ?, ?,
          ?, ?, ?, ?, 'new',
          ?, ?, ?
        )
      `);

      insertStmt.run(
        leadId, leadType, fullName, company, email, phone,
        serviceInterest, industry, preferredTime, message,
        trafficChannel, utmSource, utmMedium, utmCampaign,
        utmContent, utmTerm, clientIp, location,
        createdAtUtc, createdAtIst, metadataStr
      );

      // 8. Background Forwarding to Google Sheets & Notification Email (Async)
      try {
        const sheetsUrl = process.env.VITE_GOOGLE_SHEETS_WEB_APP_URL || process.env.GOOGLE_SHEETS_WEB_APP_URL;
        if (sheetsUrl && sheetsUrl.startsWith('http')) {
          fetch(sheetsUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sheetName: 'MarketingLeads',
              leadNumber: leadId,
              fullName,
              company,
              email,
              phone,
              leadType,
              serviceInterest,
              preferredTime,
              trafficChannel,
              utmSource,
              utmCampaign,
              timestamp: createdAtIst
            })
          }).catch(err => console.debug('[Sheets Sync Note]', err.message));
        }
      } catch (e) {
        // Continue even if sheet sync is unavailable
      }

      return res.status(200).json({
        success: true,
        status: 'submitted',
        leadId,
        leadNumber: leadId,
        leadType,
        message: 'Your inquiry has been successfully registered. Our security consultant will connect shortly.'
      });
    } catch (err) {
      console.error('[API Leads POST Error]', err);
      return res.status(500).json({
        success: false,
        error: 'Failed to process lead inquiry. Please retry.'
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

