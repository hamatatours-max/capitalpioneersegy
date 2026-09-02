import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  Phone, 
  MessageCircle, 
  Calendar, 
  CheckCircle2, 
  Sparkles, 
  Maximize2, 
  ArrowRight, 
  Building2, 
  KeyRound, 
  Layers, 
  Check, 
  Eye, 
  ShieldCheck, 
  Clock, 
  Briefcase, 
  Tag, 
  Maximize, 
  Home, 
  ExternalLink,
  Bed,
  Bath,
  Utensils,
  Compass
} from 'lucide-react';
import { Project } from '@/types/project';
import { SEO } from '@/components/common/SEO';
import { submitLead, PRIMARY_PHONE, TEL_URL } from '@/services/leadService';
import { LeadFormData, PurposeOption } from '@/types/lead';
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

interface AlAndalus641ProjectExperienceProps {
  project: Project;
  onRequestViewing?: (projectName?: string) => void;
}

export const AlAndalus641ProjectExperience: React.FC<AlAndalus641ProjectExperienceProps> = ({
  project: rawProject,
  onRequestViewing
}) => {
  const { language, isRTL, t } = useLanguage();
  const project = getLocalizedProject(rawProject, language);

  // Lightbox Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

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
  const detailsRef = useRef<HTMLDivElement | null>(null);

  // Verified Constants - Project No. 641 (Al Andalus 2 - 184 m²)
  const totalPrice = 4416000;
  const downPaymentPercent = 50;
  const downPaymentAmount = 2208000;
  const installmentYears = 2;
  const installmentMonths = 24;
  const monthlyInstallment = 92000;
  const areaSqm = 184;
  const floorName = language === 'ar' ? 'الدور الرابع' : 'Fourth Floor';
  const finishingStatus = language === 'ar' ? 'نص تشطيب' : 'Semi-Finished';
  const mapUrl = 'https://maps.app.goo.gl/hdPSt3ywa2nup8KN8';
  const buildingPhotoUrl = '/images/projects/al-andalus-641/al-andalus-641-building-facade.jpg';

  const locationText = language === 'ar'
    ? 'الأندلس 2 – دخلة من شارع التسعين الجنوبي – فيو جاردن'
    : 'Al Andalus 2 – Access from South 90th Street – Garden View';

  // Analytics on Mount
  useEffect(() => {
    trackEvent('andalus_641_view', {
      project_id: 'project-641-al-andalus-2',
      location: 'Al Andalus 2',
      area: '184',
      price: '4416000',
    });
  }, []);

  const handleWhatsAppClick = () => {
    const waText = language === 'ar'
      ? `مرحبًا Capital Pioneers، أستفسر عن شقة 184م استلام فوري في مشروع رقم 641 بالأندلس 2 (الدور الرابع نص تشطيب - فيو جاردن بدخلة من التسعين الجنوبي). السعر: 4,416,000 جنيه (مقدم 50%: 2,208,000 جنيه وقسط شهري: 92,000 جنيه على سنتين). برجاء تزويدي بالتفاصيل وحجز معاينة.`
      : `Hello Capital Pioneers, I am inquiring about the 184 sqm Ready-to-Move Apartment in Project No. 641 – Al Andalus 2 (Fourth Floor, Semi-Finished, Garden View, South 90th Access). Total Price: EGP 4,416,000 (50% Down: EGP 2,208,000 | Monthly: EGP 92,000 over 2 Years). Please send details.`;

    trackClickWhatsApp('andalus_641_hero', project.name);
    trackEvent('andalus_641_whatsapp_click', {
      project: 'Project 641 Al Andalus 2',
      price: totalPrice,
    });

    window.open(`https://wa.me/201066330570?text=${encodeURIComponent(waText)}`, '_blank');
  };

  const handlePhoneClick = () => {
    trackClickPhone('andalus_641_hero', project.name);
    window.location.href = TEL_URL;
  };

  const scrollToPricing = () => {
    pricingRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToDetails = () => {
    detailsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToForm = () => {
    setNotes(
      language === 'ar'
        ? `استفسار وحجز معاينة بخصوص شقة 184م استلام فوري بمشروع رقم 641 بالأندلس 2 (السعر: 4,416,000 جنيه | مقدم 50%: 2,208,000 جنيه | تقسيط سنتين بقسط شهري: 92,000 جنيه)`
        : `Inquiry and viewing request for 184 sqm apartment in Project No. 641 Al Andalus 2 (Total: EGP 4,416,000 | 50% DP: EGP 2,208,000 | 2 Years Installments with Monthly: EGP 92,000)`
    );
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFormStart = () => {
    if (!hasStartedForm.current) {
      hasStartedForm.current = true;
      trackFormStart('andalus_641_lead_form', 'full_name');
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;

    setIsSubmitting(true);
    const planText = `50% Down Payment (EGP ${downPaymentAmount.toLocaleString()}) | 2 Years Installments | Monthly: EGP ${monthlyInstallment.toLocaleString()} | Total EGP ${totalPrice.toLocaleString()}`;

    const leadData: LeadFormData = {
      fullName: fullName.trim() || (language === 'ar' ? 'عميل مهتم بمشروع 641 الأندلس 2' : 'Al Andalus 641 Prospect'),
      phoneNumber: phoneNumber.trim(),
      interestedProject: 'Project No. 641 - Al Andalus 2',
      propertyType: 'Apartment',
      purpose: 'End User' as PurposeOption,
      preferredContactMethod: preferredContact === 'whatsapp' ? 'WhatsApp' : 'Phone',
      message: `${notes ? notes + ' | ' : ''}Plan: ${planText} | Location: ${locationText} | Layout: 3 Beds (1 Master with Dressing & Toilet), 3 Baths, Kitchen, Spacious Reception, Front Terrace`,
    };

    try {
      await submitLead(leadData);
      trackFormSubmit({
        form_name: 'andalus_641_lead_form',
        interested_project: 'Project No. 641 - Al Andalus 2',
        property_type: 'Apartment',
        purpose: 'End User',
      });
      trackEvent('andalus_641_lead_submit', {
        project: 'Project 641 Al Andalus 2',
        price: totalPrice,
        down_payment: downPaymentAmount,
      });

      const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
      const waText = language === 'ar'
        ? `مرحبًا Capital Pioneers، أنا ${fullName || 'عميل مهتم'}، أود حجز معاينة لشقة 184م بمشروع رقم 641 بالأندلس 2 (الدور الرابع نص تشطيب). الخطة: مقدم 50% (${downPaymentAmount.toLocaleString()} ج.م) وقسط شهري ${monthlyInstallment.toLocaleString()} ج.م على سنتين. هاتف: ${cleanPhone}.`
        : `Hello Capital Pioneers, my name is ${fullName || 'an interested client'}. I would like to schedule a viewing for the 184 sqm apartment in Project No. 641 Al Andalus 2 (Fourth Floor, Semi-Finished). Plan: 50% DP (${downPaymentAmount.toLocaleString()} EGP) with monthly ${monthlyInstallment.toLocaleString()} EGP over 2 years. Phone: ${cleanPhone}.`;
      
      const directWaUrl = `https://wa.me/201066330570?text=${encodeURIComponent(waText)}`;
      setWhatsappHandoffUrl(directWaUrl);
      setFormSubmitted(true);
    } catch (err) {
      console.error('Failed to submit Al Andalus 641 lead:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Structured Data (JSON-LD)
  const realEstateSchema = generateRealEstateListingSchema(project);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: language === 'ar' ? 'الرئيسية' : 'Home', item: '/' },
    { name: language === 'ar' ? 'المشروعات السكنية' : 'Residential Projects', item: '/projects?projectType=Residential' },
    { name: language === 'ar' ? 'مشروع رقم 641 – الأندلس 2' : 'Project No. 641 – Al Andalus 2', item: '/projects/project-641-al-andalus-2-ready-to-move-apartment-184sqm' },
  ]);

  return (
    <div className={`min-h-screen bg-[#061D28] text-slate-100 selection:bg-[#C5A880] selection:text-[#061D28] ${isRTL ? 'font-arabic' : 'font-sans'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <SEO
        title={language === 'ar' ? 'استلام فوري 184م في الأندلس 2 | مشروع 641' : '184 sqm Ready-to-Move Property in Al Andalus 2 | Project 641'}
        description={language === 'ar'
          ? 'وحدة سكنية 184م استلام فوري في مشروع رقم 641 بالأندلس 2، الدور الرابع، نص تشطيب، 3 غرف نوم و3 حمامات، بإجمالي 4,416,000 جنيه ومقدم 50% وتقسيط على سنتين.'
          : 'Ready-to-move 184 sqm 4th floor apartment in Project No. 641 Al Andalus 2, New Cairo. 3 bedrooms (1 master with dressing & bath), 3 bathrooms, garden view, access from South 90th St. Total EGP 4,416,000 with 50% down payment over 2 years.'}
        canonicalPath="/projects/project-641-al-andalus-2-ready-to-move-apartment-184sqm"
        ogType="website"
        ogImage={`https://capitalpioneers.com${buildingPhotoUrl}`}
        schema={[breadcrumbSchema, realEstateSchema]}
      />

      {/* 1. HERO SECTION */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden bg-gradient-to-b from-[#04121A] via-[#061D28] to-[#082938]">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[#0B4D68]/15 blur-[140px] pointer-events-none rounded-full" />
        <div className="absolute top-10 right-10 w-96 h-96 bg-[#C5A880]/10 blur-[120px] pointer-events-none rounded-full" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* Priority Badges (Verified Data Only) */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
                  <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{language === 'ar' ? 'استلام فوري' : 'READY TO MOVE'}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A880]/15 border border-[#C5A880]/30 text-[#DFCA9F] text-xs font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>{language === 'ar' ? 'الأندلس 2 • التسعين الجنوبي' : 'Al Andalus 2 • South 90th'}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-medium">
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{language === 'ar' ? 'فيو جاردن' : 'Garden View'}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-medium">
                  <Building2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>{language === 'ar' ? 'الدور الرابع • 184 م²' : '4th Floor • 184 m²'}</span>
                </span>
              </div>

              {/* Title & Description Copy */}
              <div className="space-y-3 max-w-2xl">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] xl:text-[46px] font-semibold text-white tracking-normal leading-[1.2]">
                  {language === 'ar' ? (
                    <>
                      استلام فوري – 184م – الأندلس 2<br />
                      <span className="text-lg sm:text-xl md:text-2xl font-medium text-[#DFCA9F] block mt-1.5">
                        مشروع رقم 641
                      </span>
                    </>
                  ) : (
                    <>
                      184 sqm Ready-to-Move Property in Al Andalus 2<br />
                      <span className="text-lg sm:text-xl md:text-2xl font-medium text-[#DFCA9F] block mt-1.5">
                        Project No. 641
                      </span>
                    </>
                  )}
                </h1>
                <p className="text-sm sm:text-base md:text-[17px] font-normal text-slate-300 leading-[1.75]">
                  {language === 'ar'
                    ? 'وحدة سكنية استلام فوري بمشروع رقم 641 في الأندلس 2، بمساحة 184 م²، بالدور الرابع، بدخلة من شارع التسعين الجنوبي وفيو جاردن. الوحدة نص تشطيب، وتتكون من 3 غرف نوم، منها غرفة ماستر بدريسنج وتواليت، و3 حمامات، ومطبخ، وريسبشن واسع، وتراس على الواجهة.'
                    : 'A ready-to-move residential unit in Project No. 641 in Al Andalus 2, with an area of 184 m² on the fourth floor, featuring direct access from South 90th Street and a pleasant garden view. The unit is semi-finished and comprises 3 bedrooms (including a master bedroom with dressing room and en-suite bathroom), 3 bathrooms, a kitchen, a spacious reception area, and a front-facing terrace.'}
                </p>
              </div>

              {/* Verified Location & Map Link */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm text-xs sm:text-sm text-slate-300 max-w-2xl">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] text-[#DFCA9F] font-medium block uppercase tracking-wider">
                      {language === 'ar' ? 'الموقع المعتمد:' : 'Verified Location:'}
                    </span>
                    <p className="leading-relaxed font-normal">
                      {locationText}
                    </p>
                  </div>
                </div>
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-[#DFCA9F] text-xs font-medium transition-all shrink-0 border border-white/10"
                >
                  <span>{language === 'ar' ? 'موقع الخريطة' : 'View on Google Maps'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Layout Specifications Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1 max-w-2xl text-xs">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                  <Bed className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-slate-200 font-medium">{language === 'ar' ? '3 غرف نوم (ماستر بدريسنج وتواليت)' : '3 Beds (Master with Dressing)'}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                  <Bath className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="text-slate-200 font-medium">{language === 'ar' ? '3 حمامات' : '3 Bathrooms'}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-slate-200 font-medium">{language === 'ar' ? 'مطبخ + ريسبشن واسع' : 'Kitchen + Spacious Reception'}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-purple-400 shrink-0" />
                  <span className="text-slate-200 font-medium">{language === 'ar' ? 'تراس على الواجهة' : 'Front-Facing Terrace'}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-400 shrink-0" />
                  <span className="text-slate-200 font-medium">{language === 'ar' ? 'الدور الرابع' : 'Fourth Floor'}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#DFCA9F] shrink-0" />
                  <span className="text-slate-200 font-medium">{language === 'ar' ? 'نص تشطيب' : 'Semi-Finished'}</span>
                </div>
              </div>

              {/* PRICING & PAYMENT PLAN BLOCK */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0B4D68]/40 via-[#061D28] to-[#04121A] border border-[#C5A880]/50 shadow-xl space-y-3.5 max-w-2xl">
                
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-[#DFCA9F]" />
                    <span className="text-xs text-[#DFCA9F] font-medium tracking-wide">
                      {language === 'ar' ? 'الأسعار وخطة السداد المعتمدة' : 'Verified Pricing & Payment Plan'}
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-medium border border-emerald-500/25">
                    {language === 'ar' ? 'مقدم 50% • تقسيط سنتين' : '50% Down • 2 Years'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                  
                  {/* Total Price Box */}
                  <div className="p-3.5 rounded-xl bg-[#0B4D68]/50 border border-[#C5A880] ring-1 ring-[#C5A880]/30">
                    <span className="text-[11px] text-[#DFCA9F] font-medium block uppercase mb-1">
                      {language === 'ar' ? 'إجمالي السعر:' : 'TOTAL PRICE:'}
                    </span>
                    <div className="text-xl sm:text-2xl font-semibold text-white tracking-tight tabular-nums font-sans" dir="ltr">
                      {totalPrice.toLocaleString()} EGP
                    </div>
                    <div className="text-[11px] text-slate-300 mt-0.5">
                      {language === 'ar' ? 'استلام فوري بمشروع 641' : 'Ready to move upon contract'}
                    </div>
                  </div>

                  {/* Payment Breakdown Box */}
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">{language === 'ar' ? 'المقدم (50%):' : 'Down Payment (50%):'}</span>
                      <strong className="font-sans tabular-nums text-white font-semibold">{downPaymentAmount.toLocaleString()} EGP</strong>
                    </div>
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-white/5">
                      <span className="text-slate-400">{language === 'ar' ? 'مدة التقسيط:' : 'Duration:'}</span>
                      <strong className="text-cyan-300 font-medium">{language === 'ar' ? 'سنتان (24 شهر)' : '2 Years (24 Months)'}</strong>
                    </div>
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-white/5">
                      <span className="text-slate-400">{language === 'ar' ? 'القسط الشهري:' : 'Monthly Installment:'}</span>
                      <strong className="font-sans tabular-nums text-emerald-400 font-semibold">{monthlyInstallment.toLocaleString()} EGP</strong>
                    </div>
                  </div>

                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleWhatsAppClick}
                  className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm flex items-center gap-2.5 transition-all shadow-md hover:-translate-y-0.5 active:translate-y-0"
                >
                  <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
                  <span>{language === 'ar' ? 'تواصل عبر واتساب' : 'Inquire via WhatsApp'}</span>
                </button>

                <button
                  type="button"
                  onClick={scrollToForm}
                  className="px-6 py-3.5 rounded-xl bg-[#C5A880] hover:bg-[#DFCA9F] text-[#061D28] font-semibold text-sm flex items-center gap-2 transition-all shadow-md hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span>{language === 'ar' ? 'طلب معاينة الشقة' : 'Request Inspection'}</span>
                  <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                </button>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs sm:text-sm flex items-center gap-2 border border-white/15 transition-all"
                >
                  <Maximize2 className="w-4 h-4 text-[#C5A880]" />
                  <span>{language === 'ar' ? 'تكبير صورة الواجهة' : 'View Facade Photo'}</span>
                </button>
              </div>

            </div>

            {/* Right Media Column (Actual Building Facade Photo) */}
            <div className="lg:col-span-5">
              <div className="relative group rounded-3xl overflow-hidden bg-white/5 border border-white/15 p-3.5 backdrop-blur-md shadow-xl space-y-3">
                
                {/* Header Tag */}
                <div className="flex items-center justify-between pb-2.5 border-b border-white/10 text-xs">
                  <div className="flex items-center gap-2 text-[#DFCA9F] font-medium">
                    <Building2 className="w-4 h-4" />
                    <span>{language === 'ar' ? 'صورة فعلية لواجهة المبنى' : 'Actual Building Exterior Photo'}</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 font-sans text-[11px] font-medium">
                    {language === 'ar' ? 'مشروع 641 • الأندلس 2' : 'Project 641 • Al Andalus 2'}
                  </span>
                </div>

                {/* Clickable Image Container */}
                <div 
                  onClick={() => setIsModalOpen(true)}
                  className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900 cursor-pointer group"
                >
                  <img
                    src={buildingPhotoUrl}
                    alt={language === 'ar' ? 'صورة فعلية لواجهة عمارة مشروع رقم 641 بالأندلس 2 التجمع الخامس – شقة 184م استلام فوري' : 'Actual exterior facade photo of residential building Project No. 641 in Al Andalus 2 New Cairo'}
                    title={language === 'ar' ? 'مشروع رقم 641 – الأندلس 2' : 'Project No. 641 – Al Andalus 2'}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="eager"
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-[#061D28]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-medium text-xs sm:text-sm backdrop-blur-[2px]">
                    <Maximize className="w-4 h-4 text-[#DFCA9F]" />
                    <span>{language === 'ar' ? 'انقر لتكبير صورة الواجهة' : 'Click to View Full Resolution'}</span>
                  </div>

                  {/* Marker Legend Badge */}
                  <div className="absolute bottom-2 left-2 right-2 bg-[#061D28]/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/15 text-[11px] text-slate-200 flex items-center justify-between">
                    <span className="font-medium text-[#DFCA9F]">
                      {language === 'ar' ? 'الدور الرابع – 184 م² – فيو جاردن' : '4th Floor – 184 m² – Garden View'}
                    </span>
                    <span className="text-emerald-400 font-medium">
                      {language === 'ar' ? 'استلام فوري' : 'Ready to Move'}
                    </span>
                  </div>
                </div>

                {/* Fast Specs Strip */}
                <div className="grid grid-cols-3 gap-2 pt-1 border-t border-white/10 text-center text-xs">
                  <div className="p-2 rounded-xl bg-white/5">
                    <span className="text-slate-400 block text-[10px]">{language === 'ar' ? 'المساحة' : 'Unit Area'}</span>
                    <strong className="text-white font-semibold text-xs sm:text-sm">184 m²</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5">
                    <span className="text-slate-400 block text-[10px]">{language === 'ar' ? 'الدور' : 'Floor'}</span>
                    <strong className="text-[#DFCA9F] font-semibold text-xs sm:text-sm">{language === 'ar' ? 'الرابع' : '4th'}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5">
                    <span className="text-slate-400 block text-[10px]">{language === 'ar' ? 'التشطيب' : 'Finishing'}</span>
                    <strong className="text-emerald-400 font-semibold text-xs sm:text-sm">{language === 'ar' ? 'نص تشطيب' : 'Semi-Finished'}</strong>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. UNIT DETAILS & SPECIFICATIONS */}
      <section ref={detailsRef} className="py-16 sm:py-20 bg-[#04121A] border-y border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-2xl mx-auto text-center space-y-2.5 mb-12">
            <span className="px-3.5 py-1 rounded-full bg-[#C5A880]/15 text-[#DFCA9F] text-xs font-medium uppercase tracking-wider border border-[#C5A880]/30 inline-block">
              {language === 'ar' ? 'تفاصيل وتقسيم الوحدة' : 'Unit Layout & Specifications'}
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white leading-tight">
              {language === 'ar' ? 'المواصفات والتقسيم الداخلي للشقة' : 'Internal Layout Specifications'}
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              {language === 'ar'
                ? 'وحدة سكنية بمساحة 184 م² بالدور الرابع بمشروع رقم 641 في الأندلس 2.'
                : '184 sqm 4th floor residential unit in Project No. 641, Al Andalus 2.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            
            {/* Card 1: Bedrooms Layout */}
            <div className="p-6 rounded-2xl bg-[#061D28] border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Bed className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white">
                {language === 'ar' ? 'غرف النوم' : 'Bedrooms Layout'}
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{language === 'ar' ? '3 غرف نوم واسعة' : '3 Spacious Bedrooms'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{language === 'ar' ? 'غرفة ماستر مع دريسنج وتواليت خاص' : '1 Master Bedroom with Dressing & En-suite Toilet'}</span>
                </li>
              </ul>
            </div>

            {/* Card 2: Bathrooms & Kitchen */}
            <div className="p-6 rounded-2xl bg-[#061D28] border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                <Bath className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white">
                {language === 'ar' ? 'الحمامات والمطبخ' : 'Bathrooms & Kitchen'}
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>{language === 'ar' ? '3 حمامات' : '3 Bathrooms Total'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>{language === 'ar' ? 'مطبخ مستقل' : 'Dedicated Kitchen'}</span>
                </li>
              </ul>
            </div>

            {/* Card 3: Reception & Terrace */}
            <div className="p-6 rounded-2xl bg-[#061D28] border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white">
                {language === 'ar' ? 'الريسبشن والإطلالة' : 'Reception & Terrace'}
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{language === 'ar' ? 'ريسبشن واسع' : 'Spacious Living & Reception Area'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{language === 'ar' ? 'تراس على الواجهة بإطلالة جاردن' : 'Front-Facing Terrace with Garden View'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{language === 'ar' ? 'دخلة مباشرة من شارع التسعين الجنوبي' : 'Direct Access from South 90th Street'}</span>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* 3. PAYMENT PLAN SECTION */}
      <section ref={pricingRef} className="py-16 sm:py-20 bg-[#061D28] border-b border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-2xl mx-auto text-center space-y-2.5 mb-12">
            <span className="px-3.5 py-1 rounded-full bg-[#C5A880]/15 text-[#DFCA9F] text-xs font-medium uppercase tracking-wider border border-[#C5A880]/30 inline-block">
              {language === 'ar' ? 'نظام السداد المعتمد' : 'Verified Payment Plan'}
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white leading-tight">
              {language === 'ar' ? 'تفاصيل الدفع والتقسيط على سنتين' : 'Payment & 2-Year Installment Breakdown'}
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm">
              {language === 'ar'
                ? 'إجمالي السعر: 4,416,000 جنيه • مقدم 50%: 2,208,000 جنيه • قسط شهري: 92,000 جنيه على سنتين.'
                : 'Total Price: EGP 4,416,000 • 50% Down Payment: EGP 2,208,000 • Monthly Installment: EGP 92,000 over 2 Years.'}
            </p>
          </div>

          <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0B4D68]/40 via-[#061D28] to-[#04121A] border border-[#C5A880]/50 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-medium text-[#DFCA9F]">
                {language === 'ar' ? 'خطة السداد الرسمية المعتمدة' : 'Official Payment Plan'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 font-medium text-xs">
                {language === 'ar' ? 'استلام فوري' : 'Ready to Move'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <span className="text-xs text-slate-400 block mb-1">{language === 'ar' ? 'إجمالي السعر:' : 'Total Price:'}</span>
                <div className="text-xl sm:text-2xl font-semibold text-white font-sans tabular-nums" dir="ltr">
                  {totalPrice.toLocaleString()} EGP
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <span className="text-xs text-slate-400 block mb-1">{language === 'ar' ? 'المقدم (50%):' : 'Down Payment (50%):'}</span>
                <div className="text-xl sm:text-2xl font-semibold text-[#DFCA9F] font-sans tabular-nums" dir="ltr">
                  {downPaymentAmount.toLocaleString()} EGP
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <span className="text-xs text-slate-400 block mb-1">{language === 'ar' ? 'مدة التقسيط:' : 'Installment Period:'}</span>
                <div className="text-lg sm:text-xl font-semibold text-cyan-300">
                  {language === 'ar' ? 'سنتان (24 شهر)' : '2 Years (24 Months)'}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <span className="text-xs text-slate-400 block mb-1">{language === 'ar' ? 'القسط الشهري:' : 'Monthly Installment:'}</span>
                <div className="text-xl sm:text-2xl font-semibold text-emerald-400 font-sans tabular-nums" dir="ltr">
                  {monthlyInstallment.toLocaleString()} EGP
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={scrollToForm}
              className="w-full py-3.5 rounded-xl bg-[#C5A880] hover:bg-[#DFCA9F] text-[#061D28] font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-md"
            >
              <span>{language === 'ar' ? 'طلب معاينة الشقة والتعاقد' : 'Request Inspection & Booking'}</span>
              <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            </button>
          </div>

        </div>
      </section>

      {/* 4. LEAD CAPTURE & ADVISOR HANDOFF */}
      <section ref={formRef} className="py-16 sm:py-20 bg-[#04121A] border-t border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-[#061D28] border border-slate-800 shadow-xl relative">
            
            <div className="text-center space-y-2 mb-6">
              <span className="px-3.5 py-1 rounded-full bg-[#C5A880]/15 text-[#DFCA9F] text-xs font-medium uppercase tracking-wider border border-[#C5A880]/30 inline-block">
                {language === 'ar' ? 'حجز ومعاينة الوحدة' : 'Schedule Inspection'}
              </span>
              <h2 className="text-xl sm:text-2xl font-semibold text-white">
                {language === 'ar' ? 'تواصل مع مستشار المشروعات السكنية بالأندلس' : 'Connect with Al Andalus Property Advisors'}
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm">
                {language === 'ar'
                  ? 'سجل بياناتك وسيتم التواصل معك فورًا لتنسيق المعاينة الميدانية لشقة 184م بمشروع 641.'
                  : 'Submit your contact details for immediate consultation and site viewing coordination.'}
              </p>
            </div>

            {formSubmitted ? (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h3 className="text-base sm:text-lg font-semibold text-white">
                  {language === 'ar' ? 'تم استلام طلبك بنجاح!' : 'Request Received Successfully!'}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {language === 'ar' 
                    ? 'تم توثيق طلبك وسيتواصل معك مستشار المشروعات السكنية بالتجمع الخامس خلال دقائق.'
                    : 'Our residential property specialist for New Cairo will contact you shortly.'}
                </p>
                {whatsappHandoffUrl && (
                  <a
                    href={whatsappHandoffUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-md mt-2"
                  >
                    <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
                    <span>{language === 'ar' ? 'المتابعة المباشرة عبر واتساب الآن' : 'Continue on WhatsApp Now'}</span>
                  </a>
                )}
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
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
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#C5A880] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
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
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#C5A880] transition-colors font-sans tabular-nums text-left"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    {language === 'ar' ? 'ملاحظات أو استفسارات إضافية:' : 'Additional Notes:'}
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={language === 'ar' ? 'أضف أي تفاصيل أو أوقات مفضلة للمعاينة...' : 'Add any specific inspection timing or inquiries...'}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#C5A880] transition-colors resize-none"
                  />
                </div>

                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={isSubmitting || !phoneNumber.trim()}
                    className="w-full py-3.5 rounded-xl bg-[#C5A880] hover:bg-[#DFCA9F] text-[#061D28] font-semibold text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-md"
                  >
                    {isSubmitting ? (
                      <span>{language === 'ar' ? 'جاري الإرسال...' : 'Submitting...'}</span>
                    ) : (
                      <>
                        <span>{language === 'ar' ? 'تأكيد طلب المعاينة' : 'Confirm Inspection Request'}</span>
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
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="relative max-w-5xl w-full bg-[#061D28] rounded-3xl overflow-hidden border border-white/20 shadow-2xl p-4 space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-medium text-[#DFCA9F]">
                {language === 'ar' ? 'صورة فعلية لواجهة عمارة مشروع رقم 641 بالأندلس 2' : 'Actual Building Exterior – Project No. 641 Al Andalus 2'}
              </span>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-3 py-1 rounded-lg bg-white/10 text-white text-xs hover:bg-white/20 transition-all font-medium"
              >
                {language === 'ar' ? 'إغلاق ✕' : 'Close ✕'}
              </button>
            </div>

            <div className="relative aspect-[16/10] max-h-[75vh] w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center">
              <img
                src={buildingPhotoUrl}
                alt="Project No. 641 Building Facade"
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AlAndalus641ProjectExperience;
