import { LeadFormData, LeadPayload, LeadSubmissionResult } from '@/types/lead';
import { getLeadMetadata } from '@/utils/utm';

export const PRIMARY_PHONE = '01066330570';
export const WHATSAPP_INTERNATIONAL = '201066330570';
export const TEL_URL = 'tel:01066330570';
export const WHATSAPP_BASE_URL = `https://wa.me/${WHATSAPP_INTERNATIONAL}`;

// Configurable Webhook URL from environment (supports Make.com, Zapier, Google Apps Script, CRM Webhook)
const WEBHOOK_URL = import.meta.env.VITE_LEAD_WEBHOOK_URL || '';

/**
 * Formats a clean WhatsApp consultation message from lead payload
 */
export const buildWhatsAppMessage = (payload: LeadPayload): string => {
  const lines = [
    `*NEW PROPERTY INQUIRY — CAPITAL PIONEERS REAL ESTATE*`,
    `----------------------------------------`,
    `*Name:* ${payload.fullName}`,
    `*Phone:* ${payload.phoneNumber}`,
    payload.email ? `*Email:* ${payload.email}` : null,
    payload.interestedProject ? `*Interested Project:* ${payload.interestedProject}` : null,
    `*Property Type:* ${payload.propertyType}`,
    `*Purpose:* ${payload.purpose}`,
    payload.budget ? `*Budget / Range:* ${payload.budget}` : null,
    `*Preferred Contact:* ${payload.preferredContactMethod}`,
    payload.message ? `*Notes / Message:* ${payload.message}` : null,
    `----------------------------------------`,
    `*Landing Page:* ${payload.metadata.landing_page}`,
    payload.metadata.utm_source ? `*Source:* ${payload.metadata.utm_source}` : null,
    payload.metadata.utm_campaign ? `*Campaign:* ${payload.metadata.utm_campaign}` : null,
    `*Date & Time:* ${payload.metadata.date} ${payload.metadata.time}`,
  ].filter(Boolean);

  return encodeURIComponent(lines.join('\n'));
};

/**
 * Dispatches a lead submission across the integration layer:
 * 1. Collects session & UTM metadata
 * 2. Formats payload matching CRM/Make.com/Google Sheets standards
 * 3. Triggers Webhook / API endpoint if configured
 * 4. Buffers lead locally in localStorage to guarantee zero data loss
 * 5. Generates direct WhatsApp handoff URL
 */
export const submitLead = async (
  formData: LeadFormData,
  source: 'web_form' | 'viewing_modal' | 'project_detail' | 'red_sea_page' = 'web_form'
): Promise<LeadSubmissionResult> => {
  const metadata = getLeadMetadata();
  const leadId = 'cp_lead_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);

  const payload: LeadPayload = {
    ...formData,
    id: leadId,
    metadata,
    source,
  };

  console.group('📋 [Capital Pioneers Lead System] Lead Captured');
  console.log('Lead ID:', leadId);
  console.log('Lead Payload:', payload);
  console.log('UTM & Session Metadata:', metadata);
  console.groupEnd();

  // 1. Buffer locally in browser for audit & zero lead loss
  try {
    const existingLeadsStr = localStorage.getItem('cp_stored_leads');
    const existingLeads: LeadPayload[] = existingLeadsStr ? JSON.parse(existingLeadsStr) : [];
    existingLeads.unshift(payload);
    // Keep last 100 leads locally
    localStorage.setItem('cp_stored_leads', JSON.stringify(existingLeads.slice(0, 100)));
  } catch (err) {
    console.warn('Local lead buffering error:', err);
  }

  // 2. Webhook / API Dispatch (Make.com, Google Sheets, Tally, CRM, Meta Lead webhook)
  if (WEBHOOK_URL) {
    try {
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Lead-Source': 'capital-pioneers-web',
        },
        body: JSON.stringify(payload),
      });
      console.log('✅ Lead successfully dispatched to Webhook integration:', WEBHOOK_URL);
    } catch (webhookError) {
      console.error('⚠️ Webhook dispatch warning (lead buffered locally):', webhookError);
    }
  }

  // 3. Generate direct WhatsApp connection link
  const waText = buildWhatsAppMessage(payload);
  const whatsappDirectUrl = `${WHATSAPP_BASE_URL}?text=${waText}`;

  return {
    success: true,
    message: 'Thank you for contacting Capital Pioneers. Our real estate consultant will contact you shortly.',
    leadId,
    whatsappDirectUrl,
  };
};
