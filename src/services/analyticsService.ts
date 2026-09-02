import { 
  AnalyticsEventName, 
  BaseEventParams, 
  ViewProjectEventParams, 
  ClickContactEventParams, 
  RequestViewingEventParams, 
  FormEventParams, 
  MapInteractionEventParams,
  MetaCAPIPayload,
  AnalyticsConfig
} from '@/types/analytics';
import { getLeadMetadata } from '@/utils/utm';

// Tracking configuration from environment variables (No fake IDs hardcoded)
export const ANALYTICS_CONFIG: AnalyticsConfig = {
  gtmId: import.meta.env.VITE_GTM_ID || '',
  ga4Id: import.meta.env.VITE_GA4_ID || '',
  metaPixelId: import.meta.env.VITE_META_PIXEL_ID || '',
  metaCapiEndpoint: import.meta.env.VITE_META_CAPI_ENDPOINT || '',
  debugMode: import.meta.env.DEV,
};

// Extend global window object for tag managers
declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
    _fbq?: any;
  }
}

/**
 * Enriches any analytics event payload with current UTM parameters, session ID, and page context
 */
const enrichEventParams = <T extends Record<string, any>>(params: T): T & BaseEventParams => {
  const meta = getLeadMetadata();
  return {
    ...params,
    utm_source: meta.utm_source,
    utm_medium: meta.utm_medium,
    utm_campaign: meta.utm_campaign,
    utm_content: meta.utm_content,
    utm_term: meta.utm_term,
    page_title: typeof document !== 'undefined' ? document.title : '',
    page_location: typeof window !== 'undefined' ? window.location.href : '',
    page_path: typeof window !== 'undefined' ? window.location.pathname : '',
    session_id: meta.session_id,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Asynchronously dispatches events to Meta Conversions API (CAPI) endpoint if configured
 */
const dispatchMetaCAPI = async (eventName: string, customData?: Record<string, any>) => {
  if (!ANALYTICS_CONFIG.metaCapiEndpoint) return;

  try {
    const meta = getLeadMetadata();
    const payload: MetaCAPIPayload = {
      event_name: eventName,
      event_time: Math.floor(Date.now() / 1000),
      event_id: 'capi_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      event_source_url: meta.landing_page || (typeof window !== 'undefined' ? window.location.href : ''),
      action_source: 'website',
      user_data: {
        client_user_agent: meta.user_agent,
      },
      custom_data: customData,
    };

    // Use sendBeacon or non-blocking fetch
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      navigator.sendBeacon(ANALYTICS_CONFIG.metaCapiEndpoint, JSON.stringify(payload));
    } else {
      fetch(ANALYTICS_CONFIG.metaCapiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {});
    }
  } catch (err) {
    if (ANALYTICS_CONFIG.debugMode) {
      console.warn('[Analytics] Meta CAPI dispatch warning:', err);
    }
  }
};

/**
 * Universal Event Dispatcher
 */
export const trackEvent = (
  eventName: AnalyticsEventName,
  eventParams: Record<string, any> = {}
) => {
  // Execute via requestIdleCallback or microtask to guarantee zero Core Web Vitals impact
  const executeTrack = () => {
    const enrichedParams = enrichEventParams(eventParams);

    if (ANALYTICS_CONFIG.debugMode) {
      console.log(`📊 [Analytics] Track Event: ${eventName}`, enrichedParams);
    }

    // 1. Google Tag Manager Data Layer
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: eventName,
        ...enrichedParams,
      });
    }

    // 2. Google Analytics 4 (gtag)
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', eventName, enrichedParams);
    }

    // 3. Meta Pixel (fbq)
    if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
      // Map standard Meta event names
      const metaEventMap: Record<string, string> = {
        page_view: 'PageView',
        view_project: 'ViewContent',
        click_whatsapp: 'Contact',
        click_phone: 'Contact',
        request_viewing: 'Schedule',
        form_start: 'InitiateCheckout',
        form_submit: 'Lead',
      };
      const metaEvent = metaEventMap[eventName] || 'CustomEvent';
      window.fbq('trackCustom', eventName, enrichedParams);
      if (metaEventMap[eventName]) {
        window.fbq('track', metaEvent, enrichedParams);
      }
    }

    // 4. Meta Conversions API (CAPI) Integration Layer
    dispatchMetaCAPI(eventName, enrichedParams);
  };

  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    (window as any).requestIdleCallback(executeTrack);
  } else {
    setTimeout(executeTrack, 0);
  }
};

/* =========================================================================
   SPECIFIC CONVERSION TRACKING HELPERS
   ========================================================================= */

export const trackPageView = (path: string, title: string) => {
  trackEvent('page_view', {
    page_path: path,
    page_title: title,
  });
};

export const trackViewProject = (params: ViewProjectEventParams) => {
  trackEvent('view_project', params);
};

export const trackClickPhone = (placementSource: string, projectContext?: string) => {
  trackEvent('click_phone', {
    contact_channel: 'phone',
    phone_number: '01066330570',
    placement_source: placementSource,
    project_context: projectContext,
  } as ClickContactEventParams);
};

export const trackClickWhatsApp = (placementSource: string, projectContext?: string) => {
  trackEvent('click_whatsapp', {
    contact_channel: 'whatsapp',
    phone_number: '201066330570',
    placement_source: placementSource,
    project_context: projectContext,
  } as ClickContactEventParams);
};

export const trackRequestViewing = (placementSource: string, projectName?: string) => {
  trackEvent('request_viewing', {
    placement_source: placementSource,
    project_name: projectName,
  } as RequestViewingEventParams);
};

export const trackFormStart = (formName: string, fieldTarget?: string) => {
  trackEvent('form_start', {
    form_name: formName,
    field_target: fieldTarget,
  });
};

export const trackFormSubmit = (params: FormEventParams) => {
  trackEvent('form_submit', params);
};

export const trackMapInteraction = (hubId: string, hubName: string, region: string, coordinates?: string) => {
  trackEvent('map_interaction', {
    hub_id: hubId,
    hub_name: hubName,
    region,
    coordinates,
  } as MapInteractionEventParams);
};
