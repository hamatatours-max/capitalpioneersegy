import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  MessageCircle, 
  Calendar, 
  CheckCircle2, 
  Sparkles, 
  Maximize2, 
  ArrowRight, 
  ChevronRight, 
  Building2, 
  KeyRound, 
  Compass, 
  ExternalLink,
  Layers,
  CheckCircle,
  Clock,
  ShieldCheck,
  TrendingDown,
  Calculator,
  Percent,
  Check,
  Stethoscope,
  Pill,
  Store,
  Eye,
  Maximize,
  Briefcase,
  Layers2,
  Tag
} from 'lucide-react';
import { Project } from '@/types/project';
import { SEO } from '@/components/common/SEO';
import { submitLead } from '@/services/leadService';
import { LeadFormData, PropertyTypeOption, PurposeOption } from '@/types/lead';
import { useLanguage } from '@/context/LanguageContext';
import { getLocalizedProject } from '@/i18n/projectTranslations';
import { 
  trackClickWhatsApp, 
  trackClickPhone, 
  trackFormStart, 
  trackFormSubmit, 
  trackEvent 
} from '@/services/analyticsService';
import { generateRealEstateListingSchema, generateBreadcrumbSchema } from '@/utils/schemaGenerator';

interface NuxesMallProjectExperienceProps {
  project: Project;
  onRequestViewing?: (projectName?: string) => void;
}

