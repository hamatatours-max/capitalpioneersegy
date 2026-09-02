import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Navigation, ArrowRight, Building2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { trackMapInteraction } from '@/services/analyticsService';

interface RegionalHub {
  id: string;
  name: string;
  type: string;
  coordinates: string;
  description: string;
  projectsCount: string;
  activeProjects: string[];
  googleMapsUrl: string;
  categoryTag: string;
}

interface ProjectMapSectionProps {
  onRequestViewing?: (projectName?: string) => void;
}

export const ProjectMapSection: React.FC<ProjectMapSectionProps> = () => {
  const [selectedHubId, setSelectedHubId] = useState<string>('new-cairo');
  const { t, isRTL, language } = useLanguage();

  const hubs: RegionalHub[] = [
    {
      id: 'new-cairo',
      name: language === 'ar' ? 'القاهرة الجديدة (المقر الرئيسي)' : language === 'de' ? 'Neu-Kairo (Hauptsitz)' : 'New Cairo (Headquarters)',
      type: language === 'ar' ? 'المقر الرئيسي ومركز الاستشارات' : language === 'de' ? 'Hauptsitz & Beratungszentrum' : 'Corporate HQ & Primary Advisory Hub',
      coordinates: '30.0131° N, 31.4285° E',
      description: language === 'ar' 
        ? 'الشويفات، التجمع الخامس — مركز التسويق المتخصص للمشاريع الطبية والتجارية والمكاتب الإدارية ومجمعات الجولدن سكوير.'
        : language === 'de'
        ? 'Al Shouyfat, Fifth Settlement — Strategisches Zentrum für Facharztpraxen, Gewerbeimmobilien und Golden Square Wohnanlagen.'
        : 'Al Shouyfat, Fifth Settlement — Core operational base for specialized medical complexes, North 90th commercial strips, and Golden Square compounds.',
      projectsCount: language === 'ar' ? 'أكثر من 8 مشاريع' : '8+ Projects',
      activeProjects: [
        language === 'ar' ? 'CORE POINT (بجوار مستشفى الجوي)' : 'CORE POINT (Beside Air Force Hospital)',
        language === 'ar' ? 'KERNEL MALL (التسعين الشمالي)' : 'KERNEL MALL (North 90th Street)',
        language === 'ar' ? 'NEXUS MALL (القطاع الثاني)' : 'NEXUS MALL (Second Sector)',
      ],
      googleMapsUrl: 'https://maps.google.com/?q=30.0131,31.4285',
      categoryTag: language === 'ar' ? 'المقر الرئيسي' : 'HQ Primary',
    },
    {
      id: 'red-sea',
      name: language === 'ar' ? 'الغردقة وساحل البحر الأحمر' : language === 'de' ? 'Hurghada (Niederlassung Rotes Meer)' : 'Hurghada & Red Sea Coast',
      type: language === 'ar' ? 'الفرع الساحلي الإقليمي' : language === 'de' ? 'Regionale Küstenniederlassung' : 'Regional Coastal & Leisure Branch',
      coordinates: '27.2579° N, 33.8116° E',
      description: language === 'ar'
        ? 'طريق الغردقة الساحلي — فرعنا الساحلي لتسويق الشاليهات الشاطئية والشقق الفندقية ومشاريع الغردقة والعين السخنة والساحل.'
        : language === 'de'
        ? 'Hurghada Coastal Highway — Spezialisierte Vermarktung von Strandchalets, Serviced-Apartments und Lagunenvillen in Hurghada und Ain Sokhna.'
        : 'Hurghada Coastal Highway — Dedicated seaside branch marketing beachfront chalets, hotel-serviced apartments, and coastal resorts across Hurghada, Ain Sokhna, and the North Coast.',
      projectsCount: language === 'ar' ? 'أكثر من 5 مشاريع' : '5+ Projects',
      activeProjects: [
        language === 'ar' ? 'MARINA HILLS SOKHNA (فنادق جرافيتي)' : 'MARINA HILLS SOKHNA (Gravity Hotels)',
        language === 'ar' ? 'PLATINUM RESORT HURGHADA (الممشى)' : 'PLATINUM RESORT HURGHADA (Magawish)',
        language === 'ar' ? 'SOKHNA TIME (مارينا اليخوت)' : 'SOKHNA TIME (Yacht Marina)',
      ],
      googleMapsUrl: 'https://maps.google.com/?q=27.2579,33.8116',
      categoryTag: language === 'ar' ? 'فرع البحر الأحمر' : 'Red Sea Hub',
    },
    {
      id: 'new-capital',
      name: language === 'ar' ? 'العاصمة الإدارية الجديدة' : language === 'de' ? 'Neue Verwaltungshauptstadt' : 'New Administrative Capital',
      type: language === 'ar' ? 'محور الأبراج الإدارية وحي المال' : language === 'de' ? 'CBD & Regierungsviertel' : 'CBD & Financial District Focus',
      coordinates: '30.0167° N, 31.7500° E',
      description: language === 'ar'
        ? 'حي الداون تاون وحي المال والأعمال — تسويق المقرات الإدارية للشركات والبنوك والمحلات التجارية المتميزة.'
        : language === 'de'
        ? 'Downtown & Central Business District (CBD) — Vermarktung von Bürotürmen, Bankensitzen und Gewerbeflächen.'
        : 'Downtown & Central Business District (CBD) — Grade-A administrative towers, banking headquarters, and commercial retail flagships.',
      projectsCount: language === 'ar' ? 'مشاريع الداون تاون' : 'Downtown Projects',
      activeProjects: [
        language === 'ar' ? 'DOWNTOWN 1 & DOWNTOWN 2' : 'DOWNTOWN 1 & DOWNTOWN 2',
      ],
      googleMapsUrl: 'https://maps.google.com/?q=30.0167,31.7500',
      categoryTag: language === 'ar' ? 'حي المال والداون تاون' : 'CBD & Downtown',
    },
  ];

  const activeHub = hubs.find((h) => h.id === selectedHubId) || hubs[0];

  const handleHubSelect = (hub: RegionalHub) => {
    setSelectedHubId(hub.id);
    trackMapInteraction(hub.id, hub.name, hub.type, hub.coordinates);
  };

  return (
    <section className="py-24 lg:py-32 bg-white border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="space-y-3 mb-14">
          <div className="eyebrow-tag bg-[#F1F7FA] text-[#0B4D68]">
            <MapPin className="w-3.5 h-3.5" />
            <span>{t('map.eyebrow', 'Geographic Distribution')}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#0F2432] tracking-tight">
            {t('map.title', 'Strategic Geographic Coverage Across Egypt')}
          </h2>
          <p className="text-slate-500 text-sm max-w-2xl font-light leading-relaxed">
            {t('map.desc', 'Marketed directly through our dual corporate operations in New Cairo (Headquarters) and Hurghada (Red Sea Branch).')}
          </p>
        </div>

        {/* Map Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Hubs Selector List */}
          <div className="lg:col-span-5 space-y-3">
            {hubs.map((hub) => {
              const isSelected = hub.id === selectedHubId;
              return (
                <button
                  key={hub.id}
                  onClick={() => handleHubSelect(hub)}
                  type="button"
                  className={`w-full text-left rtl:text-right p-5 rounded-2xl transition-all duration-200 border flex items-center justify-between group ${
                    isSelected
                      ? 'bg-[#0B4D68] text-white border-[#0B4D68] shadow-soft'
                      : 'bg-[#FAFBFD] text-slate-700 border-slate-200/70 hover:bg-slate-100/70 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full ${
                          isSelected
                            ? 'bg-[#C5A880] text-[#061D28]'
                            : 'bg-slate-200/80 text-slate-700'
                        }`}
                      >
                        {hub.categoryTag}
                      </span>
                      <span className={`text-xs ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                        {hub.projectsCount}
                      </span>
                    </div>

                    <h3 className={`text-base font-semibold ${isSelected ? 'text-white' : 'text-[#0F2432]'}`}>
                      {hub.name}
                    </h3>
                    <div className={`text-xs ${isSelected ? 'text-slate-200' : 'text-slate-500'} font-light`}>
                      {hub.type}
                    </div>
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

          {/* Right Interactive Hub Card */}
          <div className="lg:col-span-7 luxury-dark-card p-8 lg:p-10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-5">
              <div className="space-y-1">
                <span className="text-xs uppercase font-semibold text-[#C5A880] tracking-wider">
                  {activeHub.categoryTag}
                </span>
                <h3 className="text-2xl font-semibold text-white tracking-tight">
                  {activeHub.name}
                </h3>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 self-start sm:self-auto">
                <Navigation className="w-3.5 h-3.5 text-[#C5A880]" />
                <span dir="ltr">{activeHub.coordinates}</span>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed font-light">
              {activeHub.description}
            </p>

            {/* Active Projects List */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider block">
                {t('map.regionalFocus', 'Regional Focus:')}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {activeHub.activeProjects.map((pName, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 bg-[#0A2533] p-3 rounded-xl border border-white/10 text-xs text-slate-200"
                  >
                    <Building2 className="w-4 h-4 text-[#C5A880] flex-shrink-0" />
                    <span className="font-light truncate">{pName}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                to={`/projects?location=${encodeURIComponent(activeHub.name)}`}
                className="btn-gold py-3 px-6 text-xs text-center flex-1"
              >
                {t('map.exploreProjects', `Explore ${activeHub.name} Projects`).replace('{name}', activeHub.name)}
              </Link>

              <a
                href={activeHub.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackMapInteraction(activeHub.id, activeHub.name, activeHub.type, activeHub.coordinates)}
                className="btn-outline-white py-3 px-6 text-xs text-center flex items-center justify-center gap-2"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>{t('cta.viewOnMaps', 'View on Google Maps')}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectMapSection;
