import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  Phone, 
  MessageCircle, 
  Calendar, 
  CheckCircle2, 
  Sparkles, 
  Maximize2, 
  Check,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  X,
  ChevronLeft,
  ChevronRight,
  Home,
  Building2,
  Building,
  Tag,
  Clock,
  KeyRound,
  FileText,
  Compass,
  DollarSign,
  TrendingUp,
  Percent,
  Bed,
  Layers,
  Play,
  Pause,
  Volume2,
  VolumeX,
  TreePine,
  Award,
  UtensilsCrossed,
  Coffee,
  ShoppingBag,
  Stethoscope,
  Briefcase,
  SlidersHorizontal,
  Hotel,
  Shield,
  Waves,
  Sparkle
} from 'lucide-react';
import { Project } from '@/types/project';
import { SEO } from '@/components/common/SEO';
import { submitLead } from '@/services/leadService';
import { LeadFormData } from '@/types/lead';
import { useLanguage } from '@/context/LanguageContext';
import { getLocalizedProject } from '@/i18n/projectTranslations';
import { 
  trackClickWhatsApp, 
  trackClickPhone, 
  trackFormStart, 
  trackFormSubmit,
  trackEvent 
} from '@/services/analyticsService';

interface MiraiComplexProjectExperienceProps {
  project: Project;
  onRequestViewing?: (projectName?: string) => void;
}

