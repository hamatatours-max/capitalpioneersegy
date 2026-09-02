import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
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
  Zap, 
  Flame, 
  Maximize, 
  Tag, 
  Home, 
  ArrowUpRight 
} from 'lucide-react';
import { Project } from '@/types/project';
import { SEO } from '@/components/common/SEO';
import { submitLead } from '@/services/leadService';
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

interface NorthernLotusProjectExperienceProps {
  project: Project;
  onRequestViewing?: (projectName?: string) => void;
}

export const NorthernLotusProjectExperience: React.FC<NorthernLotusProjectExperienceProps> = ({
  project: rawProject,
  onRequestViewing
}) => {
  const { language, isRTL, t } = useLanguage();
  const project = getLocalizedProject(rawProject, language);

  // Selected Unit: 'panoramic_175' (Full Façade, Qty 2) | 'right_facade_170' (Right Side, Qty 1)
  const [selectedUnitType, setSelectedUnitType] = useState<'panoramic_175' | 'right_facade_170'>('panoramic_175');

  // Active Payment Option: 'cash' | 'installment'
  const [selectedPaymentOption, setSelectedPaymentOption] = useState<'cash' | 'installment'>('cash');

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
  const inventoryRef = useRef<HTMLDivElement | null>(null);

  // Verified Constants - Unit Type A (175 m² Panoramic Full Façade - 2 Units)
  const unit175OriginalPrice = 5425000;
  const unit175DiscountAmount = 542500; // 10%
  const unit175CashPrice = 4882500; // Calculated based on supplied 10% cash discount
  const unit175DownPaymentAmount = 2712500; // 50%
  const unit175RemainingAmount = 2712500; // 1 Year
  const unit175Area = 175;

  // Verified Constants - Unit Type B (170 m² Right-Side Façade - 1 Unit)
  const unit170OriginalPrice = 5100000;
  const unit170DiscountAmount = 510000; // 10%
  const unit170CashPrice = 4590000; // Calculated based on supplied 10% cash discount
  const unit170DownPaymentAmount = 2550000; // 50%
  const unit170RemainingAmount = 2550000; // 1 Year
  const unit170Area = 170;

  const buildingPhotoUrl = '/images/projects/northern-lotus-ready-to-move/northern-lotus-ready-to-move-building.jpg';

  const is175 = selectedUnitType === 'panoramic_175';
  const activeOriginalPrice = is175 ? unit175OriginalPrice : unit170OriginalPrice;
  const activeCashPrice = is175 ? unit175CashPrice : unit170CashPrice;
  const activeDownPayment = is175 ? unit175DownPaymentAmount : unit170DownPaymentAmount;
  const activeRemaining = is175 ? unit175RemainingAmount : unit170RemainingAmount;
  const activeArea = is175 ? unit175Area : unit170Area;
  const activeDiscountAmount = is175 ? unit175DiscountAmount : unit170DiscountAmount;

  const locationText = language === 'ar' 
    ? 'اللوتس الشمالية – ثالث نمرة من شارع التسعين الشمالي – القاهرة الجديدة' 
    : 'Northern Lotus – Third row from North 90th Street – New Cairo';

  const floorText = language === 'ar'
    ? 'الدور الخامس والأخير – متصالح بالعداد'
    : 'Fifth Floor (Final / Top Floor) – Reconciled with Meter';

  // Analytics on Mount
  useEffect(() => {
    trackEvent('northern_lotus_view', {
      project_id: 'northern-lotus-ready-to-move',
      location: 'Northern Lotus 3rd Row North 90th',
      selected_unit: selectedUnitType,
    });
  }, [selectedUnitType]);

  const handleUnitSwitch = (unitType: 'panoramic_175' | 'right_facade_170') => {
    setSelectedUnitType(unitType);
    setSelectedPaymentOption('cash');
    trackEvent('northern_lotus_unit_switch', { unit: unitType });
  };

  const handlePlanSelect = (plan: 'cash' | 'installment') => {
    setSelectedPaymentOption(plan);
    trackEvent('northern_lotus_plan_select', {
      unit: selectedUnitType,
      plan,
      price: plan === 'cash' ? activeCashPrice : activeOriginalPrice,
    });
  };

  const handleWhatsAppClick = () => {
    let waText = '';
    if (is175) {
      waText = language === 'ar'
        ? `مرحبًا Capital Pioneers، أستفسر عن شقة 175م بانوراما على الواجهة بالكامل في اللوتس الشمالية (ثالث نمرة من التسعين الشمالي) - الدور الخامس والأخير متصالح بالعداد (السعر: 5,425,000 جنيه | خصم كاش 10%: 4,882,500 جنيه | مقدم 50% على سنة). برجاء تزويدي بالتفاصيل وحجز معاينة.`
        : `Hello Capital Pioneers, I am inquiring about the 175 sqm Panoramic Full-Façade Ready-to-Move Apartment in Northern Lotus, New Cairo (3rd row from North 90th St) - Fifth Floor, Reconciled with Meter (Price: EGP 5,425,000 | 10% Cash Discount: EGP 4,882,500 | 50% DP over 1 Year). Please provide booking details.`;
    } else {
      waText = language === 'ar'
        ? `مرحبًا Capital Pioneers، أستفسر عن شقة 170م يمين الواجهة في اللوتس الشمالية (ثالث نمرة من التسعين الشمالي) - الدور الخامس والأخير متصالح بالعداد (السعر: 5,100,000 جنيه | خصم كاش 10%: 4,590,000 جنيه | مقدم 50% على سنة). برجاء تزويدي بالتفاصيل وحجز معاينة.`
        : `Hello Capital Pioneers, I am inquiring about the 170 sqm Right-Side Façade Ready-to-Move Apartment in Northern Lotus, New Cairo (3rd row from North 90th St) - Fifth Floor, Reconciled with Meter (Price: EGP 5,100,000 | 10% Cash Discount: EGP 4,590,000 | 50% DP over 1 Year). Please provide booking details.`;
    }

    trackClickWhatsApp('northern_lotus_hero', is175 ? 'Northern Lotus 175sqm Unit' : 'Northern Lotus 170sqm Unit');
    trackEvent('northern_lotus_whatsapp_click', { unit: selectedUnitType, plan: selectedPaymentOption });

    window.open(`https://wa.me/201066330570?text=${encodeURIComponent(waText)}`, '_blank');
  };

  const scrollToPricing = () => {
    pricingRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToInventory = () => {
    inventoryRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToForm = (planOverride?: 'cash' | 'installment') => {
    if (planOverride) {
      setSelectedPaymentOption(planOverride);
    }
    const unitTitle = is175
      ? (language === 'ar' ? 'شقة 175م بانوراما على الواجهة بالكامل (الدور الخامس والأخير)' : '175 sqm Panoramic Full-Façade Apartment (5th Floor)')
      : (language === 'ar' ? 'شقة 170م يمين الواجهة (الدور الخامس والأخير)' : '170 sqm Right-Side Façade Apartment (5th Floor)');

    const planName = (planOverride || selectedPaymentOption) === 'cash'
      ? (language === 'ar' ? `شراء كاش بعد خصم 10% (${activeCashPrice.toLocaleString()} جنيه)` : `Cash Purchase with 10% Discount (EGP ${activeCashPrice.toLocaleString()})`)
      : (language === 'ar' ? `نظام تقسيط (مقدم 50% على سنة)` : `Installment Plan (50% DP / 1 Year)`);

    setNotes(
      language === 'ar'
        ? `استفسار وحجز معاينة بخصوص ${unitTitle} باللوتس الشمالية — نظام السداد: ${planName}`
        : `Inquiry and viewing request for ${unitTitle} in Northern Lotus — Selected Plan: ${planName}`
    );
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFormStart = () => {
    if (!hasStartedForm.current) {
      hasStartedForm.current = true;
      trackFormStart('northern_lotus_lead_form', 'full_name');
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;

    setIsSubmitting(true);
    const unitTitle = is175
      ? 'Northern Lotus 175 sqm Panoramic Full-Façade Apartment'
      : 'Northern Lotus 170 sqm Right-Side Façade Apartment';

    const selectedPlanText = selectedPaymentOption === 'cash' 
      ? `Cash Purchase after 10% Discount (EGP ${activeCashPrice.toLocaleString()}) [Calculated based on 10% Discount]`
      : `Installment Plan (50% Down = EGP ${activeDownPayment.toLocaleString()} | Up to 1 Year | Total EGP ${activeOriginalPrice.toLocaleString()})`;

    const leadData: LeadFormData = {
      fullName: fullName.trim() || (language === 'ar' ? 'عميل مهتم بشقق اللوتس الشمالية' : 'Northern Lotus Prospect'),
      phoneNumber: phoneNumber.trim(),
      interestedProject: `Northern Lotus Ready to Move - ${unitTitle}`,
      propertyType: 'Apartment',
      purpose: 'Investment' as PurposeOption,
      preferredContactMethod: preferredContact === 'whatsapp' ? 'WhatsApp' : 'Phone',
      message: `${notes ? notes + ' | ' : ''}Unit: ${unitTitle} | Option: ${selectedPlanText} | Location: ${locationText} | Floor: ${floorText}`,
    };

    try {
      await submitLead(leadData);
      trackFormSubmit({
        form_name: 'northern_lotus_lead_form',
        interested_project: unitTitle,
        property_type: 'Apartment',
        purpose: 'Investment',
      });
      trackEvent('northern_lotus_lead_submit', {
        unit: selectedUnitType,
        plan: selectedPaymentOption,
        price: selectedPaymentOption === 'cash' ? activeCashPrice : activeOriginalPrice,
      });

      const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
      const waText = language === 'ar'
        ? `مرحبًا Capital Pioneers، أنا ${fullName || 'عميل مهتم'}، أود حجز معاينة لشقة ${is175 ? '175م بانوراما' : '170م يمين الواجهة'} باللوتس الشمالية (الدور الخامس والأخير متصالح بالعداد). الخطة: ${selectedPlanText}. هاتف: ${cleanPhone}.`
        : `Hello Capital Pioneers, my name is ${fullName || 'an interested client'}. I would like to schedule a viewing for the ${is175 ? '175 sqm Panoramic' : '170 sqm Right-Side'} apartment in Northern Lotus (5th Floor, Reconciled with Meter). Preferred Plan: ${selectedPlanText}. Phone: ${cleanPhone}.`;
      
      const directWaUrl = `https://wa.me/201066330570?text=${encodeURIComponent(waText)}`;
      setWhatsappHandoffUrl(directWaUrl);
      setFormSubmitted(true);
    } catch (err) {
      console.error('Failed to submit Northern Lotus lead:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Structured Data (JSON-LD)
  const realEstateSchema = generateRealEstateListingSchema(project);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: language === 'ar' ? 'الرئيسية' : 'Home', item: '/' },
    { name: language === 'ar' ? 'المشروعات' : 'Projects', item: '/projects' },
    { name: language === 'ar' ? 'وحدات جاهزة للاستلام في اللوتس الشمالية' : 'Northern Lotus Ready-to-Move Apartments', item: '/projects/northern-lotus-ready-to-move-apartments' },
  ]);

  return (
    <div className={`min-h-screen bg-[#061D28] text-slate-100 selection:bg-[#C5A880] selection:text-[#061D28] ${isRTL ? 'font-arabic' : 'font-sans'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <SEO
        title={language === 'ar' 
          ? 'وحدات جاهزة للاستلام في اللوتس الشمالية – ثالث نمرة من التسعين الشمالي' 
          : 'Northern Lotus Ready-to-Move Apartments | 3rd Row from North 90th New Cairo'}
        description={language === 'ar'
          ? 'شقق جاهزة للاستلام الفوري بمساحات 170م و175م بالدور الخامس والأخير متصالح بالعداد في اللوتس الشمالية، ثالث نمرة من شارع التسعين الشمالي. عمارة ساكنة، أسانسير شغال، غاز طبيعي وعداد كهرباء. مقدم 50% وتقسيط حتى سنة أو خصم كاش 10%.'
          : 'Ready-to-move 170 sqm and 175 sqm fifth-floor apartments in Northern Lotus, New Cairo (3rd row from North 90th St). Reconciled with meter, working elevator, natural gas, electricity meter, occupied building. 50% down payment over 1 year or 10% cash discount.'}
        canonicalPath="/projects/northern-lotus-ready-to-move-apartments"
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
          
          {/* UNIT SWITCHER TABS */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-8 sm:mb-10">
            {/* Unit Type A: 175 m² Panoramic (2 Available) */}
            <button
              type="button"
              onClick={() => handleUnitSwitch('panoramic_175')}
              className={`px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm flex items-center gap-2 transition-all ${
                is175
                  ? 'bg-[#C5A880] text-[#061D28] font-semibold shadow-md ring-2 ring-[#C5A880]/30'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'وحدة بانوراما على الواجهة (175 م²)' : 'Panoramic Full-Façade Unit (175 m²)'}</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-700/80 text-white text-[10px] font-medium">
                {language === 'ar' ? 'متاح: وحدتين' : 'Qty: 2 Units'}
              </span>
            </button>

            {/* Unit Type B: 170 m² Right Side (1 Available) */}
            <button
              type="button"
              onClick={() => handleUnitSwitch('right_facade_170')}
              className={`px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm flex items-center gap-2 transition-all ${
                !is175
                  ? 'bg-[#C5A880] text-[#061D28] font-semibold shadow-md ring-2 ring-[#C5A880]/30'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'وحدة يمين الواجهة (170 م²)' : 'Right-Side Façade Unit (170 m²)'}</span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-700/80 text-white text-[10px] font-medium">
                {language === 'ar' ? 'متاح: وحدة واحدة' : 'Qty: 1 Unit'}
              </span>
            </button>
          </div>

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
                  <span>{language === 'ar' ? 'اللوتس الشمالية • ثالث نمرة من التسعين' : 'Northern Lotus • 3rd Row North 90th'}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-medium">
                  <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{language === 'ar' ? 'الدور الخامس والأخير – متصالح بالعداد' : '5th Floor – Reconciled with Meter'}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-medium">
                  <Tag className="w-3.5 h-3.5 text-amber-400" />
                  <span>{language === 'ar' ? 'خصم كاش 10%' : '10% Cash Discount'}</span>
                </span>
              </div>

              {/* Title & Description Copy */}
              <div className="space-y-3 max-w-2xl">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] xl:text-[46px] font-semibold text-white tracking-normal leading-[1.2]">
                  {language === 'ar' ? (
                    <>
                      وحدات جاهزة للاستلام في اللوتس الشمالية<br />
                      <span className="text-lg sm:text-xl md:text-2xl font-medium text-[#DFCA9F] block mt-1.5">
                        ثالث نمرة من شارع التسعين الشمالي
                      </span>
                    </>
                  ) : (
                    <>
                      Northern Lotus Ready-to-Move Apartments<br />
                      <span className="text-lg sm:text-xl md:text-2xl font-medium text-[#DFCA9F] block mt-1.5">
                        Third Row from North 90th Street
                      </span>
                    </>
                  )}
                </h1>
                <p className="text-sm sm:text-base md:text-[17px] font-normal text-slate-300 leading-[1.75]">
                  {is175
                    ? (language === 'ar'
                        ? 'وحدتان بمساحة 175 م² بانوراما على الواجهة بالكامل بالدور الخامس والأخير (متصالح بالعداد). تقع العمارة في اللوتس الشمالية ثالث نمرة من شارع التسعين الشمالي، وهي عمارة ساكنة ومزودة بأسانسير شغال، غاز طبيعي، وعداد كهرباء.'
                        : 'Two 175 sqm panoramic full-façade apartments on the fifth and top floor (reconciled with meter). Situated in Northern Lotus, third row from North 90th Street in an occupied building with an operational elevator, natural gas, and an electricity meter.')
                    : (language === 'ar'
                        ? 'وحدة بمساحة 170 م² يمين الواجهة بالدور الخامس والأخير (متصالح بالعداد). تقع العمارة في اللوتس الشمالية ثالث نمرة من شارع التسعين الشمالي، داخل عمارة ساكنة بها أسانسير شغال، غاز طبيعي، وعداد كهرباء.'
                        : 'A 170 sqm right-side façade apartment on the fifth and top floor (reconciled with meter). Located in Northern Lotus, third row from North 90th Street in an occupied building featuring an operational elevator, natural gas, and an electricity meter.')}
                </p>
              </div>

              {/* Verified Building Features Strip (ONLY SUPPLIED DATA) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 max-w-2xl text-xs">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-slate-200 font-medium">{language === 'ar' ? 'أسانسير شغال' : 'Working Elevator'}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-slate-200 font-medium">{language === 'ar' ? 'غاز طبيعي' : 'Natural Gas'}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="text-slate-200 font-medium">{language === 'ar' ? 'عداد كهرباء' : 'Electricity Meter'}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-purple-400 shrink-0" />
                  <span className="text-slate-200 font-medium">{language === 'ar' ? 'عمارة ساكنة' : 'Occupied Building'}</span>
                </div>
              </div>

              {/* PROMOTIONAL CASH & INSTALLMENT PRICING BLOCK */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0B4D68]/40 via-[#061D28] to-[#04121A] border border-[#C5A880]/50 shadow-xl space-y-3.5 max-w-2xl">
                
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-[#DFCA9F]" />
                    <span className="text-xs text-[#DFCA9F] font-medium tracking-wide">
                      {language === 'ar' ? 'الأسعار وأنظمة السداد المعتمدة' : 'Verified Pricing & Payment Terms'}
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-medium border border-emerald-500/25">
                    {language === 'ar' ? 'مقدم 50% • تقسيط حتى سنة' : '50% Down • Up to 1 Year'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                  
                  {/* Cash Price Box (With explicit calculated note as required) */}
                  <div 
                    onClick={() => handlePlanSelect('cash')}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      selectedPaymentOption === 'cash'
                        ? 'bg-[#0B4D68]/50 border-[#C5A880] ring-1 ring-[#C5A880]/30'
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] text-[#DFCA9F] font-medium block uppercase">
                        {language === 'ar' ? 'سعر الكاش (خصم 10%):' : 'CASH PRICE (10% OFF):'}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-medium">
                        {language === 'ar' ? 'وفر 10%' : 'Save 10%'}
                      </span>
                    </div>
                    <div className="text-xl sm:text-2xl font-semibold text-white tracking-tight tabular-nums font-sans" dir="ltr">
                      {activeCashPrice.toLocaleString()} EGP
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 leading-tight">
                      {language === 'ar' 
                        ? 'سعر محسوب بناءً على نسبة خصم الكاش 10% المعتمدة' 
                        : 'Calculated based on the supplied 10% cash discount.'}
                    </div>
                  </div>

                  {/* Installment Plan Box */}
                  <div 
                    onClick={() => handlePlanSelect('installment')}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      selectedPaymentOption === 'installment'
                        ? 'bg-[#0B4D68]/50 border-[#C5A880] ring-1 ring-[#C5A880]/30'
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <span className="text-[11px] text-slate-300 font-medium block uppercase mb-1">
                      {language === 'ar' ? 'سعر التقسيط الإجمالي:' : 'INSTALLMENT PRICE:'}
                    </span>
                    <div className="text-xl sm:text-2xl font-semibold text-white tracking-tight tabular-nums font-sans" dir="ltr">
                      {activeOriginalPrice.toLocaleString()} EGP
                    </div>
                    <div className="text-[11px] text-cyan-300 mt-0.5 font-medium">
                      {language === 'ar' ? 'مقدم 50% وتقسيط حتى سنة' : '50% Down Payment / Up to 1 Year'}
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
                  onClick={() => scrollToForm(selectedPaymentOption)}
                  className="px-6 py-3.5 rounded-xl bg-[#C5A880] hover:bg-[#DFCA9F] text-[#061D28] font-semibold text-sm flex items-center gap-2 transition-all shadow-md hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span>{language === 'ar' ? 'طلب معاينة الوحدة' : 'Request Inspection'}</span>
                  <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                </button>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs sm:text-sm flex items-center gap-2 border border-white/15 transition-all"
                >
                  <Maximize2 className="w-4 h-4 text-[#C5A880]" />
                  <span>{language === 'ar' ? 'تكبير صورة المبنى' : 'View Building Photo'}</span>
                </button>
              </div>

            </div>

            {/* Right Media Preview Column (Actual Exterior Photo) */}
            <div className="lg:col-span-5">
              <div className="relative group rounded-3xl overflow-hidden bg-white/5 border border-white/15 p-3.5 backdrop-blur-md shadow-xl space-y-3">
                
                {/* Header Tag */}
                <div className="flex items-center justify-between pb-2.5 border-b border-white/10 text-xs">
                  <div className="flex items-center gap-2 text-[#DFCA9F] font-medium">
                    <Building2 className="w-4 h-4" />
                    <span>{language === 'ar' ? 'صورة فعلية للمبنى' : 'Actual Building Exterior Photo'}</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 font-sans text-[11px] font-medium">
                    {language === 'ar' ? 'عمارة ساكنة • اللوتس الشمالية' : 'Occupied Building'}
                  </span>
                </div>

                {/* Clickable Image Container */}
                <div 
                  onClick={() => setIsModalOpen(true)}
                  className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900 cursor-pointer group"
                >
                  <img
                    src={buildingPhotoUrl}
                    alt={language === 'ar' ? 'صورة فعلية لواجهة عمارة سكنية في اللوتس الشمالية التجمع الخامس – وحدات جاهزة للاستلام' : 'Actual exterior photo of residential building in Northern Lotus New Cairo with ready-to-move apartments'}
                    title={language === 'ar' ? 'صورة فعلية للمبنى – اللوتس الشمالية' : 'Actual Building Exterior – Northern Lotus'}
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
                      {language === 'ar' ? 'الدور الخامس والأخير – متصالح بالعداد' : '5th Floor – Reconciled with Meter'}
                    </span>
                    <span className="text-emerald-400 font-medium">
                      {language === 'ar' ? 'استلام فوري' : 'Ready to Move'}
                    </span>
                  </div>
                </div>

                {/* Fast Specs Strip */}
                <div className="grid grid-cols-3 gap-2 pt-1 border-t border-white/10 text-center text-xs">
                  <div className="p-2 rounded-xl bg-white/5">
                    <span className="text-slate-400 block text-[10px]">{language === 'ar' ? 'المساحات المتاحة' : 'Available Areas'}</span>
                    <strong className="text-white font-semibold text-xs sm:text-sm">170 m² & 175 m²</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5">
                    <span className="text-slate-400 block text-[10px]">{language === 'ar' ? 'الدور' : 'Floor'}</span>
                    <strong className="text-[#DFCA9F] font-semibold text-xs sm:text-sm">{language === 'ar' ? 'الخامس والأخير' : '5th & Top'}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5">
                    <span className="text-slate-400 block text-[10px]">{language === 'ar' ? 'الوضع القانوني' : 'Legal Status'}</span>
                    <strong className="text-emerald-400 font-semibold text-xs sm:text-sm">{language === 'ar' ? 'متصالح بالعداد' : 'Reconciled'}</strong>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. AVAILABLE UNITS INVENTORY DIRECTORY */}
      <section ref={inventoryRef} className="py-16 sm:py-20 bg-[#04121A] border-y border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-2xl mx-auto text-center space-y-2.5 mb-12">
            <span className="px-3.5 py-1 rounded-full bg-[#C5A880]/15 text-[#DFCA9F] text-xs font-medium uppercase tracking-wider border border-[#C5A880]/30 inline-block">
              {language === 'ar' ? 'الوحدات المتاحة للاستلام الفوري' : 'Available Units Directory'}
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white leading-tight">
              {language === 'ar' ? 'قائمة الوحدات المتاحة بالدور الخامس والأخير' : 'Available Units on Fifth & Top Floor'}
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              {language === 'ar'
                ? 'إجمالي 3 وحدات سكنية متاحة (وحدتان بانوراما 175م + وحدة يمين الواجهة 170م).'
                : '3 residential units available in total (2 Panoramic 175 sqm units + 1 Right-Side 170 sqm unit).'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            
            {/* Card 1: Unit Type A - Record 1 (175 m² Panoramic) */}
            <div className={`rounded-2xl p-5 sm:p-6 border transition-all flex flex-col justify-between relative group ${
              is175 
                ? 'bg-gradient-to-b from-[#0B4D68]/30 via-[#061D28] to-[#04121A] border-[#C5A880] ring-1 ring-[#C5A880]/30 shadow-xl' 
                : 'bg-[#061D28] border-slate-800 hover:border-slate-700'
            }`}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 font-medium text-xs border border-emerald-500/25">
                    {language === 'ar' ? 'استلام فوري • وحدة 1' : 'READY TO MOVE • UNIT 1'}
                  </span>
                  <span className="text-xs font-medium text-[#DFCA9F]">
                    {language === 'ar' ? 'الدور الخامس والأخير' : '5TH & TOP FLOOR'}
                  </span>
                </div>

                <div className="aspect-[16/10] rounded-xl overflow-hidden bg-slate-900 border border-white/10 relative">
                  <img
                    src={buildingPhotoUrl}
                    alt="Northern Lotus 175 sqm Apartment"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-[#061D28]/90 text-[11px] font-medium text-emerald-400">
                    175 m² • {language === 'ar' ? 'بانوراما' : 'Panoramic'}
                  </div>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-1 leading-snug">
                    {language === 'ar' ? 'وحدة بانوراما على الواجهة (175 م²)' : 'Panoramic Full-Façade Unit (175 m²)'}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    {language === 'ar' 
                      ? 'بانوراما على الواجهة بالكامل • الدور الخامس والأخير • متصالح بالعداد • أسانسير شغال • غاز طبيعي • عداد كهرباء • عمارة ساكنة.' 
                      : 'Panoramic full façade • 5th & top floor • Reconciled with meter • Elevator • Natural gas • Electricity meter.'}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">{language === 'ar' ? 'سعر الكاش (خصم 10%):' : 'Cash Price (10% Off):'}</span>
                    <strong className="font-sans tabular-nums text-emerald-400 text-sm font-semibold">4,882,500 EGP</strong>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-white/5">
                    <span className="text-slate-400">{language === 'ar' ? 'سعر التقسيط:' : 'Installment Price:'}</span>
                    <strong className="font-sans tabular-nums text-white text-sm font-semibold">5,425,000 EGP</strong>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[11px] text-cyan-300">
                    <span>{language === 'ar' ? 'نظام السداد:' : 'Payment:'}</span>
                    <span className="font-medium">{language === 'ar' ? 'مقدم 50% • تقسيط حتى سنة' : '50% Down • Up to 1 Year'}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    handleUnitSwitch('panoramic_175');
                    scrollToPricing();
                  }}
                  className={`w-full py-2.5 rounded-xl font-medium text-xs transition-all flex items-center justify-center gap-2 ${
                    is175
                      ? 'bg-[#C5A880] text-[#061D28] font-semibold shadow-md'
                      : 'bg-white/10 hover:bg-white/15 text-white'
                  }`}
                >
                  <span>{is175 ? (language === 'ar' ? 'الوحدة المحددة حاليًا' : 'Selected Unit') : (language === 'ar' ? 'تحديد هذه الوحدة' : 'Select This Unit')}</span>
                  <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>

            {/* Card 2: Unit Type A - Record 2 (175 m² Panoramic) */}
            <div className={`rounded-2xl p-5 sm:p-6 border transition-all flex flex-col justify-between relative group ${
              is175 
                ? 'bg-gradient-to-b from-[#0B4D68]/30 via-[#061D28] to-[#04121A] border-[#C5A880] ring-1 ring-[#C5A880]/30 shadow-xl' 
                : 'bg-[#061D28] border-slate-800 hover:border-slate-700'
            }`}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 font-medium text-xs border border-emerald-500/25">
                    {language === 'ar' ? 'استلام فوري • وحدة 2' : 'READY TO MOVE • UNIT 2'}
                  </span>
                  <span className="text-xs font-medium text-[#DFCA9F]">
                    {language === 'ar' ? 'الدور الخامس والأخير' : '5TH & TOP FLOOR'}
                  </span>
                </div>

                <div className="aspect-[16/10] rounded-xl overflow-hidden bg-slate-900 border border-white/10 relative">
                  <img
                    src={buildingPhotoUrl}
                    alt="Northern Lotus 175 sqm Apartment"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-[#061D28]/90 text-[11px] font-medium text-emerald-400">
                    175 m² • {language === 'ar' ? 'بانوراما' : 'Panoramic'}
                  </div>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-1 leading-snug">
                    {language === 'ar' ? 'وحدة بانوراما على الواجهة (175 م²)' : 'Panoramic Full-Façade Unit (175 m²)'}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    {language === 'ar' 
                      ? 'بانوراما على الواجهة بالكامل • الدور الخامس والأخير • متصالح بالعداد • أسانسير شغال • غاز طبيعي • عداد كهرباء • عمارة ساكنة.' 
                      : 'Panoramic full façade • 5th & top floor • Reconciled with meter • Elevator • Natural gas • Electricity meter.'}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">{language === 'ar' ? 'سعر الكاش (خصم 10%):' : 'Cash Price (10% Off):'}</span>
                    <strong className="font-sans tabular-nums text-emerald-400 text-sm font-semibold">4,882,500 EGP</strong>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-white/5">
                    <span className="text-slate-400">{language === 'ar' ? 'سعر التقسيط:' : 'Installment Price:'}</span>
                    <strong className="font-sans tabular-nums text-white text-sm font-semibold">5,425,000 EGP</strong>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[11px] text-cyan-300">
                    <span>{language === 'ar' ? 'نظام السداد:' : 'Payment:'}</span>
                    <span className="font-medium">{language === 'ar' ? 'مقدم 50% • تقسيط حتى سنة' : '50% Down • Up to 1 Year'}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    handleUnitSwitch('panoramic_175');
                    scrollToPricing();
                  }}
                  className={`w-full py-2.5 rounded-xl font-medium text-xs transition-all flex items-center justify-center gap-2 ${
                    is175
                      ? 'bg-[#C5A880] text-[#061D28] font-semibold shadow-md'
                      : 'bg-white/10 hover:bg-white/15 text-white'
                  }`}
                >
                  <span>{is175 ? (language === 'ar' ? 'الوحدة المحددة حاليًا' : 'Selected Unit') : (language === 'ar' ? 'تحديد هذه الوحدة' : 'Select This Unit')}</span>
                  <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>

            {/* Card 3: Unit Type B (170 m² Right-Side Façade) */}
            <div className={`rounded-2xl p-5 sm:p-6 border transition-all flex flex-col justify-between relative group ${
              !is175 
                ? 'bg-gradient-to-b from-[#0B4D68]/30 via-[#061D28] to-[#04121A] border-[#C5A880] ring-1 ring-[#C5A880]/30 shadow-xl' 
                : 'bg-[#061D28] border-slate-800 hover:border-slate-700'
            }`}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 font-medium text-xs border border-cyan-500/25">
                    {language === 'ar' ? 'استلام فوري • وحدة 3' : 'READY TO MOVE • UNIT 3'}
                  </span>
                  <span className="text-xs font-medium text-[#DFCA9F]">
                    {language === 'ar' ? 'الدور الخامس والأخير' : '5TH & TOP FLOOR'}
                  </span>
                </div>

                <div className="aspect-[16/10] rounded-xl overflow-hidden bg-slate-900 border border-white/10 relative">
                  <img
                    src={buildingPhotoUrl}
                    alt="Northern Lotus 170 sqm Apartment"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-[#061D28]/90 text-[11px] font-medium text-cyan-400">
                    170 m² • {language === 'ar' ? 'يمين الواجهة' : 'Right Façade'}
                  </div>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-1 leading-snug">
                    {language === 'ar' ? 'وحدة يمين الواجهة (170 م²)' : 'Right-Side Façade Unit (170 m²)'}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    {language === 'ar' 
                      ? 'يمين الواجهة • الدور الخامس والأخير • متصالح بالعداد • أسانسير شغال • غاز طبيعي • عداد كهرباء • عمارة ساكنة.' 
                      : 'Right side of façade • 5th & top floor • Reconciled with meter • Elevator • Natural gas • Electricity meter.'}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">{language === 'ar' ? 'سعر الكاش (خصم 10%):' : 'Cash Price (10% Off):'}</span>
                    <strong className="font-sans tabular-nums text-cyan-400 text-sm font-semibold">4,590,000 EGP</strong>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-white/5">
                    <span className="text-slate-400">{language === 'ar' ? 'سعر التقسيط:' : 'Installment Price:'}</span>
                    <strong className="font-sans tabular-nums text-white text-sm font-semibold">5,100,000 EGP</strong>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[11px] text-cyan-300">
                    <span>{language === 'ar' ? 'نظام السداد:' : 'Payment:'}</span>
                    <span className="font-medium">{language === 'ar' ? 'مقدم 50% • تقسيط حتى سنة' : '50% Down • Up to 1 Year'}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    handleUnitSwitch('right_facade_170');
                    scrollToPricing();
                  }}
                  className={`w-full py-2.5 rounded-xl font-medium text-xs transition-all flex items-center justify-center gap-2 ${
                    !is175
                      ? 'bg-[#C5A880] text-[#061D28] font-semibold shadow-md'
                      : 'bg-white/10 hover:bg-white/15 text-white'
                  }`}
                >
                  <span>{!is175 ? (language === 'ar' ? 'الوحدة المحددة حاليًا' : 'Selected Unit') : (language === 'ar' ? 'تحديد هذه الوحدة' : 'Select This Unit')}</span>
                  <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 3. PAYMENT PLANS SECTION */}
      <section ref={pricingRef} className="py-16 sm:py-20 bg-[#061D28] border-b border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-2xl mx-auto text-center space-y-2.5 mb-12">
            <span className="px-3.5 py-1 rounded-full bg-[#C5A880]/15 text-[#DFCA9F] text-xs font-medium uppercase tracking-wider border border-[#C5A880]/30 inline-block">
              {language === 'ar' ? 'خطط السداد المعتمدة' : 'Verified Payment Options'}
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white leading-tight">
              {language === 'ar' ? 'اختر خطة السداد المناسبة لك' : 'Select Your Preferred Payment Plan'}
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm">
              {language === 'ar'
                ? `عرض الأسعار المعتمدة لوحدة: ${is175 ? 'وحدة 175م بانوراما' : 'وحدة 170م يمين الواجهة'}`
                : `Verified payment breakdown for ${is175 ? '175 sqm Panoramic Unit' : '170 sqm Right-Side Unit'}`}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            
            {/* Option 1: Cash Plan with 10% Discount */}
            <div className={`p-6 sm:p-7 rounded-2xl border transition-all flex flex-col justify-between ${
              selectedPaymentOption === 'cash'
                ? 'bg-gradient-to-br from-[#0B4D68]/50 via-[#061D28] to-[#04121A] border-[#C5A880] ring-1 ring-[#C5A880]/30 shadow-xl'
                : 'bg-white/5 border-white/10'
            }`}>
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 font-medium text-xs border border-emerald-500/25">
                    {language === 'ar' ? 'سعر الكاش (خصم 10%)' : '10% Cash Discount Offer'}
                  </span>
                  <span className="text-xs font-medium text-[#DFCA9F]">
                    {language === 'ar' ? 'سداد فوري' : 'Immediate Payment'}
                  </span>
                </div>

                <div>
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1">
                    {language === 'ar' ? 'سعر الكاش بعد الخصم:' : 'CASH PRICE AFTER 10% DISCOUNT:'}
                  </span>
                  <div className="text-2xl sm:text-3xl font-semibold text-white font-sans tabular-nums" dir="ltr">
                    {activeCashPrice.toLocaleString()} EGP
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    {language === 'ar' 
                      ? `السعر الأصلي: ${activeOriginalPrice.toLocaleString()} جنيه (قيمة الخصم 10%: ${activeDiscountAmount.toLocaleString()} جنيه)`
                      : `Original: EGP ${activeOriginalPrice.toLocaleString()} (10% Discount: EGP ${activeDiscountAmount.toLocaleString()})`}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 italic">
                    {language === 'ar' 
                      ? '* سعر محسوب بناءً على نسبة خصم الكاش 10% المعتمدة' 
                      : '* Calculated based on the supplied 10% cash discount.'}
                  </div>
                </div>

                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{language === 'ar' ? 'استلام فوري للوحدة' : 'Immediate handover'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{language === 'ar' ? 'متصالح بالعداد وعمارة ساكنة' : 'Reconciled with meter in occupied building'}</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => scrollToForm('cash')}
                className="w-full mt-6 py-3 rounded-xl bg-[#C5A880] hover:bg-[#DFCA9F] text-[#061D28] font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <span>{language === 'ar' ? 'اختيار خطة الكاش' : 'Select Cash Plan'}</span>
                <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Option 2: 50% Down Payment / Up to 1 Year */}
            <div className={`p-6 sm:p-7 rounded-2xl border transition-all flex flex-col justify-between ${
              selectedPaymentOption === 'installment'
                ? 'bg-gradient-to-br from-[#0B4D68]/50 via-[#061D28] to-[#04121A] border-[#C5A880] ring-1 ring-[#C5A880]/30 shadow-xl'
                : 'bg-white/5 border-white/10'
            }`}>
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 font-medium text-xs border border-cyan-500/25">
                    {language === 'ar' ? 'تقسيط حتى سنة' : 'Up to 1 Year Plan'}
                  </span>
                  <span className="text-xs font-medium text-[#DFCA9F]">
                    {language === 'ar' ? 'مقدم 50%' : '50% Down'}
                  </span>
                </div>

                <div>
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1">
                    {language === 'ar' ? 'سعر التقسيط الإجمالي:' : 'INSTALLMENT TOTAL:'}
                  </span>
                  <div className="text-2xl sm:text-3xl font-semibold text-white font-sans tabular-nums" dir="ltr">
                    {activeOriginalPrice.toLocaleString()} EGP
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span>{language === 'ar' ? 'المقدم (50%):' : 'Down Payment (50%):'}</span>
                    <strong className="font-sans tabular-nums text-white text-sm font-semibold">{activeDownPayment.toLocaleString()} EGP</strong>
                  </div>
                  <div className="flex items-center justify-between text-cyan-300 font-medium pt-1.5 border-t border-white/10">
                    <span>{language === 'ar' ? 'مدة التقسيط:' : 'Installment Duration:'}</span>
                    <span className="font-semibold">{language === 'ar' ? 'حتى سنة (12 شهرًا)' : 'Up to 1 Year (12 Months)'}</span>
                  </div>
                </div>

                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{language === 'ar' ? 'مقدم 50% وتقسيط ميسر حتى سنة' : '50% down payment with installments up to 1 year'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{language === 'ar' ? 'استلام فوري وجاهزية تامة للسكن' : 'Immediate delivery and occupancy'}</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => scrollToForm('installment')}
                className="w-full mt-6 py-3 rounded-xl bg-[#0B4D68] hover:bg-[#0E5D7D] text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <span>{language === 'ar' ? 'اختيار خطة التقسيط (مقدم 50% / سنة)' : 'Select Installment Plan (50% / 1 Yr)'}</span>
                <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
              </button>
            </div>

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
                {language === 'ar' ? 'تواصل مع مستشار العقارات بالقاهرة الجديدة' : 'Connect with New Cairo Property Advisors'}
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm">
                {language === 'ar'
                  ? 'سجل بياناتك وسيتم التواصل معك فورًا لتنسيق المعاينة الميدانية وتزويدك بكافة التفاصيل.'
                  : 'Submit your contact details for immediate consultation and site inspection coordination.'}
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
                    ? 'تم توثيق طلبك وسيتواصل معك مستشار المشروعات السكنية بالقاهرة الجديدة خلال دقائق.'
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
                    {language === 'ar' ? 'خطة السداد المفضلة:' : 'Preferred Payment Option:'}
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setSelectedPaymentOption('cash')}
                      className={`p-2.5 rounded-xl border text-xs font-medium transition-all ${
                        selectedPaymentOption === 'cash'
                          ? 'bg-[#0B4D68] border-[#C5A880] text-white shadow-sm'
                          : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      {language === 'ar' ? `كاش (خصم 10%: ${(activeCashPrice / 1000000).toFixed(3)}M ج.م)` : `Cash (10% Off: EGP ${(activeCashPrice / 1000000).toFixed(3)}M)`}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedPaymentOption('installment')}
                      className={`p-2.5 rounded-xl border text-xs font-medium transition-all ${
                        selectedPaymentOption === 'installment'
                          ? 'bg-[#0B4D68] border-[#C5A880] text-white shadow-sm'
                          : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      {language === 'ar' ? 'تقسيط (50% / سنة)' : 'Installments (50% / 1 Yr)'}
                    </button>
                  </div>
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
                {language === 'ar' ? 'صورة فعلية لواجهة المبنى – اللوتس الشمالية' : 'Actual Building Exterior – Northern Lotus'}
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
                alt="Northern Lotus Building"
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default NorthernLotusProjectExperience;
