import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  MessageCircle, 
  ArrowRight, 
  Compass, 
  Sparkles,
  Calendar
} from 'lucide-react';

interface DesignSystemShowcaseProps {
  onRequestViewing: () => void;
}

export const DesignSystemShowcase: React.FC<DesignSystemShowcaseProps> = ({ onRequestViewing }) => {
  const [selectedTab, setSelectedTab] = useState<'colors' | 'typography' | 'buttons' | 'cards' | 'forms'>('colors');
  const [demoInput, setDemoInput] = useState('');
  const [demoSelect, setDemoSelect] = useState('New Cairo - Al Shouyfat');

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero Architectural Overview */}
      <section className="bg-[#061D28] text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-[#163B4E]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0B4D68]/40 border border-[#C5A880]/30 text-[#C5A880] text-xs font-bold uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Brand Identity & Design System</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight text-white font-display">
                CAPITAL PIONEERS <br />
                <span className="text-[#C5A880] font-normal tracking-luxury text-2xl sm:text-3xl">
                  REAL ESTATE
                </span>
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Extracted directly from the official Capital Pioneers brand identity. Built for high-trust corporate real estate marketing across <strong>New Cairo HQ (Al Shouyfat)</strong> and the <strong>Hurghada Red Sea Branch</strong>.
              </p>
            </div>

            {/* Official Logo Display Card */}
            <div className="bg-[#08212E] border border-white/15 p-6 max-w-sm flex-shrink-0 space-y-3">
              <div className="text-[11px] uppercase tracking-widest text-slate-400 font-semibold">
                Official Brandmark Asset
              </div>
              <div className="w-36 h-36 mx-auto bg-[#0B4D68] p-2 border border-white/10 shadow-lg">
                <img
                  src="/images/brand/capital-pioneers-logo.jpeg"
                  alt="Capital Pioneers Real Estate Official Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-center text-xs text-slate-400">
                Primary Hex: <code className="text-[#C5A880] font-bold">#0B4D68</code> (Petrol Ocean)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Design System Interactive Explorer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4 mb-8">
          {[
            { id: 'colors', label: '1. Color Palette' },
            { id: 'typography', label: '2. Typography' },
            { id: 'buttons', label: '3. Buttons & CTAs' },
            { id: 'cards', label: '4. Architectural Cards' },
            { id: 'forms', label: '5. Form Controls' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                selectedTab === tab.id
                  ? 'bg-[#0B4D68] text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 1. COLOR PALETTE */}
        {selectedTab === 'colors' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div>
              <h2 className="text-xl font-bold text-[#0B2533] uppercase tracking-wide mb-1">
                Primary & Accent Color Architecture
              </h2>
              <p className="text-sm text-slate-500">
                Derived directly from the official logo without distortion.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Primary Petrol */}
              <div className="bg-white border border-slate-200 shadow-sm overflow-hidden">
                <div className="h-28 bg-[#0B4D68] flex items-end p-4 text-white font-bold text-xs tracking-wider">
                  PRIMARY BRAND COLOR
                </div>
                <div className="p-4 space-y-1 text-xs">
                  <div className="font-bold text-slate-900">#0B4D68</div>
                  <div className="text-slate-500">Official Petrol Blue / Ocean Slate</div>
                  <div className="text-[11px] text-slate-400">Main action color, headers, branding</div>
                </div>
              </div>

              {/* Accent Champagne Gold */}
              <div className="bg-white border border-slate-200 shadow-sm overflow-hidden">
                <div className="h-28 bg-[#C5A880] flex items-end p-4 text-[#061D28] font-bold text-xs tracking-wider">
                  LUXURY ACCENT GOLD
                </div>
                <div className="p-4 space-y-1 text-xs">
                  <div className="font-bold text-slate-900">#C5A880</div>
                  <div className="text-slate-500">Champagne Gold / Architectural Trim</div>
                  <div className="text-[11px] text-slate-400">Badges, spotlights, numerals</div>
                </div>
              </div>

              {/* Architectural Dark */}
              <div className="bg-white border border-slate-200 shadow-sm overflow-hidden">
                <div className="h-28 bg-[#061D28] flex items-end p-4 text-white font-bold text-xs tracking-wider">
                  MIDNIGHT DARK
                </div>
                <div className="p-4 space-y-1 text-xs">
                  <div className="font-bold text-slate-900">#061D28</div>
                  <div className="text-slate-500">Architectural Dark Canvas</div>
                  <div className="text-[11px] text-slate-400">Footers, hero backdrops, modals</div>
                </div>
              </div>

              {/* WhatsApp Green */}
              <div className="bg-white border border-slate-200 shadow-sm overflow-hidden">
                <div className="h-28 bg-[#25D366] flex items-end p-4 text-white font-bold text-xs tracking-wider">
                  WHATSAPP CTA
                </div>
                <div className="p-4 space-y-1 text-xs">
                  <div className="font-bold text-slate-900">#25D366</div>
                  <div className="text-slate-500">Direct WhatsApp Action</div>
                  <div className="text-[11px] text-slate-400">Direct buyer hotlines (+20 10 66330570)</div>
                </div>
              </div>
            </div>

            {/* Semantic Neutrals */}
            <div className="bg-white border border-slate-200 p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                Background & Border Neutrals
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="p-3 bg-[#FFFFFF] border border-slate-300">
                  <div className="font-bold">#FFFFFF</div>
                  <div className="text-slate-500">Canvas White</div>
                </div>
                <div className="p-3 bg-[#F8FAFC] border border-slate-200">
                  <div className="font-bold">#F8FAFC</div>
                  <div className="text-slate-500">Section Off-White</div>
                </div>
                <div className="p-3 bg-[#0A2533] text-white border border-[#163B4E]">
                  <div className="font-bold">#0A2533</div>
                  <div className="text-slate-400">Dark Surface</div>
                </div>
                <div className="p-3 bg-[#E2E8F0] border border-slate-300">
                  <div className="font-bold">#E2E8F0</div>
                  <div className="text-slate-600">Border Light</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. TYPOGRAPHY */}
        {selectedTab === 'typography' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div>
              <h2 className="text-xl font-bold text-[#0B2533] uppercase tracking-wide mb-1">
                Typography Scale: Montserrat & Cinzel
              </h2>
              <p className="text-sm text-slate-500">
                Premium geometric font with clean architectural kerning and high legibility.
              </p>
            </div>

            <div className="bg-white border border-slate-200 p-6 md:p-8 space-y-8">
              <div className="space-y-2 border-b border-slate-100 pb-6">
                <span className="text-xs uppercase tracking-widest font-semibold text-[#C5A880]">
                  Hero Architectural Headline — Montserrat Bold (Tracking Tight)
                </span>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase text-[#0B2533] leading-tight">
                  PREMIER REAL ESTATE MARKETING IN EGYPT
                </h1>
              </div>

              <div className="space-y-2 border-b border-slate-100 pb-6">
                <span className="text-xs uppercase tracking-widest font-semibold text-[#C5A880]">
                  Section Title — Montserrat Bold (Tracking Wide)
                </span>
                <h2 className="text-2xl font-bold uppercase tracking-wider text-[#0B2533]">
                  CAPITAL PIONEERS RED SEA & NEW CAIRO DEVELOPMENTS
                </h2>
              </div>

              <div className="space-y-2 border-b border-slate-100 pb-6">
                <span className="text-xs uppercase tracking-widest font-semibold text-[#C5A880]">
                  Luxury Subtitle / Brand Tagline — Tracking Luxury
                </span>
                <p className="text-sm font-semibold uppercase tracking-luxury text-[#0B4D68]">
                  STRATEGIC PROPERTY OPPORTUNITIES • FIFTH SETTLEMENT & HURGHADA
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-xs uppercase tracking-widest font-semibold text-[#C5A880]">
                  Body Copy — Montserrat Regular
                </span>
                <p className="text-slate-600 text-sm leading-relaxed max-w-3xl">
                  Capital Pioneers Real Estate is a dedicated real estate marketing and advisory firm operating from our headquarters in Al Shouyfat, Fifth Settlement, New Cairo, and our coastal branch in Hurghada, Red Sea. We connect medical, commercial, and residential property investors with high-yield projects.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 3. BUTTONS & CTAs */}
        {selectedTab === 'buttons' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div>
              <h2 className="text-xl font-bold text-[#0B2533] uppercase tracking-wide mb-1">
                Button Styles & Actions
              </h2>
              <p className="text-sm text-slate-500">
                Engineered for maximum corporate credibility and conversion.
              </p>
            </div>

            <div className="bg-white border border-slate-200 p-6 md:p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Primary CTA */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-400 uppercase">Primary CTA</div>
                  <button onClick={onRequestViewing} className="btn-primary w-full">
                    <Calendar className="w-4 h-4" />
                    <span>Request a Viewing</span>
                  </button>
                </div>

                {/* Secondary CTA / WhatsApp */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-400 uppercase">Secondary CTA</div>
                  <a
                    href="https://wa.me/201066330570"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp w-full"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>WhatsApp Us</span>
                  </a>
                </div>

                {/* Gold Action */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-400 uppercase">Accent Gold CTA</div>
                  <button className="btn-gold w-full">
                    <span>Explore Red Sea Projects</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Outline Primary */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-400 uppercase">Outline Primary</div>
                  <button className="btn-outline w-full">
                    <span>Download Project Brochure</span>
                  </button>
                </div>

                {/* Header CTA Style */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-400 uppercase">Header Action Button</div>
                  <button onClick={onRequestViewing} className="btn-header-primary w-full">
                    <span>Request a Viewing</span>
                  </button>
                </div>

                {/* Header WhatsApp */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-400 uppercase">Header WhatsApp Button</div>
                  <a
                    href="https://wa.me/201066330570"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-header-secondary w-full"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-current" />
                    <span>WhatsApp Us</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. ARCHITECTURAL CARDS */}
        {selectedTab === 'cards' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div>
              <h2 className="text-xl font-bold text-[#0B2533] uppercase tracking-wide mb-1">
                Card Architecture
              </h2>
              <p className="text-sm text-slate-500">
                Crisp geometric lines, architectural badges, and realistic data layout.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Light Luxury Project Card */}
              <div className="luxury-card group">
                <div className="relative aspect-[16/10] bg-slate-200 overflow-hidden">
                  <img
                    src="/images/projects/artea-mall/hero.jpg"
                    alt="Project Opportunity Placeholder"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#0B4D68] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1">
                    Medical & Commercial
                  </div>
                  <div className="absolute top-3 right-3 bg-[#C5A880] text-[#061D28] text-[10px] font-bold uppercase tracking-wider px-2 py-1">
                    Featured
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                      <MapPin className="w-3.5 h-3.5 text-[#0B4D68]" />
                      <span>Al Shouyfat, Fifth Settlement, New Cairo</span>
                    </div>
                    <h3 className="text-base font-bold text-[#0B2533] uppercase tracking-wide group-hover:text-[#0B4D68] transition-colors">
                      Prime Medical Complex Opportunity
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Unit Types</span>
                      <span className="font-semibold text-slate-800">Clinics & Retail</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Payment Plan</span>
                      <span className="font-semibold text-[#0B4D68]">Flexible Installments</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={onRequestViewing}
                      className="btn-primary flex-1 py-2 text-xs"
                    >
                      Inquire Now
                    </button>
                    <a
                      href="https://wa.me/201066330570"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-[#25D366] text-white hover:bg-[#20ba5a] transition-colors"
                      aria-label="WhatsApp Inquiry"
                    >
                      <MessageCircle className="w-4 h-4 fill-current" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Red Sea Branch Coastal Card */}
              <div className="luxury-card group">
                <div className="relative aspect-[16/10] bg-[#061D28] overflow-hidden flex items-center justify-center p-6 text-white text-center">
                  <div className="space-y-2">
                    <Compass className="w-10 h-10 text-[#C5A880] mx-auto" />
                    <div className="text-xs uppercase tracking-luxury text-[#C5A880]">
                      Branch Spotlight
                    </div>
                    <div className="text-base font-bold uppercase tracking-wider">
                      Capital Pioneers Red Sea
                    </div>
                  </div>
                  <div className="absolute top-3 left-3 bg-[#C5A880] text-[#061D28] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1">
                    Hurghada Hub
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                      <MapPin className="w-3.5 h-3.5 text-[#0B4D68]" />
                      <span>Hurghada & Red Sea Coast, Egypt</span>
                    </div>
                    <h3 className="text-base font-bold text-[#0B2533] uppercase tracking-wide">
                      Red Sea Coastal & Investment Portfolio
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Property Type</span>
                      <span className="font-semibold text-slate-800">Resort & Residential</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Location</span>
                      <span className="font-semibold text-[#0B4D68]">Hurghada / El Gouna</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={onRequestViewing}
                      className="btn-gold flex-1 py-2 text-xs"
                    >
                      View Red Sea Hub
                    </button>
                  </div>
                </div>
              </div>

              {/* Dark Architectural Card */}
              <div className="luxury-dark-card p-6 text-white space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Building2 className="w-7 h-7 text-[#C5A880]" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#C5A880] border border-[#C5A880]/30 px-2 py-0.5">
                      Corporate HQ
                    </span>
                  </div>
                  <h3 className="text-lg font-bold uppercase tracking-wide text-white">
                    New Cairo Office
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Al Shouyfat, Fifth Settlement, New Cairo, Egypt. Our central advisory hub for developer marketing and client consultations.
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <Phone className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span>+20 10 66330570</span>
                  </div>
                  <button
                    onClick={onRequestViewing}
                    className="btn-outline-white w-full py-2 text-xs mt-2"
                  >
                    Schedule Office Meeting
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. FORM CONTROLS */}
        {selectedTab === 'forms' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div>
              <h2 className="text-xl font-bold text-[#0B2533] uppercase tracking-wide mb-1">
                Form Controls & Lead Inputs
              </h2>
              <p className="text-sm text-slate-500">
                High-contrast, elegant form elements with crisp focus boundaries.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Light Form Box */}
              <div className="bg-white border border-slate-200 p-6 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#0B2533] border-b border-slate-100 pb-2">
                  Light Form Elements
                </h3>

                <div>
                  <label className="form-label">Client Name</label>
                  <input
                    type="text"
                    placeholder="Enter full name"
                    value={demoInput}
                    onChange={(e) => setDemoInput(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="form-label">Select Preferred Region</label>
                  <select
                    value={demoSelect}
                    onChange={(e) => setDemoSelect(e.target.value)}
                    className="form-input"
                  >
                    <option value="New Cairo - Al Shouyfat">New Cairo (Al Shouyfat HQ)</option>
                    <option value="Hurghada - Red Sea">Hurghada (Red Sea Branch)</option>
                    <option value="New Administrative Capital">New Administrative Capital</option>
                  </select>
                </div>

                <div className="pt-2">
                  <button onClick={onRequestViewing} className="btn-primary w-full">
                    Submit Inquiry
                  </button>
                </div>
              </div>

              {/* Dark Form Box */}
              <div className="bg-[#061D28] border border-[#163B4E] p-6 space-y-4 text-white">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#C5A880] border-b border-white/10 pb-2">
                  Dark Architectural Form Elements
                </h3>

                <div>
                  <label className="form-label-dark">Investor Contact Number</label>
                  <input
                    type="tel"
                    placeholder="+20 10 XXXX XXXX"
                    className="form-input-dark"
                  />
                </div>

                <div>
                  <label className="form-label-dark">Investment Budget Bracket</label>
                  <select className="form-input-dark">
                    <option>Standard Commercial Bracket</option>
                    <option>Premium Medical Clinic Bracket</option>
                    <option>Coastal Luxury Bracket</option>
                  </select>
                </div>

                <div className="pt-2">
                  <button className="btn-gold w-full">
                    Request VIP Portfolio
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default DesignSystemShowcase;
