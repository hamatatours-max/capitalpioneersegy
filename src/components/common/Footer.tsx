import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Phone, 
  MessageCircle, 
  Compass, 
  ChevronRight, 
  ShieldCheck,
  Instagram,
  Facebook
} from 'lucide-react';
import { Logo } from './Logo';
import { useLanguage } from '@/context/LanguageContext';
import { PRIMARY_PHONE, TEL_URL, WHATSAPP_BASE_URL } from '@/services/leadService';
import { trackClickPhone, trackClickWhatsApp } from '@/services/analyticsService';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { t, isRTL } = useLanguage();

  const handlePhoneClick = () => {
    trackClickPhone('footer_phone_link');
  };

  const handleWhatsAppClick = () => {
    trackClickWhatsApp('footer_whatsapp_link');
  };

  const whatsappUrl = `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(
    'Hello Capital Pioneers Real Estate, I am inquiring about property opportunities across Egypt.'
  )}`;

  return (
    <footer className="bg-[#061D28] text-white border-t border-[#153648]">
      {/* Top Main Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Column 1: Brand & Identity */}
          <div className="lg:col-span-4 space-y-6">
            <Logo size="lg" variant="light" />
            <p className="text-slate-300 text-xs sm:text-sm font-light leading-relaxed max-w-sm">
              {t('footer.aboutText', 'Capital Pioneers Real Estate is a professional real estate marketing firm specializing in marketing premier medical, commercial, residential, and coastal developments across Egypt.')}
            </p>

            <div className="flex items-center gap-3 pt-2">
              {/* Facebook */}
              <a
                href="https://facebook.com/CapitalPioneersRealEstate"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit Capital Pioneers on Facebook"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#C5A880] hover:text-[#061D28] text-slate-300 flex items-center justify-center transition-all"
              >
                <Facebook className="w-4 h-4" />
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com/capitalpioneers"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit Capital Pioneers on Instagram"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#C5A880] hover:text-[#061D28] text-slate-300 flex items-center justify-center transition-all"
              >
                <Instagram className="w-4 h-4" />
              </a>

              {/* WhatsApp */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleWhatsAppClick}
                aria-label="Chat with Capital Pioneers on WhatsApp"
                className="w-9 h-9 rounded-full bg-[#25D366]/20 hover:bg-[#25D366] text-[#25D366] hover:text-white flex items-center justify-center transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs uppercase tracking-wider text-[#C5A880] font-semibold">
              {t('footer.navigationTitle', 'Navigation')}
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-300 font-light">
              <li>
                <Link to="/" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className={`w-3 h-3 text-[#C5A880] ${isRTL ? 'rotate-180' : ''}`} />
                  <span>{t('nav.home', 'Home')}</span>
                </Link>
              </li>
              <li>
                <Link to="/projects" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className={`w-3 h-3 text-[#C5A880] ${isRTL ? 'rotate-180' : ''}`} />
                  <span>{t('nav.projects', 'Projects')}</span>
                </Link>
              </li>
              <li>
                <Link to="/capital-pioneers-red-sea" className="hover:text-white transition-colors flex items-center gap-1.5 text-[#C5A880] font-medium">
                  <ChevronRight className={`w-3 h-3 text-[#C5A880] ${isRTL ? 'rotate-180' : ''}`} />
                  <span>{t('nav.redSea', 'Red Sea Branch')}</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className={`w-3 h-3 text-[#C5A880] ${isRTL ? 'rotate-180' : ''}`} />
                  <span>{t('nav.about', 'About Us')}</span>
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className={`w-3 h-3 text-[#C5A880] ${isRTL ? 'rotate-180' : ''}`} />
                  <span>{t('nav.services', 'Services')}</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className={`w-3 h-3 text-[#C5A880] ${isRTL ? 'rotate-180' : ''}`} />
                  <span>{t('nav.contact', 'Contact')}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Project Sectors */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs uppercase tracking-wider text-[#C5A880] font-semibold">
              {t('footer.categoriesTitle', 'Project Categories')}
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-300 font-light">
              <li>
                <Link to="/projects?category=Medical" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className={`w-3 h-3 text-[#C5A880] ${isRTL ? 'rotate-180' : ''}`} />
                  <span>{t('footer.medicalCat', 'Medical & Healthcare Clinics')}</span>
                </Link>
              </li>
              <li>
                <Link to="/projects?category=Commercial" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className={`w-3 h-3 text-[#C5A880] ${isRTL ? 'rotate-180' : ''}`} />
                  <span>{t('footer.commercialCat', 'Commercial & Retail Centers')}</span>
                </Link>
              </li>
              <li>
                <Link to="/projects?category=Coastal" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className={`w-3 h-3 text-[#C5A880] ${isRTL ? 'rotate-180' : ''}`} />
                  <span>{t('footer.coastalCat', 'Red Sea Coastal Residences')}</span>
                </Link>
              </li>
              <li>
                <Link to="/projects?category=Administrative" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className={`w-3 h-3 text-[#C5A880] ${isRTL ? 'rotate-180' : ''}`} />
                  <span>{t('footer.adminCat', 'Administrative & CBD Towers')}</span>
                </Link>
              </li>
              <li>
                <Link to="/projects?category=Residential" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronRight className={`w-3 h-3 text-[#C5A880] ${isRTL ? 'rotate-180' : ''}`} />
                  <span>{t('footer.residentialCat', 'Residential Communities')}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Corporate Offices */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs uppercase tracking-wider text-[#C5A880] font-semibold">
              {t('footer.officesTitle', 'Office Locations')}
            </h3>

            <div className="space-y-4 text-xs text-slate-300 font-light">
              {/* HQ */}
              <div className="space-y-1">
                <strong className="text-white font-medium flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>{t('footer.hqLabel', 'Corporate Headquarters:')}</span>
                </strong>
                <p className="pl-5 rtl:pr-5 rtl:pl-0 text-slate-400">
                  {t('footer.hqVal', 'Al Shouyfat, Fifth Settlement, New Cairo, Egypt')}
                </p>
              </div>

              {/* Hurghada */}
              <div className="space-y-1">
                <strong className="text-white font-medium flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>{t('footer.branchLabel', 'Regional Coastal Branch:')}</span>
                </strong>
                <p className="pl-5 rtl:pr-5 rtl:pl-0 text-slate-400">
                  {t('footer.branchVal', 'Hurghada, Red Sea, Egypt')}
                </p>
              </div>

              {/* Phone & WhatsApp */}
              <div className="pt-2 border-t border-white/10 space-y-1">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#C5A880]" />
                  <a
                    href={TEL_URL}
                    onClick={handlePhoneClick}
                    className="hover:text-white font-semibold text-white transition-colors"
                    dir="ltr"
                  >
                    {PRIMARY_PHONE}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleWhatsAppClick}
                    className="hover:text-white font-medium text-slate-300 transition-colors"
                    dir="ltr"
                  >
                    +20 10 66330570
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright & Disclaimer */}
      <div className="border-t border-white/10 py-6 px-4 sm:px-6 lg:px-8 text-xs text-slate-400 font-light">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#C5A880]" />
            <span>{t('footer.copyright', `© ${currentYear} Capital Pioneers Real Estate. All rights reserved.`).replace('{year}', currentYear.toString())}</span>
          </div>

          <div className="flex items-center gap-6 text-[11px]">
            <Link to="/about" className="hover:text-white transition-colors">
              {t('nav.about', 'About Capital Pioneers')}
            </Link>
            <Link to="/contact" className="hover:text-white transition-colors">
              {t('nav.contact', 'Contact Desk')}
            </Link>
            <a href="https://capitalpioneers.com/sitemap.xml" className="hover:text-white transition-colors">
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
