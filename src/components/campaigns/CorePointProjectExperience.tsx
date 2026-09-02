import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  MessageCircle, 
  Check,
  ShieldCheck,
  ArrowRight,
  Building2,
  DollarSign,
  Layers,
  Play,
  ShoppingBag,
  Stethoscope,
  Activity,
  Pill,
  Microscope,
  Scan,
  HeartPulse,
  Car,
  DoorOpen,
  Train,
  CheckCircle,
  Sparkles,
  Eye,
  Calculator,
  Sliders
} from 'lucide-react';
import { Project } from '@/types/project';
import { SEO } from '@/components/common/SEO';
import { submitLead } from '@/services/leadService';
import { LeadFormData } from '@/types/lead';
import { useLanguage } from '@/context/LanguageContext';
import { getLocalizedProject } from '@/i18n/projectTranslations';
import { 
  trackClickWhatsApp, 
  trackEvent 
} from '@/services/analyticsService';

interface CorePointProjectExperienceProps {
  project: Project;
  onRequestViewing?: (projectName?: string) => void;
}

export const CorePointProjectExperience: React.FC<CorePointProjectExperienceProps> = ({
  project: rawProject,
}) => {
  const { language, isRTL } = useLanguage();
  const project = getLocalizedProject(rawProject, language);

  // Form State
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [interestedIn, setInterestedIn] = useState<
    | 'Dental / Implantology Center'
    | 'Ophthalmology Center'
    | 'Medical Analysis Laboratory'
    | 'Radiology Center'
    | 'Aesthetic / Dermatology Center'
    | 'Medical Clinic (From 4M)'
    | 'Commercial Retail'
    | 'Project Details'
  >('Dental / Implantology Center');
  const [preferredBudget, setPreferredBudget] = useState('10% Down Payment (Up to 6 Years)');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [whatsappHandoffUrl, setWhatsappHandoffUrl] = useState('');

  // Interactive Calculator State
  const [calcCategory, setCalcCategory] = useState<'dental' | 'lab' | 'radiology' | 'aesthetic'>('dental');
  const [calcArea, setCalcArea] = useState<number>(300);

  const formRef = useRef<HTMLDivElement | null>(null);
  const medicalComplexRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Asset paths
  const videoSrc = '/videos/projects/core-point/core-point-medical-complex.mp4';
  const videoPoster = '/images/projects/core-point/core-point-video-poster.jpg';

  // Synchronize minimum calculator area when category changes
  useEffect(() => {
    if (calcCategory === 'dental') {
      if (calcArea < 300) setCalcArea(300);
    } else if (calcCategory === 'lab') {
      if (calcArea < 85) setCalcArea(85);
    } else if (calcCategory === 'radiology') {
      if (calcArea < 500) setCalcArea(500);
    } else if (calcCategory === 'aesthetic') {
      if (calcArea < 300) setCalcArea(300);
    }
  }, [calcCategory]);

  // Dynamic Price Calculation
  const calculateEstimate = () => {
    if (calcCategory === 'dental') {
      const rate = 230000;
      const total = calcArea * rate;
      const dp10 = total * 0.10;
      return { total, dp10, rate, isPriceOnRequest: false, isStarting: false, minArea: 300 };
    }
    if (calcCategory === 'lab') {
      const rate = 240000;
      const total = calcArea * rate;
      const dp10 = total * 0.10;
      return { total, dp10, rate, isPriceOnRequest: false, isStarting: false, minArea: 85 };
    }
    if (calcCategory === 'radiology') {
      const rate = 300000;
      const total = calcArea * rate;
      const dp10 = total * 0.10;
      return { total, dp10, rate, isPriceOnRequest: false, isStarting: true, minArea: 500, maxRefArea: 700 };
    }
    return { total: 0, dp10: 0, rate: 0, isPriceOnRequest: true, isStarting: false, minArea: 300 };
  };

  const estimate = calculateEstimate();

  // Analytics on Mount
  useEffect(() => {
    trackEvent('core_point_project_view', {
      project_id: 'core-point',
      project_name: 'CORE POINT',
      category: 'Medical',
      location: 'New Cairo — Beside Air Force Specialized Hospital',
    });
    trackEvent('medical_project_view', {
      project_name: 'CORE POINT',
      location: 'New Cairo',
    });
  }, []);

  // WhatsApp Message Generator
  const getWhatsAppUrl = () => {
    const phone = '201000000000';
    let text = '';

    if (language === 'ar') {
      text = 'مرحباً Capital Pioneers، أود الاستفسار عن المجمع الطبي المتخصص ومشروع CORE POINT بجوار مستشفى الجوي التخصصي في القاهرة الجديدة (مراكز الأسنان، العيون، معامل التحاليل، مراكز الأشعة، التجميل، والعيادات). يرجى تزويدي بالوحدات المتاحة والأسعار الرسمية ونظام التقسيط حتى 6 سنوات.';
    } else if (language === 'de') {
      text = 'Hallo Capital Pioneers, ich interessiere mich für das spezialisierte medizinische Zentrum CORE POINT neben dem Air Force Specialized Hospital in New Cairo (Zahnkliniken, Labore, Radiologie, Ästhetik und Praxen). Bitte senden Sie mir Verfügbarkeiten und Ratenpläne.';
    } else {
      text = 'Hello Capital Pioneers, I am inquiring about the specialized medical complex at CORE POINT beside Air Force Specialized Hospital in New Cairo (Dental & Implantology, Ophthalmology, Medical Labs, Radiology, Aesthetic Centers, and Clinics). Please send me current availability and pricing details.';
    }

    return 'https://wa.me/' + phone + '?text=' + encodeURIComponent(text);
  };

  // Lead Form Submission
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phoneNumber.trim()) return;

    setIsSubmitting(true);
    try {
      const leadData: LeadFormData = {
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        propertyType: 'Medical' as any,
        purpose: 'Investment',
        budget: preferredBudget,
        preferredContactMethod: 'WhatsApp',
        interestedProject: 'CORE POINT - ' + interestedIn,
        message: 'Project: CORE POINT (New Cairo Medical Complex beside Air Force Hospital) | Selected Category: ' + interestedIn + ' | Payment Plan: ' + preferredBudget + ' | Calculated Area Reference: ' + calcArea + ' m² | Notes: ' + notes.trim(),
      };

      await submitLead(leadData);

      trackEvent('core_point_lead_submit', {
        full_name: fullName.trim(),
        phone: phoneNumber.trim(),
        interest: interestedIn,
        budget: preferredBudget,
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
        title="CORE POINT Medical Complex New Cairo | Capital Pioneers"
        description="Explore specialized medical spaces at Core Point New Cairo, including dental, ophthalmology, medical laboratories, radiology and aesthetic centers, with areas from 85 sqm and payment plans up to 6 years."
        canonicalPath="/projects/core-point"
        ogImage={videoPoster}
      />

      <div className={'min-h-screen bg-[#030F17] text-slate-100 selection:bg-[#0B4D68] selection:text-white ' + (isRTL ? 'rtl' : 'ltr')}>

        {/* 1. HERO SECTION — SPECIALIZED MEDICAL DESTINATION */}
        <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-[#020B11] via-[#051A26] to-[#030F17]">
          
          {/* Subtle Ambient Background Grids & Medical Glows */}
          <div className="absolute inset-0 z-0 opacity-25 bg-[radial-gradient(#00E5FF_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

          <div className="relative z-10 max-w-5xl mx-auto w-full flex flex-col items-center text-center">
            
            {/* Eyebrow Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-6">
              <span className="px-4 py-1.5 rounded-full bg-[#0A2638] text-cyan-300 border border-cyan-500/30 text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-md">
                <Stethoscope className="w-3.5 h-3.5 text-cyan-400" />
                <span>{language === 'ar' ? 'القاهرة الجديدة • مجمع طبي متخصص' : 'NEW CAIRO • SPECIALIZED MEDICAL COMPLEX'}</span>
              </span>

              <span className="px-4 py-1.5 rounded-full bg-[#0B4D68]/60 text-white border border-cyan-400/40 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                <Building2 className="w-3.5 h-3.5 text-cyan-300" />
                <span>CORE POINT</span>
              </span>
            </div>

            {/* Main H1 Title */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-white tracking-tight leading-[1.15] mb-3 max-w-4xl">
              {language === 'ar' 
                ? 'مجمع طبي متخصص في قلب القاهرة الجديدة'
                : 'Specialized Medical Complex in New Cairo'}
            </h1>

            {/* Supporting Headline (Landmark) */}
            <p className="text-lg sm:text-2xl text-[#E8C868] font-medium tracking-wide mb-2 flex items-center justify-center gap-2">
              <MapPin className="w-5 h-5 text-[#D4AF37] shrink-0" />
              <span>
                {language === 'ar' ? 'بجوار مستشفى الجوي التخصصي مباشرة' : 'Directly Beside Air Force Specialized Hospital'}
              </span>
            </p>

            {/* Secondary Location Line (Monorail) */}
            <p className="text-sm sm:text-base text-cyan-300/90 font-light mb-6 flex items-center justify-center gap-1.5">
              <Train className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>
                {language === 'ar' ? 'وخطوات من محطة مونوريل الجوي' : 'Steps from Air Force Monorail Station'}
              </span>
            </p>

            {/* Commercial Hook Banner */}
            <div className="px-6 py-3 rounded-2xl bg-[#072436]/90 border-2 border-cyan-400/40 backdrop-blur-md mb-8 max-w-xl w-full shadow-2xl">
              <span className="text-xs text-slate-300 block uppercase font-mono tabular-nums mb-0.5">
                {language === 'ar' ? 'مساحات طبية متخصصة تبدأ من' : 'SPECIALIZED MEDICAL SPACES FROM'}
              </span>
              <span className="text-2xl sm:text-4xl font-serif font-bold text-white font-mono tabular-nums tracking-tight text-glow">
                85 m² — 700 m²
              </span>
            </div>

            {/* Commercial Badges Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl w-full mb-10 text-xs">
              <div className="bg-[#051D2C] border border-cyan-500/20 p-3.5 rounded-2xl text-center">
                <span className="text-slate-400 block text-[11px] font-mono tabular-nums mb-1">{language === 'ar' ? 'مقدم التعاقد' : 'DOWN PAYMENT'}</span>
                <span className="text-base font-bold text-cyan-300 font-serif">10% STARTING</span>
              </div>
              <div className="bg-[#051D2C] border border-cyan-500/20 p-3.5 rounded-2xl text-center">
                <span className="text-slate-400 block text-[11px] font-mono tabular-nums mb-1">{language === 'ar' ? 'مدة التقسيط' : 'INSTALLMENTS'}</span>
                <span className="text-base font-bold text-emerald-400 font-serif">UP TO 6 YEARS</span>
              </div>
              <div className="bg-[#051D2C] border border-cyan-500/20 p-3.5 rounded-2xl text-center">
                <span className="text-slate-400 block text-[11px] font-mono tabular-nums mb-1">{language === 'ar' ? 'الترخيص' : 'LICENSING'}</span>
                <span className="text-base font-bold text-[#E8C868] font-serif">HOSPITAL LICENSE</span>
              </div>
              <div className="bg-[#051D2C] border border-cyan-500/20 p-3.5 rounded-2xl text-center">
                <span className="text-slate-400 block text-[11px] font-mono tabular-nums mb-1">{language === 'ar' ? 'الجراج' : 'PARKING'}</span>
                <span className="text-base font-bold text-white font-serif">7,350 m² GARAGE</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full max-w-md">
              <button
                onClick={() => {
                  trackEvent('core_point_nav', { action: 'explore_complex' });
                  medicalComplexRef.current?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-7 py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-bold text-xs sm:text-sm shadow-xl shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
              >
                <span>{language === 'ar' ? 'استعراض المجمع الطبي' : 'EXPLORE MEDICAL COMPLEX'}</span>
              </button>

              <button
                onClick={() => {
                  trackEvent('core_point_nav', { action: 'request_details' });
                  formRef.current?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-7 py-4 rounded-xl bg-[#092B3E] hover:bg-[#0d3b54] border border-cyan-400/40 text-cyan-200 font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>{language === 'ar' ? 'طلب التفاصيل والأسعار' : 'REQUEST DETAILS'}</span>
                <ArrowRight className={'w-4 h-4 ' + (isRTL ? 'rotate-180' : '')} />
              </button>

              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  trackEvent('core_point_whatsapp_click', { project: 'core-point' });
                  trackClickWhatsApp('core_point_hero', 'CORE-POINT');
                }}
                className="w-full sm:w-auto px-7 py-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm shadow-lg shadow-[#25D366]/20 transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>{language === 'ar' ? 'تحدث مع مستشار' : 'WHATSAPP ADVISOR'}</span>
              </a>
            </div>

          </div>
        </section>

        {/* 2. SPECIALIZED MEDICAL COMPLEX SECTION (المجمع الطبي المتخصص) */}
        <section ref={medicalComplexRef} id="medical-complex" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-cyan-500/20">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-widest mb-2">
              <Sparkles className="w-4 h-4" />
              <span>{language === 'ar' ? 'المجمع الطبي المتخصص' : 'SPECIALIZED MEDICAL COMPLEX'}</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white mb-3">
              {language === 'ar' ? 'أنشطة ومراكز المجمع الطبي المتخصص' : 'Specialized Medical Center Categories'}
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {language === 'ar'
                ? 'يقدم CORE POINT مجمعًا طبيًا متخصصًا يضم مراكز الأسنان والزراعات، ومراكز العيون، ومعامل التحاليل، ومراكز الأشعة، بالإضافة إلى مراكز الجلدية والتجميل وزراعة الشعر.'
                : 'CORE POINT includes a specialized medical complex engineered for high-demand healthcare sectors with dedicated operational spaces.'}
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            
            {/* 1. DENTAL & IMPLANTOLOGY */}
            <div className="bg-[#051D2C] rounded-3xl p-6 border-2 border-cyan-500/30 hover:border-cyan-400 transition-all shadow-xl flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-400/30 flex items-center justify-center text-cyan-300 mb-4">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-serif font-bold text-white mb-1">
                  {language === 'ar' ? 'مراكز الأسنان والزراعات' : 'Dental & Implantology'}
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  {language === 'ar' ? 'معامل ومراكز متخصصة في طب وجراحة وزراعة الأسنان' : 'Dental laboratories and implantology surgeries'}
                </p>
                <div className="space-y-2 text-xs mb-6">
                  <div className="flex justify-between p-2.5 rounded-xl bg-[#031522] border border-cyan-500/15">
                    <span className="text-slate-400">{language === 'ar' ? 'المساحات' : 'Min Area'}</span>
                    <span className="font-bold text-cyan-300 font-mono tabular-nums">300 m²+</span>
                  </div>
                  <div className="flex justify-between p-2.5 rounded-xl bg-[#031522] border border-cyan-500/15">
                    <span className="text-slate-400">{language === 'ar' ? 'سعر المتر' : 'Price / m²'}</span>
                    <span className="font-bold text-[#E8C868] font-mono tabular-nums">EGP 230,000</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setCalcCategory('dental');
                  setCalcArea(300);
                  setInterestedIn('Dental / Implantology Center');
                  formRef.current?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full py-2.5 rounded-xl bg-[#08293D] hover:bg-[#0c3954] border border-cyan-400/30 text-cyan-200 text-xs font-bold transition-all"
              >
                {language === 'ar' ? 'طلب توفر مركز أسنان' : 'Inquire for Dental Center'}
              </button>
            </div>

            {/* 2. OPHTHALMOLOGY */}
            <div className="bg-[#051D2C] rounded-3xl p-6 border-2 border-cyan-500/30 hover:border-cyan-400 transition-all shadow-xl flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-400/30 flex items-center justify-center text-cyan-300 mb-4">
                  <Eye className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-serif font-bold text-white mb-1">
                  {language === 'ar' ? 'مراكز العيون' : 'Ophthalmology Centers'}
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  {language === 'ar' ? 'أجنحة متكاملة لطب وجراحة العيون والليزك' : 'Comprehensive eye care and surgical suites'}
                </p>
                <div className="space-y-2 text-xs mb-6">
                  <div className="flex justify-between p-2.5 rounded-xl bg-[#031522] border border-cyan-500/15">
                    <span className="text-slate-400">{language === 'ar' ? 'المساحات' : 'Min Area'}</span>
                    <span className="font-bold text-cyan-300 font-mono tabular-nums">300 m²+</span>
                  </div>
                  <div className="flex justify-between p-2.5 rounded-xl bg-[#031522] border border-cyan-500/15">
                    <span className="text-slate-400">{language === 'ar' ? 'سعر المتر' : 'Price / m²'}</span>
                    <span className="font-bold text-[#E8C868] font-mono tabular-nums">EGP 230,000</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setCalcCategory('dental');
                  setCalcArea(300);
                  setInterestedIn('Ophthalmology Center');
                  formRef.current?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full py-2.5 rounded-xl bg-[#08293D] hover:bg-[#0c3954] border border-cyan-400/30 text-cyan-200 text-xs font-bold transition-all"
              >
                {language === 'ar' ? 'طلب توفر مركز عيون' : 'Inquire for Eye Center'}
              </button>
            </div>

            {/* 3. MEDICAL ANALYSIS LABORATORIES */}
            <div className="bg-[#051D2C] rounded-3xl p-6 border-2 border-cyan-500/30 hover:border-cyan-400 transition-all shadow-xl flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-400/30 flex items-center justify-center text-cyan-300 mb-4">
                  <Microscope className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-serif font-bold text-white mb-1">
                  {language === 'ar' ? 'معامل التحاليل' : 'Medical Laboratories'}
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  {language === 'ar' ? 'معامل تحاليل وفحوصات إكلينيكية متطورة' : 'Clinical diagnostic and pathology laboratories'}
                </p>
                <div className="space-y-2 text-xs mb-6">
                  <div className="flex justify-between p-2.5 rounded-xl bg-[#031522] border border-cyan-500/15">
                    <span className="text-slate-400">{language === 'ar' ? 'المساحات' : 'Min Area'}</span>
                    <span className="font-bold text-cyan-300 font-mono tabular-nums">85 m²+</span>
                  </div>
                  <div className="flex justify-between p-2.5 rounded-xl bg-[#031522] border border-cyan-500/15">
                    <span className="text-slate-400">{language === 'ar' ? 'سعر المتر' : 'Price / m²'}</span>
                    <span className="font-bold text-[#E8C868] font-mono tabular-nums">EGP 240,000</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setCalcCategory('lab');
                  setCalcArea(85);
                  setInterestedIn('Medical Analysis Laboratory');
                  formRef.current?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full py-2.5 rounded-xl bg-[#08293D] hover:bg-[#0c3954] border border-cyan-400/30 text-cyan-200 text-xs font-bold transition-all"
              >
                {language === 'ar' ? 'طلب توفر معمل تحاليل' : 'Inquire for Medical Lab'}
              </button>
            </div>

            {/* 4. RADIOLOGY CENTER */}
            <div className="bg-[#051D2C] rounded-3xl p-6 border-2 border-[#D4AF37]/50 hover:border-[#D4AF37] transition-all shadow-xl flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#E8C868] mb-4">
                  <Scan className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-serif font-bold text-white mb-1">
                  {language === 'ar' ? 'مركز الأشعة التشخيصية' : 'Radiology Center'}
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  {language === 'ar' ? 'مركز أشعة متكامل بنطاق مساحات 500–700 م²' : 'Comprehensive diagnostic imaging center'}
                </p>
                <div className="space-y-2 text-xs mb-6">
                  <div className="flex justify-between p-2.5 rounded-xl bg-[#031522] border border-cyan-500/15">
                    <span className="text-slate-400">{language === 'ar' ? 'المساحات المرجعية' : 'Area Range'}</span>
                    <span className="font-bold text-[#E8C868] font-mono tabular-nums">500–700 m²</span>
                  </div>
                  <div className="flex justify-between p-2.5 rounded-xl bg-[#031522] border border-cyan-500/15">
                    <span className="text-slate-400">{language === 'ar' ? 'سعر المتر' : 'Starting Rate'}</span>
                    <span className="font-bold text-emerald-400 font-mono tabular-nums">FROM EGP 300,000</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setCalcCategory('radiology');
                  setCalcArea(500);
                  setInterestedIn('Radiology Center');
                  formRef.current?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full py-2.5 rounded-xl bg-[#08293D] hover:bg-[#0c3954] border border-[#D4AF37]/40 text-[#E8C868] text-xs font-bold transition-all"
              >
                {language === 'ar' ? 'طلب تفاصيل مركز الأشعة' : 'Inquire for Radiology Center'}
              </button>
            </div>

          </div>

          {/* Additional Medical Center Types: Dermatology, Hair Transplant, Aesthetic */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            
            {/* Dermatology */}
            <div className="p-6 rounded-2xl bg-[#041622] border border-cyan-500/20 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-cyan-300 block mb-1">
                  {language === 'ar' ? 'مراكز الجلدية والليزر' : 'DERMATOLOGY & LASER'}
                </span>
                <span className="text-sm font-bold text-white block">
                  {language === 'ar' ? 'مساحات تبدأ من 300 م²' : 'Areas from 300 m²+'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs px-3 py-1 rounded-full bg-cyan-950 text-slate-300 border border-cyan-500/30 font-semibold font-mono tabular-nums">
                  {language === 'ar' ? 'السعر عند الطلب' : 'PRICE ON REQUEST'}
                </span>
              </div>
            </div>

            {/* Hair Transplant */}
            <div className="p-6 rounded-2xl bg-[#041622] border border-cyan-500/20 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-cyan-300 block mb-1">
                  {language === 'ar' ? 'مراكز زراعة الشعر' : 'HAIR TRANSPLANT CENTERS'}
                </span>
                <span className="text-sm font-bold text-white block">
                  {language === 'ar' ? 'مساحات تبدأ من 300 م²' : 'Areas from 300 m²+'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs px-3 py-1 rounded-full bg-cyan-950 text-slate-300 border border-cyan-500/30 font-semibold font-mono tabular-nums">
                  {language === 'ar' ? 'السعر عند الطلب' : 'PRICE ON REQUEST'}
                </span>
              </div>
            </div>

            {/* Aesthetic Centers */}
            <div className="p-6 rounded-2xl bg-[#041622] border border-cyan-500/20 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-cyan-300 block mb-1">
                  {language === 'ar' ? 'مراكز التجميل' : 'AESTHETIC & COSMETIC'}
                </span>
                <span className="text-sm font-bold text-white block">
                  {language === 'ar' ? 'مساحات تبدأ من 300 م²' : 'Areas from 300 m²+'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs px-3 py-1 rounded-full bg-cyan-950 text-slate-300 border border-cyan-500/30 font-semibold font-mono tabular-nums">
                  {language === 'ar' ? 'السعر عند الطلب' : 'PRICE ON REQUEST'}
                </span>
              </div>
            </div>

          </div>

          {/* DYNAMIC MEDICAL AREA & INVESTMENT CALCULATOR */}
          <div className="bg-gradient-to-br from-[#062031] to-[#02131F] rounded-3xl p-8 sm:p-12 border-2 border-cyan-500/40 shadow-2xl max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
                <Calculator className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                  {language === 'ar' ? 'حاسبة استثمار المجمع الطبي التفاعلية' : 'Interactive Medical Investment Calculator'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400">
                  {language === 'ar' ? 'احسب القيمة الإجمالية ومقدم 10% ديناميكياً بحسب المساحة المطلوبة' : 'Estimate total valuation and 10% down payment dynamically based on selected area'}
                </p>
              </div>
            </div>

            {/* Category Selector */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
              <button
                type="button"
                onClick={() => setCalcCategory('dental')}
                className={'py-3 px-3 rounded-xl border text-xs font-bold transition-all ' + (
                  calcCategory === 'dental'
                    ? 'bg-cyan-950 border-cyan-400 text-white shadow-md'
                    : 'bg-[#031522] border-cyan-500/20 text-slate-400 hover:text-white'
                )}
              >
                {language === 'ar' ? 'أسنان وعيون (300م+)' : 'Dental & Eye (300m+)'}
              </button>

              <button
                type="button"
                onClick={() => setCalcCategory('lab')}
                className={'py-3 px-3 rounded-xl border text-xs font-bold transition-all ' + (
                  calcCategory === 'lab'
                    ? 'bg-cyan-950 border-cyan-400 text-white shadow-md'
                    : 'bg-[#031522] border-cyan-500/20 text-slate-400 hover:text-white'
                )}
              >
                {language === 'ar' ? 'معامل تحاليل (85م+)' : 'Medical Lab (85m+)'}
              </button>

              <button
                type="button"
                onClick={() => setCalcCategory('radiology')}
                className={'py-3 px-3 rounded-xl border text-xs font-bold transition-all ' + (
                  calcCategory === 'radiology'
                    ? 'bg-cyan-950 border-cyan-400 text-white shadow-md'
                    : 'bg-[#031522] border-cyan-500/20 text-slate-400 hover:text-white'
                )}
              >
                {language === 'ar' ? 'مركز أشعة (500–700م)' : 'Radiology (500-700m)'}
              </button>

              <button
                type="button"
                onClick={() => setCalcCategory('aesthetic')}
                className={'py-3 px-3 rounded-xl border text-xs font-bold transition-all ' + (
                  calcCategory === 'aesthetic'
                    ? 'bg-cyan-950 border-cyan-400 text-white shadow-md'
                    : 'bg-[#031522] border-cyan-500/20 text-slate-400 hover:text-white'
                )}
              >
                {language === 'ar' ? 'جلدية وتجميل (300م+)' : 'Aesthetic (300m+)'}
              </button>
            </div>

            {/* Area Slider & Input */}
            <div className="bg-[#031522] rounded-2xl p-6 border border-cyan-500/20 mb-6">
              <div className="flex justify-between items-center mb-3">
                <label className="text-xs font-bold text-slate-300 uppercase font-mono tabular-nums flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  <span>{language === 'ar' ? 'المساحة المطلوبة (م²)' : 'Select Target Area (sqm)'}</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={estimate.minArea}
                    max={1000}
                    value={calcArea}
                    onChange={(e) => setCalcArea(Math.max(estimate.minArea, Number(e.target.value) || estimate.minArea))}
                    className="w-24 px-3 py-1.5 rounded-lg bg-[#051D2C] border border-cyan-400 text-right font-bold text-white font-mono tabular-nums text-sm focus:outline-none"
                  />
                  <span className="text-xs text-slate-400">m²</span>
                </div>
              </div>

              <input
                type="range"
                min={estimate.minArea}
                max={calcCategory === 'lab' ? 300 : calcCategory === 'radiology' ? 700 : 600}
                step={5}
                value={calcArea}
                onChange={(e) => setCalcArea(Number(e.target.value))}
                className="w-full h-2 bg-[#051D2C] rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono tabular-nums mt-1">
                <span>{estimate.minArea} m² (Min)</span>
                <span>{calcCategory === 'radiology' ? '700 m² (Typical Max)' : '600 m²'}</span>
              </div>
            </div>

            {/* Output Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-2xl bg-[#031522] border border-cyan-500/20">
                <span className="text-xs text-slate-400 uppercase font-mono tabular-nums block mb-1">
                  {language === 'ar' ? 'سعر المتر' : 'PRICE PER SQM'}
                </span>
                <span className="text-lg font-bold text-cyan-300 font-mono tabular-nums">
                  {estimate.isPriceOnRequest ? (language === 'ar' ? 'عند الطلب' : 'ON REQUEST') : 'EGP ' + estimate.rate.toLocaleString()}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#031522] border border-cyan-500/20">
                <span className="text-xs text-slate-400 uppercase font-mono tabular-nums block mb-1">
                  {language === 'ar' ? 'إجمالي السعر التقديري' : 'ESTIMATED TOTAL'}
                </span>
                <span className="text-lg font-bold text-[#E8C868] font-mono tabular-nums">
                  {estimate.isPriceOnRequest ? (language === 'ar' ? 'عند الطلب' : 'ON REQUEST') : (estimate.isStarting ? 'From ' : '') + 'EGP ' + estimate.total.toLocaleString()}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#031522] border border-[#D4AF37]/30">
                <span className="text-xs text-slate-400 uppercase font-mono tabular-nums block mb-1">
                  {language === 'ar' ? 'مقدم 10% يبدأ من' : '10% DOWN PAYMENT'}
                </span>
                <span className="text-lg font-bold text-emerald-400 font-mono tabular-nums">
                  {estimate.isPriceOnRequest ? (language === 'ar' ? 'عند الطلب' : 'ON REQUEST') : 'EGP ' + estimate.dp10.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="text-center mt-6">
              <button
                onClick={() => {
                  formRef.current?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg transition-all inline-flex items-center gap-2"
              >
                <span>{language === 'ar' ? 'طلب عرض مالي رسمي لهذه المساحة' : 'REQUEST OFFICIAL PROPOSAL FOR THIS AREA'}</span>
                <ArrowRight className={'w-4 h-4 ' + (isRTL ? 'rotate-180' : '')} />
              </button>
            </div>
          </div>
        </section>

        {/* 3. NATIVE VIDEO SECTION (CORE POINT Medical Complex) */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-cyan-500/20">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-widest mb-2">
              <Play className="w-4 h-4 fill-current" />
              <span>{language === 'ar' ? 'فيديو المشروع' : 'OFFICIAL PROJECT VIDEO'}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white mb-2">
              {language === 'ar' ? 'فيديو المجمع الطبي – CORE POINT' : 'CORE POINT Medical Complex Video'}
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm">
              {language === 'ar'
                ? 'استعرض لقطات المشروع والمجمع الطبي بجوار مستشفى الجوي التخصصي بالقاهرة الجديدة.'
                : 'Watch official footage of CORE POINT specialized medical destination in New Cairo.'}
            </p>
          </div>

          <div className="relative rounded-3xl overflow-hidden border-2 border-cyan-500/40 shadow-2xl bg-[#000] max-w-2xl mx-auto aspect-[9/16] max-h-[750px]">
            <video
              ref={videoRef}
              controls
              playsInline
              preload="metadata"
              poster={videoPoster}
              className="w-full h-full object-cover rounded-3xl"
              onPlay={() => setIsVideoPlaying(true)}
              onPause={() => setIsVideoPlaying(false)}
            >
              <source src={videoSrc} type="video/mp4" />
              {language === 'ar' ? 'متصفحك لا يدعم تشغيل الفيديو.' : 'Your browser does not support the video tag.'}
            </video>
          </div>
        </section>

        {/* 4. INTEGRATED CLINICAL INFRASTRUCTURE */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-cyan-500/15">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-widest mb-2">
              <Activity className="w-4 h-4" />
              <span>{language === 'ar' ? 'بيئة صحية متكاملة' : 'BUILT AROUND HEALTHCARE'}</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white mb-3">
              {language === 'ar' ? 'بنية تحتية طبية متكاملة' : 'Integrated Medical Infrastructure'}
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              {language === 'ar'
                ? 'تجهيزات طبية ومرافق رعاية متخصصة تضمن أعلى معايير التشغيل للكوادر الطبية والمستثمرين.'
                : 'Engineered with specialized clinical, diagnostic, and logistical medical infrastructure.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            
            {/* Group 1: Clinical Infrastructure */}
            <div className="bg-[#051C2B] rounded-3xl p-7 border-2 border-cyan-500/30 flex flex-col justify-between shadow-xl">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 text-xs font-bold font-mono tabular-nums mb-4">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>CLINICAL INFRASTRUCTURE</span>
                </div>
                <h3 className="text-xl font-serif font-bold text-white mb-4">
                  {language === 'ar' ? 'التجهيزات الإكلينيكية' : 'Clinical Facilities'}
                </h3>
                
                <div className="space-y-3 text-xs text-slate-300">
                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#031522] border border-cyan-500/15">
                    <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="font-medium text-white">{language === 'ar' ? 'غرف عمليات (Operating Rooms)' : 'Operating Rooms'}</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#031522] border border-cyan-500/15">
                    <HeartPulse className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="font-medium text-white">{language === 'ar' ? 'رعاية مركزة (Intensive Care)' : 'Intensive Care (ICU)'}</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#031522] border border-[#D4AF37]/40">
                    <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0" />
                    <span className="font-bold text-[#E8C868]">{language === 'ar' ? 'رخصة مستشفى (Hospital License)' : 'Hospital License'}</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#031522] border border-cyan-500/15">
                    <DoorOpen className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="font-medium text-white">{language === 'ar' ? 'مدخل طوارئ مخصص (Emergency Entrance)' : 'Dedicated Emergency Entrance'}</span>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 mt-6 pt-4 border-t border-cyan-500/15 leading-relaxed">
                {language === 'ar'
                  ? 'يتضمن المبنى مدخلاً مخصصاً للطوارئ ورخصة مستشفى متكاملة.'
                  : 'Hospital license and dedicated emergency entrance supporting inpatient and clinical care.'}
              </p>
            </div>

            {/* Group 2: Diagnostic Centers */}
            <div className="bg-[#051C2B] rounded-3xl p-7 border-2 border-cyan-500/30 flex flex-col justify-between shadow-xl">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 text-xs font-bold font-mono tabular-nums mb-4">
                  <Scan className="w-3.5 h-3.5" />
                  <span>DIAGNOSTIC CENTERS</span>
                </div>
                <h3 className="text-xl font-serif font-bold text-white mb-4">
                  {language === 'ar' ? 'المراكز التشخيصية' : 'Diagnostic Centers'}
                </h3>
                
                <div className="space-y-3 text-xs text-slate-300">
                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#031522] border border-cyan-500/15">
                    <Scan className="w-4 h-4 text-cyan-400 shrink-0" />
                    <div>
                      <span className="font-medium text-white block">{language === 'ar' ? 'مراكز أشعة (500–700 م²)' : 'Radiology (500–700 m²)'}</span>
                      <span className="text-[10px] text-slate-400">{language === 'ar' ? 'سعر المتر يبدأ من 300,000 ج.م' : 'Starting from EGP 300K/m²'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#031522] border border-cyan-500/15">
                    <Microscope className="w-4 h-4 text-cyan-400 shrink-0" />
                    <div>
                      <span className="font-medium text-white block">{language === 'ar' ? 'معامل تحاليل (من 85 م²)' : 'Laboratories (from 85 m²)'}</span>
                      <span className="text-[10px] text-slate-400">{language === 'ar' ? 'سعر المتر 240,000 ج.م' : 'EGP 240K/m²'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 mt-6 pt-4 border-t border-cyan-500/15 leading-relaxed">
                {language === 'ar'
                  ? 'تكامل تام بين العيادات ومراكز التشخيص لتوفير تجربة علاجية سلسة داخل نفس المبنى.'
                  : 'Diagnostic integration supporting medical practitioners and patient workflows.'}
              </p>
            </div>

            {/* Group 3: Supporting Services & Parking */}
            <div className="bg-[#051C2B] rounded-3xl p-7 border-2 border-cyan-500/30 flex flex-col justify-between shadow-xl">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 text-xs font-bold font-mono tabular-nums mb-4">
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>SUPPORTING SERVICES & PARKING</span>
                </div>
                <h3 className="text-xl font-serif font-bold text-white mb-4">
                  {language === 'ar' ? 'الخدمات المساندة والجراج' : 'Supporting Services'}
                </h3>
                
                <div className="space-y-3 text-xs text-slate-300">
                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#031522] border border-cyan-500/15">
                    <Pill className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="font-medium text-white">{language === 'ar' ? 'صيدلية (Pharmacy)' : 'Pharmacy'}</span>
                  </div>

                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#031522] border border-cyan-500/15">
                    <ShoppingBag className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="font-medium text-white">{language === 'ar' ? 'محلات تجارية (Commercial Retail)' : 'Commercial Retail'}</span>
                  </div>

                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#031522] border border-cyan-500/15">
                    <Car className="w-4 h-4 text-cyan-400 shrink-0" />
                    <div>
                      <span className="font-bold text-white block">7,350 m²</span>
                      <span className="text-[10px] text-slate-400">{language === 'ar' ? 'جراج تحت الأرض' : 'Underground Garage'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 mt-6 pt-4 border-t border-cyan-500/15 leading-relaxed">
                {language === 'ar'
                  ? 'مساحة جراج واسعة تحت الأرض بمساحة 7,350 م² تضمن انسيابية حركة السيارات وراحة المراجعين.'
                  : 'A 7,350 m² underground garage provides comfortable access and circulation.'}
              </p>
            </div>

          </div>
        </section>

        {/* 5. VERIFIED PAYMENT PLANS (10% & 5% Plans) */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-cyan-500/15">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 text-[#E8C868] text-xs font-semibold uppercase tracking-widest mb-2">
              <DollarSign className="w-4 h-4 text-[#D4AF37]" />
              <span>{language === 'ar' ? 'أنظمة السداد الرسمية' : 'VERIFIED PAYMENT STRUCTURES'}</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white mb-2">
              {language === 'ar' ? 'خطط سداد مرنة حتى 6 سنوات' : 'Flexible Payment Plans Up to 6 Years'}
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              {language === 'ar'
                ? 'مقدم يبدأ من 10%، مع إمكانية التقسيط حتى 6 سنوات واستلام خلال سنة ونصف فقط.'
                : 'Payment plans start from 10% down payment with installments up to 6 years and delivery in 1.5 years.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            
            {/* Plan 1: 10% Down Payment (Verified) */}
            <div className="bg-[#051C2B] rounded-3xl p-8 border-2 border-cyan-500/40 shadow-2xl relative overflow-hidden flex flex-col justify-between">
              <div>
                <span className="px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 text-xs font-bold font-mono tabular-nums inline-block mb-3">
                  {language === 'ar' ? 'الخطة القياسية للمجمع الطبي' : 'SPECIALIZED MEDICAL COMPLEX PLAN'}
                </span>
                <h3 className="text-2xl font-serif font-bold text-white mb-4">
                  {language === 'ar' ? 'مقدم 10% — تقسيط حتى 6 سنوات' : '10% Down Payment — Up to 6 Years'}
                </h3>
                <div className="grid grid-cols-2 gap-3 text-center mb-6">
                  <div className="p-4 rounded-2xl bg-[#031522] border border-cyan-500/20">
                    <span className="text-3xl font-serif font-bold text-cyan-300 block mb-1">10%</span>
                    <span className="text-xs text-slate-400 uppercase font-mono tabular-nums">{language === 'ar' ? 'مقدم يبدأ من' : 'STARTING DP'}</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#031522] border border-cyan-500/20">
                    <span className="text-3xl font-serif font-bold text-emerald-400 block mb-1">6 Years</span>
                    <span className="text-xs text-slate-400 uppercase font-mono tabular-nums">{language === 'ar' ? 'أقساط تصل إلى' : 'INSTALLMENTS'}</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-400">
                {language === 'ar' ? 'مقدم يبدأ من 10% • تقسيط يصل إلى 6 سنوات' : 'Starting down payment 10% • Installments up to 6 Years'}
              </p>
            </div>

            {/* Plan 2: 5% Down Payment (Clinics) */}
            <div className="bg-[#051C2B] rounded-3xl p-8 border-2 border-cyan-500/20 shadow-2xl relative overflow-hidden flex flex-col justify-between">
              <div>
                <span className="px-3 py-1 rounded-full bg-cyan-950 text-slate-300 text-xs font-bold font-mono tabular-nums inline-block mb-3">
                  {language === 'ar' ? 'خطة العيادات الطبية' : 'CLINIC OFFER PLAN'}
                </span>
                <h3 className="text-2xl font-serif font-bold text-white mb-4">
                  {language === 'ar' ? 'ابدأ بمقدم 5% — تقسيط حتى 6 سنوات' : 'Start with 5% — Up to 6 Years'}
                </h3>
                <div className="grid grid-cols-2 gap-3 text-center mb-6">
                  <div className="p-4 rounded-2xl bg-[#031522] border border-cyan-500/20">
                    <span className="text-3xl font-serif font-bold text-cyan-300 block mb-1">5%</span>
                    <span className="text-xs text-slate-400 uppercase font-mono tabular-nums">{language === 'ar' ? 'مقدم يبدأ من' : 'STARTING DP'}</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#031522] border border-cyan-500/20">
                    <span className="text-3xl font-serif font-bold text-[#E8C868] block mb-1">1.5 Years</span>
                    <span className="text-xs text-slate-400 uppercase font-mono tabular-nums">{language === 'ar' ? 'موعد الاستلام' : 'DELIVERY'}</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-400">
                {language === 'ar' ? 'مقدم يبدأ من 5% • تقسيط حتى 6 سنوات • الاستلام خلال سنة ونصف' : 'Starting down payment 5% • Installments up to 6 Years • Delivery in 1.5 Years'}
              </p>
            </div>

          </div>
        </section>

        {/* 6. LEAD FORM & WHATSAPP INTEGRATION */}
        <section ref={formRef} id="enquiry" className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="bg-[#051D2C] rounded-3xl p-8 sm:p-12 border-2 border-cyan-500/30 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="text-center max-w-2xl mx-auto mb-8">
              <span className="px-3.5 py-1 rounded-full bg-[#D4AF37]/20 text-[#E8C868] border border-[#D4AF37]/40 text-xs font-bold uppercase tracking-wider inline-block mb-3">
                {language === 'ar' ? 'مكتب الاستفسار والحجز الرسمي' : 'OFFICIAL INQUIRY DESK'}
              </span>
              <h2 className="text-3xl font-serif font-bold text-white mb-2">
                {language === 'ar' ? 'طلب تفاصيل وحجز مجمع CORE POINT' : 'Request CORE POINT Medical Details'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                {language === 'ar'
                  ? 'سيتواصل معك مستشار الاستثمار الطبي فوراً لتزويدك بكافة المخططات والتفاصيل المالية.'
                  : 'A Capital Pioneers healthcare property advisor will connect with you directly via WhatsApp.'}
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
                    ? 'شكراً لاهتمامك بمشروع CORE POINT. يمكنك متابعة الاستفسار الفوري مع مستشارك عبر واتساب الآن.'
                    : 'Thank you for your interest in CORE POINT. You can continue your instant conversation on WhatsApp now.'}
                </p>

                {whatsappHandoffUrl && (
                  <a
                    href={whatsappHandoffUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackClickWhatsApp('core_point_form_success', 'CORE-POINT')}
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm shadow-xl transition-all"
                  >
                    <MessageCircle className="w-5 h-5 fill-current" />
                    <span>{language === 'ar' ? 'متابعة عبر واتساب الآن' : 'Continue on WhatsApp Now'}</span>
                  </a>
                )}
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4 max-w-lg mx-auto">
                
                {/* Interest Selection */}
                <div>
                  <label className="block text-xs text-slate-300 font-medium mb-1.5">
                    {language === 'ar' ? 'النشاط / نوع الوحدة المستهدفة *' : 'Interested Medical Category *'}
                  </label>
                  <select
                    value={interestedIn}
                    onChange={(e) => setInterestedIn(e.target.value as any)}
                    className="w-full px-4 py-3 rounded-xl bg-[#02121B] border border-cyan-500/20 text-white text-sm focus:outline-none focus:border-cyan-400 transition-all"
                  >
                    <option value="Dental / Implantology Center">{language === 'ar' ? 'مراكز أسنان وزراعات (300م+)' : 'Dental / Implantology Center (300m+)'}</option>
                    <option value="Ophthalmology Center">{language === 'ar' ? 'مراكز عيون (300م+)' : 'Ophthalmology Center (300m+)'}</option>
                    <option value="Medical Analysis Laboratory">{language === 'ar' ? 'معامل تحاليل (85م+)' : 'Medical Analysis Laboratory (85m+)'}</option>
                    <option value="Radiology Center">{language === 'ar' ? 'مركز أشعة (500–700م)' : 'Radiology Center (500–700m)'}</option>
                    <option value="Aesthetic / Dermatology Center">{language === 'ar' ? 'مراكز جلدية وتجميل وزراعة شعر (300م+)' : 'Aesthetic / Dermatology / Hair Transplant (300m+)'}</option>
                    <option value="Medical Clinic (From 4M)">{language === 'ar' ? 'عيادة طبية (تبدأ من 4 مليون)' : 'Medical Clinic (From EGP 4M)'}</option>
                    <option value="Commercial Retail">{language === 'ar' ? 'محلات تجارية وصيدلية' : 'Commercial Retail & Pharmacy'}</option>
                    <option value="Project Details">{language === 'ar' ? 'استفسار عام عن المشروع' : 'General Project Details'}</option>
                  </select>
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
                    {language === 'ar' ? 'ملاحظات أو مساحة معينة مطلوبة' : 'Additional Notes / Target Area'}
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={language === 'ar' ? 'هل تود الاستفسار عن نشاط أو مساحة محددة؟' : 'Target area in sqm, specialized requirements, etc.'}
                    className="w-full px-4 py-3 rounded-xl bg-[#02121B] border border-cyan-500/20 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition-all resize-none"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span>{language === 'ar' ? 'جاري الإرسال...' : 'Submitting...'}</span>
                    ) : (
                      <>
                        <span>{language === 'ar' ? 'طلب تفاصيل المجمع الطبي' : 'REQUEST COMPLEX DETAILS'}</span>
                        <ArrowRight className={'w-4 h-4 ' + (isRTL ? 'rotate-180' : '')} />
                      </>
                    )}
                  </button>

                  <a
                    href={getWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackClickWhatsApp('core_point_form_direct', 'CORE-POINT')}
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
