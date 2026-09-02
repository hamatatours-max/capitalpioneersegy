import { UTMParams } from './lead';

export type AnalyticsEventName = 
  | 'page_view'
  | 'view_project'
  | 'click_phone'
  | 'click_whatsapp'
  | 'request_viewing'
  | 'form_start'
  | 'form_submit'
  | 'map_interaction'
  | 'downtown_offer_view'
  | 'downtown_offer_request'
  | 'downtown_whatsapp_click'
  | 'downtown_dt1_interest'
  | 'downtown_dt2_interest'
  | 'downtown_lead_submit'
  | 'downtown_cash_offer_click'
  | 'notion_project_view'
  | 'notion_unit_select'
  | 'notion_apartment_select'
  | 'notion_townhouse_select'
  | 'notion_villa_select'
  | 'notion_payment_plan_select'
  | 'notion_request_details'
  | 'notion_whatsapp_click'
  | 'notion_lead_submit'
  | 'the_island_view'
  | 'the_island_collection_switch'
  | 'the_island_unit_select'
  | 'the_island_plan_select'
  | 'the_island_whatsapp_click'
  | 'the_island_lead_submit'
  | 'sokhna_time_project_view'
  | 'sokhna_time_request_details'
  | 'sokhna_time_whatsapp_click'
  | 'sokhna_time_rental_details'
  | 'sokhna_time_lead_submit'
  | 'sokhna_time_last_unit_view'
  | 'sokhna_time_video_play'
  | 'sokhna_time_last_unit_cta'
  | 'sokhna_time_rental_interest'
  | 'sokhna_time_unit_switch'
  | 'sokhna_180_unit_view'
  | 'sokhna_180_video_play'
  | 'sokhna_180_plan_select'
  | 'sokhna_180_request_details'
  | 'sokhna_180_whatsapp_click'
  | 'sokhna_180_rental_interest'
  | 'sokhna_180_lead_submit'
  | 'sokhna_130p_unit_view'
  | 'sokhna_130p_plan_select'
  | 'sokhna_130p_request_details'
  | 'sokhna_130p_whatsapp_click'
  | 'sokhna_130p_rental_interest'
  | 'sokhna_130p_lead_submit'
  | 'mirai_project_view'
  | 'mirai_video_play'
  | 'mirai_showcase_video_play'
  | 'mirai_plan_select'
  | 'mirai_category_select'
  | 'mirai_request_details'
  | 'mirai_whatsapp_click'
  | 'mirai_lead_submit'
  | 'core_point_project_view'
  | 'core_point_clinic_interest'
  | 'core_point_nav'
  | 'core_point_video_play'
  | 'core_point_payment_plan_view'
  | 'core_point_whatsapp_click'
  | 'core_point_lead_submit'
  | 'twenty_plus_g43_unit_view'
  | 'twenty_plus_g43_plan_select'
  | 'twenty_plus_g43_whatsapp_click'
  | 'twenty_plus_g43_lead_submit'
  | 'artea_s18_unit_view'
  | 'artea_s18_plan_select'
  | 'artea_s18_whatsapp_click'
  | 'artea_s18_lead_submit'
  | 'platinum_project_view'
  | 'platinum_video_play'
  | 'platinum_video_complete'
  | 'platinum_unit_type_select'
  | 'platinum_availability_select'
  | 'platinum_whatsapp_click'
  | 'platinum_lead_submit'
  | 'nuxes_project_view'
  | 'nuxes_plan_select'
  | 'nuxes_unit_switch'
  | 'nuxes_image_zoom'
  | 'nuxes_whatsapp_click'
  | 'nuxes_lead_submit'
  | 'nexus_project_view'
  | 'nexus_plan_select'
  | 'nexus_unit_switch'
  | 'nexus_image_zoom'
  | 'nexus_whatsapp_click'
  | 'nexus_lead_submit'
  | 'kernal_project_view'
  | 'kernal_plan_select'
  | 'kernal_floorplan_view'
  | 'kernal_unit_switch'
  | 'kernal_image_zoom'
  | 'kernal_whatsapp_click'
  | 'kernal_lead_submit'
  | 'kernel_project_view'
  | 'kernel_plan_select'
  | 'kernel_unit_switch'
  | 'kernel_whatsapp_click'
  | 'kernel_lead_submit'
  | 'beit_al_watan_project_view'
  | 'beit_al_watan_plan_select'
  | 'beit_al_watan_construction_view'
  | 'beit_al_watan_whatsapp_click'
  | 'beit_al_watan_lead_submit'
  | 'medical_project_view'
  | 'medical_clinic_interest'
  | 'medical_payment_plan_view'
  | 'medical_whatsapp_click'
  | 'medical_lead_submit'
  | 'northern_lotus_view'
  | 'northern_lotus_unit_switch'
  | 'northern_lotus_plan_select'
  | 'northern_lotus_whatsapp_click'
  | 'northern_lotus_lead_submit'
  | 'andalus_641_view'
  | 'andalus_641_whatsapp_click'
  | 'andalus_641_lead_submit';

export interface BaseEventParams extends UTMParams {
  page_title?: string;
  page_location?: string;
  page_path?: string;
  session_id?: string;
  timestamp?: string;
}

export interface ViewProjectEventParams extends BaseEventParams {
  project_id: string;
  project_slug: string;
  project_name: string;
  project_category: string;
  project_location: string;
  developer?: string;
  is_red_sea?: boolean;
}

export interface ClickContactEventParams extends BaseEventParams {
  contact_channel: 'phone' | 'whatsapp';
  phone_number: string;
  placement_source: string; // e.g. 'header', 'floating_button', 'mobile_sticky_cta', 'project_card', 'hero'
  project_context?: string;
}

export interface RequestViewingEventParams extends BaseEventParams {
  project_name?: string;
  placement_source: string;
}

export interface FormEventParams extends BaseEventParams {
  form_name: string;
  form_id?: string;
  interested_project?: string;
  property_type?: string;
  purpose?: string;
  budget_range?: string;
  preferred_contact?: string;
  lead_id?: string;
}

export interface MapInteractionEventParams extends BaseEventParams {
  hub_id: string;
  hub_name: string;
  region: string;
  coordinates?: string;
}

// Meta Conversions API (CAPI) Payload Schema
export interface MetaCAPIPayload {
  event_name: string;
  event_time: number;
  event_id?: string;
  event_source_url: string;
  action_source: 'website';
  user_data: {
    client_ip_address?: string;
    client_user_agent?: string;
    fbc?: string;
    fbp?: string;
    em?: string[]; // SHA256 hashed email
    ph?: string[]; // SHA256 hashed phone
  };
  custom_data?: Record<string, any>;
}

export interface AnalyticsConfig {
  gtmId?: string;
  ga4Id?: string;
  metaPixelId?: string;
  metaCapiEndpoint?: string;
  debugMode?: boolean;
}
