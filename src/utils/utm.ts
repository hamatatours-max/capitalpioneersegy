import { UTMParams, LeadMetadata } from '@/types/lead';

const UTM_STORAGE_KEY = 'cp_utm_tracking_data';
const SESSION_STORAGE_KEY = 'cp_session_id';
const FIRST_LANDING_KEY = 'cp_first_landing_page';

/**
 * Generates or retrieves a unique session ID
 */
export const getSessionId = (): string => {
  try {
    let sessionId = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!sessionId) {
      sessionId = 'cp_sess_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();
      sessionStorage.setItem(SESSION_STORAGE_KEY, sessionId);
    }
    return sessionId;
  } catch (e) {
    return 'cp_sess_' + Date.now();
  }
};

/**
 * Initializes and captures UTM parameters from current URL on landing
 */
export const initTracking = (): void => {
  try {
    if (typeof window === 'undefined') return;

    const urlParams = new URLSearchParams(window.location.search);
    const existingDataStr = sessionStorage.getItem(UTM_STORAGE_KEY);
    const existingData: UTMParams = existingDataStr ? JSON.parse(existingDataStr) : {};

    // Capture first landing page if not set
    if (!sessionStorage.getItem(FIRST_LANDING_KEY)) {
      sessionStorage.setItem(FIRST_LANDING_KEY, window.location.href);
    }

    const newUtms: UTMParams = {
      utm_source: urlParams.get('utm_source') || existingData.utm_source || undefined,
      utm_medium: urlParams.get('utm_medium') || existingData.utm_medium || undefined,
      utm_campaign: urlParams.get('utm_campaign') || existingData.utm_campaign || undefined,
      utm_content: urlParams.get('utm_content') || existingData.utm_content || undefined,
      utm_term: urlParams.get('utm_term') || existingData.utm_term || undefined,
    };

    // Filter out undefined keys
    const cleanUtms: UTMParams = Object.fromEntries(
      Object.entries(newUtms).filter(([_, v]) => v !== undefined && v !== '')
    );

    if (Object.keys(cleanUtms).length > 0) {
      sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(cleanUtms));
    }
  } catch (err) {
    console.warn('Tracking initialization warning:', err);
  }
};

/**
 * Collects full lead metadata including UTMs, landing page, date, time, and user agent
 */
export const getLeadMetadata = (): LeadMetadata => {
  const now = new Date();
  
  // Format Date: YYYY-MM-DD
  const dateStr = now.toISOString().split('T')[0];
  
  // Format Time: HH:mm:ss
  const timeStr = now.toTimeString().split(' ')[0];

  let storedUtms: UTMParams = {};
  let firstLanding = '';

  try {
    const utmStr = sessionStorage.getItem(UTM_STORAGE_KEY);
    if (utmStr) {
      storedUtms = JSON.parse(utmStr);
    }
    firstLanding = sessionStorage.getItem(FIRST_LANDING_KEY) || (typeof window !== 'undefined' ? window.location.href : '');
  } catch (e) {
    // Ignore storage read failures
  }

  const currentLanding = typeof window !== 'undefined' ? window.location.href : '';
  const referrer = typeof document !== 'undefined' ? document.referrer || undefined : undefined;
  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : undefined;
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Africa/Cairo';

  return {
    ...storedUtms,
    landing_page: firstLanding || currentLanding,
    referrer,
    date: dateStr,
    time: timeStr,
    timestamp: now.toISOString(),
    timezone,
    user_agent: userAgent,
    session_id: getSessionId(),
  };
};
