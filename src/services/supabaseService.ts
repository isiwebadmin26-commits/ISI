// src/services/supabaseService.ts
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
  (typeof process !== 'undefined' && (process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL)) ||
  'https://ibauhbpcmycaygybyskn.supabase.co';

const SUPABASE_ANON_KEY = 
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
  (typeof process !== 'undefined' && (process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY)) ||
  'sb_publishable_tAmLXDptFV_i51JOFl9Qbw_3LnVNo-N';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false
  }
});

export interface SupabaseLeadPayload {
  leadNumber?: string;
  leadType?: string;
  formType?: string;
  fullName?: string;
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  designation?: string;
  serviceInterest?: string;
  serviceRequested?: string;
  requirement?: string;
  preferredTime?: string;
  message?: string;
  status?: string;
  submissionStatus?: string;
  jiraKey?: string;
  jiraStatus?: string;
  trafficChannel?: string;
  source?: string;
  variant?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  ipAddress?: string;
  location?: string;
  pageUrl?: string;
  metadata?: Record<string, unknown>;
  createdAtIst?: string;
  timestamp?: string;
  [key: string]: unknown;
}

export interface SupabaseCareerPayload {
  applicationNumber?: string;
  fullName?: string;
  name?: string;
  email?: string;
  phone?: string;
  position?: string;
  experience?: string;
  location?: string;
  resumeUrl?: string;
  coverLetter?: string;
  status?: string;
  utmSource?: string;
  createdAtIst?: string;
  [key: string]: unknown;
}

export interface SupabaseChatbotPayload {
  name?: string;
  email?: string;
  phone?: string;
  existingCustomer?: string;
  category?: string;
  message?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  status?: string;
  ipLocation?: string;
  ipAddress?: string;
  organization?: string;
  variant?: string;
  createdAtIst?: string;
  [key: string]: unknown;
}

