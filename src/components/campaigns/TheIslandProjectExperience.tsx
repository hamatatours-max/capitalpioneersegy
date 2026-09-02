import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  MessageCircle, 
  Waves, 
  CheckCircle2, 
  Sparkles, 
  X, 
  ArrowRight, 
  Maximize2, 
  Clock, 
  Palmtree, 
  ShieldCheck, 
  Send,
  Building,
  Home,
  Check,
  Compass,
  Phone,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Grid
} from 'lucide-react';
import { Project, AvailableUnit } from '@/types/project';
import { useLanguage } from '@/context/LanguageContext';
import { getLocalizedProject } from '@/i18n/projectTranslations';
import { submitLead } from '@/services/leadService';
import { LeadFormData } from '@/types/lead';
import { trackEvent, trackClickWhatsApp } from '@/services/analyticsService';
import { SEO } from '@/components/common/SEO';
import { generateRealEstateListingSchema, generateBreadcrumbSchema } from '@/utils/schemaGenerator';

interface TheIslandProjectExperienceProps {
  project: Project;
  onRequestViewing?: (projectName?: string) => void;
}

interface IslandGalleryPhoto {
  src: string;
  category: 'beach' | 'lagoon' | 'progress';
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
}

const THE_ISLAND_GALLERY: IslandGalleryPhoto[] = [
  {
    src: '/images/projects/the-island/the-island-01.jpg',
    category: 'beach',
    titleEn: 'THE ISLAND Beach & Turquoise Water',
    titleAr: 'شاطئ ذا آيلاند والمياه الفيروزية',
    descEn: 'Sunbeds, branded beanbags, and straw tiki umbrellas on the open beach.',
    descAr: 'جلسات الشاطئ المفتوح والمظلات الطبيعية والمياه الفيروزية الصافية.',
  },
  {
    src: '/images/projects/the-island/the-island-02.jpg',
    category: 'beach',
    titleEn: 'Beach Umbrellas & Sunbeds',
    titleAr: 'مظلات الشاطئ والجلسات البحرية',
    descEn: 'Premium summer beach lounging at Island 22.',
    descAr: 'أجواء صيفية استثنائية بجزيرة 22 لسان الوزراء.',
  },
  {
    src: '/images/projects/the-island/the-island-03.jpg',
    category: 'beach',
    titleEn: 'Lifeguard Tower & Beachfront View',
    titleAr: 'برج الإنقاذ والواجهة البحرية',
    descEn: 'Safe crystal waters and sandy shoreline in Marina Al Alamein.',
    descAr: 'مياه هادئة ورمال بيضاء ناعمة بمارينا العلمين.',
  },
  {
    src: '/images/projects/the-island/the-island-04.jpg',
    category: 'beach',
    titleEn: 'Golden Shoreline & Open Sea',
    titleAr: 'الرمال الذهبية والبحر الصافي',
    descEn: 'Crystal-clear Mediterranean waters ready for swimming.',
    descAr: 'مياه البحر الأبيض المتوسط النقية المجهزة للسباحة.',
  },
  {
    src: '/images/projects/the-island/the-island-05.jpg',
    category: 'beach',
    titleEn: 'Summer Vibe & Beach Living',
    titleAr: 'أجواء الصيف والحياة الشاطئية',
    descEn: 'Active beach lifestyle and serene coastal atmosphere.',
    descAr: 'حياة شاطئية مفعمة بالحيوية والراحة والاستجمام.',
  },
  {
    src: '/images/projects/the-island/the-island-06.jpg',
    category: 'lagoon',
    titleEn: 'Island 22 Waterfront Lagoon',
    titleAr: 'بحيرات جزيرة 22 والواجهة المائية',
    descEn: 'Calm water inlets and natural lagoon landscape.',
    descAr: 'إطلالة البحيرات الهادئة والتكوينات المائية الطبيعية.',
  },
  {
    src: '/images/projects/the-island/the-island-07.jpg',
    category: 'lagoon',
    titleEn: 'Crystal Waters & Island Walkway',
    titleAr: 'المياه النقية والممشى الساحلي',
    descEn: 'Serene island pathways with direct sea access.',
    descAr: 'ممرات الجزيرة المحاطة بالمياه المباشرة.',
  },
  {
    src: '/images/projects/the-island/the-island-08.jpg',
    category: 'lagoon',
    titleEn: 'Coastal Promenade & Island Setting',
    titleAr: 'الممشى المائي وأجواء الجزيرة',
    descEn: 'Exclusive waterfront promenade at Lesan El Wozara.',
    descAr: 'ممشى مائي حصري في لسان الوزراء بمارينا.',
  },
  {
    src: '/images/projects/the-island/the-island-09.jpg',
    category: 'lagoon',
    titleEn: 'Lesan El Wozara Panorama',
    titleAr: 'بانوراما لسان الوزراء وجزيرة 22',
    descEn: 'Stunning panoramic views across Island 22 and the surrounding waters.',
    descAr: 'إطلالة بانورامية ساحرة على جزيرة 22 والبحيرات المحيطة.',
  },
  {
    src: '/images/projects/the-island/the-island-10.jpg',
    category: 'progress',
    titleEn: 'On-Site Construction & Sea View',
    titleAr: 'موقع المشروع وإطلالة البحر المباشرة',
    descEn: 'Active building works with front-row sea views.',
    descAr: 'الأعمال الإنشائية القائمة مع إطلالة بحرية مباشرة.',
  },
  {
    src: '/images/projects/the-island/the-island-11.jpg',
    category: 'progress',
    titleEn: 'Island 22 Aerial Landscape View',
    titleAr: 'إطلالة علوية شاملة لموقع جزيرة 22',
    descEn: 'High-angle perspective showing the island coastline and development zone.',
    descAr: 'زاوية علوية توضح خط الساحل ومنطقة تطوير المشروع.',
  },
  {
    src: '/images/projects/the-island/the-island-12.jpg',
    category: 'progress',
    titleEn: 'Foundation & Concrete Milestones',
    titleAr: 'مستجدات الأعمال الخرسانية والأساسات',
    descEn: 'Solid structural foundations under rapid construction.',
    descAr: 'تنفيذ القواعد الخرسانية وفق أعلى معايير الجودة.',
  },
  {
    src: '/images/projects/the-island/the-island-13.jpg',
    category: 'progress',
    titleEn: 'Structural Framework Progress',
    titleAr: 'مراحل الهيكل الإنشائي المتقدم',
    descEn: 'Multi-story structural framework advancing on site.',
    descAr: 'تقدم مستمر في بناء الهيكل الإنشائي للمباني.',
  },
  {
    src: '/images/projects/the-island/the-island-14.jpg',
    category: 'progress',
    titleEn: 'Building Elevation & Architecture',
    titleAr: 'تصميم وواجهات المباني الساحلية',
    descEn: 'Architectural elevations taking shape along the shoreline.',
    descAr: 'تشكل واجهات المباني المعمارية على امتداد الساحل.',
  },
  {
    src: '/images/projects/the-island/the-island-15.jpg',
    category: 'progress',
    titleEn: 'Masterplan Setting & Horizon',
    titleAr: 'الموقع العام وأفق البحر الأبيض المتوسط',
    descEn: 'Expansive view of the construction footprint and clear sky.',
    descAr: 'رؤية متكاملة لموقع التطوير وأفق البحر المفتوح.',
  },
  {
    src: '/images/projects/the-island/the-island-16.jpg',
    category: 'progress',
    titleEn: 'Coastal Development Landscape',
    titleAr: 'المشهد العام لأعمال التطوير الساحلي',
    descEn: 'Site execution progressing across residential zones.',
    descAr: 'تنفيذ متواصل في مختلف مناطق الوحدات السكنية والخدمية.',
  },
  {
    src: '/images/projects/the-island/the-island-17.jpg',
    category: 'progress',
    titleEn: 'Construction Milestones from Above',
    titleAr: 'مراحل البناء من زاوية علوية',
    descEn: 'Overhead view of building slabs and reinforcement work.',
    descAr: 'إطلالة علوية توضح صب الأسقف وتسليح الهيكل.',
  },
  {
    src: '/images/projects/the-island/the-island-18.jpg',
    category: 'lagoon',
    titleEn: 'Marina Al Alamein Waterfront Vista',
    titleAr: 'إطلالة مائية من مارينا العلمين',
    descEn: 'Breathtaking blue horizon and tranquil waters at Island 22.',
    descAr: 'أفق أزرق بديع ومياه هادئة مميزة لجزيرة 22.',
  },
  {
    src: '/images/projects/the-island/the-island-19.jpg',
    category: 'beach',
    titleEn: 'THE ISLAND Marina 5 — Masterplan Overview',
    titleAr: 'ذا آيلاند مارينا 5 — المخطط العام والواجهة البحرية',
    descEn: 'Aerial masterplan rendering by HDP showing beachfront villas, chalets, and private island marina.',
    descAr: 'المخطط العام والواجهة الشاطئية والمارينا الخاصة بمشروع ذا آيلاند مارينا 5 من HDP.',
  },
];

