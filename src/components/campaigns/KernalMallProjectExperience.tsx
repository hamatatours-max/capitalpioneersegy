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
  UtensilsCrossed, 
  ShieldCheck, 
  Clock, 
  Briefcase, 
  Tag, 
  Store, 
  Stethoscope, 
  Maximize, 
  Car, 
  Film,
  Play
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

interface KernalMallProjectExperienceProps {
  project: Project;
  onRequestViewing?: (projectName?: string) => void;
}

export const KernalMallProjectExperience: React.FC<KernalMallProjectExperienceProps> = ({
  project: rawProject,
  onRequestViewing
}) => {
  const { language, isRTL, t } = useLanguage();
  const project = getLocalizedProject(rawProject, language);

  // Selected Unit: 'clinic_41' (Second Floor 41 m² with Garage) | 'clinic_55' (Second Floor 55 m²) | 'fnb' (Ground Floor F&B 74+39 m²)
  const [selectedUnitType, setSelectedUnitType] = useState<'clinic_41' | 'clinic_55' | 'fnb'>('clinic_41');

  // Media view toggle: 'floor_plan' | 'video_tour' | 'real_photo'
  const [activeMediaView, setActiveMediaView] = useState<'floor_plan' | 'video_tour' | 'real_photo'>('floor_plan');

  // Active Payment Option for active unit: 'cash' | 'installment'
  const [selectedPaymentOption, setSelectedPaymentOption] = useState<'cash' | 'installment'>('cash');

  // Lightbox Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState<string>('/images/projects/kernal-mall/units/41sqm/kernal-mall-41sqm-floor-plan.jpg');
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
  const inventoryRef = useRef<HTMLDivElement | null>(null);

  // Verified Constants - 41 m² Unit (Second Floor Administrative OR Medical - INCLUDING GARAGE)
  const clinic41CashPrice = 6507000;
  const clinic41OriginalPrice = 8165000;
  const clinic41DownPaymentAmount = 4082500; // 50%
  const clinic41RemainingAmount = 4082500; // 24 months
  const clinic41Area = 41;
  const clinic41FloorPlanUrl = '/images/projects/kernal-mall/units/41sqm/kernal-mall-41sqm-floor-plan.jpg';
  const clinic41PlazaPhotoUrl = '/images/projects/kernel-mall/units/second-floor-plaza-unit/kernel-business-hub-second-floor-plaza.jpg';
  const clinic41VideoUrl = '/videos/projects/kernal-mall/41sqm-garage-unit/kernal-mall-41sqm-ready-to-move-garage.mp4';
  const clinic41VideoPosterUrl = '/videos/projects/kernal-mall/41sqm-garage-unit/kernal-mall-41sqm-video-poster.jpg';

  // Verified Constants - 55 m² Unit (Second Floor Clinic / Office)
  const clinic55OriginalPrice = 10450000;
  const clinic55CashPrice = 8360000;
  const clinic55CashSaving = 2090000;
  const clinic55DownPaymentPercent = 50;
  const clinic55DownPaymentAmount = 5225000;
  const clinic55RemainingAmount = 5225000;
  const clinic55Area = 55;
  const clinic55PlazaPhotoUrl = '/images/projects/kernel-mall/units/second-floor-plaza-unit/kernel-business-hub-second-floor-plaza.jpg';

  // Verified Constants - F&B Unit (Ground Floor)
  const fnbOriginalPrice = 33930000;
  const fnbCashPrice = 27144000;
  const fnbCashSaving = 6786000;
  const fnbDownPaymentAmount = 16965000;
  const fnbRemainingAmount = 16965000;
  const fnbTotalArea = 113;
  const fnbPlazaPhotoUrl = '/images/projects/kernel-mall/units/fnb-74-39/kernel-mall-fnb-74sqm-plaza-view.jpg';

  // Active Unit Computed Values
  const is41 = selectedUnitType === 'clinic_41';
  const is55 = selectedUnitType === 'clinic_55';
  const isFnb = selectedUnitType === 'fnb';

  let activeOriginalPrice = clinic41OriginalPrice;
  let activeCashPrice = clinic41CashPrice;
  let activeDownPayment = clinic41DownPaymentAmount;
  let activeRemaining = clinic41RemainingAmount;
  let activeArea = clinic41Area;

  if (is55) {
    activeOriginalPrice = clinic55OriginalPrice;
    activeCashPrice = clinic55CashPrice;
    activeDownPayment = clinic55DownPaymentAmount;
    activeRemaining = clinic55RemainingAmount;
    activeArea = clinic55Area;
  } else if (isFnb) {
    activeOriginalPrice = fnbOriginalPrice;
    activeCashPrice = fnbCashPrice;
    activeDownPayment = fnbDownPaymentAmount;
    activeRemaining = fnbRemainingAmount;
    activeArea = fnbTotalArea;
  }

  const currentPreviewImage = is41
    ? (activeMediaView === 'floor_plan' ? clinic41FloorPlanUrl : clinic41PlazaPhotoUrl)
    : (is55 ? clinic55PlazaPhotoUrl : fnbPlazaPhotoUrl);

  const locationText = language === 'ar' 
    ? 'القطاع الأول – على التسعين الشمالي – أمام بنك مصر – بجوار مستشفى الجوي' 
    : 'First Sector – North 90th Street – opposite Banque Misr – next to the Air Force Hospital';

  // Analytics on Mount
  useEffect(() => {
    trackEvent('kernel_project_view', {
      project_id: 'kernal-mall',
      location: 'First Sector North 90th',
      selected_unit: selectedUnitType,
    });
  }, [selectedUnitType]);

  const handleUnitSwitch = (unitType: 'clinic_41' | 'clinic_55' | 'fnb') => {
    setSelectedUnitType(unitType);
    setSelectedPaymentOption('cash');
    if (unitType !== 'clinic_41') {
      setActiveMediaView('real_photo');
    } else {
      setActiveMediaView('floor_plan');
    }
    trackEvent('kernel_unit_switch', { unit: unitType });
  };

  const handlePlanSelect = (plan: 'cash' | 'installment') => {
    setSelectedPaymentOption(plan);
    trackEvent('kernel_plan_select', {
      unit: selectedUnitType,
      plan,
      price: plan === 'cash' ? activeCashPrice : activeOriginalPrice,
    });
  };

  const handleWhatsAppClick = () => {
    let waText = '';
    if (is41) {
      waText = language === 'ar'
        ? `مرحبًا Capital Pioneers، أستفسر عن وحدة إداري أو طبي 41م جاهزة للاستلام في KERNAL MALL (القطاع الأول على التسعين الشمالي) - الدور الثاني شامل الجراج وفيو بلازا (سعر الكاش شامل الجراج: 6,507,000 جنيه | سعر التقسيط شامل الجراج: 8,165,000 جنيه بمقدم 50% على 24 شهر). برجاء تزويدي بالتفاصيل وحجز معاينة.`
        : `Hello Capital Pioneers, I am inquiring about the 41 sqm Ready-to-Move Administrative or Medical Unit in KERNAL MALL (First Sector, North 90th St) - Second Floor with Garage Included, Private Toilet, and Plaza View (Cash with Garage: EGP 6,507,000 | Installments with Garage: EGP 8,165,000 | 50% DP over 24 Months). Please provide booking details.`;
    } else if (is55) {
      waText = language === 'ar'
        ? `مرحبًا Capital Pioneers، أستفسر عن عيادة / مكتب إداري 55 م² بالدور الثاني في كيرنيل مول على التسعين الشمالي (كاش: 8,360,000 جنيه | تقسيط: 10,450,000 جنيه بمقدم 50% على 24 شهر). أرجو تزويدي بكافة التفاصيل.`
        : `Hello Capital Pioneers, I am inquiring about the 55 sqm Clinic / Administrative Office on the 2nd Floor of Kernel Mall (Cash: EGP 8,360,000 | Installments: EGP 10,450,000 | 50% DP over 24 Mos). Please send details.`;
    } else {
      waText = language === 'ar'
        ? `مرحبًا Capital Pioneers، أستفسر عن محل تجاري F&B دور أرضي 74م + 39م خارجي في كيرنيل مول على التسعين الشمالي (كاش بعد خصم 20%: 27,144,000 جنيه | تقسيط: 33,930,000 جنيه بمقدم 50% على 24 شهر). أرجو تزويدي بالتفاصيل.`
        : `Hello Capital Pioneers, I am inquiring about the Ground Floor F&B commercial unit (74 sqm indoor + 39 sqm outdoor) in Kernel Mall (Cash after 20% discount: EGP 27,144,000 | Installments: EGP 33,930,000 | 50% DP over 24 Mos). Please send details.`;
    }

    trackClickWhatsApp('kernel_hero', is41 ? 'Kernel 41sqm Garage Unit' : (is55 ? 'Kernel 55sqm Unit' : 'Kernel F&B 113sqm Unit'));
    trackEvent('kernel_whatsapp_click', { unit: selectedUnitType, plan: selectedPaymentOption });

    window.open(`https://wa.me/201066330570?text=${encodeURIComponent(waText)}`, '_blank');
  };

  const handlePhoneClick = () => {
    trackClickPhone('kernel_hero', is41 ? 'Kernel 41sqm Garage Unit' : (is55 ? 'Kernel 55sqm Unit' : 'Kernel F&B 113sqm Unit'));
    window.location.href = TEL_URL;
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
    const unitTitle = is41
      ? (language === 'ar' ? 'وحدة إداري أو طبي 41م شاملة الجراج (الدور الثاني)' : '41 sqm Admin/Medical Unit with Garage (2nd Floor)')
      : (is55 
          ? (language === 'ar' ? 'عيادة / مكتب 55 م² (الدور الثاني)' : '55 sqm Clinic/Office (2nd Floor)')
          : (language === 'ar' ? 'محل F&B دور أرضي (74م + 39م)' : 'Ground Floor F&B Unit (113 sqm)'));

    const planName = (planOverride || selectedPaymentOption) === 'cash'
      ? (language === 'ar' ? `شراء كاش (${activeCashPrice.toLocaleString()} جنيه)` : `Cash Purchase (EGP ${activeCashPrice.toLocaleString()})`)
      : (language === 'ar' ? `نظام تقسيط (مقدم 50% على 24 شهر)` : `Installment Plan (50% DP / 24 Months)`);

    setNotes(
      language === 'ar'
        ? `استفسار وحجز معاينة بخصوص ${unitTitle} في KERNAL MALL — نظام السداد: ${planName}`
        : `Inquiry and viewing request for ${unitTitle} in KERNAL MALL — Selected Plan: ${planName}`
    );
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFormStart = () => {
    if (!hasStartedForm.current) {
      hasStartedForm.current = true;
      trackFormStart('kernel_lead_form', 'full_name');
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;

    setIsSubmitting(true);
    const unitTitle = is41
      ? 'Kernel Mall 41 sqm Admin/Medical Unit with Garage (Second Floor)'
      : (is55 ? 'Kernel Mall 55 sqm Clinic/Office Unit (Second Floor)' : 'Kernel Mall Ground Floor F&B Unit (74+39 sqm)');

    const selectedPlanText = selectedPaymentOption === 'cash' 
      ? `Cash Purchase (EGP ${activeCashPrice.toLocaleString()})`
      : `Installment Plan (50% Down = EGP ${activeDownPayment.toLocaleString()} | 24 Months | Total EGP ${activeOriginalPrice.toLocaleString()})`;

    const leadData: LeadFormData = {
      fullName: fullName.trim() || (language === 'ar' ? 'عميل مهتم بوحدات كيرنال مول' : 'Kernel Mall Prospect'),
      phoneNumber: phoneNumber.trim(),
      interestedProject: `Kernel Mall - ${unitTitle}`,
      propertyType: 'Office',
      purpose: 'Investment' as PurposeOption,
      preferredContactMethod: preferredContact === 'whatsapp' ? 'WhatsApp' : 'Phone',
      message: `${notes ? notes + ' | ' : ''}Unit: ${unitTitle} | Option: ${selectedPlanText} | Location: ${locationText}`,
    };

    try {
      await submitLead(leadData);
      trackFormSubmit({
        form_name: 'kernel_lead_form',
        interested_project: unitTitle,
        property_type: 'Office',
        purpose: 'Investment',
      });
      trackEvent('kernel_lead_submit', {
        unit: selectedUnitType,
        plan: selectedPaymentOption,
        price: selectedPaymentOption === 'cash' ? activeCashPrice : activeOriginalPrice,
      });

      const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
      const waText = language === 'ar'
        ? `مرحبًا Capital Pioneers، أنا ${fullName || 'عميل مهتم'}، أود حجز معاينة لوحدة ${is41 ? '41م إداري/طبي شاملة الجراج' : (is55 ? '55م عيادة/مكتب' : 'F&B دور أرضي')} في KERNAL MALL. الخطة: ${selectedPlanText}. هاتف: ${cleanPhone}.`
        : `Hello Capital Pioneers, my name is ${fullName || 'an interested client'}. I would like to schedule a viewing for the ${is41 ? '41 sqm unit with Garage' : (is55 ? '55 sqm unit' : 'F&B unit')} in KERNAL MALL. Preferred Plan: ${selectedPlanText}. Phone: ${cleanPhone}.`;
      
      const directWaUrl = `https://wa.me/201066330570?text=${encodeURIComponent(waText)}`;
      setWhatsappHandoffUrl(directWaUrl);
      setFormSubmitted(true);
    } catch (err) {
      console.error('Failed to submit Kernel Mall lead:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openLightbox = (imageSrc: string, caption: string) => {
    setModalImageSrc(imageSrc);
    setModalCaption(caption);
    setIsModalOpen(true);
    trackEvent('kernal_image_zoom', { image: imageSrc, caption });
  };

  // Structured Data (JSON-LD)
  const realEstateSchema = generateRealEstateListingSchema(project);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: language === 'ar' ? 'الرئيسية' : 'Home', item: '/' },
    { name: language === 'ar' ? 'المشروعات' : 'Projects', item: '/projects' },
    { name: 'KERNEL MALL', item: '/projects/kernal-mall-41-sqm-clinic-office-new-cairo' },
  ]);

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: is41 
      ? '41 sqm Ready-to-Move Administrative or Medical Unit with Garage – KERNAL MALL'
      : (is55 ? '55 sqm Second Floor Clinic / Office Unit – KERNAL MALL' : 'Ground Floor F&B Commercial Unit (74+39 sqm) – KERNAL MALL'),
    description: is41
      ? 'Ready to move 41 sqm administrative or medical unit on the second floor of KERNAL MALL on North 90th Street, New Cairo. Fully finished with AC, private toilet, plaza view, and garage included in both cash and installment prices.'
      : (is55
          ? 'Ready-to-move 55 sqm clinic or administrative office on second floor in Kernel Mall, North 90th Street, New Cairo.'
          : 'Ready-to-move Ground Floor F&B commercial unit in Kernel Mall, North 90th Street, New Cairo.'),
    image: [
      `https://capitalpioneers.com${currentPreviewImage}`,
      'https://capitalpioneers.com/images/projects/kernal-mall/units/41sqm/kernal-mall-41sqm-floor-plan.jpg',
      'https://capitalpioneers.com/images/projects/kernel-mall/units/second-floor-plaza-unit/kernel-business-hub-second-floor-plaza.jpg'
    ],
    offers: [
      {
        '@type': 'Offer',
        name: 'Unit 41 sqm Cash Purchase Price (Including Garage)',
        price: '6507000',
        priceCurrency: 'EGP',
        availability: 'https://schema.org/InStock',
        priceValidUntil: '2026-12-31',
        url: 'https://capitalpioneers.com/projects/kernal-mall-41-sqm-clinic-office-new-cairo',
      },
      {
        '@type': 'Offer',
        name: 'Unit 41 sqm 24 Months Installment Plan (Including Garage)',
        price: '8165000',
        priceCurrency: 'EGP',
        availability: 'https://schema.org/InStock',
        priceValidUntil: '2026-12-31',
        url: 'https://capitalpioneers.com/projects/kernal-mall-41-sqm-clinic-office-new-cairo',
      }
    ],
  };

  return (
    <div className={`min-h-screen bg-[#061D28] text-slate-100 selection:bg-[#C5A880] selection:text-[#061D28] ${isRTL ? 'font-arabic' : 'font-sans'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <SEO
        title={is41 
          ? (language === 'ar' ? 'وحدة إداري أو طبي 41م جاهزة للاستلام في KERNAL MALL | شامل الجراج' : '41 sqm Administrative or Medical Unit in KERNAL MALL | Ready to Move with Garage')
          : (is55 
              ? (language === 'ar' ? 'عيادة ومكتب 55 متر للبيع في كيرنيل مول التجمع الخامس – استلام فوري فيو بلازا' : 'Kernel Mall 55 sqm Clinic & Office for Sale | North 90th New Cairo')
              : (language === 'ar' ? 'محل F&B للبيع في كيرنيل مول التجمع الخامس – 74م + 39م Outdoor | استلام فوري' : 'Kernel Mall Ground Floor F&B 74 sqm + 39 sqm Outdoor for Sale | New Cairo'))}
        description={is41
          ? (language === 'ar' ? 'وحدة إدارية أو طبية بمساحة 41 م² داخل KERNAL MALL، جاهزة للاستلام والتشغيل، ومتشطبة بالتكييفات. تقع الوحدة بالدور الثاني وتضم حمامًا خاصًا، مع فيو على البلازا وظهور من المدخل الرئيسي، شاملة الجراج في السعر. كاش: 6,507,000 جنيه | تقسيط: 8,165,000 جنيه بمقدم 50% على 24 شهر.' : 'Ready-to-move 41 sqm administrative or medical unit in KERNAL MALL New Cairo. Fully finished with AC, second floor, private toilet, plaza view, visible from main entrance, and garage included in price. Cash EGP 6.507M or installments EGP 8.165M with 50% down over 24 months.')
          : (is55
              ? (language === 'ar' ? 'وحدة إدارية أو طبية 55 م² جاهزة للاستلام الفوري في كيرنيل مول، القطاع الأول على شارع التسعين الشمالي، متشطبة بالتكييفات وحمام خاص وإطلالة مباشرة على البلازا. كاش: 8,360,000 ج.م | تقسيط: 10,450,000 ج.م بمقدم 50% على 24 شهرًا.' : 'Ready-to-move 55 sqm clinic or administrative office in Kernel Mall, North 90th Street, New Cairo. Fully finished with AC, private toilet and direct plaza view.')
              : (language === 'ar' ? 'فرصة تجارية مميزة داخل كيرنيل مول بالقاهرة الجديدة، لوحدة F&B بالدور الأرضي 74م + 39م خارجي جاهزة للاستلام الفوري بفيو بلازا وخصم كاش 20% وتسهيلات على 24 شهرًا.' : 'Ready-to-move Ground Floor F&B commercial unit (74 sqm indoor + 39 sqm outdoor) in Kernel Mall, North 90th Street, New Cairo.'))}
        canonicalPath="/projects/kernal-mall-41-sqm-clinic-office-new-cairo"
        ogType="website"
        ogImage={`https://capitalpioneers.com${currentPreviewImage}`}
        schema={[breadcrumbSchema, realEstateSchema, productSchema]}
      />

      {/* 1. HERO SECTION */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden bg-gradient-to-b from-[#04121A] via-[#061D28] to-[#082938]">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[#0B4D68]/15 blur-[140px] pointer-events-none rounded-full" />
        <div className="absolute top-10 right-10 w-96 h-96 bg-[#C5A880]/10 blur-[120px] pointer-events-none rounded-full" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* UNIT SWITCHER TABS */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-8 sm:mb-10">
            {/* Unit 1: 41 m² (Featured Corrected Ready Unit with Garage) */}
            <button
              type="button"
              onClick={() => handleUnitSwitch('clinic_41')}
              className={`px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm flex items-center gap-2 transition-all ${
                is41
                  ? 'bg-[#C5A880] text-[#061D28] font-semibold shadow-md ring-2 ring-[#C5A880]/30'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'وحدة إداري أو طبي (41 م² + جراج)' : '41 sqm Admin / Medical (with Garage)'}</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-700/80 text-white text-[10px] font-medium">
                {language === 'ar' ? 'استلام فوري' : 'Ready'}
              </span>
            </button>

            {/* Unit 2: 55 m² Clinic / Office */}
            <button
              type="button"
              onClick={() => handleUnitSwitch('clinic_55')}
              className={`px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm flex items-center gap-2 transition-all ${
                is55
                  ? 'bg-[#C5A880] text-[#061D28] font-semibold shadow-md ring-2 ring-[#C5A880]/30'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'عيادة / مكتب إداري (55 م²)' : '55 sqm Clinic / Office'}</span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-700/80 text-white text-[10px] font-medium">
                {language === 'ar' ? 'فيو بلازا' : 'Plaza View'}
              </span>
            </button>

            {/* Unit 3: F&B Ground Floor (113 m²) */}
            <button
              type="button"
              onClick={() => handleUnitSwitch('fnb')}
              className={`px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm flex items-center gap-2 transition-all ${
                isFnb
                  ? 'bg-[#C5A880] text-[#061D28] font-semibold shadow-md ring-2 ring-[#C5A880]/30'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
              }`}
            >
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'وحدة تجارية F&B دور أرضي (74م + 39م)' : 'Ground Floor F&B Unit'}</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-700/80 text-white text-[10px] font-medium">
                {language === 'ar' ? 'خصم 20%' : '20% OFF'}
              </span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* Refined Priority Badges (3-4 concise, non-crowded badges) */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
                  <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{language === 'ar' ? 'استلام فوري' : 'READY TO MOVE'}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A880]/15 border border-[#C5A880]/30 text-[#DFCA9F] text-xs font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>{language === 'ar' ? 'القطاع الأول • التسعين الشمالي' : 'First Sector • North 90th St'}</span>
                </span>
                {is41 && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-medium">
                    <Car className="w-3.5 h-3.5 text-amber-400" />
                    <span>{language === 'ar' ? 'الجراج مشمول في السعر' : 'GARAGE INCLUDED'}</span>
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-medium">
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{language === 'ar' ? 'فيو بلازا' : 'Plaza View'}</span>
                </span>
              </div>

              {/* Title & Description Copy */}
              <div className="space-y-3 max-w-2xl">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] xl:text-[46px] font-semibold text-white tracking-normal leading-[1.2]">
                  {is41 ? (
                    language === 'ar' ? (
                      <>
                        وحدة إداري أو طبي 41م جاهزة للاستلام<br />
                        في <span className="font-semibold text-[#DFCA9F]" dir="ltr">KERNEL MALL</span>
                      </>
                    ) : (
                      '41 sqm Administrative or Medical Unit in KERNAL MALL'
                    )
                  ) : is55 ? (
                    language === 'ar' ? (
                      <>
                        عيادة أو مكتب 55 م² جاهزة للاستلام<br />
                        في <span className="font-semibold text-[#DFCA9F]" dir="ltr">KERNEL MALL</span>
                      </>
                    ) : (
                      '55 sqm Clinic / Office Unit – KERNAL MALL'
                    )
                  ) : (
                    language === 'ar' ? (
                      <>
                        محل تجاري F&B دور أرضي جاهز للاستلام<br />
                        في <span className="font-semibold text-[#DFCA9F]" dir="ltr">KERNEL MALL</span>
                      </>
                    ) : (
                      'Ground Floor F&B Unit – KERNAL MALL'
                    )
                  )}
                </h1>
                <p className="text-sm sm:text-base md:text-[17px] font-normal text-slate-300 leading-[1.75]">
                  {is41
                    ? (language === 'ar' 
                        ? 'وحدة إدارية أو طبية بمساحة 41 م² داخل KERNAL MALL، جاهزة للاستلام والتشغيل، ومتـشطبة بالتكييفات. تقع الوحدة بالدور الثاني وتضم حمامًا خاصًا، مع فيو على البلازا وظهور من المدخل الرئيسي (الجراج مشمول في السعر).' 
                        : 'A 41 sqm administrative or medical unit in KERNAL MALL, ready to move and fully finished with air conditioning. The unit is located on the second floor, includes a private toilet, enjoys a plaza view and is visible from the main entrance (Garage Included in price).')
                    : (is55
                        ? (language === 'ar' 
                            ? 'الدور الثاني • فيو مباشر على البلازا والمدخل الرئيسي • تشطيب كامل بالتكييفات وحمام خاص.' 
                            : 'Second Floor • Direct Plaza & Main Entrance View • Fully Finished with AC & Private Toilet.')
                        : (language === 'ar' 
                            ? '74 م² مساحة داخلية + 39 م² مساحة خارجية (إجمالي 113 م²) بفيو مباشر على البلازا.' 
                            : '74 m² Indoor Area + 39 m² Outdoor Area (113 m² Total Usable Area) with Direct Plaza Frontage.'))}
                </p>
              </div>

              {/* Location Description */}
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm text-xs sm:text-sm text-slate-300 max-w-2xl">
                <MapPin className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="text-[11px] text-[#DFCA9F] font-medium block uppercase tracking-wider">{language === 'ar' ? 'الموقع المعتمد:' : 'Verified Location:'}</span>
                  <p className="leading-relaxed font-normal">
                    {locationText}
                  </p>
                </div>
              </div>

              {/* PROMOTIONAL CASH & INSTALLMENT PRICING BLOCK (Refined Tabular Figures & Weights) */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0B4D68]/40 via-[#061D28] to-[#04121A] border border-[#C5A880]/50 shadow-xl space-y-3.5 max-w-2xl">
                
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-[#DFCA9F]" />
                    <span className="text-xs text-[#DFCA9F] font-medium tracking-wide">
                      {language === 'ar' ? (is41 ? 'الأسعار شاملة الجراج المعتمدة' : 'الأسعار وأنظمة السداد المعتمدة') : (is41 ? 'Verified Pricing (Including Garage)' : 'Verified Pricing & Payment Terms')}
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-medium border border-emerald-500/25">
                    {language === 'ar' ? 'مقدم 50% • 24 شهر' : '50% Down • 24 Months'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                  
                  {/* Cash Price Box */}
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
                        {language === 'ar' ? (is41 ? 'سعر الكاش شامل الجراج:' : 'سعر الكاش:') : (is41 ? 'CASH PRICE (INC. GARAGE):' : 'CASH PRICE:')}
                      </span>
                      {is41 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-medium">
                          {language === 'ar' ? 'شامل الجراج' : 'Inc. Garage'}
                        </span>
                      )}
                    </div>
                    <div className="text-xl sm:text-2xl font-semibold text-white tracking-tight tabular-nums font-sans" dir="ltr">
                      {activeCashPrice.toLocaleString()} EGP
                    </div>
                    <div className="text-[11px] text-slate-300 mt-0.5">
                      {language === 'ar' ? 'سداد فوري كاش عند التعاقد' : 'Immediate Cash Settlement'}
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
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] text-slate-300 font-medium block uppercase">
                        {language === 'ar' ? (is41 ? 'سعر التقسيط شامل الجراج:' : 'سعر التقسيط:') : (is41 ? 'INSTALLMENT (INC. GARAGE):' : 'INSTALLMENT PRICE:')}
                      </span>
                      {is41 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-medium">
                          {language === 'ar' ? 'شامل الجراج' : 'Inc. Garage'}
                        </span>
                      )}
                    </div>
                    <div className="text-xl sm:text-2xl font-semibold text-white tracking-tight tabular-nums font-sans" dir="ltr">
                      {activeOriginalPrice.toLocaleString()} EGP
                    </div>
                    <div className="text-[11px] text-cyan-300 mt-0.5 font-medium">
                      {language === 'ar' ? 'مقدم 50% وتقسيط على 24 شهر' : '50% Down Payment / 24 Months'}
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
                  <span>{language === 'ar' ? 'طلب معاينة الوحدة' : 'Request Viewing & Details'}</span>
                  <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                </button>

                <button
                  type="button"
                  onClick={() => scrollToInventory()}
                  className="px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs sm:text-sm flex items-center gap-2 border border-white/15 transition-all"
                >
                  <Building2 className="w-4 h-4 text-[#C5A880]" />
                  <span>{language === 'ar' ? 'جدول الوحدات المتاحة' : 'View Units Table'}</span>
                </button>
              </div>

            </div>

            {/* Right Media Preview Column (Floor Plan / Video Tour / Facade & Plaza View) */}
            <div className="lg:col-span-5">
              <div className="relative group rounded-3xl overflow-hidden bg-white/5 border border-white/15 p-3.5 backdrop-blur-md shadow-xl space-y-3">
                
                {/* Header Tag */}
                <div className="flex items-center justify-between pb-2.5 border-b border-white/10 text-xs">
                  <div className="flex items-center gap-2 text-[#DFCA9F] font-medium">
                    <Layers className="w-4 h-4" />
                    <span>
                      {is41
                        ? (activeMediaView === 'floor_plan'
                            ? (language === 'ar' ? 'المخطط الهندسي المعتمد للوحدة 41م' : '41 sqm Unit Floor Plan')
                            : (activeMediaView === 'video_tour'
                                ? (language === 'ar' ? 'فيديو المعاينة الفعلي للوحدة 41م' : 'Actual Video Tour – 41 sqm Unit')
                                : (language === 'ar' ? 'صورة الواجهة والبلازا بالدور الثاني' : 'Second Floor Plaza & Facade View')))
                        : (is55
                            ? (language === 'ar' ? 'صورة الواجهة وإطلالة الدور الثاني 55م' : 'Second Floor 55 sqm Unit Location')
                            : (language === 'ar' ? 'صورة موقع الوحدة التجارية F&B بالبلازا' : 'Ground Floor F&B Plaza Location'))}
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 font-sans text-[11px] font-medium">
                    {is41 ? 'Floor 2 • 41 m² (with Garage)' : (is55 ? 'Floor 2 • 55 m²' : 'Ground Floor • 113 m²')}
                  </span>
                </div>

                {/* 41 m² Media Tabs: Floor Plan | Video Tour | Facade & Plaza */}
                {is41 && (
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setActiveMediaView('floor_plan')}
                      className={`py-2 px-2.5 rounded-xl text-[11px] sm:text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                        activeMediaView === 'floor_plan'
                          ? 'bg-[#C5A880] text-[#061D28] font-semibold shadow-sm'
                          : 'bg-white/10 text-slate-300 hover:bg-white/15'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5 shrink-0" />
                      <span>{language === 'ar' ? 'المخطط' : 'Floor Plan'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveMediaView('video_tour')}
                      className={`py-2 px-2.5 rounded-xl text-[11px] sm:text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                        activeMediaView === 'video_tour'
                          ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                          : 'bg-white/10 text-slate-300 hover:bg-white/15'
                      }`}
                    >
                      <Film className="w-3.5 h-3.5 shrink-0" />
                      <span>{language === 'ar' ? 'فيديو الوحدة' : 'Video Tour'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveMediaView('real_photo')}
                      className={`py-2 px-2.5 rounded-xl text-[11px] sm:text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                        activeMediaView === 'real_photo'
                          ? 'bg-[#C5A880] text-[#061D28] font-semibold shadow-sm'
                          : 'bg-white/10 text-slate-300 hover:bg-white/15'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5 shrink-0" />
                      <span>{language === 'ar' ? 'الواجهة والبلازا' : 'Plaza'}</span>
                    </button>
                  </div>
                )}

                {/* Media Container (Image or Video Player) */}
                {is41 && activeMediaView === 'video_tour' ? (
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-black flex items-center justify-center shadow-inner">
                    <video
                      controls
                      playsInline
                      preload="metadata"
                      poster={clinic41VideoPosterUrl}
                      className="w-full h-full object-cover"
                    >
                      <source src={clinic41VideoUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ) : (
                  <div 
                    onClick={() => openLightbox(
                      currentPreviewImage,
                      is41
                        ? (activeMediaView === 'floor_plan'
                            ? (language === 'ar' ? 'مخطط وحدة 41 م² – KERNAL MALL' : '41 sqm Unit Floor Plan – KERNAL MALL')
                            : (language === 'ar' ? 'واجهة كيرنال مول – إطلالة الدور الثاني على البلازا والمدخل' : 'KERNAL MALL Facade – Second Floor View on Plaza'))
                        : (is55 
                            ? (language === 'ar' ? 'واجهة كيرنيل بيزنس هاب – إطلالة وحدة 55 م² بالدور الثاني على البلازا والمدخل' : 'Kernel Business Hub Facade – 55 sqm Second Floor Unit on Plaza & Entrance')
                            : (language === 'ar' ? 'بلازا كيرنيل مول – موقع الوحدة التجارية F&B بالدور الأرضي' : 'Kernel Mall Plaza – Ground Floor F&B Unit Location'))
                    )}
                    className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900 cursor-pointer group"
                  >
                    <img
                      src={currentPreviewImage}
                      alt={is41
                        ? (language === 'ar' ? 'مخطط وحدة 41 متر إداري أو طبي في KERNAL MALL التجمع الخامس' : 'Floor plan for 41 sqm administrative or medical unit in KERNAL MALL New Cairo')
                        : (is55
                            ? (language === 'ar' ? 'وحدة 55 م² عيادة أو مكتب إداري بالدور الثاني في كيرنيل مول القاهرة الجديدة' : '55 sqm clinic or administrative office unit second floor at Kernel Mall New Cairo')
                            : (language === 'ar' ? 'وحدة تجارية F&B دور أرضي بفيو على البلازا في كيرنيل مول القاهرة الجديدة' : 'Ground floor F&B commercial unit plaza view at Kernel Mall New Cairo'))}
                      title={is41
                        ? (language === 'ar' ? 'مخطط وحدة 41 م² – KERNAL MALL' : '41 sqm Unit Floor Plan – KERNAL MALL')
                        : (is55 ? 'Kernel Business Hub 55 sqm Unit Location' : 'Kernel Mall Plaza F&B Unit Location')}
                      className="w-full h-full object-contain bg-white/5 p-2 transition-transform duration-500 group-hover:scale-105"
                      loading="eager"
                    />
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-[#061D28]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-medium text-xs sm:text-sm backdrop-blur-[2px]">
                      <Maximize className="w-4 h-4 text-[#DFCA9F]" />
                      <span>{language === 'ar' ? 'انقر لتكبير المخطط' : 'Click to View Full Resolution'}</span>
                    </div>

                    {/* Marker Legend Badge */}
                    <div className="absolute bottom-2 left-2 right-2 bg-[#061D28]/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/15 text-[11px] text-slate-200 flex items-center justify-between">
                      <span className="font-medium text-[#DFCA9F]">
                        {is41
                          ? (activeMediaView === 'floor_plan'
                              ? (language === 'ar' ? 'مخطط وحدة 41 م² – KERNAL MALL' : '41 sqm Unit Floor Plan – KERNAL MALL')
                              : (language === 'ar' ? 'موقع وحدة الدور الثاني محددة بالمؤشر' : 'Second floor unit location'))
                          : (is55
                              ? (language === 'ar' ? 'وحدة 55 م² محددة بالمؤشر بالدور الثاني' : '55 sqm unit indicated by marker on 2nd floor')
                              : (language === 'ar' ? 'موقع الوحدة محدد بالمؤشر على البلازا' : 'Position indicated by pointer on plaza'))}
                      </span>
                      <span className="text-emerald-400 font-medium">
                        {language === 'ar' ? 'فيو بلازا' : 'Plaza View'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Fast Specs Strip */}
                <div className="grid grid-cols-3 gap-2 pt-1 border-t border-white/10 text-center text-xs">
                  <div className="p-2 rounded-xl bg-white/5">
                    <span className="text-slate-400 block text-[10px]">{language === 'ar' ? 'المساحة' : 'Unit Area'}</span>
                    <strong className="text-white font-semibold text-xs sm:text-sm">{is41 ? '41 m²' : (is55 ? '55 m²' : '113 m²')}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5">
                    <span className="text-slate-400 block text-[10px]">{language === 'ar' ? 'الدور' : 'Floor'}</span>
                    <strong className="text-[#DFCA9F] font-semibold text-xs sm:text-sm">{isFnb ? (language === 'ar' ? 'أرضي' : 'Ground') : (language === 'ar' ? 'الدور الثاني' : '2nd Floor')}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5">
                    <span className="text-slate-400 block text-[10px]">{language === 'ar' ? 'حالة الاستلام' : 'Status'}</span>
                    <strong className="text-emerald-400 font-semibold text-xs sm:text-sm">{language === 'ar' ? 'استلام فوري' : 'Ready'}</strong>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. AVAILABLE UNITS INVENTORY DIRECTORY (جدول ودليل الوحدات المتاحة) */}
      <section ref={inventoryRef} className="py-16 sm:py-20 bg-[#04121A] border-y border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-2xl mx-auto text-center space-y-2.5 mb-12">
            <span className="px-3.5 py-1 rounded-full bg-[#C5A880]/15 text-[#DFCA9F] text-xs font-medium uppercase tracking-wider border border-[#C5A880]/30 inline-block">
              {language === 'ar' ? 'دليل الوحدات المتاحة' : 'Available Inventory Directory'}
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white leading-tight">
              {language === 'ar' ? 'قائمة الوحدات المتاحة للاستلام الفوري في KERNAL MALL' : 'Ready-to-Move Units in KERNAL MALL'}
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              {language === 'ar'
                ? 'اختر الوحدة المناسبة لنشاطك التجاري، الإداري أو الطبي على شارع التسعين الشمالي مباشرة.'
                : 'Select your preferred commercial, medical, or administrative unit directly on North 90th Street.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            
            {/* Card 1: 41 m² Administrative / Medical Unit (WITH GARAGE) */}
            <div className={`rounded-2xl p-5 sm:p-6 border transition-all flex flex-col justify-between relative group ${
              is41 
                ? 'bg-gradient-to-b from-[#0B4D68]/30 via-[#061D28] to-[#04121A] border-[#C5A880] ring-1 ring-[#C5A880]/30 shadow-xl' 
                : 'bg-[#061D28] border-slate-800 hover:border-slate-700'
            }`}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 font-medium text-xs border border-emerald-500/25">
                    {language === 'ar' ? 'استلام فوري • شامل الجراج' : 'READY TO MOVE • INC. GARAGE'}
                  </span>
                  <span className="text-xs font-medium text-[#DFCA9F]">
                    {language === 'ar' ? 'الدور الثاني' : 'SECOND FLOOR'}
                  </span>
                </div>

                <div className="aspect-[16/10] rounded-xl overflow-hidden bg-slate-900 border border-white/10 relative">
                  <img
                    src={clinic41FloorPlanUrl}
                    alt="41 sqm unit floor plan"
                    className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-[#061D28]/90 text-[11px] font-medium text-emerald-400">
                    41 m² • {language === 'ar' ? 'إداري / طبي' : 'Admin/Medical'}
                  </div>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-1 leading-snug">
                    {language === 'ar' ? 'وحدة إداري أو طبي 41م شاملة الجراج' : '41 sqm Admin/Medical Unit with Garage'}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    {language === 'ar' 
                      ? 'الدور الثاني • حمام خاص • فيو على البلازا • ظهور من المدخل الرئيسي • متشطب بالتكييفات • الجراج مشمول في السعر.' 
                      : 'Second floor • Private toilet • Plaza view • Visible from main entrance • Fully finished with AC • Garage included.'}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">{language === 'ar' ? 'سعر الكاش (شامل الجراج):' : 'Cash Price (Inc. Garage):'}</span>
                    <strong className="font-sans tabular-nums text-emerald-400 text-sm font-semibold">6,507,000 EGP</strong>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-white/5">
                    <span className="text-slate-400">{language === 'ar' ? 'سعر التقسيط (شامل الجراج):' : 'Installments (Inc. Garage):'}</span>
                    <strong className="font-sans tabular-nums text-white text-sm font-semibold">8,165,000 EGP</strong>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[11px] text-cyan-300">
                    <span>{language === 'ar' ? 'نظام السداد:' : 'Payment:'}</span>
                    <span className="font-medium">{language === 'ar' ? 'مقدم 50% • 24 شهر' : '50% Down • 24 Months'}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    handleUnitSwitch('clinic_41');
                    scrollToPricing();
                  }}
                  className={`w-full py-2.5 rounded-xl font-medium text-xs transition-all flex items-center justify-center gap-2 ${
                    is41
                      ? 'bg-[#C5A880] text-[#061D28] font-semibold shadow-md'
                      : 'bg-white/10 hover:bg-white/15 text-white'
                  }`}
                >
                  <span>{is41 ? (language === 'ar' ? 'الوحدة المحددة حاليًا' : 'Selected Unit') : (language === 'ar' ? 'تحديد هذه الوحدة' : 'Select This Unit')}</span>
                  <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>

            {/* Card 2: 55 m² Second Floor Clinic / Office */}
            <div className={`rounded-2xl p-5 sm:p-6 border transition-all flex flex-col justify-between relative group ${
              is55 
                ? 'bg-gradient-to-b from-[#0B4D68]/30 via-[#061D28] to-[#04121A] border-[#C5A880] ring-1 ring-[#C5A880]/30 shadow-xl' 
                : 'bg-[#061D28] border-slate-800 hover:border-slate-700'
            }`}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 font-medium text-xs border border-cyan-500/25">
                    {language === 'ar' ? 'استلام فوري • فيو بلازا' : 'READY TO MOVE • PLAZA'}
                  </span>
                  <span className="text-xs font-medium text-[#DFCA9F]">
                    {language === 'ar' ? 'الدور الثاني' : 'SECOND FLOOR'}
                  </span>
                </div>

                <div className="aspect-[16/10] rounded-xl overflow-hidden bg-slate-900 border border-white/10 relative">
                  <img
                    src={clinic55PlazaPhotoUrl}
                    alt="55 sqm unit plaza view"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-[#061D28]/90 text-[11px] font-medium text-cyan-400">
                    55 m² • {language === 'ar' ? 'عيادة / مكتب' : 'Clinic/Office'}
                  </div>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-1 leading-snug">
                    {language === 'ar' ? 'عيادة / مكتب إداري (55 م²)' : '55 sqm Clinic / Office Unit'}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    {language === 'ar' 
                      ? 'الدور الثاني • حمام خاص • تشطيب كامل بالتكييفات • فيو مباشر على البلازا والمدخل الرئيسي.' 
                      : 'Second floor • Private toilet • Fully finished with AC • Direct view on plaza and main entrance.'}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">{language === 'ar' ? 'سعر الكاش:' : 'Cash Price:'}</span>
                    <strong className="font-sans tabular-nums text-emerald-400 text-sm font-semibold">8,360,000 EGP</strong>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-white/5">
                    <span className="text-slate-400">{language === 'ar' ? 'سعر التقسيط:' : 'Installment Price:'}</span>
                    <strong className="font-sans tabular-nums text-white text-sm font-semibold">10,450,000 EGP</strong>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[11px] text-cyan-300">
                    <span>{language === 'ar' ? 'نظام السداد:' : 'Payment:'}</span>
                    <span className="font-medium">{language === 'ar' ? 'مقدم 50% • 24 شهر' : '50% Down • 24 Months'}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    handleUnitSwitch('clinic_55');
                    scrollToPricing();
                  }}
                  className={`w-full py-2.5 rounded-xl font-medium text-xs transition-all flex items-center justify-center gap-2 ${
                    is55
                      ? 'bg-[#C5A880] text-[#061D28] font-semibold shadow-md'
                      : 'bg-white/10 hover:bg-white/15 text-white'
                  }`}
                >
                  <span>{is55 ? (language === 'ar' ? 'الوحدة المحددة حاليًا' : 'Selected Unit') : (language === 'ar' ? 'تحديد هذه الوحدة' : 'Select This Unit')}</span>
                  <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>

            {/* Card 3: Ground Floor F&B Commercial Unit (113 m²) */}
            <div className={`rounded-2xl p-5 sm:p-6 border transition-all flex flex-col justify-between relative group ${
              isFnb 
                ? 'bg-gradient-to-b from-[#0B4D68]/30 via-[#061D28] to-[#04121A] border-[#C5A880] ring-1 ring-[#C5A880]/30 shadow-xl' 
                : 'bg-[#061D28] border-slate-800 hover:border-slate-700'
            }`}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 font-medium text-xs border border-amber-500/25">
                    {language === 'ar' ? 'خصم كاش 20%' : '20% CASH DISCOUNT'}
                  </span>
                  <span className="text-xs font-medium text-[#DFCA9F]">
                    {language === 'ar' ? 'دور أرضي' : 'GROUND FLOOR'}
                  </span>
                </div>

                <div className="aspect-[16/10] rounded-xl overflow-hidden bg-slate-900 border border-white/10 relative">
                  <img
                    src={fnbPlazaPhotoUrl}
                    alt="Ground Floor F&B Plaza View"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-[#061D28]/90 text-[11px] font-medium text-amber-400">
                    74 + 39 m² • {language === 'ar' ? 'مطعم / كافيه' : 'F&B Unit'}
                  </div>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-1 leading-snug">
                    {language === 'ar' ? 'محل تجاري F&B دور أرضي (113 م²)' : 'Ground Floor F&B Unit (113 m²)'}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    {language === 'ar' 
                      ? '74 م² مساحة داخلية + 39 م² أوت دور بفيو بلازا مباشر وظهور كامل من المدخل الرئيسي.' 
                      : '74 m² indoor + 39 m² outdoor with direct plaza frontage and main entrance visibility.'}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">{language === 'ar' ? 'سعر الكاش (خصم 20%):' : 'Cash Price (20% Off):'}</span>
                    <strong className="font-sans tabular-nums text-emerald-400 text-sm font-semibold">27,144,000 EGP</strong>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-white/5">
                    <span className="text-slate-400">{language === 'ar' ? 'سعر التقسيط:' : 'Installment Price:'}</span>
                    <strong className="font-sans tabular-nums text-white text-sm font-semibold">33,930,000 EGP</strong>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[11px] text-cyan-300">
                    <span>{language === 'ar' ? 'نظام السداد:' : 'Payment:'}</span>
                    <span className="font-medium">{language === 'ar' ? 'مقدم 50% • 24 شهر' : '50% Down • 24 Months'}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    handleUnitSwitch('fnb');
                    scrollToPricing();
                  }}
                  className={`w-full py-2.5 rounded-xl font-medium text-xs transition-all flex items-center justify-center gap-2 ${
                    isFnb
                      ? 'bg-[#C5A880] text-[#061D28] font-semibold shadow-md'
                      : 'bg-white/10 hover:bg-white/15 text-white'
                  }`}
                >
                  <span>{isFnb ? (language === 'ar' ? 'الوحدة المحددة حاليًا' : 'Selected Unit') : (language === 'ar' ? 'تحديد هذه الوحدة' : 'Select This Unit')}</span>
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
                ? `عرض تفاصيل الأسعار المعتمدة لوحدة: ${is41 ? 'وحدة 41م شاملة الجراج' : (is55 ? 'عيادة / مكتب 55 م²' : 'محل F&B دور أرضي')}`
                : `Verified payment breakdown for ${is41 ? '41 sqm Unit with Garage' : (is55 ? '55 sqm Clinic / Office' : 'Ground Floor F&B Unit')}`}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            
            {/* Option 1: Cash Plan */}
            <div className={`p-6 sm:p-7 rounded-2xl border transition-all flex flex-col justify-between ${
              selectedPaymentOption === 'cash'
                ? 'bg-gradient-to-br from-[#0B4D68]/50 via-[#061D28] to-[#04121A] border-[#C5A880] ring-1 ring-[#C5A880]/30 shadow-xl'
                : 'bg-white/5 border-white/10'
            }`}>
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 font-medium text-xs border border-emerald-500/25">
                    {language === 'ar' ? (is41 ? 'سعر الكاش (شامل الجراج)' : 'سعر الكاش الفوري') : (is41 ? 'Cash Price (Inc. Garage)' : 'Immediate Cash Price')}
                  </span>
                  <span className="text-xs font-medium text-[#DFCA9F]">
                    {language === 'ar' ? 'سداد فوري' : 'Immediate Payment'}
                  </span>
                </div>

                <div>
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1">
                    {language === 'ar' ? (is41 ? 'سعر الكاش الإجمالي شامل الجراج:' : 'سعر الكاش الإجمالي:') : (is41 ? 'TOTAL CASH PRICE (INC. GARAGE):' : 'TOTAL CASH PRICE:')}
                  </span>
                  <div className="text-2xl sm:text-3xl font-semibold text-white font-sans tabular-nums" dir="ltr">
                    {activeCashPrice.toLocaleString()} EGP
                  </div>
                  {is41 && (
                    <div className="text-[11px] text-amber-300 mt-1 font-medium">
                      {language === 'ar' ? '✅ الجراج مشمول بالكامل في سعر الكاش' : '✅ Garage is fully included in the cash price'}
                    </div>
                  )}
                </div>

                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{language === 'ar' ? 'استلام فوري وجاهزية تامة للتشغيل' : 'Immediate delivery & operational readiness'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{language === 'ar' ? 'تشطيب كامل بالتكييفات وحمام خاص' : 'Fully finished with AC and private toilet'}</span>
                  </li>
                  {is41 && (
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{language === 'ar' ? 'حصة جراج مشمولة في السعر' : 'Garage share included in total price'}</span>
                    </li>
                  )}
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

            {/* Option 2: 50% Down Payment / 24 Months */}
            <div className={`p-6 sm:p-7 rounded-2xl border transition-all flex flex-col justify-between ${
              selectedPaymentOption === 'installment'
                ? 'bg-gradient-to-br from-[#0B4D68]/50 via-[#061D28] to-[#04121A] border-[#C5A880] ring-1 ring-[#C5A880]/30 shadow-xl'
                : 'bg-white/5 border-white/10'
            }`}>
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 font-medium text-xs border border-cyan-500/25">
                    {language === 'ar' ? 'خطة 24 شهر' : '24 Months Plan'}
                  </span>
                  <span className="text-xs font-medium text-[#DFCA9F]">
                    {language === 'ar' ? 'مقدم 50%' : '50% Down'}
                  </span>
                </div>

                <div>
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1">
                    {language === 'ar' ? (is41 ? 'سعر التقسيط الإجمالي شامل الجراج:' : 'سعر التقسيط الإجمالي:') : (is41 ? 'TOTAL INSTALLMENT PRICE (INC. GARAGE):' : 'TOTAL INSTALLMENT PRICE:')}
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
                    <span>{language === 'ar' ? 'فترة السداد:' : 'Payment Period:'}</span>
                    <span className="font-semibold">{language === 'ar' ? '24 شهرًا (سنتان)' : '24 Months (2 Years)'}</span>
                  </div>
                </div>

                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{language === 'ar' ? 'استلام فوري وتشغيل مباشر' : 'Immediate delivery upon contract'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{language === 'ar' ? 'تسهيلات سداد ميسرة على سنتين' : 'Convenient 2-year installment facilities'}</span>
                  </li>
                  {is41 && (
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{language === 'ar' ? 'الجراج مشمول في السعر بالكامل' : 'Garage fully included in installment price'}</span>
                    </li>
                  )}
                </ul>
              </div>

              <button
                type="button"
                onClick={() => scrollToForm('installment')}
                className="w-full mt-6 py-3 rounded-xl bg-[#0B4D68] hover:bg-[#0E5D7D] text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <span>{language === 'ar' ? 'اختيار خطة التقسيط' : 'Select Installment Plan'}</span>
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
                {language === 'ar' ? 'تواصل مع مستشار المشروعات التجارية والطبية' : 'Connect with Commercial & Medical Advisors'}
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
                    ? 'تم توثيق طلبك وسيتواصل معك مستشار المشروعات بالتجمع الخامس خلال دقائق.'
                    : 'Our Fifth Settlement project specialist will contact you shortly.'}
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
                      {language === 'ar' ? `كاش (${(activeCashPrice / 1000000).toFixed(3)}M ج.م)` : `Cash (EGP ${(activeCashPrice / 1000000).toFixed(3)}M)`}
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
                      {language === 'ar' ? 'تقسيط (50% / 24 شهر)' : 'Installments (50% / 24M)'}
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
              <span className="text-xs font-medium text-[#DFCA9F]">{modalCaption}</span>
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
                src={modalImageSrc}
                alt="Enlarged view"
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default KernalMallProjectExperience;
