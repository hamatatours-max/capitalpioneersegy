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
  KeyRound, 
  ArrowDown, 
  Flame, 
  Check 
} from 'lucide-react';
import { Project } from '@/types/project';
import { useLanguage } from '@/context/LanguageContext';
import { getLocalizedProject } from '@/i18n/projectTranslations';
import { submitLead } from '@/services/leadService';
import { LeadFormData } from '@/types/lead';
import { trackEvent, trackClickWhatsApp } from '@/services/analyticsService';
import { SEO } from '@/components/common/SEO';
import { generateRealEstateListingSchema, generateBreadcrumbSchema } from '@/utils/schemaGenerator';

interface DowntownOfferCampaignProps {
  project: Project;
  onRequestViewing?: (projectName?: string) => void;
}

export const DowntownOfferCampaign: React.FC<DowntownOfferCampaignProps> = ({ 
  project: rawProject, 
  onRequestViewing 
}) => {
  const { language, isRTL } = useLanguage();
  const project = getLocalizedProject(rawProject, language);
  
  // Media modal
  const [activeModalImage, setActiveModalImage] = useState<string | null>(null);

  // Form State
  const [selectedInterest, setSelectedInterest] = useState<'Downtown 1' | 'Downtown 2' | 'Either'>('Either');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [whatsappHandoffUrl, setWhatsappHandoffUrl] = useState<string | null>(null);

  // Form reference for smooth scrolling
  const formRef = useRef<HTMLDivElement | null>(null);

  // Real-time Countdown toward 30/8 deadline
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    // Fire media buying view event on mount
    trackEvent('downtown_offer_view', {
      project_name: 'DOWNTOWN 1 & DOWNTOWN 2',
      offer_type: '45% Cash Discount',
      discounted_price: '2.7M',
      original_price: '5M',
      location: 'New Administrative Capital',
    });
  }, []);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const currentYear = now.getFullYear();
      // Target is August 30th (month index 7 is August) at 23:59:59
      const targetDate = new Date(currentYear, 7, 30, 23, 59, 59);

      // If current date has passed 30/8 this year
      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
        });
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        setTimeLeft({
          days,
          hours,
          minutes,
          seconds,
          isExpired: false,
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  const scrollToForm = (interest?: 'Downtown 1' | 'Downtown 2' | 'Either') => {
    if (interest) {
      setSelectedInterest(interest);
      if (interest === 'Downtown 1') {
        trackEvent('downtown_dt1_interest', { placement: 'dt1_card' });
      } else if (interest === 'Downtown 2') {
        trackEvent('downtown_dt2_interest', { placement: 'dt2_card' });
      }
    }
    trackEvent('downtown_offer_request', { placement: 'cta_scroll' });
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const getWhatsAppUrl = (customInterest?: string) => {
    const interestText = customInterest || selectedInterest;
    const msg = language === 'ar'
      ? `مرحباً Capital Pioneers، أود الاستفسار عن عرض مكاتب داون تاون الاستلام الفوري بالعاصمة الإدارية (خصم 45% كاش - 2.7 مليون جنيه) — مهتم بـ: ${interestText}.`
      : language === 'de'
      ? `Hallo Capital Pioneers, ich interessiere mich für das 45% Barzahlungs-Büroangebot in Downtown 1 & 2 (2,7 Mio. EGP) — Interesse: ${interestText}.`
      : `Hello Capital Pioneers, I am inquiring about the limited Ready-to-Move Office Offer in Downtown 1 & 2 (EGP 2.7M - 45% Cash Discount) — Interested in: ${interestText}.`;
    return `https://wa.me/201066330570?text=${encodeURIComponent(msg)}`;
  };

  const handleWhatsAppClick = (source: string, customInterest?: string) => {
    trackClickWhatsApp(source, 'Downtown 1 & Downtown 2');
    trackEvent('downtown_whatsapp_click', {
      placement_source: source,
      selected_interest: customInterest || selectedInterest,
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phoneNumber.trim()) return;

    setIsSubmitting(true);
    const leadData: LeadFormData = {
      fullName: fullName.trim(),
      phoneNumber: phoneNumber.trim(),
      interestedProject: `Downtown 1 & 2 Offer (${selectedInterest})`,
      propertyType: 'Office',
      purpose: 'Investment',
      budget: 'EGP 2,700,000 (45% Cash Offer)',
      preferredContactMethod: 'WhatsApp',
      message: `Downtown Limited Offer (45% Cash Discount - EGP 2.7M). Choice: ${selectedInterest}. Notes: ${notes.trim() || 'No additional notes'}`,
    };

    try {
      const response = await submitLead(leadData);
      trackEvent('downtown_lead_submit', {
        interested_project: `Downtown 1 & 2 (${selectedInterest})`,
        offer_price: '2.7M',
        discount: '45%',
      });

      setFormSubmitted(true);
      if (response.whatsappDirectUrl) {
        setWhatsappHandoffUrl(response.whatsappDirectUrl);
      } else {
        setWhatsappHandoffUrl(getWhatsAppUrl(selectedInterest));
      }
    } catch (err) {
      console.error('Downtown Lead submit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // SEO Schemas
  const breadcrumbsSchema = generateBreadcrumbSchema([
    { name: language === 'ar' ? 'الرئيسية' : 'Home', item: '/' },
    { name: language === 'ar' ? 'المشاريع' : 'Projects', item: '/projects' },
    { name: project.name, item: `/projects/${project.slug}` },
  ]);

  const realEstateSchema = generateRealEstateListingSchema(project);

  return (
    <div className="min-h-screen bg-[#07161F] text-slate-100 selection:bg-[#C5A880] selection:text-[#061D28] font-sans pb-20 lg:pb-0">
      {/* Technical SEO */}
      <SEO
        title="Downtown 1 & 2 Offices | Ready to Move Offer | Capital Pioneers"
        description="Explore ready-to-move, fully finished administrative offices in Downtown 1 and Downtown 2 at Egypt's New Administrative Capital, with a limited 45% cash offer."
        canonicalPath={`/projects/${project.slug}`}
        schema={[breadcrumbsSchema, realEstateSchema]}
      />

      {/* 1. TOP URGENCY COUNTDOWN BAR */}
      <aside aria-label="Urgency Countdown" className="bg-gradient-to-r from-[#061D28] via-[#0D384C] to-[#061D28] border-b border-[#C5A880]/30 py-2.5 px-4 text-center sticky top-0 z-30 shadow-md">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-red-600 text-white font-semibold text-[10px] tracking-wider uppercase animate-pulse flex items-center gap-1">
              <Flame className="w-3 h-3 fill-current" />
              <span>{language === 'ar' ? 'عرض محدود حتى 30/8' : language === 'de' ? 'Limitiert bis 30.08.' : 'LIMITED UNTIL 30/8'}</span>
            </span>
            <span className="text-slate-200 hidden md:inline font-medium">
              {language === 'ar'
                ? 'مكاتب إدارية استلام فوري ومشطبة بالكامل بخصم 45% كاش لفترة محدودة.'
                : language === 'de'
                ? 'Schlüsselfertige Büros mit 45% Barzahlungsrabatt für begrenzte Zeit.'
                : 'Ready-to-move, fully finished administrative offices under the current cash offer.'}
            </span>
          </div>

          {/* Countdown Timer or Expiry Fallback */}
          {!timeLeft.isExpired ? (
            <div className="flex items-center gap-1.5 font-mono tabular-nums text-[11px] text-[#C5A880]" dir="ltr">
              <Clock className="w-3.5 h-3.5 text-[#C5A880] animate-spin-slow" />
              <div className="flex items-center gap-1 bg-[#061D28]/80 px-2 py-1 rounded border border-[#C5A880]/20">
                <span className="font-bold text-white">{String(timeLeft.days).padStart(2, '0')}</span>
                <span className="text-[9px] text-slate-400">D</span>
                <span className="text-slate-500">:</span>
                <span className="font-bold text-white">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="text-[9px] text-slate-400">H</span>
                <span className="text-slate-500">:</span>
                <span className="font-bold text-white">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="text-[9px] text-slate-400">M</span>
                <span className="text-slate-500">:</span>
                <span className="font-bold text-amber-400">{String(timeLeft.seconds).padStart(2, '0')}</span>
                <span className="text-[9px] text-slate-400">S</span>
              </div>
            </div>
          ) : (
            <span className="text-amber-300 font-bold text-xs">
              {language === 'ar' ? 'تواصل مع Capital Pioneers للتأكد من التوافر الحالي' : language === 'de' ? 'Kontaktieren Sie Capital Pioneers für Verfügbarkeit' : 'Contact Capital Pioneers to Check Current Availability'}
            </span>
          )}
        </div>
      </aside>

      {/* 2. HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:py-20 bg-gradient-to-b from-[#07161F] via-[#092230] to-[#07161F] border-b border-white/5">
        {/* Subtle Architectural Glow Backdrop */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#0B4D68]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#C5A880]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Offer Headline & Pricing Transformation */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left rtl:lg:text-right">
              
              {/* Eyebrow & Badges */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start rtl:lg:justify-end gap-2">
                <span className="px-3 py-1 rounded-md bg-[#C5A880] text-[#061D28] text-xs font-semibold tracking-wider uppercase shadow-sm">
                  {language === 'ar' ? 'عرض محدود' : language === 'de' ? 'Limitiertes Angebot' : 'LIMITED OFFER'}
                </span>
                <span className="px-3 py-1 rounded-md bg-white/10 text-slate-200 text-xs font-semibold flex items-center gap-1 border border-white/10">
                  <MapPin className="w-3 h-3 text-[#C5A880]" />
                  <span>{language === 'ar' ? 'العاصمة الإدارية الجديدة' : 'NEW ADMINISTRATIVE CAPITAL'}</span>
                </span>
              </div>

              {/* Main Headline */}
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold tracking-normal text-white uppercase leading-tight">
                  {language === 'ar' ? 'مكاتب جاهزة للاستلام' : 'READY TO MOVE OFFICES'}
                </h1>
                <p className="text-xl sm:text-2xl lg:text-3xl font-semibold text-[#C5A880]">
                  {language === 'ar' ? 'ادفع كاش واحصل على خصم 45%' : 'Pay Cash & Get 45% Off'}
                </p>
              </div>

              {/* Highlights Strip */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start rtl:lg:justify-end gap-2.5 pt-1 text-xs text-slate-300">
                <span className="px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'تشطيب كامل' : 'Fully Finished'}</span>
                </span>
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white font-medium">
                  {language === 'ar' ? 'داون تاون 1 / داون تاون 2' : 'Downtown 1 / Downtown 2'}
                </span>
                <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 font-medium">
                  {language === 'ar' ? 'متاح حتى 30/8 فقط' : 'Offer Until 30/8 Only'}
                </span>
              </div>

              {/* Main Pricing Hero Card */}
              <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#0A2636] to-[#061822] border-2 border-[#C5A880]/50 shadow-2xl relative space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs font-bold text-[#C5A880] uppercase tracking-wider">
                    {language === 'ar' ? 'عرض الكاش الحصري' : 'Limited Cash Offer'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded bg-red-600/90 text-white text-[11px] font-semibold uppercase tracking-wider">
                    45% OFF
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  {/* Before Discount */}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center sm:text-left rtl:sm:text-right space-y-1">
                    <span className="text-[11px] text-slate-400 block font-medium">
                      {language === 'ar' ? 'السعر قبل الخصم:' : 'Before Discount:'}
                    </span>
                    <strong className="text-xl sm:text-2xl font-bold text-slate-400 line-through block" dir="ltr">
                      EGP 5,000,000
                    </strong>
                    <span className="text-[10px] text-slate-500 block">EGP 5M</span>
                  </div>

                  {/* After Discount Highlight */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-[#12425A] to-[#0B2C3C] border border-[#C5A880] text-center sm:text-left rtl:sm:text-right space-y-1 shadow-lg">
                    <span className="text-[11px] text-[#C5A880] block font-bold">
                      {language === 'ar' ? 'سعر العرض بعد الخصم:' : 'Advertised After Discount:'}
                    </span>
                    <strong className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white block tracking-tight" dir="ltr">
                      EGP 2,700,000
                    </strong>
                    <span className="text-[11px] text-emerald-400 font-bold block">
                      {language === 'ar' ? 'سعر الكاش المعلن (2.7 مليون)' : 'Advertised EGP 2.7M'}
                    </span>
                  </div>
                </div>

                {/* Hero CTAs */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <button
                    onClick={() => scrollToForm('Either')}
                    type="button"
                    className="btn-gold w-full sm:flex-1 py-4 text-xs sm:text-sm font-bold shadow-lg flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{language === 'ar' ? 'احصل على العرض المحدود' : 'Get the Limited Offer'}</span>
                  </button>

                  <a
                    href={getWhatsAppUrl('Either')}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleWhatsAppClick('hero_whatsapp')}
                    className="btn-whatsapp w-full sm:flex-1 py-4 text-xs sm:text-sm font-bold shadow-lg flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>{language === 'ar' ? 'تحدث مع مستشار عقاري' : 'Speak With an Advisor'}</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Official Creative Poster Display & Zoom Trigger */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden bg-slate-900 border-2 border-[#C5A880]/40 shadow-2xl group">
                <img
                  src="/images/projects/downtown/downtown-offer-poster.jpg"
                  alt="Downtown 1 & Downtown 2 Limited Cash Offer Creative"
                  onError={(e) => {
                    e.currentTarget.src = project.mainImage;
                  }}
                  className="w-full h-auto object-cover cursor-zoom-in group-hover:scale-102 transition-transform duration-500"
                  onClick={() => setActiveModalImage('/images/projects/downtown/downtown-offer-poster.jpg')}
                />
                
                {/* Overlay Zoom Action */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 flex items-center justify-between text-xs">
                  <span className="font-semibold text-white truncate">
                    {language === 'ar' ? 'الإعلان الرسمي المعتمد — داون تاون 1 و 2' : 'Official Creative — Downtown 1 & 2'}
                  </span>
                  <button
                    onClick={() => setActiveModalImage('/images/projects/downtown/downtown-offer-poster.jpg')}
                    type="button"
                    className="px-3 py-1.5 rounded-lg bg-[#C5A880] text-[#061D28] font-bold text-[11px] flex items-center gap-1.5 shadow-sm"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'تكبير' : 'Zoom'}</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. OFFER AT A GLANCE (6 STAT CARDS) */}
      <section className="py-12 bg-[#05141D] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-bold text-[#C5A880] uppercase tracking-wider block">
              {language === 'ar' ? 'ملخص العرض التجاري' : 'OFFER AT A GLANCE'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-white">
              {language === 'ar' ? 'أبرز أرقام ومعالم العرض' : 'Key Numbers & Commercial Highlights'}
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 text-center">
            {/* Card 1: 45% Discount */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0B2C3C] to-[#061D28] border border-[#C5A880]/30 space-y-1.5 shadow-soft-sm">
              <strong className="text-3xl sm:text-4xl font-semibold text-[#C5A880] block" dir="ltr">45%</strong>
              <span className="text-xs font-bold text-white block">{language === 'ar' ? 'خصم كاش' : 'Cash Discount'}</span>
              <span className="text-[10px] text-slate-400 block">{language === 'ar' ? 'سداد نقدي' : 'Full Payment'}</span>
            </div>

            {/* Card 2: EGP 5M Before */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
              <strong className="text-2xl sm:text-3xl font-bold text-slate-400 line-through block" dir="ltr">5M</strong>
              <span className="text-xs font-semibold text-slate-300 block">{language === 'ar' ? 'قبل الخصم' : 'Before Discount'}</span>
              <span className="text-[10px] text-slate-400 block" dir="ltr">EGP 5,000,000</span>
            </div>

            {/* Card 3: EGP 2.7M After */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0F3B50] to-[#071F2C] border-2 border-emerald-500/50 space-y-1.5 shadow-md">
              <strong className="text-2xl sm:text-3xl font-semibold text-emerald-400 block" dir="ltr">2.7M</strong>
              <span className="text-xs font-bold text-white block">{language === 'ar' ? 'سعر العرض' : 'Offer Price'}</span>
              <span className="text-[10px] text-emerald-300 block" dir="ltr">EGP 2,700,000</span>
            </div>

            {/* Card 4: Ready To Move */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
              <strong className="text-2xl sm:text-3xl font-semibold text-white block">READY</strong>
              <span className="text-xs font-semibold text-slate-200 block">{language === 'ar' ? 'استلام فوري' : 'To Move'}</span>
              <span className="text-[10px] text-emerald-400 block">{language === 'ar' ? 'بدون انتظار' : 'Immediate'}</span>
            </div>

            {/* Card 5: Fully Finished */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
              <strong className="text-2xl sm:text-3xl font-semibold text-white block">FULLY</strong>
              <span className="text-xs font-semibold text-slate-200 block">{language === 'ar' ? 'تشطيب كامل' : 'Finished'}</span>
              <span className="text-[10px] text-slate-400 block">{language === 'ar' ? 'مكاتب مجهزة' : 'Turnkey Units'}</span>
            </div>

            {/* Card 6: 30/8 Deadline */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-red-950/40 to-[#061D28] border border-red-500/30 space-y-1.5">
              <strong className="text-2xl sm:text-3xl font-semibold text-red-400 block" dir="ltr">30/8</strong>
              <span className="text-xs font-bold text-white block">{language === 'ar' ? 'نهاية العرض' : 'Offer Deadline'}</span>
              <span className="text-[10px] text-amber-300 block">{language === 'ar' ? 'فترة محدودة' : 'Limited Period'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PRICE TRANSFORMATION SECTION */}
      <section className="py-16 bg-gradient-to-b from-[#07161F] via-[#0B2533] to-[#07161F] border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-3">
            <span className="px-3 py-1 rounded-full bg-[#C5A880]/20 text-[#C5A880] text-xs font-bold uppercase tracking-wider inline-block">
              {language === 'ar' ? 'التحول المالي للسعر' : 'PRICE TRANSFORMATION'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight">
              {language === 'ar' ? 'فرصة سداد كاش استثنائية' : 'A Limited Cash Opportunity'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-light max-w-2xl mx-auto">
              {language === 'ar'
                ? 'استفد من تخفيض فوري بنسبة 45% من إجمالي سعر الوحدة الإدارية عند السداد النقدي.'
                : 'Benefit from an authoritative 45% upfront discount on administrative offices when paying cash.'}
            </p>
          </div>

          {/* Large Visual Transformation Diagram */}
          <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
            
            {/* Step 1: BEFORE */}
            <div className="md:col-span-5 p-6 sm:p-8 rounded-3xl bg-white/5 border border-white/10 text-center space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                {language === 'ar' ? 'السعر قبل الخصم' : 'BEFORE DISCOUNT'}
              </span>
              <div className="text-3xl sm:text-4xl font-semibold text-slate-400 line-through" dir="ltr">
                EGP 5,000,000
              </div>
              <span className="text-xs text-slate-500 block font-light">
                {language === 'ar' ? 'السعر الرسمي بدون العرض' : 'Regular Listed Price'}
              </span>
            </div>

            {/* Transform Arrow / Discount Indicator */}
            <div className="md:col-span-1 flex flex-col items-center justify-center gap-1 text-center py-2">
              <div className="w-10 h-10 rounded-full bg-[#C5A880] text-[#061D28] flex items-center justify-center font-semibold shadow-md">
                <ArrowDown className="w-5 h-5 hidden md:block" />
                <ArrowRight className="w-5 h-5 md:hidden" />
              </div>
              <span className="text-[10px] font-semibold text-[#C5A880] uppercase tracking-wider whitespace-nowrap">
                -45%
              </span>
            </div>

            {/* Step 2: AFTER */}
            <div className="md:col-span-5 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#103D52] to-[#082330] border-2 border-[#C5A880] text-center space-y-2 shadow-2xl relative overflow-hidden">
              <div className="absolute top-2 right-2 rtl:right-auto rtl:left-2">
                <span className="px-2.5 py-0.5 rounded bg-[#C5A880] text-[#061D28] text-[10px] font-semibold uppercase tracking-wider">
                  OFFER
                </span>
              </div>
              <span className="text-xs font-bold text-[#C5A880] uppercase tracking-wider block">
                {language === 'ar' ? 'سعر العرض بعد الخصم' : 'AFTER 45% DISCOUNT'}
              </span>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white tracking-tight" dir="ltr">
                EGP 2,700,000
              </div>
              <span className="text-xs text-emerald-400 block font-bold">
                {language === 'ar' ? 'وفر 2.3 مليون جنيه فورياً' : 'Immediate EGP 2.3M Cash Savings'}
              </span>
            </div>

          </div>

          {/* CTA Box */}
          <div className="text-center pt-2">
            <button
              onClick={() => {
                trackEvent('downtown_cash_offer_click', { placement: 'price_transformation' });
                scrollToForm('Either');
              }}
              type="button"
              className="btn-gold py-4 px-8 text-xs sm:text-sm font-bold shadow-xl inline-flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{language === 'ar' ? 'اطلب تفاصيل هذا العرض' : 'Request This Offer'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 5. READY TO MOVE & FULLY FINISHED SPECIFICATION MODULES */}
      <section className="py-16 bg-[#05141D] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Feature Block 1: Ready To Move */}
            <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#08202D] to-[#04121A] border border-white/10 space-y-5 shadow-soft-md">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <KeyRound className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                  {language === 'ar' ? 'استلام فوري' : 'READY TO MOVE'}
                </span>
                <h3 className="text-2xl font-semibold text-white">
                  {language === 'ar' ? 'بدون أي فترات انتظار للإنشاء' : 'No Construction Waiting Period'}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                {language === 'ar'
                  ? 'وحدات إدارية جاهزة للاستلام الفوري والتشغيل المباشر ضمن العرض الحالي، مما يتيح لك بدء نشاطك التجاري أو استثمارك دون أي مخاطر أو تأخير في التسليم.'
                  : 'Administrative offices ready for immediate occupancy under the current cash offer, allowing businesses and investors to start operations without development wait times.'}
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center font-bold text-slate-200">
                  {language === 'ar' ? 'مكاتب إدارية' : 'Administrative Offices'}
                </div>
                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-center font-bold text-emerald-300">
                  {language === 'ar' ? 'توافر فوري' : 'Immediate Availability'}
                </div>
              </div>
            </div>

            {/* Feature Block 2: Fully Finished */}
            <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#08202D] to-[#04121A] border border-white/10 space-y-5 shadow-soft-md">
              <div className="w-12 h-12 rounded-2xl bg-[#C5A880]/20 text-[#C5A880] flex items-center justify-center border border-[#C5A880]/30">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-[#C5A880] uppercase tracking-wider block">
                  {language === 'ar' ? 'تشطيب متكامل' : 'FULLY FINISHED'}
                </span>
                <h3 className="text-2xl font-semibold text-white">
                  {language === 'ar' ? 'مكاتب مشطبة بالكامل' : 'Fully Finished Offices'}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                {language === 'ar'
                  ? 'امتلك مكتبك الإداري الجاهز للاستلام بدون انتظار اكتمال أعمال الإنشاء والتشطيب، حيث يشمل هذا العرض المحدود وحدات مشطبة بالكامل وجاهزة للعمل.'
                  : '"Secure a ready-to-move administrative office without waiting for construction completion, with fully finished units included in the current limited offer."'}
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center font-bold text-slate-200">
                  {language === 'ar' ? 'تشطيب سوبر لوكس' : 'Complete Finishing'}
                </div>
                <div className="p-3 rounded-xl bg-[#C5A880]/15 border border-[#C5A880]/30 text-center font-bold text-[#C5A880]">
                  {language === 'ar' ? 'جاهز للفرش والتشغيل' : 'Ready for Fit-out'}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. DOWNTOWN 1 & DOWNTOWN 2 OPPORTUNITIES */}
      <section className="py-16 bg-gradient-to-b from-[#07161F] via-[#092230] to-[#07161F] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-bold text-[#C5A880] uppercase tracking-wider block">
              {language === 'ar' ? 'المشروعان المشمولان بالعرض' : 'FEATURED PROJECTS'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold text-white">
              {language === 'ar' ? 'فرصتان في قلب الداون تاون' : 'Two Downtown Opportunities'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-light">
              {language === 'ar'
                ? 'اختر بين داون تاون 1 أو داون تاون 2 بالعاصمة الإدارية الجديدة واستفد من نفس عرض الكاش الاستثنائي.'
                : 'Choose between Downtown 1 or Downtown 2 in the New Administrative Capital under the verified cash terms.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            
            {/* Downtown 1 Card */}
            <div className="p-8 rounded-3xl bg-[#092636] border-2 border-white/10 hover:border-[#C5A880] transition-all space-y-6 shadow-xl relative group">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] text-[#C5A880] font-semibold uppercase tracking-wider block">PROJECT 01</span>
                  <h3 className="text-2xl font-semibold text-white">DOWNTOWN 1</h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#C5A880]">
                  <Building2 className="w-5 h-5" />
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">{language === 'ar' ? 'نوع الوحدة:' : 'Property Type:'}</span>
                  <strong className="text-white font-bold">{language === 'ar' ? 'مكاتب إدارية' : 'Administrative Offices'}</strong>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">{language === 'ar' ? 'الموقع:' : 'Location:'}</span>
                  <strong className="text-white font-bold">{language === 'ar' ? 'العاصمة الإدارية الجديدة' : 'New Administrative Capital'}</strong>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">{language === 'ar' ? 'الاستلام والتشطيب:' : 'Delivery & Finishing:'}</span>
                  <strong className="text-emerald-400 font-bold">{language === 'ar' ? 'استلام فوري • تشطيب كامل' : 'Ready to Move • Fully Finished'}</strong>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-400">{language === 'ar' ? 'سعر العرض:' : 'Offer Price:'}</span>
                  <strong className="text-white font-semibold text-sm" dir="ltr">EGP 2,700,000 (45% OFF)</strong>
                </div>
              </div>

              <button
                onClick={() => scrollToForm('Downtown 1')}
                type="button"
                className="btn-gold w-full py-3.5 text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
              >
                <span>{language === 'ar' ? 'اسأل عن داون تاون 1' : 'Ask About DT1'}</span>
                <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Downtown 2 Card */}
            <div className="p-8 rounded-3xl bg-[#092636] border-2 border-white/10 hover:border-[#C5A880] transition-all space-y-6 shadow-xl relative group">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] text-[#C5A880] font-semibold uppercase tracking-wider block">PROJECT 02</span>
                  <h3 className="text-2xl font-semibold text-white">DOWNTOWN 2</h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#C5A880]">
                  <Building2 className="w-5 h-5" />
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">{language === 'ar' ? 'نوع الوحدة:' : 'Property Type:'}</span>
                  <strong className="text-white font-bold">{language === 'ar' ? 'مكاتب إدارية' : 'Administrative Offices'}</strong>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">{language === 'ar' ? 'الموقع:' : 'Location:'}</span>
                  <strong className="text-white font-bold">{language === 'ar' ? 'العاصمة الإدارية الجديدة' : 'New Administrative Capital'}</strong>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">{language === 'ar' ? 'الاستلام والتشطيب:' : 'Delivery & Finishing:'}</span>
                  <strong className="text-emerald-400 font-bold">{language === 'ar' ? 'استلام فوري • تشطيب كامل' : 'Ready to Move • Fully Finished'}</strong>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-400">{language === 'ar' ? 'سعر العرض:' : 'Offer Price:'}</span>
                  <strong className="text-white font-semibold text-sm" dir="ltr">EGP 2,700,000 (45% OFF)</strong>
                </div>
              </div>

              <button
                onClick={() => scrollToForm('Downtown 2')}
                type="button"
                className="btn-gold w-full py-3.5 text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
              >
                <span>{language === 'ar' ? 'اسأل عن داون تاون 2' : 'Ask About DT2'}</span>
                <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 7. LOCATION SECTION */}
      <section className="py-16 bg-[#05141D] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-6 space-y-5 text-center lg:text-left rtl:lg:text-right">
              <div className="eyebrow-tag bg-white/5 text-[#C5A880] border border-white/10 inline-flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'موقع المشروع' : 'LOCATION'}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-semibold text-white">
                {language === 'ar' ? 'العاصمة الإدارية الجديدة' : 'New Administrative Capital'}
              </h2>
              <p className="text-lg font-bold text-[#C5A880]">
                {language === 'ar' ? 'وجهة إدارية واستثمارية رائدة' : 'A Prime Administrative Destination'}
              </p>
              <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                {language === 'ar'
                  ? 'يقع المشروعان في قلب منطقة الداون تاون بالعاصمة الإدارية الجديدة، وهي المركز التجاري والإداري الأبرز الذي يحتضن كبرى الشركات والمؤسسات الحكومية والمالية في مصر.'
                  : 'Strategically situated in the Downtown core of Egypt’s New Administrative Capital, positioning your corporate address within the country’s leading commercial and financial nerve center.'}
              </p>
            </div>

            <div className="lg:col-span-6">
              <div className="p-8 rounded-3xl bg-gradient-to-br from-[#092636] to-[#051822] border border-white/10 space-y-4 shadow-xl">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#C5A880]" />
                  <span>{language === 'ar' ? 'مزايا الموقع الإداري' : 'Administrative Location Advantages'}</span>
                </h3>
                <div className="space-y-2.5 text-xs text-slate-300">
                  <div className="p-3.5 rounded-xl bg-white/5 flex items-center gap-3">
                    <Check className="w-4 h-4 text-[#C5A880] flex-shrink-0" />
                    <span>{language === 'ar' ? 'قلب منطقة الداون تاون المركزية' : 'Heart of the Downtown Central Corridor'}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/5 flex items-center gap-3">
                    <Check className="w-4 h-4 text-[#C5A880] flex-shrink-0" />
                    <span>{language === 'ar' ? 'سهولة الوصول من كافة المحاور الرئيسية' : 'Rapid connectivity to major transit axes'}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/5 flex items-center gap-3">
                    <Check className="w-4 h-4 text-[#C5A880] flex-shrink-0" />
                    <span>{language === 'ar' ? 'قرب مباشر من الحي المالي والحكومي' : 'Close proximity to the Financial & Governmental District'}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 8. LIMITED OFFER & INCENTIVE SCHEME CALLOUT */}
      <section className="py-14 bg-gradient-to-r from-amber-500/10 via-[#092738] to-amber-500/10 border-b border-[#C5A880]/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-10 rounded-3xl bg-[#061D28] border-2 border-[#C5A880]/40 space-y-6 shadow-2xl text-center">
            
            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-red-600/20 border border-red-500/40 text-red-400 text-xs font-semibold uppercase tracking-wider inline-block">
                {language === 'ar' ? 'خصم نقدي 45%' : '45% CASH DISCOUNT'}
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white">
                {language === 'ar'
                  ? 'امتلك مكتبك الإداري الجاهز للاستلام بالعاصمة الإدارية'
                  : 'Own a ready-to-move, fully finished administrative office under the current limited cash offer.'}
              </h2>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-light">{language === 'ar' ? 'قبل الخصم:' : 'Before:'}</span>
                <strong className="line-through text-slate-400 font-bold" dir="ltr">EGP 5M</strong>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#C5A880] font-bold">{language === 'ar' ? 'سعر العرض:' : 'Offer:'}</span>
                <strong className="text-emerald-400 font-semibold text-lg" dir="ltr">EGP 2.7M</strong>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-light">{language === 'ar' ? 'الموعد النهائي:' : 'Deadline:'}</span>
                <strong className="text-amber-300 font-bold">{language === 'ar' ? 'حتى 30/8 فقط' : 'Until 30/8'}</strong>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => scrollToForm('Either')}
                type="button"
                className="btn-gold py-3.5 px-8 text-xs font-bold shadow-lg"
              >
                {language === 'ar' ? 'اطلب تفاصيل العرض' : 'Claim Offer Details'}
              </button>
            </div>

            {/* Sales Incentive Scheme Notice (Separated from customer discount) */}
            <div className="pt-4 border-t border-white/10 text-[11px] text-slate-400 flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]" />
              <span>
                {language === 'ar'
                  ? 'نظام الحوافز البيعية والشركاء: متوسط 4% (خاص بالمبيعات ومنفصل تماماً عن خصم الكاش للعميل).'
                  : 'Sales Incentive Scheme — Average 4% (Partner & sales incentive scheme, separate from buyer cash discount).'}
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* 9. LEAD CAPTURE SECTION */}
      <section ref={formRef} id="lead-capture-section" className="py-16 bg-[#07161F]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-[#C5A880] uppercase tracking-wider block">
              {language === 'ar' ? 'طلب الحجز والتفاصيل' : 'DIRECT RESERVATION INQUIRY'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-white">
              {language === 'ar' ? 'احصل على العرض المحدود الآن' : 'Secure the Limited Offer'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-light">
              {language === 'ar'
                ? 'اطلب التوافر الحالي وكافة التفاصيل للمكاتب الجاهزة للاستلام في داون تاون 1 وداون تاون 2.'
                : 'Request current availability and full details for ready-to-move offices in Downtown 1 and Downtown 2.'}
            </p>
          </div>

          <div className="p-8 sm:p-10 rounded-3xl bg-[#092636] border-2 border-[#C5A880]/40 shadow-2xl space-y-6">
            
            {formSubmitted ? (
              <div className="p-6 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  {language === 'ar' ? 'تم استلام طلبك بنجاح!' : 'Offer Request Received!'}
                </h3>
                <p className="text-xs text-slate-300 font-light">
                  {language === 'ar'
                    ? 'سيقوم مستشار عقاري متخصص من Capital Pioneers بالتواصل معك خلال دقائق لتزويدك بكافة تفاصيل عرض داون تاون.'
                    : 'A dedicated Capital Pioneers commercial advisor will reach out shortly with the full Downtown offer details.'}
                </p>
                {whatsappHandoffUrl && (
                  <a
                    href={whatsappHandoffUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleWhatsAppClick('form_success_whatsapp')}
                    className="btn-whatsapp py-3 px-6 text-xs font-bold inline-flex items-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>{language === 'ar' ? 'تأكيد الطلب عبر واتساب مباشرة' : 'Confirm via WhatsApp Now'}</span>
                  </a>
                )}
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                
                {/* Interest Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 block">
                    {language === 'ar' ? 'المشروع المرغوب:' : 'Interested In:'}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Downtown 1', 'Downtown 2', 'Either'] as const).map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setSelectedInterest(opt)}
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border text-center ${
                          selectedInterest === opt
                            ? 'bg-[#C5A880] text-[#061D28] border-[#C5A880] shadow-sm'
                            : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        {opt === 'Either' ? (language === 'ar' ? 'أي منهما' : 'Either') : opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 block">
                    {language === 'ar' ? 'الاسم بالكامل *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={language === 'ar' ? 'أدخل اسمك الكريم' : 'Enter your full name'}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 block">
                    {language === 'ar' ? 'رقم الهاتف / واتساب *' : 'Phone Number / WhatsApp *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder={language === 'ar' ? 'مثال: 010xxxxxxxx' : 'e.g. +20 106 633 0570'}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-[#C5A880]"
                    dir="ltr"
                  />
                </div>

                {/* Notes */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 block">
                    {language === 'ar' ? 'ملاحظات أو استفسار إضافي (اختياري)' : 'Additional Notes (Optional)'}
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={language === 'ar' ? 'أي استفسار بخصوص السعر أو المعاينة...' : 'Any specific questions regarding availability or viewing...'}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-gold w-full py-4 text-xs sm:text-sm font-semibold uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>{language === 'ar' ? 'جاري الإرسال...' : 'Submitting...'}</span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>{language === 'ar' ? 'طلب العرض والاستلام الفوري' : 'Request Offer'}</span>
                    </>
                  )}
                </button>

                <p className="text-[11px] text-slate-400 text-center font-light pt-2">
                  {language === 'ar'
                    ? 'بياناتك محمية ولن يتم استخدامها إلا لغرض التواصل بخصوص هذا العرض.'
                    : 'Your information is secure and will only be used to contact you regarding this offer.'}
                </p>
              </form>
            )}

          </div>
        </div>
      </section>

      {/* 10. STICKY MOBILE CTA BAR */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-[#061D28]/95 backdrop-blur-md border-t border-[#C5A880]/30 py-3 px-4 z-40 shadow-2xl flex items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-600 text-white font-bold">45% OFF</span>
            <span className="text-[11px] text-slate-400 line-through">EGP 5M</span>
          </div>
          <strong className="text-sm font-semibold text-white block" dir="ltr">EGP 2.7M</strong>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => scrollToForm('Either')}
            type="button"
            className="btn-gold py-2 px-4 text-xs font-bold shadow-sm"
          >
            {language === 'ar' ? 'طلب العرض' : 'Get Offer'}
          </button>
          <a
            href={getWhatsAppUrl('Either')}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleWhatsAppClick('mobile_sticky_whatsapp')}
            className="p-2.5 bg-[#25D366] text-white rounded-xl shadow-sm flex items-center justify-center"
            aria-label="WhatsApp"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
          </a>
        </div>
      </div>

      {/* 11. IMAGE LIGHTBOX MODAL */}
      {activeModalImage && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <button
            onClick={() => setActiveModalImage(null)}
            type="button"
            className="absolute top-4 right-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all z-10"
            aria-label="Close Image Modal"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={activeModalImage}
            alt="Downtown Offer High-Resolution Plan"
            className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
          />
        </div>
      )}

    </div>
  );
};
