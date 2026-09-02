import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Compass, 
  Waves, 
  Sun, 
  MapPin, 
  MessageCircle, 
  Calendar, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  Anchor, 
  Check, 
  Building2, 
  ChevronRight,
  Palmtree,
  CheckCircle2,
  Phone
} from 'lucide-react';
import { getRedSeaProjects, RED_SEA_LOCATIONS } from '@/data/projectsData';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { MainLeadForm } from '@/components/forms/MainLeadForm';
import { SEO } from '@/components/common/SEO';
import { useLanguage } from '@/context/LanguageContext';
import { generateBreadcrumbSchema } from '@/utils/schemaGenerator';
import { PRIMARY_PHONE, TEL_URL, WHATSAPP_BASE_URL } from '@/services/leadService';

interface RedSeaPageProps {
  onRequestViewing?: (projectName?: string) => void;
}

export const RedSeaPage: React.FC<RedSeaPageProps> = ({ onRequestViewing }) => {
  const [activeLocationId, setActiveLocationId] = useState(RED_SEA_LOCATIONS[0].id);
  const { t, isRTL, language } = useLanguage();

  const redSeaProjects = getRedSeaProjects();
  const rawActiveLocation = RED_SEA_LOCATIONS.find((l) => l.id === activeLocationId) || RED_SEA_LOCATIONS[0];

  const localizedRedSeaLocations: Record<string, Record<string, any>> = {
    'hurghada-city': {
      ar: {
        name: 'الغردقة',
        title: 'مدينة الغردقة والشريط الساحلي',
        description: 'المركز الإداري والحيوي للبحر الأحمر، ويضم مطار الغردقة الدولي، الممشى السياحي، وشواطئ رملية واسعة ذات عائد استثماري وتأجيري مرتفع.',
        highlights: ['10 دقائق من مطار الغردقة الدولي', 'شواطئ رملية بمياه هادئة', 'إدارة فندقية واستثمارية للوحدات'],
        propertyTypes: ['شاليهات شاطئية', 'شقق فندقية مدارة', 'فيلات مستقلة'],
      },
      de: {
        name: 'Hurghada',
        title: 'Hurghada Stadt & Küstenstreifen',
        description: 'Das pulsierende Herz der Küste mit internationalem Flughafen, lebhafter Promenade und hoher touristischer Mietnachfrage.',
        highlights: ['10 Min. zum internationalen Flughafen', 'Ruhige Sandstrände', 'Hotel- und Vermietungsmanagement'],
        propertyTypes: ['Strandchalets', 'Serviced Apartments', 'Freistehende Villen'],
      },
    },
    'el-gouna': {
      ar: {
        name: 'الجونة',
        title: 'الجونة — مدينة اللاجون الراقية',
        description: 'المنتجع الساحلي الأرقى في مصر، يشتهر بشبكة اللاجون الصالحة للسباحة، ملاعب الجولف العالمية، مراسي اليخوت، ومراكز ركوب الأمواج الشراعية.',
        highlights: ['شبكة لاجون بمياه بحرية نقية', 'ملاعب جولف عالمية و3 مراسي يخوت', 'مجتمع دولي متكامل ومدارس ومستشفى'],
        propertyTypes: ['فيلات لاجون خاصة', 'سكاي بنتهاوس', 'تاون هاوس'],
      },
      de: {
        name: 'El Gouna',
        title: 'El Gouna — Die Lagunenstadt',
        description: 'Ägyptens exklusivste Küstenstadt mit schiffbaren Lagunen, Meisterschafts-Golfplätzen, 3 Yachthäfen und internationaler Community.',
        highlights: ['Kristallklare Salzwasserlagunen', 'Championship Golf & 3 Marinas', 'Internationale Schulen & Privatklinik'],
        propertyTypes: ['Private Lagunenvillen', 'Sky-Penthouses', 'Townhouses'],
      },
    },
    'sahl-hasheesh': {
      ar: {
        name: 'سهل حشيش',
        title: 'سهل حشيش — الخليج المحمي والمنتجعات الفاخرة',
        description: 'وجهة شاطئية هادئة وفاخرة تقع في خليج محمي برمال بيضاء ناعمة، ممشى سياحي يمتد لـ 12 كم، ومواقع غوص وشعاب مرجانية خلابة.',
        highlights: ['خليج محمي برمال بيضاء', 'ممشى سياحي بطول 12 كم', 'شعاب مرجانية والمدينة الغارقة'],
        propertyTypes: ['فيلات بإطلالة بحرية بانورامية', 'شاليهات على الخليج', 'دوبلكس ساحلي'],
      },
      de: {
        name: 'Sahl Hasheesh',
        title: 'Sahl Hasheesh — Die geschützte Luxusbucht',
        description: 'Eine ruhige, gehobene Oase an einer natürlichen Bucht mit 12 km Uferpromenade und spektakulären Korallenriffen.',
        highlights: ['Geschützte Bucht mit weißem Sand', '12 km lange Promenade', 'Tauch- & Schnorchelriffe der Sunken City'],
        propertyTypes: ['Panoramavillen', 'Bucht-Chalets', 'Küstenduplexe'],
      },
    },
    'soma-bay': {
      ar: {
        name: 'سوما باي',
        title: 'شبه جزيرة سوما باي',
        description: 'شبه جزيرة خلابة محاطة بمياه البحر الأحمر من ثلاث جهات، وتعد من أفضل مواقع العالم لركوب الأمواج الشراعية ورياضات الشراع.',
        highlights: ['إطلالات بحرية بزاوية 360 درجة', 'أحد أفضل مراكز الكايت سيرف عالمياً', 'إدارة فندقية كاملة للوحدات'],
        propertyTypes: ['شقق فندقية', 'أجنحة لاجون', 'فيلات بوتيك'],
      },
      de: {
        name: 'Soma Bay',
        title: 'Soma Bay Halbinsel',
        description: 'Eine exklusive Halbinsel, umgeben von 360-Grad-Meerblick, weltberühmt für Kitesurfen und erstklassige Wellness-Resorts.',
        highlights: ['360-Grad-Meerblick', 'Internationaler Kitesurf-Hotspot', 'Hotelmanagement der Spitzenklasse'],
        propertyTypes: ['Serviced Apartments', 'Lagunensuiten', 'Boutique-Villen'],
      },
    },
  };

  const activeLocData = localizedRedSeaLocations[rawActiveLocation.id]?.[language] || {};
  const activeLocationName = activeLocData.name || rawActiveLocation.name;
  const activeLocationTitle = activeLocData.title || rawActiveLocation.name;
  const activeLocationDesc = activeLocData.description || rawActiveLocation.description;
  const activeLocationHighlights = activeLocData.highlights || rawActiveLocation.highlights;
  const activeLocationPropertyTypes = activeLocData.propertyTypes || rawActiveLocation.propertyTypes;

  const whatsappUrl = `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(
    'Hello Capital Pioneers Red Sea Branch, I am inquiring about coastal properties and investment opportunities in Hurghada.'
  )}`;

  const redSeaSchema = [
    {
      '@context': 'https://schema.org',
      '@type': 'RealEstateAgent',
      'name': 'Capital Pioneers Red Sea Real Estate',
      'description': 'Specialized real estate marketing and advisory division in Hurghada and the Red Sea.',
      'url': 'https://capitalpioneers.com/capital-pioneers-red-sea',
      'telephone': '+201066330570',
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': 'Hurghada',
        'addressRegion': 'Red Sea Governorate',
        'addressCountry': 'EG',
      },
    },
    generateBreadcrumbSchema([
      { name: t('nav.home', 'Home'), item: '/' },
      { name: t('nav.redSea', 'Capital Pioneers Red Sea'), item: '/capital-pioneers-red-sea' },
    ]),
  ];

  const investmentPillars = [
    {
      icon: Sun,
      title: language === 'ar' ? 'سياحة عالمية وشمس طوال العام' : language === 'de' ? 'Ganzjähriger Tourismus' : 'Year-Round Global Tourism',
      description: language === 'ar' 
        ? 'تتمتع شواطئ البحر الأحمر بـ 365 يوماً من الشمس وتدفق سياحي أوروبي ودولي مستمر، مما يحقق إشغالاً إيجارياً مرتفعاً.'
        : language === 'de'
        ? '365 Tage Sonnenschein und kontinuierlicher europäischer Besucherstrom garantieren eine ganzjährig hohe Nachfrage nach Ferienwohnungen.'
        : 'The Red Sea enjoys 365 days of sunshine with continuous European visitor influx, generating consistent short-term rental demand.',
      stat: language === 'ar' ? '365 يوم شمس' : '365 Days Sun',
    },
    {
      icon: TrendingUp,
      title: language === 'ar' ? 'عوائد إيجارية بالعملات الأجنبية' : language === 'de' ? 'Fremdwährungsrenditen' : 'Foreign Currency Yields',
      description: language === 'ar'
        ? 'تحقق الشاليهات والشقق الفندقية بالغردقة والجونة عوائد دولارية مجزية تعزز العائد على رأس المال المستثمر.'
        : language === 'de'
        ? 'Ferienimmobilien in Hurghada und El Gouna bieten attraktive Mieteinnahmen in Fremdwährungen und solide Absicherung.'
        : 'Vacation and hotel-serviced residences in Hurghada and El Gouna provide attractive foreign currency rental revenue and hedging.',
      stat: language === 'ar' ? 'عائد إيجاري مرتفع' : 'High Rental Yield',
    },
    {
      icon: Waves,
      title: language === 'ar' ? 'واجهات شاطئية ولاجون مباشرة' : language === 'de' ? 'Direkter Strand- & Lagunenzugang' : 'Prime Beachfront & Lagoon Access',
      description: language === 'ar'
        ? 'مشروعات شاطئية حصرية برمال بيضاء ناعمة، مراسي يخوت خاصة، بحيرات لاجون صافية صالحة للسباحة، ومراكز كايت سيرف.'
        : language === 'de'
        ? 'Exklusive Uferanlagen mit feinen Sandstränden, privaten Yachthäfen, kristallklaren Schwimmlagunen und Kitesurf-Centern.'
        : 'Exclusive shoreline developments with direct sandy beach frontage, private marina berths, crystal swimming lagoons, and kite centers.',
      stat: language === 'ar' ? 'واجهة بحرية مباشرة' : 'Direct Seafront',
    },
    {
      icon: MapPin,
      title: language === 'ar' ? 'مكتب إقليمي متخصص بالغردقة' : language === 'de' ? 'Regionales Büro vor Ort in Hurghada' : 'Dedicated Local Hurghada Office',
      description: language === 'ar'
        ? 'يقدم مستشارونا بفرع الغردقة جولات معاينة ميدانية خاصة، استقبال من مطار الغردقة، واستشارات تفاوض مباشرة مع المطورين.'
        : language === 'de'
        ? 'Unsere Berater in Hurghada bieten persönliche Besichtigungstouren, Flughafenabholung und direkte Verhandlungen mit Bauträgern.'
        : 'Our regional branch advisors in Hurghada provide on-the-ground client tours, airport pick-ups, and developer contract negotiations.',
      stat: language === 'ar' ? 'فريق محلي متخصص' : 'Local Advisory',
    },
    {
      icon: Anchor,
      title: language === 'ar' ? 'نمو رأسمالي وتطوير بنية تحتية' : language === 'de' ? 'Wertsteigerung & Infrastrukturausbau' : 'Capital Appreciation & Infrastructure',
      description: language === 'ar'
        ? 'توسعات مطار الغردقة الدولي وشبكات الطرق الساحلية الحديثة تعزز القيمة السوقية للعقارات الساحلية على المدى الطويل.'
        : language === 'de'
        ? 'Erweiterungen des Flughafens Hurghada und moderne Küsteninfrastruktur treiben die langfristige Immobilienwertsteigerung an.'
        : 'Major expansions across Hurghada Airport and coastal masterplans drive robust long-term property appreciation across the governorate.',
      stat: language === 'ar' ? 'نمو رأسمالي قوي' : 'High Growth',
    },
    {
      icon: ShieldCheck,
      title: language === 'ar' ? 'تمثيل رسمي بدون عمولات وسيطة' : language === 'de' ? 'Direkte Bauträgerkonditionen' : 'Direct Developer Representation',
      description: language === 'ar'
        ? 'أنظمة سداد ميسرة بأقساط تصل حتى 7 سنوات، أسعار المطور المباشرة، وبدون أي عمولات إضافية على المشتري.'
        : language === 'de'
        ? 'Transparente Konditionen, flexible Ratenpläne bis zu 7 Jahre und Direktpreise ohne Makleraufschläge.'
        : 'Transparent payment terms, flexible installment schedules up to 7 years, and zero broker markups direct from master developers.',
      stat: language === 'ar' ? 'بدون أي عمولات' : 'Zero Markups',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAFBFD]">
      {/* Technical SEO */}
      <SEO
        title="Capital Pioneers Red Sea | Hurghada Real Estate & Coastal Properties"
        description="Explore premier beachfront chalets, lagoon-front villas, and hotel-serviced apartments across Hurghada, El Gouna, and Sahl Hasheesh marketed by Capital Pioneers Red Sea branch."
        canonicalPath="/capital-pioneers-red-sea"
        schema={redSeaSchema}
      />

      {/* 1. Cinematic Red Sea Hero Section */}
      <section className="relative w-full min-h-[620px] lg:min-h-[720px] bg-[#061D28] text-white flex items-center justify-center overflow-hidden">
        {/* Background Visual */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero/hero-slide-2.jpg"
            alt="Capital Pioneers Red Sea Hurghada Coastal Real Estate"
            className="w-full h-full object-cover opacity-30 scale-105"
            loading="eager"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#061D28] via-[#061D28]/70 to-[#061D28]/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#061D28] via-[#061D28]/80 to-transparent rtl:bg-gradient-to-l" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 text-center sm:text-left rtl:sm:text-right w-full">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C5A880]/15 border border-[#C5A880]/30 text-[#C5A880] text-xs font-semibold tracking-wider uppercase">
              <Compass className="w-3.5 h-3.5" />
              <span>{t('redsea.page.badge', 'Capital Pioneers Red Sea Division')}</span>
            </div>

            <div className="space-y-2">
              <span className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-[#C5A880] block">
                {t('redsea.page.heroSubtitle', 'Real Estate Opportunities on the Red Sea')}
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-white leading-[1.15]">
                {t('redsea.page.heroTitle', 'Capital Pioneers')} <br />
                <span className="text-[#C5A880] font-normal">
                  {t('redsea.page.heroTitleSub', 'Red Sea Coastal Portfolio')}
                </span>
              </h1>
            </div>

            <p className="text-slate-200 text-sm sm:text-base font-light leading-relaxed max-w-2xl">
              {t('redsea.page.heroDesc', 'Experience premier beachfront residences, lagoon-front villas, vacation properties, and high-yield hospitality investments across Hurghada, El Gouna, and Sahl Hasheesh.')}
            </p>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 max-w-lg">
              <div className="bg-black/30 backdrop-blur-md p-3 rounded-xl border border-white/10 text-xs">
                <span className="text-slate-300 block font-light">{t('redsea.page.regBranch', 'Regional Branch')}</span>
                <strong className="text-white font-semibold block mt-0.5">{t('redsea.page.branchVal', 'Hurghada, Egypt')}</strong>
              </div>
              <div className="bg-black/30 backdrop-blur-md p-3 rounded-xl border border-white/10 text-xs">
                <span className="text-slate-300 block font-light">{t('redsea.page.installmentTerms', 'Installment Terms')}</span>
                <strong className="text-[#C5A880] font-semibold block mt-0.5">{t('redsea.page.installmentVal', 'Up to 7 Years [Demo]')}</strong>
              </div>
              <div className="bg-black/30 backdrop-blur-md p-3 rounded-xl border border-white/10 text-xs col-span-2 sm:col-span-1">
                <span className="text-slate-300 block font-light">{t('redsea.page.propertyTypes', 'Property Types')}</span>
                <strong className="text-white font-semibold block mt-0.5">{t('redsea.page.propertyTypesVal', 'Chalets & Villas')}</strong>
              </div>
            </div>

            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-4">
              <button
                onClick={() => onRequestViewing && onRequestViewing('Red Sea Coastal Portfolio')}
                type="button"
                className="btn-gold py-3.5 px-7 text-xs font-semibold flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>{t('redsea.page.requestViewingInHurghada', 'Request a Viewing in Hurghada')}</span>
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp py-3.5 px-7 text-xs font-semibold flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>{t('redsea.page.whatsAppBranch', 'WhatsApp Hurghada Branch')}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Introduction: Dedicated Coastal Division */}
      <section className="py-20 lg:py-28 bg-white border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="eyebrow-tag bg-[#F1F7FA] text-[#0B4D68]">
                <Compass className="w-3.5 h-3.5" />
                <span>{t('redsea.page.introEyebrow', 'Coastal Division Overview')}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#0F2432] tracking-tight leading-snug">
                {t('redsea.page.introTitle', 'Connecting discerning investors with Egypt\'s premier coastal developments.')}
              </h2>

              <div className="h-[2px] w-12 bg-[#C5A880] rounded-full"></div>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-light">
                {t('redsea.page.introP1', 'Operating directly through our local branch in Hurghada, Red Sea Governorate, Capital Pioneers Real Estate provides end-to-end marketing and advisory services for international vacation homebuyers, second-home seekers, and institutional tourism investors.')}
              </p>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-light">
                {t('redsea.page.introP2', 'From turnkey serviced hotel suites with guaranteed rental returns to private lagoon villas in El Gouna and elevated sea-view retreats in Sahl Hasheesh, our regional advisors provide verified project intelligence and customized payment terms.')}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                  <Check className="w-4 h-4 text-[#0B4D68]" />
                  <span>{t('redsea.page.check1', 'Licensed Developer Inventory')}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                  <Check className="w-4 h-4 text-[#0B4D68]" />
                  <span>{t('redsea.page.check2', 'On-Site Client Tours in Hurghada')}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                  <Check className="w-4 h-4 text-[#0B4D68]" />
                  <span>{t('redsea.page.check3', 'Foreign Currency Yield Advisory')}</span>
                </div>
              </div>
            </div>

            {/* Right Branch Card */}
            <div className="lg:col-span-5">
              <div className="luxury-dark-card p-8 sm:p-10 space-y-6">
                <div className="space-y-2 border-b border-white/10 pb-4">
                  <span className="text-[11px] font-semibold text-[#C5A880] uppercase tracking-wider">
                    {t('redsea.page.branchCardBadge', 'Capital Pioneers Operations')}
                  </span>
                  <h3 className="text-xl font-semibold text-white tracking-tight">
                    {t('redsea.page.branchCardTitle', 'Hurghada Regional Office')}
                  </h3>
                </div>

                <div className="space-y-4 text-xs text-slate-300 font-light">
                  <div>
                    <span className="text-slate-400 block">{t('redsea.page.officeAddressLabel', 'Office Address:')}</span>
                    <strong className="text-white font-normal text-sm mt-0.5 block">
                      {t('redsea.page.officeAddressVal', 'Hurghada Coastal Highway, Red Sea Governorate, Egypt')}
                    </strong>
                  </div>

                  <div>
                    <span className="text-slate-400 block">{t('redsea.page.coverageLabel', 'Coverage:')}</span>
                    <strong className="text-white font-normal text-sm mt-0.5 block">
                      {t('redsea.page.coverageVal', 'Hurghada, El Gouna, Sahl Hasheesh, Soma Bay & Makadi Bay')}
                    </strong>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                    <span className="text-slate-400">{t('redsea.page.waDeskLabel', 'Direct WhatsApp Desk:')}</span>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-[#C5A880] hover:underline"
                      dir="ltr"
                    >
                      +20 10 66330570
                    </a>
                  </div>
                </div>

                <button
                  onClick={() => onRequestViewing && onRequestViewing('Hurghada Branch In-Person Meeting')}
                  className="w-full btn-gold py-3 text-xs font-semibold text-center"
                >
                  {t('redsea.page.bookMeeting', 'Book an In-Person Meeting in Hurghada')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Why Invest in Red Sea Real Estate */}
      <section className="py-20 lg:py-28 bg-[#FAFBFD] border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <div className="eyebrow-tag bg-[#F1F7FA] text-[#0B4D68] mx-auto">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{t('redsea.page.whyEyebrow', 'Investment Drivers')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#0F2432] tracking-tight">
              {t('redsea.page.whyTitle', 'Why Invest in Red Sea Real Estate')}
            </h2>
            <p className="text-slate-500 text-sm font-light leading-relaxed">
              {t('redsea.page.whyDesc', 'Key economic, lifestyle, and tourism factors driving high capital appreciation and rental yield along Egypt\'s Red Sea coast.')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {investmentPillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  className="luxury-card p-7 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-[#F1F7FA] text-[#0B4D68] flex items-center justify-center shadow-soft-sm">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-semibold text-[#C5A880] bg-[#FAF7F2] border border-[#C5A880]/30 px-2.5 py-1 rounded-full">
                        {pillar.stat}
                      </span>
                    </div>

                    <h3 className="text-base font-semibold text-[#0F2432] leading-snug">
                      {pillar.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-500 font-light leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Featured Red Sea Projects Grid */}
      <section className="py-20 lg:py-28 bg-white border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div className="space-y-3">
              <div className="eyebrow-tag bg-[#F1F7FA] text-[#0B4D68]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t('redsea.page.showcaseEyebrow', 'Curated Coastal Showcase')}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#0F2432] tracking-tight">
                {t('redsea.page.showcaseTitle', 'Active Red Sea Coastal Projects [Demo Placeholders]')}
              </h2>
              <p className="text-slate-500 text-sm max-w-2xl font-light leading-relaxed">
                {t('redsea.page.showcaseDesc', 'Marketed by Capital Pioneers Red Sea Branch across Hurghada, El Gouna, and Sahl Hasheesh with flexible installment schedules.')}
              </p>
            </div>

            <Link
              to="/projects?redSea=true"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#0B4D68] hover:text-[#083e54] group self-start md:self-auto"
            >
              <span>{t('redsea.page.fullInventoryBtn', 'View Full Coastal Inventory')}</span>
              <ArrowRight className={`w-4 h-4 transition-transform ${isRTL ? 'rotate-180 group-hover:-translate-x-0.5' : 'group-hover:translate-x-0.5'}`} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {redSeaProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onRequestViewing={onRequestViewing}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Explore Red Sea Destinations (Interactive Tabs) */}
      <section className="py-20 lg:py-28 bg-[#FAFBFD] border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-3 mb-14">
            <div className="eyebrow-tag bg-[#F1F7FA] text-[#0B4D68]">
              <Compass className="w-3.5 h-3.5" />
              <span>{t('redsea.page.geoEyebrow', 'Coastal Geography')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#0F2432] tracking-tight">
              {t('redsea.page.geoTitle', 'Explore Red Sea Destinations')}
            </h2>
            <p className="text-slate-500 text-sm max-w-2xl font-light leading-relaxed">
              {t('redsea.page.geoDesc', 'Each coastal community offers distinct advantages for holiday homeowners and long-term rental investors.')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Tabs List */}
            <div className="lg:col-span-5 space-y-3">
              {RED_SEA_LOCATIONS.map((loc) => {
                const isSelected = loc.id === activeLocationId;
                const locCustom = localizedRedSeaLocations[loc.id]?.[language] || {};
                const locT = locCustom.title || loc.name;
                const locN = locCustom.name || loc.name;

                return (
                  <button
                    key={loc.id}
                    onClick={() => setActiveLocationId(loc.id)}
                    className={`w-full text-left rtl:text-right p-5 rounded-2xl transition-all duration-200 border flex items-center justify-between group ${
                      isSelected
                        ? 'bg-[#0B4D68] text-white border-[#0B4D68] shadow-soft'
                        : 'bg-white text-slate-700 border-slate-200/70 hover:bg-slate-50'
                    }`}
                  >
                    <div className="space-y-1">
                      <span
                        className={`text-[10px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full ${
                          isSelected
                            ? 'bg-[#C5A880] text-[#061D28]'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {locN}
                      </span>
                      <h3 className={`text-base font-semibold ${isSelected ? 'text-white' : 'text-[#0F2432]'}`}>
                        {locT}
                      </h3>
                    </div>

                    <ArrowRight
                      className={`w-4 h-4 transition-transform ${
                        isSelected ? 'text-[#C5A880] translate-x-1 rtl:-translate-x-1' : 'text-slate-400 group-hover:translate-x-1 rtl:group-hover:-translate-x-1'
                      } ${isRTL ? 'rotate-180' : ''}`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Detail Showcase */}
            <div className="lg:col-span-7 luxury-dark-card p-8 lg:p-10 space-y-6">
              <div className="space-y-3 border-b border-white/10 pb-5">
                <div className="flex items-center gap-2 text-[#C5A880] text-xs font-semibold uppercase tracking-wider">
                  <MapPin className="w-4 h-4" />
                  <span>{activeLocationName}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                  {activeLocationTitle}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed font-light">
                  {activeLocationDesc}
                </p>
              </div>

              {/* Highlights */}
              <div className="space-y-3">
                <span className="text-xs font-semibold text-[#C5A880] uppercase tracking-wider block">
                  {t('redsea.page.locationAdvantages', 'Location Advantages:')}
                </span>
                <div className="space-y-2 text-xs text-slate-300 font-light">
                  {activeLocationHighlights.map((hl: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-[#C5A880] flex-shrink-0" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Property Types */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  {t('redsea.page.availableUnitTypes', 'Available Unit Types:')}
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeLocationPropertyTypes.map((pt: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-white/10 rounded-lg text-xs text-white border border-white/10"
                    >
                      {pt}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Link
                  to={`/projects?location=${encodeURIComponent(rawActiveLocation.name)}`}
                  className="btn-gold py-3 px-6 text-xs text-center flex-1"
                >
                  {t('redsea.page.viewUnitsBtn', `View ${activeLocationName} Units`).replace('{name}', activeLocationName)}
                </Link>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline-white py-3 px-6 text-xs text-center flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 fill-current text-[#25D366]" />
                  <span>{t('cta.whatsappConsultation', 'WhatsApp Desk')}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. On-Site Client Concierge & Airport Transfer Section */}
      <section className="py-20 lg:py-24 bg-[#061D28] text-white border-b border-[#153648] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#C5A880] text-xs font-semibold tracking-wider uppercase mx-auto">
              <Palmtree className="w-3.5 h-3.5" />
              <span>{t('redsea.page.conciergeBadge', 'On-Site Client Concierge Service')}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white tracking-tight leading-tight">
              {t('redsea.page.conciergeTitle', 'Visiting Hurghada for Property Inspection?')}
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light max-w-2xl mx-auto">
              {t('redsea.page.conciergeDesc', 'Our Hurghada office provides personalized investor support including Hurghada International Airport transfers, guided coastal development tours, and private meetings with master developers.')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto pt-4 text-xs text-slate-300 text-left rtl:text-right">
              <div className="p-4 rounded-2xl bg-[#0A2533] border border-[#153648] flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#C5A880] flex-shrink-0" />
                <span>{t('redsea.page.airportTransfer', 'Airport Pick-Up & VIP Transport')}</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#0A2533] border border-[#153648] flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#C5A880] flex-shrink-0" />
                <span>{t('redsea.page.siteVisits', 'Private Masterplan Site Visits')}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <a
                href={TEL_URL}
                className="btn-gold w-full sm:w-auto py-3.5 px-8 text-xs font-semibold flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>{t('redsea.page.callHurghada', 'Call Hurghada Desk: 01066330570')}</span>
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp w-full sm:w-auto py-3.5 px-8 text-xs font-semibold flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>{t('redsea.page.waConcierge', 'WhatsApp Concierge Tour')}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Dedicated Red Sea Viewing & Inquiry Form */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 space-y-6">
              <div className="eyebrow-tag bg-[#F1F7FA] text-[#0B4D68]">
                <Building2 className="w-3.5 h-3.5" />
                <span>{t('redsea.page.inquiryEyebrow', 'Private Consultation')}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-semibold text-[#0F2432] tracking-tight leading-snug">
                {t('redsea.page.inquiryTitle', 'Request a Red Sea Property Viewing or Brochure')}
              </h2>

              <div className="h-[2px] w-12 bg-[#C5A880] rounded-full"></div>

              <p className="text-slate-600 text-sm font-light leading-relaxed">
                {t('redsea.page.inquiryDesc', 'Submit your inquiry to connect with our Hurghada advisory team and receive current inventory pricing, installment schedules, and viewing availability.')}
              </p>

              <div className="p-5 rounded-2xl bg-[#061D28] text-white space-y-2 shadow-soft-dark text-xs">
                <div className="text-[#C5A880] font-semibold uppercase tracking-wider">
                  {t('redsea.page.branchOfficeName', 'Hurghada Red Sea Branch Office')}
                </div>
                <div className="text-slate-300 font-light">
                  {t('redsea.page.branchAddress', 'Hurghada Coastal Highway, Red Sea Governorate, Egypt')}
                </div>
                <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                  <span>Hotline:</span>
                  <a href={TEL_URL} className="text-[#C5A880] font-semibold hover:underline" dir="ltr">
                    {PRIMARY_PHONE}
                  </a>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <MainLeadForm
                initialProject="General Hurghada / Red Sea Consultation"
                source="red_sea_page"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RedSeaPage;
