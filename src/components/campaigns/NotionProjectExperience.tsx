import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  MessageCircle, 
  Building2, 
  CheckCircle2, 
  Sparkles, 
  X, 
  ArrowRight, 
  Maximize2, 
  Clock, 
  Send,
  Home,
  Check,
  Compass,
  TreePine,
  Dumbbell,
  Users,
  Shield,
  Zap,
  Coffee,
  HeartHandshake
} from 'lucide-react';
import { Project, AvailableUnit } from '@/types/project';
import { useLanguage } from '@/context/LanguageContext';
import { getLocalizedProject } from '@/i18n/projectTranslations';
import { submitLead } from '@/services/leadService';
import { LeadFormData } from '@/types/lead';
import { trackEvent, trackClickWhatsApp } from '@/services/analyticsService';
import { SEO } from '@/components/common/SEO';
import { generateRealEstateListingSchema, generateBreadcrumbSchema } from '@/utils/schemaGenerator';

interface NotionProjectExperienceProps {
  project: Project;
  onRequestViewing?: (projectName?: string) => void;
}

export const NotionProjectExperience: React.FC<NotionProjectExperienceProps> = ({ 
  project: rawProject, 
  onRequestViewing 
}) => {
  const { language, isRTL } = useLanguage();
  const project = getLocalizedProject(rawProject, language);

  // Category Selector: 'Apartments' | 'Townhouses' | 'Villas'
  const [activeCategory, setActiveCategory] = useState<'Apartments' | 'Townhouses' | 'Villas'>('Apartments');

  // Selected Unit State
  const [selectedUnitId, setSelectedUnitId] = useState<string>('notion-apt-studio');

  // Media Modal State
  const [activeModalImage, setActiveModalImage] = useState<string | null>(null);

  // Form State
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [whatsappHandoffUrl, setWhatsappHandoffUrl] = useState<string | null>(null);

  const formRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    trackEvent('notion_project_view', {
      project_name: 'NOTION',
      location: 'Extension Golden Square — New Cairo',
      tagline: 'LIVE YOUR NOTION',
    });
  }, []);

  const allUnits = project.availableUnitsList || [];
  const apartments = allUnits.filter(u => u.category === 'Apartments');
  const townhouses = allUnits.filter(u => u.category === 'Townhouses');
  const villas = allUnits.filter(u => u.category === 'Villas');

  const visibleUnits = activeCategory === 'Apartments' 
    ? apartments 
    : activeCategory === 'Townhouses' 
    ? townhouses 
    : villas;

  const currentSelectedUnit = allUnits.find(u => u.id === selectedUnitId) || visibleUnits[0] || allUnits[0];

  const handleSelectCategory = (cat: 'Apartments' | 'Townhouses' | 'Villas') => {
    setActiveCategory(cat);
    const first = cat === 'Apartments' ? apartments[0] : cat === 'Townhouses' ? townhouses[0] : villas[0];
    if (first) setSelectedUnitId(first.id);

    if (cat === 'Apartments') trackEvent('notion_apartment_select', {});
    else if (cat === 'Townhouses') trackEvent('notion_townhouse_select', {});
    else trackEvent('notion_villa_select', {});
  };

  const handleSelectUnit = (unit: AvailableUnit) => {
    setSelectedUnitId(unit.id);
    if (unit.category && unit.category !== activeCategory) {
      setActiveCategory(unit.category as 'Apartments' | 'Townhouses' | 'Villas');
    }
    trackEvent('notion_unit_select', {
      unit_id: unit.id,
      unit_code: unit.unitCode,
      category: unit.category,
      price: unit.totalPriceEGP,
    });
  };

  const handleAskAboutUnit = (unit: AvailableUnit) => {
    handleSelectUnit(unit);
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    trackEvent('notion_request_details', {
      unit_id: unit.id,
      unit_code: unit.unitCode,
    });
  };

  const getWhatsAppUrlForUnit = (unit?: AvailableUnit) => {
    const u = unit || currentSelectedUnit;
    const phone = '201000000000';
    const text = language === 'ar'
      ? `مرحباً Capital Pioneers، أود الاستفسار عن مشروع NOTION بامتداد الجولدن سكوير بالتجمع الخامس - وحدة: ${u?.unitCode || ''} (${u?.propertyType || ''} مساحة ${u?.areaSqm || ''} م² - بسعر ${u?.totalPriceEGP ? (u.totalPriceEGP).toLocaleString() + ' ج.م' : ''}).`
      : language === 'de'
      ? `Hallo Capital Pioneers, ich interessiere mich für NOTION in Extension Golden Square, Neu-Kairo - Einheit: ${u?.unitCode || ''} (${u?.propertyType || ''} ${u?.areaSqm || ''} m² - ${u?.totalPriceEGP ? (u.totalPriceEGP).toLocaleString() + ' EGP' : ''}).`
      : `Hello Capital Pioneers, I am inquiring about NOTION in Extension Golden Square, New Cairo - Unit: ${u?.unitCode || ''} (${u?.propertyType || ''} ${u?.areaSqm || ''} m² - ${u?.totalPriceEGP ? 'EGP ' + (u.totalPriceEGP).toLocaleString() : ''}).`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phoneNumber.trim()) return;

    setIsSubmitting(true);
    try {
      const leadData: LeadFormData = {
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        propertyType: currentSelectedUnit?.category === 'Townhouses' ? 'Townhouse' : currentSelectedUnit?.category === 'Villas' ? 'Villa' : 'Apartment',
        purpose: 'End User',
        preferredContactMethod: 'WhatsApp',
        interestedProject: `NOTION - ${currentSelectedUnit?.category || ''}: ${currentSelectedUnit?.unitCode || currentSelectedUnit?.propertyType || ''} (${currentSelectedUnit?.areaSqm || ''} m²)`,
        message: `Selected Unit: ${currentSelectedUnit?.unitCode} | Price: EGP ${currentSelectedUnit?.totalPriceEGP?.toLocaleString()} | Notes: ${notes.trim()}`,
      };

      await submitLead(leadData);
      trackEvent('notion_lead_submit', {
        unit: currentSelectedUnit?.unitCode,
        category: currentSelectedUnit?.category,
        price: currentSelectedUnit?.totalPriceEGP,
      });

      setFormSubmitted(true);
      setWhatsappHandoffUrl(getWhatsAppUrlForUnit(currentSelectedUnit));
    } catch (err) {
      console.error('Lead submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const structuredSchemas = [
    generateRealEstateListingSchema(project),
    generateBreadcrumbSchema([
      { name: language === 'ar' ? 'الرئيسية' : 'Home', item: '/' },
      { name: language === 'ar' ? 'المشاريع' : 'Projects', item: '/projects' },
      { name: 'New Cairo', item: '/projects?location=Cairo' },
      { name: project.name, item: `/projects/${project.slug}` },
    ]),
  ];

  return (
    <>
      <SEO
        title={project.seo.seoTitle}
        description={project.seo.metaDescription}
        canonicalPath={`/projects/${project.slug}`}
        ogImage={project.seo.ogImage || project.mainImage}
        schema={structuredSchemas}
      />

      <div className="bg-[#040D14] text-slate-100 min-h-screen selection:bg-[#D4AF37]/30 selection:text-white font-sans">
        
        {/* TOP STATUS BAR */}
        <div className="bg-gradient-to-r from-[#1B3022] via-[#2C4A34] to-[#1B3022] text-white text-xs sm:text-sm font-medium py-2.5 px-4 text-center border-b border-emerald-500/20 sticky top-0 z-40 backdrop-blur-md">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 flex-wrap">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4AF37]"></span>
            </span>
            <span className="font-bold uppercase tracking-wider text-[#E8C868]">
              {language === 'ar' ? 'امتداد الجولدن سكوير • آخر الوحدات المتاحة' : 'EXTENSION GOLDEN SQUARE • LAST AVAILABILITY'}
            </span>
            <span className="hidden sm:inline text-white/40">•</span>
            <span className="text-slate-200 text-xs sm:text-sm">
              {language === 'ar' 
                ? 'شقق تبدأ من 2.805 مليون جنيه • خطط سداد تصل إلى 10 سنوات'
                : 'Apartments from EGP 2.805M • Payment Plans up to 10 Years'}
            </span>
          </div>
        </div>

        {/* 1. HERO SECTION */}
        <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden pt-12 pb-20 px-4 sm:px-6 lg:px-8">
          {/* Background Visual */}
          <div className="absolute inset-0 z-0">
            <img
              src="/images/projects/notion/hero.jpg"
              alt="NOTION Compound in Extension Golden Square New Cairo"
              className="w-full h-full object-cover object-center scale-105 animate-fade-in"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#040D14] via-[#040D14]/85 to-[#040D14]/65" />
            <div className="absolute inset-0 bg-radial-vignette opacity-80" />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto text-center">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#E8C868] text-xs sm:text-sm font-semibold uppercase tracking-widest mb-6 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>{language === 'ar' ? 'القاهرة الجديدة • آخر الوحدات المتاحة' : 'NEW CAIRO • LAST AVAILABILITY'}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-bold text-white tracking-tight leading-tight mb-3 text-shadow-lg">
              NOTION
            </h1>

            {/* Subheadline Tagline */}
            <p className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#E8C868] mb-4 font-light tracking-wide">
              {language === 'ar' ? 'LIVE YOUR NOTION' : 'LIVE YOUR NOTION'}
            </p>

            <div className="inline-flex items-center gap-2 text-slate-300 text-sm sm:text-base font-light mb-6">
              <MapPin className="w-4 h-4 text-[#D4AF37]" />
              <span>{language === 'ar' ? 'امتداد الجولدن سكوير — القاهرة الجديدة' : 'Extension Golden Square — New Cairo'}</span>
            </div>

            {/* Marketing Hook */}
            <p className="max-w-2xl mx-auto text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed mb-8 font-light">
              {language === 'ar'
                ? 'يقدم مشروع NOTION مجتمعاً سكنياً راقياً ومتكاملاً في امتداد الجولدن سكوير، متضمناً شققاً سكنية وتاون هاوس وفيلات مستقلة مع أنظمة سداد ميسرة حتى 10 سنوات.'
                : 'NOTION introduces a diverse residential offering in Extension Golden Square, New Cairo, with apartments, townhouses, and villas supported by flexible payment plans extending up to 10 years.'}
            </p>

            {/* Hook Metric Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto mb-10 text-left rtl:text-right">
              <div className="bg-[#0B1A24]/80 backdrop-blur-md p-4 rounded-xl border border-white/10">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-medium">
                  {language === 'ar' ? 'الموقع' : 'Location'}
                </span>
                <span className="text-sm sm:text-base font-semibold text-white mt-1 block">
                  Extension Golden Sq.
                </span>
              </div>
              <div className="bg-[#0B1A24]/80 backdrop-blur-md p-4 rounded-xl border border-white/10">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-medium">
                  {language === 'ar' ? 'شقق تبدأ من' : 'Apartments From'}
                </span>
                <span className="text-sm sm:text-base font-bold text-[#E8C868] mt-1 block">
                  EGP 2.805M
                </span>
              </div>
              <div className="bg-[#0B1A24]/80 backdrop-blur-md p-4 rounded-xl border border-white/10">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-medium">
                  {language === 'ar' ? 'فترة السداد' : 'Payment Period'}
                </span>
                <span className="text-sm sm:text-base font-semibold text-white mt-1 block">
                  {language === 'ar' ? 'حتى 10 سنوات' : 'Up to 10 Years'}
                </span>
              </div>
              <div className="bg-[#0B1A24]/80 backdrop-blur-md p-4 rounded-xl border border-white/10">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-medium">
                  {language === 'ar' ? 'تنوع الوحدات' : 'Inventory'}
                </span>
                <span className="text-sm sm:text-base font-semibold text-white mt-1 block">
                  9 Verified Options
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => {
                  const el = document.getElementById('inventory');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B89628] hover:from-[#E8C868] hover:to-[#D4AF37] text-slate-950 font-bold text-base shadow-xl shadow-[#D4AF37]/20 transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                <span>{language === 'ar' ? 'استكشف الوحدات المتاحة' : 'Explore Available Units'}</span>
                <ArrowRight className={`w-5 h-5 group-hover:translate-x-1 transition-transform ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
              </button>

              <button
                onClick={() => formRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-white font-semibold text-base border border-white/15 transition-all duration-300"
              >
                {language === 'ar' ? 'طلب التفاصيل والأسعار' : 'Request Details'}
              </button>

              <a
                href={getWhatsAppUrlForUnit()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackClickWhatsApp('notion_hero', 'NOTION')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-base shadow-lg shadow-[#25D366]/20 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>{language === 'ar' ? 'واتساب' : 'WhatsApp'}</span>
              </a>

              <button
                onClick={() => setActiveModalImage('/images/projects/notion/notion-poster.jpg')}
                className="w-full sm:w-auto px-5 py-4 rounded-xl bg-black/40 hover:bg-black/60 text-slate-300 border border-white/10 text-sm transition-all flex items-center justify-center gap-2"
              >
                <Maximize2 className="w-4 h-4" />
                <span>{language === 'ar' ? 'عرض البوستر' : 'View Poster'}</span>
              </button>
            </div>
          </div>
        </section>

        {/* 2. PRICE RANGE PROGRESSION SUMMARY */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 border-y border-white/10 bg-[#07141E]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <span className="text-xs font-bold text-[#E8C868] uppercase tracking-widest block mb-1">
                {language === 'ar' ? 'التدرج السعري للمنتجات السكنية' : 'RESIDENTIAL PRICE PROGRESSION'}
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                {language === 'ar' ? 'خيارات متنوعة تلبي كافة المتطلبات' : 'Diverse Options Matching Every Lifestyle'}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#0B1E2B] p-6 rounded-2xl border border-white/10 text-center">
                <span className="text-xs text-slate-400 uppercase tracking-wider block font-medium mb-1">
                  {language === 'ar' ? 'الشقق السكنية (51 - 169 م²)' : 'Apartments (51 - 169 m²)'}
                </span>
                <span className="text-2xl sm:text-3xl font-serif font-bold text-white block my-1">
                  EGP 2.805M
                </span>
                <span className="text-xs text-slate-400">
                  {language === 'ar' ? 'سعر بداية الاستوديو (51 م²)' : 'Studio Starting Price (51 m²)'}
                </span>
              </div>

              <div className="bg-[#0B1E2B] p-6 rounded-2xl border border-white/10 text-center">
                <span className="text-xs text-slate-400 uppercase tracking-wider block font-medium mb-1">
                  {language === 'ar' ? 'التاون هاوس (190 - 215 م²)' : 'Townhouses (190 - 215 m²)'}
                </span>
                <span className="text-2xl sm:text-3xl font-serif font-bold text-[#E8C868] block my-1">
                  EGP 13.02M
                </span>
                <span className="text-xs text-slate-400">
                  {language === 'ar' ? 'سعر بداية التاون هاوس (190 م²)' : 'Townhouse Starting Price (190 m²)'}
                </span>
              </div>

              <div className="bg-[#0B1E2B] p-6 rounded-2xl border border-white/10 text-center">
                <span className="text-xs text-slate-400 uppercase tracking-wider block font-medium mb-1">
                  {language === 'ar' ? 'الفيلات المستقلة (+ حديقة)' : 'Standalone Villas (+ Garden)'}
                </span>
                <span className="text-2xl sm:text-3xl font-serif font-bold text-white block my-1">
                  EGP 28.2M
                </span>
                <span className="text-xs text-slate-400">
                  {language === 'ar' ? 'سعر بداية فيلا SAV (213 م² + 195 م² حديقة)' : 'SAV Villa Starting Price (213 m² + 195 m² Garden)'}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. RESIDENTIAL PRODUCT SELECTOR (9 DISTINCT RESIDENTIAL OPTIONS) */}
        <section id="inventory" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 text-[#E8C868] text-xs font-semibold uppercase tracking-widest mb-2">
              <Compass className="w-4 h-4" />
              <span>{language === 'ar' ? 'مخطط الوحدات السكنية' : 'FIND YOUR HOME AT NOTION'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white mb-4">
              {language === 'ar' ? 'اختر فئة وحدتك المفضلة' : 'Select Your Preferred Home Category'}
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              {language === 'ar'
                ? 'استعرض 9 خيارات سكنية معتمدة موزعة على 3 فئات رئيسية: الشقق، التاون هاوس، والفيلات.'
                : 'Browse 9 verified residential options across 3 primary categories: Apartments, Townhouses, and Villas.'}
            </p>

            {/* Category Tabs: Apartments (5) | Townhouses (2) | Villas (2) */}
            <div className="flex items-center justify-center gap-3 mt-8 p-1.5 bg-[#081824] rounded-2xl border border-white/10 max-w-xl mx-auto">
              <button
                onClick={() => handleSelectCategory('Apartments')}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                  activeCategory === 'Apartments'
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#B89628] text-slate-950 font-bold shadow-lg shadow-[#D4AF37]/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>{language === 'ar' ? 'الشقق (5 خيارات)' : 'Apartments (5)'}</span>
              </button>

              <button
                onClick={() => handleSelectCategory('Townhouses')}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                  activeCategory === 'Townhouses'
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#B89628] text-slate-950 font-bold shadow-lg shadow-[#D4AF37]/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>{language === 'ar' ? 'تاون هاوس (خياران)' : 'Townhouses (2)'}</span>
              </button>

              <button
                onClick={() => handleSelectCategory('Villas')}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                  activeCategory === 'Villas'
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#B89628] text-slate-950 font-bold shadow-lg shadow-[#D4AF37]/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>{language === 'ar' ? 'فيلات (خياران)' : 'Villas (2)'}</span>
              </button>
            </div>
          </div>

          {/* Unit Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleUnits.map((unit) => {
              const isSelected = unit.id === selectedUnitId;
              const formattedPrice = unit.totalPriceEGP ? (unit.totalPriceEGP).toLocaleString() : 'N/A';
              const priceInMillions = unit.totalPriceEGP ? (unit.totalPriceEGP / 1000000).toFixed(3) + 'M' : '';

              return (
                <div
                  key={unit.id}
                  onClick={() => handleSelectUnit(unit)}
                  className={`cursor-pointer rounded-2xl p-6 transition-all duration-300 relative flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#0E2638] border-2 border-[#D4AF37] shadow-xl shadow-[#D4AF37]/15 ring-2 ring-[#D4AF37]/30 scale-[1.02]'
                      : 'bg-[#081A26]/90 border border-white/10 hover:border-white/20 hover:bg-[#0B202F]'
                  }`}
                >
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full bg-[#D4AF37]/15 text-[#E8C868] border border-[#D4AF37]/30 text-xs font-semibold">
                      {unit.category}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-black/40 text-slate-300 text-xs font-mono tabular-nums">
                      {unit.unitCode}
                    </span>
                  </div>

                  {/* Title & Specs */}
                  <div className="mb-6">
                    <h3 className="text-xl font-serif font-bold text-white mb-2">
                      {unit.propertyType}
                    </h3>
                    
                    {/* Area breakdown */}
                    <div className="space-y-1 text-sm text-slate-300 font-light">
                      <div className="flex items-center gap-2">
                        <Home className="w-4 h-4 text-[#D4AF37] shrink-0" />
                        <span>
                          {unit.isStartingArea 
                            ? (language === 'ar' ? `المساحة تبدأ من: ${unit.areaSqm} م²` : `Starting Area: from ${unit.areaSqm} m²`)
                            : (language === 'ar' ? `المساحة المبنية: ${unit.builtUpAreaSqm || unit.areaSqm} م²` : `Built-up Area: ${unit.builtUpAreaSqm || unit.areaSqm} m²`)}
                        </span>
                      </div>

                      {unit.gardenAreaSqm && (
                        <div className="flex items-center gap-2 text-emerald-400 font-medium">
                          <TreePine className="w-4 h-4 shrink-0" />
                          <span>
                            {language === 'ar' ? `الحديقة الخاصة: ${unit.gardenAreaSqm} م²` : `Private Garden: ${unit.gardenAreaSqm} m²`}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Pricing Box */}
                  <div className="bg-[#040D14]/80 rounded-xl p-4 border border-white/10 mb-6">
                    <span className="text-[11px] text-slate-400 block mb-0.5">
                      {unit.isStartingArea 
                        ? (language === 'ar' ? 'سعر البداية:' : 'Starting Price:')
                        : (language === 'ar' ? 'السعر المعتمد:' : 'Verified Price:')}
                    </span>
                    <div className="flex items-baseline justify-between flex-wrap gap-1">
                      <span className="text-2xl font-bold text-white font-serif">
                        EGP {formattedPrice}
                      </span>
                      <span className="text-xs font-bold text-[#E8C868]">
                        ({priceInMillions} EGP)
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 block mt-2 pt-2 border-t border-white/10">
                      {language === 'ar' ? 'تقسيط حتى 10 سنوات • 10% مقدم' : 'Up to 10 Years • 10% Down Payment'}
                    </span>
                  </div>

                  {/* Action CTA */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAskAboutUnit(unit);
                    }}
                    className={`w-full py-3 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                      isSelected
                        ? 'bg-[#D4AF37] hover:bg-[#E8C868] text-slate-950 shadow-md'
                        : 'bg-slate-800 hover:bg-slate-700 text-white border border-white/10'
                    }`}
                  >
                    <span>{language === 'ar' ? 'طلب تفاصيل هذه الوحدة' : 'Ask About This Unit'}</span>
                    <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. PAYMENT PLANS (Plan A: 10% / 10 Yrs & Plan B: 6%+6% / 9 Yrs) */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#071722] border-y border-white/10">
          <div className="max-w-5xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold text-[#E8C868] uppercase tracking-widest block mb-2">
                {language === 'ar' ? 'أنظمة السداد المرنة' : 'FLEXIBLE PAYMENT PLANS'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-3">
                {language === 'ar' ? 'اختر نظام التقسيط الأنسب لك' : 'Tailored Payment Plans'}
              </h2>
              <p className="text-slate-400 text-sm sm:text-base">
                {language === 'ar'
                  ? 'خططا سداد ميسرتان صممتا لتسهيل امتلاك وحدتك في قلب امتداد الجولدن سكوير.'
                  : 'Two flexible payment plans structured for seamless residential acquisition.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* PLAN A */}
              <div className="bg-[#0B1F2C] rounded-2xl p-8 border border-white/10 hover:border-[#D4AF37]/50 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full bg-[#D4AF37]/20 text-[#E8C868] text-xs font-bold uppercase">
                      PLAN A
                    </span>
                    <span className="text-xs text-slate-400">
                      {language === 'ar' ? 'النظام القياسي' : 'Standard Structure'}
                    </span>
                  </div>

                  <h3 className="text-2xl font-serif font-bold text-white mb-6">
                    {language === 'ar' ? 'مقدم 10% وتقسيط على 10 سنوات' : '10% Down Payment / 10 Years'}
                  </h3>

                  <div className="space-y-4 text-sm text-slate-300 mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center font-bold text-xs">
                        10%
                      </div>
                      <div>
                        <strong className="text-white block">{language === 'ar' ? 'مقدم الحجز والتعاقد' : 'Down Payment'}</strong>
                        <span className="text-xs text-slate-400">{language === 'ar' ? '10% من إجمالي قيمة الوحدة' : '10% of total unit price'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center font-bold text-xs">
                        10Y
                      </div>
                      <div>
                        <strong className="text-white block">{language === 'ar' ? 'فترة السداد' : 'Installments Duration'}</strong>
                        <span className="text-xs text-slate-400">{language === 'ar' ? 'أقساط متساوية تمتد حتى 10 سنوات' : 'Installments up to 10 Years'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => formRef.current?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-white/10 transition-all"
                >
                  {language === 'ar' ? 'طلب خطة الـ 10 سنوات' : 'Ask About 10-Year Plan'}
                </button>
              </div>

              {/* PLAN B */}
              <div className="bg-[#0E283A] rounded-2xl p-8 border-2 border-[#D4AF37] shadow-xl shadow-[#D4AF37]/10 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#D4AF37]/15 rounded-full blur-2xl pointer-events-none" />
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full bg-[#D4AF37] text-slate-950 text-xs font-bold uppercase">
                      PLAN B
                    </span>
                    <span className="text-xs text-[#E8C868] font-semibold">
                      {language === 'ar' ? 'مقدم مخفض' : 'Lower Initial Entry'}
                    </span>
                  </div>

                  <h3 className="text-2xl font-serif font-bold text-white mb-6">
                    {language === 'ar' ? '6% مقدم + 6% بعد 3 شهور / 9 سنوات' : '6% + 6% After 3 Mo. / 9 Years'}
                  </h3>

                  <div className="space-y-4 text-sm text-slate-200 mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#D4AF37] text-slate-950 flex items-center justify-center font-bold text-xs">
                        6%
                      </div>
                      <div>
                        <strong className="text-white block">{language === 'ar' ? 'مقدم تعاقد أولي' : 'Initial Down Payment'}</strong>
                        <span className="text-xs text-slate-300">{language === 'ar' ? '6% فقط عند التعاقد' : '6% at contract signing'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#D4AF37] text-slate-950 flex items-center justify-center font-bold text-xs">
                        +6%
                      </div>
                      <div>
                        <strong className="text-white block">{language === 'ar' ? 'دفعة ثانية' : 'Second Payment'}</strong>
                        <span className="text-xs text-slate-300">{language === 'ar' ? '6% بعد 3 شهور من التعاقد' : '6% after 3 months'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#D4AF37] text-slate-950 flex items-center justify-center font-bold text-xs">
                        9Y
                      </div>
                      <div>
                        <strong className="text-white block">{language === 'ar' ? 'أقساط متساوية' : 'Equal Installments'}</strong>
                        <span className="text-xs text-slate-300">{language === 'ar' ? 'أقساط متساوية على 9 سنوات' : 'Equal installments over 9 years'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => formRef.current?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B89628] hover:from-[#E8C868] hover:to-[#D4AF37] text-slate-950 font-bold text-sm shadow-md transition-all"
                >
                  {language === 'ar' ? 'طلب خطة الـ 6%' : 'Ask About 6% Plan'}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 5. 12 FACILITIES IN 5 LIFESTYLE CATEGORIES */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold text-[#E8C868] uppercase tracking-widest block mb-2">
              {language === 'ar' ? 'الخدمات والمرافق المتكاملة' : 'INTEGRATED LIFESTYLE FACILITIES'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-4">
              {language === 'ar' ? 'مجتمع متكامل يثري أسلوب حياتك' : 'Designed for Refined Modern Living'}
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              {language === 'ar'
                ? '12 مرفقاً وخدمة حصرية منظمة ضمن 5 محاور أساسية لتوفير أعلى مستويات الراحة والرفاهية.'
                : '12 verified lifestyle amenities grouped into 5 cohesive living clusters.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. Wellness */}
            <div className="bg-[#081824] rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center">
                  <Dumbbell className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-serif font-bold text-white">
                  {language === 'ar' ? 'الصحة واللياقة' : 'Wellness & Fitness'}
                </h4>
              </div>
              <ul className="space-y-2.5 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#D4AF37]" />
                  <span>{language === 'ar' ? 'مركز لياقة بدنية وجيم (Fitness Centre)' : 'Fitness Centre'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#D4AF37]" />
                  <span>{language === 'ar' ? 'منطقة يوجا وتأمل (Yoga Area)' : 'Yoga Area'}</span>
                </li>
              </ul>
            </div>

            {/* 2. Family & Community */}
            <div className="bg-[#081824] rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-serif font-bold text-white">
                  {language === 'ar' ? 'العائلة والمجتمع' : 'Family & Community'}
                </h4>
              </div>
              <ul className="space-y-2.5 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#D4AF37]" />
                  <span>{language === 'ar' ? 'منطقة ألعاب أطفال (Kids Play Area)' : 'Kids Play Area'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#D4AF37]" />
                  <span>{language === 'ar' ? 'منطقة قراءة واسترخاء (Reading Area)' : 'Reading Area'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#D4AF37]" />
                  <span>{language === 'ar' ? 'منطقة ألعاب إلكترونية (Gamers Area)' : 'Gamers Area'}</span>
                </li>
              </ul>
            </div>

            {/* 3. Outdoor Lifestyle */}
            <div className="bg-[#081824] rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center">
                  <TreePine className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-serif font-bold text-white">
                  {language === 'ar' ? 'الحياة الخارجية والطبيعة' : 'Outdoor Lifestyle'}
                </h4>
              </div>
              <ul className="space-y-2.5 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#D4AF37]" />
                  <span>{language === 'ar' ? 'حدائق ومساحات لاندسكيب (Landscape Gardens)' : 'Landscape Gardens'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#D4AF37]" />
                  <span>{language === 'ar' ? 'منطقة شواء خارجية (BBQ Area)' : 'BBQ Area'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#D4AF37]" />
                  <span>{language === 'ar' ? 'حديقة للحيوانات الأليفة (Pet-Friendly Park)' : 'Pet-Friendly Park'}</span>
                </li>
              </ul>
            </div>

            {/* 4. Convenience */}
            <div className="bg-[#081824] rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center">
                  <Zap className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-serif font-bold text-white">
                  {language === 'ar' ? 'الخدمات الذكية والتسوق' : 'Convenience & Mobility'}
                </h4>
              </div>
              <ul className="space-y-2.5 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#D4AF37]" />
                  <span>{language === 'ar' ? 'ستريب مول تجاري (Strip Mall)' : 'Strip Mall'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#D4AF37]" />
                  <span>{language === 'ar' ? 'مسار دراجات كهربائية (Electric Bike Zone)' : 'Electric Bike Zone'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#D4AF37]" />
                  <span>{language === 'ar' ? 'محطات شحن سيارات كهربائية (EV Charging)' : 'Electric Car Charging Spots'}</span>
                </li>
              </ul>
            </div>

            {/* 5. Social */}
            <div className="bg-[#081824] rounded-2xl p-6 border border-white/10 md:col-span-2 lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center">
                  <Coffee className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-serif font-bold text-white">
                  {language === 'ar' ? 'النادي الاجتماعي الحصري' : 'Exclusive Social Hub'}
                </h4>
              </div>
              <ul className="space-y-2.5 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#D4AF37]" />
                  <span>{language === 'ar' ? 'كلوب هاوس حصري لقاطني الكمبوند (Exclusive Clubhouse)' : 'Exclusive Clubhouse with private lounges and gatherings'}</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 6. LEAD CAPTURE & WHATSAPP SYNC */}
        <section ref={formRef} className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="bg-gradient-to-b from-[#091D2C] to-[#040E16] rounded-3xl p-6 sm:p-10 border border-white/15 shadow-2xl relative overflow-hidden">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <div className="inline-flex items-center gap-2 text-[#E8C868] text-xs font-semibold uppercase tracking-widest mb-2">
                <Send className="w-4 h-4" />
                <span>{language === 'ar' ? 'طلب التوافر ومعاينة الوحدات' : 'DIRECT UNIT INQUIRY'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2">
                {language === 'ar' ? 'سجل اهتمامك في كمبوند NOTION' : 'Register Your Interest in NOTION'}
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm">
                {language === 'ar'
                  ? 'سيقوم مستشارك العقاري من Capital Pioneers بالتواصل معك بكافة تفاصيل الوحدة والأسعار المحدثة.'
                  : 'A Capital Pioneers real estate advisor will get in touch with complete inventory availability and latest pricing.'}
              </p>
            </div>

            {formSubmitted ? (
              <div className="text-center py-10 space-y-6 animate-fade-in">
                <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-400/40 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-serif font-bold text-white mb-2">
                    {language === 'ar' ? 'تم استلام طلبكم بنجاح' : 'Inquiry Received Successfully'}
                  </h3>
                  <p className="text-slate-300 text-sm max-w-md mx-auto">
                    {language === 'ar'
                      ? 'شكراً لتواصلك مع Capital Pioneers. يمكنك أيضاً متابعة الاستفسار فوراً عبر واتساب المباشر:'
                      : 'Thank you for contacting Capital Pioneers. You can also continue directly on WhatsApp:'}
                  </p>
                </div>
                {whatsappHandoffUrl && (
                  <a
                    href={whatsappHandoffUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm shadow-lg transition-all"
                  >
                    <MessageCircle className="w-5 h-5 fill-current" />
                    <span>{language === 'ar' ? 'فتح المحادثة عبر واتساب الآن' : 'Chat on WhatsApp Now'}</span>
                  </a>
                )}
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-5">
                {/* Auto Selected Unit Pill */}
                <div className="bg-[#040D14] p-4 rounded-xl border border-white/10 flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <span className="text-[11px] text-slate-400 block">
                      {language === 'ar' ? 'الوحدة المحددة حالياً:' : 'Currently Selected Unit:'}
                    </span>
                    <span className="text-sm sm:text-base font-bold text-[#E8C868]">
                      {currentSelectedUnit?.category || ''} • {currentSelectedUnit?.propertyType || ''} ({currentSelectedUnit?.areaSqm || ''} m²)
                    </span>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded bg-[#D4AF37]/20 text-[#E8C868] border border-[#D4AF37]/30 font-semibold">
                    EGP {currentSelectedUnit?.totalPriceEGP ? (currentSelectedUnit.totalPriceEGP).toLocaleString() : ''}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-300 font-medium mb-1.5">
                      {language === 'ar' ? 'الاسم بالكامل *' : 'Full Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={language === 'ar' ? 'أدخل اسمك الكريم' : 'Enter your name'}
                      className="w-full px-4 py-3 rounded-xl bg-[#040D14] border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 font-medium mb-1.5">
                      {language === 'ar' ? 'رقم الهاتف / واتساب *' : 'Phone / WhatsApp *'}
                    </label>
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder={language === 'ar' ? '01xxxxxxxxx' : '+20 1xx xxx xxxx'}
                      className="w-full px-4 py-3 rounded-xl bg-[#040D14] border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37] text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-300 font-medium mb-1.5">
                    {language === 'ar' ? 'ملاحظات أو استفسار خاص' : 'Notes / Questions'}
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={language === 'ar' ? 'أي تفاصيل ترغب بالاستفسار عنها...' : 'Any specific requirements or preferred plan...'}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#040D14] border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37] text-sm resize-none"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B89628] hover:from-[#E8C868] hover:to-[#D4AF37] text-slate-950 font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>{language === 'ar' ? 'جاري الإرسال...' : 'Submitting...'}</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>{language === 'ar' ? 'تأكيد إرسال الطلب' : 'Submit Direct Request'}</span>
                      </>
                    )}
                  </button>

                  <a
                    href={getWhatsAppUrlForUnit()}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackClickWhatsApp('notion_form', 'NOTION')}
                    className="py-3.5 px-6 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>{language === 'ar' ? 'استفسار عبر واتساب' : 'WhatsApp'}</span>
                  </a>
                </div>
              </form>
            )}
          </div>
        </section>

        {/* 7. LIGHTBOX MODAL */}
        {activeModalImage && (
          <div 
            onClick={() => setActiveModalImage(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center">
              <button
                onClick={() => setActiveModalImage(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-all z-10"
              >
                <X className="w-6 h-6" />
              </button>
              <img
                src={activeModalImage}
                alt="NOTION Golden Square New Cairo"
                className="max-h-[80vh] w-auto object-contain rounded-2xl border border-white/20 shadow-2xl"
              />
              <p className="mt-3 text-slate-300 text-sm font-medium text-center">
                NOTION — Extension Golden Square, New Cairo
              </p>
            </div>
          </div>
        )}

      </div>
    </>
  );
};
