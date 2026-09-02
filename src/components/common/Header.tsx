import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Phone, 
  MessageCircle, 
  Menu, 
  X, 
  Compass, 
  MapPin, 
  Calendar,
  ChevronRight,
} from 'lucide-react';
import { Logo } from './Logo';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useLanguage } from '@/context/LanguageContext';
import { PRIMARY_PHONE, TEL_URL, WHATSAPP_BASE_URL } from '@/services/leadService';
import { trackClickPhone, trackClickWhatsApp, trackRequestViewing } from '@/services/analyticsService';

interface HeaderProps {
  onRequestViewing?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onRequestViewing }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { t, isRTL } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: t('nav.home', 'Home'), path: '/' },
    { name: t('nav.projects', 'Projects'), path: '/projects' },
    { 
      name: t('nav.redSea', 'Capital Pioneers Red Sea'), 
      path: '/capital-pioneers-red-sea', 
      highlight: true,
    },
    { name: t('nav.about', 'About'), path: '/about' },
    { name: t('nav.services', 'Services'), path: '/services' },
    { name: t('nav.contact', 'Contact'), path: '/contact' },
  ];

  const handleViewingClick = () => {
    trackRequestViewing('header_cta');
    if (onRequestViewing) {
      onRequestViewing();
    } else {
      const leadSection = document.getElementById('lead-form-section');
      if (leadSection) {
        leadSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.href = '/contact#viewing';
      }
    }
  };

  const handlePhoneClick = () => {
    trackClickPhone('header_phone_button');
  };

  const handleWhatsAppClick = () => {
    trackClickWhatsApp('header_whatsapp_button');
  };

  const whatsappUrl = `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(
    'Hello Capital Pioneers Real Estate, I am inquiring about property opportunities across Egypt.'
  )}`;

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-soft border-b border-slate-200/70'
          : 'bg-white border-b border-slate-100'
      }`}
    >
      {/* 1. Top Mini Information Bar */}
      <div className="bg-[#061D28] text-white py-1.5 px-4 sm:px-6 lg:px-8 text-[11px] font-normal border-b border-white/10 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6 text-slate-300">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>{t('topbar.hq', 'HQ: Al Shouyfat, Fifth Settlement, New Cairo')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>{t('topbar.branch', 'Branch: Hurghada, Red Sea, Egypt')}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[#C5A880] font-medium">{t('topbar.tagline', 'Official Real Estate Marketing')}</span>
            <span className="text-slate-500">|</span>
            <a
              href={TEL_URL}
              onClick={handlePhoneClick}
              className="text-white hover:text-[#C5A880] transition-colors flex items-center gap-1 font-medium"
            >
              <Phone className="w-3 h-3 text-[#C5A880]" />
              <span dir="ltr">{PRIMARY_PHONE}</span>
            </a>
            <span className="text-slate-500">|</span>
            {/* Topbar Language Switcher */}
            <LanguageSwitcher variant="topbar" />
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-22">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo size="md" />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1.5 xl:space-x-3 text-[13px] xl:text-[14px] font-medium text-slate-700 rtl:space-x-reverse">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3.5 py-2 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'text-[#0B4D68] bg-[#F1F7FA] font-semibold'
                      : link.highlight
                      ? 'text-[#0B4D68] hover:bg-[#F1F7FA] font-medium border border-[#0B4D68]/20'
                      : 'hover:text-[#0B4D68] hover:bg-slate-50/80 text-slate-600'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Direct CTAs & Language Switcher */}
          <div className="hidden lg:flex items-center gap-2.5 xl:gap-3">
            {/* Desktop Language Switcher (EN | AR | DE) */}
            <LanguageSwitcher variant="desktop" />

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleWhatsAppClick}
              className="btn-whatsapp py-2.5 px-3.5 text-xs font-semibold"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>{t('nav.whatsappUs', 'WhatsApp Us')}</span>
            </a>

            <button
              onClick={handleViewingClick}
              type="button"
              className="btn-primary py-2.5 px-4 text-xs font-semibold"
            >
              <Calendar className="w-4 h-4" />
              <span>{t('nav.requestViewing', 'Request a Viewing')}</span>
            </button>
          </div>

          {/* Mobile Menu Toggle & Actions Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleWhatsAppClick}
              className="p-2.5 rounded-xl bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 transition-colors"
              aria-label={t('nav.whatsappUs', 'WhatsApp Us')}
            >
              <MessageCircle className="w-5 h-5 fill-current" />
            </a>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
              className="p-2.5 rounded-xl text-slate-700 hover:text-[#0B4D68] hover:bg-slate-100 focus:outline-none transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[80px] z-50 bg-[#061D28] text-white flex flex-col justify-between p-6 animate-in slide-in-from-top duration-300 overflow-y-auto">
          <div className="space-y-6">
            {/* Mobile Language Switcher (EN | AR | DE) */}
            <div className="space-y-1.5 pb-2">
              <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">
                Language / اللغة / Sprache:
              </span>
              <LanguageSwitcher variant="mobile" />
            </div>

            {/* Mobile Nav Links */}
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between p-3.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-[#0B4D68] text-white font-semibold'
                        : link.highlight
                        ? 'text-[#C5A880] bg-white/5 border border-[#C5A880]/30 font-semibold'
                        : 'text-slate-200 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span>{link.name}</span>
                    <ChevronRight className={`w-4 h-4 text-slate-400 ${isRTL ? 'rotate-180' : ''}`} />
                  </Link>
                );
              })}
            </nav>

            {/* Mobile CTA Buttons */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleViewingClick();
                }}
                className="w-full btn-gold py-3.5 text-xs font-semibold text-center flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>{t('nav.requestViewing', 'Request a Viewing')}</span>
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleWhatsAppClick();
                }}
                className="w-full btn-whatsapp py-3.5 text-xs font-semibold text-center flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>{t('nav.whatsappUs', 'WhatsApp Us')} (+20 10 66330570)</span>
              </a>

              <a
                href={TEL_URL}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handlePhoneClick();
                }}
                className="w-full btn-outline-white py-3.5 text-xs font-semibold text-center flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 text-[#C5A880]" />
                <span dir="ltr">{PRIMARY_PHONE}</span>
              </a>
            </div>
          </div>

          {/* Mobile Footer Addresses */}
          <div className="pt-6 border-t border-white/10 text-[11px] text-slate-400 space-y-2 font-light">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#C5A880] flex-shrink-0" />
              <span>{t('topbar.hq', 'HQ: Al Shouyfat, Fifth Settlement, New Cairo')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Compass className="w-3.5 h-3.5 text-[#C5A880] flex-shrink-0" />
              <span>{t('topbar.branch', 'Branch: Hurghada, Red Sea, Egypt')}</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
