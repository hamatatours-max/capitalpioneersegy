import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Compass, ArrowRight, CheckCircle2 } from 'lucide-react';
import { LOCATIONS_LIST } from '@/data/projectsData';
import { useLanguage } from '@/context/LanguageContext';

export const ExploreByLocation: React.FC = () => {
  const [activeLocationId, setActiveLocationId] = useState(LOCATIONS_LIST[0].id);
  const { t, isRTL, language } = useLanguage();

  const rawActiveLoc = LOCATIONS_LIST.find((loc) => loc.id === activeLocationId) || LOCATIONS_LIST[0];

  const localizedLocations: Record<string, Record<string, any>> = {
    'new-cairo': {
      ar: {
        title: 'القاهرة الجديدة (التجمع الخامس)',
        subtitle: 'مقر كابيتال بايونيرز الرئيسي',
        tag: 'مركز الاستشارات الرئيسي',
        description: 'أهم محاور الاستثمار العقاري في مصر ويشمل الشويفات، التسعين الشمالي والجنوبي، المربع الذهبي (Golden Square)، وكبرى المجمعات الطبية والتجارية.',
        projectCount: 'أكثر من 12 فرصة استثمارية',
      },
      de: {
        title: 'Neu-Kairo (Fifth Settlement)',
        subtitle: 'Capital Pioneers Hauptsitz',
        tag: 'Hauptberatungs-Hub',
        description: 'Ägyptens führender Entwicklungskorridor mit Al Shouyfat, North & South 90th Street, Golden Square und erstklassigen Ärzte- und Gewerbekomplexen.',
        projectCount: '12+ Projekte',
      },
    },
    'red-sea': {
      ar: {
        title: 'الغردقة وساحل البحر الأحمر',
        subtitle: 'فرع كابيتال بايونيرز البحر الأحمر',
        tag: 'قطاع الاستثمار الساحلي',
        description: 'يقدم فرعنا المتخصص بالغردقة خدماته للمستثمرين الباحثين عن شاليهات شاطئية، شقق فندقية مدارة، وفيلات فاخرة بالجونة وسهل حشيش والغردقة.',
        projectCount: 'أكثر من 8 فرص ساحلية',
      },
      de: {
        title: 'Hurghada & Rotes Meer Küste',
        subtitle: 'Capital Pioneers Niederlassung Rotes Meer',
        tag: 'Küsten- & Investitions-Hub',
        description: 'Unsere spezialisierte Niederlassung am Roten Meer berät Investoren bei Strandchalets, hotelverwalteten Suiten und Luxusvillen in Hurghada, El Gouna und Sahl Hasheesh.',
        projectCount: '8+ Projekte',
      },
    },
    'new-capital': {
      ar: {
        title: 'العاصمة الإدارية الجديدة',
        subtitle: 'حي المال والأعمال والأبراج الإدارية',
        tag: 'أبراج إدارية وتجارية',
        description: 'المركز المستقبلي للمال والأعمال في مصر، ويضم مقرات الشركات العالمية والبنوك والأبراج الذكية المطلة على النهر الأخضر.',
        projectCount: 'أكثر من 6 فرص إدارية',
      },
      de: {
        title: 'Neue Verwaltungshauptstadt',
        subtitle: 'Central Business District & Finanztürme',
        tag: 'Büro- & Gewerbe-Hub',
        description: 'Das künftige Finanzzentrum Ägyptens mit multinationalen Firmenzentralen und smarten Wolkenkratzern mit Blick auf den Green River.',
        projectCount: '6+ Projekte',
      },
    },
    'mostakbal-city': {
      ar: {
        title: 'مدينة المستقبل (شرق القاهرة)',
        subtitle: 'المجتمعات السكنية الخضراء الذكية',
        tag: 'كمبوندات سكنية متكاملة',
        description: 'أكبر امتداد عمراني أخضر يربط بين القاهرة الجديدة والعاصمة الإدارية، ويضم أرقى الكمبوندات والفيلات المستقلة والمدارس الدولية.',
        projectCount: 'أكثر من 5 مجمعات سكنية',
      },
      de: {
        title: 'Mostakbal City (Ost-Kairo)',
        subtitle: 'Grüne Smart-City-Wohnanlagen',
        tag: 'Integrierte Wohnresidenzen',
        description: 'Der größte grüne Entwicklungskorridor, der Neu-Kairo mit der Neuen Hauptstadt verbindet, mit exklusiven Villen und Parks.',
        projectCount: '5+ Projekte',
      },
    },
  };

  const activeLocData = localizedLocations[rawActiveLoc.id]?.[language] || {};
  const activeLocTitle = activeLocData.title || rawActiveLoc.title;
  const activeLocTag = activeLocData.tag || rawActiveLoc.tag;
  const activeLocDescription = activeLocData.description || rawActiveLoc.description;

  return (
    <section className="py-24 lg:py-32 bg-white border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="space-y-3 mb-14">
          <div className="eyebrow-tag bg-[#F1F7FA] text-[#0B4D68]">
            <Compass className="w-3.5 h-3.5" />
            <span>{t('location.eyebrow', 'Strategic Geographies')}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#0F2432] tracking-tight">
            {t('location.title', 'Explore Property Opportunities by Location')}
          </h2>
          <p className="text-slate-500 text-sm max-w-2xl font-light leading-relaxed">
            {t('location.desc', 'Capital Pioneers operates across Egypt’s high-growth investment regions, anchored by our New Cairo Headquarters and Hurghada Red Sea Branch.')}
          </p>
        </div>

        {/* Location Interactive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Location Selector Tabs (Left) */}
          <div className="lg:col-span-5 space-y-3">
            {LOCATIONS_LIST.map((loc) => {
              const isActive = loc.id === activeLocationId;
              const locCustom = localizedLocations[loc.id]?.[language] || {};
              const locT = locCustom.title || loc.title;
              const locSub = locCustom.subtitle || loc.subtitle;
              const locTg = locCustom.tag || loc.tag;
              const locCount = locCustom.projectCount || loc.projectCount;

              return (
                <button
                  key={loc.id}
                  onClick={() => setActiveLocationId(loc.id)}
                  className={`w-full text-left rtl:text-right p-5 rounded-2xl transition-all duration-250 border flex items-center justify-between group ${
                    isActive
                      ? 'bg-[#0B4D68] text-white border-[#0B4D68] shadow-soft'
                      : 'bg-[#FAFBFD] text-slate-700 border-slate-200/70 hover:bg-slate-100/70 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full ${
                          isActive
                            ? 'bg-[#C5A880] text-[#061D28]'
                            : 'bg-slate-200/80 text-slate-700'
                        }`}
                      >
                        {locTg}
                      </span>
                      <span className={`text-xs ${isActive ? 'text-slate-300' : 'text-slate-400'}`}>
                        {locCount}
                      </span>
                    </div>
                    <h3 className={`text-base font-semibold ${isActive ? 'text-white' : 'text-[#0F2432]'}`}>
                      {locT}
                    </h3>
                    <div className={`text-xs ${isActive ? 'text-slate-200' : 'text-slate-500'} font-light`}>
                      {locSub}
                    </div>
                  </div>

                  <ArrowRight
                    className={`w-4 h-4 transition-transform ${
                      isActive ? 'text-[#C5A880] translate-x-1 rtl:-translate-x-1' : 'text-slate-400 group-hover:translate-x-1 rtl:group-hover:-translate-x-1'
                    } ${isRTL ? 'rotate-180' : ''}`}
                  />
                </button>
              );
            })}
          </div>

          {/* Location Detail Showcase Card (Right) */}
          <div className="lg:col-span-7 luxury-dark-card p-8 lg:p-10 space-y-6">
            <div className="space-y-3 border-b border-white/10 pb-6">
              <div className="flex items-center gap-2 text-[#C5A880] text-xs font-semibold uppercase tracking-wider">
                <MapPin className="w-4 h-4" />
                <span>{activeLocTag}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                {activeLocTitle}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed font-light">
                {activeLocDescription}
              </p>
            </div>

            {/* Strategic Highlights */}
            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#C5A880] flex-shrink-0" />
                <span className="font-light">{t('location.highlight1', 'Direct developer allocations and customized installment schedules.')}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#C5A880] flex-shrink-0" />
                <span className="font-light">{t('location.highlight2', 'On-the-ground consultation from our regional advisors.')}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#C5A880] flex-shrink-0" />
                <span className="font-light">{t('location.highlight3', 'Full commercial and medical feasibility analysis.')}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                to={`/projects?location=${encodeURIComponent(rawActiveLoc.title)}`}
                className="btn-gold py-3 px-6 text-xs text-center"
              >
                {t('location.browseBtn', `Browse ${activeLocTitle} Projects`).replace('{name}', activeLocTitle)}
              </Link>
              <a
                href="https://wa.me/201066330570"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline-white py-3 px-6 text-xs text-center"
              >
                {t('cta.whatsappConsultation', 'Inquire on WhatsApp')} (+20 10 66330570)
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExploreByLocation;
