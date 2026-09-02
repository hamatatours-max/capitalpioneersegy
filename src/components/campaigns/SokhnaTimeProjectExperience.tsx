import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  Phone, 
  MessageCircle, 
  Calendar, 
  CheckCircle2, 
  Sparkles, 
  Maximize2, 
  Check,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  X,
  ChevronLeft,
  ChevronRight,
  Home,
  Waves,
  Building,
  Tag,
  Clock,
  KeyRound,
  FileText,
  Compass,
  DollarSign,
  TrendingUp,
  Percent,
  Bed,
  Bath,
  Layers,
  Anchor,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Flame,
  TreePine,
  Award
} from 'lucide-react';
import { Project, AvailableUnit } from '@/types/project';
import { SEO } from '@/components/common/SEO';
import { submitLead } from '@/services/leadService';
import { LeadFormData } from '@/types/lead';
import { useLanguage } from '@/context/LanguageContext';
import { getLocalizedProject } from '@/i18n/projectTranslations';
import { 
  trackClickWhatsApp, 
  trackClickPhone, 
  trackFormStart, 
  trackFormSubmit,
  trackEvent 
} from '@/services/analyticsService';

interface SokhnaTimeProjectExperienceProps {
  project: Project;
  onRequestViewing?: (projectName?: string) => void;
}

const SOKHNA_TIME_GALLERY = [
  {
    src: '/images/projects/sokhna-time/sokhna-time-marina.jpg',
    titleEn: 'Direct Yacht Marina & Resort Architecture',
    titleAr: 'مارينا اليخوت المباشرة وتصميم المنتجع الفندقي',
    titleDe: 'Direkter Yachthafen & Hotelresort-Architektur',
    descEn: 'Aerial view showing the resort building positioned directly by the active Ain Sokhna yacht marina.',
    descAr: 'إطلالة علوية توضح موقع المبنى الفندقي مباشرة أمام مارينا اليخوت بالعين السخنة.',
    descDe: 'Luftaufnahme des Hotelresorts direkt am lebhaften Yachthafen in Ain Sokhna.',
  },
  {
    src: '/images/projects/sokhna-time/sokhna-time-floorplan.jpg',
    titleEn: 'Architectural Floor Plan & Spatial Layout',
    titleAr: 'المخطط الهندسي وتوزيع المساحات',
    titleDe: 'Architektonischer Grundriss & Raumaufteilung',
    descEn: 'Thoughtful spatial layout featuring living & dining lounge, open kitchenette, master suite, second bedroom, 2 bathrooms, and private terrace.',
    descAr: 'توزيع معماري متقن يضم ريسبشن معيشة وطعام، كيتشن، جناح ماستر، غرفة نوم ثانية، حمامين، وتراس بإطلالة بحرية.',
    descDe: 'Durchdachter Grundriss mit Wohn- und Essbereich, Kitchenette, Master-Suite, 2. Schlafzimmer, 2 Bädern und Terrasse.',
  },
  {
    src: '/images/projects/sokhna-time/sokhna-time-creative.jpg',
    titleEn: "It's Sokhna Time — Campaign Showcase",
    titleAr: "هوية حملة It's Sokhna Time",
    titleDe: "It's Sokhna Time Kampagnen-Visual",
    descEn: 'Official promotional creative for Sokhna Time coastal investment opportunity.',
    descAr: 'الهوية الإعلانية المعتمدة لفرصة الاستثمار الساحلي بمشروع سوخنة تايم.',
    descDe: 'Offizielles Kampagnenmotiv für Sokhna Time in Ain Sokhna.',
  },
  {
    src: '/images/projects/sokhna-time/sokhna-time-composite.jpg',
    titleEn: 'Complete Sokhna Time Verification Document',
    titleAr: 'الوثيقة الإعلانية والمخطط الكامل لمشروع سوخنة تايم',
    titleDe: 'Vollständige Sokhna Time Verifizierungsübersicht',
    descEn: 'Full high-resolution composite sheet with marina location, creative artwork, and floor plan.',
    descAr: 'العرض البصري الشامل عالي الدقة متضمناً صورة المارينا، الهوية الإعلانية، والمخطط الهندسي.',
    descDe: 'Komplette hochauflösende Übersicht mit Yachthafen, Kampagnenvisual und Grundriss.',
  },
];

