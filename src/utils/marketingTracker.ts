/**
 * Unified Marketing Analytics & Conversion Tracker
 * Standardized across:
 * - Google Analytics 4 (GA4)
 * - Google Tag Manager (GTM dataLayer)
 * - Meta Pixel (fbq)
 * - LinkedIn Insight Tag (lintrk)
 * - Microsoft Clarity
 * - Internal SQLite / API Analytics Database
 */

import { getUtmParams, UtmParams } from './utm';

export type MarketingEventType =
  | 'page_view'
  | 'form_submit'
  | 'booking_created'
  | 'chat_started'
  | 'chat_completed'
  | 'whatsapp_click'
  | 'cta_click'
  | 'lead_generated';

export interface TrackingPayload {
  eventName: MarketingEventType;
  pagePath?: string;
  pageTitle?: string;
  leadType?: string;
  leadId?: string;
  value?: number;
  currency?: string;
  metadata?: Record<string, unknown>;
  utmParams?: UtmParams;
}

// Global window extensions
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
    fbq?: (...args: any[]) => void;
    lintrk?: (action: string, data: any) => void;
    clarity?: (...args: any[]) => void;
  }
}

class MarketingTracker {
  private utm: UtmParams;

  constructor() {
    this.utm = typeof window !== 'undefined' ? getUtmParams() : {};
  }

  /**
   * Refreshes and returns active UTM parameters
   */
  public getActiveUtm(): UtmParams {
    if (typeof window !== 'undefined') {
      this.utm = getUtmParams();
    }
    return this.utm;
  }

  /**
   * Main tracking dispatch method
   */
  public track(eventName: MarketingEventType, payload: Omit<TrackingPayload, 'eventName'> = {}) {
    if (typeof window === 'undefined') return;

    const utm = payload.utmParams || this.getActiveUtm();
    const currentPath = window.location.pathname;
    const currentTitle = document.title;

    const enrichedData = {
      event: eventName,
      page_path: payload.pagePath || currentPath,
      page_title: payload.pageTitle || currentTitle,
      lead_type: payload.leadType || 'general',
      lead_id: payload.leadId || '',
      utm_source: utm.utmSource || '(direct)',
      utm_medium: utm.utmMedium || '(none)',
      utm_campaign: utm.utmCampaign || '(not set)',
      utm_content: utm.utmContent || '',
      utm_term: utm.utmTerm || '',
      timestamp: new Date().toISOString(),
      ...payload.metadata
    };

    // 1. Google Analytics 4 (GA4)
    try {
      if (typeof window.gtag === 'function') {
        window.gtag('event', eventName, enrichedData);
      }
    } catch (e) {
      console.debug('[GA4] Event dispatch note:', e);
    }

    // 2. Google Tag Manager (GTM dataLayer)
    try {
      if (Array.isArray(window.dataLayer)) {
        window.dataLayer.push({
          event: eventName,
          ...enrichedData
        });
      }
    } catch (e) {
      console.debug('[GTM] dataLayer push note:', e);
    }

    // 3. Meta Pixel
    try {
      if (typeof window.fbq === 'function') {
        if (eventName === 'lead_generated' || eventName === 'form_submit' || eventName === 'booking_created') {
          window.fbq('track', 'Lead', {
            content_name: payload.leadType || 'Marketing Lead',
            content_category: 'B2B Security Services',
            value: payload.value || 0,
            currency: payload.currency || 'INR',
            ...enrichedData
          });
        } else if (eventName === 'page_view') {
          window.fbq('track', 'PageView');
        } else {
          window.fbq('trackCustom', eventName, enrichedData);
        }
      }
    } catch (e) {
      console.debug('[Meta Pixel] Event note:', e);
    }

    // 4. LinkedIn Insight Tag
    try {
      if (typeof window.lintrk === 'function') {
        // LinkedIn custom conversion event
        window.lintrk('track', {
          conversion_id: eventName === 'lead_generated' ? 1234567 : undefined,
          ...enrichedData
        });
      }
    } catch (e) {
      console.debug('[LinkedIn Insight] note:', e);
    }

    // 5. Microsoft Clarity
    try {
      if (typeof window.clarity === 'function') {
        window.clarity('event', eventName);
        if (utm.utmSource) {
          window.clarity('set', 'utm_source', utm.utmSource);
        }
        if (utm.utmCampaign) {
          window.clarity('set', 'utm_campaign', utm.utmCampaign);
        }
      }
    } catch (e) {
      console.debug('[Clarity] note:', e);
    }

    // 6. Internal API sync (non-blocking beacon or fetch)
    try {
      const apiPayload = {
        sessionId: sessionStorage.getItem('isi_session_id') || `sess_${Date.now()}`,
        visitorId: localStorage.getItem('isi_visitor_id') || `vis_${Date.now()}`,
        eventType: eventName,
        pagePath: payload.pagePath || currentPath,
        pageTitle: payload.pageTitle || currentTitle,
        utmSource: utm.utmSource || '',
        utmMedium: utm.utmMedium || '',
        utmCampaign: utm.utmCampaign || '',
        utmContent: utm.utmContent || '',
        utmTerm: utm.utmTerm || '',
        metadata: {
          leadType: payload.leadType,
          leadId: payload.leadId,
          ...payload.metadata
        }
      };

      if (navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify(apiPayload)], { type: 'application/json' });
        navigator.sendBeacon('/api/analytics', blob);
      } else {
        fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(apiPayload),
          keepalive: true
        }).catch(() => {});
      }
    } catch (e) {
      // Ignore background analytics network error
    }
  }
}

export const tracker = new MarketingTracker();

