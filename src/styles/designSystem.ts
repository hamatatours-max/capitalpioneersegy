/**
 * CAPITAL PIONEERS REAL ESTATE - DESIGN SYSTEM TOKENS
 * 
 * Extracted directly from the official Capital Pioneers brand identity.
 * Primary Brand Color: #0B4D68 (Petrol Ocean Blue)
 * Accent / Secondary: #C5A880 (Champagne Gold / Architectural Bronze)
 * Dark Surface: #061D28 (Midnight Architectural Navy)
 */

export const DESIGN_TOKENS = {
  colors: {
    primary: {
      default: '#0B4D68',
      dark: '#073549',
      light: '#126488',
      subtle: '#F0F7FA',
    },
    accent: {
      gold: '#C5A880',
      goldLight: '#E2D1B8',
      goldDark: '#A8895E',
      subtle: '#FAF7F2',
    },
    dark: {
      default: '#061D28',
      surface: '#0A2533',
      elevated: '#0E3042',
      card: '#08212E',
      border: '#163B4E',
    },
    background: {
      canvas: '#F8FAFC',
      white: '#FFFFFF',
      alt: '#F1F5F9',
      dark: '#061D28',
      darkCard: '#08212E',
    },
    text: {
      main: '#0B2533',
      secondary: '#475569',
      muted: '#94A3B8',
      inverted: '#FFFFFF',
      gold: '#C5A880',
      primaryBrand: '#0B4D68',
    },
    border: {
      light: '#E2E8F0',
      subtle: '#F1F5F9',
      dark: 'rgba(255, 255, 255, 0.12)',
      gold: 'rgba(197, 168, 128, 0.35)',
      primary: 'rgba(11, 77, 104, 0.25)',
    },
    status: {
      whatsapp: '#25D366',
      whatsappHover: '#20BA5A',
    },
  },
  typography: {
    fontFamily: {
      sans: 'Montserrat, sans-serif',
      display: 'Cinzel, Montserrat, serif',
    },
    tracking: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0',
      wide: '0.05em',
      wider: '0.1em',
      luxury: '0.25em',
    },
  },
  company: {
    name: 'CAPITAL PIONEERS',
    tagline: 'REAL ESTATE',
    fullName: 'Capital Pioneers Real Estate',
    locations: {
      cairoHQ: 'Al Shouyfat, Fifth Settlement, New Cairo, Egypt',
      redSeaBranch: 'Hurghada, Red Sea, Egypt',
    },
    contact: {
      phoneDisplay: '+20 10 66330570',
      phoneClean: '201066330570',
      whatsappUrl: 'https://wa.me/201066330570',
    },
  },
} as const;

export default DESIGN_TOKENS;