export interface SupabaseSessionPayload {
  sessionId: string;
  visitorId?: string;
  startedUtc?: string;
  endedUtc?: string;
  durationSec?: number;
  pageViews?: number;
  entryPage?: string;
  exitPage?: string;
  trafficSource?: string;
  trafficChannel?: string;
  campaign?: string;
  device?: string;
  browser?: string;
  os?: string;
  country?: string;
  regionState?: string;
  city?: string;
  returningUser?: boolean;
  isBounce?: boolean;
  isConverted?: boolean;
  leadNumber?: string;
  leadType?: string;
  createdAtIst?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. MASTER LEADS TABLE (Dual-Sync for cross-form analytics)
// ─────────────────────────────────────────────────────────────────────────────
export async function captureLeadInSupabase(lead: SupabaseLeadPayload): Promise<{ success: boolean; data?: unknown; error?: unknown }> {
  try {
    const record = {
      lead_number: lead.leadNumber || lead.LeadNumber || null,
      lead_type: String(lead.leadType || lead.formType || 'lead').toLowerCase(),
      form_type: lead.formType || lead.formName || 'Lead Form',
      full_name: lead.fullName || lead.name || 'Prospective Client',
      company: lead.company || lead.organization || 'N/A',
      email: lead.email || lead.workEmail || 'N/A',
      phone: lead.phone || lead.phoneNumber || 'N/A',
      designation: lead.designation || null,
      service_interest: lead.serviceInterest || lead.serviceRequested || lead.requirement || 'Security Services',
      requirement: lead.requirement || lead.serviceInterest || lead.serviceRequested || null,
      preferred_time: lead.preferredTime || lead.preferredSlot || null,
      message: lead.message || null,
      status: lead.status || 'new',
      submission_status: lead.submissionStatus || 'Submitted',
      jira_key: lead.jiraKey || null,
      jira_status: lead.jiraStatus || null,
      traffic_channel: lead.trafficChannel || lead.source || 'Direct',
      source: lead.source || lead.trafficChannel || null,
      variant: lead.variant || 'original',
      utm_source: lead.utmSource || lead.utm_source || null,
      utm_medium: lead.utmMedium || lead.utm_medium || null,
      utm_campaign: lead.utmCampaign || lead.utm_campaign || null,
      utm_content: lead.utmContent || lead.utm_content || null,
      utm_term: lead.utmTerm || lead.utm_term || null,
      ip_address: lead.ipAddress || null,
      location: lead.location || null,
      page_url: lead.pageUrl || null,
      metadata: lead.metadata || {},
      created_at_ist: lead.createdAtIst || lead.timestamp || null
    };

    const { data, error } = await supabase
      .from('leads')
      .insert([record])
      .select();

    if (error) {
      console.warn('[SUPABASE MASTER LEADS NOTICE]', error.message);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err: any) {
    console.warn('[SUPABASE MASTER LEADS EXCEPTION]', err?.message || err);
    return { success: false, error: err };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONTACT_FORM TABLE (1:1 with Contact_Form Google Sheet tab)
// ─────────────────────────────────────────────────────────────────────────────
export async function captureContactFormInSupabase(p: Record<string, any>) {
  try {
    const record = {
      lead_number: p.lead_number || p.leadNumber || null,
      name: p.name || p.fullName || 'Contact Inquiry',
      email: p.email || p.workEmail || 'N/A',
      phone: p.phone || p.phoneNumber || 'N/A',
      requirement: p.requirement || p.service || p.serviceInterest || null,
      company: p.company || p.organization || null,
      designation: p.designation || null,
      message: p.message || null,
      source: p.source || p.trafficChannel || null,
      utm_source: p.utm_source || p.utmSource || null,
      utm_medium: p.utm_medium || p.utmMedium || null,
      utm_campaign: p.utm_campaign || p.utmCampaign || null,
      utm_term: p.utm_term || p.utmTerm || null,
      utm_content: p.utm_content || p.utmContent || null,
      jira_issue_key: p.jira_issue_key || p.jiraKey || null,
      jira_status: p.jira_status || p.jiraStatus || null,
      status: p.status || 'Submitted',
      ip_location: p.ip_location || p.location || null,
      ip_address: p.ip_address || p.ipAddress || null,
      variant: p.variant || 'original',
      timestamp: p.timestamp || p.createdAtIst || null
    };

    const { data, error } = await supabase.from('contact_form').insert([record]).select();
    if (error) console.warn('[SUPABASE CONTACT_FORM NOTICE]', error.message);
    return { success: !error, data, error };
  } catch (err: any) {
    console.warn('[SUPABASE CONTACT_FORM EXCEPTION]', err?.message || err);
    return { success: false, error: err };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. GLOBAL_LEAD_FORM TABLE (1:1 with Global_Lead_Form Google Sheet tab)
// ─────────────────────────────────────────────────────────────────────────────
export async function captureGlobalLeadFormInSupabase(p: Record<string, any>) {
  try {
    const record = {
      lead_number: p.lead_number || p.leadNumber || null,
      name: p.name || p.fullName || 'Lead',
      email: p.email || p.workEmail || 'N/A',
      phone: p.phone || p.phoneNumber || 'N/A',
      requirement: p.requirement || p.service || p.serviceInterest || null,
      company: p.company || p.organization || null,
      page: p.page || p.pageUrl || null,
      source: p.source || p.trafficChannel || null,
      utm_source: p.utm_source || p.utmSource || null,
      utm_medium: p.utm_medium || p.utmMedium || null,
      utm_campaign: p.utm_campaign || p.utmCampaign || null,
      utm_term: p.utm_term || p.utmTerm || null,
      utm_content: p.utm_content || p.utmContent || null,
      jira_issue_key: p.jira_issue_key || p.jiraKey || null,
      jira_status: p.jira_status || p.jiraStatus || null,
      timestamp: p.timestamp || p.createdAtIst || null,
      ip_location: p.ip_location || p.location || null,
      ip_address: p.ip_address || p.ipAddress || null
    };

    const { data, error } = await supabase.from('global_lead_form').insert([record]).select();
    if (error) console.warn('[SUPABASE GLOBAL_LEAD_FORM NOTICE]', error.message);
    return { success: !error, data, error };
  } catch (err: any) {
    console.warn('[SUPABASE GLOBAL_LEAD_FORM EXCEPTION]', err?.message || err);
    return { success: false, error: err };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. SALES_INQUIRIES TABLE (1:1 with Sales_Inquiries Google Sheet tab)
// ─────────────────────────────────────────────────────────────────────────────
export async function captureSalesInquiriesInSupabase(p: Record<string, any>) {
  try {
    const record = {
      lead_number: p.lead_number || p.leadNumber || null,
      full_name: p.full_name || p.fullName || p.name || 'Sales Prospect',
      phone_number: p.phone_number || p.phone || p.phoneNumber || 'N/A',
      work_email: p.work_email || p.email || p.workEmail || 'N/A',
      company_name: p.company_name || p.company || p.organization || 'N/A',
      service_interest: p.service_interest || p.service || p.requirement || 'Security Services',
      utm_source: p.utm_source || p.utmSource || null,
      utm_medium: p.utm_medium || p.utmMedium || null,
      utm_campaign: p.utm_campaign || p.utmCampaign || null,
      utm_term: p.utm_term || p.utmTerm || null,
      utm_content: p.utm_content || p.utmContent || null,
      jira_issue_key: p.jira_issue_key || p.jiraKey || null,
      jira_status: p.jira_status || p.jiraStatus || null,
      ip_location: p.ip_location || p.location || null,
      ip_address: p.ip_address || p.ipAddress || null,
      variant: p.variant || 'original',
      timestamp: p.timestamp || p.createdAtIst || null
    };

    const { data, error } = await supabase.from('sales_inquiries').insert([record]).select();
    if (error) console.warn('[SUPABASE SALES_INQUIRIES NOTICE]', error.message);
    return { success: !error, data, error };
  } catch (err: any) {
    console.warn('[SUPABASE SALES_INQUIRIES EXCEPTION]', err?.message || err);
    return { success: false, error: err };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. GOOGLE_AD_LEADS TABLE (1:1 with Google_Ad_Leads Google Sheet tab)
// ─────────────────────────────────────────────────────────────────────────────
export async function captureGoogleAdLeadInSupabase(p: Record<string, any>) {
  try {
    const record = {
      lead_number: p.lead_number || p.leadNumber || null,
      full_name: p.full_name || p.fullName || p.name || 'Ad Prospect',
      phone_number: p.phone_number || p.phone || p.phoneNumber || 'N/A',
      work_email: p.work_email || p.email || p.workEmail || 'N/A',
      company_name: p.company_name || p.company || p.organization || 'N/A',
      utm_source: p.utm_source || p.utmSource || 'google_ads',
      utm_medium: p.utm_medium || p.utmMedium || 'cpc',
      utm_campaign: p.utm_campaign || p.utmCampaign || null,
      utm_term: p.utm_term || p.utmTerm || null,
      utm_content: p.utm_content || p.utmContent || null,
      jira_issue_key: p.jira_issue_key || p.jiraKey || null,
      jira_status: p.jira_status || p.jiraStatus || null,
      ip_location: p.ip_location || p.location || null,
      ip_address: p.ip_address || p.ipAddress || null,
      organization: p.organization || p.company || null,
      variant: p.variant || 'original',
      timestamp: p.timestamp || p.createdAtIst || null
    };

    const { data, error } = await supabase.from('google_ad_leads').insert([record]).select();
    if (error) console.warn('[SUPABASE GOOGLE_AD_LEADS NOTICE]', error.message);
    return { success: !error, data, error };
  } catch (err: any) {
    console.warn('[SUPABASE GOOGLE_AD_LEADS EXCEPTION]', err?.message || err);
    return { success: false, error: err };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. CONSULTATION_REQUESTS TABLE (1:1 with Consultation_Requests Google Sheet tab)
// ─────────────────────────────────────────────────────────────────────────────
export async function captureConsultationRequestInSupabase(p: Record<string, any>) {
  try {
    const record = {
      lead_number: p.lead_number || p.leadNumber || null,
      name: p.name || p.fullName || 'Consultation Request',
      school_name: p.school_name || p.schoolName || p.company || p.organization || null,
      board: p.board || null,
      number_of_students: p.number_of_students || p.numberOfStudents || null,
      primary_concern: p.primary_concern || p.primaryConcern || p.message || p.requirement || null,
      email: p.email || p.workEmail || 'N/A',
      phone: p.phone || p.phoneNumber || 'N/A',
      city: p.city || p.location || null,
      utm_source: p.utm_source || p.utmSource || null,
      utm_medium: p.utm_medium || p.utmMedium || null,
      utm_campaign: p.utm_campaign || p.utmCampaign || null,
      utm_term: p.utm_term || p.utmTerm || null,
      utm_content: p.utm_content || p.utmContent || null,
      jira_issue_key: p.jira_issue_key || p.jiraKey || null,
      jira_status: p.jira_status || p.jiraStatus || null,
      status: p.status || 'Submitted',
      ip_location: p.ip_location || p.location || null,
      ip_address: p.ip_address || p.ipAddress || null,
      variant: p.variant || 'original',
      timestamp: p.timestamp || p.createdAtIst || null
    };

    const { data, error } = await supabase.from('consultation_requests').insert([record]).select();
    if (error) console.warn('[SUPABASE CONSULTATION_REQUESTS NOTICE]', error.message);
    return { success: !error, data, error };
  } catch (err: any) {
    console.warn('[SUPABASE CONSULTATION_REQUESTS EXCEPTION]', err?.message || err);
    return { success: false, error: err };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. TENDER_RFQ TABLE (1:1 with Tender_RFQ Google Sheet tab)
// ─────────────────────────────────────────────────────────────────────────────
export async function captureTenderRfqInSupabase(p: Record<string, any>) {
  try {
    const record = {
      lead_number: p.lead_number || p.leadNumber || null,
      name: p.name || p.fullName || 'Tender Submitter',
      email: p.email || p.workEmail || 'N/A',
      phone: p.phone || p.phoneNumber || 'N/A',
      organization: p.organization || p.company || 'N/A',
      tender_scope: p.tender_scope || p.tenderScope || p.service || p.requirement || null,
      budget: p.budget || null,
      deadline: p.deadline || null,
      message: p.message || null,
      utm_source: p.utm_source || p.utmSource || null,
      utm_medium: p.utm_medium || p.utmMedium || null,
      utm_campaign: p.utm_campaign || p.utmCampaign || null,
      utm_term: p.utm_term || p.utmTerm || null,
      utm_content: p.utm_content || p.utmContent || null,
      jira_issue_key: p.jira_issue_key || p.jiraKey || null,
      jira_status: p.jira_status || p.jiraStatus || null,
      status: p.status || 'Submitted',
      ip_location: p.ip_location || p.location || null,
      ip_address: p.ip_address || p.ipAddress || null,
      variant: p.variant || 'original',
      timestamp: p.timestamp || p.createdAtIst || null
    };

    const { data, error } = await supabase.from('tender_rfq').insert([record]).select();
    if (error) console.warn('[SUPABASE TENDER_RFQ NOTICE]', error.message);
    return { success: !error, data, error };
  } catch (err: any) {
    console.warn('[SUPABASE TENDER_RFQ EXCEPTION]', err?.message || err);
    return { success: false, error: err };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. CAREER_APPLICATIONS TABLE (1:1 with Career_Applications Google Sheet tab)
// ─────────────────────────────────────────────────────────────────────────────
export async function captureCareerInSupabase(app: SupabaseCareerPayload): Promise<{ success: boolean; data?: unknown; error?: unknown }> {
  try {
    const record = {
      application_number: app.applicationNumber || null,
      full_name: app.fullName || app.name || 'Applicant',
      email: app.email || 'N/A',
      phone: app.phone || 'N/A',
      position: app.position || 'Open Role',
      experience: app.experience || 'Not specified',
      location: app.location || 'Pan-India',
      resume_url: app.resumeUrl || null,
      cover_letter: app.coverLetter || null,
      status: app.status || 'Submitted',
      utm_source: app.utmSource || null,
      created_at_ist: app.createdAtIst || null
    };

    const { data, error } = await supabase
      .from('career_applications')
      .insert([record])
      .select();

    if (error) {
      console.warn('[SUPABASE CAREER NOTICE]', error.message);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err: any) {
    console.warn('[SUPABASE CAREER EXCEPTION]', err?.message || err);
    return { success: false, error: err };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. CHATBOT_LEADS TABLE (1:1 with Chatbot_Leads Google Sheet tab)
// ─────────────────────────────────────────────────────────────────────────────
export async function captureChatbotInSupabase(chat: SupabaseChatbotPayload): Promise<{ success: boolean; data?: unknown; error?: unknown }> {
  try {
    const record = {
      name: chat.name || 'Website Visitor',
      email: chat.email || 'N/A',
      phone: chat.phone || 'N/A',
      existing_customer: chat.existingCustomer || 'No',
      category: chat.category || 'General',
      message: chat.message || null,
      utm_source: chat.utmSource || null,
      utm_medium: chat.utmMedium || null,
      utm_campaign: chat.utmCampaign || null,
      utm_term: chat.utmTerm || null,
      utm_content: chat.utmContent || null,
      status: chat.status || 'Submitted',
      ip_location: chat.ipLocation || null,
      ip_address: chat.ipAddress || null,
      organization: chat.organization || null,
      variant: chat.variant || 'original',
      created_at_ist: chat.createdAtIst || null
    };

    const { data, error } = await supabase
      .from('chatbot_leads')
      .insert([record])
      .select();

    if (error) {
      console.warn('[SUPABASE CHATBOT NOTICE]', error.message);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err: any) {
    console.warn('[SUPABASE CHATBOT EXCEPTION]', err?.message || err);
    return { success: false, error: err };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 10. SESSION_INTELLIGENCE TABLE (1:1 with Session_Intelligence Google Sheet tab)
// ─────────────────────────────────────────────────────────────────────────────
export async function captureSessionInSupabase(sess: SupabaseSessionPayload): Promise<{ success: boolean; data?: unknown; error?: unknown }> {
  try {
    const record = {
      session_id: sess.sessionId,
      visitor_id: sess.visitorId || null,
      started_utc: sess.startedUtc || new Date().toISOString(),
      ended_utc: sess.endedUtc || null,
      duration_sec: sess.durationSec || 0,
      page_views: sess.pageViews || 1,
      entry_page: sess.entryPage || null,
      exit_page: sess.exitPage || null,
      traffic_source: sess.trafficSource || null,
      traffic_channel: sess.trafficChannel || 'Direct',
      campaign: sess.campaign || null,
      device: sess.device || 'Desktop',
      browser: sess.browser || 'Unknown',
      os: sess.os || 'Unknown',
      country: sess.country || 'India',
      region_state: sess.regionState || null,
      city: sess.city || null,
      returning_user: sess.returningUser || false,
      is_bounce: sess.isBounce || false,
      is_converted: sess.isConverted || false,
      lead_number: sess.leadNumber || null,
      lead_type: sess.leadType || null,
      created_at_ist: sess.createdAtIst || null
    };

    const { data, error } = await supabase
      .from('session_intelligence')
      .upsert([record], { onConflict: 'session_id' })
      .select();

    if (error) {
      console.warn('[SUPABASE SESSION NOTICE]', error.message);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err: any) {
    console.warn('[SUPABASE SESSION EXCEPTION]', err?.message || err);
    return { success: false, error: err };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// UNIFIED DISPATCHER: Routes any form submission to its matching separate table
// + dual-syncs to master 'leads' table.
// ─────────────────────────────────────────────────────────────────────────────
export async function routeFormToSupabase(sheetName: string, payload: Record<string, any>) {
  const norm = String(sheetName || '').toLowerCase().replace(/[\s\-_]/g, '');

  // 1. Dual-sync to dedicated separate table
  if (norm.includes('contact')) {
    captureContactFormInSupabase(payload).catch(() => {});
  } else if (norm.includes('globallead') || norm === 'leads') {
    captureGlobalLeadFormInSupabase(payload).catch(() => {});
  } else if (norm.includes('sales')) {
    captureSalesInquiriesInSupabase(payload).catch(() => {});
  } else if (norm.includes('googlead') || norm.includes('adcampaign') || norm.includes('adlead')) {
    captureGoogleAdLeadInSupabase(payload).catch(() => {});
  } else if (norm.includes('consultation')) {
    captureConsultationRequestInSupabase(payload).catch(() => {});
  } else if (norm.includes('tender') || norm.includes('rfq')) {
    captureTenderRfqInSupabase(payload).catch(() => {});
  } else if (norm.includes('chatbot')) {
    captureChatbotInSupabase(payload).catch(() => {});
  } else if (norm.includes('career') || norm.includes('job')) {
    captureCareerInSupabase(payload).catch(() => {});
  } else {
    // Default fallback to global_lead_form for any other web forms
    captureGlobalLeadFormInSupabase(payload).catch(() => {});
  }

  // 2. Dual-sync to master leads table for unified dashboard query
  if (!norm.includes('career') && !norm.includes('job')) {
    captureLeadInSupabase({
      leadNumber: payload.leadNumber || payload.lead_number,
      leadType: payload.leadType || 'sales',
      formType: sheetName,
      fullName: payload.name || payload.fullName || payload.full_name,
      company: payload.company || payload.company_name || payload.organization,
      email: payload.email || payload.work_email,
      phone: payload.phone || payload.phone_number,
      designation: payload.designation,
      serviceInterest: payload.service || payload.service_interest || payload.requirement || payload.tender_scope,
      requirement: payload.requirement || payload.message,
      message: payload.message,
      status: 'new',
      submissionStatus: payload.submissionStatus || 'Submitted',
      jiraKey: payload.jiraKey || payload.jira_issue_key,
      jiraStatus: payload.jiraStatus || payload.jira_status,
      trafficChannel: payload.source || payload.trafficChannel,
      utmSource: payload.utmSource || payload.utm_source,
      utmMedium: payload.utmMedium || payload.utm_medium,
      utmCampaign: payload.utmCampaign || payload.utm_campaign,
      utmTerm: payload.utmTerm || payload.utm_term,
      utmContent: payload.utmContent || payload.utm_content,
      ipAddress: payload.ipAddress || payload.ip_address,
      location: payload.location || payload.ip_location,
      pageUrl: payload.pageUrl || payload.page,
      variant: payload.variant,
      createdAtIst: payload.timestamp || payload.createdAtIst
    }).catch(() => {});
  }
}
