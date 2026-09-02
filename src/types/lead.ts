export type PropertyTypeOption = 
  | 'Apartment'
  | 'Villa'
  | 'Townhouse'
  | 'Twin House'
  | 'Chalet'
  | 'Duplex'
  | 'Commercial'
  | 'Office'
  | 'Other';

export type PurposeOption = 
  | 'End User'
  | 'Investment';

export type PreferredContactOption = 
  | 'Phone'
  | 'WhatsApp'
  | 'Email';

export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
}

export interface LeadMetadata extends UTMParams {
  landing_page: string;
  referrer?: string;
  date: string; // e.g. "2026-08-22"
  time: string; // e.g. "16:30:00"
  timestamp: string; // ISO 8601 string
  timezone: string;
  user_agent?: string;
  session_id?: string;
}

export interface LeadFormData {
  fullName: string;
  phoneNumber: string;
  email?: string;
  interestedProject?: string;
  propertyType: PropertyTypeOption;
  purpose: PurposeOption;
  budget?: string;
  preferredContactMethod: PreferredContactOption;
  message?: string;
}

export interface LeadPayload extends LeadFormData {
  id: string;
  metadata: LeadMetadata;
  source: 'web_form' | 'viewing_modal' | 'project_detail' | 'red_sea_page';
}

export interface LeadSubmissionResult {
  success: boolean;
  message: string;
  leadId: string;
  whatsappDirectUrl?: string;
}
