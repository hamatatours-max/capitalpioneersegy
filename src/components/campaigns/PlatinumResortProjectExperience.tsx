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
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Waves, 
  Hotel, 
  Store, 
  ExternalLink,
  Layers,
  Bed,
  Bath,
  Maximize,
  Filter,
  CheckCircle,
  FileText,
  ShieldCheck
} from 'lucide-react';
import { Project, AvailableUnit } from '@/types/project';
import { SEO } from '@/components/common/SEO';
import { submitLead } from '@/services/leadService';
import { LeadFormData, PropertyTypeOption, PurposeOption, PreferredContactOption } from '@/types/lead';
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

interface PlatinumResortProjectExperienceProps {
  project: Project;
  onRequestViewing?: (projectName?: string) => void;
}

export const PlatinumResortProjectExperience: React.FC<PlatinumResortProjectExperienceProps> = ({
  project: rawProject,
  onRequestViewing
}) => {
  const { language, isRTL, t } = useLanguage();
  const project = getLocalizedProject(rawProject, language);

  // Active Filter for Availability: 'all' | '1bed' | '2bed' | 'seaview' | 'poolview'
  const [activeFilter, setActiveFilter] = useState<'all' | '1bed' | '2bed' | 'seaview' | 'poolview'>('all');

  // Selected Unit from Table / Cards (default to Unit 11 - lowest entry price)
  const [selectedUnit, setSelectedUnit] = useState<AvailableUnit>(
    project.availableUnitsList?.find(u => u.unitCode === 'Unit 11') || 
    project.availableUnitsList?.[0] || 
    {
      id: 'platinum-avail-11',
      unitCode: 'Unit 11',
      propertyType: '1-Bedroom Resort Unit',
      category: 'One-Bedroom Units',
      areaSqm: 67,
      floor: 'Floor 5',
      bedrooms: 1,
      bathrooms: 1,
      view: 'Sea View',
      totalPriceEGP: 4790500,
      status: 'Available',
      delivery: 'End of 2026',
    }
  );

  // Modal / Lightbox State
  const [activeModalImage, setActiveModalImage] = useState<string | null>(null);

  // Video Player States
  const heroVideoRef = useRef<HTMLVideoElement | null>(null);
  const dedicatedVideoRef = useRef<HTMLVideoElement | null>(null);
  const [isHeroPlaying, setIsHeroPlaying] = useState<boolean>(true);
  const [isHeroMuted, setIsHeroMuted] = useState<boolean>(true);

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
  const tableRef = useRef<HTMLDivElement | null>(null);

  // Video URLs
  const originalVideoUrl = project.videoUrl || '/videos/projects/platinum-resort-hurghada/platinum-resort-hurghada-original.mp4';
  const posterUrl = project.videoPoster || '/images/projects/platinum-resort-hurghada/platinum-video-poster.jpg';
  const priceListImageUrl = '/images/projects/platinum-resort-hurghada/platinum-resort-availability-price-list.jpg';

  // Analytics on Mount
  useEffect(() => {
    trackEvent('platinum_project_view', {
      project_id: 'platinum-resort-hurghada',
      developer: project.developer,
      location: 'Magawish Extension - Hurghada',
      starting_price: '4790500',
    });
  }, [project.developer]);

  // Autoplay hero video silently
  useEffect(() => {
    if (heroVideoRef.current) {
      heroVideoRef.current.defaultMuted = true;
      heroVideoRef.current.muted = true;
      heroVideoRef.current.play().catch(() => {
        // Safe silent catch if browser blocks autoplay
      });
    }
  }, []);

  const toggleHeroPlay = () => {
    if (heroVideoRef.current) {
      if (heroVideoRef.current.paused) {
        heroVideoRef.current.play();
        setIsHeroPlaying(true);
        trackEvent('platinum_video_play', { location: 'hero' });
      } else {
        heroVideoRef.current.pause();
        setIsHeroPlaying(false);
      }
    }
  };

  const toggleHeroMute = () => {
    if (heroVideoRef.current) {
      const nextMuted = !heroVideoRef.current.muted;
      heroVideoRef.current.muted = nextMuted;
      setIsHeroMuted(nextMuted);
    }
  };

  const handleWhatsAppClick = () => {
    trackClickWhatsApp('platinum_hero', project.name);
    trackEvent('platinum_whatsapp_click', {
      unit: selectedUnit.unitCode || 'General',
      price: selectedUnit.totalPriceEGP,
    });
  };

  const scrollToTable = () => {
    tableRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToForm = (unit?: AvailableUnit) => {
    if (unit) {
      setSelectedUnit(unit);
      setNotes(
        language === 'ar'
          ? `استفسار بخصوص ${unit.unitCode} (${unit.areaSqm} م² - ${unit.floor} - إطلالة ${unit.view || 'البحر'} - بسعر ${unit.totalPriceEGP.toLocaleString()} ج.م)`
          : `Inquiry regarding ${unit.unitCode} (${unit.areaSqm} sqm - ${unit.floor} - ${unit.view || 'Sea View'} - EGP ${unit.totalPriceEGP.toLocaleString()})`
      );
    }
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFormStart = () => {
    if (!hasStartedForm.current) {
      hasStartedForm.current = true;
      trackFormStart('platinum_lead_form', 'full_name');
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;

    setIsSubmitting(true);
    const leadData: LeadFormData = {
       fullName: fullName.trim() || (language === 'ar' ? 'مهتم بمشروع بلاتنيوم' : 'Platinum Resort Prospect'),
       phoneNumber: phoneNumber.trim(),
       email: '',
       interestedProject: `${project.name} (Magawish Extension, Hurghada)`,
       propertyType: (selectedUnit.propertyType?.includes('Apartment') ? 'Apartment' : 'Chalet') as PropertyTypeOption,
       purpose: 'Investment' as PurposeOption,
       budget: `EGP ${selectedUnit.totalPriceEGP?.toLocaleString() || '4.79M - 7.36M'}`,
       preferredContactMethod: (preferredContact === 'phone' ? 'Phone' : 'WhatsApp') as PreferredContactOption,
       message: `[Platinum Resort Hurghada] Unit: ${selectedUnit.unitCode || 'N/A'} | Area: ${selectedUnit.areaSqm}m² | Floor: ${selectedUnit.floor || 'N/A'} | View: ${selectedUnit.view || 'N/A'} | Price: EGP ${selectedUnit.totalPriceEGP?.toLocaleString()} | Note: ${notes}`,
    };

    try {
      const response = await submitLead(leadData, 'project_detail');
      setFormSubmitted(true);
      trackFormSubmit({
        form_name: 'platinum_lead_form',
        lead_id: response.leadId,
        interested_project: project.name,
        property_type: leadData.propertyType,
        purpose: leadData.purpose,
        budget_range: leadData.budget,
        preferred_contact: leadData.preferredContactMethod,
      });

      if (response.whatsappDirectUrl) {
        setWhatsappHandoffUrl(response.whatsappDirectUrl);
      }
    } catch (err) {
      console.error('Submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter available units
  const allUnits = project.availableUnitsList || [];
  const filteredUnits = allUnits.filter(u => {
    if (activeFilter === '1bed') return u.bedrooms === 1;
    if (activeFilter === '2bed') return u.bedrooms === 2;
    if (activeFilter === 'seaview') return u.view?.toLowerCase().includes('sea') || u.floor === 'Floor 4' || u.floor === 'Floor 5';
    if (activeFilter === 'poolview') return u.view?.toLowerCase().includes('pool') || u.floor === 'Floor 3';
    return true;
  });

  const defaultWhatsAppUrl = `https://wa.me/201066330570?text=${encodeURIComponent(
    selectedUnit.whatsappMessage || 
    (language === 'ar'
      ? `مرحباً، مهتم بمنتجع بلاتنيوم الغردقة في امتداد مجاويش وخاصة ${selectedUnit.unitCode || 'الوحدات المتاحة'} بمساحة ${selectedUnit.areaSqm} م² بسعر ${selectedUnit.totalPriceEGP.toLocaleString()} ج.م. برجاء إرسال التفاصيل وتأكيد الحجز.`
      : `Hello, I'm interested in Platinum Resort Hurghada in Magawish Extension, specifically ${selectedUnit.unitCode || 'Available Units'} (${selectedUnit.areaSqm} sqm, EGP ${selectedUnit.totalPriceEGP.toLocaleString()}). Please send me full booking details.`)
  )}`;

  const structuredSchemas = [
    generateRealEstateListingSchema(project),
    generateBreadcrumbSchema([
      { name: t('nav.home', 'Home'), item: '/' },
      { name: t('nav.projects', 'Projects'), item: '/projects' },
      { name: 'Red Sea', item: '/projects?location=Red%20Sea' },
      { name: project.name, item: `/projects/${project.slug}` },
    ]),
  ];

  return (
    <div className="min-h-screen bg-[#FAFBFD] text-[#0F2432]">
      {/* SEO Head Data */}
      <SEO
        title={project.seo.seoTitle}
        description={project.seo.metaDescription}
        canonicalPath={`/projects/${project.slug}`}
        ogImage={posterUrl}
        ogType="place"
        schema={structuredSchemas}
      />

      {/* 1. Breadcrumbs Navigation */}
      <nav
        aria-label="Breadcrumb"
        className="bg-[#061D28] text-slate-400 py-3.5 px-4 sm:px-6 lg:px-8 border-b border-white/10 text-xs font-light"
      >
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto whitespace-nowrap">
          <a href="/" className="hover:text-white transition-colors">
            {t('nav.home', 'Home')}
          </a>
          <ChevronRight className={`w-3.5 h-3.5 text-slate-500 ${isRTL ? 'rotate-180' : ''}`} />
          <a href="/projects" className="hover:text-white transition-colors">
            {t('nav.projects', 'Projects')}
          </a>
          <ChevronRight className={`w-3.5 h-3.5 text-slate-500 ${isRTL ? 'rotate-180' : ''}`} />
          <a href="/projects?location=Red%20Sea" className="hover:text-white transition-colors">
            {language === 'ar' ? 'البحر الأحمر' : language === 'de' ? 'Rotes Meer' : 'Red Sea'}
          </a>
          <ChevronRight className={`w-3.5 h-3.5 text-slate-500 ${isRTL ? 'rotate-180' : ''}`} />
          <span className="text-[#C5A880] font-medium truncate max-w-xs sm:max-w-md">
            {project.name}
          </span>
        </div>
      </nav>

      {/* 2. Hero Cinematic Video Showcase Header */}
      <header className="relative bg-[#061D28] text-white py-16 lg:py-24 border-b border-[#153648] overflow-hidden min-h-[580px] sm:min-h-[640px] flex items-center">
        {/* Background Autoplaying Video */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video
            ref={heroVideoRef}
            autoPlay
            muted={isHeroMuted}
            loop
            playsInline
            preload="metadata"
            poster={posterUrl}
            className="w-full h-full object-cover opacity-35"
          >
            <source src={originalVideoUrl} type="video/mp4" />
            <img
              src={posterUrl}
              alt="Platinum Resort Hurghada"
              className="w-full h-full object-cover opacity-35"
            />
          </video>
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#061D28] via-[#061D28]/75 to-[#061D28]/60" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#061D28] via-[#061D28]/80 to-transparent rtl:bg-gradient-to-l" />
        </div>

        {/* Hero Controls: Mute & Pause */}
        <div className="absolute top-6 right-6 rtl:right-auto rtl:left-6 z-20 flex items-center gap-2">
          <button
            onClick={toggleHeroPlay}
            aria-label={isHeroPlaying ? 'Pause video' : 'Play video'}
            className="p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md border border-white/20 transition-all text-xs flex items-center gap-1.5"
          >
            {isHeroPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={toggleHeroMute}
            aria-label={isHeroMuted ? 'Unmute video' : 'Mute video'}
            className="p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md border border-white/20 transition-all text-xs flex items-center gap-1.5"
          >
            {isHeroMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content Area (8 Cols) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-[#C5A880] text-[#061D28] text-xs font-semibold tracking-wider uppercase px-3.5 py-1.5 rounded-lg shadow-md flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'منتجع سياحي فاخر بالغردقة' : 'LUXURY TOURISTIC RESORT'}</span>
                </span>
                <span className="bg-cyan-950/80 text-cyan-300 text-xs font-semibold px-3 py-1 rounded-md border border-cyan-500/30 flex items-center gap-1">
                  <Waves className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'امتداد مجاويش • الغردقة' : 'Magawish Extension, Hurghada'}</span>
                </span>
                <span className="bg-emerald-900/70 text-emerald-300 text-xs font-bold px-3 py-1 rounded-md border border-emerald-500/30 flex items-center gap-1">
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'التسليم نهاية 2026' : 'Delivery End of 2026'}</span>
                </span>
              </div>

              {/* Title & Location Header */}
              <div className="space-y-2.5">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                  {project.name}
                </h1>
                <div className="text-sm sm:text-base text-[#C5A880] font-semibold flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#C5A880] flex-shrink-0" />
                  <span>
                    {language === 'ar'
                      ? 'أمام فندق ميركيور وبجوار فندق الباتروس • امتداد مجاويش'
                      : 'Opposite Mercure Hotel & Adjacent to Albatros Hotel • Magawish Extension'}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-slate-200 text-sm sm:text-base font-light leading-relaxed max-w-2xl">
                {project.shortDescription}
              </p>

              {/* Verified Pricing & Availability Hero Strip */}
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex flex-wrap items-center justify-between gap-4 text-xs text-white">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <span className="text-[#C5A880] font-semibold text-base sm:text-lg" dir="ltr">
                    {language === 'ar' ? 'تبدأ من 4,790,500 ج.م' : 'From EGP 4,790,500'}
                  </span>
                  <span className="text-slate-400 hidden sm:inline">•</span>
                  <span className="font-semibold text-cyan-200">
                    {language === 'ar' ? '12 وحدة موثقة متاحة (استوديو، غرفة، غرفتين)' : '12 Verified Available Units (Studios, 1BR, 2BR)'}
                  </span>
                  <span className="text-slate-400 hidden sm:inline">•</span>
                  <span className="text-emerald-300 font-bold">
                    {language === 'ar' ? 'تشطيب سوبر لوكس' : 'Super Lux Finishing'}
                  </span>
                </div>
                <span className="px-3 py-1 rounded bg-[#C5A880] text-[#061D28] text-[11px] font-semibold uppercase tracking-wider">
                  {language === 'ar' ? 'جاهز للحجز' : 'Active Availability'}
                </span>
              </div>

              {/* Key Features Pill Strip */}
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm text-white text-xs border border-white/15">
                  <Waves className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{language === 'ar' ? 'حمامين سباحة (45×10م)' : '2 Large Pools (45x10m)'}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm text-white text-xs border border-white/15">
                  <Hotel className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>{language === 'ar' ? 'شاطئ فندق 5 نجوم بالعقد (~3 دقائق)' : '5-Star Beach Access (~3 mins)'}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm text-white text-xs border border-white/15">
                  <Store className="w-3.5 h-3.5 text-amber-300" />
                  <span>{language === 'ar' ? 'ستريب مول ومطاعم وبازارات' : 'Strip Mall & Cafés'}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm text-white text-xs border border-white/15">
                  <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{language === 'ar' ? 'مسافة 32 متراً بين العمارات' : '32m Building Spacing'}</span>
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-3">
                <button
                  onClick={() => scrollToForm()}
                  type="button"
                  className="btn-gold py-3 px-6 text-xs font-bold flex items-center gap-2 shadow-lg hover:shadow-gold"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{language === 'ar' ? 'طلب تفاصيل الحجز والأسعار' : 'Request Booking & Price Details'}</span>
                </button>

                <a
                  href={defaultWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleWhatsAppClick}
                  className="btn-whatsapp py-3 px-6 text-xs font-bold flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>{language === 'ar' ? 'تحدث مع مستشار عقاري واتساب' : 'Speak With an Advisor on WhatsApp'}</span>
                </a>

                <button
                  onClick={scrollToTable}
                  type="button"
                  className="btn-outline-white py-3 px-5 text-xs font-semibold flex items-center gap-2"
                >
                  <Layers className="w-4 h-4" />
                  <span>{language === 'ar' ? 'جدول الـ 12 وحدة المتاحة' : 'View 12 Available Units Table'}</span>
                </button>
              </div>
            </div>

            {/* Right Summary Card (4 Cols) */}
            <div className="lg:col-span-4">
              <div className="p-6 rounded-3xl bg-white/10 backdrop-blur-lg border border-white/20 text-white space-y-4 shadow-soft-lg">
                <div className="flex items-center justify-between border-b border-white/15 pb-3">
                  <span className="text-xs font-bold text-[#C5A880] uppercase tracking-wider">
                    {language === 'ar' ? 'بطاقة المشروع السريعة' : 'Quick Project Overview'}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/30 text-emerald-300 text-[10px] font-bold">
                    {language === 'ar' ? 'موثق ومعتمد' : 'Verified'}
                  </span>
                </div>

                <div className="space-y-2.5 text-xs text-slate-200">
                  <div className="flex justify-between items-center py-1 border-b border-white/5">
                    <span className="text-slate-400">{language === 'ar' ? 'الموقع:' : 'Location:'}</span>
                    <strong className="text-white text-right rtl:text-left">{language === 'ar' ? 'امتداد مجاويش، الغردقة' : 'Magawish Extension'}</strong>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-white/5">
                    <span className="text-slate-400">{language === 'ar' ? 'المعالم المجاورة:' : 'Facing Landmark:'}</span>
                    <strong className="text-[#C5A880] text-right rtl:text-left">{language === 'ar' ? 'أمام فندق ميركيور وبجوار الباتروس' : 'Opposite Mercure Hotel'}</strong>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-white/5">
                    <span className="text-slate-400">{language === 'ar' ? 'مساحة المشروع:' : 'Land Area:'}</span>
                    <strong className="text-white font-mono tabular-nums">11,250 m²</strong>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-white/5">
                    <span className="text-slate-400">{language === 'ar' ? 'المساحة الترفيهية:' : 'Front Lifestyle Area:'}</span>
                    <strong className="text-cyan-300 font-mono tabular-nums">~19,000 m²</strong>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-white/5">
                    <span className="text-slate-400">{language === 'ar' ? 'الارتفاع والأدوار:' : 'Floors & Count:'}</span>
                    <strong className="text-white">{language === 'ar' ? '5 أدوار (~350 وحدة)' : '5 Floors (~350 Units)'}</strong>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-white/5">
                    <span className="text-slate-400">{language === 'ar' ? 'مستوى الإطلالات:' : 'View Levels:'}</span>
                    <strong className="text-[#C5A880] text-right rtl:text-left">
                      {language === 'ar' ? '1–3 مسبح • 4–5 بحر' : '1–3 Pool • 4–5 Sea'}
                    </strong>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-white/5">
                    <span className="text-slate-400">{language === 'ar' ? 'التشطيب:' : 'Finishing:'}</span>
                    <strong className="text-emerald-300 font-bold">{language === 'ar' ? 'سوبر لوكس' : 'Super Lux'}</strong>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-white/5">
                    <span className="text-slate-400">{language === 'ar' ? 'موعد الاستلام:' : 'Delivery:'}</span>
                    <strong className="text-emerald-400 font-bold">{language === 'ar' ? 'نهاية 2026' : 'End of 2026'}</strong>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-400">{language === 'ar' ? 'أقل سعر متاح حالياً:' : 'Lowest Listed Entry:'}</span>
                    <strong className="text-amber-300 font-semibold text-sm" dir="ltr">EGP 4,790,500</strong>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => scrollToForm(selectedUnit)}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#C5A880] to-[#DFCA9F] text-[#061D28] font-bold text-xs shadow-md hover:brightness-105 transition-all text-center"
                  >
                    {language === 'ar' ? 'تأكيد حجز وحدة في بلاتنيوم' : 'Inquire About Unit Booking'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 3. Main Project Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20 space-y-16">
        {/* Section: Project in Numbers (Engineering & Masterplan Metrics) */}
        <section className="space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/70 shadow-soft-sm">
          <div className="space-y-2 border-b border-slate-100 pb-4">
            <div className="eyebrow-tag bg-[#F1F7FA] text-[#0B4D68]">
              <Building2 className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'المخطط الهندسي والأرقام' : 'ENGINEERING MASTERPLAN'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F2432] tracking-tight">
              {language === 'ar' ? 'منتجع بلاتنيوم في أرقام — Key Metrics & Masterplan' : 'Platinum Resort Hurghada in Numbers'}
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm font-light leading-relaxed">
              {language === 'ar'
                ? 'مخطط متكامل يمتد على 11,250 م² ونسبة بنائية 60% مع مساحات ترفيهية أمامية رحبة تبلغ 19,000 م² ومسافات رحبة بين العمارات لضمان أعلى درجات الخصوصية والرؤية المفتوحة.'
                : 'A low-density 11,250 m² masterplan with 60% building footprint, ~19,000 m² of front recreational landscaping, and generous 32-meter spacing between buildings.'}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#FAFBFD] border border-slate-200/70 space-y-1 text-center">
              <span className="text-[11px] text-slate-400 block">{language === 'ar' ? 'مساحة أرض المشروع' : 'Project Area'}</span>
              <strong className="text-base sm:text-lg text-[#0F2432] block font-semibold">11,250 m²</strong>
              <span className="text-[10px] text-slate-500 block">{language === 'ar' ? 'مساحة المخطط المعتمد' : 'Masterplan Area'}</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAFBFD] border border-slate-200/70 space-y-1 text-center">
              <span className="text-[11px] text-slate-400 block">{language === 'ar' ? 'النسبة البنائية' : 'Building Coverage'}</span>
              <strong className="text-base sm:text-lg text-[#0B4D68] block font-semibold">60% {language === 'ar' ? 'كحد أقصى' : 'Max'}</strong>
              <span className="text-[10px] text-slate-500 block">{language === 'ar' ? 'من إجمالي الأرض' : 'Of Total Land'}</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAFBFD] border border-slate-200/70 space-y-1 text-center">
              <span className="text-[11px] text-slate-400 block">{language === 'ar' ? 'المساحة الترفيهية الأمامية' : 'Front Lifestyle Area'}</span>
              <strong className="text-base sm:text-lg text-cyan-700 block font-semibold">~19,000 m²</strong>
              <span className="text-[10px] text-slate-500 block">{language === 'ar' ? 'لاندسكيب وترفيه' : 'Landscape & Leisure'}</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAFBFD] border border-slate-200/70 space-y-1 text-center">
              <span className="text-[11px] text-slate-400 block">{language === 'ar' ? 'أبعاد المشروع' : 'Dimensions'}</span>
              <strong className="text-base sm:text-lg text-[#0F2432] block font-semibold">112.5m × 100m</strong>
              <span className="text-[10px] text-slate-500 block">{language === 'ar' ? 'واجهة × عمق' : 'Frontage × Depth'}</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAFBFD] border border-slate-200/70 space-y-1 text-center">
              <span className="text-[11px] text-slate-400 block">{language === 'ar' ? 'نسبة التحميل' : 'Loading Percentage'}</span>
              <strong className="text-base sm:text-lg text-emerald-700 block font-semibold">{language === 'ar' ? '18% كحد أقصى' : '18% Max'}</strong>
              <span className="text-[10px] text-slate-500 block">{language === 'ar' ? 'أفضل كفاءة مساحة' : 'Optimal Net Efficiency'}</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAFBFD] border border-slate-200/70 space-y-1 text-center">
              <span className="text-[11px] text-slate-400 block">{language === 'ar' ? 'عدد الأدوار والوحدات' : 'Floors & Units'}</span>
              <strong className="text-base sm:text-lg text-[#0F2432] block font-semibold">{language === 'ar' ? '5 أدوار (~350 وحدة)' : '5 Floors (~350 Units)'}</strong>
              <span className="text-[10px] text-slate-500 block">{language === 'ar' ? 'استوديوهات، غرفة، غرفتين' : 'Studios, 1BR & 2BR'}</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAFBFD] border border-slate-200/70 space-y-1 text-center">
              <span className="text-[11px] text-slate-400 block">{language === 'ar' ? 'المسافة بين العمارات' : 'Spacing Between Bldgs'}</span>
              <strong className="text-base sm:text-lg text-[#C5A880] block font-semibold">~32 Meters</strong>
              <span className="text-[10px] text-slate-500 block">{language === 'ar' ? 'خصوصية ورؤية مفتوحة' : 'Privacy & Natural Light'}</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAFBFD] border border-slate-200/70 space-y-1 text-center">
              <span className="text-[11px] text-slate-400 block">{language === 'ar' ? 'حمامات السباحة' : 'Swimming Pools'}</span>
              <strong className="text-base sm:text-lg text-cyan-600 block font-semibold">2 Pools (45×10m)</strong>
              <span className="text-[10px] text-slate-500 block">{language === 'ar' ? 'حجم أولمبي متسع' : 'Resort Scale Pools'}</span>
            </div>
          </div>
        </section>

        {/* Section: Signature Highlights & 5-Star Beach Access */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: 5-Star Hotel Beach Access */}
          <div className="p-7 rounded-3xl bg-gradient-to-br from-[#061D28] to-[#0A2738] text-white border border-[#153648] shadow-soft-md space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#C5A880]/20 text-[#C5A880] flex items-center justify-center border border-[#C5A880]/30">
              <Hotel className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              {language === 'ar' ? 'حق استخدام شاطئ فندق 5 نجوم (مثبت بالعقد)' : 'Contractual 5-Star Hotel Beach Access'}
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm font-light leading-relaxed">
              {language === 'ar'
                ? 'يتمتع ملاك وحدات منتجع بلاتنيوم بحق استخدام موثق ومثبت في العقد لشاطئ فندق 5 نجوم فاخر يبعد حوالي 3 دقائق فقط بالسيارة عن المنتجع.'
                : 'Documented in sales contracts, residents enjoy full usage rights to a private 5-star hotel beach located just approximately 3 minutes by car from the resort.'}
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-[#C5A880] font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>{language === 'ar' ? 'حق تعاقدي رسمي • 3 دقائق فقط' : 'Documented Right • 3 Min Drive'}</span>
            </div>
          </div>

          {/* Card 2: 2 Large Swimming Pools */}
          <div className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-soft-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-700 flex items-center justify-center border border-cyan-200">
              <Waves className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#0F2432] tracking-tight">
              {language === 'ar' ? 'حمامين سباحة كبيرين (45 م × 10 م)' : '2 Large Swimming Pools (45m × 10m)'}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm font-light leading-relaxed">
              {language === 'ar'
                ? 'يوفر المنتجع مسبحين ضخمين بأبعاد 45 متراً طولاً و10 أمتار عرضاً لكل مسبح، محاطين بجلسات تشميس ولاندسكيب استوائي ساحر.'
                : 'Two expansive swimming pools measuring 45 meters in length and 10 meters in width each, complete with sun lounges and tropical landscaping.'}
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-cyan-800 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>{language === 'ar' ? 'إطلالات مباشرة من الأدوار 1–3' : 'Direct View from Floors 1–3'}</span>
            </div>
          </div>

          {/* Card 3: Commercial Strip Mall */}
          <div className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-soft-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center border border-amber-200">
              <Store className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#0F2432] tracking-tight">
              {language === 'ar' ? 'ستريب مول تجاري متكامل' : 'Commercial Strip Mall & Dining'}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm font-light leading-relaxed">
              {language === 'ar'
                ? 'منطقة تجارية مصممة لتضم أرقى المطاعم والكافيهات والبازارات السياحية ومحلات التجزئة والعلامات التجارية لخدمة سكان ورواد المنتجع.'
                : 'An integrated lifestyle strip mall designed to accommodate restaurants, cafés, traditional and modern bazaars, and branded retail shops.'}
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-amber-900 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>{language === 'ar' ? 'مطاعم، كافيهات، وبازارات' : 'Restaurants, Cafés & Retail'}</span>
            </div>
          </div>

          {/* Card 4: Modern Architecture & 32m Spacing */}
          <div className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-soft-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#0B4D68]/10 text-[#0B4D68] flex items-center justify-center border border-[#0B4D68]/20">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#0F2432] tracking-tight">
              {language === 'ar' ? 'تصميمات عصرية ومسافة 32 متراً' : 'Contemporary Design & 32m Spacing'}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm font-light leading-relaxed">
              {language === 'ar'
                ? 'واجهات معمارية حديثة مع مسافات فاصلة متسعة تبلغ حوالي 32 متراً بين المباني، ومصعدين لكل عمارة لتوفير أقصى درجات الراحة والانسيابية.'
                : 'Contemporary resort architecture engineered with 32 meters spacing between buildings, plus 2 high-speed elevators per building.'}
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-[#0B4D68] font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>{language === 'ar' ? 'مصعدين في كل عمارة' : '2 Elevators Per Building'}</span>
            </div>
          </div>

          {/* Card 5: Resort Hotel Services & Management */}
          <div className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-soft-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-200">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#0F2432] tracking-tight">
              {language === 'ar' ? 'إدارة وتشغيل فندقي متخصص' : 'Professional Resort Management'}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm font-light leading-relaxed">
              {language === 'ar'
                ? 'إدارة المنتجع بواسطة شركة متخصصة وذات خبرة في إدارة الفنادق والقرى والمنتجعات السياحية، مع تقديم خدمات فندقية متكاملة.'
                : 'Operated and managed by an experienced specialized company in hospitality and resort operations, ensuring hotel-style services.'}
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-indigo-900 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>{language === 'ar' ? 'خدمات فندقية متكاملة' : 'Hotel-Style Services'}</span>
            </div>
          </div>

          {/* Card 6: Super Lux Finishing & Delivery */}
          <div className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-soft-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
              <KeyRound className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#0F2432] tracking-tight">
              {language === 'ar' ? 'تشطيب سوبر لوكس وتوصيف الأدوار' : 'Super Lux Finishing & Floor Views'}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm font-light leading-relaxed">
              {language === 'ar'
                ? 'تسليم كامل الوحدات بتشطيب سوبر لوكس عالي الجودة بنهاية 2026، مع توزيع إطلالات الأدوار (1–3 مسبح، 4–5 بحر).'
                : 'Delivered fully finished in Super Lux standards by end of 2026. Floors 1–3 feature pool views, while floors 4–5 feature panoramic sea views.'}
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-emerald-800 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>{language === 'ar' ? 'التسليم نهاية 2026' : 'Delivery End of 2026'}</span>
            </div>
          </div>
        </section>

        {/* Section: Floor Views Orientation & 3 Unit Collections */}
        <section className="space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/70 shadow-soft-sm">
          <div className="space-y-2 border-b border-slate-100 pb-4">
            <div className="eyebrow-tag bg-[#F1F7FA] text-[#0B4D68]">
              <Layers className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'توزيع الوحدات والإطلالات' : 'UNIT TYPES & VIEW ORIENTATION'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F2432] tracking-tight">
              {language === 'ar' ? 'مجموعات الوحدات وإطلالات الأدوار' : 'Unit Collections & Floor View Layout'}
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm font-light leading-relaxed">
              {language === 'ar'
                ? 'الأدوار 1–3: إطلالات على حمامات السباحة (Pool View) • الأدوار 4–5: إطلالات بحرية بانورامية (Sea View)'
                : 'Floors 1–3: Pool View Orientations • Floors 4–5: Panoramic Sea View Orientations'}
            </p>
          </div>

          {/* 3 Unit Collections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Collection 1: Studios */}
            <div className="p-6 rounded-2xl bg-[#FAFBFD] border border-slate-200/80 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-lg bg-cyan-100 text-cyan-900 text-xs font-bold">
                    {language === 'ar' ? 'استوديوهات' : 'Studios'}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">46 — 56 m²</span>
                </div>
                <h3 className="text-lg font-bold text-[#0F2432]">
                  {language === 'ar' ? 'استوديوهات فندقية عصرية' : 'Modern Resort Studios'}
                </h3>
                <p className="text-xs text-slate-600 font-light leading-relaxed">
                  {language === 'ar'
                    ? 'تصميمات ذكية تشمل مساحات: 46 م²، 48 م²، 49 م²، 56 م² بتشطيب سوبر لوكس وشرفات خاصة.'
                    : 'Smart space layouts available in 46 m², 48 m², 49 m², and 56 m² with Super Lux finishing.'}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {['46 m²', '48 m²', '49 m²', '56 m²'].map((size, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-white border border-slate-200 text-[11px] font-mono tabular-nums font-semibold text-slate-700">
                      {size}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => {
                  setActiveFilter('all');
                  scrollToTable();
                }}
                className="w-full py-2.5 rounded-xl bg-[#0B4D68] hover:bg-[#061D28] text-white text-xs font-semibold transition-all text-center"
              >
                {language === 'ar' ? 'استعراض الوحدات' : 'View Units'}
              </button>
            </div>

            {/* Collection 2: 1-Bedroom Units */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-50/50 to-white border-2 border-cyan-500/30 space-y-4 flex flex-col justify-between shadow-soft-sm">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-lg bg-cyan-600 text-white text-xs font-bold">
                    {language === 'ar' ? 'غرفة نوم واحدة' : '1-Bedroom Units'}
                  </span>
                  <span className="text-xs text-cyan-900 font-bold">67 — 89 m²</span>
                </div>
                <h3 className="text-lg font-bold text-[#0F2432]">
                  {language === 'ar' ? 'شقق فندقية غرفة نوم واحدة' : 'One-Bedroom Resort Units'}
                </h3>
                <p className="text-xs text-slate-600 font-light leading-relaxed">
                  {language === 'ar'
                    ? 'شقق فندقية راقية بمساحات: 67 م²، 78 م²، 85 م²، 89 م². تبدأ الأسعار الحالية المتاحة من 4,790,500 جنيه.'
                    : 'Luxury 1-bedroom units in 67 m², 78 m², 85 m², and 89 m². Current listed entry from EGP 4,790,500.'}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {['67 m²', '78 m²', '85 m²', '89 m²'].map((size, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-white border border-cyan-300 text-[11px] font-mono tabular-nums font-bold text-cyan-900">
                      {size}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => {
                  setActiveFilter('1bed');
                  scrollToTable();
                }}
                className="w-full py-2.5 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white text-xs font-bold transition-all text-center"
              >
                {language === 'ar' ? 'عرض وحدات الغرفة (من 4.79M)' : 'View 1-Bed Units (From 4.79M)'}
              </button>
            </div>

            {/* Collection 3: 2-Bedroom Units */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-50/50 to-white border-2 border-amber-500/30 space-y-4 flex flex-col justify-between shadow-soft-sm">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-lg bg-amber-600 text-white text-xs font-bold">
                    {language === 'ar' ? 'غرفتين نوم' : '2-Bedroom Units'}
                  </span>
                  <span className="text-xs text-amber-950 font-bold">100 — 120 m²</span>
                </div>
                <h3 className="text-lg font-bold text-[#0F2432]">
                  {language === 'ar' ? 'شقق فندقية غرفتين نوم' : 'Two-Bedroom Resort Units'}
                </h3>
                <p className="text-xs text-slate-600 font-light leading-relaxed">
                  {language === 'ar'
                    ? 'شقق واسعة بمساحات: 100 م²، 103 م²، 106 م²، 111 م²، 120 م² مع حمامين وإطلالات بحرية ومائية.'
                    : 'Expansive 2-bedroom units in 100 m², 103 m², 106 m², 111 m², and 120 m² with 1-2 baths and sea/pool views.'}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {['100 m²', '103 m²', '106 m²', '111 m²', '120 m²'].map((size, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-white border border-amber-300 text-[11px] font-mono tabular-nums font-bold text-amber-950">
                      {size}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => {
                  setActiveFilter('2bed');
                  scrollToTable();
                }}
                className="w-full py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold transition-all text-center"
              >
                {language === 'ar' ? 'عرض وحدات الغرفتين' : 'View 2-Bed Units'}
              </button>
            </div>
          </div>
        </section>

        {/* Section: Dedicated Cinematic Video Player */}
        <section className="space-y-6 bg-gradient-to-br from-[#061D28] to-[#0A2738] text-white p-8 sm:p-10 rounded-3xl border border-white/10 shadow-soft-lg">
          <div className="space-y-2 border-b border-white/10 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A880]/20 text-[#C5A880] text-xs font-bold border border-[#C5A880]/30">
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{language === 'ar' ? 'الفيديو الأصلي للمشروع' : 'OFFICIAL PROJECT VIDEO'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {language === 'ar' ? 'شاهد منتجع بلاتنيوم الغردقة — Platinum Resort Video' : 'Watch Platinum Resort Hurghada'}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm font-light">
              {language === 'ar'
                ? 'استكشف المخطط العام والموقع الاستراتيجي في امتداد مجاويش والتصميمات العصرية وإطلالات البحر ومسافات العمارات.'
                : 'Experience the prime coastal corridor in Magawish Extension, 32-meter building spacing, two 45x10m pools, and super lux resort lifestyle.'}
            </p>
          </div>

          <div className="relative rounded-2xl overflow-hidden bg-black border border-white/15 shadow-2xl aspect-[16/9] max-h-[560px]">
            <video
              ref={dedicatedVideoRef}
              controls
              playsInline
              preload="metadata"
              poster={posterUrl}
              className="w-full h-full object-contain"
            >
              <source src={originalVideoUrl} type="video/mp4" />
              Your browser does not support HTML5 video.
            </video>
          </div>
        </section>

        {/* Section: Official Price List Image & 12-Unit Availability Table */}
        <section ref={tableRef} id="inventory-section" className="space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/70 shadow-soft-sm">
          <div className="space-y-2 border-b border-slate-100 pb-4">
            <div className="eyebrow-tag bg-[#F1F7FA] text-[#0B4D68]">
              <Layers className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'قائمة الأسعار والوحدات المتاحة' : 'OFFICIAL AVAILABILITY & PRICE LIST'}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0F2432] tracking-tight">
                {language === 'ar' ? 'الوحدات المتاحة الموثقة في بلاتنيوم (12 وحدة)' : 'Verified Available Units (12 Units)'}
              </h2>
              <span className="px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>{language === 'ar' ? 'الأسعار تبدأ من 4,790,500 ج.م' : 'Listed From EGP 4,790,500'}</span>
              </span>
            </div>
            <p className="text-slate-500 text-xs sm:text-sm font-light leading-relaxed">
              {language === 'ar'
                ? 'بيان الوحدات الـ 12 المتاحة حالياً وفق جدول الأسعار المعتمد. اضغط على أي وحدة لعرض تفاصيلها أو حجزها مباشرة.'
                : 'Authoritative inventory list with all 12 verified available units from the official price schedule. Click any unit to view details or book.'}
            </p>
          </div>

          {/* Price List Table Image Viewer with Click-to-Zoom */}
          <div className="p-4 sm:p-6 rounded-2xl bg-[#061D28] text-white border border-[#153648] space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#C5A880]" />
                <span className="text-xs sm:text-sm font-bold text-white">
                  {language === 'ar' ? 'مستند جدول الأسعار والوحدات المتاح الرسمي' : 'Official Availability & Price Schedule Sheet'}
                </span>
              </div>
              <button
                onClick={() => setActiveModalImage(priceListImageUrl)}
                className="btn-gold py-1.5 px-4 text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'تكبير مستند الأسعار' : 'Enlarge Price Schedule'}</span>
              </button>
            </div>

            <div 
              onClick={() => setActiveModalImage(priceListImageUrl)}
              className="relative rounded-xl overflow-hidden bg-black/60 cursor-zoom-in border border-white/10 group flex items-center justify-center p-2"
            >
              <img
                src={priceListImageUrl}
                alt="Platinum Resort Availability and Price Table"
                className="max-h-72 w-auto object-contain group-hover:scale-[1.02] transition-transform duration-300 rounded-lg"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-bold">
                <Maximize2 className="w-5 h-5" />
                <span>{language === 'ar' ? 'اضغط لعرض المستند بالحجم الكامل' : 'Click to View Full Size'}</span>
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'تصفية:' : 'Filter:'}</span>
            </span>
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeFilter === 'all'
                  ? 'bg-[#0B4D68] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {language === 'ar' ? 'جميع الوحدات (12)' : 'All Units (12)'}
            </button>
            <button
              onClick={() => setActiveFilter('1bed')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeFilter === '1bed'
                  ? 'bg-cyan-700 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {language === 'ar' ? 'غرفة نوم واحدة (3)' : '1-Bedroom (3)'}
            </button>
            <button
              onClick={() => setActiveFilter('2bed')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeFilter === '2bed'
                  ? 'bg-amber-700 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {language === 'ar' ? 'غرفتين نوم (9)' : '2-Bedrooms (9)'}
            </button>
            <button
              onClick={() => setActiveFilter('seaview')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeFilter === 'seaview'
                  ? 'bg-blue-700 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {language === 'ar' ? 'إطلالة بحرية (11)' : 'Sea View (11)'}
            </button>
            <button
              onClick={() => setActiveFilter('poolview')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeFilter === 'poolview'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {language === 'ar' ? 'إطلالة مسبح (1)' : 'Pool View (1)'}
            </button>
          </div>

          {/* Interactive Availability Units Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-soft-sm">
            <table className="w-full text-xs text-left rtl:text-right border-collapse">
              <thead className="bg-[#061D28] text-white text-[11px] uppercase font-bold tracking-wider">
                <tr>
                  <th className="p-3.5">{language === 'ar' ? 'كود الوحدة' : 'Unit'}</th>
                  <th className="p-3.5">{language === 'ar' ? 'الدور' : 'Floor'}</th>
                  <th className="p-3.5">{language === 'ar' ? 'المساحة' : 'Space'}</th>
                  <th className="p-3.5">{language === 'ar' ? 'الغرف' : 'Bedrooms'}</th>
                  <th className="p-3.5">{language === 'ar' ? 'الحمامات' : 'Baths'}</th>
                  <th className="p-3.5">{language === 'ar' ? 'الإطلالة' : 'View'}</th>
                  <th className="p-3.5 text-right rtl:text-left">{language === 'ar' ? 'السعر الإجمالي' : 'Total Price'}</th>
                  <th className="p-3.5 text-center">{language === 'ar' ? 'الإجراء' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredUnits.map((unit) => {
                  const isSelected = selectedUnit.id === unit.id;
                  const unitWhatsAppUrl = `https://wa.me/201066330570?text=${encodeURIComponent(
                    unit.whatsappMessage ||
                    (language === 'ar'
                      ? `مرحباً، أود الاستفسار عن ${unit.unitCode} بمنتجع بلاتنيوم الغردقة (${unit.areaSqm} م²، ${unit.floor}، ${unit.view}، بسعر ${unit.totalPriceEGP.toLocaleString()} ج.م).`
                      : `Hello, I'm inquiring about ${unit.unitCode} at Platinum Resort Hurghada (${unit.areaSqm} sqm, ${unit.floor}, ${unit.view}, EGP ${unit.totalPriceEGP.toLocaleString()}).`)
                  )}`;

                  return (
                    <tr
                      key={unit.id}
                      onClick={() => setSelectedUnit(unit)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-amber-50/70 font-semibold ring-2 ring-inset ring-[#C5A880]'
                          : 'hover:bg-slate-50/80'
                      }`}
                    >
                      <td className="p-3.5 font-semibold text-[#0F2432]">
                        <span className={`px-2.5 py-1 rounded-lg ${
                          isSelected ? 'bg-[#061D28] text-[#C5A880]' : 'bg-slate-100 text-slate-800'
                        }`}>
                          {unit.unitCode}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-700 font-medium">{unit.floor}</td>
                      <td className="p-3.5 font-bold text-[#0B4D68] font-mono tabular-nums">{unit.areaSqm} m²</td>
                      <td className="p-3.5 text-slate-700">
                        <span className="flex items-center gap-1">
                          <Bed className="w-3.5 h-3.5 text-slate-400" />
                          <span>{unit.bedrooms} {unit.bedrooms === 1 ? (language === 'ar' ? 'غرفة' : 'Bed') : (language === 'ar' ? 'غرفتين' : 'Beds')}</span>
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-700">
                        <span className="flex items-center gap-1">
                          <Bath className="w-3.5 h-3.5 text-slate-400" />
                          <span>{unit.bathrooms || 1} {unit.bathrooms === 2 ? (language === 'ar' ? 'حمامين' : 'Baths') : (language === 'ar' ? 'حمام' : 'Bath')}</span>
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          unit.view?.toLowerCase().includes('sea') || unit.floor === 'Floor 4' || unit.floor === 'Floor 5'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {unit.view || (unit.floor === 'Floor 3' ? 'Pool View' : 'Sea View')}
                        </span>
                      </td>
                      <td className="p-3.5 text-right rtl:text-left font-semibold text-[#0F2432] text-sm" dir="ltr">
                        EGP {unit.totalPriceEGP.toLocaleString()}
                      </td>
                      <td className="p-3.5" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => scrollToForm(unit)}
                            className="px-3 py-1.5 rounded-lg bg-[#0B4D68] hover:bg-[#061D28] text-white text-[11px] font-bold transition-all"
                          >
                            {language === 'ar' ? 'حجز' : 'Book'}
                          </button>
                          <a
                            href={unitWhatsAppUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={handleWhatsAppClick}
                            className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-all"
                            title="WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5 fill-current" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section: Booking & Lead Inquiry Form */}
        <section ref={formRef} id="booking-form" className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#061D28] via-[#0B3042] to-[#061D28] text-white border border-white/15 shadow-soft-lg">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <span className="px-3.5 py-1 rounded-full bg-[#C5A880]/20 text-[#C5A880] text-xs font-bold border border-[#C5A880]/30 inline-block">
                {language === 'ar' ? 'حجز واستفسار رسمي' : 'OFFICIAL BOOKING INQUIRY'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                {language === 'ar' ? 'احجز وحدتك في منتجع بلاتنيوم الغردقة' : 'Book Your Unit at Platinum Resort'}
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm font-light">
                {language === 'ar'
                  ? `أنت تستفسر حالياً عن: ${selectedUnit.unitCode || 'وحدة متميزة'} (${selectedUnit.areaSqm} م² - ${selectedUnit.floor} - ${selectedUnit.view || 'إطلالة بحرية'}) بسعر ${selectedUnit.totalPriceEGP?.toLocaleString()} ج.م.`
                  : `Currently selected: ${selectedUnit.unitCode || 'Prime Unit'} (${selectedUnit.areaSqm} sqm - ${selectedUnit.floor} - ${selectedUnit.view || 'Sea View'}) priced at EGP ${selectedUnit.totalPriceEGP?.toLocaleString()}.`}
              </p>
            </div>

            {formSubmitted ? (
              <div className="p-6 rounded-2xl bg-emerald-500/20 border border-emerald-400 text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h3 className="text-xl font-bold text-white">
                  {language === 'ar' ? 'تم استلام طلبك بنجاح!' : 'Inquiry Received Successfully!'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 font-light">
                  {language === 'ar'
                    ? 'سيقوم المستشار العقاري المتخصص في مشروعات البحر الأحمر والغردقة بالتواصل معك خلال دقائق لتأكيد التوافر وتفاصيل الحجز.'
                    : 'Our Red Sea & Hurghada property advisor will reach out shortly with updated unit availability and booking procedure.'}
                </p>
                {whatsappHandoffUrl && (
                  <a
                    href={whatsappHandoffUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp py-3 px-6 text-xs font-bold inline-flex items-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>{language === 'ar' ? 'متابعة المحادثة عبر واتساب الآن' : 'Continue on WhatsApp Now'}</span>
                  </a>
                )}
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-semibold block">
                      {language === 'ar' ? 'الاسم بالكامل' : 'Full Name'}
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      onFocus={handleFormStart}
                      placeholder={language === 'ar' ? 'اكتب اسمك الكريم' : 'Your full name'}
                      className="w-full p-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-semibold block">
                      {language === 'ar' ? 'رقم الهاتف / واتساب *' : 'Phone / WhatsApp Number *'}
                    </label>
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      onFocus={handleFormStart}
                      placeholder={language === 'ar' ? '01xxxxxxxxx' : '+20 1xxxxxxxxx'}
                      className="w-full p-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:border-[#C5A880]"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold block">
                    {language === 'ar' ? 'ملاحظات أو استفسار محدد' : 'Notes / Specific Inquiry'}
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    onFocus={handleFormStart}
                    placeholder={language === 'ar' ? 'اكتب أي استفسار بخصوص الوحدة أو الأدوار أو الاستلام...' : 'Any specific inquiry regarding floors, views, or booking...'}
                    className="w-full p-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div className="flex items-center justify-between gap-4 pt-2">
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 text-xs">
                      <input
                        type="radio"
                        name="contactMethod"
                        value="whatsapp"
                        checked={preferredContact === 'whatsapp'}
                        onChange={() => setPreferredContact('whatsapp')}
                        className="text-[#C5A880] focus:ring-0"
                      />
                      <span>WhatsApp</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 text-xs">
                      <input
                        type="radio"
                        name="contactMethod"
                        value="phone"
                        checked={preferredContact === 'phone'}
                        onChange={() => setPreferredContact('phone')}
                        className="text-[#C5A880] focus:ring-0"
                      />
                      <span>{language === 'ar' ? 'مكالمة هاتفية' : 'Phone Call'}</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-gold py-3.5 px-8 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 shadow-lg disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>{language === 'ar' ? 'جاري الإرسال...' : 'Submitting...'}</span>
                    ) : (
                      <>
                        <span>{language === 'ar' ? 'إرسال طلب الحجز' : 'Submit Booking Request'}</span>
                        <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>

        {/* Section: Strategic Location Information */}
        <section className="space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/70 shadow-soft-sm">
          <div className="space-y-2 border-b border-slate-100 pb-4">
            <div className="eyebrow-tag bg-[#F1F7FA] text-[#0B4D68]">
              <Compass className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'الموقع والمعالم المحيطة' : 'STRATEGIC LOCATION & LANDMARKS'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F2432] tracking-tight">
              {language === 'ar' ? 'موقع منتجع بلاتنيوم بالغردقة' : 'Platinum Resort Location & Access'}
            </h2>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-5 rounded-2xl bg-[#FAFBFD] border border-slate-200/70 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 font-semibold text-sm text-[#0F2432]">
                  <MapPin className="w-4 h-4 text-[#0B4D68]" />
                  <span>{project.location}</span>
                </div>
                {project.googleMapsUrl && (
                  <a
                    href={project.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline py-2 px-3 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'الموقع على خرائط جوجل' : 'View on Google Maps'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
              {[
                language === 'ar' ? 'مباشرة أمام فندق ميركيور الغردقة' : 'Directly Opposite Mercure Hotel Hurghada',
                language === 'ar' ? 'بجوار / بالقرب من فندق الباتروس' : 'Adjacent to / Near Albatros Hotel',
                language === 'ar' ? 'شاطئ فندق 5 نجوم (حوالي 3 دقائق بالسيارة)' : '5-Star Hotel Beachfront (~3 min drive)',
                language === 'ar' ? 'محور امتداد مجاويش الساحلي الراقي' : 'Magawish Extension Prime Coastal Corridor',
                language === 'ar' ? 'مطار الغردقة الدولي (~10 دقائق)' : 'Hurghada International Airport (~10 mins)',
                language === 'ar' ? 'سينزو مول والممشى السياحي (~8 دقائق)' : 'Senzo Mall & Tourist Promenade (~8 mins)',
              ].map((landmark, idx) => (
                <div key={idx} className="flex items-center gap-2.5 p-3.5 rounded-xl bg-slate-50 border border-slate-100 font-medium text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-[#0B4D68] flex-shrink-0" />
                  <span>{landmark}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Lightbox Image Modal */}
      {activeModalImage && (
        <div
          onClick={() => setActiveModalImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 cursor-zoom-out"
        >
          <div className="relative max-w-5xl max-h-[90vh] w-full flex items-center justify-center">
            <img
              src={activeModalImage}
              alt="Enlarged Document"
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
            />
            <button
              onClick={() => setActiveModalImage(null)}
              className="absolute top-2 right-2 rtl:right-auto rtl:left-2 p-2.5 rounded-full bg-black/70 hover:bg-black text-white border border-white/20 transition-all"
            >
              <Maximize className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