export const SokhnaTimeProjectExperience: React.FC<SokhnaTimeProjectExperienceProps> = ({
  project: rawProject,
  onRequestViewing
}) => {
  const { language, isRTL } = useLanguage();
  const project = getLocalizedProject(rawProject, language);

  // 1. Available Verified Units
  const unitsList = project.availableUnitsList || [];

  // Unit 1: 130 m² Panoramic Sea View (NO Garden - 3 Payment Plans)
  const panoramic130 = unitsList.find(u => u.id === 'sokhna-130-panoramic') || {
    id: 'sokhna-130-panoramic',
    unitCode: 'ST-130P',
    propertyType: 'Hotel Chalet',
    view: 'Panoramic Sea View',
    positioning: 'Directly at the Yacht Marina',
    areaSqm: 130,
    originalPriceEGP: 12155000,
    discountPercent: 23,
    totalPriceEGP: 9359350,
    downPaymentPercent: 10,
    downPaymentEGP: 935935,
    installmentYears: 6,
    installmentFrequency: 'Quarterly',
    quarterlyInstallmentEGP: 350975,
    delivery: 'December 2027',
    rentalOption: 'Possibility of rental with/through the hotel',
    status: 'Available' as const,
    notes: '130 m² Panoramic Sea View Hotel Chalet • Plans: 6Y (23% OFF / EGP 9.359M), 7Y (20% OFF / EGP 9.724M), 8Y (15% OFF / EGP 10.332M)',
  };

  // Unit 2: 180 m² + 26 m² Garden Duplex Mini Villa (3 Beds Sea View - 3 Payment Plans)
  const duplex180 = unitsList.find(u => u.id === 'sokhna-time-duplex-180') || {
    id: 'sokhna-time-duplex-180',
    unitCode: 'ST-180D',
    propertyType: 'Hotel Duplex / Mini Villa',
    view: 'Sea View',
    positioning: 'Directly at the Yacht Marina',
    areaSqm: 180,
    gardenAreaSqm: 26,
    bedrooms: 3,
    originalPriceEGP: 14400000,
    discountPercent: 23,
    totalPriceEGP: 11088000,
    downPaymentPercent: 10,
    downPaymentEGP: 1108800,
    installmentYears: 6,
    installmentFrequency: 'Quarterly',
    quarterlyInstallmentEGP: 415800,
    delivery: 'December 2027',
    rentalOption: 'Possibility of rental through/with the hotel',
    status: 'Available' as const,
    notes: '180 m² + 26 m² Garden Duplex / Mini Villa • 3 Bedrooms • Sea View • Plans: 6Y (23% OFF / EGP 11.088M), 7Y (20% OFF / EGP 11.520M), 8Y (15% OFF / EGP 12.240M)',
  };

  // Unit 3: 130 m² + 21 m² Garden Hotel Chalet (LAST UNIT - Panoramic Sea View)
  const lastUnit130 = unitsList.find(u => u.id === 'sokhna-time-last-unit-130') || {
    id: 'sokhna-time-last-unit-130',
    unitCode: 'ST-130G',
    propertyType: 'Hotel Chalet',
    view: 'Panoramic Sea View',
    positioning: 'Directly at / Overlooking Yacht Marina',
    areaSqm: 130,
    gardenAreaSqm: 21,
    bedrooms: 2,
    originalPriceEGP: 13055900,
    discountPercent: 15,
    totalPriceEGP: 11097515,
    downPaymentPercent: 10,
    downPaymentEGP: 1109751,
    installmentYears: 8,
    installmentFrequency: 'Quarterly',
    quarterlyInstallmentEGP: 312117,
    delivery: 'December 2027',
    status: 'Available' as const,
    notes: 'LAST UNIT • 130 m² + 21 m² Garden • Panoramic Sea View • EGP 11,097,515 after 15% discount (10% Down, 8 Years Quarterly)',
  };

  // Unit 4: 112 m² Hotel Chalet (Sea View)
  const unit112 = unitsList.find(u => u.id === 'sokhna-time-chalet-112') || {
    id: 'sokhna-time-chalet-112',
    unitCode: 'ST-112',
    propertyType: 'Hotel Chalet',
    view: 'Sea View',
    positioning: 'Directly at / Overlooking Yacht Marina',
    areaSqm: 112,
    originalPriceEGP: 9443280,
    discountPercent: 15,
    totalPriceEGP: 8026788,
    downPaymentPercent: 10,
    downPaymentEGP: 802678,
    installmentYears: 8,
    installmentFrequency: 'Quarterly',
    quarterlyInstallmentEGP: 225753,
    delivery: 'December 2027',
    status: 'Available' as const,
    notes: '112 m² Hotel Chalet • Sea View • EGP 8,026,788 after 15% discount (10% Down, 8 Years Quarterly)',
  };

  // State: Default to 130m Panoramic Sea View Hotel Chalet
  const [selectedUnitId, setSelectedUnitId] = useState<string>('sokhna-130-panoramic');
  
  // Payment Option State for 130m Panoramic: '6y' | '7y' | '8y'
  const [selectedPanoramicPlan, setSelectedPanoramicPlan] = useState<'6y' | '7y' | '8y'>('6y');

  // Payment Option State for 180m Duplex: '6y' | '7y' | '8y'
  const [selectedDuplexPlan, setSelectedDuplexPlan] = useState<'6y' | '7y' | '8y'>('6y');

  // Video State
  const heroVideoRef = useRef<HTMLVideoElement | null>(null);
  const galleryVideoRef = useRef<HTMLVideoElement | null>(null);
  const [isGalleryVideoPlaying, setIsGalleryVideoPlaying] = useState(false);
  const [isGalleryVideoMuted, setIsGalleryVideoMuted] = useState(true);

  // Lightbox State
  const [modalImageIndex, setModalImageIndex] = useState<number | null>(null);

  // Form State
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [interestedInRental, setInterestedInRental] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [whatsappHandoffUrl, setWhatsappHandoffUrl] = useState('');
  const formRef = useRef<HTMLDivElement | null>(null);
  const plansRef = useRef<HTMLDivElement | null>(null);

  // Active Unit & Commercial Calculation
  const isPanoramic130 = selectedUnitId === 'sokhna-130-panoramic';
  const isDuplex = selectedUnitId === 'sokhna-time-duplex-180';
  const isLastChalet = selectedUnitId === 'sokhna-time-last-unit-130';
  
  let activeUnit: AvailableUnit = panoramic130;
  if (selectedUnitId === 'sokhna-time-duplex-180') {
    activeUnit = duplex180;
  } else if (selectedUnitId === 'sokhna-time-last-unit-130') {
    activeUnit = lastUnit130;
  } else if (selectedUnitId === 'sokhna-time-chalet-112') {
    activeUnit = unit112;
  }

  // Calculate dynamic financial values depending on selected unit and plan
  let activePrice = activeUnit.totalPriceEGP;
  let activeDiscount = activeUnit.discountPercent || 15;
  let activeDownPayment = activeUnit.downPaymentEGP || 0;
  let activeQuarterly = activeUnit.quarterlyInstallmentEGP || 0;
  let activeYears = activeUnit.installmentYears || 8;
  let activeQuarters = activeYears * 4;
  let activeOriginalPrice = activeUnit.originalPriceEGP || 12155000;

  if (isPanoramic130) {
    activeOriginalPrice = 12155000;
    if (selectedPanoramicPlan === '6y') {
      activeDiscount = 23;
      activePrice = 9359350;
      activeDownPayment = 935935;
      activeQuarterly = 350975;
      activeYears = 6;
      activeQuarters = 24;
    } else if (selectedPanoramicPlan === '7y') {
      activeDiscount = 20;
      activePrice = 9724000;
      activeDownPayment = 972400;
      activeQuarterly = 312557; // exact commercial figure
      activeYears = 7;
      activeQuarters = 28;
    } else {
      activeDiscount = 15;
      activePrice = 10331750;
      activeDownPayment = 1033175;
      activeQuarterly = 290580;
      activeYears = 8;
      activeQuarters = 32;
    }
  } else if (isDuplex) {
    activeOriginalPrice = 14400000;
    if (selectedDuplexPlan === '6y') {
      activeDiscount = 23;
      activePrice = 11088000;
      activeDownPayment = 1108800;
      activeQuarterly = 415800;
      activeYears = 6;
      activeQuarters = 24;
    } else if (selectedDuplexPlan === '7y') {
      activeDiscount = 20;
      activePrice = 11520000;
      activeDownPayment = 1152000;
      activeQuarterly = 370285; // exact commercial figure
      activeYears = 7;
      activeQuarters = 28;
    } else {
      activeDiscount = 15;
      activePrice = 12240000;
      activeDownPayment = 1224000;
      activeQuarterly = 344250;
      activeYears = 8;
      activeQuarters = 32;
    }
  }

  // Active Video URLs (assigned strictly where verified source exists)
  const hasDedicatedVideo = isDuplex || isLastChalet;
  const activeVideoUrl = isDuplex
    ? '/videos/projects/sokhna-time/sokhna-time-180-duplex.mp4'
    : isLastChalet
    ? '/videos/projects/sokhna-time/sokhna-time-last-unit-original.mp4'
    : '';

  const activeVideoPoster = isDuplex
    ? '/images/projects/sokhna-time/sokhna-time-180-duplex-poster.jpg'
    : isLastChalet
    ? '/images/projects/sokhna-time/sokhna-time-last-unit-poster.jpg'
    : '/images/projects/sokhna-time/sokhna-time-marina.jpg';

  // Analytics on Mount
  useEffect(() => {
    trackEvent('sokhna_130p_unit_view', {
      project_id: 'sokhna-time',
      unit_type: 'Hotel Chalet',
      area_sqm: 130,
      view: 'Panoramic Sea View',
      selected_plan: selectedPanoramicPlan,
      final_price: activePrice
    });
  }, []);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (modalImageIndex === null) return;
      if (e.key === 'Escape') setModalImageIndex(null);
      if (e.key === 'ArrowRight') {
        setModalImageIndex((prev) => (prev !== null ? (prev + 1) % SOKHNA_TIME_GALLERY.length : 0));
      }
      if (e.key === 'ArrowLeft') {
        setModalImageIndex((prev) => (prev !== null ? (prev - 1 + SOKHNA_TIME_GALLERY.length) % SOKHNA_TIME_GALLERY.length : 0));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalImageIndex]);

  // Unit Switch Handler
  const handleUnitSwitch = (unitId: string) => {
    setSelectedUnitId(unitId);
    if (unitId === 'sokhna-130-panoramic') {
      trackEvent('sokhna_130p_unit_view', {
        unit_id: unitId,
        selected_plan: selectedPanoramicPlan,
      });
    } else if (unitId === 'sokhna-time-duplex-180') {
      trackEvent('sokhna_180_unit_view', {
        unit_id: unitId,
        selected_plan: selectedDuplexPlan,
      });
    } else {
      trackEvent('sokhna_time_unit_switch', {
        unit_id: unitId,
      });
    }
  };

  // Plan Switch Handler for 130m Panoramic
  const handlePanoramicPlanSwitch = (plan: '6y' | '7y' | '8y') => {
    setSelectedPanoramicPlan(plan);
    let planPrice = 9359350;
    let planDiscount = 23;
    if (plan === '7y') {
      planPrice = 9724000;
      planDiscount = 20;
    } else if (plan === '8y') {
      planPrice = 10331750;
      planDiscount = 15;
    }

    trackEvent('sokhna_130p_plan_select', {
      selectedPlan: plan,
      finalPrice: planPrice,
      discount: planDiscount,
      unitArea: 130
    });
  };

  // Plan Switch Handler for Duplex
  const handleDuplexPlanSwitch = (plan: '6y' | '7y' | '8y') => {
    setSelectedDuplexPlan(plan);
    let planPrice = 11088000;
    let planDiscount = 23;
    if (plan === '7y') {
      planPrice = 11520000;
      planDiscount = 20;
    } else if (plan === '8y') {
      planPrice = 12240000;
      planDiscount = 15;
    }

    trackEvent('sokhna_180_plan_select', {
      selectedPlan: plan,
      finalPrice: planPrice,
      discount: planDiscount,
      unitArea: 180
    });
  };

  // WhatsApp Message Generator
  const getWhatsAppUrl = () => {
    const phone = '201000000000';
    let text = '';

    if (isPanoramic130) {
      const planLabel = selectedPanoramicPlan === '6y' ? '6 Years (23% Discount)' : selectedPanoramicPlan === '7y' ? '7 Years (20% Discount)' : '8 Years (15% Discount)';
      text = language === 'ar'
        ? `مرحباً Capital Pioneers، أود الاستفسار عن شاليه فندقي 130 م² بإطلالة بانورامية على البحر في مشروع SOKHNA TIME بمارينا اليخوت. اخترت خطة السداد ${selectedPanoramicPlan === '6y' ? '6 سنوات بسعر 9,359,350 جنيه (خصم 23% ومقدم 10%: 935,935 جنيه وقسط ربع سنوي: 350,975 جنيه)' : selectedPanoramicPlan === '7y' ? '7 سنوات بسعر 9,724,000 جنيه (خصم 20% ومقدم 10%: 972,400 جنيه وقسط ربع سنوي: 312,557 جنيه)' : '8 سنوات بسعر 10,331,750 جنيه (خصم 15% ومقدم 10%: 1,033,175 جنيه وقسط ربع سنوي: 290,580 جنيه)'}. يرجى موافاتي بكافة التفاصيل والوحدات المتاحة.`
        : language === 'de'
        ? `Hallo Capital Pioneers, ich interessiere mich für das 130 m² Panorama-Hotel-Chalet bei Sokhna Time am Yachthafen Ain Sokhna. Ausgewählter Zahlungsplan: ${planLabel} zum Preis von ${activePrice.toLocaleString()} EGP (10% Anzahlung). Bitte senden Sie mir die aktuellen Verfügbarkeiten und Details.`
        : `I'm interested in the Sokhna Time 130 m² Panoramic Sea View Hotel Chalet at the Yacht Marina. I selected the ${selectedPanoramicPlan === '6y' ? '6-year payment plan at EGP 9,359,350 (23% discount)' : selectedPanoramicPlan === '7y' ? '7-year payment plan at EGP 9,724,000 (20% discount)' : '8-year payment plan at EGP 10,331,750 (15% discount)'}. Please send me current availability and full details.`;
    } else if (isDuplex) {
      const planLabel = selectedDuplexPlan === '6y' ? '6 Years (23% Discount)' : selectedDuplexPlan === '7y' ? '7 Years (20% Discount)' : '8 Years (15% Discount)';
      text = language === 'ar'
        ? `مرحباً Capital Pioneers، أود الاستفسار عن دوبلكس ميني فيلا 180 م² + 26 م² حديقة و3 غرف نوم بإطلالة بحرية مباشرة على مارينا اليخوت بمشروع SOKHNA TIME. اخترت خطة سداد ${selectedDuplexPlan === '6y' ? '6 سنوات بسعر 11,088,000 جنيه (خصم 23% ومقدم 10% وأقساط ربع سنوية 415,800 جنيه)' : selectedDuplexPlan === '7y' ? '7 سنوات بسعر 11,520,000 جنيه (خصم 20% ومقدم 10% وأقساط ربع سنوية 370,285 جنيه)' : '8 سنوات بسعر 12,240,000 جنيه (خصم 15% ومقدم 10% وأقساط ربع سنوية 344,250 جنيه)'}. يرجى موافاتي بكافة التفاصيل والوحدات المتاحة.`
        : language === 'de'
        ? `Hallo Capital Pioneers, ich interessiere mich für die Sokhna Time 180 m² Duplex Mini Villa mit 26 m² Garten und 3 Schlafzimmern direkt am Yachthafen Ain Sokhna zum Preis von ${activePrice.toLocaleString()} EGP. Bitte senden Sie mir Details.`
        : `I'm interested in the Sokhna Time 180 m² Duplex Mini Villa with 26 m² garden and 3 bedrooms. I selected the ${selectedDuplexPlan === '6y' ? '6-year payment plan at EGP 11,088,000' : selectedDuplexPlan === '7y' ? '7-year payment plan at EGP 11,520,000' : '8-year payment plan at EGP 12,240,000'}. Please send me current availability and full details.`;
    } else if (isLastChalet) {
      text = language === 'ar'
        ? `مرحباً Capital Pioneers، أود الاستفسار عن آخر شاليه متاح في مشروع SOKHNA TIME: شاليه فندقي 130 م² + 21 م² حديقة بإطلالة بانورامية على البحر بسعر 11,097,515 جنيه بعد خصم 15% (مقدم 10% وأقساط ربع سنوية 312,117 جنيه على 8 سنوات). يرجى موافاتي بكافة التفاصيل والوحدات المتاحة.`
        : language === 'de'
        ? `Hallo Capital Pioneers, ich interessiere mich für das letzte verfügbare Hotel-Chalet bei Sokhna Time: 130 m² + 21 m² Garten mit Panoramameerblick zum Preis von 11.097.515 EGP nach 15% Rabatt. Bitte senden Sie mir Details.`
        : `I'm interested in the last available Sokhna Time hotel chalet: 130 m² + 21 m² garden, panoramic sea view, EGP 11,097,515 after discount. Please send me current availability and details.`;
    } else {
      text = language === 'ar'
        ? `مرحباً Capital Pioneers، أود الاستفسار عن شاليه فندقي 112 م² بإطلالة بحرية مباشرة على مارينا اليخوت في مشروع SOKHNA TIME بالعين السخنة بسعر 8,026,788 جنيه بعد خصم 15% (مقدم 10% وأقساط ربع سنوية 225,753 جنيه على 8 سنوات). يرجى موافاتي بكافة التفاصيل.`
        : language === 'de'
        ? `Hallo Capital Pioneers, ich interessiere mich für das 112 m² Hotel-Chalet mit Meerblick bei Sokhna Time, Ain Sokhna, zum Preis von 8.026.788 EGP nach 15% Rabatt. Bitte senden Sie mir Details.`
        : `I'm interested in the 112 m² sea-view hotel chalet at Sokhna Time, Ain Sokhna, priced at EGP 8,026,788 after discount. Please send me current availability and full details.`;
    }
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phoneNumber.trim()) return;

    setIsSubmitting(true);
    try {
      let unitLabel = '';
      if (isPanoramic130) {
        unitLabel = `130 m² Panoramic Sea View Hotel Chalet (Plan: ${selectedPanoramicPlan.toUpperCase()} - ${activeDiscount}% OFF)`;
      } else if (isDuplex) {
        unitLabel = `180 m² + 26 m² Garden Duplex Mini Villa (3 Beds Sea View - Plan: ${selectedDuplexPlan.toUpperCase()})`;
      } else if (isLastChalet) {
        unitLabel = '130 m² + 21 m² Garden (LAST UNIT - Panoramic Sea View)';
      } else {
        unitLabel = '112 m² (Sea View)';
      }
      
      const leadData: LeadFormData = {
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        propertyType: isDuplex ? 'Duplex' : 'Chalet',
        purpose: 'Investment',
        preferredContactMethod: 'WhatsApp',
        interestedProject: `SOKHNA TIME - ${unitLabel}`,
        message: `Unit: ${unitLabel} | Price: EGP ${activePrice.toLocaleString()} (Discount: ${activeDiscount}%) | Down: EGP ${activeDownPayment.toLocaleString()} (10%) | Quarterly: EGP ${activeQuarterly.toLocaleString()} (${activeYears} Years) | Delivery: Dec 2027 | Rental Option: ${interestedInRental ? 'YES - Interested in Hotel Rental' : 'No'} | Notes: ${notes.trim()}`,
      };

      await submitLead(leadData);

      if (isPanoramic130) {
        trackEvent('sokhna_130p_lead_submit', {
          full_name: fullName.trim(),
          phone: phoneNumber.trim(),
          selectedPlan: selectedPanoramicPlan,
          finalPrice: activePrice,
          discount: activeDiscount,
          unitArea: 130,
          interested_in_rental: interestedInRental,
        });
      } else if (isDuplex) {
        trackEvent('sokhna_180_lead_submit', {
          full_name: fullName.trim(),
          phone: phoneNumber.trim(),
          selectedPlan: selectedDuplexPlan,
          finalPrice: activePrice,
          discount: activeDiscount,
          unitArea: 180,
          interested_in_rental: interestedInRental,
        });
      } else {
        trackEvent('sokhna_time_lead_submit', {
          full_name: fullName.trim(),
          phone: phoneNumber.trim(),
          unit_id: activeUnit.id,
          interested_in_rental: interestedInRental,
        });
      }

      const waUrl = getWhatsAppUrl();
      setWhatsappHandoffUrl(waUrl);
      setFormSubmitted(true);
    } catch (err) {
      console.error('Lead submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleGalleryVideoPlay = () => {
    if (galleryVideoRef.current) {
      if (galleryVideoRef.current.paused) {
        galleryVideoRef.current.play();
        setIsGalleryVideoPlaying(true);
        if (isDuplex) {
          trackEvent('sokhna_180_video_play', {
            video_src: activeVideoUrl,
            selectedPlan: selectedDuplexPlan,
            finalPrice: activePrice,
            unitArea: 180
          });
        } else {
          trackEvent('sokhna_time_video_play', {
            video_src: activeVideoUrl,
          });
        }
      } else {
        galleryVideoRef.current.pause();
        setIsGalleryVideoPlaying(false);
      }
    }
  };

  return (
    <>
      <SEO
        title={language === 'ar' 
          ? 'سوخنة تايم — شاليه فندقي 130 م² بإطلالة بانورامية على البحر | كابيتال بايونيرز'
          : 'Sokhna Time | 130 m² Panoramic Sea View Hotel Chalet | Capital Pioneers'}
        description={language === 'ar'
          ? 'شاليه فندقي 130 م² بإطلالة بانورامية على البحر ومارينا اليخوت بالعين السخنة، بأسعار تبدأ من 9,359,350 جنيه وخصومات تصل إلى 23% بمقدم 10% وتقسيط حتى 8 سنوات واستلام ديسمبر 2027.'
          : 'Explore the 130 m² panoramic sea view hotel chalet in Ain Sokhna Yacht Marina, starting from EGP 9.359M with up to 23% discount, 10% down, and flexible plans up to 8 years.'}
        canonicalPath="/projects/sokhna-time"
        ogImage="/images/projects/sokhna-time/sokhna-time-marina.jpg"
      />

      <div className={`min-h-screen bg-[#021019] text-slate-100 selection:bg-[#0B4D68] selection:text-white ${isRTL ? 'rtl' : 'ltr'}`}>

        {/* 1. HERO SECTION */}
        <section className="relative min-h-[95vh] flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
          
          {/* Background Layer: Ambient Video or Verified High-Res Image */}
          <div className="absolute inset-0 z-0 overflow-hidden bg-[#020D14]">
            {hasDedicatedVideo ? (
              <video
                key={activeVideoUrl}
                ref={heroVideoRef}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster={activeVideoPoster}
                className="w-full h-full object-cover object-center opacity-45 scale-105 filter blur-[0.5px]"
              >
                <source src={activeVideoUrl} type="video/mp4" />
              </video>
            ) : (
              <img
                src={activeVideoPoster}
                alt="Sokhna Time Yacht Marina"
                className="w-full h-full object-cover object-center opacity-40 scale-105 filter blur-[0.5px]"
              />
            )}
            
            {/* Dark Cinematic Vignette & Readability Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#021019] via-[#021019]/80 to-[#021019]/60" />
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#021019]/40 to-[#021019]/90" />
          </div>

          <div className="relative z-10 max-w-6xl mx-auto w-full flex flex-col items-center text-center">
            
            {/* Eyebrow Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-5">
              <span className="px-3.5 py-1.5 rounded-full bg-cyan-950/90 text-cyan-300 border border-cyan-400/40 text-xs font-semibold uppercase tracking-widest flex items-center gap-1.5 shadow-lg backdrop-blur-md">
                <Anchor className="w-3.5 h-3.5 text-cyan-400" />
                <span>SOKHNA TIME</span>
              </span>

              {/* Secondary Badge */}
              <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-600 to-cyan-800 text-white font-bold text-xs uppercase tracking-widest flex items-center gap-1.5 shadow-xl">
                <Waves className="w-4 h-4 text-cyan-300" />
                <span>{language === 'ar' ? 'إطلالة بانورامية على البحر' : 'PANORAMIC SEA VIEW'}</span>
              </span>

              <span className="px-3.5 py-1.5 rounded-full bg-[#D4AF37]/25 text-[#E8C868] border border-[#D4AF37]/50 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md backdrop-blur-md">
                <Tag className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>{isPanoramic130 || isDuplex ? (language === 'ar' ? 'خصم حتى 23%' : 'Up to 23% Discount') : (language === 'ar' ? 'خصم 15%' : '15% Discount')}</span>
              </span>
            </div>

            {/* Main Headline H1 */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white tracking-tight leading-[1.15] mb-3 max-w-4xl">
              {isPanoramic130 
                ? (language === 'ar' ? 'شاليه فندقي 130 م²' : '130 m² Hotel Chalet')
                : isDuplex 
                ? (language === 'ar' ? '180 م² + 26 م² حديقة خاصة' : '180 m² + 26 m² Garden')
                : isLastChalet
                ? (language === 'ar' ? 'شاليه فندقي 130 م² + 21 م² حديقة' : '130 m² + 21 m² Garden Hotel Chalet')
                : (language === 'ar' ? 'شاليه فندقي 112 م²' : '112 m² Hotel Chalet')}
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-2xl md:text-3xl text-cyan-200 font-light tracking-wide max-w-3xl mb-6">
              {isPanoramic130
                ? (language === 'ar' ? 'إطلالة بانورامية على البحر بمارينا اليخوت في العين السخنة' : 'Panoramic Sea View at Ain Sokhna Yacht Marina')
                : isDuplex
                ? (language === 'ar' ? '3 غرف نوم • دوبلكس فندقي بإطلالة بحرية مباشرة على مارينا اليخوت' : '3-Bedroom Sea View Hotel Duplex at the Yacht Marina')
                : isLastChalet
                ? (language === 'ar' ? 'الوحدة الأخيرة • مباشرة على مارينا اليخوت' : 'Last Unit • Directly at the Yacht Marina')
                : (language === 'ar' ? 'مباشرة على مارينا اليخوت بالعين السخنة' : 'Directly at Ain Sokhna Yacht Marina')}
            </p>

            {/* Price Hook Box */}
            <div className="mb-6 inline-flex flex-wrap items-center justify-center gap-3 px-5 py-2.5 rounded-2xl bg-cyan-950/80 border border-cyan-400/30 backdrop-blur-md">
              <span className="text-xs uppercase tracking-wider text-slate-300 font-mono tabular-nums">
                {language === 'ar' ? 'يبدأ من:' : 'STARTING FROM:'}
              </span>
              <span className="text-2xl font-serif font-bold text-[#E8C868] font-mono tabular-nums">
                EGP {isPanoramic130 ? '9,359,350' : isDuplex ? '11,088,000' : isLastChalet ? '11,097,515' : '8,026,788'}
              </span>
              <span className="text-xs text-cyan-300 font-bold px-2 py-0.5 rounded bg-cyan-900/60">
                10% {language === 'ar' ? 'مقدم' : 'Down'} • {language === 'ar' ? 'حتى 8 سنوات' : 'Up to 8 Years'} • 12/2027
              </span>
            </div>

            {/* Interactive Unit Selector Switch (All 4 Distinct Units Coexisting) */}
            <div className="bg-[#031520]/90 border border-cyan-500/30 p-1.5 rounded-2xl flex flex-wrap items-center justify-center gap-1.5 mb-8 shadow-2xl backdrop-blur-md max-w-4xl w-full">
              
              {/* Unit 1: 130m Panoramic (NO Garden) */}
              <button
                onClick={() => handleUnitSwitch('sokhna-130-panoramic')}
                className={`flex-1 min-w-[180px] py-3 px-3.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 flex flex-col items-center justify-center ${
                  selectedUnitId === 'sokhna-130-panoramic'
                    ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-white shadow-lg border border-cyan-300/40'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Waves className="w-3.5 h-3.5 text-cyan-200" />
                  <span>130 m² {language === 'ar' ? 'بانوراما البحر' : 'Panoramic'}</span>
                </div>
                <span className="text-[10px] text-cyan-200 font-mono tabular-nums font-normal">
                  {language === 'ar' ? 'يبدأ من 9.359M' : 'From EGP 9.359M'}
                </span>
              </button>

              {/* Unit 2: 180m Duplex Mini Villa */}
              <button
                onClick={() => handleUnitSwitch('sokhna-time-duplex-180')}
                className={`flex-1 min-w-[180px] py-3 px-3.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 flex flex-col items-center justify-center ${
                  selectedUnitId === 'sokhna-time-duplex-180'
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#C5A880] text-slate-950 shadow-lg'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Award className={`w-3.5 h-3.5 ${selectedUnitId === 'sokhna-time-duplex-180' ? 'text-slate-950' : 'text-[#D4AF37]'}`} />
                  <span>180 m² + 26 m² {language === 'ar' ? 'حديقة' : 'Garden'}</span>
                </div>
                <span className="text-[10px] text-slate-900 font-mono tabular-nums font-normal">
                  {language === 'ar' ? 'دوبلكس 3 غرف' : 'Duplex (From 11.088M)'}
                </span>
              </button>

              {/* Unit 3: 130m + 21m Garden (Last Unit) */}
              <button
                onClick={() => handleUnitSwitch('sokhna-time-last-unit-130')}
                className={`flex-1 min-w-[170px] py-3 px-3.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 flex flex-col items-center justify-center ${
                  selectedUnitId === 'sokhna-time-last-unit-130'
                    ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-lg'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-200" />
                  <span>130 m² + 21 m² {language === 'ar' ? 'حديقة' : 'Garden'}</span>
                </div>
                <span className="text-[10px] text-amber-200 font-mono tabular-nums font-normal">
                  {language === 'ar' ? 'الوحدة الأخيرة (11.097M)' : 'Last Unit (11.097M)'}
                </span>
              </button>

              {/* Unit 4: 112m Chalet */}
              <button
                onClick={() => handleUnitSwitch('sokhna-time-chalet-112')}
                className={`flex-1 min-w-[140px] py-3 px-3.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 flex flex-col items-center justify-center ${
                  selectedUnitId === 'sokhna-time-chalet-112'
                    ? 'bg-gradient-to-r from-slate-700 to-slate-600 text-white shadow-lg'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Home className="w-3.5 h-3.5 text-cyan-300" />
                  <span>112 m² {language === 'ar' ? 'شاليه' : 'Chalet'}</span>
                </div>
                <span className="text-[10px] text-slate-300 font-mono tabular-nums font-normal">
                  {language === 'ar' ? 'إطلالة بحرية (8.026M)' : 'Sea View (8.026M)'}
                </span>
              </button>

            </div>

            {/* Commercial Offer Display Box (Dynamically updates with unit & payment plan) */}
            <div className="bg-[#05202E]/95 border-2 border-[#D4AF37]/50 rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl backdrop-blur-lg mb-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-cyan-500/20">
                <span className="text-xs font-mono tabular-nums uppercase tracking-widest text-[#E8C868] font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    {isPanoramic130
                      ? (language === 'ar' ? 'عرض شاليه 130 م² بإطلالة بانورامية' : 'VERIFIED 130 m² PANORAMIC OFFER')
                      : isDuplex 
                      ? (language === 'ar' ? 'عرض الدوبلكس ميني فيلا المعتمد' : 'VERIFIED DUPLEX MINI VILLA OFFER')
                      : isLastChalet 
                      ? (language === 'ar' ? 'عرض الوحدة الأخيرة المعتمد' : 'LAST UNIT VERIFIED OFFER') 
                      : (language === 'ar' ? 'عرض الشاليه المعتمد' : 'VERIFIED COMMERCIAL OFFER')}
                  </span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 text-xs font-mono tabular-nums">
                  {activeUnit.unitCode}
                </span>
              </div>

              {/* Interactive Payment Selector for 130m Panoramic */}
              {isPanoramic130 && (
                <div className="mb-6 pb-5 border-b border-cyan-500/20">
                  <span className="text-xs text-slate-300 block mb-2 font-medium">
                    {language === 'ar' ? 'اختر خطة السداد المناسبة للشاليه 130 م²:' : 'Select your payment advantage for the 130 m² Chalet:'}
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handlePanoramicPlanSwitch('6y')}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        selectedPanoramicPlan === '6y'
                          ? 'bg-[#D4AF37]/25 border-[#D4AF37] text-white shadow-md'
                          : 'bg-[#02131D] border-cyan-500/20 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="block text-xs font-bold font-mono tabular-nums">6 {language === 'ar' ? 'سنوات' : 'YEARS'}</span>
                      <span className="block text-[11px] text-[#E8C868] font-bold">23% OFF</span>
                      <span className="block text-[10px] text-cyan-300">9.359M</span>
                    </button>

                    <button
                      onClick={() => handlePanoramicPlanSwitch('7y')}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        selectedPanoramicPlan === '7y'
                          ? 'bg-[#D4AF37]/25 border-[#D4AF37] text-white shadow-md'
                          : 'bg-[#02131D] border-cyan-500/20 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="block text-xs font-bold font-mono tabular-nums">7 {language === 'ar' ? 'سنوات' : 'YEARS'}</span>
                      <span className="block text-[11px] text-[#E8C868] font-bold">20% OFF</span>
                      <span className="block text-[10px] text-cyan-300">9.724M</span>
                    </button>

                    <button
                      onClick={() => handlePanoramicPlanSwitch('8y')}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        selectedPanoramicPlan === '8y'
                          ? 'bg-[#D4AF37]/25 border-[#D4AF37] text-white shadow-md'
                          : 'bg-[#02131D] border-cyan-500/20 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="block text-xs font-bold font-mono tabular-nums">8 {language === 'ar' ? 'سنوات' : 'YEARS'}</span>
                      <span className="block text-[11px] text-[#E8C868] font-bold">15% OFF</span>
                      <span className="block text-[10px] text-cyan-300">10.332M</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Duplex Interactive Payment Selector Inside Offer Box */}
              {isDuplex && (
                <div className="mb-6 pb-5 border-b border-cyan-500/20">
                  <span className="text-xs text-slate-300 block mb-2 font-medium">
                    {language === 'ar' ? 'اختر خطة السداد المناسبة للدوبلكس 180 م²:' : 'Select your payment advantage for the 180 m² Duplex:'}
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleDuplexPlanSwitch('6y')}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        selectedDuplexPlan === '6y'
                          ? 'bg-[#D4AF37]/25 border-[#D4AF37] text-white shadow-md'
                          : 'bg-[#02131D] border-cyan-500/20 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="block text-xs font-bold font-mono tabular-nums">6 {language === 'ar' ? 'سنوات' : 'YEARS'}</span>
                      <span className="block text-[11px] text-[#E8C868] font-bold">23% OFF</span>
                      <span className="block text-[10px] text-cyan-300">11.088M</span>
                    </button>

                    <button
                      onClick={() => handleDuplexPlanSwitch('7y')}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        selectedDuplexPlan === '7y'
                          ? 'bg-[#D4AF37]/25 border-[#D4AF37] text-white shadow-md'
                          : 'bg-[#02131D] border-cyan-500/20 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="block text-xs font-bold font-mono tabular-nums">7 {language === 'ar' ? 'سنوات' : 'YEARS'}</span>
                      <span className="block text-[11px] text-[#E8C868] font-bold">20% OFF</span>
                      <span className="block text-[10px] text-cyan-300">11.520M</span>
                    </button>

                    <button
                      onClick={() => handleDuplexPlanSwitch('8y')}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        selectedDuplexPlan === '8y'
                          ? 'bg-[#D4AF37]/25 border-[#D4AF37] text-white shadow-md'
                          : 'bg-[#02131D] border-cyan-500/20 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="block text-xs font-bold font-mono tabular-nums">8 {language === 'ar' ? 'سنوات' : 'YEARS'}</span>
                      <span className="block text-[11px] text-[#E8C868] font-bold">15% OFF</span>
                      <span className="block text-[10px] text-cyan-300">12.240M</span>
                    </button>
                  </div>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-6">
                {/* Original Price */}
                <div className="text-center sm:text-right">
                  <span className="text-xs text-slate-400 block mb-1">
                    {language === 'ar' ? 'السعر الأصلي قبل الخصم:' : 'Original Price:'}
                  </span>
                  <span className="text-xl sm:text-2xl font-bold text-slate-400 line-through decoration-red-500 decoration-2 font-mono tabular-nums">
                    EGP {activeOriginalPrice.toLocaleString()}
                  </span>
                </div>

                <div className="hidden sm:block text-slate-500 text-3xl font-light">→</div>

                {/* Final Price After Discount */}
                <div className="text-center sm:text-left">
                  <span className="text-xs text-[#E8C868] font-semibold block mb-1">
                    {language === 'ar' ? `السعر النهائي بعد خصم ${activeDiscount}%:` : `Price After ${activeDiscount}% Discount:`}
                  </span>
                  <span className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#E8C868] tracking-tight font-mono tabular-nums">
                    EGP {activePrice.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Payment Breakdown Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-cyan-500/20 text-xs">
                <div className="bg-[#02131D] p-3 rounded-2xl border border-cyan-500/15 text-center">
                  <span className="text-slate-400 block text-[11px] mb-0.5">{language === 'ar' ? 'مقدم 10%' : '10% Down Payment'}</span>
                  <span className="font-bold text-white font-mono tabular-nums text-sm sm:text-base">EGP {activeDownPayment.toLocaleString()}</span>
                </div>
                <div className="bg-[#02131D] p-3 rounded-2xl border border-cyan-500/15 text-center">
                  <span className="text-slate-400 block text-[11px] mb-0.5">{language === 'ar' ? 'قسط ربع سنوي' : 'Quarterly Installment'}</span>
                  <span className="font-bold text-[#E8C868] font-mono tabular-nums text-sm sm:text-base">EGP {activeQuarterly.toLocaleString()}</span>
                </div>
                <div className="bg-[#02131D] p-3 rounded-2xl border border-cyan-500/15 text-center col-span-2 sm:col-span-1">
                  <span className="text-slate-400 block text-[11px] mb-0.5">{language === 'ar' ? 'مدة التقسيط' : 'Installments'}</span>
                  <span className="font-bold text-cyan-300 text-sm sm:text-base">
                    {language === 'ar' ? `${activeYears} سنوات (${activeQuarters} قسط)` : `${activeYears} Years (${activeQuarters} Quarters)`}
                  </span>
                </div>
              </div>
            </div>

            {/* Conversion CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full max-w-lg">
              <button
                onClick={() => {
                  plansRef.current?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-6 py-4 rounded-xl bg-[#082B3E] hover:bg-[#0c3952] border border-cyan-400/40 text-cyan-200 font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>{language === 'ar' ? 'استعراض خطط السداد' : 'VIEW PAYMENT PLANS'}</span>
              </button>

              <button
                onClick={() => {
                  if (isPanoramic130) {
                    trackEvent('sokhna_130p_request_details', {
                      selectedPlan: selectedPanoramicPlan,
                      finalPrice: activePrice,
                      discount: activeDiscount,
                      unitArea: 130
                    });
                  } else if (isDuplex) {
                    trackEvent('sokhna_180_request_details', {
                      selectedPlan: selectedDuplexPlan,
                      finalPrice: activePrice,
                      discount: activeDiscount,
                      unitArea: 180
                    });
                  } else {
                    trackEvent('sokhna_time_last_unit_cta', { unit: activeUnit.unitCode });
                  }
                  formRef.current?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-6 py-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B89628] hover:from-[#E8C868] hover:to-[#D4AF37] text-slate-950 font-bold text-xs sm:text-sm shadow-xl shadow-[#D4AF37]/20 transition-all flex items-center justify-center gap-2"
              >
                <span>{language === 'ar' ? 'طلب تفاصيل الوحدة' : 'REQUEST UNIT DETAILS'}</span>
                <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
              </button>

              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  if (isPanoramic130) {
                    trackEvent('sokhna_130p_whatsapp_click', {
                      selectedPlan: selectedPanoramicPlan,
                      finalPrice: activePrice,
                      discount: activeDiscount,
                      unitArea: 130
                    });
                  } else if (isDuplex) {
                    trackEvent('sokhna_180_whatsapp_click', {
                      selectedPlan: selectedDuplexPlan,
                      finalPrice: activePrice,
                      discount: activeDiscount,
                      unitArea: 180
                    });
                  } else {
                    trackClickWhatsApp('sokhna_time_hero', activeUnit.unitCode);
                  }
                }}
                className="w-full sm:w-auto px-6 py-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm shadow-lg shadow-[#25D366]/20 transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>{language === 'ar' ? 'اسأل عبر واتساب' : 'ASK ON WHATSAPP'}</span>
              </a>
            </div>

          </div>
        </section>

        {/* 2. DEDICATED PROJECT VIDEO SECTION (Where verified media exists) */}
        {hasDedicatedVideo && (
          <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <div className="inline-flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-widest mb-2">
                <Play className="w-4 h-4" />
                <span>{language === 'ar' ? 'استكشف الوحدة بالفيديو' : 'EXPLORE THE UNIT'}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-3">
                {isDuplex
                  ? (language === 'ar' ? 'شاهد فيديو الدوبلكس ميني فيلا والمارينا' : 'Experience Sokhna Time Duplex Mini Villa Live')
                  : (language === 'ar' ? 'شاهد الموقع الحي للشاليه والمارينا' : 'Experience Sokhna Time Live')}
              </h2>
              <p className="text-slate-400 text-sm sm:text-base">
                {language === 'ar'
                  ? 'فيديو واقعي معتمد يوضح الموقع المباشر أمام مارينا اليخوت وتفاصيل الإطلالة البحرية.'
                  : 'Verified video asset capturing the waterfront setting and direct yacht marina overlook.'}
              </p>
            </div>

            <div className={`relative rounded-3xl overflow-hidden border-2 border-cyan-500/30 shadow-2xl bg-black mx-auto group ${isDuplex ? 'max-w-3xl aspect-[848/400]' : 'max-w-sm sm:max-w-md aspect-[480/672]'}`}>
              <video
                key={activeVideoUrl}
                ref={galleryVideoRef}
                poster={activeVideoPoster}
                playsInline
                loop
                controls={isGalleryVideoPlaying}
                preload="metadata"
                muted={isGalleryVideoMuted}
                className="w-full h-full object-cover"
                onClick={toggleGalleryVideoPlay}
              >
                <source src={activeVideoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* Overlay Play Button (when paused) */}
              {!isGalleryVideoPlaying && (
                <div 
                  onClick={toggleGalleryVideoPlay}
                  className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer backdrop-blur-[2px] transition-all group-hover:bg-black/30"
                >
                  <div className="w-20 h-20 rounded-full bg-[#D4AF37] text-slate-950 flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 fill-current ml-1" />
                  </div>
                </div>
              )}

              {/* Video Controls Bar */}
              {!isGalleryVideoPlaying && (
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs bg-black/70 backdrop-blur-md py-2.5 px-4 rounded-xl border border-white/10 pointer-events-none">
                  <div className="flex items-center gap-3">
                    <span className="p-1.5 rounded-lg bg-white/10">
                      <Play className="w-4 h-4 fill-current text-[#D4AF37]" />
                    </span>
                    <span className="text-xs text-slate-300 font-medium">
                      SOKHNA TIME — {isDuplex ? '180 m² Duplex Mini Villa (Sea View)' : 'Ain Sokhna Yacht Marina (130 m² Last Unit)'}
                    </span>
                  </div>

                  <span className="px-2.5 py-1 rounded-md bg-[#D4AF37]/20 text-[#E8C868] text-[11px] font-bold">
                    {language === 'ar' ? 'فيديو معتمد' : 'Verified Media'}
                  </span>
                </div>
              )}
            </div>
          </section>
        )}

        {/* 3. MARINA POSITIONING (Directly at the Yacht Marina) */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="bg-[#051E2B] rounded-3xl p-8 sm:p-12 border border-cyan-500/20 shadow-2xl relative overflow-hidden text-center">
            <div className="inline-flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-widest mb-3">
              <Anchor className="w-4 h-4" />
              <span>{language === 'ar' ? 'الموقع البحري الحصري' : 'DIRECTLY AT THE YACHT MARINA'}</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white mb-6 max-w-3xl mx-auto">
              {language === 'ar' 
                ? 'موقع مباشر على مارينا اليخوت بالعين السخنة' 
                : 'Directly at the Yacht Marina'}
            </h2>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl mx-auto font-light">
              {isPanoramic130
                ? (language === 'ar'
                    ? 'شاليه فندقي بمساحة 130 م² بإطلالة بانورامية على البحر، يقع مباشرة أمام مارينا اليخوت في العين السخنة.'
                    : 'A 130 m² hotel chalet with a panoramic sea view, positioned directly by the yacht marina in Ain Sokhna.')
                : isDuplex
                ? (language === 'ar' 
                    ? 'دوبلكس ميني فيلا فندقية بمساحة 180 م² مع حديقة خاصة 26 م² و3 غرف نوم وإطلالة بحرية، تقع مباشرة أمام مارينا اليخوت في العين السخنة.' 
                    : 'A spacious hotel duplex / mini villa in Ain Sokhna, combining 180 m² of living space, a 26 m² private garden, three bedrooms, and a sea view.')
                : (language === 'ar'
                    ? 'شاليه فندقي بمساحة 130 م² مع حديقة 21 م² وإطلالة بانورامية على البحر، يقع مباشرة أمام مارينا اليخوت في العين السخنة.'
                    : 'A 130 m² hotel chalet with a 21 m² garden and panoramic sea view, positioned directly by the yacht marina in Ain Sokhna.')}
            </p>
          </div>
        </section>

        {/* 4. HIGH-END SPECIFICATION GRID */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 text-[#E8C868] text-xs font-semibold uppercase tracking-widest mb-2">
              <Waves className="w-4 h-4 text-[#D4AF37]" />
              <span>{language === 'ar' ? 'المواصفات الهندسية المعتمدة' : 'VERIFIED SPECIFICATIONS'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-3">
              {isDuplex
                ? (language === 'ar' ? 'مواصفات الدوبلكس ميني فيلا' : 'Duplex Mini Villa Specifications')
                : (language === 'ar' ? 'مواصفات الشاليه الفندقي' : 'Hotel Chalet Specifications')}
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              {language === 'ar'
                ? `بيانات الوحدة المحددة: ${activeUnit.propertyType} (${activeUnit.areaSqm} م²)`
                : `Active Configuration: ${activeUnit.propertyType} (${activeUnit.areaSqm} m²)`}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
            
            {/* Property Type */}
            <div className="bg-[#041A27] rounded-2xl p-5 border border-cyan-500/20 flex flex-col items-center text-center">
              <Building className="w-5 h-5 text-cyan-400 mb-2" />
              <span className="text-sm font-bold text-white font-serif mb-0.5 line-clamp-1">{activeUnit.propertyType}</span>
              <span className="text-[11px] text-slate-400 uppercase">{language === 'ar' ? 'نوع العقار' : 'Property Type'}</span>
            </div>

            {/* Indoor Area */}
            <div className="bg-[#041A27] rounded-2xl p-5 border border-cyan-500/20 flex flex-col items-center text-center">
              <Home className="w-5 h-5 text-cyan-400 mb-2" />
              <span className="text-xl font-bold text-white font-serif mb-0.5">{activeUnit.areaSqm} m²</span>
              <span className="text-[11px] text-slate-400 uppercase">{isDuplex ? (language === 'ar' ? 'مساحة الدوبلكس' : 'Duplex Area') : (language === 'ar' ? 'مساحة الشاليه' : 'Indoor Area')}</span>
            </div>

            {/* Private Garden (or None) */}
            <div className="bg-[#041A27] rounded-2xl p-5 border border-cyan-500/20 flex flex-col items-center text-center">
              <TreePine className="w-5 h-5 text-cyan-400 mb-2" />
              <span className="text-xl font-bold text-white font-serif mb-0.5">{activeUnit.gardenAreaSqm ? `${activeUnit.gardenAreaSqm} m²` : (language === 'ar' ? 'بدون حديقة' : 'No Garden')}</span>
              <span className="text-[11px] text-slate-400 uppercase">{language === 'ar' ? 'الحديقة الخاصة' : 'Private Garden'}</span>
            </div>

            {/* Bedrooms / Rooms */}
            <div className="bg-[#041A27] rounded-2xl p-5 border border-cyan-500/20 flex flex-col items-center text-center">
              <Bed className="w-5 h-5 text-cyan-400 mb-2" />
              <span className="text-base font-bold text-white font-serif mb-0.5">{isDuplex ? (language === 'ar' ? '3 غرف نوم' : '3 Bedrooms') : isLastChalet ? (language === 'ar' ? 'غرفتين نوم' : '2 Bedrooms') : (language === 'ar' ? 'شاليه فندقي' : 'Hotel Chalet')}</span>
              <span className="text-[11px] text-slate-400 uppercase">{language === 'ar' ? 'التقسيم' : 'Configuration'}</span>
            </div>

            {/* View */}
            <div className="bg-[#041A27] rounded-2xl p-5 border border-cyan-500/20 flex flex-col items-center text-center">
              <Waves className="w-5 h-5 text-cyan-400 mb-2" />
              <span className="text-sm font-bold text-white font-serif mb-0.5 truncate max-w-full">
                {activeUnit.view === 'Panoramic Sea View' ? (language === 'ar' ? 'بانوراما البحر' : 'Panoramic Sea View') : (language === 'ar' ? 'إطلالة بحرية' : 'Sea View')}
              </span>
              <span className="text-[11px] text-slate-400 uppercase">{language === 'ar' ? 'الإطلالة' : 'View'}</span>
            </div>

            {/* Delivery */}
            <div className="bg-[#082B3E] rounded-2xl p-5 border-2 border-[#D4AF37] flex flex-col items-center text-center">
              <Calendar className="w-5 h-5 text-[#D4AF37] mb-2" />
              <span className="text-sm font-bold text-[#E8C868] font-serif mb-0.5">{language === 'ar' ? 'ديسمبر 2027' : 'Dec 2027'}</span>
              <span className="text-[11px] text-[#E8C868] uppercase font-semibold">{language === 'ar' ? 'موعد الاستلام' : 'Delivery'}</span>
            </div>

          </div>
        </section>

        {/* 5. PRICING & PAYMENT ADVANTAGE COMPARISON SECTION */}
        <section ref={plansRef} className="py-16 px-4 sm:px-6 lg:px-8 bg-[#031522] border-y border-cyan-500/20">
          <div className="max-w-5xl mx-auto text-center">
            <span className="px-4 py-1.5 rounded-full bg-[#D4AF37]/20 text-[#E8C868] border border-[#D4AF37]/40 text-xs font-bold uppercase tracking-widest inline-block mb-4">
              {language === 'ar' ? 'خيارات السداد والمقارنة' : 'PAYMENT ADVANTAGES & COMPARISON'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-3">
              {isPanoramic130
                ? (language === 'ar' ? 'مقارنة خطط سداد شاليه 130 م² بانوراما' : 'Compare Payment Advantages (130 m² Panoramic)')
                : isDuplex 
                ? (language === 'ar' ? 'مقارنة خطط سداد الدوبلكس ميني فيلا' : 'Compare Payment Advantages (180 m² Duplex)')
                : (language === 'ar' ? 'تفاصيل السعر قبل وبعد الخصم' : 'Verified Pricing & Savings')}
            </h2>
            <p className="text-sm text-slate-400 mb-8 max-w-2xl mx-auto">
              {language === 'ar' 
                ? `السعر الأصلي للوحدة: ${activeOriginalPrice.toLocaleString()} جنيه مصري. اختر الخطة المناسبة لاستعراض السعر النهائي والأقساط.` 
                : `Original Unit Price: EGP ${activeOriginalPrice.toLocaleString()}. Select your preferred duration to view final discounted price and schedule.`}
            </p>

            {isPanoramic130 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
                {/* 6-Year Plan for 130m Panoramic */}
                <div 
                  onClick={() => handlePanoramicPlanSwitch('6y')}
                  className={`cursor-pointer rounded-3xl p-6 border-2 transition-all relative flex flex-col justify-between ${
                    selectedPanoramicPlan === '6y'
                      ? 'bg-[#082B3E] border-[#D4AF37] shadow-2xl shadow-[#D4AF37]/15 scale-[1.02]'
                      : 'bg-[#051C28] border-cyan-500/20 hover:border-cyan-400/50'
                  }`}
                >
                  <div className="absolute -top-3 right-4 px-3 py-0.5 rounded-full bg-[#D4AF37] text-slate-950 text-[10px] font-semibold uppercase tracking-wider">
                    {language === 'ar' ? 'أعلى نسبة خصم (23%)' : 'HIGHEST DISCOUNT — 23%'}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono tabular-nums font-bold text-[#E8C868]">6 {language === 'ar' ? 'سنوات' : 'YEARS'}</span>
                      <span className="px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#E8C868] font-bold text-xs">23% DISCOUNT</span>
                    </div>

                    <span className="text-xs text-slate-400 block mb-0.5 line-through">EGP 12,155,000</span>
                    <span className="text-2xl sm:text-3xl font-serif font-bold text-white block mb-4">
                      EGP 9,359,350
                    </span>

                    <div className="space-y-2 pt-3 border-t border-cyan-500/20 text-xs text-slate-300">
                      <div className="flex justify-between">
                        <span className="text-slate-400">{language === 'ar' ? 'مقدم 10%:' : '10% Down:'}</span>
                        <span className="font-bold text-white font-mono tabular-nums">EGP 935,935</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">{language === 'ar' ? 'قسط ربع سنوي:' : 'Quarterly:'}</span>
                        <span className="font-bold text-[#E8C868] font-mono tabular-nums">EGP 350,975</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">{language === 'ar' ? 'عدد الأقساط:' : 'Quarters:'}</span>
                        <span className="font-medium text-cyan-300">24 {language === 'ar' ? 'دفعة ربع سنوية' : 'Quarters'}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    className={`w-full mt-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      selectedPanoramicPlan === '6y' ? 'bg-[#D4AF37] text-slate-950' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {selectedPanoramicPlan === '6y' ? (language === 'ar' ? 'الخطة المحددة حالياً' : 'Selected Plan') : (language === 'ar' ? 'اختيار هذه الخطة' : 'Select Plan')}
                  </button>
                </div>

                {/* 7-Year Plan for 130m Panoramic */}
                <div 
                  onClick={() => handlePanoramicPlanSwitch('7y')}
                  className={`cursor-pointer rounded-3xl p-6 border-2 transition-all relative flex flex-col justify-between ${
                    selectedPanoramicPlan === '7y'
                      ? 'bg-[#082B3E] border-[#D4AF37] shadow-2xl shadow-[#D4AF37]/15 scale-[1.02]'
                      : 'bg-[#051C28] border-cyan-500/20 hover:border-cyan-400/50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono tabular-nums font-bold text-cyan-300">7 {language === 'ar' ? 'سنوات' : 'YEARS'}</span>
                      <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-bold text-xs">20% DISCOUNT</span>
                    </div>

                    <span className="text-xs text-slate-400 block mb-0.5 line-through">EGP 12,155,000</span>
                    <span className="text-2xl sm:text-3xl font-serif font-bold text-white block mb-4">
                      EGP 9,724,000
                    </span>

                    <div className="space-y-2 pt-3 border-t border-cyan-500/20 text-xs text-slate-300">
                      <div className="flex justify-between">
                        <span className="text-slate-400">{language === 'ar' ? 'مقدم 10%:' : '10% Down:'}</span>
                        <span className="font-bold text-white font-mono tabular-nums">EGP 972,400</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">{language === 'ar' ? 'قسط ربع سنوي:' : 'Quarterly:'}</span>
                        <span className="font-bold text-[#E8C868] font-mono tabular-nums">EGP 312,557</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">{language === 'ar' ? 'عدد الأقساط:' : 'Quarters:'}</span>
                        <span className="font-medium text-cyan-300">28 {language === 'ar' ? 'دفعة ربع سنوية' : 'Quarters'}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    className={`w-full mt-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      selectedPanoramicPlan === '7y' ? 'bg-[#D4AF37] text-slate-950' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {selectedPanoramicPlan === '7y' ? (language === 'ar' ? 'الخطة المحددة حالياً' : 'Selected Plan') : (language === 'ar' ? 'اختيار هذه الخطة' : 'Select Plan')}
                  </button>
                </div>

                {/* 8-Year Plan for 130m Panoramic */}
                <div 
                  onClick={() => handlePanoramicPlanSwitch('8y')}
                  className={`cursor-pointer rounded-3xl p-6 border-2 transition-all relative flex flex-col justify-between ${
                    selectedPanoramicPlan === '8y'
                      ? 'bg-[#082B3E] border-[#D4AF37] shadow-2xl shadow-[#D4AF37]/15 scale-[1.02]'
                      : 'bg-[#051C28] border-cyan-500/20 hover:border-cyan-400/50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono tabular-nums font-bold text-cyan-300">8 {language === 'ar' ? 'سنوات' : 'YEARS'}</span>
                      <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-bold text-xs">15% DISCOUNT</span>
                    </div>

                    <span className="text-xs text-slate-400 block mb-0.5 line-through">EGP 12,155,000</span>
                    <span className="text-2xl sm:text-3xl font-serif font-bold text-white block mb-4">
                      EGP 10,331,750
                    </span>

                    <div className="space-y-2 pt-3 border-t border-cyan-500/20 text-xs text-slate-300">
                      <div className="flex justify-between">
                        <span className="text-slate-400">{language === 'ar' ? 'مقدم 10%:' : '10% Down:'}</span>
                        <span className="font-bold text-white font-mono tabular-nums">EGP 1,033,175</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">{language === 'ar' ? 'قسط ربع سنوي:' : 'Quarterly:'}</span>
                        <span className="font-bold text-[#E8C868] font-mono tabular-nums">EGP 290,580</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">{language === 'ar' ? 'عدد الأقساط:' : 'Quarters:'}</span>
                        <span className="font-medium text-cyan-300">32 {language === 'ar' ? 'دفعة ربع سنوية' : 'Quarters'}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    className={`w-full mt-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      selectedPanoramicPlan === '8y' ? 'bg-[#D4AF37] text-slate-950' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {selectedPanoramicPlan === '8y' ? (language === 'ar' ? 'الخطة المحددة حالياً' : 'Selected Plan') : (language === 'ar' ? 'اختيار هذه الخطة' : 'Select Plan')}
                  </button>
                </div>
              </div>
            ) : isDuplex ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
                {/* 6-Year Plan */}
                <div 
                  onClick={() => handleDuplexPlanSwitch('6y')}
                  className={`cursor-pointer rounded-3xl p-6 border-2 transition-all relative flex flex-col justify-between ${
                    selectedDuplexPlan === '6y'
                      ? 'bg-[#082B3E] border-[#D4AF37] shadow-2xl shadow-[#D4AF37]/15 scale-[1.02]'
                      : 'bg-[#051C28] border-cyan-500/20 hover:border-cyan-400/50'
                  }`}
                >
                  <div className="absolute -top-3 right-4 px-3 py-0.5 rounded-full bg-[#D4AF37] text-slate-950 text-[10px] font-semibold uppercase tracking-wider">
                    {language === 'ar' ? 'أعلى نسبة خصم (23%)' : 'HIGHEST DISCOUNT — 23%'}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono tabular-nums font-bold text-[#E8C868]">6 {language === 'ar' ? 'سنوات' : 'YEARS'}</span>
                      <span className="px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#E8C868] font-bold text-xs">23% OFF</span>
                    </div>

                    <span className="text-xs text-slate-400 block mb-0.5 line-through">EGP 14,400,000</span>
                    <span className="text-2xl sm:text-3xl font-serif font-bold text-white block mb-4">
                      EGP 11,088,000
                    </span>

                    <div className="space-y-2 pt-3 border-t border-cyan-500/20 text-xs text-slate-300">
                      <div className="flex justify-between">
                        <span className="text-slate-400">{language === 'ar' ? 'مقدم 10%:' : '10% Down:'}</span>
                        <span className="font-bold text-white font-mono tabular-nums">EGP 1,108,800</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">{language === 'ar' ? 'قسط ربع سنوي:' : 'Quarterly:'}</span>
                        <span className="font-bold text-[#E8C868] font-mono tabular-nums">EGP 415,800</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">{language === 'ar' ? 'عدد الأقساط:' : 'Quarters:'}</span>
                        <span className="font-medium text-cyan-300">24 {language === 'ar' ? 'دفعة ربع سنوية' : 'Quarters'}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    className={`w-full mt-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      selectedDuplexPlan === '6y' ? 'bg-[#D4AF37] text-slate-950' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {selectedDuplexPlan === '6y' ? (language === 'ar' ? 'الخطة المحددة حالياً' : 'Selected Plan') : (language === 'ar' ? 'اختيار هذه الخطة' : 'Select Plan')}
                  </button>
                </div>

                {/* 7-Year Plan */}
                <div 
                  onClick={() => handleDuplexPlanSwitch('7y')}
                  className={`cursor-pointer rounded-3xl p-6 border-2 transition-all relative flex flex-col justify-between ${
                    selectedDuplexPlan === '7y'
                      ? 'bg-[#082B3E] border-[#D4AF37] shadow-2xl shadow-[#D4AF37]/15 scale-[1.02]'
                      : 'bg-[#051C28] border-cyan-500/20 hover:border-cyan-400/50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono tabular-nums font-bold text-cyan-300">7 {language === 'ar' ? 'سنوات' : 'YEARS'}</span>
                      <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-bold text-xs">20% OFF</span>
                    </div>

                    <span className="text-xs text-slate-400 block mb-0.5 line-through">EGP 14,400,000</span>
                    <span className="text-2xl sm:text-3xl font-serif font-bold text-white block mb-4">
                      EGP 11,520,000
                    </span>

                    <div className="space-y-2 pt-3 border-t border-cyan-500/20 text-xs text-slate-300">
                      <div className="flex justify-between">
                        <span className="text-slate-400">{language === 'ar' ? 'مقدم 10%:' : '10% Down:'}</span>
                        <span className="font-bold text-white font-mono tabular-nums">EGP 1,152,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">{language === 'ar' ? 'قسط ربع سنوي:' : 'Quarterly:'}</span>
                        <span className="font-bold text-[#E8C868] font-mono tabular-nums">EGP 370,285</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">{language === 'ar' ? 'عدد الأقساط:' : 'Quarters:'}</span>
                        <span className="font-medium text-cyan-300">28 {language === 'ar' ? 'دفعة ربع سنوية' : 'Quarters'}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    className={`w-full mt-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      selectedDuplexPlan === '7y' ? 'bg-[#D4AF37] text-slate-950' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {selectedDuplexPlan === '7y' ? (language === 'ar' ? 'الخطة المحددة حالياً' : 'Selected Plan') : (language === 'ar' ? 'اختيار هذه الخطة' : 'Select Plan')}
                  </button>
                </div>

                {/* 8-Year Plan */}
                <div 
                  onClick={() => handleDuplexPlanSwitch('8y')}
                  className={`cursor-pointer rounded-3xl p-6 border-2 transition-all relative flex flex-col justify-between ${
                    selectedDuplexPlan === '8y'
                      ? 'bg-[#082B3E] border-[#D4AF37] shadow-2xl shadow-[#D4AF37]/15 scale-[1.02]'
                      : 'bg-[#051C28] border-cyan-500/20 hover:border-cyan-400/50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono tabular-nums font-bold text-cyan-300">8 {language === 'ar' ? 'سنوات' : 'YEARS'}</span>
                      <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-bold text-xs">15% OFF</span>
                    </div>

                    <span className="text-xs text-slate-400 block mb-0.5 line-through">EGP 14,400,000</span>
                    <span className="text-2xl sm:text-3xl font-serif font-bold text-white block mb-4">
                      EGP 12,240,000
                    </span>

                    <div className="space-y-2 pt-3 border-t border-cyan-500/20 text-xs text-slate-300">
                      <div className="flex justify-between">
                        <span className="text-slate-400">{language === 'ar' ? 'مقدم 10%:' : '10% Down:'}</span>
                        <span className="font-bold text-white font-mono tabular-nums">EGP 1,224,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">{language === 'ar' ? 'قسط ربع سنوي:' : 'Quarterly:'}</span>
                        <span className="font-bold text-[#E8C868] font-mono tabular-nums">EGP 344,250</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">{language === 'ar' ? 'عدد الأقساط:' : 'Quarters:'}</span>
                        <span className="font-medium text-cyan-300">32 {language === 'ar' ? 'دفعة ربع سنوية' : 'Quarters'}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    className={`w-full mt-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      selectedDuplexPlan === '8y' ? 'bg-[#D4AF37] text-slate-950' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {selectedDuplexPlan === '8y' ? (language === 'ar' ? 'الخطة المحددة حالياً' : 'Selected Plan') : (language === 'ar' ? 'اختيار هذه الخطة' : 'Select Plan')}
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center max-w-4xl mx-auto">
                {/* Before Discount */}
                <div className="bg-[#051C28] rounded-2xl p-8 border border-slate-700/80 text-center flex flex-col items-center justify-center">
                  <span className="text-xs text-slate-400 uppercase font-mono tabular-nums tracking-wider mb-2">
                    {language === 'ar' ? 'السعر الأصلي قبل الخصم' : 'Original Price'}
                  </span>
                  <span className="text-2xl sm:text-3xl font-serif font-bold text-slate-400 line-through decoration-red-500 decoration-2">
                    EGP {activeOriginalPrice.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-500 mt-2">
                    {language === 'ar' ? 'السعر المرجعي للوحدة' : 'Base Contract Price'}
                  </span>
                </div>

                {/* After Discount */}
                <div className="bg-[#082B3E] rounded-2xl p-8 border-2 border-[#D4AF37] text-center flex flex-col items-center justify-center relative shadow-2xl shadow-[#D4AF37]/15">
                  <span className="absolute -top-3 px-3 py-0.5 rounded-full bg-[#D4AF37] text-slate-950 text-[11px] font-bold uppercase tracking-wider">
                    {language === 'ar' ? 'السعر النهائي' : 'FINAL DISCOUNTED PRICE'}
                  </span>
                  <span className="text-xs text-[#E8C868] uppercase font-mono tabular-nums tracking-wider mb-2">
                    {language === 'ar' ? 'السعر بعد خصم 15%' : 'Price After 15% Discount'}
                  </span>
                  <span className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
                    EGP {activePrice.toLocaleString()}
                  </span>
                  <span className="text-xs text-cyan-300 mt-2 font-medium">
                    {language === 'ar' 
                      ? `وفر ${(activeOriginalPrice - activePrice).toLocaleString()} جنيه مصري` 
                      : `Save EGP ${(activeOriginalPrice - activePrice).toLocaleString()}`}
                  </span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 6. PAYMENT PLAN SUMMARY (Own It with 10% Down) */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-widest mb-2">
              <DollarSign className="w-4 h-4" />
              <span>{language === 'ar' ? 'امتلك بمقدم 10% فقط' : 'OWN IT WITH 10% DOWN'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-3">
              {language === 'ar' ? `خطة سداد مريحة على ${activeYears} سنوات` : `${activeYears}-Year Installment Plan`}
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              {language === 'ar' 
                ? `دفعات ربع سنوية متساوية على ${activeYears} سنوات (${activeQuarters} قسطاً) ومقدم حجز 10% فقط` 
                : `Equal quarterly installments over ${activeYears} years (${activeQuarters} quarters) with 10% down payment`}
            </p>
          </div>

          <div className="bg-[#051F2D] rounded-3xl p-8 sm:p-10 border border-cyan-500/30 shadow-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Down Payment % */}
              <div className="bg-[#02131D] rounded-2xl p-6 border border-cyan-500/20 text-center">
                <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">
                  {language === 'ar' ? 'نسبة المقدم' : 'Down Payment'}
                </span>
                <span className="text-3xl font-serif font-bold text-cyan-300 block mb-1">
                  10%
                </span>
                <span className="text-xs text-slate-400">
                  {language === 'ar' ? 'دفعة التعاقد' : 'Initial Deposit'}
                </span>
              </div>

              {/* Down Payment Amount */}
              <div className="bg-[#02131D] rounded-2xl p-6 border border-cyan-500/20 text-center">
                <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">
                  {language === 'ar' ? 'قيمة المقدم' : 'Down Payment Amount'}
                </span>
                <span className="text-2xl font-serif font-bold text-white block mb-1 font-mono tabular-nums">
                  EGP {activeDownPayment.toLocaleString()}
                </span>
                <span className="text-xs text-slate-400">
                  {language === 'ar' ? 'المبلغ المطلوب للتعاقد' : 'Contract Deposit'}
                </span>
              </div>

              {/* Installment Duration */}
              <div className="bg-[#02131D] rounded-2xl p-6 border border-cyan-500/20 text-center">
                <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">
                  {language === 'ar' ? 'مدة التقسيط' : 'Installment Period'}
                </span>
                <span className="text-3xl font-serif font-bold text-cyan-300 block mb-1">
                  {activeYears} {language === 'ar' ? 'سنوات' : 'Years'}
                </span>
                <span className="text-xs text-slate-400">
                  {activeQuarters} {language === 'ar' ? 'دفعة ربع سنوية' : 'Quarters'}
                </span>
              </div>

              {/* Quarterly Installment */}
              <div className="bg-[#082B3E] rounded-2xl p-6 border-2 border-[#D4AF37] text-center shadow-lg shadow-[#D4AF37]/10">
                <span className="text-xs text-[#E8C868] uppercase tracking-wider block mb-1 font-semibold">
                  {language === 'ar' ? 'القسط الربع سنوي' : 'Quarterly Installment'}
                </span>
                <span className="text-2xl font-serif font-bold text-white block mb-1 font-mono tabular-nums">
                  EGP {activeQuarterly.toLocaleString()}
                </span>
                <span className="text-xs text-[#E8C868]">
                  {language === 'ar' ? 'كل 3 أشهر' : 'Every 3 Months'}
                </span>
              </div>

            </div>

            <div className="mt-8 pt-6 border-t border-cyan-500/15 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{language === 'ar' ? 'خطة سداد معتمدة ومطابقة لبيانات المطور بدون فوائد بنكية.' : 'Direct developer installment plan matching verified commercial terms.'}</span>
              </div>
              <button
                onClick={() => formRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-cyan-950 hover:bg-cyan-900 text-cyan-200 border border-cyan-400/30 text-xs font-bold transition-all"
              >
                {language === 'ar' ? 'طلب جدول الأقساط الكامل' : 'Request Full Schedule'}
              </button>
            </div>
          </div>
        </section>

        {/* 7. ARCHITECTURAL FLOOR PLAN & VERIFICATION GALLERY */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto bg-[#031622] rounded-3xl border border-cyan-500/20 my-10">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 text-[#E8C868] text-xs font-semibold uppercase tracking-widest mb-2">
              <FileText className="w-4 h-4 text-[#D4AF37]" />
              <span>{language === 'ar' ? 'المخطط الهندسي والمعرض' : 'ARCHITECTURAL LAYOUT & GALLERY'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-3">
              {language === 'ar' ? 'المخططات الهندسية والصور المعتمدة' : 'Verified Floor Plans & Visual Assets'}
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              {language === 'ar' ? 'انقر على أي صورة لتكبيرها بدقة عالية في العارض الكامل' : 'Click on any image to inspect high-resolution floor plans & visuals'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
            {SOKHNA_TIME_GALLERY.map((item, idx) => (
              <div
                key={idx}
                onClick={() => setModalImageIndex(idx)}
                className="group cursor-pointer bg-[#020D14] rounded-2xl overflow-hidden border border-cyan-500/20 hover:border-cyan-400/50 transition-all flex flex-col justify-between"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-black/60 flex items-center justify-center p-2">
                  <img
                    src={item.src}
                    alt={item.titleEn}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                  <div className="absolute bottom-2 right-2 p-1.5 rounded-md bg-black/70 text-cyan-300 text-xs">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors mb-1 line-clamp-1">
                    {language === 'ar' ? item.titleAr : language === 'de' ? item.titleDe : item.titleEn}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    {language === 'ar' ? item.descAr : language === 'de' ? item.descDe : item.descEn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 8. HOTEL RENTAL POSSIBILITY SECTION */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="bg-[#051C2A] rounded-3xl p-8 sm:p-10 border border-cyan-500/25 shadow-xl text-center">
            <div className="inline-flex items-center gap-2 text-[#E8C868] text-xs font-semibold uppercase tracking-widest mb-3">
              <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
              <span>{language === 'ar' ? 'إمكانية التأجير الفندقي' : 'RENTAL POSSIBILITY WITH THE HOTEL'}</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-4">
              {language === 'ar' ? 'إمكانية التأجير الفندقي' : 'Rental Possibility with the Hotel'}
            </h2>

            <p className="text-base text-slate-300 leading-relaxed max-w-2xl mx-auto mb-6 font-light">
              {language === 'ar'
                ? 'يوفر هذا الشاليه الفندقي إمكانية التأجير من خلال أو مع الفندق، وفقاً للشروط والضوابط التشغيلية المعتمدة وتوافر الطلب.'
                : 'This hotel chalet offers the possibility of rental with/through the hotel, subject to the applicable hotel rental terms.'}
            </p>

            <button
              onClick={() => {
                setInterestedInRental(true);
                if (isPanoramic130) {
                  trackEvent('sokhna_130p_rental_interest', {
                    selectedPlan: selectedPanoramicPlan,
                    finalPrice: activePrice,
                    unitArea: 130
                  });
                } else if (isDuplex) {
                  trackEvent('sokhna_180_rental_interest', {
                    selectedPlan: selectedDuplexPlan,
                    finalPrice: activePrice,
                    unitArea: 180
                  });
                } else {
                  trackEvent('sokhna_time_rental_interest', { unit: activeUnit.unitCode });
                }
                formRef.current?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#E8C868] text-slate-950 text-xs font-bold shadow-md transition-all"
            >
              <span>{language === 'ar' ? 'طلب تفاصيل التأجير' : 'ASK ABOUT RENTAL DETAILS'}</span>
              <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </section>

        {/* 9. DELIVERY TIMELINE SECTION */}
        <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto text-center">
          <div className="p-6 rounded-2xl bg-[#041622] border border-cyan-500/20 inline-flex flex-col items-center">
            <span className="text-xs uppercase tracking-widest text-slate-400 font-mono tabular-nums mb-1">
              {language === 'ar' ? 'الجدول الزمني للتسليم' : 'DELIVERY TIMELINE'}
            </span>
            <div className="flex items-center gap-3 text-xl sm:text-2xl font-serif font-bold text-white">
              <Calendar className="w-6 h-6 text-cyan-400" />
              <span>{language === 'ar' ? 'موعد الاستلام — ديسمبر 2027' : 'DELIVERY — DECEMBER 2027'}</span>
            </div>
          </div>
        </section>

        {/* 10. LEAD CAPTURE & WHATSAPP ENQUIRY FORM */}
        <section ref={formRef} id="enquiry" className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="bg-[#051C2A] rounded-3xl p-8 sm:p-12 border-2 border-cyan-500/30 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="text-center max-w-2xl mx-auto mb-8">
              <span className="px-3.5 py-1 rounded-full bg-[#D4AF37]/20 text-[#E8C868] border border-[#D4AF37]/40 text-xs font-bold uppercase tracking-wider inline-block mb-3">
                {language === 'ar' ? 'حجز واستفسار رسمي' : 'OFFICIAL INQUIRY DESK'}
              </span>
              <h2 className="text-3xl font-serif font-bold text-white mb-2">
                {isPanoramic130
                  ? (language === 'ar' ? 'طلب تفاصيل شاليه 130 م² بانوراما' : 'Request 130 m² Panoramic Chalet')
                  : isDuplex
                  ? (language === 'ar' ? 'طلب حجز واستفسار: دوبلكس ميني فيلا (180 م²)' : 'Request Sokhna Time Duplex Mini Villa (180 m²)')
                  : isLastChalet 
                  ? (language === 'ar' ? 'طلب حجز الوحدة الأخيرة (130 م² + حديقة)' : 'Request Last Unit (130 m² + Garden)')
                  : (language === 'ar' ? 'طلب توفر الشاليه والتفاصيل' : 'Request Availability & Full Details')}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                {language === 'ar'
                  ? 'سيتواصل معك مستشار الاستثمار العقاري فوراً عبر واتساب لتأكيد الأسعار وجدول الأقساط المعتمد.'
                  : 'A Capital Pioneers advisor will connect with you via WhatsApp to confirm availability & payment schedule.'}
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
                    ? 'شكراً لاهتمامك بمشروع SOKHNA TIME. يمكنك بدء المحادثة الفورية مع مستشارك عبر واتساب الآن.'
                    : 'Thank you for your interest in SOKHNA TIME. You can now start a direct WhatsApp conversation with our advisory desk.'}
                </p>

                {whatsappHandoffUrl && (
                  <a
                    href={whatsappHandoffUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      if (isPanoramic130) {
                        trackEvent('sokhna_130p_whatsapp_click', {
                          selectedPlan: selectedPanoramicPlan,
                          finalPrice: activePrice,
                          unitArea: 130
                        });
                      } else if (isDuplex) {
                        trackEvent('sokhna_180_whatsapp_click', {
                          selectedPlan: selectedDuplexPlan,
                          finalPrice: activePrice,
                          unitArea: 180
                        });
                      } else {
                        trackClickWhatsApp('sokhna_time_form_success', activeUnit.unitCode);
                      }
                    }}
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm shadow-xl transition-all"
                  >
                    <MessageCircle className="w-5 h-5 fill-current" />
                    <span>{language === 'ar' ? 'متابعة عبر واتساب الآن' : 'Continue on WhatsApp Now'}</span>
                  </a>
                )}
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4 max-w-lg mx-auto">
                
                {/* Pre-Selected Unit Summary Badge */}
                <div className="bg-[#02131D] p-3.5 rounded-xl border border-cyan-500/20 text-xs text-cyan-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <span className="text-slate-400 block text-[11px]">{language === 'ar' ? 'الوحدة وخطة السداد المحددة:' : 'Selected Unit & Plan:'}</span>
                    <span className="font-bold text-white">
                      SOKHNA TIME — {activeUnit.areaSqm} m² {activeUnit.gardenAreaSqm ? `+ ${activeUnit.gardenAreaSqm} m² Garden` : ''} {isPanoramic130 ? `(${selectedPanoramicPlan.toUpperCase()} - ${activeDiscount}% OFF)` : isDuplex ? `(${selectedDuplexPlan.toUpperCase()} - ${activeDiscount}% OFF)` : `(${activeUnit.view})`}
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-[#D4AF37]/20 text-[#E8C868] font-mono tabular-nums font-bold self-start sm:self-center">
                    EGP {(activePrice / 1000000).toFixed(3)}M
                  </span>
                </div>

                {isPanoramic130 && (
                  <div>
                    <label className="block text-xs text-slate-300 font-medium mb-1.5">
                      {language === 'ar' ? 'خطة السداد المفضلة' : 'Preferred Payment Plan'}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => handlePanoramicPlanSwitch('6y')}
                        className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all ${
                          selectedPanoramicPlan === '6y' ? 'bg-[#D4AF37] text-slate-950 border-[#D4AF37]' : 'bg-[#02121B] text-slate-300 border-cyan-500/20'
                        }`}
                      >
                        6Y (23% OFF)
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePanoramicPlanSwitch('7y')}
                        className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all ${
                          selectedPanoramicPlan === '7y' ? 'bg-[#D4AF37] text-slate-950 border-[#D4AF37]' : 'bg-[#02121B] text-slate-300 border-cyan-500/20'
                        }`}
                      >
                        7Y (20% OFF)
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePanoramicPlanSwitch('8y')}
                        className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all ${
                          selectedPanoramicPlan === '8y' ? 'bg-[#D4AF37] text-slate-950 border-[#D4AF37]' : 'bg-[#02121B] text-slate-300 border-cyan-500/20'
                        }`}
                      >
                        8Y (15% OFF)
                      </button>
                    </div>
                  </div>
                )}

                {isDuplex && (
                  <div>
                    <label className="block text-xs text-slate-300 font-medium mb-1.5">
                      {language === 'ar' ? 'خطة السداد المفضلة' : 'Preferred Payment Plan'}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => handleDuplexPlanSwitch('6y')}
                        className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all ${
                          selectedDuplexPlan === '6y' ? 'bg-[#D4AF37] text-slate-950 border-[#D4AF37]' : 'bg-[#02121B] text-slate-300 border-cyan-500/20'
                        }`}
                      >
                        6Y (23% OFF)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDuplexPlanSwitch('7y')}
                        className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all ${
                          selectedDuplexPlan === '7y' ? 'bg-[#D4AF37] text-slate-950 border-[#D4AF37]' : 'bg-[#02121B] text-slate-300 border-cyan-500/20'
                        }`}
                      >
                        7Y (20% OFF)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDuplexPlanSwitch('8y')}
                        className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all ${
                          selectedDuplexPlan === '8y' ? 'bg-[#D4AF37] text-slate-950 border-[#D4AF37]' : 'bg-[#02121B] text-slate-300 border-cyan-500/20'
                        }`}
                      >
                        8Y (15% OFF)
                      </button>
                    </div>
                  </div>
                )}

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

                {/* Rental Option Checkbox */}
                <div 
                  className="bg-[#02131D] p-3 rounded-xl border border-cyan-500/15 flex items-center gap-3 cursor-pointer" 
                  onClick={() => setInterestedInRental(!interestedInRental)}
                >
                  <input
                    type="checkbox"
                    id="rentalCheckbox"
                    checked={interestedInRental}
                    onChange={(e) => setInterestedInRental(e.target.checked)}
                    className="w-4 h-4 accent-[#D4AF37] rounded cursor-pointer"
                  />
                  <label htmlFor="rentalCheckbox" className="text-xs text-slate-300 cursor-pointer">
                    {language === 'ar' 
                      ? 'مهتم بالاستفسار عن إمكانية التأجير الفندقي' 
                      : 'Interested in hotel rental option'}
                  </label>
                </div>

                <div>
                  <label className="block text-xs text-slate-300 font-medium mb-1.5">
                    {language === 'ar' ? 'ملاحظات أو أسئلة إضافية' : 'Additional Notes / Questions'}
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={language === 'ar' ? 'هل لديك أي استفسار محدد؟' : 'Any specific question?'}
                    className="w-full px-4 py-3 rounded-xl bg-[#02121B] border border-cyan-500/20 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition-all resize-none"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B89628] hover:from-[#E8C868] hover:to-[#D4AF37] disabled:opacity-50 text-slate-950 font-bold text-sm shadow-lg shadow-[#D4AF37]/20 transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span>{language === 'ar' ? 'جاري الإرسال...' : 'Submitting...'}</span>
                    ) : (
                      <>
                        <span>
                          {isPanoramic130 
                            ? (language === 'ar' ? 'طلب تفاصيل الشاليه' : 'REQUEST CHALET DETAILS')
                            : isDuplex 
                            ? (language === 'ar' ? 'طلب حجز الدوبلكس' : 'REQUEST DUPLEX')
                            : isLastChalet 
                            ? (language === 'ar' ? 'طلب حجز الوحدة الأخيرة' : 'REQUEST LAST UNIT') 
                            : (language === 'ar' ? 'طلب توفر الشاليه' : 'Request Availability')}
                        </span>
                        <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                      </>
                    )}
                  </button>

                  <a
                    href={getWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      if (isPanoramic130) {
                        trackEvent('sokhna_130p_whatsapp_click', {
                          selectedPlan: selectedPanoramicPlan,
                          finalPrice: activePrice,
                          unitArea: 130
                        });
                      } else if (isDuplex) {
                        trackEvent('sokhna_180_whatsapp_click', {
                          selectedPlan: selectedDuplexPlan,
                          finalPrice: activePrice,
                          unitArea: 180
                        });
                      } else {
                        trackClickWhatsApp('sokhna_time_form', activeUnit.unitCode);
                      }
                    }}
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

        {/* 11. LIGHTBOX MODAL */}
        {modalImageIndex !== null && SOKHNA_TIME_GALLERY[modalImageIndex] && (
          <div 
            onClick={() => setModalImageIndex(null)}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fade-in"
          >
            <div 
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full max-h-[95vh] flex flex-col items-center justify-center"
            >
              {/* Top Bar */}
              <div className="w-full flex items-center justify-between text-white mb-2 px-2">
                <div className="flex items-center gap-2 text-xs font-mono tabular-nums text-cyan-300">
                  <span className="px-2.5 py-1 rounded-md bg-[#082B3E] border border-cyan-400/30 font-bold">
                    {modalImageIndex + 1} / {SOKHNA_TIME_GALLERY.length}
                  </span>
                  <span className="text-slate-300 hidden sm:inline">
                    {language === 'ar' 
                      ? SOKHNA_TIME_GALLERY[modalImageIndex].titleAr 
                      : language === 'de'
                      ? SOKHNA_TIME_GALLERY[modalImageIndex].titleDe
                      : SOKHNA_TIME_GALLERY[modalImageIndex].titleEn}
                  </span>
                </div>
                <button
                  onClick={() => setModalImageIndex(null)}
                  className="p-2 rounded-full bg-black/60 text-slate-300 hover:text-white hover:bg-black transition-all"
                  aria-label="Close Lightbox"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Main Image View with Left/Right Buttons */}
              <div className="relative w-full flex items-center justify-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setModalImageIndex((modalImageIndex - 1 + SOKHNA_TIME_GALLERY.length) % SOKHNA_TIME_GALLERY.length);
                  }}
                  className="absolute left-2 sm:left-4 z-10 p-3 rounded-full bg-black/70 text-white hover:bg-[#D4AF37] hover:text-slate-950 transition-all shadow-xl backdrop-blur-sm"
                  aria-label="Previous Photo"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <img
                  src={SOKHNA_TIME_GALLERY[modalImageIndex].src}
                  alt={SOKHNA_TIME_GALLERY[modalImageIndex].titleEn}
                  className="max-h-[75vh] w-auto max-w-full object-contain rounded-2xl border border-cyan-500/20 shadow-2xl"
                />

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setModalImageIndex((modalImageIndex + 1) % SOKHNA_TIME_GALLERY.length);
                  }}
                  className="absolute right-2 sm:right-4 z-10 p-3 rounded-full bg-black/70 text-white hover:bg-[#D4AF37] hover:text-slate-950 transition-all shadow-xl backdrop-blur-sm"
                  aria-label="Next Photo"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Bottom Caption & Action */}
              <div className="w-full mt-3 flex flex-col sm:flex-row items-center justify-between gap-2 px-2 text-center sm:text-left">
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {language === 'ar' 
                      ? SOKHNA_TIME_GALLERY[modalImageIndex].titleAr 
                      : language === 'de'
                      ? SOKHNA_TIME_GALLERY[modalImageIndex].titleDe
                      : SOKHNA_TIME_GALLERY[modalImageIndex].titleEn}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {language === 'ar' 
                      ? SOKHNA_TIME_GALLERY[modalImageIndex].descAr 
                      : language === 'de'
                      ? SOKHNA_TIME_GALLERY[modalImageIndex].descDe
                      : SOKHNA_TIME_GALLERY[modalImageIndex].descEn}
                  </p>
                </div>
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs shadow-md transition-all shrink-0"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>{language === 'ar' ? 'استفسار عبر واتساب' : 'Inquire via WhatsApp'}</span>
                </a>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
};