export const MiraiComplexProjectExperience: React.FC<MiraiComplexProjectExperienceProps> = ({
  project: rawProject,
  onRequestViewing
}) => {
  const { language, isRTL } = useLanguage();
  const project = getLocalizedProject(rawProject, language);

  // Active Category State: 'residences' | 'offices-clinics' | 'retail'
  const [activeCategory, setActiveCategory] = useState<'residences' | 'offices-clinics' | 'retail'>('residences');

  // Selected Office/Clinic Area: 54 | 82 | 84 | 104
  const [selectedOfficeArea, setSelectedOfficeArea] = useState<number>(54);

  // Payment Plan Selection: '8y' (10% Down) | '9y' (15% Down)
  const [selectedPaymentPlan, setSelectedPaymentPlan] = useState<'8y' | '9y'>('8y');

  // Video State
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const showcaseVideoRef = useRef<HTMLVideoElement | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(true);
  const [isVideoMuted, setIsVideoMuted] = useState<boolean>(true);
  const [videoError, setVideoError] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isShowcasePlaying, setIsShowcasePlaying] = useState<boolean>(false);
  const [isShowcaseMuted, setIsShowcaseMuted] = useState<boolean>(false);

  // Form State
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [whatsappHandoffUrl, setWhatsappHandoffUrl] = useState('');
  const formRef = useRef<HTMLDivElement | null>(null);
  const exploreRef = useRef<HTMLDivElement | null>(null);

  // Video Sources
  const videoUrl = '/videos/projects/mirai-complex/mirai-complex-orbit-developments.mp4';
  const videoPoster = '/images/projects/mirai-complex/mirai-complex-poster.jpg';

  // Analytics on Mount
  useEffect(() => {
    trackEvent('mirai_project_view', {
      project_id: 'mirai-complex',
      developer: 'Orbit Developments',
      location: 'Eastern Expansions - Mall of Egypt Axis',
      active_category: activeCategory,
      selected_plan: selectedPaymentPlan,
    });
  }, []);

  // Category switch tracking
  const handleCategorySwitch = (category: 'residences' | 'offices-clinics' | 'retail') => {
    setActiveCategory(category);
    trackEvent('mirai_category_select', {
      category,
      selected_plan: selectedPaymentPlan
    });
  };

  // Plan switch tracking
  const handlePlanSwitch = (plan: '8y' | '9y') => {
    setSelectedPaymentPlan(plan);
    trackEvent('mirai_plan_select', {
      plan,
      category: activeCategory
    });
  };

  // Video Controls
  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsVideoPlaying(true);
        trackEvent('mirai_video_play', { action: 'play' });
      } else {
        videoRef.current.pause();
        setIsVideoPlaying(false);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsVideoMuted(videoRef.current.muted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (!document.fullscreenElement) {
        videoRef.current.requestFullscreen().catch(() => {});
        setIsFullscreen(true);
      } else {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  const toggleShowcasePlay = () => {
    if (showcaseVideoRef.current) {
      if (showcaseVideoRef.current.paused) {
        showcaseVideoRef.current.play();
        setIsShowcasePlaying(true);
        trackEvent('mirai_showcase_video_play', { action: 'play' });
      } else {
        showcaseVideoRef.current.pause();
        setIsShowcasePlaying(false);
      }
    }
  };

  const toggleShowcaseMute = () => {
    if (showcaseVideoRef.current) {
      showcaseVideoRef.current.muted = !showcaseVideoRef.current.muted;
      setIsShowcaseMuted(showcaseVideoRef.current.muted);
    }
  };

  // Dynamic Commercial Pricing
  const getStartingPrice = () => {
    if (activeCategory === 'residences') {
      return { amount: 8120000, label: 'EGP 8,120,000', perSqm: '' };
    }
    if (activeCategory === 'offices-clinics') {
      const price = selectedOfficeArea * 120000;
      return { 
        amount: price, 
        label: `EGP ${price.toLocaleString()}`, 
        perSqm: 'EGP 120,000 / m²' 
      };
    }
    return { amount: 0, label: language === 'ar' ? 'تواصل للاستفسار' : 'Contact for Availability', perSqm: '' };
  };

  const currentPriceInfo = getStartingPrice();

  // WhatsApp Message Generator
  const getWhatsAppUrl = () => {
    const phone = '201000000000';
    let text = '';

    const planText = selectedPaymentPlan === '8y' 
      ? (language === 'ar' ? 'مقدم 10% وتقسيط حتى 8 سنوات' : '10% Down Payment & up to 8 Years')
      : (language === 'ar' ? 'مقدم 15% وتقسيط حتى 9 سنوات' : '15% Down Payment & up to 9 Years');

    if (activeCategory === 'residences') {
      text = language === 'ar'
        ? `مرحباً Capital Pioneers، أود الاستفسار عن الشقق الفندقية المخدومة (Branded Residences بمساحة 56 م²) في مشروع MIRAI Complex من شركة Orbit Developments بمحور مول مصر بالتوسعات الشرقية (إدارة فنادق جرافيتي - تشطيب كامل بالفرش والتكييفات). اخترت خطة سداد: ${planText}. يرجى موافاتي بالوحدات المتاحة والتفاصيل.`
        : language === 'de'
        ? `Hallo Capital Pioneers, ich interessiere mich für die Branded Residences (56 m² Hotel-Residenz mit Möbeln & AC, betrieben von Gravity Hotels) im MIRAI Complex von Orbit Developments an der Mall of Egypt Achse. Ausgewählter Zahlungsplan: ${planText}. Bitte senden Sie mir Verfügbarkeiten und Details.`
        : `I'm interested in the Branded Residences (56 m² hotel-serviced unit with furniture & AC, operated by Gravity Hotels) at MIRAI Complex by Orbit Developments on Mall of Egypt Axis. Selected payment plan: ${planText}. Please send me current availability and details.`;
    } else if (activeCategory === 'offices-clinics') {
      text = language === 'ar'
        ? `مرحباً Capital Pioneers، أود الاستفسار عن المكاتب والعيادات كاملة التشطيب بالتكييفات في مشروع MIRAI Complex من شركة Orbit Developments بمحور مول مصر بالتوسعات الشرقية. المساحة المحددة: ${selectedOfficeArea} م² بسعر ${currentPriceInfo.label} (120,000 جنيه/م²). خطة السداد: ${planText}. يرجى موافاتي بالتفاصيل والوحدات المتاحة.`
        : language === 'de'
        ? `Hallo Capital Pioneers, ich interessiere mich für die voll ausgestatteten Büros & Praxen mit AC (${selectedOfficeArea} m² zum Preis von ${currentPriceInfo.label}) im MIRAI Complex von Orbit Developments. Zahlungsplan: ${planText}. Bitte senden Sie mir Details.`
        : `I'm interested in the fully finished Offices & Clinics with AC (${selectedOfficeArea} m² priced at ${currentPriceInfo.label}) at MIRAI Complex by Orbit Developments on Mall of Egypt Axis. Payment plan: ${planText}. Please send me current availability and details.`;
    } else {
      text = language === 'ar'
        ? `مرحباً Capital Pioneers، أود الاستفسار عن المساحات التجارية والمطاعم والكافيهات (Retail & F&B) بالدور الأرضي في مشروع MIRAI Complex من شركة Orbit Developments بمحور مول مصر بالتوسعات الشرقية. يرجى موافاتي بالوحدات المتاحة والاشتراطات التجارية.`
        : language === 'de'
        ? `Hallo Capital Pioneers, ich interessiere mich für Retail & Gastronomie (F&B) im Erdgeschoss des MIRAI Complex von Orbit Developments an der Mall of Egypt Achse. Bitte senden Sie mir Verfügbarkeiten.`
        : `I'm interested in the Ground Floor Retail & F&B opportunities at MIRAI Complex by Orbit Developments on Mall of Egypt Axis. Please send me current availability and commercial details.`;
    }

    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  };

  // Lead Form Submission
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phoneNumber.trim()) return;

    setIsSubmitting(true);
    try {
      let productLabel = '';
      if (activeCategory === 'residences') {
        productLabel = 'Branded Residences (56 m² Hotel-Quality with Furniture & AC - Gravity Hotels)';
      } else if (activeCategory === 'offices-clinics') {
        productLabel = `Offices & Clinics (${selectedOfficeArea} m² Fully Finished + AC @ EGP 120k/m²)`;
      } else {
        productLabel = 'Retail & F&B (Ground Floor Commercial)';
      }

      const planLabel = selectedPaymentPlan === '8y' ? '10% Down Payment / Up to 8 Years' : '15% Down Payment / Up to 9 Years';

      const leadData: LeadFormData = {
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        propertyType: activeCategory === 'residences' ? 'Apartment' : activeCategory === 'offices-clinics' ? 'Office' : 'Commercial',
        purpose: 'Investment',
        preferredContactMethod: 'WhatsApp',
        interestedProject: `MIRAI Complex - ${productLabel}`,
        message: `Project: MIRAI Complex (Orbit Developments) | Category: ${productLabel} | Plan: ${planLabel} | Price Reference: ${currentPriceInfo.label} | Notes: ${notes.trim()}`,
      };

      await submitLead(leadData);

      trackEvent('mirai_lead_submit', {
        full_name: fullName.trim(),
        phone: phoneNumber.trim(),
        category: activeCategory,
        selected_plan: selectedPaymentPlan,
        selected_office_area: selectedOfficeArea,
      });

      const waUrl = getWhatsAppUrl();
      setWhatsappHandoffUrl(waUrl);
      setFormSubmitted(true);
    } catch (err) {
      console.error('Lead submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title={language === 'ar'
          ? 'MIRAI Complex — مشروع متعدد الاستخدامات بالتوسعات الشرقية | شركة أوربت للتطوير العقاري'
          : 'MIRAI Complex | Mixed-Use Development by Orbit Developments | Capital Pioneers'}
        description={language === 'ar'
          ? 'مشروع MIRAI Complex من شركة أوربت على محور مول مصر: شقق فندقية بإدارة فنادق جرافيتي، مكاتب وعيادات كاملة التشطيب بالتكييفات تبدأ من 6.48 مليون جنيه، ومحلات ومطاعم بخطط سداد حتى 9 سنوات.'
          : 'Explore MIRAI Complex by Orbit Developments on Mall of Egypt Axis: Branded residences managed by Gravity Hotels, fully finished offices & clinics from EGP 6.48M, and retail with payment plans up to 9 years.'}
        canonicalPath="/projects/mirai-complex"
        ogImage={videoPoster}
      />

      <div className={`min-h-screen bg-[#030B11] text-slate-100 selection:bg-[#D4AF37] selection:text-slate-950 ${isRTL ? 'rtl' : 'ltr'}`}>

        {/* 1. HERO SECTION WITH PROMINENT HERO VIDEO */}
        <section className="relative min-h-[96vh] flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
          
          {/* Background Hero Video Layer */}
          <div className="absolute inset-0 z-0 overflow-hidden bg-black">
            <video
              ref={videoRef}
              autoPlay
              muted={isVideoMuted}
              loop
              playsInline
              preload="auto"
              poster={videoPoster}
              onError={() => setVideoError(true)}
              className="w-full h-full object-cover object-center opacity-55 scale-105"
            >
              <source src={videoUrl} type="video/mp4" />
            </video>

            {/* Cinematic Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#030B11] via-[#030B11]/75 to-[#030B11]/55" />
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#030B11]/30 to-[#030B11]/90" />

            {/* Video Controls Overlay */}
            <div className="absolute bottom-6 left-6 z-20 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs text-white">
              <button 
                onClick={togglePlay} 
                className="p-1 hover:text-[#D4AF37] transition-colors"
                aria-label={isVideoPlaying ? 'Pause Video' : 'Play Video'}
              >
                {isVideoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              </button>
              <button 
                onClick={toggleMute} 
                className="p-1 hover:text-[#D4AF37] transition-colors"
                aria-label={isVideoMuted ? 'Unmute Video' : 'Mute Video'}
              >
                {isVideoMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
              <button 
                onClick={toggleFullscreen} 
                className="p-1 hover:text-[#D4AF37] transition-colors"
                aria-label="Fullscreen"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] text-slate-400 font-mono tabular-nums pl-1">
                MIRAI COMPLEX • 0:20
              </span>
            </div>
          </div>

          <div className="relative z-10 max-w-6xl mx-auto w-full flex flex-col items-center text-center">
            
            {/* Top Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-6">
              <span className="px-4 py-1.5 rounded-full bg-[#0A2233]/90 text-cyan-300 border border-cyan-400/40 text-xs font-semibold uppercase tracking-widest flex items-center gap-1.5 shadow-lg backdrop-blur-md">
                <Building className="w-3.5 h-3.5 text-cyan-400" />
                <span>ORBIT DEVELOPMENTS</span>
              </span>

              <span className="px-4 py-1.5 rounded-full bg-[#D4AF37]/25 text-[#E8C868] border border-[#D4AF37]/50 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>{language === 'ar' ? 'وجهة متكاملة 13,000 م²' : '13,000 m² MIXED USE'}</span>
              </span>

              <span className="px-4 py-1.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md backdrop-blur-md">
                <Percent className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'تقسيط حتى 9 سنوات' : 'UP TO 9 YEARS PLANS'}</span>
              </span>
            </div>

            {/* Primary Heading H1 */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-bold text-white tracking-tight leading-[1.1] mb-2 max-w-5xl">
              MIRAI COMPLEX
            </h1>

            {/* Secondary Heading */}
            <p className="text-base sm:text-xl md:text-2xl text-[#E8C868] font-serif tracking-widest uppercase mb-4">
              BY ORBIT DEVELOPMENTS
            </p>

            {/* Main Positioning Line */}
            <div className="px-4 py-2 rounded-2xl bg-[#071622]/80 border border-cyan-500/30 backdrop-blur-md mb-4 max-w-3xl">
              <p className="text-xs sm:text-sm md:text-base text-cyan-200 font-medium tracking-wide">
                BRANDED RESIDENCES • OFFICES • CLINICS • RETAIL & F&B
              </p>
            </div>

            {/* Supporting Line */}
            <p className="text-sm sm:text-lg text-slate-300 font-light max-w-2xl mb-8 leading-relaxed">
              {language === 'ar'
                ? 'وجهة استثمارية متعددة الاستخدامات بالتوسعات الشرقية مباشرة على محور مول مصر (دقيقة واحدة من محور 26 يوليو).'
                : 'A New Mixed-Use Destination in the Eastern Expansions Directly on Mall of Egypt Axis (~1 min from 26th of July Axis).'}
            </p>

            {/* Commercial Highlight Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-4xl w-full mb-10">
              <div className="bg-[#051622]/90 border border-cyan-500/20 p-3 rounded-2xl text-center backdrop-blur-sm">
                <span className="text-[11px] text-slate-400 block uppercase font-mono tabular-nums">{language === 'ar' ? 'المساحة الإجمالية' : 'Total Area'}</span>
                <span className="text-sm sm:text-base font-bold text-white font-serif">13,000 m²</span>
              </div>
              <div className="bg-[#051622]/90 border border-cyan-500/20 p-3 rounded-2xl text-center backdrop-blur-sm">
                <span className="text-[11px] text-slate-400 block uppercase font-mono tabular-nums">{language === 'ar' ? 'إدارة فندقية' : 'Operator'}</span>
                <span className="text-sm sm:text-base font-bold text-[#E8C868] font-serif">Gravity Hotels</span>
              </div>
              <div className="bg-[#051622]/90 border border-cyan-500/20 p-3 rounded-2xl text-center backdrop-blur-sm">
                <span className="text-[11px] text-slate-400 block uppercase font-mono tabular-nums">{language === 'ar' ? 'تشطيب المكاتب والعيادات' : 'Offices Finishing'}</span>
                <span className="text-sm sm:text-base font-bold text-white font-serif">{language === 'ar' ? 'كامل + تكييف' : 'Finished + AC'}</span>
              </div>
              <div className="bg-[#051622]/90 border border-cyan-500/20 p-3 rounded-2xl text-center backdrop-blur-sm">
                <span className="text-[11px] text-slate-400 block uppercase font-mono tabular-nums">{language === 'ar' ? 'أنظمة السداد' : 'Payment Plans'}</span>
                <span className="text-sm sm:text-base font-bold text-emerald-400 font-serif">{language === 'ar' ? 'حتى 9 سنوات' : 'Up to 9 Years'}</span>
              </div>
            </div>

            {/* Conversion CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full max-w-lg">
              <button
                onClick={() => {
                  exploreRef.current?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-7 py-4 rounded-xl bg-[#092B3E] hover:bg-[#0d3b54] border border-cyan-400/40 text-cyan-200 font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>{language === 'ar' ? 'استكشف المشروع' : 'EXPLORE MIRAI'}</span>
              </button>

              <button
                onClick={() => {
                  trackEvent('mirai_request_details', { category: activeCategory });
                  formRef.current?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-7 py-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B89628] hover:from-[#E8C868] hover:to-[#D4AF37] text-slate-950 font-bold text-xs sm:text-sm shadow-xl shadow-[#D4AF37]/20 transition-all flex items-center justify-center gap-2"
              >
                <span>{language === 'ar' ? 'طلب التفاصيل والأسعار' : 'REQUEST DETAILS'}</span>
                <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
              </button>

              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  trackEvent('mirai_whatsapp_click', { category: activeCategory });
                  trackClickWhatsApp('mirai_hero', 'MIRAI-COMPLEX');
                }}
                className="w-full sm:w-auto px-7 py-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm shadow-lg shadow-[#25D366]/20 transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>{language === 'ar' ? 'اسأل عبر واتساب' : 'ASK ON WHATSAPP'}</span>
              </a>
            </div>

          </div>
        </section>

        {/* 2. PROJECT MASTER OVERVIEW & KEY NUMBERS */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-cyan-500/15">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-widest mb-2">
              <Layers className="w-4 h-4" />
              <span>{language === 'ar' ? 'المخطط الهندسي والمؤشرات' : 'MASTER DETAILS & KEY METRICS'}</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white mb-3">
              {language === 'ar' ? 'أرقام وحقائق مشروع MIRAI' : 'MIRAI Complex by the Numbers'}
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              {language === 'ar'
                ? 'تصميم معماري فريد على شكل حرف U لتعظيم الاستفادة من الواجهات والإطلالات المفتوحة.'
                : 'Distinctive U-shaped architectural design engineered to maximize façade utilization, natural lighting, and open landscape views.'}
            </p>
          </div>

          {/* 8 Verified Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto mb-12">
            
            <div className="bg-[#051824] rounded-2xl p-6 border border-cyan-500/20 text-center">
              <span className="text-2xl sm:text-3xl font-serif font-bold text-white block mb-1">13,000 m²</span>
              <span className="text-xs text-slate-400 uppercase font-mono tabular-nums">{language === 'ar' ? 'مساحة المشروع الإجمالية' : 'PROJECT AREA'}</span>
            </div>

            <div className="bg-[#051824] rounded-2xl p-6 border border-cyan-500/20 text-center">
              <span className="text-2xl sm:text-3xl font-serif font-bold text-cyan-300 block mb-1">30%</span>
              <span className="text-xs text-slate-400 uppercase font-mono tabular-nums">{language === 'ar' ? 'النسبة البنائية القصوى' : 'MAX BUILDING FOOTPRINT'}</span>
            </div>

            <div className="bg-[#051824] rounded-2xl p-6 border border-cyan-500/20 text-center">
              <span className="text-2xl sm:text-3xl font-serif font-bold text-emerald-400 block mb-1">3,000 m²</span>
              <span className="text-xs text-slate-400 uppercase font-mono tabular-nums">{language === 'ar' ? 'مساحات اللاندسكيب' : 'LANDSCAPING'}</span>
            </div>

            <div className="bg-[#051824] rounded-2xl p-6 border border-cyan-500/20 text-center">
              <span className="text-2xl sm:text-3xl font-serif font-bold text-cyan-400 block mb-1">800 m²</span>
              <span className="text-xs text-slate-400 uppercase font-mono tabular-nums">{language === 'ar' ? 'حمام السباحة' : 'SWIMMING POOL'}</span>
            </div>

            <div className="bg-[#051824] rounded-2xl p-6 border border-[#D4AF37]/30 text-center">
              <span className="text-2xl sm:text-3xl font-serif font-bold text-[#E8C868] block mb-1">108</span>
              <span className="text-xs text-slate-400 uppercase font-mono tabular-nums">{language === 'ar' ? 'وحدة شقق فندقية' : 'BRANDED RESIDENCES'}</span>
            </div>

            <div className="bg-[#051824] rounded-2xl p-6 border border-cyan-500/20 text-center">
              <span className="text-2xl sm:text-3xl font-serif font-bold text-white block mb-1">84</span>
              <span className="text-xs text-slate-400 uppercase font-mono tabular-nums">{language === 'ar' ? 'مكتب وعيادة طبية' : 'OFFICES & CLINICS'}</span>
            </div>

            <div className="bg-[#051824] rounded-2xl p-6 border border-cyan-500/20 text-center">
              <span className="text-2xl sm:text-3xl font-serif font-bold text-white block mb-1">3</span>
              <span className="text-xs text-slate-400 uppercase font-mono tabular-nums">{language === 'ar' ? 'مداخل رئيسية' : 'MAIN ENTRANCES'}</span>
            </div>

            <div className="bg-[#051824] rounded-2xl p-6 border border-cyan-500/20 text-center">
              <span className="text-2xl sm:text-3xl font-serif font-bold text-cyan-300 block mb-1">6</span>
              <span className="text-xs text-slate-400 uppercase font-mono tabular-nums">{language === 'ar' ? 'مصاعد (2 لكل مدخل)' : 'ELEVATORS IN TOTAL'}</span>
            </div>

          </div>

          {/* Building Configuration Description */}
          <div className="bg-[#071F2E] rounded-3xl p-8 border border-cyan-500/20 max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs font-mono tabular-nums uppercase tracking-widest text-[#E8C868] font-bold">
                {language === 'ar' ? 'الهيكل الإنشائي للمبنى' : 'BUILDING CONFIGURATION'}
              </span>
              <h3 className="text-xl font-bold text-white">
                {language === 'ar' ? 'جراج تحت الأرض + دور أرضي + 3 أدوار متكررة' : 'Underground Garage + Ground Floor + 3 Upper Floors'}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-light">
                {language === 'ar'
                  ? 'يخصص أكثر من 70% من مساحة المشروع للاندسكيب والمساحات الخضراء والخدمات وحمام السباحة والمناطق الترفيهية المفتوحة.'
                  : 'Over 70% of the total 13,000 m² site is dedicated to green landscaping, services, open relaxation zones, and the 800 m² swimming pool.'}
              </p>
            </div>
            <div className="shrink-0 px-5 py-3 rounded-2xl bg-[#03131E] border border-cyan-400/30 text-center">
              <span className="text-xs text-slate-400 block">{language === 'ar' ? 'التصميم الهندسي' : 'Architecture'}</span>
              <span className="text-lg font-bold text-cyan-300 font-serif">U-Shaped Concept</span>
            </div>
          </div>
        </section>

        {/* DEDICATED OFFICIAL PROJECT VIDEO SHOWCASE */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-widest mb-2">
              <Play className="w-4 h-4 fill-cyan-400" />
              <span>{language === 'ar' ? 'فيديو المشروع الرسمي' : 'OFFICIAL PROJECT VIDEO'}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white mb-3">
              {language === 'ar'
                ? 'جولة فيديو حصرية في مشروع MIRAI Complex'
                : 'Exclusive Architectural Video Tour — MIRAI Complex'}
            </h2>
            <p className="text-sm sm:text-base text-slate-300 font-light">
              {language === 'ar'
                ? 'شاهد التصميم المعماري الحديث والواجهات الفندقية وموقع المشروع مباشرة على محور مول مصر بالتوسعات الشرقية.'
                : 'Experience the modern architectural concept, hospitality residences, and prime frontage on Mall of Egypt Axis.'}
            </p>
          </div>

          <div className="relative rounded-3xl overflow-hidden bg-black border-2 border-[#D4AF37]/40 shadow-[0_20px_50px_rgba(0,0,0,0.8)] group">
            {/* Native Video Player with Custom Controls */}
            <video
              ref={showcaseVideoRef}
              controls
              playsInline
              preload="metadata"
              poster={videoPoster}
              className="w-full aspect-video object-cover"
              onPlay={() => setIsShowcasePlaying(true)}
              onPause={() => setIsShowcasePlaying(false)}
            >
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support HTML5 video playback.
            </video>

            {/* Top Brand Badges */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-xs text-white">
                <Building className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-semibold tracking-wider uppercase">ORBIT DEVELOPMENTS</span>
              </div>
              <div className="px-3 py-1.5 rounded-full bg-[#D4AF37]/90 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg">
                MIRAI COMPLEX • 0:20
              </div>
            </div>
          </div>
        </section>

        {/* 3. STRATEGIC LOCATION SECTION */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-[#051C2B] to-[#021019] rounded-3xl p-8 sm:p-12 border border-cyan-500/25 shadow-2xl relative overflow-hidden">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-widest mb-3">
                <MapPin className="w-4 h-4" />
                <span>{language === 'ar' ? 'الموقع الاستراتيجي بالتوسعات الشرقية' : 'STRATEGIC LOCATION'}</span>
              </div>
              
              <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white mb-4">
                {language === 'ar'
                  ? 'مباشرة على محور مول مصر — دقيقة واحدة من محور 26 يوليو'
                  : 'Directly on Mall of Egypt Axis (~1 Min from 26th of July Axis)'}
              </h2>

              <p className="text-base text-slate-300 font-light leading-relaxed mb-6">
                {language === 'ar'
                  ? 'يتمتع مشروع MIRAI Complex بواجهات ومداخل مباشرة على 3 شوارع رئيسية في قلب التوسعات الشرقية، ويقع بالقرب من أرقى المشروعات السكنية الكبرى بما في ذلك سوان ليك (شركة حسن علام) ولا فيدا (شركة البستاني).'
                  : 'Positioned with frontage and access across 3 main streets in the Eastern Expansions, adjacent to leading masterplanned communities including Swan Lake (Hassan Allam) and La Vida (El Bostany).'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#02131D] border border-cyan-500/20 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{language === 'ar' ? 'مباشرة على محور مول مصر' : 'Directly on Mall of Egypt Axis'}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#02131D] border border-cyan-500/20 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{language === 'ar' ? 'دقيقة واحدة من محور 26 يوليو' : '1 Min from 26th of July Axis'}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#02131D] border border-cyan-500/20 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{language === 'ar' ? 'واجهات على 3 شوارع رئيسية' : 'Frontage on 3 Main Streets'}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. PRODUCT COLLECTIONS (Interactive Tabs) */}
        <section ref={exploreRef} className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 text-[#E8C868] text-xs font-semibold uppercase tracking-widest mb-2">
              <SlidersHorizontal className="w-4 h-4 text-[#D4AF37]" />
              <span>{language === 'ar' ? 'مكونات المشروع العقارية' : 'PRODUCT COLLECTIONS'}</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white mb-3">
              {language === 'ar' ? 'اختر فئة الاستثمار في MIRAI' : 'Distinct Real Estate Collections'}
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              {language === 'ar'
                ? 'استكشف الوحدات الفندقية المخدومة، المكاتب والعيادات كاملة التشطيب، والوحدات التجارية.'
                : 'Explore branded hotel residences, fully finished commercial offices & medical clinics, and prime retail spaces.'}
            </p>
          </div>

          {/* 3 Main Product Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12 max-w-3xl mx-auto">
            
            {/* Tab 1: Branded Residences */}
            <button
              onClick={() => handleCategorySwitch('residences')}
              className={`flex-1 min-w-[200px] py-4 px-5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex flex-col items-center justify-center gap-1 border ${
                activeCategory === 'residences'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#B89628] text-slate-950 border-[#E8C868] shadow-xl shadow-[#D4AF37]/20 scale-105'
                  : 'bg-[#051824] text-slate-300 border-cyan-500/20 hover:border-cyan-400/40 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <Hotel className="w-4 h-4" />
                <span>{language === 'ar' ? 'شقق فندقية مخدومة' : 'BRANDED RESIDENCES'}</span>
              </div>
              <span className="text-[11px] font-mono tabular-nums font-normal">
                {language === 'ar' ? '108 وحدات • إدارة جرافيتي' : '108 Units • Gravity Hotels'}
              </span>
            </button>

            {/* Tab 2: Offices & Clinics */}
            <button
              onClick={() => handleCategorySwitch('offices-clinics')}
              className={`flex-1 min-w-[200px] py-4 px-5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex flex-col items-center justify-center gap-1 border ${
                activeCategory === 'offices-clinics'
                  ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-white border-cyan-300 shadow-xl shadow-cyan-500/20 scale-105'
                  : 'bg-[#051824] text-slate-300 border-cyan-500/20 hover:border-cyan-400/40 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                <span>{language === 'ar' ? 'مكاتب وعيادات طبية' : 'OFFICES & CLINICS'}</span>
              </div>
              <span className="text-[11px] font-mono tabular-nums font-normal">
                {language === 'ar' ? '84 وحدة • كاملة التشطيب + تكييف' : '84 Units • Fully Finished + AC'}
              </span>
            </button>

            {/* Tab 3: Retail & F&B */}
            <button
              onClick={() => handleCategorySwitch('retail')}
              className={`flex-1 min-w-[200px] py-4 px-5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex flex-col items-center justify-center gap-1 border ${
                activeCategory === 'retail'
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white border-emerald-300 shadow-xl shadow-emerald-500/20 scale-105'
                  : 'bg-[#051824] text-slate-300 border-cyan-500/20 hover:border-cyan-400/40 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4" />
                <span>{language === 'ar' ? 'تجاري ومطاعم وكافيهات' : 'RETAIL & F&B'}</span>
              </div>
              <span className="text-[11px] font-mono tabular-nums font-normal">
                {language === 'ar' ? 'الدور الأرضي' : 'Ground Floor'}
              </span>
            </button>

          </div>

          {/* TAB 1 CONTENT: BRANDED RESIDENCES */}
          {activeCategory === 'residences' && (
            <div className="bg-[#051B27] rounded-3xl p-8 sm:p-12 border-2 border-[#D4AF37]/40 shadow-2xl relative overflow-hidden animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                <div className="lg:col-span-7 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/20 text-[#E8C868] text-xs font-bold font-mono tabular-nums">
                    <Hotel className="w-3.5 h-3.5" />
                    <span>MANAGED & OPERATED BY GRAVITY HOTELS</span>
                  </div>

                  <h3 className="text-3xl sm:text-4xl font-serif font-bold text-white">
                    {language === 'ar' ? '108 وحدة شقق فندقية مخدومة' : '108 Hotel / Branded Residence Units'}
                  </h3>

                  <p className="text-base text-slate-300 font-light leading-relaxed">
                    {language === 'ar'
                      ? 'وحدات فندقية بمساحة 56 م² بتشطيب فندقي متكامل، تسلم بالكامل بالفرش الفندقي الفاخر وأجهزة التكييف، مع إدارة وتشغيل احترافي من مجموعة فنادق جرافيتي (Gravity Hotels — مجموعة فنادق 5 نجوم في مصر).'
                      : 'Verified 56 m² branded residence units delivered with full hotel-quality finishing, designer furniture, and air conditioning, operated by Gravity Hotels (a 5-star hotel group in Egypt).'}
                  </p>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div className="bg-[#02131D] p-3.5 rounded-xl border border-cyan-500/20">
                      <span className="text-slate-400 block text-[11px] mb-0.5">{language === 'ar' ? 'المساحة المعتمدة' : 'Unit Area'}</span>
                      <span className="font-bold text-white text-base">56 m²</span>
                    </div>
                    <div className="bg-[#02131D] p-3.5 rounded-xl border border-[#D4AF37]/30">
                      <span className="text-[#E8C868] block text-[11px] mb-0.5">{language === 'ar' ? 'يبدأ السعر من' : 'Starting Price'}</span>
                      <span className="font-bold text-[#E8C868] text-base font-mono tabular-nums">EGP 8,120,000</span>
                    </div>
                    <div className="bg-[#02131D] p-3.5 rounded-xl border border-cyan-500/20 col-span-2 sm:col-span-1">
                      <span className="text-slate-400 block text-[11px] mb-0.5">{language === 'ar' ? 'حالة التسليم' : 'Finishing'}</span>
                      <span className="font-bold text-cyan-300 text-xs sm:text-sm">{language === 'ar' ? 'فرش كامل + تكييف' : 'Furniture + AC'}</span>
                    </div>
                  </div>

                  {/* Operation Note */}
                  <div className="p-4 rounded-xl bg-[#082435] border border-cyan-500/20 text-xs text-slate-300 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>
                      {language === 'ar'
                        ? 'الوحدات مهيأة للتشغيل فور الاستلام وفقاً لترتيبات التسليم والتشغيل المعتمدة للمشروع من خلال شركة الإدارة الفندقية.'
                        : 'Ready for operation upon delivery, subject to the project’s actual delivery and operational arrangements.'}
                    </span>
                  </div>
                </div>

                {/* Hotel Services Card */}
                <div className="lg:col-span-5 bg-[#03141F] rounded-2xl p-6 border border-cyan-500/20">
                  <h4 className="text-xs font-mono tabular-nums uppercase tracking-widest text-[#E8C868] font-bold mb-4 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span>{language === 'ar' ? 'خدمات الضيافة الفندقية' : 'VERIFIED HOTEL SERVICES'}</span>
                  </h4>

                  <div className="grid grid-cols-1 gap-2.5 text-xs text-slate-300">
                    <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[#051C2B]">
                      <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                      <span>{language === 'ar' ? 'خدمات تنظيف الغرف (Housekeeping & Cleaning)' : 'Housekeeping & Cleaning Services'}</span>
                    </div>
                    <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[#051C2B]">
                      <Coffee className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                      <span>{language === 'ar' ? 'خدمة الغرف (Room Service)' : 'Room Service'}</span>
                    </div>
                    <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[#051C2B]">
                      <Shield className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                      <span>{language === 'ar' ? 'أمن وحراسة متكاملة (Security)' : '24/7 Security'}</span>
                    </div>
                    <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[#051C2B]">
                      <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                      <span>{language === 'ar' ? 'خدمات المغسلة والتنظيف الجاف (Laundry & Dry Cleaning)' : 'Laundry & Dry Cleaning Services'}</span>
                    </div>
                    <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[#051C2B]">
                      <KeyRound className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                      <span>{language === 'ar' ? 'خدمة ركن السيارات (Valet Parking)' : 'Valet Parking'}</span>
                    </div>
                    <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[#051C2B]">
                      <Building2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                      <span>{language === 'ar' ? 'كلوب هاوس حصري (Club House)' : 'Club House'}</span>
                    </div>
                    <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[#051C2B]">
                      <Waves className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                      <span>{language === 'ar' ? 'حمام سباحة فاخر 800 م²' : '800 m² Swimming Pool'}</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2 CONTENT: OFFICES & CLINICS */}
          {activeCategory === 'offices-clinics' && (
            <div className="bg-[#051B27] rounded-3xl p-8 sm:p-12 border-2 border-cyan-500/40 shadow-2xl relative overflow-hidden animate-fade-in">
              <div className="max-w-4xl mx-auto space-y-8">
                
                <div className="text-center space-y-2">
                  <span className="px-3.5 py-1.5 rounded-full bg-cyan-950 text-cyan-300 text-xs font-bold font-mono tabular-nums inline-block">
                    {language === 'ar' ? 'الأدوار من الأول إلى الثالث • 84 وحدة' : 'FIRST TO THIRD FLOORS • 84 UNITS'}
                  </span>
                  <h3 className="text-3xl sm:text-4xl font-serif font-bold text-white">
                    {language === 'ar' ? 'مكاتب إدارية وعيادات طبية كاملة التشطيب' : 'Offices & Medical Clinics — Fully Finished + AC'}
                  </h3>
                  <p className="text-sm text-slate-300 font-light">
                    {language === 'ar'
                      ? 'مساحات متنوعة كاملة التشطيب مع أجهزة التكييف بسعر متر يبدأ من 120,000 جنيه/م².'
                      : 'Fully finished corporate offices and specialized medical clinics including air conditioning, starting at EGP 120,000 / m².'}
                  </p>
                </div>

                {/* Prominent Price Banner */}
                <div className="bg-[#02141F] rounded-2xl p-6 border-2 border-cyan-400/30 text-center flex flex-col sm:flex-row items-center justify-around gap-4 shadow-xl">
                  <div>
                    <span className="text-xs text-slate-400 uppercase font-mono tabular-nums block mb-1">
                      {language === 'ar' ? 'سعر المتر المعتمد' : 'PRICE PER M²'}
                    </span>
                    <span className="text-2xl font-serif font-bold text-cyan-300 font-mono tabular-nums">
                      EGP 120,000 / m²
                    </span>
                  </div>
                  <div className="hidden sm:block text-slate-600 text-2xl font-light">|</div>
                  <div>
                    <span className="text-xs text-slate-400 uppercase font-mono tabular-nums block mb-1">
                      {language === 'ar' ? 'يبدأ سعر الوحدات من' : 'STARTING UNIT PRICE'}
                    </span>
                    <span className="text-3xl font-serif font-bold text-[#E8C868] font-mono tabular-nums">
                      FROM EGP 6.48M
                    </span>
                  </div>
                  <div className="hidden sm:block text-slate-600 text-2xl font-light">|</div>
                  <div>
                    <span className="text-xs text-slate-400 uppercase font-mono tabular-nums block mb-1">
                      {language === 'ar' ? 'التشطيب والتجهيز' : 'SPECIFICATIONS'}
                    </span>
                    <span className="text-base font-bold text-white">
                      FULLY FINISHED + AC
                    </span>
                  </div>
                </div>

                {/* Available Verified Areas Selector */}
                <div>
                  <label className="block text-xs font-mono tabular-nums uppercase text-slate-300 text-center mb-3">
                    {language === 'ar' ? 'اختر المساحة المعتمدة لاستعراض السعر:' : 'SELECT AVAILABLE AREA (54 – 82 – 84 – 104 m²):'}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[54, 82, 84, 104].map((area) => {
                      const calculatedPrice = area * 120000;
                      const isSelected = selectedOfficeArea === area;
                      return (
                        <button
                          key={area}
                          onClick={() => setSelectedOfficeArea(area)}
                          className={`p-4 rounded-2xl border text-center transition-all ${
                            isSelected
                              ? 'bg-cyan-950 border-cyan-400 text-white shadow-lg shadow-cyan-500/20 scale-[1.03]'
                              : 'bg-[#03131E] border-cyan-500/20 text-slate-300 hover:text-white hover:border-cyan-400/40'
                          }`}
                        >
                          <span className="text-xl font-serif font-bold block mb-1">{area} m²</span>
                          <span className="text-xs text-[#E8C868] font-mono tabular-nums block font-bold">
                            EGP {(calculatedPrice / 1000000).toFixed(2)}M
                          </span>
                          <span className="text-[10px] text-slate-400 block mt-1">
                            {language === 'ar' ? 'تشطيب + تكييف' : 'Finished + AC'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Circulation & Access */}
                <div className="bg-[#03141F] rounded-2xl p-6 border border-cyan-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-cyan-950 text-cyan-300">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-bold text-white text-sm block">{language === 'ar' ? '3 مداخل رئيسية للمبنى' : '3 Main Entrances'}</span>
                      <span className="text-slate-400">{language === 'ar' ? 'مداخل مصممة لتسهيل الحركة وانسيابية الدخول' : 'Engineered for smooth corporate and medical traffic'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-cyan-950 text-cyan-300">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-bold text-white text-sm block">{language === 'ar' ? '6 مصاعد سريعة إجمالاً' : '6 Elevators in Total'}</span>
                      <span className="text-slate-400">{language === 'ar' ? 'مصعدان لكل مدخل رئيسي' : '2 Dedicated Elevators per Entrance'}</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 3 CONTENT: RETAIL & F&B */}
          {activeCategory === 'retail' && (
            <div className="bg-[#051B27] rounded-3xl p-8 sm:p-12 border-2 border-emerald-500/40 shadow-2xl relative overflow-hidden animate-fade-in text-center">
              <div className="max-w-3xl mx-auto space-y-6">
                
                <span className="px-3.5 py-1.5 rounded-full bg-emerald-950 text-emerald-300 text-xs font-bold font-mono tabular-nums inline-block">
                  {language === 'ar' ? 'الدور الأرضي • واجهات تجارية مباشرة' : 'GROUND FLOOR • PRIME COMMERCIAL STRIP'}
                </span>

                <h3 className="text-3xl sm:text-4xl font-serif font-bold text-white">
                  {language === 'ar' ? 'المحلات التجارية والمطاعم والكافيهات (Retail & F&B)' : 'Retail, Restaurants & Cafes / F&B'}
                </h3>

                <p className="text-base text-slate-300 font-light leading-relaxed">
                  {language === 'ar'
                    ? 'يضم الدور الأرضي في مشروع MIRAI Complex مساحات تجارية متميزة مخصصة للمحلات التجارية والمطاعم والكافيهات ومفاهيم الأغذية والمشروبات (F&B) المتميزة، مستفيدة من الواجهات المفتوحة على 3 شوارع رئيسية والكثافة السكانية المحيطة.'
                    : 'The Ground Floor of MIRAI Complex is engineered for high-traffic retail shops, restaurants, cafes, and specialized Food & Beverage (F&B) concepts, benefiting from triple-street frontage and surrounding affluent residential communities.'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-4">
                  <div className="p-4 rounded-xl bg-[#02131D] border border-emerald-500/20">
                    <ShoppingBag className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
                    <span className="font-bold text-white block mb-0.5">{language === 'ar' ? 'محلات تجارية' : 'Retail Shops'}</span>
                    <span className="text-slate-400">{language === 'ar' ? 'واجهات أرضية مميزة' : 'Ground Floor Frontage'}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-[#02131D] border border-emerald-500/20">
                    <UtensilsCrossed className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
                    <span className="font-bold text-white block mb-0.5">{language === 'ar' ? 'مطاعم راقية' : 'Restaurants'}</span>
                    <span className="text-slate-400">{language === 'ar' ? 'جلسات خارجية وإطلالات' : 'Indoor & Outdoor Seating'}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-[#02131D] border border-emerald-500/20">
                    <Coffee className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
                    <span className="font-bold text-white block mb-0.5">{language === 'ar' ? 'كافيهات ومشروبات' : 'Cafes & Beverage'}</span>
                    <span className="text-slate-400">{language === 'ar' ? 'مفاهيم F&B مميزة' : 'Premium Lifestyle Concepts'}</span>
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    onClick={() => {
                      trackEvent('mirai_request_details', { category: 'retail' });
                      formRef.current?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-sm shadow-xl shadow-emerald-500/20 transition-all inline-flex items-center gap-2"
                  >
                    <span>{language === 'ar' ? 'طلب توفر الوحدات التجارية' : 'ASK ABOUT RETAIL AVAILABILITY'}</span>
                    <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                  </button>
                </div>

              </div>
            </div>
          )}

        </section>

        {/* 5. INTERACTIVE PAYMENT PLANS SECTION (10% / 8Y vs 15% / 9Y) */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-cyan-500/15">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 text-[#E8C868] text-xs font-semibold uppercase tracking-widest mb-2">
              <DollarSign className="w-4 h-4 text-[#D4AF37]" />
              <span>{language === 'ar' ? 'أنظمة السداد المرنة' : 'VERIFIED PAYMENT PLANS'}</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white mb-3">
              {language === 'ar' ? 'اختر خطة السداد المناسبة' : 'Flexible Payment Plans'}
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              {language === 'ar'
                ? 'أنظمة سداد ميسرة ومباشرة مع المطور بدون فوائد بنكية تمتد حتى 9 سنوات.'
                : 'Direct developer installment schedules with low down payments and terms extending up to 9 years.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            
            {/* Plan 1: 10% Down / 8 Years */}
            <div
              onClick={() => handlePlanSwitch('8y')}
              className={`cursor-pointer rounded-3xl p-8 border-2 transition-all relative flex flex-col justify-between ${
                selectedPaymentPlan === '8y'
                  ? 'bg-[#082738] border-[#D4AF37] shadow-2xl shadow-[#D4AF37]/15 scale-[1.02]'
                  : 'bg-[#041520] border-cyan-500/20 hover:border-cyan-400/40'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono tabular-nums font-bold text-[#E8C868]">
                    {language === 'ar' ? 'الخيار الأول' : 'OPTION 1'}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#D4AF37]/20 text-[#E8C868] font-bold text-xs">
                    10% DOWN
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2">
                  {language === 'ar' ? 'مقدم 10% وتقسيط على 8 سنوات' : '10% Down Payment • 8 Years'}
                </h3>

                <p className="text-xs text-slate-300 font-light mb-6 leading-relaxed">
                  {language === 'ar'
                    ? 'سداد 10% مقدم تعاقد وتقسيط المبلغ المتبقي على أقساط مريحة حتى 8 سنوات.'
                    : '10% Initial Down Payment with the remaining balance spread over 8 years.'}
                </p>
              </div>

              <button
                className={`w-full py-3 rounded-xl text-xs font-bold transition-all ${
                  selectedPaymentPlan === '8y'
                    ? 'bg-[#D4AF37] text-slate-950'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                {selectedPaymentPlan === '8y' ? (language === 'ar' ? 'الخطة المحددة حالياً' : 'Selected Plan') : (language === 'ar' ? 'اختيار هذه الخطة' : 'Select Plan')}
              </button>
            </div>

            {/* Plan 2: 15% Down / 9 Years */}
            <div
              onClick={() => handlePlanSwitch('9y')}
              className={`cursor-pointer rounded-3xl p-8 border-2 transition-all relative flex flex-col justify-between ${
                selectedPaymentPlan === '9y'
                  ? 'bg-[#082738] border-[#D4AF37] shadow-2xl shadow-[#D4AF37]/15 scale-[1.02]'
                  : 'bg-[#041520] border-cyan-500/20 hover:border-cyan-400/40'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono tabular-nums font-bold text-cyan-300">
                    {language === 'ar' ? 'الخيار الثاني' : 'OPTION 2'}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 font-bold text-xs">
                    15% DOWN
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2">
                  {language === 'ar' ? 'مقدم 15% وتقسيط على 9 سنوات' : '15% Down Payment • 9 Years'}
                </h3>

                <p className="text-xs text-slate-300 font-light mb-6 leading-relaxed">
                  {language === 'ar'
                    ? 'سداد 15% مقدم تعاقد وتقسيط المبلغ المتبقي على أطول فترة سداد ممتدة حتى 9 سنوات.'
                    : '15% Initial Down Payment with the remaining balance spread over 9 years.'}
                </p>
              </div>

              <button
                className={`w-full py-3 rounded-xl text-xs font-bold transition-all ${
                  selectedPaymentPlan === '9y'
                    ? 'bg-[#D4AF37] text-slate-950'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                {selectedPaymentPlan === '9y' ? (language === 'ar' ? 'الخطة المحددة حالياً' : 'Selected Plan') : (language === 'ar' ? 'اختيار هذه الخطة' : 'Select Plan')}
              </button>
            </div>

          </div>
        </section>

        {/* 6. LEAD CAPTURE & WHATSAPP FORM */}
        <section ref={formRef} id="enquiry" className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="bg-[#051C2A] rounded-3xl p-8 sm:p-12 border-2 border-cyan-500/30 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="text-center max-w-2xl mx-auto mb-8">
              <span className="px-3.5 py-1 rounded-full bg-[#D4AF37]/20 text-[#E8C868] border border-[#D4AF37]/40 text-xs font-bold uppercase tracking-wider inline-block mb-3">
                {language === 'ar' ? 'مكتب الاستفسار والحجز الرسمي' : 'OFFICIAL INQUIRY DESK'}
              </span>
              <h2 className="text-3xl font-serif font-bold text-white mb-2">
                {language === 'ar' ? 'طلب تفاصيل مشروع MIRAI Complex' : 'Request MIRAI Complex Details'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                {language === 'ar'
                  ? 'سيتواصل معك مستشار الاستثمار العقاري فوراً عبر واتساب لتزويدك بكافة المخططات والأسعار المعتمدة.'
                  : 'A Capital Pioneers advisor will connect with you directly via WhatsApp to provide verified floor plans & payment schedules.'}
              </p>
            </div>

            {formSubmitted ? (
              <div className="text-center p-8 bg-[#02131D] rounded-2xl border border-cyan-500/30 animate-fade-in">
                <div className="w-14 h-14 bg-cyan-500/20 text-cyan-300 rounded-full flex items-center justify-center mx-auto mb-4 border border-cyan-400/40">
                  <Check className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {language === 'ar' ? 'تم استلام طلبك بنجاح' : 'Inquiry Submitted Successfully'}
                </h3>
                <p className="text-sm text-slate-300 mb-6 max-w-md mx-auto">
                  {language === 'ar'
                    ? 'شكراً لاهتمامك بمشروع MIRAI Complex. يمكنك متابعة الاستفسار الفوري مع مستشارك عبر واتساب الآن.'
                    : 'Thank you for your interest in MIRAI Complex. You can continue your instant conversation on WhatsApp now.'}
                </p>

                {whatsappHandoffUrl && (
                  <a
                    href={whatsappHandoffUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackClickWhatsApp('mirai_form_success', 'MIRAI-COMPLEX')}
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm shadow-xl transition-all"
                  >
                    <MessageCircle className="w-5 h-5 fill-current" />
                    <span>{language === 'ar' ? 'متابعة عبر واتساب الآن' : 'Continue on WhatsApp Now'}</span>
                  </a>
                )}
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4 max-w-lg mx-auto">
                
                {/* Pre-Selected Unit Summary Badge */}
                <div className="bg-[#02131D] p-3.5 rounded-xl border border-cyan-500/20 text-xs text-cyan-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <span className="text-slate-400 block text-[11px]">{language === 'ar' ? 'الفئة المحددة:' : 'Selected Category:'}</span>
                    <span className="font-bold text-white">
                      MIRAI — {activeCategory === 'residences' ? '56 m² Branded Residence (Gravity Hotels)' : activeCategory === 'offices-clinics' ? `${selectedOfficeArea} m² Office/Clinic (Finished + AC)` : 'Ground Floor Retail & F&B'}
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-[#D4AF37]/20 text-[#E8C868] font-mono tabular-nums font-bold self-start sm:self-center">
                    {selectedPaymentPlan === '8y' ? '10% / 8Y' : '15% / 9Y'}
                  </span>
                </div>

                <div>
                  <label className="block text-xs text-slate-300 font-medium mb-1.5">
                    {language === 'ar' ? 'الاسم بالكامل *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={language === 'ar' ? 'أدخل اسمك الكريم' : 'Enter your full name'}
                    className="w-full px-4 py-3 rounded-xl bg-[#02121B] border border-cyan-500/20 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-300 font-medium mb-1.5">
                    {language === 'ar' ? 'رقم الهاتف (مع كود الدولة / واتساب) *' : 'Phone Number (with country code / WhatsApp) *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+20 1xx xxx xxxx"
                    className="w-full px-4 py-3 rounded-xl bg-[#02121B] border border-cyan-500/20 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-300 font-medium mb-1.5">
                    {language === 'ar' ? 'ملاحظات أو استفسار محدد' : 'Additional Notes / Inquiries'}
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={language === 'ar' ? 'هل تود الاستفسار عن تفاصيل معينة؟' : 'Any specific requirements or questions?'}
                    className="w-full px-4 py-3 rounded-xl bg-[#02121B] border border-cyan-500/20 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition-all resize-none"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B89628] hover:from-[#E8C868] hover:to-[#D4AF37] disabled:opacity-50 text-slate-950 font-bold text-sm shadow-lg shadow-[#D4AF37]/20 transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span>{language === 'ar' ? 'جاري الإرسال...' : 'Submitting...'}</span>
                    ) : (
                      <>
                        <span>{language === 'ar' ? 'طلب التفاصيل والأسعار' : 'REQUEST DETAILS'}</span>
                        <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                      </>
                    )}
                  </button>

                  <a
                    href={getWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackClickWhatsApp('mirai_form_direct', 'MIRAI-COMPLEX')}
                    className="py-3.5 px-6 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 shrink-0"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>{language === 'ar' ? 'استفسار عبر واتساب' : 'WhatsApp'}</span>
                  </a>
                </div>
              </form>
            )}
          </div>
        </section>

      </div>
    </>
  );
};
