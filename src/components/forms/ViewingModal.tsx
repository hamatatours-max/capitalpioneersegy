import React, { useState, useRef } from 'react';
import { X, Calendar, CheckCircle2, Building2, MessageCircle } from 'lucide-react';
import { LeadFormData, PropertyTypeOption } from '@/types/lead';
import { submitLead, PRIMARY_PHONE, TEL_URL } from '@/services/leadService';
import { useLanguage } from '@/context/LanguageContext';
import { trackFormStart, trackFormSubmit, trackClickPhone, trackClickWhatsApp } from '@/services/analyticsService';

interface ViewingModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectName?: string;
}

export const ViewingModal: React.FC<ViewingModalProps> = ({
  isOpen,
  onClose,
  projectName = 'Capital Pioneers Real Estate Opportunity',
}) => {
  const hasStartedForm = useRef(false);
  const { t, language } = useLanguage();

  const [formData, setFormData] = useState<LeadFormData>({
    fullName: '',
    phoneNumber: '',
    email: '',
    interestedProject: projectName,
    propertyType: 'Apartment',
    purpose: 'End User',
    budget: 'Flexible / Consultation Needed',
    preferredContactMethod: 'WhatsApp',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);

  if (!isOpen) return null;

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

  const handleInputFocus = (fieldName: string) => {
    if (!hasStartedForm.current) {
      hasStartedForm.current = true;
      trackFormStart('viewing_modal_form', fieldName);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await submitLead({
        ...formData,
        interestedProject: projectName,
      }, 'viewing_modal');

      setIsSubmitted(true);

      trackFormSubmit({
        form_name: 'viewing_modal_form',
        lead_id: result.leadId,
        interested_project: projectName,
        property_type: formData.propertyType,
        purpose: formData.purpose,
        budget_range: formData.budget,
        preferred_contact: formData.preferredContactMethod,
      });

      if (result.whatsappDirectUrl) {
        setWhatsappUrl(result.whatsappDirectUrl);
      }
    } catch (err) {
      console.error('Modal submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="viewing-modal-title"
    >
      {/* Click outside backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200/80 z-10 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header Strip */}
        <div className="bg-[#061D28] text-white p-6 flex items-center justify-between border-b border-white/10">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-[#C5A880] uppercase tracking-wider">
              {t('form.modalBadge', 'Private Property Consultation')}
            </span>
            <h3 id="viewing-modal-title" className="text-lg font-semibold text-white tracking-tight">
              {t('form.modalTitle', 'Request a Viewing Appointment')}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
            aria-label={t('cta.close', 'Close modal')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Project Target Banner */}
        <div className="bg-[#F1F7FA] px-6 py-3 border-b border-slate-200/60 flex items-center gap-2 text-xs text-[#0B4D68]">
          <Building2 className="w-4 h-4 flex-shrink-0" />
          <span className="truncate font-medium">{t('form.modalSelected', 'Selected:')} {projectName}</span>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {isSubmitted ? (
            <div className="py-8 text-center space-y-5 animate-in fade-in duration-300">
              <div className="w-14 h-14 rounded-2xl bg-[#F1F7FA] text-[#0B4D68] mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-[#0B4D68]" />
              </div>

              <div className="space-y-1.5">
                <h4 className="text-lg font-semibold text-[#0F2432]">
                  {t('form.thankYouTitle', 'Thank you for contacting Capital Pioneers.')}
                </h4>
                <p className="text-xs text-slate-600 max-w-xs mx-auto font-light leading-relaxed">
                  {t('form.modalThankYouDesc', 'Our real estate consultant will contact you shortly regarding your viewing request.')}
                </p>
              </div>

              {whatsappUrl && (
                <div className="pt-2">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackClickWhatsApp('modal_success_button')}
                    className="btn-whatsapp w-full py-3.5 text-xs font-semibold flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>{t('cta.openWhatsAppChat', 'Open Instant WhatsApp Chat')}</span>
                  </a>
                </div>
              )}

              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  {t('cta.close', 'Close Window')}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="form-label">{t('form.fullName', 'Full Name *')}</label>
                <input
                  type="text"
                  required
                  placeholder={t('form.fullNamePlaceholder', 'e.g. Dr. Sherif Nabil')}
                  value={formData.fullName}
                  onFocus={() => handleInputFocus('fullName')}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

                <div>
                  <label className="form-label">{t('form.email', 'Email Address (Optional)')}</label>
                  <input
                    type="email"
                    placeholder={t('form.emailPlaceholder', 'name@domain.com')}
                    value={formData.email}
                    onFocus={() => handleInputFocus('email')}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="form-input"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                  <select
                    value={formData.purpose}
                    onFocus={() => handleInputFocus('purpose')}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value as any })}
                    className="form-input"
                  >
                    <option value="End User">{t('form.purposeEndUser', 'End User')}</option>
                    <option value="Investment">{t('form.purposeInvestment', 'Investment')}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label">{t('form.message', 'Specific Request or Notes')}</label>
                <textarea
                  rows={2}
                  placeholder={t('form.messagePlaceholder', 'Mention target unit area, budget range, or preferred viewing date...')}
                  value={formData.message}
                  onFocus={() => handleInputFocus('message')}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="form-input resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary py-3.5 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{t('cta.requestCallback', 'REQUEST A CALLBACK')}</span>
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 font-light">
                <span>{t('form.hotlineLabel', 'Hotline:')} <a href={TEL_URL} onClick={() => trackClickPhone('modal_footer_link')} className="text-slate-700 font-semibold underline" dir="ltr">{PRIMARY_PHONE}</a></span>
                <span>{t('form.privacyNote', 'Confidential Handling')}</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewingModal;