export const TheIslandProjectExperience: React.FC<TheIslandProjectExperienceProps> = ({ 
  project: rawProject, 
  onRequestViewing 
}) => {
  const { language, isRTL } = useLanguage();
  const project = getLocalizedProject(rawProject, language);

  // Active Collection Tab: 'The Island Chalets' | 'Serviced Blu Stay'
  const [activeCollection, setActiveCollection] = useState<'The Island Chalets' | 'Serviced Blu Stay'>('The Island Chalets');
  
  // Selected Unit ID
  const [selectedUnitId, setSelectedUnitId] = useState<string>('the-island-chalet-1bed');
  
  // Pricing Plan View Mode: '4-Year' | '10-Year'
  const [selectedPlanTerm, setSelectedPlanTerm] = useState<'4-Year' | '10-Year'>('4-Year');

  // Media Modal & Lightbox
  const [modalImageIndex, setModalImageIndex] = useState<number | null>(null);
  const [isGalleryExpanded, setIsGalleryExpanded] = useState(false);
  const [selectedGalleryCategory, setSelectedGalleryCategory] = useState<'all' | 'beach' | 'lagoon' | 'progress'>('all');

  const filteredPhotos = selectedGalleryCategory === 'all' 
    ? THE_ISLAND_GALLERY 
    : THE_ISLAND_GALLERY.filter(p => p.category === selectedGalleryCategory);

  const displayedPhotos = (!isGalleryExpanded && selectedGalleryCategory === 'all') 
    ? filteredPhotos.slice(0, 8) 
    : filteredPhotos;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (modalImageIndex === null) return;
      if (e.key === 'Escape') setModalImageIndex(null);
      if (e.key === 'ArrowRight') {
        setModalImageIndex((prev) => (prev !== null ? (prev + 1) % THE_ISLAND_GALLERY.length : 0));
      }
      if (e.key === 'ArrowLeft') {
        setModalImageIndex((prev) => (prev !== null ? (prev - 1 + THE_ISLAND_GALLERY.length) % THE_ISLAND_GALLERY.length : 0));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalImageIndex]);

  // Lead Form State
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [whatsappHandoffUrl, setWhatsappHandoffUrl] = useState<string | null>(null);

  const formRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    trackEvent('the_island_view', {
      project_name: 'THE ISLAND',
      location: 'Island 22 – Lesan El Wozara, Marina Al Alamein',
      status: 'Beach Now Open',
    });
  }, []);

  const unitsList = project.availableUnitsList || [];
  const chaletUnits = unitsList.filter(u => u.collection === 'The Island Chalets');
  const bluStayUnits = unitsList.filter(u => u.collection === 'Serviced Blu Stay');
  const activeUnits = activeCollection === 'The Island Chalets' ? chaletUnits : bluStayUnits;

  const currentSelectedUnit = unitsList.find(u => u.id === selectedUnitId) || activeUnits[0] || unitsList[0];

  const handleSelectUnit = (unit: AvailableUnit) => {
    setSelectedUnitId(unit.id);
    if (unit.collection && unit.collection !== activeCollection) {
      setActiveCollection(unit.collection as 'The Island Chalets' | 'Serviced Blu Stay');
    }
    trackEvent('the_island_unit_select', {
      unit_id: unit.id,
      unit_code: unit.unitCode,
      collection: unit.collection,
      area_sqm: unit.areaSqm,
    });
  };

  const handleAskAboutUnit = (unit: AvailableUnit) => {
    handleSelectUnit(unit);
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleCollectionSwitch = (collection: 'The Island Chalets' | 'Serviced Blu Stay') => {
    setActiveCollection(collection);
    const firstUnit = collection === 'The Island Chalets' ? chaletUnits[0] : bluStayUnits[0];
    if (firstUnit) {
      setSelectedUnitId(firstUnit.id);
    }
    trackEvent('the_island_collection_switch', {
      collection,
    });
  };

  // WhatsApp direct link generator
  const getWhatsAppUrlForUnit = (unit?: AvailableUnit) => {
    const u = unit || currentSelectedUnit;
    const phone = '201000000000'; // Default broker/sales desk
    const unitLabel = u?.collection === 'Serviced Blu Stay'
      ? `THE ISLAND – Serviced Blu Stay – ${u?.propertyType || ''} – ${u?.areaSqm || ''} m²`
      : `THE ISLAND – ${u?.propertyType || ''} – ${u?.areaSqm || ''} m²`;

    const text = language === 'ar'
      ? `مرحباً Capital Pioneers، أود الاستفسار عن مشروع ${unitLabel} في جزيرة 22 لسان الوزراء بمارينا العلمين (وديعة صيانة 8%، تقسيط حتى 10 سنوات).`
      : language === 'de'
      ? `Hallo Capital Pioneers, ich interessiere mich für ${unitLabel} in Island 22 Lesan El Wozara, Marina Al Alamein.`
      : `Hello Capital Pioneers, I am inquiring about ${unitLabel} in Island 22 Lesan El Wozara, Marina Al Alamein (8% maintenance, installments up to 10 years).`;
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
        propertyType: 'Chalet',
        purpose: 'Investment',
        preferredContactMethod: 'WhatsApp',
        interestedProject: `THE ISLAND - ${currentSelectedUnit?.collection || ''}: ${currentSelectedUnit?.unitCode || currentSelectedUnit?.propertyType || ''} (${currentSelectedUnit?.areaSqm || ''} m²)`,
        message: `Selected Unit: ${currentSelectedUnit?.unitCode} | Plan View: ${selectedPlanTerm} | Notes: ${notes.trim()}`,
      };

      await submitLead(leadData);
      trackEvent('the_island_lead_submit', {
        unit: currentSelectedUnit?.unitCode,
        collection: currentSelectedUnit?.collection,
        area: currentSelectedUnit?.areaSqm,
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
      { name: 'Marina Al Alamein', item: '/projects?location=Matrouh' },
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

      <div className="bg-[#031520] text-slate-100 min-h-screen selection:bg-[#D4AF37]/30 selection:text-white font-sans">
        
        {/* TOP STATUS BAR: Beach Now Open */}
        <div className="bg-gradient-to-r from-[#024B68] via-[#0B7285] to-[#024B68] text-white text-xs sm:text-sm font-medium py-2.5 px-4 text-center border-b border-cyan-400/20 sticky top-0 z-40 backdrop-blur-md">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 flex-wrap">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <span className="font-bold uppercase tracking-wider text-cyan-200">
              {language === 'ar' ? 'شاطئ ذا آيلاند مفتوح الآن' : 'THE ISLAND BEACH IS NOW OPEN'}
            </span>
            <span className="hidden sm:inline text-cyan-200/60">•</span>
            <span className="text-cyan-100/90 text-xs sm:text-sm">
              {language === 'ar' 
                ? 'جزيرة 22 — لسان الوزراء بمارينا العلمين • خطط سداد تصل إلى 10 سنوات'
                : 'Island 22 – Lesan El Wozara, Marina Al Alamein • Plans up to 10 Years'}
            </span>
          </div>
        </div>

        {/* 1. HERO SECTION */}
        <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden pt-12 pb-20 px-4 sm:px-6 lg:px-8">
          {/* Background Image with Coastal Vignette */}
          <div className="absolute inset-0 z-0">
            <img
              src="/images/projects/the-island/hero.jpg"
              alt="THE ISLAND Beach at Island 22 Lesan El Wozara Marina Al Alamein"
              className="w-full h-full object-cover object-center scale-105 animate-fade-in"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#031520] via-[#031520]/80 to-[#031520]/60" />
            <div className="absolute inset-0 bg-radial-vignette opacity-70" />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto text-center">
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#E8C868] text-xs sm:text-sm font-semibold uppercase tracking-widest mb-6 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>{language === 'ar' ? 'مارينا العلمين • جزيرة 22' : 'MARINA AL ALAMEIN • ISLAND 22'}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-bold text-white tracking-tight leading-tight mb-4 text-shadow-lg">
              THE ISLAND
            </h1>

            <p className="text-xl sm:text-2xl md:text-3xl font-serif text-cyan-200 mb-6 font-light">
              {language === 'ar' ? 'The Wait Is Over. The Island Beach Is Now Open.' : 'THE WAIT IS OVER. THE ISLAND BEACH IS NOW OPEN.'}
            </p>

            {/* Marketing Message */}
            <p className="max-w-2xl mx-auto text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed mb-8 font-light">
              {language === 'ar'
                ? 'شاطئ The Island مفتوح الآن وجاهز لاستقبالكم. استمتع بأشعة الشمس والمياه الفيروزية الصافية وأجواء الصيف الراقية في جزيرة 22 — لسان الوزراء بمارينا العلمين.'
                : 'The Island beach is now open and ready to welcome you. Soak up the sun, enjoy the crystal-clear sea, and experience the summer lifestyle at Marina Al Alamein.'}
            </p>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto mb-10 text-left rtl:text-right">
              <div className="bg-[#082333]/80 backdrop-blur-md p-4 rounded-xl border border-cyan-500/20">
                <span className="text-[11px] text-cyan-300/70 uppercase tracking-wider block font-medium">
                  {language === 'ar' ? 'الموقع' : 'Location'}
                </span>
                <span className="text-sm sm:text-base font-semibold text-white mt-1 block">
                  Island 22, Marina
                </span>
              </div>
              <div className="bg-[#082333]/80 backdrop-blur-md p-4 rounded-xl border border-cyan-500/20">
                <span className="text-[11px] text-cyan-300/70 uppercase tracking-wider block font-medium">
                  {language === 'ar' ? 'الأسعار تبدأ من' : 'Starting From'}
                </span>
                <span className="text-sm sm:text-base font-bold text-[#E8C868] mt-1 block">
                  EGP 8.5M (4Y)
                </span>
              </div>
              <div className="bg-[#082333]/80 backdrop-blur-md p-4 rounded-xl border border-cyan-500/20">
                <span className="text-[11px] text-cyan-300/70 uppercase tracking-wider block font-medium">
                  {language === 'ar' ? 'أنظمة السداد' : 'Payment Plans'}
                </span>
                <span className="text-sm sm:text-base font-semibold text-white mt-1 block">
                  {language === 'ar' ? 'حتى 10 سنوات' : 'Up to 10 Years'}
                </span>
              </div>
              <div className="bg-[#082333]/80 backdrop-blur-md p-4 rounded-xl border border-cyan-500/20">
                <span className="text-[11px] text-cyan-300/70 uppercase tracking-wider block font-medium">
                  {language === 'ar' ? 'وديعة الصيانة' : 'Maintenance'}
                </span>
                <span className="text-sm sm:text-base font-semibold text-white mt-1 block">
                  8% (Separated)
                </span>
              </div>
            </div>

            {/* Primary CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => formRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B89628] hover:from-[#E8C868] hover:to-[#D4AF37] text-slate-950 font-bold text-base shadow-xl shadow-[#D4AF37]/20 transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                <span>{language === 'ar' ? 'استفسر عن الأسعار والوحدات' : 'Explore Units & Pricing'}</span>
                <ArrowRight className={`w-5 h-5 group-hover:translate-x-1 transition-transform ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
              </button>

              <a
                href={getWhatsAppUrlForUnit()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackClickWhatsApp('the_island_hero', 'THE ISLAND')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-base shadow-lg shadow-[#25D366]/20 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>{language === 'ar' ? 'تواصل عبر واتساب' : 'Inquire via WhatsApp'}</span>
              </a>

              <button
                onClick={() => setModalImageIndex(0)}
                className="w-full sm:w-auto px-6 py-4 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-cyan-200 border border-cyan-400/20 font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-md"
              >
                <Maximize2 className="w-4 h-4" />
                <span>{language === 'ar' ? 'معاينة الشاطئ' : 'View Beach Photo'}</span>
              </button>
            </div>
          </div>
        </section>

        {/* 2. PRODUCT COLLECTIONS & 5 VERIFIED UNITS */}
        <section id="collections" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-widest mb-2">
              <Compass className="w-4 h-4" />
              <span>{language === 'ar' ? 'مجموعات الوحدات المتميزة' : 'EXCLUSIVE PRODUCT COLLECTIONS'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white mb-4">
              {language === 'ar' ? 'اختر وحدتك في ذا آيلاند' : 'Choose Your Unit at THE ISLAND'}
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              {language === 'ar'
                ? 'يحتوي المشروع على مجموعتين مستقلتين: شاليهات ذا آيلاند الفاخرة (استلام خلال 2.5 سنة) ووحدات سيرفيسد بلو ستاي الفندقية (استلام خلال 3.5 سنة).'
                : 'THE ISLAND features two distinct product collections: The Island Chalets (2.5 Years Delivery) and Serviced Blu Stay units (3.5 Years Delivery).'}
            </p>

            {/* Collection Switcher Tabs */}
            <div className="flex items-center justify-center gap-3 mt-8 p-1.5 bg-[#061D28] rounded-2xl border border-cyan-500/20 max-w-xl mx-auto">
              <button
                onClick={() => handleCollectionSwitch('The Island Chalets')}
                className={`flex-1 py-3.5 px-5 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                  activeCollection === 'The Island Chalets'
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#B89628] text-slate-950 shadow-lg shadow-[#D4AF37]/20 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Palmtree className="w-4 h-4" />
                <span>{language === 'ar' ? 'شاليهات ذا آيلاند (سنتين ونصف)' : 'The Island Chalets (2.5Y)'}</span>
              </button>

              <button
                onClick={() => handleCollectionSwitch('Serviced Blu Stay')}
                className={`flex-1 py-3.5 px-5 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                  activeCollection === 'Serviced Blu Stay'
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#B89628] text-slate-950 shadow-lg shadow-[#D4AF37]/20 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Building className="w-4 h-4" />
                <span>{language === 'ar' ? 'سيرفيسد بلو ستاي (3.5 سنوات)' : 'Serviced Blu Stay (3.5Y)'}</span>
              </button>
            </div>

            {/* Pricing Plan Selector Toggle */}
            <div className="flex items-center justify-center gap-2 mt-4 text-xs">
              <span className="text-slate-400 font-light">
                {language === 'ar' ? 'عرض الأسعار حسب الخطة:' : 'Compare Verified Plan Prices:'}
              </span>
              <button
                onClick={() => setSelectedPlanTerm('4-Year')}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  selectedPlanTerm === '4-Year'
                    ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-300 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {language === 'ar' ? 'سداد 4 سنوات' : '4-Year Plan Price'}
              </button>
              <button
                onClick={() => setSelectedPlanTerm('10-Year')}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  selectedPlanTerm === '10-Year'
                    ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-300 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {language === 'ar' ? 'سداد 10 سنوات' : '10-Year Plan Price'}
              </button>
            </div>
          </div>

          {/* Units Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeUnits.map((unit) => {
              const isSelected = unit.id === selectedUnitId;
              const price4Y = unit.planPricing?.['4-Year'] as number;
              const price10Y = unit.planPricing?.['10-Year'] as number;
              const displayPrice = selectedPlanTerm === '4-Year' ? price4Y : price10Y;

              return (
                <div
                  key={unit.id}
                  onClick={() => handleSelectUnit(unit)}
                  className={`cursor-pointer rounded-2xl p-6 transition-all duration-300 relative flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#082B3E] border-2 border-[#D4AF37] shadow-xl shadow-[#D4AF37]/15 ring-2 ring-[#D4AF37]/30 scale-[1.02]'
                      : 'bg-[#061D28]/90 border border-cyan-500/20 hover:border-cyan-400/40 hover:bg-[#072433]'
                  }`}
                >
                  {/* Top Badge: Delivery Time */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-400/30 text-xs font-semibold flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{unit.delivery}</span>
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-black/40 text-slate-300 text-xs font-mono tabular-nums">
                      {unit.unitCode}
                    </span>
                  </div>

                  {/* Unit Title & Area */}
                  <div className="mb-6">
                    <h3 className="text-xl font-serif font-bold text-white mb-1">
                      {unit.propertyType}
                    </h3>
                    <p className="text-sm text-cyan-200/80 font-light flex items-center gap-1.5">
                      <Home className="w-4 h-4 text-cyan-400" />
                      <span>
                        {language === 'ar' ? `المساحة: ${unit.areaSqm} م²` : `Area: ${unit.areaSqm} m²`}
                      </span>
                    </p>
                  </div>

                  {/* Pricing Comparison Box */}
                  <div className="bg-[#031520]/80 rounded-xl p-4 border border-cyan-500/15 mb-6 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">{language === 'ar' ? 'سعر خطة 4 سنوات:' : '4-Year Plan Price:'}</span>
                      <span className="font-bold text-white">EGP {price4Y ? (price4Y / 1000000).toFixed(2) + 'M' : 'N/A'}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">{language === 'ar' ? 'سعر خطة 10 سنوات:' : '10-Year Plan Price:'}</span>
                      <span className="font-bold text-[#E8C868]">EGP {price10Y ? (price10Y / 1000000).toFixed(2) + 'M' : 'N/A'}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs pt-1.5 border-t border-cyan-500/10">
                      <span className="text-slate-400">{language === 'ar' ? 'خطط 5 و 8 سنوات:' : '5Y & 8Y Plans:'}</span>
                      <span className="text-cyan-300 font-medium text-[11px]">
                        {language === 'ar' ? 'طلب السعر المحدث' : 'Request Latest Price'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <span>{language === 'ar' ? 'وديعة الصيانة (8%):' : '8% Maintenance:'}</span>
                      <span className="text-slate-300">
                        EGP {unit.maintenanceEGP ? (unit.maintenanceEGP / 1000).toLocaleString() + 'K' : '8%'}
                      </span>
                    </div>
                  </div>

                  {/* Selected Price Callout */}
                  <div className="mb-4">
                    <span className="text-[11px] text-slate-400 block mb-0.5">
                      {language === 'ar' ? `السعر المحدد (${selectedPlanTerm}):` : `Selected Plan (${selectedPlanTerm}):`}
                    </span>
                    <span className="text-2xl font-bold text-white font-serif tracking-tight">
                      EGP {displayPrice ? (displayPrice).toLocaleString() : 'N/A'}
                    </span>
                  </div>

                  {/* Action Buttons: Request Details + Direct WhatsApp */}
                  <div className="flex flex-col sm:flex-row gap-2 mt-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAskAboutUnit(unit);
                      }}
                      className={`flex-1 py-3 px-3 rounded-xl font-bold text-xs transition-all duration-300 flex items-center justify-center gap-1.5 ${
                        isSelected
                          ? 'bg-[#D4AF37] hover:bg-[#E8C868] text-slate-950 shadow-md'
                          : 'bg-cyan-950 hover:bg-cyan-900 text-cyan-200 border border-cyan-400/30'
                      }`}
                    >
                      <span>{language === 'ar' ? 'طلب تفاصيل هذه الوحدة' : 'Ask About This Unit'}</span>
                      <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
                    </button>
                    <a
                      href={getWhatsAppUrlForUnit(unit)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        e.stopPropagation();
                        trackClickWhatsApp('the_island_unit_card', unit.unitCode);
                      }}
                      className="py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs transition-all duration-300 flex items-center justify-center gap-1.5 shadow-sm"
                      title={language === 'ar' ? 'استفسار عبر واتساب' : 'Inquire on WhatsApp'}
                    >
                      <MessageCircle className="w-4 h-4 fill-current" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 3. LATEST VERIFIED PAYMENT PLANS (8 & 10 Years, 8% Maintenance) */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#041A27]/80 border-y border-cyan-500/20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 text-[#E8C868] text-xs font-semibold uppercase tracking-widest mb-2">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                <span>{language === 'ar' ? 'أنظمة السداد المعتمدة والمحدثة' : 'LATEST VERIFIED PAYMENT PLANS'}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-3">
                {language === 'ar' ? 'أنظمة سداد ميسرة حتى 10 سنوات' : 'Flexible Payment Plans Up to 10 Years'}
              </h2>
              <p className="text-slate-400 text-sm sm:text-base">
                {language === 'ar'
                  ? 'مقدم 5% فقط + 5% بعد 3 أشهر مع فترات تقسيط متساوية على 8 أو 10 سنوات، ووديعة صيانة 8% منفصلة.'
                  : '5% Down Payment + 5% after 3 months with equal installment schedules over 8 or 10 years and separated 8% maintenance.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Plan 1: 5% + 5% / 8 Years */}
              <div className="bg-[#061D28] rounded-2xl p-7 border border-cyan-500/20 hover:border-cyan-400/40 transition-all flex flex-col justify-between shadow-xl">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 text-xs font-bold font-mono tabular-nums border border-cyan-500/30">
                      PLAN 1
                    </span>
                    <span className="text-xs text-slate-400 font-mono tabular-nums">
                      8 YEARS
                    </span>
                  </div>
                  <h4 className="text-xl font-serif font-bold text-white mb-4">
                    {language === 'ar' ? 'خطة 8 سنوات' : '8-Year Payment Plan'}
                  </h4>
                  <div className="space-y-3.5 text-sm text-slate-300">
                    <div className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span><strong>5%</strong> {language === 'ar' ? 'مقدم حجز وتعاقد' : 'Down Payment'}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span><strong>+ 5%</strong> {language === 'ar' ? 'دفعة بعد 3 أشهر' : 'After 3 Months'}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>{language === 'ar' ? 'أقساط متساوية على 8 سنوات' : 'Equal installments over 8 years'}</span>
                    </div>
                    <div className="flex items-center gap-2.5 pt-2 border-t border-cyan-500/10">
                      <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0" />
                      <span>{language === 'ar' ? 'وديعة الصيانة: 8% (منفصلة)' : 'Maintenance Deposit: 8% (Separated)'}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => formRef.current?.scrollIntoView({ behavior: 'smooth' })}
                  className="mt-8 w-full py-3 rounded-xl bg-cyan-950 hover:bg-cyan-900 text-cyan-300 text-xs font-bold border border-cyan-500/30 transition-all"
                >
                  {language === 'ar' ? 'طلب تفاصيل خطة 8 سنوات' : 'Inquire About 8-Year Plan'}
                </button>
              </div>

              {/* Plan 2: 5% + 5% / 10 Years */}
              <div className="bg-[#082B3E] rounded-2xl p-7 border-2 border-[#D4AF37] shadow-xl shadow-[#D4AF37]/15 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-28 h-28 bg-[#D4AF37]/20 rounded-full blur-2xl pointer-events-none" />
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full bg-[#D4AF37] text-slate-950 text-xs font-bold font-mono tabular-nums">
                      {language === 'ar' ? 'الأطول سداداً' : 'LONGEST TERM'}
                    </span>
                    <span className="text-xs text-[#E8C868] font-mono tabular-nums font-bold">
                      10 YEARS
                    </span>
                  </div>
                  <h4 className="text-xl font-serif font-bold text-white mb-4">
                    {language === 'ar' ? 'خطة 10 سنوات' : '10-Year Payment Plan'}
                  </h4>
                  <div className="space-y-3.5 text-sm text-slate-200">
                    <div className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-[#D4AF37] shrink-0" />
                      <span><strong>5%</strong> {language === 'ar' ? 'مقدم حجز وتعاقد' : 'Down Payment'}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-[#D4AF37] shrink-0" />
                      <span><strong>+ 5%</strong> {language === 'ar' ? 'دفعة بعد 3 أشهر' : 'After 3 Months'}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-[#D4AF37] shrink-0" />
                      <span>{language === 'ar' ? 'أقساط متساوية على 10 سنوات' : 'Equal installments over 10 years'}</span>
                    </div>
                    <div className="flex items-center gap-2.5 pt-2 border-t border-[#D4AF37]/20">
                      <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0" />
                      <span>{language === 'ar' ? 'وديعة الصيانة: 8% (منفصلة)' : 'Maintenance Deposit: 8% (Separated)'}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => formRef.current?.scrollIntoView({ behavior: 'smooth' })}
                  className="mt-8 w-full py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B89628] hover:from-[#E8C868] hover:to-[#D4AF37] text-slate-950 text-xs font-bold transition-all shadow-md"
                >
                  {language === 'ar' ? 'طلب تفاصيل خطة 10 سنوات' : 'Inquire About 10-Year Plan'}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 4. REAL PHOTOS GALLERY SECTION (18 Verified Photos) */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 text-[#E8C868] text-xs font-semibold uppercase tracking-widest mb-2">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>
                {language === 'ar' ? 'معرض الصور الحقيقي المعتمد (18 صورة)' : 'VERIFIED REAL PHOTO GALLERY (18 PHOTOS)'}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white mb-4">
              {language === 'ar' 
                ? 'صور حقيقية من مشروع The Island' 
                : language === 'de'
                ? 'Echte Fotos von THE ISLAND'
                : 'Real Photos from THE ISLAND'}
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              {language === 'ar'
                ? 'استعرض كافة الصور الواقعية المعتمدة للمشروع: الشاطئ المفتوح، مياه مارينا الفيروزية، إطلالات جزيرة 22 لسان الوزراء، وأحدث مستجدات التنفيذ الإنشائي على أرض الواقع.'
                : 'Browse all 18 verified on-site photographs: the active open beach, crystal-clear turquoise waters, Island 22 Lesan El Wozara lagoons, and ongoing construction milestones.'}
            </p>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
              <button
                onClick={() => { setSelectedGalleryCategory('all'); setIsGalleryExpanded(false); }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedGalleryCategory === 'all'
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#B89628] text-slate-950 shadow-lg shadow-[#D4AF37]/20'
                    : 'bg-[#061D28] text-slate-400 hover:text-white border border-cyan-500/20'
                }`}
              >
                {language === 'ar' ? 'جميع الصور (18)' : 'All Photos (18)'}
              </button>
              <button
                onClick={() => setSelectedGalleryCategory('beach')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedGalleryCategory === 'beach'
                    ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 font-bold'
                    : 'bg-[#061D28] text-slate-400 hover:text-white border border-cyan-500/20'
                }`}
              >
                {language === 'ar' ? 'الشاطئ والمياه الفيروزية (5)' : 'Beach & Turquoise Sea (5)'}
              </button>
              <button
                onClick={() => setSelectedGalleryCategory('lagoon')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedGalleryCategory === 'lagoon'
                    ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 font-bold'
                    : 'bg-[#061D28] text-slate-400 hover:text-white border border-cyan-500/20'
                }`}
              >
                {language === 'ar' ? 'جزيرة 22 والبحيرات (5)' : 'Island 22 & Lagoon Views (5)'}
              </button>
              <button
                onClick={() => setSelectedGalleryCategory('progress')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedGalleryCategory === 'progress'
                    ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 font-bold'
                    : 'bg-[#061D28] text-slate-400 hover:text-white border border-cyan-500/20'
                }`}
              >
                {language === 'ar' ? 'مستجدات التنفيذ الإنشائي (8)' : 'On-Site Construction (8)'}
              </button>
            </div>
          </div>

          {/* Responsive Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {displayedPhotos.map((photo, index) => {
              const photoIndexInAll = THE_ISLAND_GALLERY.findIndex(p => p.src === photo.src);
              return (
                <div
                  key={photo.src}
                  onClick={() => setModalImageIndex(photoIndexInAll >= 0 ? photoIndexInAll : index)}
                  className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer border border-cyan-500/20 bg-[#061D28] shadow-lg hover:border-[#D4AF37] transition-all duration-300 hover:-translate-y-1"
                >
                  <img
                    src={photo.src}
                    alt={language === 'ar' ? photo.titleAr : photo.titleEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
                  
                  {/* Category Tag */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-mono tabular-nums text-cyan-300 border border-cyan-500/30">
                      {photo.category === 'beach' 
                        ? (language === 'ar' ? 'شاطئ' : 'Beach') 
                        : photo.category === 'lagoon' 
                        ? (language === 'ar' ? 'جزيرة 22' : 'Island 22') 
                        : (language === 'ar' ? 'إنشاءات' : 'Progress')}
                    </span>
                  </div>

                  {/* Bottom Info */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
                    <div className="pr-2">
                      <span className="text-xs font-bold block text-[#E8C868] line-clamp-1">
                        {language === 'ar' ? photo.titleAr : photo.titleEn}
                      </span>
                      <span className="text-[10px] text-slate-300 line-clamp-1">
                        {language === 'ar' ? photo.descAr : photo.descEn}
                      </span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-black/60 backdrop-blur-sm text-cyan-300 group-hover:bg-[#D4AF37] group-hover:text-slate-950 transition-colors shrink-0">
                      <Maximize2 className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Expand / View All Photos Button */}
          {selectedGalleryCategory === 'all' && (
            <div className="text-center mt-10">
              <button
                onClick={() => setIsGalleryExpanded(!isGalleryExpanded)}
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-[#061D28] hover:bg-[#082B3E] border border-cyan-400/40 text-cyan-300 hover:text-white font-bold text-sm transition-all shadow-lg hover:shadow-cyan-500/20"
              >
                <ImageIcon className="w-4 h-4 text-[#D4AF37]" />
                <span>
                  {isGalleryExpanded
                    ? (language === 'ar' ? 'عرض صور أقل' : 'Show Less')
                    : (language === 'ar' ? `عرض كافة صور المشروع (${THE_ISLAND_GALLERY.length} صورة)` : `View All Photos (${THE_ISLAND_GALLERY.length} Images)`)}
                </span>
              </button>
            </div>
          )}
        </section>

        {/* 5. LEAD CAPTURE & WHATSAPP SYNC SECTION */}
        <section ref={formRef} className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="bg-gradient-to-b from-[#082333] to-[#041520] rounded-3xl p-6 sm:p-10 border border-cyan-500/30 shadow-2xl relative overflow-hidden">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <div className="inline-flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-widest mb-2">
                <Send className="w-4 h-4" />
                <span>{language === 'ar' ? 'طلب التوافر والأسعار' : 'DIRECT UNIT INQUIRY'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2">
                {language === 'ar' ? 'سجل اهتمامك في ذا آيلاند' : 'Register Your Interest in THE ISLAND'}
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
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm shadow-xl transition-all"
                  >
                    <MessageCircle className="w-5 h-5 fill-current" />
                    <span>{language === 'ar' ? 'متابعة عبر واتساب الآن' : 'Continue on WhatsApp Now'}</span>
                  </a>
                )}
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      {language === 'ar' ? 'الاسم بالكامل *' : 'Full Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={language === 'ar' ? 'الاسم الكريم' : 'Your Name'}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#031520] border border-cyan-500/20 text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37] text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      {language === 'ar' ? 'رقم الهاتف / واتساب *' : 'Phone / WhatsApp *'}
                    </label>
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+20 1xx xxx xxxx"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#031520] border border-cyan-500/20 text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37] text-sm"
                    />
                  </div>
                </div>

                {/* Selected Unit Summary Preview */}
                <div className="p-3 rounded-xl bg-[#031520]/80 border border-cyan-500/20 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                    <span className="text-slate-300 font-medium">
                      {currentSelectedUnit?.collection}: <strong>{currentSelectedUnit?.propertyType} ({currentSelectedUnit?.areaSqm} m²)</strong>
                    </span>
                  </div>
                  <span className="text-[#E8C868] font-bold">
                    {selectedPlanTerm === '4-Year' ? '4-Year Plan' : '10-Year Plan'}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {language === 'ar' ? 'ملاحظات إضافية أو استفسار محدد' : 'Additional Notes / Inquiry'}
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={language === 'ar' ? 'أي تفاصيل ترغب بالاستفسار عنها...' : 'Any specific requirements or preferred plan...'}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#031520] border border-cyan-500/20 text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37] text-sm resize-none"
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
                    onClick={() => trackClickWhatsApp('the_island_form', 'THE ISLAND')}
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

        {/* 6. FULL-SCREEN LIGHTBOX MODAL WITH NAVIGATION (ALL 18 PHOTOS) */}
        {modalImageIndex !== null && THE_ISLAND_GALLERY[modalImageIndex] && (
          <div 
            onClick={() => setModalImageIndex(null)}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fade-in"
          >
            <div 
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full max-h-[95vh] flex flex-col items-center justify-center"
            >
              {/* Top Controls */}
              <div className="w-full flex items-center justify-between text-white mb-2 px-2">
                <div className="flex items-center gap-2 text-xs font-mono tabular-nums text-cyan-300">
                  <span className="px-2.5 py-1 rounded-md bg-[#082B3E] border border-cyan-400/30 font-bold">
                    {modalImageIndex + 1} / {THE_ISLAND_GALLERY.length}
                  </span>
                  <span className="text-slate-300 hidden sm:inline">
                    {language === 'ar' 
                      ? THE_ISLAND_GALLERY[modalImageIndex].titleAr 
                      : THE_ISLAND_GALLERY[modalImageIndex].titleEn}
                  </span>
                </div>
                <button
                  onClick={() => setModalImageIndex(null)}
                  className="p-2 rounded-full bg-black/60 text-slate-300 hover:text-white hover:bg-black transition-all"
                  aria-label="Close Lightbox"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Main Image View with Arrows */}
              <div className="relative w-full flex items-center justify-center">
                {/* Previous Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setModalImageIndex((modalImageIndex - 1 + THE_ISLAND_GALLERY.length) % THE_ISLAND_GALLERY.length);
                  }}
                  className="absolute left-2 sm:left-4 z-10 p-3 rounded-full bg-black/70 text-white hover:bg-[#D4AF37] hover:text-slate-950 transition-all shadow-xl backdrop-blur-sm"
                  aria-label="Previous Photo"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <img
                  src={THE_ISLAND_GALLERY[modalImageIndex].src}
                  alt={language === 'ar' ? THE_ISLAND_GALLERY[modalImageIndex].titleAr : THE_ISLAND_GALLERY[modalImageIndex].titleEn}
                  className="max-h-[75vh] w-auto max-w-full object-contain rounded-2xl border border-cyan-500/20 shadow-2xl"
                />

                {/* Next Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setModalImageIndex((modalImageIndex + 1) % THE_ISLAND_GALLERY.length);
                  }}
                  className="absolute right-2 sm:right-4 z-10 p-3 rounded-full bg-black/70 text-white hover:bg-[#D4AF37] hover:text-slate-950 transition-all shadow-xl backdrop-blur-sm"
                  aria-label="Next Photo"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Caption & Inquire Bar */}
              <div className="w-full mt-3 flex flex-col sm:flex-row items-center justify-between gap-2 px-2 text-center sm:text-left">
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {language === 'ar' 
                      ? THE_ISLAND_GALLERY[modalImageIndex].titleAr 
                      : THE_ISLAND_GALLERY[modalImageIndex].titleEn}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {language === 'ar' 
                      ? THE_ISLAND_GALLERY[modalImageIndex].descAr 
                      : THE_ISLAND_GALLERY[modalImageIndex].descEn}
                  </p>
                </div>
                <a
                  href={`https://wa.me/201280800000?text=${encodeURIComponent(`Hello Capital Pioneers, I am inquiring about THE ISLAND (Photo: ${THE_ISLAND_GALLERY[modalImageIndex].titleEn})`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs shadow-md transition-all shrink-0"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>{language === 'ar' ? 'استفسار عن هذه الإطلالة' : 'Inquire via WhatsApp'}</span>
                </a>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
};
