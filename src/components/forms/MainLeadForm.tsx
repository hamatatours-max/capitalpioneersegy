import React, { useState, useRef } from 'react';
import { 
  Phone, 
  MessageCircle, 
  Mail, 
  CheckCircle2, 
  Send, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { 
  LeadFormData, 
  PropertyTypeOption, 
  PurposeOption, 
  PreferredContactOption 
} from '@/types/lead';
import { submitLead, PRIMARY_PHONE, TEL_URL } from '@/services/leadService';
import { getAllProjects } from '@/data/projectsData';
import { useLanguage } from '@/context/LanguageContext';
import { getLocalizedProject } from '@/i18n/projectTranslations';
import { trackFormStart, trackFormSubmit, trackClickPhone, trackClickWhatsApp } from '@/services/analyticsService';

interface MainLeadFormProps {
  initialProject?: string;
  className?: string;
  source?: 'web_form' | 'viewing_modal' | 'project_detail' | 'red_sea_page';
  onSuccess?: () => void;
}

export const MainLeadForm: React.FC<MainLeadFormProps> = ({
  initialProject = '',
  className = '',
  source = 'web_form',
  onSuccess,
}) => {
  const rawProjects = getAllProjects();
  const hasStartedForm = useRef(false);
  const { t, language } = useLanguage();

  const projects = rawProjects.map((p) => getLocalizedProject(p, language));

  const [formData, setFormData] = useState<LeadFormData>({
    fullName: '',
    phoneNumber: '',
    email: '',
    interestedProject: initialProject,
    propertyType: 'Apartment',
    purpose: 'End User',
    budget: '5M – 10M EGP',
    preferredContactMethod: 'WhatsApp',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [whatsappHandoffUrl, setWhatsappHandoffUrl] = useState<string | null>(null);

  const propertyTypeOptions: { value: PropertyTypeOption; label: string }[] = [
    { value: 'Apartment', label: language === 'ar' ? 'شقة سكنية' : language === 'de' ? 'Wohnung' : 'Apartment' },
    { value: 'Villa', label: language === 'ar' ? 'فيلا مستقلة' : language === 'de' ? 'Freistehende Villa' : 'Villa' },
    { value: 'Townhouse', label: language === 'ar' ? 'تاون هاوس' : language === 'de' ? 'Reihenhaus' : 'Townhouse' },
    { value: 'Twin House', label: language === 'ar' ? 'توين هاوس' : language === 'de' ? 'Doppelhaus' : 'Twin House' },
    { value: 'Chalet', label: language === 'ar' ? 'شاليه ساحلي' : language === 'de' ? 'Strand-Chalet' : 'Chalet' },
    { value: 'Commercial', label: language === 'ar' ? 'محل تجاري / مطعم' : language === 'de' ? 'Gewerbe / Retail' : 'Commercial' },
    { value: 'Office', label: language === 'ar' ? 'مكتب إداري / عيادة' : language === 'de' ? 'Büro / Praxis' : 'Office' },
    { value: 'Other', label: language === 'ar' ? 'أخرى' : language === 'de' ? 'Sonstiges' : 'Other' },
  ];

  const purposeOptions: { value: PurposeOption; label: string }[] = [
    { value: 'End User', label: t('form.purposeEndUser', 'End User') },
    { value: 'Investment', label: t('form.purposeInvestment', 'Investment') },
  ];

  const preferredContactOptions: { value: PreferredContactOption; label: string }[] = [
    { value: 'Phone', label: t('form.contactPhone', 'Phone') },
    { value: 'WhatsApp', label: t('form.contactWhatsApp', 'WhatsApp') },
    { value: 'Email', label: t('form.contactEmail', 'Email') },
  ];

  const budgetRanges = [
    language === 'ar' ? 'أقل من 5 مليون جنيه' : language === 'de' ? 'Unter 5 Mio. EGP' : 'Under 5 Million EGP',
    language === 'ar' ? '5 - 10 مليون جنيه' : language === 'de' ? '5 - 10 Mio. EGP' : '5M – 10 Million EGP',
    language === 'ar' ? '10 - 20 مليون جنيه' : language === 'de' ? '10 - 20 Mio. EGP' : '10M – 20 Million EGP',
    language === 'ar' ? '20 - 40 مليون جنيه' : language === 'de' ? '20 - 40 Mio. EGP' : '20M – 40 Million EGP',
    language === 'ar' ? 'أكثر من 40 مليون جنيه' : language === 'de' ? 'Über 40 Mio. EGP' : 'Above 40 Million EGP',
    language === 'ar' ? 'مرن / بحاجة لاستشارة' : language === 'de' ? 'Flexibel / Beratung erwünscht' : 'Flexible / Consultation Needed',
  ];

  const handleInputFocus = (fieldName: string) => {
    if (!hasStartedForm.current) {
      hasStartedForm.current = true;
      trackFormStart('main_consultation_form', fieldName);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await submitLead(formData, source);
      setIsSubmitted(true);

      // Trigger analytics form_submit conversion event
      trackFormSubmit({
        form_name: 'main_consultation_form',
        lead_id: result.leadId,
        interested_project: formData.interestedProject,
        property_type: formData.propertyType,
        purpose: formData.purpose,
        budget_range: formData.budget,
        preferred_contact: formData.preferredContactMethod,
      });

      if (result.whatsappDirectUrl) {
        setWhatsappHandoffUrl(result.whatsappDirectUrl);
      }
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Lead submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-10 lg:p-12 shadow-soft ${className}`}>
      {isSubmitted ? (
        <div className="py-10 text-center space-y-6 animate-in fade-in duration-300">
          <div className="w-16 h-16 rounded-2xl bg-[#F1F7FA] text-[#0B4D68] mx-auto flex items-center justify-center shadow-soft-sm">
            <CheckCircle2 className="w-9 h-9 text-[#0B4D68]" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-semibold text-[#0F2432] tracking-tight">
              {t('form.thankYouTitle', 'Thank you for contacting Capital Pioneers.')}
            </h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto font-light leading-relaxed">
              {t('form.thankYouDesc', 'Our real estate consultant will contact you shortly regarding your property inquiry.')}
            </p>
          </div>

          {/* Quick WhatsApp Dispatch Action */}
          {whatsappHandoffUrl && (
            <div className="pt-4 max-w-sm mx-auto space-y-3">
              <a
                href={whatsappHandoffUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackClickWhatsApp('form_success_button')}
                className="btn-whatsapp w-full py-3.5 text-xs font-semibold flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>{t('cta.openWhatsAppChat', 'Open Instant WhatsApp Chat')}</span>
              </a>

              <p className="text-[11px] text-slate-400 font-light">
                {t('form.hotlineLabel', 'Hotline:')} <a href={TEL_URL} onClick={() => trackClickPhone('form_success_link')} className="text-slate-700 font-semibold underline" dir="ltr">{PRIMARY_PHONE}</a>
              </p>
            </div>
          )}

          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={() => {
                setIsSubmitted(false);
                hasStartedForm.current = false;
                setFormData({
                  ...formData,
                  fullName: '',
                  phoneNumber: '',
                  email: '',
                  message: '',
                });
              }}
              className="text-xs font-semibold text-[#0B4D68] hover:underline"
            >
              {t('cta.submitAnother', 'Submit Another Request')}
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form Header */}
          <div className="space-y-2 border-b border-slate-100 pb-5">
            <div className="eyebrow-tag bg-[#F1F7FA] text-[#0B4D68]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('form.eyebrow', 'Direct Consultation Desk')}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-[#0F2432] tracking-tight">
              {t('form.mainTitle', 'REQUEST A VIEWING OR PROPERTY CONSULTATION')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-light">
              {t('form.mainSubtitle', 'Connect directly with our real estate advisory team across New Cairo and Red Sea.')}
            </p>
          </div>

          {/* Row 1: Full Name & Phone Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">{t('form.fullName', 'Full Name *')}</label>
              <input
                type="text"
                required
                placeholder={t('form.fullNamePlaceholder', 'e.g. Eng. Tarek Mostafa')}
                value={formData.fullName}
                onFocus={() => handleInputFocus('fullName')}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">{t('form.phoneNumber', 'Phone Number *')}</label>
              <input
                type="tel"
                required
                placeholder={t('form.phonePlaceholder', '01066330570')}
                value={formData.phoneNumber}
                onFocus={() => handleInputFocus('phoneNumber')}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="form-input"
                dir="ltr"
              />
            </div>
          </div>

          {/* Row 2: Email & Interested Project */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">{t('form.email', 'Email (Optional)')}</label>
              <input
                type="email"
                placeholder={t('form.emailPlaceholder', 'name@example.com')}
                value={formData.email}
                onFocus={() => handleInputFocus('email')}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="form-input"
                dir="ltr"
              />
            </div>

            <div>
              <label className="form-label">{t('form.interestedProject', 'Interested Project')}</label>
              <select
                value={formData.interestedProject}
                onFocus={() => handleInputFocus('interestedProject')}
                onChange={(e) => setFormData({ ...formData, interestedProject: e.target.value })}
                className="form-input"
              >
                <option value="">{t('form.selectProject', 'Select a Project or General Inquiry')}</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name} ({p.area})
                  </option>
                ))}
                <option value="General New Cairo Consultation">{t('form.generalNewCairo', 'General New Cairo Consultation')}</option>
                <option value="General Hurghada / Red Sea Consultation">{t('form.generalRedSea', 'General Hurghada / Red Sea Consultation')}</option>
              </select>
            </div>
          </div>

          {/* Row 3: Property Type & Purpose */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">{t('form.propertyType', 'Property Type')}</label>
              <select
                value={formData.propertyType}
                onFocus={() => handleInputFocus('propertyType')}
                onChange={(e) => setFormData({ ...formData, propertyType: e.target.value as PropertyTypeOption })}
                className="form-input"
              >
                {propertyTypeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label">{t('form.purpose', 'Purpose')}</label>
              <div className="grid grid-cols-2 gap-2 pt-0.5">
                {purposeOptions.map((pur) => (
                  <button
                    key={pur.value}
                    type="button"
                    onClick={() => {
                      handleInputFocus('purpose');
                      setFormData({ ...formData, purpose: pur.value });
                    }}
                    className={`py-3 px-3 rounded-xl text-xs font-semibold border transition-all duration-200 ${
                      formData.purpose === pur.value
                        ? 'bg-[#0B4D68] text-white border-[#0B4D68] shadow-sm'
                        : 'bg-[#FAFBFD] text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {pur.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Row 4: Budget & Preferred Contact Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">{t('form.budget', 'Budget Range')}</label>
              <select
                value={formData.budget}
                onFocus={() => handleInputFocus('budget')}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                className="form-input"
              >
                {budgetRanges.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label">{t('form.preferredContact', 'Preferred Contact Method')}</label>
              <div className="grid grid-cols-3 gap-2 pt-0.5">
                {preferredContactOptions.map((method) => (
                  <button
                    key={method.value}
                    type="button"
                    onClick={() => {
                      handleInputFocus('preferredContactMethod');
                      setFormData({ ...formData, preferredContactMethod: method.value });
                    }}
                    className={`py-3 px-2 rounded-xl text-xs font-semibold border transition-all duration-200 flex items-center justify-center gap-1 ${
                      formData.preferredContactMethod === method.value
                        ? 'bg-[#0B4D68] text-white border-[#0B4D68] shadow-sm'
                        : 'bg-[#FAFBFD] text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {method.value === 'Phone' && <Phone className="w-3 h-3" />}
                    {method.value === 'WhatsApp' && <MessageCircle className="w-3 h-3 text-[#25D366]" />}
                    {method.value === 'Email' && <Mail className="w-3 h-3" />}
                    <span>{method.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Row 5: Message */}
          <div>
            <label className="form-label">{t('form.message', 'Message / Specific Requirements')}</label>
            <textarea
              rows={3}
              placeholder={t('form.messagePlaceholder', 'Tell us about desired floor area (m²), installment preferences, or scheduled viewing dates...')}
              value={formData.message}
              onFocus={() => handleInputFocus('message')}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="form-input resize-none"
            />
          </div>

          {/* Submit CTA */}
          <div className="space-y-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary py-4 text-xs sm:text-sm font-semibold tracking-wider uppercase flex items-center justify-center gap-2 shadow-soft hover:shadow-soft-lg"
            >
              {isSubmitting ? (
                <span>{t('cta.submitting', 'Submitting Request...')}</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{t('cta.requestCallback', 'REQUEST A CALLBACK')}</span>
                </>
              )}
            </button>

            <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 font-light pt-1 px-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#0B4D68]" />
                {t('form.privacyNote', 'Confidential client data handling')}
              </span>
              <span>
                {t('form.hotlineLabel', 'Hotline:')} <a href={TEL_URL} onClick={() => trackClickPhone('form_footer_link')} className="text-slate-700 font-semibold underline" dir="ltr">{PRIMARY_PHONE}</a>
              </span>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default MainLeadForm;
