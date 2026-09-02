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
  Bed,
  Bath,
  Home,
  UtensilsCrossed,
  Car,
  Warehouse,
  Sun,
  Eye,
  Maximize
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

interface BeitAlWatanF165ProjectExperienceProps {
  project: Project;
  onRequestViewing?: (projectName?: string) => void;
}

export const BeitAlWatanF165ProjectExperience: React.FC<BeitAlWatanF165ProjectExperienceProps> = ({
  project: rawProject,
  onRequestViewing
}) => {
  const { language, isRTL, t } = useLanguage();
  const project = getLocalizedProject(rawProject, language);

  // Modal / Lightbox State
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

  // Verified Constants for Plot F165 196 m² Apartment
  const totalPrice = 5076000;
  const downPaymentPercent = 30;
  const downPaymentAmount = 1522800;
  const remainingInstallmentsAmount = 3553200;
  const paymentDurationMonths = 48;
  const unitArea = 196;
  const plotNumber = 'F165';
  const constructionImageUrl = '/images/projects/beit-al-watan-f165/beit-al-watan-f165-construction-progress.jpg';
  
  const locationText = language === 'ar' 
    ? 'قطعة F165 في موقع مميز بالحي الأول – بيت الوطن. تتمتع الوحدة بفيو مفتوح على شارع رئيسي، مع سهولة الوصول من طريق السويس وشارع التسعين الشمالي، القاهرة الجديدة.' 
    : language === 'de'
    ? 'Grundstück F165 im 1. Distrikt – Beit Al Watan, Neu-Kairo. Freier Blick auf eine Hauptstraße mit einfacher Anbindung an die Suez Road und North 90th Street.'
    : 'Plot F165 in a prime location in First District – Beit Al Watan, New Cairo. Open view overlooking a main street with direct and easy access from Suez Road and North 90th Street.';

  // Analytics on Mount
  useEffect(() => {
    trackEvent('beit_al_watan_project_view', {
      project_id: 'beit-al-watan-f165',
      plot: 'F165',
      location: 'First District Beit Al Watan',
      unit_type: 'Residential Apartment - 196 sqm',
      price: '5076000',
    });
  }, []);

  const handleWhatsAppClick = () => {
    trackClickWhatsApp('beit_al_watan_hero', project.name);
    trackEvent('beit_al_watan_whatsapp_click', {
      plot: 'F165',
      price: totalPrice,
    });
  };

  const scrollToPricing = () => {
    pricingRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToForm = () => {
    setNotes(
      language === 'ar'
        ? `استفسار بخصوص شقة سكنية أمامية 196 م² بالدور المتكرر في قطعة F165 بالحي الأول – بيت الوطن (السعر: 5,076,000 ج.م | مقدم 30%: 1,522,800 ج.م على 48 شهرًا)`
        : `Inquiry regarding 196 sqm Front-Facing Typical Floor Apartment in Plot F165, First District – Beit Al Watan (Total: EGP 5,076,000 | 30% Down Payment: EGP 1,522,800 over 48 Months)`
    );
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFormStart = () => {
    if (!hasStartedForm.current) {
      hasStartedForm.current = true;
      trackFormStart('beit_al_watan_lead_form', 'full_name');
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;

    setIsSubmitting(true);
    const planText = `30% Down Payment (EGP ${downPaymentAmount.toLocaleString()}) | 48 Months | Total EGP ${totalPrice.toLocaleString()}`;

    const leadData: LeadFormData = {
      fullName: fullName.trim() || (language === 'ar' ? 'مهتم بشقة بيت الوطن F165' : 'Beit Al Watan F165 Prospect'),
      phoneNumber: phoneNumber.trim(),
      interestedProject: 'First District – Beit Al Watan (Plot F165 - 196 m²)',
      propertyType: 'Apartment' as PropertyTypeOption,
      purpose: 'End User' as PurposeOption,
      preferredContactMethod: preferredContact === 'whatsapp' ? 'WhatsApp' : 'Phone',
      message: `${notes ? notes + ' | ' : ''}Plan: ${planText} | Plot: F165, First District`,
    };

    try {
      const result = await submitLead(leadData);
      trackFormSubmit({
        form_name: 'beit_al_watan_lead_form',
        interested_project: 'First District – Beit Al Watan (Plot F165)',
        property_type: 'Apartment',
        purpose: 'End User',
      });
      trackEvent('beit_al_watan_lead_submit', {
        plot: 'F165',
        price: totalPrice,
      });

      const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
      const waText = language === 'ar'
        ? `مرحبًا Capital Pioneers، أنا ${fullName || 'عميل مهتم'}، أود الاستفسار عن الشقة السكنية 196 م² بقطعة F165 بالحي الأول – بيت الوطن (السعر: 5,076,000 ج.م | مقدم 30%: 1,522,800 ج.م على 48 شهرًا). رقم الهاتف: ${cleanPhone}.`
        : `Hello Capital Pioneers, my name is ${fullName || 'an interested client'}. I would like more details regarding the 196 sqm Apartment in Plot F165, First District – Beit Al Watan (Total: EGP 5,076,000 | 30% DP: EGP 1,522,800 over 48 Months). Phone: ${cleanPhone}.`;
      
      const directWaUrl = `https://wa.me/201066330570?text=${encodeURIComponent(waText)}`;
      setWhatsappHandoffUrl(directWaUrl);
      setFormSubmitted(true);
    } catch (err) {
      console.error('Failed to submit Beit Al Watan F165 lead:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Structured Data (JSON-LD)
  const realEstateSchema = generateRealEstateListingSchema(project);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: language === 'ar' ? 'الرئيسية' : 'Home', item: '/' },
    { name: language === 'ar' ? 'المشروعات' : 'Projects', item: '/projects' },
    { name: 'First District – Beit Al Watan (Plot F165)', item: '/projects/beit-al-watan-f165-apartment-196sqm' },
  ]);

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'First District Beit Al Watan Plot F165 196 sqm Residential Apartment',
    description: '196 sqm front-facing typical floor residential apartment in Plot F165, First District – Beit Al Watan, New Cairo. 3 bedrooms (1 master), 3 bathrooms, reception, living, terrace, garage and storage share.',
    image: `https://capitalpioneers.com${constructionImageUrl}`,
    category: 'Residential Real Estate',
    offers: {
      '@type': 'Offer',
      name: '48-Month Installment Payment Plan',
      price: '5076000',
      priceCurrency: 'EGP',
      availability: 'https://schema.org/InStock',
      priceValidUntil: '2026-12-31',
      url: 'https://capitalpioneers.com/projects/beit-al-watan-f165-apartment-196sqm',
    },
  };

  return (
    <div className={`min-h-screen bg-[#061D28] text-slate-100 selection:bg-[#C5A880] selection:text-[#061D28] ${isRTL ? 'font-cairo' : 'font-sans'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <SEO
        title={project.seo?.seoTitle || (language === 'ar' ? 'شقة 196 م² للبيع في الحي الأول بيت الوطن قطعة F165 | القاهرة الجديدة' : 'First District Beit Al Watan Plot F165 196 sqm Apartment | New Cairo')}
        description={project.seo?.metaDescription || (language === 'ar' ? 'شقة سكنية أمامية 196 م² في قطعة F165 بالحي الأول – بيت الوطن، دور متكرر بفيو مفتوح على شارع رئيسي، 3 غرف (ماستر)، 3 حمامات، ريسبشن، ليفينج، حصة بالجراج والمخزن ومقدم 30%.' : '196 sqm front-facing apartment for sale in Plot F165, First District – Beit Al Watan, New Cairo. 3 bedrooms (1 master), 3 bathrooms, reception, living, terrace, garage share with 30% down payment over 48 months.')}
        canonicalPath="/projects/beit-al-watan-f165-apartment-196sqm"
        ogType="website"
        ogImage={`https://capitalpioneers.com${constructionImageUrl}`}
        schema={[breadcrumbSchema, realEstateSchema, productSchema]}
      />

      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-gradient-to-b from-[#04121A] via-[#061D28] to-[#082938]">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[#0B4D68]/20 blur-[140px] pointer-events-none rounded-full" />
        <div className="absolute top-10 right-10 w-96 h-96 bg-[#C5A880]/15 blur-[120px] pointer-events-none rounded-full" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-7">
              
              {/* Badges Strip */}
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#C5A880]/20 border border-[#C5A880]/40 text-[#DFCA9F] text-xs font-semibold tracking-wider uppercase">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'الحي الأول – بيت الوطن' : 'First District – Beit Al Watan'}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>{language === 'ar' ? 'قطعة F165' : 'Plot F165'}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                  <Sun className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'دور متكرر – أمامي' : 'Typical Floor – Front'}</span>
                </span>
              </div>

              {/* Title & Tagline */}
              <div className="space-y-3">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-white tracking-tight leading-[1.15]">
                  {project.name}
                </h1>
                <p className="text-lg sm:text-xl font-semibold text-[#DFCA9F] leading-relaxed">
                  {language === 'ar' 
                    ? 'شقة سكنية أمامية 196 م² بفيو مفتوح على شارع رئيسي' 
                    : language === 'de'
                    ? '196 m² Vorderseiten-Wohnung im Regelgeschoss mit freiem Straßenblick'
                    : '196 sqm Front-Facing Residential Apartment with Open Main Street View'}
                </p>
              </div>

              {/* Location Description */}
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-sm text-slate-300">
                <MapPin className="w-5 h-5 text-[#C5A880] shrink-0 mt-0.5" />
                <p className="leading-relaxed font-medium">
                  {locationText}
                </p>
              </div>

              {/* Fast Room Highlights Pill */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 font-semibold">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
                  <Bed className="w-4 h-4 text-[#DFCA9F]" />
                  <span>{language === 'ar' ? '3 غرف نوم (منها ماستر)' : '3 Bedrooms (1 Master)'}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
                  <Bath className="w-4 h-4 text-cyan-400" />
                  <span>{language === 'ar' ? '3 حمامات' : '3 Bathrooms'}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
                  <Home className="w-4 h-4 text-emerald-400" />
                  <span>{language === 'ar' ? 'ريسبشن + ليفينج' : 'Reception + Living'}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
                  <Car className="w-4 h-4 text-purple-400" />
                  <span>{language === 'ar' ? 'حصة جراج + مخزن' : 'Garage & Storage Share'}</span>
                </div>
              </div>

              {/* Price & Payment Banner */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0B4D68]/40 to-[#061D28] border border-[#C5A880]/60 ring-2 ring-[#C5A880]/20 shadow-xl space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <span className="text-xs text-[#DFCA9F] font-bold uppercase tracking-wider">
                    {language === 'ar' ? 'إجمالي سعر الوحدة' : 'Total Apartment Price'}
                  </span>
                  <span className="px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-300 text-xs font-semibold border border-cyan-500/30">
                    {language === 'ar' ? 'مقدم 30% • تسهيلات 48 شهرًا' : '30% Down • 48 Months'}
                  </span>
                </div>

                <div className="flex flex-wrap items-baseline gap-3">
                  <div className="text-3xl sm:text-4xl font-semibold text-white font-mono tabular-nums" dir="ltr">
                    5,076,000 EGP
                  </div>
                  <span className="text-xs text-slate-400">
                    ({language === 'ar' ? '5,076,000 جنيه مصري' : '5,076,000 Egyptian Pounds'})
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-slate-400 block text-[11px] mb-0.5">{language === 'ar' ? 'المقدم المطلوب (30%):' : 'Down Payment (30%):'}</span>
                    <strong className="text-[#DFCA9F] font-mono tabular-nums text-base font-bold" dir="ltr">EGP 1,522,800</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-slate-400 block text-[11px] mb-0.5">{language === 'ar' ? 'المتبقي للتسهيلات:' : 'Remaining Balance:'}</span>
                    <strong className="text-white font-mono tabular-nums text-base font-bold" dir="ltr">EGP 3,553,200</strong>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href={`https://wa.me/201066330570?text=${encodeURIComponent(
                    project.whatsappMessage || `Hello Capital Pioneers, I am interested in Plot F165, First District – Beit Al Watan (196 sqm Apartment).`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleWhatsAppClick}
                  className="px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm sm:text-base flex items-center gap-3 transition-all shadow-lg shadow-emerald-900/30 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
                  <span>{language === 'ar' ? 'تواصل فوري عبر واتساب' : 'Inquire via WhatsApp'}</span>
                </a>

                <button
                  type="button"
                  onClick={scrollToForm}
                  className="px-7 py-4 rounded-xl bg-gradient-to-r from-[#C5A880] to-[#DFCA9F] hover:from-[#DFCA9F] hover:to-[#C5A880] text-[#061D28] font-semibold text-sm sm:text-base flex items-center gap-2.5 transition-all shadow-lg shadow-[#C5A880]/20 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>{language === 'ar' ? 'حجز موعد للمعاينة' : 'Book Site Visit'}</span>
                  <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                </button>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="px-6 py-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm flex items-center gap-2 border border-white/15 transition-all"
                >
                  <Maximize2 className="w-4 h-4 text-[#C5A880]" />
                  <span>{language === 'ar' ? 'صورة تطورات الإنشاء' : 'Construction Photo'}</span>
                </button>
              </div>

            </div>

            {/* Right Construction Photo Column */}
            <div className="lg:col-span-5">
              <div className="relative group rounded-3xl overflow-hidden bg-white/5 border border-white/15 p-4 backdrop-blur-md shadow-2xl">
                
                {/* Header Tag */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-xs">
                  <div className="flex items-center gap-2 text-[#DFCA9F] font-bold">
                    <Building2 className="w-4 h-4" />
                    <span>{language === 'ar' ? 'صورة موقع المشروع الحقيقية' : 'Authentic Construction Progress'}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono tabular-nums text-[11px] font-bold">
                    Plot F165
                  </span>
                </div>

                {/* Clickable Image Container */}
                <div 
                  onClick={() => {
                    setIsModalOpen(true);
                    trackEvent('beit_al_watan_construction_view', { plot: 'F165' });
                  }}
                  className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900 cursor-pointer group"
                >
                  <img
                    src={constructionImageUrl}
                    alt={language === 'ar' ? 'تطورات الأعمال الإنشائية لمشروع الحي الأول - بيت الوطن قطعة F165' : 'First District – Beit Al Watan Plot F165 Construction Progress'}
                    title={language === 'ar' ? 'تطورات الأعمال الإنشائية لمشروع الحي الأول - بيت الوطن قطعة F165' : 'First District – Beit Al Watan Plot F165 Construction Progress'}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="eager"
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-[#061D28]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-sm backdrop-blur-[2px]">
                    <Maximize className="w-5 h-5 text-[#DFCA9F]" />
                    <span>{language === 'ar' ? 'انقر لتكبير صورة الإنشاءات' : 'Click to View Full Resolution'}</span>
                  </div>

                  {/* Classification Badge */}
                  <div className="absolute bottom-2 left-2 right-2 bg-[#061D28]/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/15 text-[11px] text-slate-200 flex items-center justify-between">
                    <span className="font-semibold text-[#DFCA9F]">
                      {language === 'ar' ? 'متابعة وتطورات الإنشاءات بالموقع' : 'On-Site Construction Progress'}
                    </span>
                    <span className="text-emerald-400 font-bold">
                      {language === 'ar' ? 'قطعة F165' : 'Plot F165'}
                    </span>
                  </div>
                </div>

                {/* Fast Specs Strip */}
                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-white/10 text-center text-xs">
                  <div className="p-2 rounded-xl bg-white/5">
                    <span className="text-slate-400 block text-[10px]">{language === 'ar' ? 'المساحة' : 'Area'}</span>
                    <strong className="text-white font-bold text-sm">196 m²</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5">
                    <span className="text-slate-400 block text-[10px]">{language === 'ar' ? 'الموقع' : 'Position'}</span>
                    <strong className="text-[#DFCA9F] font-bold text-sm">{language === 'ar' ? 'أمامي' : 'Front'}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5">
                    <span className="text-slate-400 block text-[10px]">{language === 'ar' ? 'الغرف' : 'Bedrooms'}</span>
                    <strong className="text-emerald-400 font-bold text-sm">3 (Master)</strong>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. STRATEGIC UNIT SPECIFICATIONS & LAYOUT BREAKDOWN */}
      <section className="py-20 bg-[#04121A] border-y border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-14">
            <span className="px-3.5 py-1.5 rounded-full bg-[#C5A880]/15 text-[#DFCA9F] text-xs font-semibold uppercase tracking-wider border border-[#C5A880]/30 inline-block">
              {language === 'ar' ? 'المواصفات والتوزيع المعماري للوحدة' : 'Apartment Architectural Layout'}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white">
              {language === 'ar' ? 'مساحة 196 م² بتقسيم ذكي ومزايا حصرية' : '196 m² Layout Engineered for Maximum Luxury'}
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              {language === 'ar'
                ? 'شقة سكنية متكاملة المواصفات في دور متكرر بواجهة أمامية مفتوحة تطل على شارع رئيسي.'
                : 'A comprehensive front-facing residential unit on a typical floor overlooking a primary wide street.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            
            {/* Spec 1: 196 sqm Front-Facing */}
            <div className="p-6 rounded-2xl bg-[#061D28] border border-slate-800/80 hover:border-[#C5A880]/40 transition-all group space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#C5A880]/15 text-[#DFCA9F] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Home className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">
                {language === 'ar' ? 'مساحة 196 م² أمامية' : '196 m² Front-Facing'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {language === 'ar' 
                  ? 'مساحة واسعة بالدور المتكرر بواجهة أمامية متميزة توفر أعلى درجات الراحة والإضاءة الطبيعية.' 
                  : 'Expansive typical floor layout with prime front-facing orientation and optimal natural illumination.'}
              </p>
            </div>

            {/* Spec 2: 3 Bedrooms + 1 Master */}
            <div className="p-6 rounded-2xl bg-[#061D28] border border-slate-800/80 hover:border-emerald-500/40 transition-all group space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Bed className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">
                {language === 'ar' ? '3 غرف نوم (منها ماستر)' : '3 Bedrooms (1 Master)'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {language === 'ar' 
                  ? 'تضم 3 غرف نوم متسعة، من بينها غرفة نوم ماستر مستقلة بحمام خاص لخصوصية تامة.' 
                  : 'Includes 3 generously sized bedrooms, featuring an executive master suite with private bathroom.'}
              </p>
            </div>

            {/* Spec 3: 3 Bathrooms */}
            <div className="p-6 rounded-2xl bg-[#061D28] border border-slate-800/80 hover:border-cyan-500/40 transition-all group space-y-3">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Bath className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">
                {language === 'ar' ? '3 حمامات مجهزة' : '3 Full Bathrooms'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {language === 'ar' 
                  ? 'توزيع مثالي يشمل حمام الماستر، حمام يخدم غرف النوم، وحمام خاص للضيوف.' 
                  : 'Optimally distributed across the master bathroom, family bathroom, and dedicated guest restroom.'}
              </p>
            </div>

            {/* Spec 4: Reception & Living */}
            <div className="p-6 rounded-2xl bg-[#061D28] border border-slate-800/80 hover:border-purple-500/40 transition-all group space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">
                {language === 'ar' ? 'ريسبشن + ليفينج مستقل' : 'Reception & Living Area'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {language === 'ar' 
                  ? 'منطقة استقبال واسعة للضيوف بالإضافة إلى غرفة معيشة عائلية مستقلة (ليفينج).' 
                  : 'Spacious formal guest reception alongside a distinct family living room area.'}
              </p>
            </div>

            {/* Spec 5: Kitchen & Terrace */}
            <div className="p-6 rounded-2xl bg-[#061D28] border border-slate-800/80 hover:border-amber-500/40 transition-all group space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <UtensilsCrossed className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">
                {language === 'ar' ? 'مطبخ وتراس بإطلالة' : 'Kitchen & Scenic Terrace'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {language === 'ar' 
                  ? 'مطبخ عملي متسع بالإضافة إلى تراس مفتوح بإطلالة مباشرة على الشارع الرئيسي.' 
                  : 'Practical and spacious kitchen complemented by an outdoor terrace overlooking the street.'}
              </p>
            </div>

            {/* Spec 6: Garage Share */}
            <div className="p-6 rounded-2xl bg-[#061D28] border border-slate-800/80 hover:border-blue-500/40 transition-all group space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Car className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">
                {language === 'ar' ? 'حصة في الجراج' : 'Included Garage Share'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {language === 'ar' 
                  ? 'تتضمن الوحدة حصة قانونية مخصصة في جراج المبنى لراحة وأمان ركن السيارات.' 
                  : 'The apartment includes a deeded parking share in the building’s secure parking garage.'}
              </p>
            </div>

            {/* Spec 7: Storage Share */}
            <div className="p-6 rounded-2xl bg-[#061D28] border border-slate-800/80 hover:border-pink-500/40 transition-all group space-y-3">
              <div className="w-12 h-12 rounded-xl bg-pink-500/15 text-pink-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Warehouse className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">
                {language === 'ar' ? 'حصة في المخزن' : 'Included Storage Share'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {language === 'ar' 
                  ? 'حصة مخصصة في مساحات التخزين والمخزن الخاص بالعمارة لتلبية احتياجات الأسرة.' 
                  : 'Dedicated storage space share inside the building for luggage and seasonal items.'}
              </p>
            </div>

            {/* Spec 8: Prime Location & Easy Access */}
            <div className="p-6 rounded-2xl bg-[#061D28] border border-slate-800/80 hover:border-emerald-500/40 transition-all group space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">
                {language === 'ar' ? 'طريق السويس والتسعين' : 'Suez Road & 90th Access'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {language === 'ar' 
                  ? 'موقع استراتيجي بالحي الأول يتيح وصولاً سريعاً ومباشراً من طريق السويس وشارع التسعين الشمالي.' 
                  : 'Strategic positioning in the First District enabling fast connectivity to Suez Road & North 90th.'}
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 3. VERIFIED PAYMENT PLAN BREAKDOWN */}
      <section ref={pricingRef} className="py-20 bg-[#061D28]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-14">
            <span className="px-3.5 py-1.5 rounded-full bg-[#C5A880]/15 text-[#DFCA9F] text-xs font-semibold uppercase tracking-wider border border-[#C5A880]/30 inline-block">
              {language === 'ar' ? 'نظام السداد والتقسيط المعتمد' : 'Verified Payment Plan'}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white">
              {language === 'ar' ? 'تسهيلات ميسرة بمقدم 30% على 48 شهرًا' : '30% Down Payment over 48 Months'}
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              {language === 'ar'
                ? 'تفاصيل شفافة ومباشرة لقيمة الشقة والمقدم المطلوب والمبلغ المتبقي دون أي افتراضات غير معلنة.'
                : 'Direct and transparent payment structure specifying down payment, remaining balance, and installment timeline.'}
            </p>
          </div>

          <div className="max-w-3xl mx-auto p-8 sm:p-10 rounded-3xl bg-[#04121A] border border-[#C5A880]/40 shadow-2xl space-y-8">
            
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
              <div>
                <span className="text-xs text-slate-400 block mb-1">
                  {language === 'ar' ? 'إجمالي سعر الشقة (196 م²):' : 'Total Apartment Price (196 m²):'}
                </span>
                <div className="text-3xl sm:text-4xl font-semibold text-white font-mono tabular-nums" dir="ltr">
                  5,076,000 EGP
                </div>
              </div>
              <div className="text-right">
                <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                  {language === 'ar' ? 'قطعة F165 • الحي الأول' : 'Plot F165 • First District'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-slate-400 block text-xs">
                  {language === 'ar' ? 'المقدم المطلوب (30%):' : 'Down Payment (30%):'}
                </span>
                <div className="text-xl sm:text-2xl font-semibold text-[#DFCA9F] font-mono tabular-nums" dir="ltr">
                  EGP 1,522,800
                </div>
                <span className="text-[11px] text-slate-500 block">
                  {language === 'ar' ? '30% عند التعاقد' : '30% at Contract'}
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-slate-400 block text-xs">
                  {language === 'ar' ? 'المبلغ المتبقي:' : 'Remaining Balance:'}
                </span>
                <div className="text-xl sm:text-2xl font-semibold text-white font-mono tabular-nums" dir="ltr">
                  EGP 3,553,200
                </div>
                <span className="text-[11px] text-slate-500 block">
                  {language === 'ar' ? 'يُسدد بتسهيلات' : 'Payable via Facilities'}
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-slate-400 block text-xs">
                  {language === 'ar' ? 'فترة السداد:' : 'Payment Duration:'}
                </span>
                <div className="text-xl sm:text-2xl font-semibold text-cyan-400 font-mono tabular-nums">
                  {language === 'ar' ? '48 شهرًا' : '48 Months'}
                </div>
                <span className="text-[11px] text-slate-500 block">
                  {language === 'ar' ? '4 سنوات تسهيلات' : '4 Years Duration'}
                </span>
              </div>

            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2 text-[#DFCA9F] font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>{language === 'ar' ? 'ملاحظة الشفافية والتعاقد:' : 'Transparency Note:'}</span>
              </div>
              <p className="leading-relaxed">
                {language === 'ar'
                  ? 'نظام السداد معتمد بمقدم 30% بقيمة 1,522,800 جنيه ومتبقي 3,553,200 جنيه على 48 شهرًا. لا يتم احتساب أي أقساط شهرية أو دفعات إضافية غير المذكورة في جدول التعاقد.'
                  : 'Payment terms strictly follow the approved schedule: 30% down payment (EGP 1,522,800) and remaining EGP 3,553,200 over 48 months with no assumptions of unspecified fees.'}
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={scrollToForm}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#C5A880] to-[#DFCA9F] hover:from-[#DFCA9F] hover:to-[#C5A880] text-[#061D28] font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <span>{language === 'ar' ? 'طلب تفاصيل جدول السداد وحجز الوحدة' : 'Request Payment Breakdown & Reserve Unit'}</span>
                <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* 4. LEAD CAPTURE & ADVISOR CONSULTATION */}
      <section ref={formRef} className="py-20 bg-[#04121A] border-t border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-2xl mx-auto p-8 sm:p-10 rounded-3xl bg-[#061D28] border border-slate-800 shadow-2xl relative">
            
            <div className="text-center space-y-2 mb-8">
              <span className="px-3.5 py-1.5 rounded-full bg-[#C5A880]/15 text-[#DFCA9F] text-xs font-semibold uppercase tracking-wider border border-[#C5A880]/30 inline-block">
                {language === 'ar' ? 'حجز ومعاينة الموقع' : 'Site Inspection & Reservation'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-semibold text-white">
                {language === 'ar' ? 'تواصل مع مستشار بيت الوطن المعتمد' : 'Connect with Beit Al Watan Specialists'}
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm">
                {language === 'ar'
                  ? 'سجل بياناتك وسيتم التواصل معك مباشرة لتنسيق زيارة قطعة F165 وتزويدك بكافة تفاصيل التعاقد.'
                  : 'Submit your contact details for direct consultation and on-site Plot F165 inspection coordination.'}
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
                    ? 'تم تسجيل طلبك لشقة قطعة F165 بالحي الأول بيت الوطن وسيتواصل معك مستشارنا خلال دقائق.'
                    : 'Our Beit Al Watan specialist will contact you shortly regarding Plot F165.'}
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
                    {language === 'ar' ? 'طريقة التواصل المفضلة:' : 'Preferred Contact Method:'}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPreferredContact('whatsapp')}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                        preferredContact === 'whatsapp'
                          ? 'bg-[#0B4D68] border-[#C5A880] text-white shadow-md'
                          : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-400" />
                      <span>WhatsApp</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreferredContact('phone')}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                        preferredContact === 'phone'
                          ? 'bg-[#0B4D68] border-[#C5A880] text-white shadow-md'
                          : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      <Calendar className="w-4 h-4 text-cyan-400" />
                      <span>{language === 'ar' ? 'اتصال هاتفي' : 'Phone Call'}</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    {language === 'ar' ? 'ملاحظات أو أسئلة إضافية:' : 'Additional Notes / Inquiry:'}
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={language === 'ar' ? 'أضف أي استفسار أو الموعد المفضل للمعاينة...' : 'Add any specific inspection timing or inquiries...'}
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
                        <span>{language === 'ar' ? 'تأكيد طلب المعاينة والاستفسار' : 'Confirm Inspection Request'}</span>
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

      {/* FULLSCREEN LIGHTBOX MODAL FOR CONSTRUCTION PROGRESS */}
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
                  {language === 'ar' ? 'تطورات الأعمال الإنشائية — قطعة F165 الحي الأول بيت الوطن' : 'Construction Progress — Plot F165 First District Beit Al Watan'}
                </h3>
                <p className="text-xs text-slate-400">
                  {language === 'ar' ? 'تصوير واقعي ومباشر من موقع المشروع' : 'Authentic site construction progress image'}
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
                src={constructionImageUrl}
                alt={language === 'ar' ? 'تطورات الأعمال الإنشائية لمشروع الحي الأول - بيت الوطن قطعة F165' : 'First District – Beit Al Watan Plot F165 Construction Progress'}
                title={language === 'ar' ? 'تطورات الأعمال الإنشائية لمشروع الحي الأول - بيت الوطن قطعة F165' : 'First District – Beit Al Watan Plot F165 Construction Progress'}
                className="max-w-full max-h-full object-contain rounded-xl"
              />
            </div>

            {/* Modal Footer */}
            <div className="pt-3 mt-2 border-t border-slate-700 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
              <span>{language === 'ar' ? 'قطعة F165 - شقة 196 م² دور متكرر أمامي (3 غرف نوم، 3 حمامات، ريسبشن، ليفينج، حصة جراج ومخزن)' : 'Plot F165 - 196 sqm Typical Floor Front Apartment'}</span>
              <a
                href={`https://wa.me/201066330570?text=${encodeURIComponent(
                  `Hello Capital Pioneers, I am viewing the construction photo for Plot F165 in Beit Al Watan First District and would like more information.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'استفسار عبر واتساب' : 'Inquire on WhatsApp'}</span>
              </a>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