export const NuxesMallProjectExperience: React.FC<NuxesMallProjectExperienceProps> = ({
  project: rawProject,
  onRequestViewing
}) => {
  const { language, isRTL, t } = useLanguage();
  const project = getLocalizedProject(rawProject, language);

  // Active Unit Switcher: 'admin' (43 m² Office) | 'pharmacy' (71 m² Pharmacy)
  const [selectedUnit, setSelectedUnit] = useState<'admin' | 'pharmacy'>('admin');

  // Active Payment Option for Pharmacy: 'installment' | 'cash'
  const [selectedPharmacyPlan, setSelectedPharmacyPlan] = useState<'installment' | 'cash'>('installment');

  // Lightbox Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState<string>('/images/projects/nexus-mall/nexus-mall-admin-43sqm.jpg');
  const [modalCaption, setModalCaption] = useState<string>('');

  // Form State
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [preferredContact, setPreferredContact] = useState<'whatsapp' | 'phone'>('whatsapp');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [whatsappHandoffUrl, setWhatsappHandoffUrl] = useState('');
  const hasStartedForm = useRef(false);
  const formRef = useRef<HTMLDivElement | null>(null);
  const pricingRef = useRef<HTMLDivElement | null>(null);

  // Verified Constants - 43 m² Administrative Office
  const adminPrice = 6149000;
  const adminDownPaymentPercent = 10;
  const adminDownPaymentAmount = 614900;
  const adminRemainingAmount = 5534100;
  const adminInstallmentYears = 6;
  const adminInstallmentMonths = 72;
  const adminMonthlyReference = 76863;
  const adminQuarterlyReference = 230588;
  const adminArea = 43;
  const adminImageUrl = '/images/projects/nexus-mall/nexus-mall-admin-43sqm.jpg';

  // Verified Constants - 71 m² Commercial Pharmacy
  const pharmacyOriginalPrice = 23785000;
  const pharmacyCashDiscountPercent = 30;
  const pharmacyCashPrice = 16649500;
  const pharmacyCashSaving = 7135500;
  const pharmacyDownPaymentPercent = 15;
  const pharmacyDownPaymentAmount = 3567750;
  const pharmacyRemainingAmount = 20217250;
  const pharmacyInstallmentYears = 6;
  const pharmacyArea = 71;
  const pharmacyImageUrl = '/images/projects/nuxes-mall/nuxes-mall-pharmacy.jpg';

  const isAdmin = selectedUnit === 'admin';
  const deliveryYears = language === 'ar' ? 'سنتين' : language === 'de' ? '2 Jahre' : '2 Years';
  const googleMapsUrl = 'https://maps.app.goo.gl/BeYzEtdsVk7a52NMA';

  const locationText = language === 'ar'
    ? 'التجمع الخامس – القطاع الثاني، واجهة مباشرة على شارع بعرض 50 متر، أمام محجوب مباشرة، ثاني نمرة من شارع التسعين الجنوبي.'
    : language === 'de'
    ? '2. Sektor, Fifth Settlement, Front an 50m-Straße, direkt gegenüber Mahgoub, 2. Reihe South 90th Street, Neu-Kairo'
    : 'Second Sector, Fifth Settlement, direct frontage on a 50-meter-wide street, directly opposite Mahgoub, second row from South 90th Street, New Cairo';

  // Analytics on Mount
  useEffect(() => {
    trackEvent('nexus_project_view', {
      project_id: 'nexus-mall',
      location: 'New Cairo - Second Sector South 90th Street 2nd Row',
      selected_unit: selectedUnit,
    });
  }, [selectedUnit]);

  const handleUnitSwitch = (unit: 'admin' | 'pharmacy') => {
    setSelectedUnit(unit);
    trackEvent('nexus_unit_switch', { unit });
  };

  const handleWhatsAppClick = () => {
    const waText = isAdmin
      ? (language === 'ar'
          ? `مرحبًا Capital Pioneers، أستفسر عن المكتب الإداري 43 م² في نيكسس مول (NEXUS MALL) بالتجمع الخامس بالقطاع الثاني (السعر: 6,149,000 ج.م | مقدم 10%: 614,900 ج.م وتقسيط على 6 سنوات | استلام سنتين). برجاء إرسال كافة التفاصيل والمخططات.`
          : `Hello Capital Pioneers, I am inquiring about the 43 m² Administrative Office in NEXUS MALL, New Cairo (Total: EGP 6,149,000 | 10% Down: EGP 614,900 over 6 Years). Please send details.`)
      : (language === 'ar'
          ? `مرحبًا Capital Pioneers، أستفسر عن الصيدلية التجارية 71 م² في نيكسس مول (NEXUS MALL) بالتجمع الخامس (السعر: 23,785,000 ج.م | كاش: 16,649,500 ج.م بخصم 30%). برجاء إرسال التفاصيل.`
          : `Hello Capital Pioneers, I am inquiring about the 71 m² Pharmacy in NEXUS MALL. Please send details.`);

    trackClickWhatsApp('nexus_mall_hero', isAdmin ? 'Nexus Mall Admin Office 43m' : 'Nexus Mall Pharmacy 71m');
    trackEvent('nexus_whatsapp_click', { unit: selectedUnit });
    window.open(`https://wa.me/201066330570?text=${encodeURIComponent(waText)}`, '_blank');
  };

  const scrollToPricing = () => {
    pricingRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToForm = () => {
    const unitTitle = isAdmin 
      ? (language === 'ar' ? 'مكتب إداري 43 م² (مقدم 10% / 6 سنوات)' : '43 m² Administrative Office (10% DP / 6 Years)')
      : (language === 'ar' ? 'صيدلية تجارية 71 م²' : '71 m² Commercial Pharmacy');

    setNotes(
      language === 'ar'
        ? `طلب استفسار ومعاينة بخصوص ${unitTitle} في نيكسس مول — التجمع الخامس`
        : `Inquiry and viewing request for ${unitTitle} in NEXUS MALL, New Cairo`
    );
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFormStart = () => {
    if (!hasStartedForm.current) {
      hasStartedForm.current = true;
      trackFormStart('nexus_lead_form', 'full_name');
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;

    setIsSubmitting(true);
    const unitTitle = isAdmin
      ? 'NEXUS MALL 43 m² Administrative Office (10% DP / 6 Years)'
      : 'NEXUS MALL 71 m² Commercial Pharmacy (30% Cash Offer / 15% DP)';

    const leadData: LeadFormData = {
      fullName: fullName.trim() || (language === 'ar' ? 'مهتم بوحدات نيكسس مول' : 'Nexus Mall Prospect'),
      phoneNumber: phoneNumber.trim(),
      interestedProject: unitTitle,
      propertyType: isAdmin ? 'Office' : 'Commercial',
      purpose: 'Investment' as PurposeOption,
      preferredContactMethod: preferredContact === 'whatsapp' ? 'WhatsApp' : 'Phone',
      message: `${notes ? notes + ' | ' : ''}Unit: ${unitTitle} | Location: Second Sector Fifth Settlement opposite Mahgoub`,
    };

    try {
      await submitLead(leadData);
      trackFormSubmit({
        form_name: 'nexus_lead_form',
        interested_project: unitTitle,
        property_type: isAdmin ? 'Office' : 'Commercial',
        purpose: 'Investment',
      });
      trackEvent('nexus_lead_submit', { unit: selectedUnit });

      const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
      const waText = isAdmin
        ? (language === 'ar'
            ? `مرحبًا Capital Pioneers، أنا ${fullName || 'عميل مهتم'}، أود حجز معاينة وتفاصيل المكتب الإداري 43 م² في نيكسس مول بالتجمع الخامس (السعر: 6,149,000 ج.م | مقدم 10%: 614,900 ج.م على 6 سنوات). رقم هاتفي: ${cleanPhone}.`
            : `Hello Capital Pioneers, my name is ${fullName || 'an interested client'}. I would like to schedule an inspection for the 43 m² Administrative Office in NEXUS MALL. Phone: ${cleanPhone}.`)
        : (language === 'ar'
            ? `مرحبًا Capital Pioneers، أنا ${fullName || 'عميل مهتم'}، أود حجز معاينة وتفاصيل صيدلية نيكسس مول 71 م². رقم هاتفي: ${cleanPhone}.`
            : `Hello Capital Pioneers, my name is ${fullName || 'an interested client'}. I would like to schedule an inspection for the 71 m² Pharmacy in NEXUS MALL. Phone: ${cleanPhone}.`);

      const directWaUrl = `https://wa.me/201066330570?text=${encodeURIComponent(waText)}`;
      setWhatsappHandoffUrl(directWaUrl);
      setFormSubmitted(true);
    } catch (err) {
      console.error('Failed to submit Nexus Mall lead:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openLightbox = (imgSrc: string, captionText: string) => {
    setModalImageSrc(imgSrc);
    setModalCaption(captionText);
    setIsModalOpen(true);
    trackEvent('nexus_image_zoom', { image: imgSrc });
  };

  // Structured Data (JSON-LD)
  const realEstateSchema = generateRealEstateListingSchema(project);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: language === 'ar' ? 'الرئيسية' : 'Home', item: '/' },
    { name: language === 'ar' ? 'المشروعات' : 'Projects', item: '/projects' },
    { name: 'NEXUS MALL', item: '/projects/nexus-mall' },
  ]);

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'NEXUS MALL 43 sqm Administrative Office & Commercial Units New Cairo',
    description: '43 sqm administrative office with 10% down payment over 6 years and 71 sqm ground floor pharmacy in NEXUS MALL, Second Sector, Fifth Settlement, New Cairo.',
    image: `https://capitalpioneers.com${adminImageUrl}`,
    category: 'Commercial & Administrative Real Estate',
    offers: [
      {
        '@type': 'Offer',
        name: '43 sqm Administrative Office 6 Years Plan',
        price: '6149000',
        priceCurrency: 'EGP',
        availability: 'https://schema.org/InStock',
        priceValidUntil: '2026-12-31',
        url: 'https://capitalpioneers.com/projects/nexus-mall',
      },
      {
        '@type': 'Offer',
        name: '71 sqm Pharmacy 30% Cash Discount Offer',
        price: '16649500',
        priceCurrency: 'EGP',
        availability: 'https://schema.org/InStock',
        priceValidUntil: '2026-12-31',
        url: 'https://capitalpioneers.com/projects/nexus-mall',
      }
    ],
  };

  return (
    <div className={`min-h-screen bg-[#061D28] text-slate-100 selection:bg-[#C5A880] selection:text-[#061D28] ${isRTL ? 'font-cairo' : 'font-sans'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <SEO
        title={isAdmin
          ? (language === 'ar' ? 'مكتب إداري 43 متر للبيع في نيكسس مول التجمع الخامس | مقدم 10%' : '43 sqm Administrative Office in NEXUS MALL New Cairo | 10% Down')
          : (language === 'ar' ? 'صيدلية 71 متر للبيع في نيكسس مول التجمع الخامس | خصم كاش 30%' : '71 sqm Pharmacy in NEXUS MALL New Cairo | 30% Cash Discount')}
        description={isAdmin
          ? (language === 'ar' ? 'مكتب إداري 43 م² للبيع في نيكسس مول بالقطاع الثاني بالتجمع الخامس، أمام محجوب مباشرة وثاني نمرة من التسعين الجنوبي. السعر: 6,149,000 ج.م بمقدم 10% وأقساط 6 سنوات.' : '43 sqm administrative office for sale in NEXUS MALL, Second Sector, Fifth Settlement, New Cairo. Directly opposite Mahgoub, 2nd row South 90th St. EGP 6.149M with 10% down over 6 years.')
          : (language === 'ar' ? 'صيدلية 71 م² بالدور الأرضي بمشروع نيكسس مول، ثاني نمرة من التسعين الجنوبي. مقدم 15% على 6 سنوات أو خصم كاش 30% وتوفير 7,135,500 ج.م.' : '71 sqm ground floor pharmacy in NEXUS MALL New Cairo. 15% down over 6 years or 30% cash discount saving EGP 7.135M.')}
        canonicalPath="/projects/nexus-mall"
        ogType="website"
        ogImage={`https://capitalpioneers.com${isAdmin ? adminImageUrl : pharmacyImageUrl}`}
        schema={[breadcrumbSchema, realEstateSchema, productSchema]}
      />

      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-gradient-to-b from-[#04121A] via-[#061D28] to-[#082938]">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[#0B4D68]/20 blur-[140px] pointer-events-none rounded-full" />
        <div className="absolute top-10 right-10 w-96 h-96 bg-[#C5A880]/15 blur-[120px] pointer-events-none rounded-full" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* UNIT SELECTOR TABS */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            <button
              type="button"
              onClick={() => handleUnitSwitch('admin')}
              className={`px-6 py-3.5 rounded-2xl font-semibold text-xs sm:text-sm flex items-center gap-2.5 transition-all shadow-lg ${
                isAdmin
                  ? 'bg-gradient-to-r from-[#C5A880] to-[#DFCA9F] text-[#061D28] ring-4 ring-[#C5A880]/20 scale-105'
                  : 'bg-white/10 text-slate-300 hover:bg-white/15 border border-white/10'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>{language === 'ar' ? 'مكتب إداري 43 م² (مقدم 10% • 6 سنوات)' : '43 m² Administrative Office (10% DP • 6 Years)'}</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-700 text-white text-[10px] font-bold">
                {language === 'ar' ? 'متاح الآن' : 'AVAILABLE'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleUnitSwitch('pharmacy')}
              className={`px-6 py-3.5 rounded-2xl font-semibold text-xs sm:text-sm flex items-center gap-2.5 transition-all shadow-lg ${
                !isAdmin
                  ? 'bg-gradient-to-r from-[#C5A880] to-[#DFCA9F] text-[#061D28] ring-4 ring-[#C5A880]/20 scale-105'
                  : 'bg-white/10 text-slate-300 hover:bg-white/15 border border-white/10'
              }`}
            >
              <Pill className="w-4 h-4" />
              <span>{language === 'ar' ? 'صيدلية تجارية 71 م² دور أرضي' : '71 m² Ground Floor Pharmacy'}</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-700 text-white text-[10px] font-bold">
                {language === 'ar' ? 'خصم 30%' : '30% CASH'}
              </span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Badges Strip */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#C5A880]/20 border border-[#C5A880]/40 text-[#DFCA9F] text-xs font-semibold tracking-wider uppercase">
                  <Building2 className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>{language === 'ar' ? 'نيكسس مول • القطاع الثاني' : 'NEXUS MALL • Second Sector'}</span>
                </span>

                {isAdmin ? (
                  <>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-300 text-xs font-bold">
                      <Briefcase className="w-3.5 h-3.5" />
                      <span>{language === 'ar' ? 'مكتب إداري 43 م²' : 'ADMINISTRATIVE OFFICE 43 m²'}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{language === 'ar' ? 'متاح للتعاقد' : 'AVAILABLE'}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-bold">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{language === 'ar' ? 'الاستلام خلال سنتين' : '2 YEARS DELIVERY'}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold">
                      <Percent className="w-3.5 h-3.5" />
                      <span>{language === 'ar' ? 'مقدم 10% فقط' : '10% DOWN PAYMENT'}</span>
                    </span>
                  </>
                ) : (
                  <>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                      <Pill className="w-3.5 h-3.5" />
                      <span>{language === 'ar' ? 'صيدلية 71 م²' : '71 m² Pharmacy'}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold">
                      <Tag className="w-3.5 h-3.5" />
                      <span>{language === 'ar' ? 'خصم كاش 30%' : '30% Cash Offer'}</span>
                    </span>
                  </>
                )}
              </div>

              {/* Title & Tagline */}
              <div className="space-y-2.5">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-white tracking-tight leading-[1.15]">
                  {isAdmin 
                    ? (language === 'ar' ? 'مكتب إداري للبيع في نيكسس مول' : '43 m² Administrative Office in NEXUS MALL')
                    : (language === 'ar' ? 'صيدلية تجارية في نيكسس مول' : '71 m² Pharmacy in NEXUS MALL')}
                </h1>
                <p className="text-lg sm:text-xl font-semibold text-[#DFCA9F] leading-relaxed">
                  {isAdmin
                    ? (language === 'ar' 
                        ? 'مساحة 43 م² بالواجهة الزجاجية الفاخرة — مقدم 10% (614,900 ج.م) وأقساط على 6 سنوات' 
                        : '43 m² on modern glass curtain facade — 10% Down Payment (EGP 614,900) & 6-Year Installments')
                    : (language === 'ar' 
                        ? '71 م² دور أرضي بواجهة على شارع السبعين — خصم كاش 30% بتوفير 7,135,500 ج.م' 
                        : '71 m² Ground Floor with 30% Cash Discount saving EGP 7,135,500')}
                </p>
              </div>

              {/* Location Highlights Card */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-2 text-sm text-slate-300">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-5 h-5 text-[#C5A880] shrink-0 mt-0.5" />
                  <p className="leading-relaxed font-medium">
                    {locationText}
                  </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/10 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{language === 'ar' ? 'القطاع الثاني' : 'Second Sector'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{language === 'ar' ? 'شارع بعرض 50م' : '50m Street Front'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{language === 'ar' ? 'أمام محجوب مباشرة' : 'Opposite Mahgoub'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{language === 'ar' ? 'ثاني نمرة من الـ 90' : '2nd Row South 90th'}</span>
                  </div>
                </div>
              </div>

              {/* PROMINENT PRICING BLOCK */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0B4D68]/50 via-[#061D28] to-[#04121A] border border-[#C5A880]/70 ring-2 ring-[#C5A880]/20 shadow-2xl space-y-4">
                
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-[#DFCA9F]" />
                    <span className="text-xs text-[#DFCA9F] font-bold uppercase tracking-wider">
                      {isAdmin 
                        ? (language === 'ar' ? 'خطة سداد ميسرة: مقدم 10% وتقسيط 6 سنوات' : 'Verified Plan: 10% Down Payment over 6 Years')
                        : (language === 'ar' ? 'خيارات سداد الصيدلية' : 'Pharmacy Payment Options')}
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-500/30">
                    {isAdmin ? (language === 'ar' ? '72 شهرًا' : '72 Months') : (language === 'ar' ? 'خصم كاش 30%' : '30% Cash Offer')}
                  </span>
                </div>

                {isAdmin ? (
                  /* Admin 43 m² Price Breakdown */
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-left sm:text-center">
                      <span className="text-[11px] text-slate-400 block mb-1 uppercase font-bold">
                        {language === 'ar' ? 'إجمالي السعر' : 'TOTAL PRICE'}
                      </span>
                      <div className="text-2xl sm:text-3xl font-semibold text-white font-mono tabular-nums" dir="ltr">
                        {adminPrice.toLocaleString()} EGP
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        {language === 'ar' ? '6,149,000 جنيه مصري' : '6,149,000 EGP'}
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-[#0B4D68]/60 border border-[#C5A880] text-left sm:text-center ring-2 ring-[#C5A880]/30">
                      <span className="text-[11px] text-[#DFCA9F] block mb-1 uppercase font-bold">
                        {language === 'ar' ? 'المقدم (10%)' : 'DOWN PAYMENT (10%)'}
                      </span>
                      <div className="text-2xl sm:text-3xl font-semibold text-emerald-400 font-mono tabular-nums" dir="ltr">
                        {adminDownPaymentAmount.toLocaleString()} EGP
                      </div>
                      <span className="text-[10px] text-emerald-300 mt-1 block font-semibold">
                        {language === 'ar' ? '614,900 جنيه فقط' : 'EGP 614,900 only'}
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-left sm:text-center">
                      <span className="text-[11px] text-slate-400 block mb-1 uppercase font-bold">
                        {language === 'ar' ? 'المتبقي (6 سنوات)' : 'REMAINING (6 YRS)'}
                      </span>
                      <div className="text-2xl sm:text-3xl font-semibold text-cyan-300 font-mono tabular-nums" dir="ltr">
                        {adminRemainingAmount.toLocaleString()} EGP
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        {language === 'ar' ? 'تسهيلات على 72 شهرًا' : 'Over 72 Months'}
                      </span>
                    </div>
                  </div>
                ) : (
                  /* Pharmacy 71 m² Price Breakdown */
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                    <div className="p-4 rounded-xl bg-[#0B4D68]/60 border border-[#C5A880] text-left sm:text-center">
                      <span className="text-[11px] text-[#DFCA9F] block mb-1 uppercase font-bold">
                        {language === 'ar' ? 'سعر الكاش (خصم 30%)' : '30% CASH PRICE'}
                      </span>
                      <div className="text-2xl sm:text-3xl font-semibold text-emerald-400 font-mono tabular-nums" dir="ltr">
                        {pharmacyCashPrice.toLocaleString()} EGP
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        <span className="line-through">{pharmacyOriginalPrice.toLocaleString()} EGP</span>
                        <span className="text-emerald-400 font-bold ml-1.5">(توفير 7.135M ج.م)</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-left sm:text-center">
                      <span className="text-[11px] text-slate-400 block mb-1 uppercase font-bold">
                        {language === 'ar' ? 'سعر التقسيط (مقدم 15%)' : 'INSTALLMENTS (15% DP)'}
                      </span>
                      <div className="text-2xl sm:text-3xl font-semibold text-white font-mono tabular-nums" dir="ltr">
                        {pharmacyOriginalPrice.toLocaleString()} EGP
                      </div>
                      <div className="text-xs text-cyan-300 mt-1">
                        مقدم: 3,567,750 ج.م على 6 سنوات
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <button
                  type="button"
                  onClick={handleWhatsAppClick}
                  className="px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm sm:text-base flex items-center gap-3 transition-all shadow-lg shadow-emerald-900/30 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
                  <span>{language === 'ar' ? 'تواصل فوري عبر واتساب' : 'Inquire via WhatsApp'}</span>
                </button>

                <button
                  type="button"
                  onClick={scrollToForm}
                  className="px-7 py-4 rounded-xl bg-gradient-to-r from-[#C5A880] to-[#DFCA9F] hover:from-[#DFCA9F] hover:to-[#C5A880] text-[#061D28] font-semibold text-sm sm:text-base flex items-center gap-2.5 transition-all shadow-lg shadow-[#C5A880]/20 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>{language === 'ar' ? 'حجز موعد للمعاينة' : 'Request Inspection'}</span>
                  <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                </button>

                <button
                  type="button"
                  onClick={() => openLightbox(
                    isAdmin ? adminImageUrl : pharmacyImageUrl,
                    isAdmin
                      ? (language === 'ar' ? 'نيكسس مول – موقع المكتب الإداري 43 م² بالواجهة الزجاجية' : 'NEXUS MALL – 43 m² Administrative Office Unit Location')
                      : (language === 'ar' ? 'نيكسس مول – صيدلية 71 م² بالدور الأرضي' : 'NEXUS MALL – 71 m² Ground Floor Pharmacy')
                  )}
                  className="px-6 py-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm flex items-center gap-2 border border-white/15 transition-all"
                >
                  <Maximize2 className="w-4 h-4 text-[#C5A880]" />
                  <span>{language === 'ar' ? 'تكبير صورة المشروع' : 'View Full Image'}</span>
                </button>
              </div>

            </div>

            {/* Right Media Preview Column */}
            <div className="lg:col-span-5">
              <div className="relative group rounded-3xl overflow-hidden bg-white/5 border border-white/15 p-4 backdrop-blur-md shadow-2xl">
                
                {/* Header Tag */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-xs">
                  <div className="flex items-center gap-2 text-[#DFCA9F] font-bold">
                    <Building2 className="w-4 h-4" />
                    <span>{isAdmin ? (language === 'ar' ? 'صورة الواجهة وتحديد موقع المكتب' : 'Architectural Facade & Unit Pointer') : (language === 'ar' ? 'موقع صيدلية الدور الأرضي' : 'Ground Floor Pharmacy Location')}</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono tabular-nums text-[11px] font-bold">
                    {isAdmin ? '43 m² • 10% Down' : '71 m² • Ground Floor'}
                  </span>
                </div>

                {/* Clickable Image Container */}
                <div 
                  onClick={() => openLightbox(
                    isAdmin ? adminImageUrl : pharmacyImageUrl,
                    isAdmin
                      ? (language === 'ar' ? 'نيكسس مول – موقع المكتب الإداري 43 م² بالواجهة الزجاجية' : 'NEXUS MALL – 43 m² Administrative Office Unit Location')
                      : (language === 'ar' ? 'نيكسس مول – صيدلية 71 م² بالدور الأرضي' : 'NEXUS MALL – 71 m² Ground Floor Pharmacy')
                  )}
                  className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900 cursor-pointer group"
                >
                  <img
                    src={isAdmin ? adminImageUrl : pharmacyImageUrl}
                    alt={isAdmin
                      ? (language === 'ar' ? 'مكتب إداري 43 متر في نيكسس مول التجمع الخامس القطاع الثاني أمام محجوب مباشرة' : 'Administrative office unit 43 sqm at NEXUS MALL New Cairo Second Sector opposite Mahgoub')
                      : (language === 'ar' ? 'صيدلية 71 متر في نيكسس مول التجمع الخامس' : '71 sqm Pharmacy in NEXUS MALL New Cairo')}
                    title={isAdmin
                      ? (language === 'ar' ? 'نيكسس مول – موقع المكتب الإداري 43 م² بالواجهة الزجاجية' : 'NEXUS MALL – 43 m² Administrative Office Unit Location')
                      : (language === 'ar' ? 'نيكسس مول – صيدلية 71 م² بالدور الأرضي' : 'NEXUS MALL – 71 m² Ground Floor Pharmacy')}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="eager"
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-[#061D28]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-sm backdrop-blur-[2px]">
                    <Maximize className="w-5 h-5 text-[#DFCA9F]" />
                    <span>{language === 'ar' ? 'انقر لتكبير الصورة بالكامل' : 'Click to View Full Resolution'}</span>
                  </div>

                  {/* Marker Legend Badge */}
                  <div className="absolute bottom-2 left-2 right-2 bg-[#061D28]/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/15 text-[11px] text-slate-200 flex items-center justify-between">
                    <span className="font-semibold text-[#DFCA9F]">
                      {isAdmin 
                        ? (language === 'ar' ? 'موقع الوحدة محدد بالمؤشر على الواجهة' : 'Unit location indicated by pointer on facade') 
                        : (language === 'ar' ? 'صيدلية الدور الأرضي' : 'Ground Floor Pharmacy')}
                    </span>
                    <span className="text-emerald-400 font-bold">
                      {language === 'ar' ? 'استلام سنتين' : '2 Years Delivery'}
                    </span>
                  </div>
                </div>

                {/* Fast Specs Strip */}
                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-white/10 text-center text-xs">
                  <div className="p-2 rounded-xl bg-white/5">
                    <span className="text-slate-400 block text-[10px]">{language === 'ar' ? 'المساحة' : 'Area'}</span>
                    <strong className="text-white font-bold text-sm">{isAdmin ? '43 m²' : '71 m²'}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5">
                    <span className="text-slate-400 block text-[10px]">{language === 'ar' ? 'المقدم' : 'Down Payment'}</span>
                    <strong className="text-[#DFCA9F] font-bold text-sm">{isAdmin ? '10%' : '15%'}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5">
                    <span className="text-slate-400 block text-[10px]">{language === 'ar' ? 'التقسيط' : 'Installments'}</span>
                    <strong className="text-emerald-400 font-bold text-sm">{language === 'ar' ? '6 سنوات' : '6 Years'}</strong>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. SPECIFICATION CARDS SECTION */}
      <section className="py-20 bg-[#04121A] border-y border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-14">
            <span className="px-3.5 py-1.5 rounded-full bg-[#C5A880]/15 text-[#DFCA9F] text-xs font-semibold uppercase tracking-wider border border-[#C5A880]/30 inline-block">
              {language === 'ar' ? 'المواصفات والمعايير الفنية' : 'Key Specifications'}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white">
              {isAdmin 
                ? (language === 'ar' ? 'مواصفات المكتب الإداري — نيكسس مول' : '43 m² Office Specifications — NEXUS MALL')
                : (language === 'ar' ? 'مواصفات الصيدلية التجارية — نيكسس مول' : '71 m² Pharmacy Specifications — NEXUS MALL')}
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              {isAdmin
                ? (language === 'ar'
                    ? 'أبرز مميزات الوحدة الإدارية بموقعها الحيوي بالقطاع الثاني بالتجمع الخامس.'
                    : 'Turnkey administrative office features in the prime business corridor of Fifth Settlement.')
                : (language === 'ar'
                    ? 'مواصفات ومزايا صيدلية الدور الأرضي مع واجهة حيوية.'
                    : 'Ground floor pharmacy specifications with high commercial traffic.')}
            </p>
          </div>

          {isAdmin ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="p-5 rounded-2xl bg-[#061D28] border border-slate-800 text-center space-y-2">
                <div className="text-3xl font-semibold text-white font-mono tabular-nums" dir="ltr">43 m²</div>
                <div className="text-xs font-bold text-[#DFCA9F] uppercase">{language === 'ar' ? 'المساحة' : 'AREA'}</div>
              </div>

              <div className="p-5 rounded-2xl bg-[#061D28] border border-slate-800 text-center space-y-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-blue-300 uppercase">{language === 'ar' ? 'نشاط إداري' : 'ADMIN OFFICE'}</div>
              </div>

              <div className="p-5 rounded-2xl bg-[#061D28] border border-slate-800 text-center space-y-2">
                <div className="text-3xl font-semibold text-white font-mono tabular-nums" dir="ltr">10%</div>
                <div className="text-xs font-bold text-emerald-400 uppercase">{language === 'ar' ? 'مقدم التعاقد' : 'DOWN PAYMENT'}</div>
              </div>

              <div className="p-5 rounded-2xl bg-[#061D28] border border-slate-800 text-center space-y-2">
                <div className="text-3xl font-semibold text-cyan-300 font-mono tabular-nums" dir="ltr">6 Yrs</div>
                <div className="text-xs font-bold text-cyan-300 uppercase">{language === 'ar' ? 'مدة التقسيط' : '72 MONTHS'}</div>
              </div>

              <div className="p-5 rounded-2xl bg-[#061D28] border border-slate-800 text-center space-y-2">
                <div className="text-3xl font-semibold text-amber-300 font-mono tabular-nums" dir="ltr">2 Yrs</div>
                <div className="text-xs font-bold text-amber-300 uppercase">{language === 'ar' ? 'الاستلام' : '2 YRS DELIVERY'}</div>
              </div>

              <div className="p-5 rounded-2xl bg-[#061D28] border border-slate-800 text-center space-y-2">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center mx-auto">
                  <Eye className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-purple-300 uppercase">{language === 'ar' ? 'شارع 50 متر' : '50M STREET'}</div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-[#061D28] border border-slate-800 text-center space-y-2">
                <div className="text-3xl font-semibold text-white font-mono tabular-nums" dir="ltr">71 m²</div>
                <div className="text-xs font-bold text-[#DFCA9F] uppercase">{language === 'ar' ? 'المساحة' : 'AREA'}</div>
              </div>
              <div className="p-5 rounded-2xl bg-[#061D28] border border-slate-800 text-center space-y-2">
                <div className="text-3xl font-semibold text-purple-400">{language === 'ar' ? 'دور أرضي' : 'GROUND'}</div>
                <div className="text-xs font-bold text-purple-300 uppercase">{language === 'ar' ? 'الدور الأرضي' : 'GROUND FLOOR'}</div>
              </div>
              <div className="p-5 rounded-2xl bg-[#061D28] border border-slate-800 text-center space-y-2">
                <div className="text-3xl font-semibold text-emerald-400 font-mono tabular-nums" dir="ltr">30%</div>
                <div className="text-xs font-bold text-emerald-300 uppercase">{language === 'ar' ? 'خصم الكاش' : 'CASH DISCOUNT'}</div>
              </div>
              <div className="p-5 rounded-2xl bg-[#061D28] border border-slate-800 text-center space-y-2">
                <div className="text-3xl font-semibold text-cyan-300 font-mono tabular-nums" dir="ltr">2 Yrs</div>
                <div className="text-xs font-bold text-cyan-300 uppercase">{language === 'ar' ? 'مدة الاستلام' : '2 YRS DELIVERY'}</div>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* 3. VERIFIED PAYMENT PLAN BREAKDOWN */}
      <section ref={pricingRef} className="py-20 bg-[#061D28]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-14">
            <span className="px-3.5 py-1.5 rounded-full bg-[#C5A880]/15 text-[#DFCA9F] text-xs font-semibold uppercase tracking-wider border border-[#C5A880]/30 inline-block">
              {language === 'ar' ? 'جدول الدفع وأنظمة السداد المعتمدة' : 'Verified Payment Structure'}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white">
              {isAdmin 
                ? (language === 'ar' ? 'خطة سداد المكتب الإداري (10% مقدم / 6 سنوات)' : '43 m² Administrative Office Payment Plan (10% DP / 6 Years)')
                : (language === 'ar' ? 'أنظمة سداد الصيدلية (كاش وتقسيط)' : 'Pharmacy Payment Options')}
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              {isAdmin
                ? (language === 'ar'
                    ? 'تفاصيل الدفع الدقيقة: مقدم 10% (614,900 ج.م) والمتبقي (5,534,100 ج.م) بتسهيلات على 6 سنوات (72 شهرًا).'
                    : 'Exact payment breakdown: 10% Down Payment (EGP 614,900) and remaining EGP 5,534,100 over 6 years (72 months).')
                : (language === 'ar'
                    ? 'اختر بين عرض خصم الكاش 30% أو نظام التقسيط بمقدم 15% على 6 سنوات.'
                    : 'Choose between the 30% cash discount offer or the 15% down payment 6-year installment plan.')}
            </p>
          </div>

          {isAdmin ? (
            /* Single Verified 10% DP / 6 Years Plan for Admin Office */
            <div className="max-w-3xl mx-auto p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-[#0B4D68]/30 via-[#061D28] to-[#04121A] border border-[#C5A880] ring-4 ring-[#C5A880]/15 shadow-2xl space-y-6">
              
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <span className="text-xs text-[#DFCA9F] font-bold uppercase tracking-wider block">
                    {language === 'ar' ? 'نظام التقسيط المعتمد' : 'Official Payment Plan'}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-semibold text-white">
                    {language === 'ar' ? 'مقدم 10% وتقسيط على 6 سنوات (72 شهرًا)' : '10% Down Payment & 6 Years Installments (72 Mos)'}
                  </h3>
                </div>
                <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
                  {language === 'ar' ? 'الاستلام خلال سنتين' : '2 Years Delivery'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-xs text-slate-400 block">{language === 'ar' ? 'إجمالي سعر الوحدة الإدارية:' : 'Total Unit Price:'}</span>
                  <div className="text-2xl sm:text-3xl font-semibold text-white font-mono tabular-nums" dir="ltr">
                    {adminPrice.toLocaleString()} EGP
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#0B4D68]/60 border border-[#C5A880] space-y-1">
                  <span className="text-xs text-[#DFCA9F] block font-bold">{language === 'ar' ? 'المقدم المطلوب (10%):' : 'Down Payment (10%):'}</span>
                  <div className="text-2xl sm:text-3xl font-semibold text-emerald-400 font-mono tabular-nums" dir="ltr">
                    {adminDownPaymentAmount.toLocaleString()} EGP
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2.5 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span>{language === 'ar' ? 'المبلغ المتبقي للتقسيط:' : 'Remaining Balance:'}</span>
                  <strong className="font-mono tabular-nums text-white text-sm">{adminRemainingAmount.toLocaleString()} EGP</strong>
                </div>
                <div className="flex items-center justify-between text-cyan-300 font-semibold pt-2 border-t border-white/10">
                  <span>{language === 'ar' ? 'مدة سداد المتبقي:' : 'Installment Period:'}</span>
                  <span className="font-bold">{language === 'ar' ? '6 سنوات (72 شهرًا)' : '6 Years (72 Months)'}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400 pt-2 border-t border-white/10 text-[11px]">
                  <span>{language === 'ar' ? 'القسط الشهري الاسترشادي (في حال أقساط شهرية متساوية):' : 'Monthly reference (if equal monthly installments):'}</span>
                  <strong className="font-mono tabular-nums text-white">EGP {adminMonthlyReference.toLocaleString()} / mo</strong>
                </div>
              </div>

              <button
                type="button"
                onClick={scrollToForm}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#C5A880] to-[#DFCA9F] text-[#061D28] font-semibold text-sm transition-all hover:opacity-95 flex items-center justify-center gap-2 shadow-lg"
              >
                <span>{language === 'ar' ? 'حجز وتأكيد خطة السداد للمكتب 43 م²' : 'Book 43 m² Office Payment Plan'}</span>
                <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
              </button>

            </div>
          ) : (
            /* Pharmacy Plans Comparison */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="p-8 rounded-3xl bg-[#04121A] border border-[#C5A880] flex flex-col justify-between">
                <div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-4 inline-block">
                    عرض الكاش (خصم 30%)
                  </span>
                  <div className="text-3xl font-semibold text-white font-mono tabular-nums mb-2" dir="ltr">
                    {pharmacyCashPrice.toLocaleString()} EGP
                  </div>
                  <p className="text-xs text-slate-400 mb-4">
                    وفر 7,135,500 جنيه مقارنة بالسعر الأساسي (23,785,000 ج.م).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={scrollToForm}
                  className="w-full py-3.5 rounded-xl bg-[#C5A880] text-[#061D28] font-bold text-xs"
                >
                  اختيار عرض الكاش
                </button>
              </div>

              <div className="p-8 rounded-3xl bg-[#04121A] border border-slate-800 flex flex-col justify-between">
                <div>
                  <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold mb-4 inline-block">
                    خطة التقسيط (مقدم 15%)
                  </span>
                  <div className="text-3xl font-semibold text-white font-mono tabular-nums mb-2" dir="ltr">
                    {pharmacyOriginalPrice.toLocaleString()} EGP
                  </div>
                  <p className="text-xs text-slate-400 mb-4">
                    مقدم 15% (3,567,750 ج.م) وأقساط على 6 سنوات مع استلام خلال سنتين.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={scrollToForm}
                  className="w-full py-3.5 rounded-xl bg-[#0B4D68] text-white font-bold text-xs"
                >
                  اختيار خطة التقسيط
                </button>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* 4. LEAD CAPTURE & ADVISOR INQUIRY */}
      <section ref={formRef} className="py-20 bg-[#04121A] border-t border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-2xl mx-auto p-8 sm:p-10 rounded-3xl bg-[#061D28] border border-slate-800 shadow-2xl relative">
            
            <div className="text-center space-y-2 mb-8">
              <span className="px-3.5 py-1.5 rounded-full bg-[#C5A880]/15 text-[#DFCA9F] text-xs font-semibold uppercase tracking-wider border border-[#C5A880]/30 inline-block">
                {language === 'ar' ? 'حجز واستفسار مباشر' : 'Schedule Viewing & Consultation'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-semibold text-white">
                {language === 'ar' ? 'تواصل مع مستشار نيكسس مول' : 'Connect with NEXUS MALL Specialist'}
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm">
                {language === 'ar'
                  ? 'سجل بياناتك وسيتم التواصل معك مباشرة لتزويدك بكافة تفاصيل الحجز والمخططات الهندسية.'
                  : 'Submit your contact details for instant blueprint layouts and viewing coordination.'}
              </p>
            </div>

            {formSubmitted ? (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h3 className="text-lg font-bold text-white">
                  {language === 'ar' ? 'تم استلام طلبك بنجاح!' : 'Request Received Successfully!'}
                </h3>
                <p className="text-xs text-slate-300">
                  {language === 'ar' 
                    ? 'تم تسجيل اهتمامك بنيكسس مول وسيقوم مستشار المشروعات بالتواصل معك فورًا.'
                    : 'Our commercial and administrative advisor for New Cairo will reach out to you shortly.'}
                </p>
                {whatsappHandoffUrl && (
                  <a
                    href={whatsappHandoffUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-lg mt-2"
                  >
                    <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
                    <span>{language === 'ar' ? 'المتابعة المباشرة عبر واتساب الآن' : 'Continue on WhatsApp Now'}</span>
                  </a>
                )}
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    {language === 'ar' ? 'الاسم الكامل:' : 'Full Name:'}
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      handleFormStart();
                    }}
                    placeholder={language === 'ar' ? 'أدخل اسمك الكريم' : 'Enter your full name'}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#C5A880] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    {language === 'ar' ? 'رقم الهاتف / واتساب:' : 'Phone / WhatsApp Number:'} <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value);
                      handleFormStart();
                    }}
                    placeholder="+20 1X XXXX XXXX"
                    dir="ltr"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#C5A880] transition-colors font-mono tabular-nums text-left"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    {language === 'ar' ? 'الوحدة المهتم بها:' : 'Interested Unit:'}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedUnit('admin')}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                        isAdmin
                          ? 'bg-[#0B4D68] border-[#C5A880] text-white shadow-md'
                          : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      {language === 'ar' ? 'مكتب إداري 43 م²' : 'Admin Office 43 m²'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedUnit('pharmacy')}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                        !isAdmin
                          ? 'bg-[#0B4D68] border-[#C5A880] text-white shadow-md'
                          : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      {language === 'ar' ? 'صيدلية 71 م²' : 'Pharmacy 71 m²'}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    {language === 'ar' ? 'ملاحظات أو استفسارات إضافية:' : 'Additional Inquiries:'}
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={language === 'ar' ? 'أضف أي استفسارات أو أوقات مفضلة للمعاينة...' : 'Add any specific inquiries or preferred inspection timing...'}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#C5A880] transition-colors resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || !phoneNumber.trim()}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-[#C5A880] to-[#DFCA9F] hover:from-[#DFCA9F] hover:to-[#C5A880] text-[#061D28] font-semibold text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
                  >
                    {isSubmitting ? (
                      <span>{language === 'ar' ? 'جاري الإرسال...' : 'Submitting...'}</span>
                    ) : (
                      <>
                        <span>{language === 'ar' ? 'تأكيد طلب التفاصيل والمعاينة' : 'Confirm Inquiry Request'}</span>
                        <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                      </>
                    )}
                  </button>
                </div>

              </form>
            )}

          </div>

        </div>
      </section>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="relative max-w-5xl w-full max-h-[90vh] bg-[#061D28] border border-slate-700 rounded-3xl overflow-hidden shadow-2xl p-4 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-700 text-white">
              <div className="space-y-0.5">
                <h3 className="text-base sm:text-lg font-semibold text-[#DFCA9F]">
                  {modalCaption || (language === 'ar' ? 'نيكسس مول — التجمع الخامس' : 'NEXUS MALL — Fifth Settlement')}
                </h3>
                <p className="text-xs text-slate-400">
                  {locationText}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors text-xs font-bold px-3"
              >
                ✕ {language === 'ar' ? 'إغلاق' : 'Close'}
              </button>
            </div>

            {/* Image Box */}
            <div className="flex-1 overflow-auto max-h-[75vh] flex items-center justify-center bg-black/50 rounded-2xl p-2">
              <img
                src={modalImageSrc}
                alt={modalCaption || 'NEXUS MALL unit showcase'}
                title={modalCaption || 'NEXUS MALL unit showcase'}
                className="max-w-full max-h-full object-contain rounded-xl"
              />
            </div>

            {/* Modal Footer */}
            <div className="pt-3 mt-2 border-t border-slate-700 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
              <span>{isAdmin ? (language === 'ar' ? 'المؤشر يحدد موقع المكتب الإداري 43 م² على الواجهة' : 'Pointer highlights 43 m² office unit on the glass facade') : (language === 'ar' ? 'موقع صيدلية الدور الأرضي' : 'Ground floor pharmacy')}</span>
              <button
                type="button"
                onClick={handleWhatsAppClick}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'استفسار عبر واتساب' : 'Inquire on WhatsApp'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
