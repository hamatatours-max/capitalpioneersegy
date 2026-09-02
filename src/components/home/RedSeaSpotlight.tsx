import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Waves, Sun, Anchor, ArrowRight, MessageCircle, MapPin } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface RedSeaSpotlightProps {
  onRequestViewing?: (projectName: string) => void;
}

export const RedSeaSpotlight: React.FC<RedSeaSpotlightProps> = ({ onRequestViewing }) => {
  const { t, isRTL, language } = useLanguage();

  return (
    <section className="py-24 lg:py-32 bg-[#061D28] text-white border-b border-[#153648] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="eyebrow-tag bg-[#C5A880]/15 border border-[#C5A880]/30 text-[#C5A880]">
              <Compass className="w-3.5 h-3.5" />
              <span>{t('redsea.spotlight.eyebrow', 'Dedicated Coastal Division')}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white tracking-tight leading-snug">
              {t('redsea.spotlight.title', 'Capital Pioneers Red Sea')} <br />
              <span className="text-[#C5A880] font-normal text-xl sm:text-2xl block mt-1">
                {t('redsea.spotlight.subtitle', 'Hurghada & Coastal Portfolio')}
              </span>
            </h2>

            <div className="h-[2px] w-12 bg-[#C5A880] rounded-full"></div>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light">
              {t('redsea.spotlight.desc', 'Through our dedicated branch in Hurghada, Red Sea, Egypt, Capital Pioneers delivers specialized marketing and advisory services for prime beachfront residences, marina chalets, and hotel-managed hospitality assets across the Red Sea coastline.')}
            </p>

            {/* Coastal Advantages */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-[#0A2533] border border-[#153648] space-y-2">
                <Waves className="w-5 h-5 text-[#9AC6DB]" />
                <h4 className="text-xs font-semibold text-white">{t('redsea.spotlight.card1Title', 'Beachfront Living')}</h4>
                <p className="text-[11px] text-slate-400 font-light leading-relaxed">{t('redsea.spotlight.card1Desc', 'Direct shoreline developments in Hurghada & El Gouna.')}</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#0A2533] border border-[#153648] space-y-2">
                <Sun className="w-5 h-5 text-[#C5A880]" />
                <h4 className="text-xs font-semibold text-white">{t('redsea.spotlight.card2Title', 'Year-Round Sun')}</h4>
                <p className="text-[11px] text-slate-400 font-light leading-relaxed">{t('redsea.spotlight.card2Desc', 'High tourism demand & foreign investment appeal.')}</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#0A2533] border border-[#153648] space-y-2">
                <Anchor className="w-5 h-5 text-[#9AC6DB]" />
                <h4 className="text-xs font-semibold text-white">{t('redsea.spotlight.card3Title', 'Rental Returns')}</h4>
                <p className="text-[11px] text-slate-400 font-light leading-relaxed">{t('redsea.spotlight.card3Desc', 'Managed serviced suites with strong rental yields.')}</p>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <Link
                to="/capital-pioneers-red-sea"
                className="btn-gold py-3.5 px-6 text-xs flex items-center justify-center gap-2 group text-center"
              >
                <span>{t('redsea.spotlight.exploreBtn', 'Explore Red Sea Hub')}</span>
                <ArrowRight className={`w-4 h-4 transition-transform ${isRTL ? 'rotate-180 group-hover:-translate-x-0.5' : 'group-hover:translate-x-0.5'}`} />
              </Link>

              <a
                href="https://wa.me/201066330570?text=Hello%20Capital%20Pioneers%20Red%20Sea%20Branch,%20I%20am%20inquiring%20about%20Hurghada%20and%20coastal%20properties."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp py-3.5 px-6 text-xs flex items-center justify-center gap-2 text-center"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>{t('redsea.spotlight.contactBtn', 'Contact Hurghada Desk')}</span>
              </a>
            </div>
          </div>

          {/* Right Column: Coastal Opportunity Highlight Card */}
          <div className="lg:col-span-6">
            <div className="luxury-dark-card p-7 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#C5A880]" />
                  <span className="text-xs font-semibold tracking-wide text-[#C5A880]">
                    {t('redsea.spotlight.featuredAsset', 'Hurghada Branch Featured Asset')}
                  </span>
                </div>
                <span className="text-[10px] font-medium px-2.5 py-0.5 rounded-full bg-[#0B4D68] text-white">
                  {language === 'ar' ? 'مشروع مميز' : language === 'de' ? 'Empfohlenes Projekt' : 'Featured Opportunity'}
                </span>
              </div>

              {/* Card visual with real verified asset */}
              <div className="aspect-[16/9] bg-[#0A2533] rounded-2xl border border-white/10 relative overflow-hidden flex items-center justify-center text-center group">
                <img
                  src="/images/projects/platinum-resort-hurghada/platinum-video-poster.jpg"
                  alt="Platinum Resort Hurghada"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#061D28] via-[#061D28]/40 to-transparent flex flex-col justify-end p-5 text-left rtl:text-right">
                  <span className="text-[11px] font-bold text-[#C5A880] uppercase tracking-wider">PLATINUM RESORT HURGHADA</span>
                  <h4 className="text-base font-semibold text-white">
                    {language === 'ar' ? 'منتجع بلاتينيوم الغردقة — ممشى مجاويش' : 'Platinum Resort Hurghada — Magawish Strip'}
                  </h4>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs text-slate-300">
                <div className="bg-[#061D28] p-3 rounded-xl border border-white/10">
                  <span className="text-[11px] text-slate-400 block font-light">{t('redsea.spotlight.locationsLabel', 'Locations:')}</span>
                  <span className="font-semibold text-white mt-0.5 block">
                    {language === 'ar' ? 'الغردقة • البحر الأحمر' : 'Hurghada • Red Sea'}
                  </span>
                </div>
                <div className="bg-[#061D28] p-3 rounded-xl border border-white/10">
                  <span className="text-[11px] text-slate-400 block font-light">{t('redsea.spotlight.paymentLabel', 'Payment Options:')}</span>
                  <span className="font-semibold text-[#C5A880] mt-0.5 block">
                    {language === 'ar' ? 'مقدم 10% وتقسيط حتى 5 سنوات' : '10% DP • Installments Up to 5 Years'}
                  </span>
                </div>
              </div>

              <Link
                to="/projects/platinum-resort-hurghada"
                className="w-full btn-outline-white py-3 text-xs flex items-center justify-center gap-2"
              >
                <span>{language === 'ar' ? 'استعراض تفاصيل منتجع بلاتينيوم' : 'View Platinum Resort Details'}</span>
                <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RedSeaSpotlight;
