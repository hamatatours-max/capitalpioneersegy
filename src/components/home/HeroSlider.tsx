import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Calendar, 
  ArrowRight, 
  Sparkles,
  Pause,
  Play,
  CheckCircle2,
  Building2
} from 'lucide-react';
import { HERO_SLIDES, HeroSlide } from '@/data/projectsData';
import { useLanguage } from '@/context/LanguageContext';
import { trackRequestViewing, trackEvent } from '@/services/analyticsService';

interface HeroSliderProps {
  onRequestViewing?: (projectName?: string) => void;
}

/**
 * Strict Image-to-Project Integrity Check
 * Ensures that every image rendered on the homepage matches its designated project path.
 */
export const verifyImageProjectIntegrity = (imagePath: string, projectSlug: string): boolean => {
  const allowedPrefixesBySlug: Record<string, string[]> = {
    'marina-hills': ['/images/projects/marina-hills/'],
    'the-island': ['/images/projects/the-island/'],
    'sokhna-time': ['/images/projects/sokhna-time/'],
    'core-point': ['/images/projects/core-point/'],
    'kernal-mall-41-sqm-clinic-office-new-cairo': ['/images/projects/kernel-mall/', '/images/projects/kernal-mall/'],
    'nexus-mall': ['/images/projects/nexus-mall/'],
    'mirai-complex': ['/images/projects/mirai-complex/'],
    'artea-mall': ['/images/projects/artea-mall/'],
    'twenty-plus': ['/images/projects/twenty-plus/'],
    'platinum-resort-hurghada': ['/images/projects/platinum-resort-hurghada/'],
    'beit-al-watan-f165-apartment-196sqm': ['/images/projects/beit-al-watan-f165/'],
  };

  const prefixes = allowedPrefixesBySlug[projectSlug];
  if (!prefixes) return true; // General fallback if not specifically restricted
  return prefixes.some((prefix) => imagePath.startsWith(prefix));
};

export const HeroSlider: React.FC<HeroSliderProps> = ({ onRequestViewing }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const { t, isRTL, language } = useLanguage();

  const SLIDE_DURATION = 6000; // 6 seconds autoplay interval
  const PROGRESS_TICK = 40; // 40ms interval for ultra-smooth 60fps progress bar

  // Verified slides with image integrity verification
  const verifiedSlides: HeroSlide[] = useMemo(() => {
    return HERO_SLIDES.filter((slide) => {
      const isValid = verifyImageProjectIntegrity(slide.image, slide.projectSlug);
      if (!isValid) {
        console.warn(`[HeroSlider Integrity Warning] Image ${slide.image} does not match project ${slide.projectSlug}`);
      }
      return isValid;
    });
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === verifiedSlides.length - 1 ? 0 : prev + 1));
    setProgress(0);
  }, [verifiedSlides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? verifiedSlides.length - 1 : prev - 1));
    setProgress(0);
  }, [verifiedSlides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setProgress(0);
  };

  // Autoplay and progress ticker
  useEffect(() => {
    if (!isAutoPlaying || isHovered) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextSlide();
          return 0;
        }
        return prev + (PROGRESS_TICK / SLIDE_DURATION) * 100;
      });
    }, PROGRESS_TICK);

    return () => clearInterval(interval);
  }, [isAutoPlaying, isHovered, nextSlide]);

  // Touch / Swipe Navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      if (isRTL) prevSlide();
      else nextSlide();
    } else if (isRightSwipe) {
      if (isRTL) nextSlide();
      else prevSlide();
    }
  };

  const current = verifiedSlides[currentSlide] || verifiedSlides[0];

  // Localized Slide Content for all 3 Languages
  const localizedSlides: Record<string, Record<string, any>> = {
    'hero-marina-hills': {
      en: {
        title: 'Marina Hills Sokhna',
        subtitle: 'Powered by Gravity Hotels',
        location: 'Ain Sokhna, Red Sea Coast, Egypt',
        category: 'Coastal & Hotel-Serviced Chalets',
        description: 'Fully finished hotel-serviced chalets with smart home systems in Ain Sokhna operated by Gravity Hotels (5th branch in Egypt). All units feature panoramic double sea & pool views with 10% down payment over 8 years.',
        badge: 'GRAVITY HOTELS COLLABORATION',
        highlights: [
          'Double View: Direct Sea View & Pool View',
          '10% Down Payment • Installments Up to 8 Years',
        ],
        stats: [
          { label: 'Category', value: 'Coastal / Hospitality' },
          { label: 'Location', value: 'Ain Sokhna, Red Sea' },
          { label: 'Installments', value: 'Up to 8 Years' },
        ],
      },
      ar: {
        title: 'مارينا هيلز السخنة',
        subtitle: 'بإدارة وتشغيل فنادق جرافيتي',
        location: 'العين السخنة، ساحل البحر الأحمر، مصر',
        category: 'منتجع ساحلي وشاليهات فندقية',
        description: 'شاليهات فندقية كاملة التشطيب بالسمارت هوم في العين السخنة بإدارة فنادق جرافيتي (الفرع الخامس بمصر). جميع الوحدات تتميز بإطلالة مزدوجة مباشرة على البحر وحمامات السباحة مع مقدم 10% وتقسيط حتى 8 سنوات.',
        badge: 'بالتعاون مع فنادق جرافيتي',
        highlights: [
          'إطلالة مزدوجة مباشرة: رؤية البحر وحمامات السباحة',
          'مقدم 10% • تقسيط مريح حتى 8 سنوات • استلام ديسمبر 2027',
        ],
        stats: [
          { label: 'القطاع', value: 'ساحلي وفندقي' },
          { label: 'الموقع', value: 'العين السخنة' },
          { label: 'الأقساط', value: 'تصل حتى 8 سنوات' },
        ],
      },
      de: {
        title: 'Marina Hills Sokhna',
        subtitle: 'Kooperation mit Gravity Hotels',
        location: 'Ain Sokhna, Küste des Roten Meeres, Ägypten',
        category: 'Küsten- & Hotel-Serviced-Residenzen',
        description: 'Vollständig möblierte Hotel-Chalets mit Smart-Home-Systemen in Ain Sokhna, betrieben von Gravity Hotels (5. Niederlassung in Ägypten). Alle Einheiten bieten Meer- und Poolblick mit 10% Anzahlung über 8 Jahre.',
        badge: 'GRAVITY HOTELS KOOPERATION',
        highlights: [
          'Doppelter Ausblick: Direktes Meer & Poollandschaft',
          '10% Anzahlung • Ratenzahlung bis zu 8 Jahre',
        ],
        stats: [
          { label: 'Kategorie', value: 'Küste & Hospitality' },
          { label: 'Standort', value: 'Ain Sokhna, Rotes Meer' },
          { label: 'Ratenzahlung', value: 'Bis zu 8 Jahre' },
        ],
      },
    },
    'hero-the-island': {
      en: {
        title: 'THE ISLAND',
        subtitle: 'Island 22 – Lesan El Wozara',
        location: 'Island 22 – Lesan El Wozara, Marina Al Alamein, Egypt',
        category: 'Ultra-Luxury Waterfront Living',
        description: 'An exclusive private island sanctuary situated in Island 22, Lesan El Wozara at Marina Al Alamein with direct open lagoon frontage, private boat docking access, and bespoke duplexes and waterfront mini villas.',
        badge: 'EXCLUSIVE MARINA 22 ISLAND',
        highlights: [
          'Private Island Living with Direct Open Lagoon Frontage',
          'Limited Waterfront Duplexes & Beachfront Mini Villas',
        ],
        stats: [
          { label: 'Category', value: 'Coastal Waterfront' },
          { label: 'Location', value: 'Marina Al Alamein' },
          { label: 'Setting', value: 'Private Island 22' },
        ],
      },
      ar: {
        title: 'ذا آيلاند (The Island)',
        subtitle: 'جزيرة 22 – لسان الوزراء',
        location: 'جزيرة 22 – لسان الوزراء، مارينا العلمين، مصر',
        category: 'وجهة ساحلية فاخرة على الواجهة المائية',
        description: 'موقع استثنائي على جزيرة 22 الخاصة بلسان الوزراء في مارينا العلمين مع إطلالة مباشرة على البحيرة المفتوحة، وممشى المارينا، ودوبلكسات وفيلات شاطئية حصرية بأعلى معايير الخصوصية.',
        badge: 'جزيرة خاصة وحصرية في مارينا 22',
        highlights: [
          'موقع استثنائي على جزيرة خاصة بإطلالة مباشرة على البحيرات المفتوحة',
          'دوبلكسات وفيلات شاطئية حصرية بأعلى معايير الخصوصية',
        ],
        stats: [
          { label: 'القطاع', value: 'ساحلي فاخر' },
          { label: 'الموقع', value: 'مارينا العلمين' },
          { label: 'الموقع الخاص', value: 'جزيرة 22 الخاصة' },
        ],
      },
      de: {
        title: 'THE ISLAND',
        subtitle: 'Insel 22 – Lesan El Wozara',
        location: 'Insel 22 – Lesan El Wozara, Marina Al Alamein, Ägypten',
        category: 'Ultra-Luxus Waterfront Living',
        description: 'Ein exklusives privates Inselrefugium auf Insel 22, Lesan El Wozara in Marina Al Alamein mit direktem Zugang zur offenen Lagune und limitierten Waterfront-Duplexen und Strandvillen.',
        badge: 'EXKLUSIVE MARINA 22 INSEL',
        highlights: [
          'Privates Insel-Wohnen mit direktem Lagunenzugang',
          'Limitierte Waterfront-Duplexe & Mini-Villen',
        ],
        stats: [
          { label: 'Kategorie', value: 'Küsten-Luxus' },
          { label: 'Standort', value: 'Marina Al Alamein' },
          { label: 'Lage', value: 'Private Insel 22' },
        ],
      },
    },
    'hero-sokhna-time': {
      en: {
        title: 'SOKHNA TIME',
        subtitle: 'Direct Yacht Marina Frontage',
        location: 'Directly at Yacht Marina, Ain Sokhna, Egypt',
        category: 'Marina Chalets & Hotel Suites',
        description: 'Prime hotel-serviced chalets and waterfront suites positioned directly on the Yacht Marina basin in Ain Sokhna with immediate marina promenade access, turnkey finishing, and high-yield hospitality rental options.',
        badge: 'DIRECT MARINA FRONTAGE',
        highlights: [
          'Direct Frontage on Yacht Marina Basin & Promenade',
          'Fully Finished Hotel Chalets with Turnkey Rental Management',
        ],
        stats: [
          { label: 'Category', value: 'Marina Chalets' },
          { label: 'Location', value: 'Ain Sokhna Marina' },
          { label: 'Finishing', value: 'Fully Finished' },
        ],
      },
      ar: {
        title: 'سخنة تايم (Sokhna Time)',
        subtitle: 'واجهة مباشرة على مارينا اليخوت',
        location: 'مباشرة على مارينا اليخوت، العين السخنة، مصر',
        category: 'شاليهات وأجنحة مارينا اليخوت',
        description: 'شاليهات فندقية وأجنحة ساحلية فاخرة تقع مباشرة على حوض مارينا اليخوت في العين السخنة بإطلالة بانورامية كاملة وتشطيب فندقي متكامل مع إمكانية إدارة التأجير الفندقي.',
        badge: 'إطلالة مباشرة على مارينا اليخوت',
        highlights: [
          'إطلالة بانورامية ساحرة على حوض اليخوت والممشى السياحي',
          'شاليهات كاملة التشطيب بإدارة فندقية وتأجير استثماري',
        ],
        stats: [
          { label: 'القطاع', value: 'شاليهات المارينا' },
          { label: 'الموقع', value: 'مارينا العين السخنة' },
          { label: 'التشطيب', value: 'تشطيب فندقي كامل' },
        ],
      },
      de: {
        title: 'SOKHNA TIME',
        subtitle: 'Direkte Yacht-Marina-Front',
        location: 'Direkt an der Yacht-Marina, Ain Sokhna, Ägypten',
        category: 'Marina-Chalets & Suiten',
        description: 'Erstklassige Hotelchalets und Suiten direkt am Yachthafenbecken in Ain Sokhna mit sofortigem Zugang zur Promenade und schlüsselfertiger Übergabe.',
        badge: 'DIREKTE MARINA-FRONT',
        highlights: [
          'Direkte Lage am Yachthafenbecken & Promenade',
          'Schlüsselfertige Residenzen mit Hotelverwaltung',
        ],
        stats: [
          { label: 'Kategorie', value: 'Marina-Chalets' },
          { label: 'Standort', value: 'Ain Sokhna Marina' },
          { label: 'Übergabe', value: 'Vollständig möbliert' },
        ],
      },
    },
    'hero-core-point': {
      en: {
        title: 'CORE POINT',
        subtitle: 'Specialized Medical Complex',
        location: 'Beside Air Force Specialized Hospital, New Cairo',
        category: 'Specialized Medical Complex',
        description: 'A licensed medical destination directly beside Air Force Specialized Hospital in New Cairo. Specialized spaces for dental centers, ophthalmology, laboratories, and radiology with 10% down payment over 6 years.',
        badge: 'SPECIALIZED HEALTHCARE COMPLEX',
        highlights: [
          'Specialized Dental, Ophthalmology, Labs & Radiology Centers',
          'Hospital License, Operating Rooms & 10% DP Up to 6 Years',
        ],
        stats: [
          { label: 'Category', value: 'Specialized Medical' },
          { label: 'Location', value: 'Beside Air Force Hospital' },
          { label: 'Installments', value: 'Up to 6 Years' },
        ],
      },
      ar: {
        title: 'كور بوينت (CORE POINT)',
        subtitle: 'مجمع طبي متخصص بالقاهرة الجديدة',
        location: 'بجوار مستشفى الجوي التخصصي، القاهرة الجديدة، مصر',
        category: 'مجمع طبي متخصص',
        description: 'صرح طبي متخصص ومرخص مباشرة بجوار مستشفى الجوي التخصصي ومحطة المونوريل. يضم مراكز أسنان وزراعات، مراكز عيون، معامل تحاليل، ومراكز أشعة بمساحات تبدأ من 85م² ومقدم 10% حتى 6 سنوات.',
        badge: 'صرح طبي متكامل ومرخص',
        highlights: [
          'مراكز أسنان، عيون، معامل تحاليل، ومراكز أشعة متخصصة (85م² – 700م²)',
          'رخصة مستشفى، غرف عمليات، رعاية مركزة، ومقدم 10% حتى 6 سنوات',
        ],
        stats: [
          { label: 'القطاع', value: 'طبي متخصص' },
          { label: 'الموقع', value: 'بجوار مستشفى الجوي' },
          { label: 'الأقساط', value: 'تصل حتى 6 سنوات' },
        ],
      },
      de: {
        title: 'CORE POINT',
        subtitle: 'Spezialisiertes Medizinisches Zentrum',
        location: 'Neben Air Force Specialized Hospital, Neu-Kairo',
        category: 'Spezialisiertes Medizinisches Zentrum',
        description: 'Ein lizenziertes medizinisches Ziel direkt neben dem Air Force Specialized Hospital in Neu-Kairo. Spezialflächen für Zahnmedizin, Augenheilkunde, Labore und Radiologie.',
        badge: 'MEDIZINISCHER KOMPLEX',
        highlights: [
          'Zentren für Zahnheilkunde, Augen, Labore & Radiologie (85–700 m²)',
          'Krankenhauslizenz, OP-Säle, Intensivstation & 10% Anzahlung (6 Jahre)',
        ],
        stats: [
          { label: 'Kategorie', value: 'Spezialisierte Medizin' },
          { label: 'Standort', value: 'Neben Air Force Hospital' },
          { label: 'Ratenzahlung', value: 'Bis zu 6 Jahre' },
        ],
      },
    },
    'hero-kernal-mall': {
      en: {
        title: 'KERNEL MALL / KERNEL BUSINESS HUB',
        subtitle: 'North 90th Street Commercial & Medical Hub',
        location: 'North 90th Street, First Sector, New Cairo, Egypt',
        category: 'Commercial & Medical Hub',
        description: 'Prime commercial and healthcare center located directly on North 90th Street next to Air Force Hospital. Featuring ready-to-move ground floor retail / F&B units with open plaza frontage and fully finished clinics.',
        badge: 'READY TO MOVE UNITS',
        highlights: [
          'Ready-to-Move Ground Floor Retail/F&B & Fully Finished Clinics',
          'Prime Frontage on North 90th Street & Open Commercial Plaza',
        ],
        stats: [
          { label: 'Category', value: 'Commercial & Medical' },
          { label: 'Status', value: 'Ready to Move' },
          { label: 'Location', value: 'North 90th Street' },
        ],
      },
      ar: {
        title: 'كيرنال مول (Kernel Business Hub)',
        subtitle: 'مركز تجاري وطبي على التسعين الشمالي',
        location: 'شارع التسعين الشمالي، القطاع الأول، القاهرة الجديدة، مصر',
        category: 'مركز تجاري وطبي',
        description: 'موقع استراتيجي مباشرة على شارع التسعين الشمالي بجوار مستشفى الجوي. يوفر وحدات تجارية ومطاعم أرضي استلام فوري بإطلالة بلازا، وعيادات طبية كاملة التشطيب والتكييف.',
        badge: 'وحدات استلام فوري جاهزة',
        highlights: [
          'استلام فوري لوحدات تجارية أرضي مطاعم وكافيهات وعيادات بالتكييف',
          'واجهة مباشرة على محور التسعين الشمالي وبلازا مفتوحة',
        ],
        stats: [
          { label: 'القطاع', value: 'تجاري وطبي' },
          { label: 'الحالة', value: 'استلام فوري' },
          { label: 'الموقع', value: 'شارع التسعين الشمالي' },
        ],
      },
      de: {
        title: 'KERNEL MALL',
        subtitle: 'North 90th Street Gewerbe- & Ärztezentrum',
        location: 'North 90th Street, First Sector, Neu-Kairo, Ägypten',
        category: 'Gewerbe- & Ärztezentrum',
        description: 'Erstklassiges Gewerbe- und Ärztezentrum direkt an der North 90th Street. Bietet sofort bezugsfertige Gastro-, Handels- und Praxisflächen mit Plaza-Blick.',
        badge: 'SOFORT BEZUGSFERTIG',
        highlights: [
          'Sofort bezugsfertige Gastro- und Praxisflächen mit Klima',
          'Beste Lage direkt an der North 90th Street',
        ],
        stats: [
          { label: 'Kategorie', value: 'Gewerbe & Medizin' },
          { label: 'Status', value: 'Sofort bezugsfertig' },
          { label: 'Standort', value: 'North 90th Street' },
        ],
      },
    },
    'hero-nexus-mall': {
      en: {
        title: 'NEXUS MALL',
        subtitle: 'Fifth Settlement Business Landmark',
        location: 'Second Sector, Fifth Settlement, New Cairo, Egypt',
        category: 'Commercial & Administrative Mall',
        description: 'A premier administrative and retail destination in the Second Sector, 2nd row from South 90th Street in New Cairo. Offering Grade-A corporate offices, modern retail stores, and flexible payment plans from 15% down payment.',
        badge: '2ND ROW FROM SOUTH 90TH',
        highlights: [
          'Prime Location: 2nd Row from South 90th Street',
          '15% Down Payment • Installments Up to 7 Years',
        ],
        stats: [
          { label: 'Category', value: 'Admin & Retail' },
          { label: 'Location', value: 'Second Sector, New Cairo' },
          { label: 'Installments', value: 'Up to 7 Years' },
        ],
      },
      ar: {
        title: 'نيكسس مول (NEXUS MALL)',
        subtitle: 'صرح إداري وتجاري بالتجمع الخامس',
        location: 'القطاع الثاني، التجمع الخامس، القاهرة الجديدة، مصر',
        category: 'مول تجاري وإداري',
        description: 'وجهة استثمارية رائدة في القطاع الثاني، ثاني نمرة من شارع التسعين الجنوبي في التجمع الخامس. يقدم مكاتب إدارية راقية ومحلات تجارية بمقدم 15% وتقسيط حتى 7 سنوات.',
        badge: 'ثاني نمرة من التسعين الجنوبي',
        highlights: [
          'موقع استراتيجي ثاني نمرة من شارع التسعين الجنوبي',
          'مكاتب إدارية ومحلات تجارية بمقدم 15% وتقسيط حتى 7 سنوات',
        ],
        stats: [
          { label: 'القطاع', value: 'إداري وتجاري' },
          { label: 'الموقع', value: 'القطاع الثاني، التجمع الخامس' },
          { label: 'الأقساط', value: 'تصل حتى 7 سنوات' },
        ],
      },
      de: {
        title: 'NEXUS MALL',
        subtitle: 'Büro- und Handelszentrum Fifth Settlement',
        location: 'Second Sector, Fifth Settlement, Neu-Kairo, Ägypten',
        category: 'Büro- & Einkaufszentrum',
        description: 'Eine erstklassige Büro- und Handelsadresse im Second Sector, 2. Reihe zur South 90th Street in Neu-Kairo mit 15% Anzahlung und bis zu 7 Jahren Laufzeit.',
        badge: '2. REIHE SOUTH 90TH',
        highlights: [
          'Beste Lage: 2. Reihe zur South 90th Street',
          '15% Anzahlung • Ratenzahlung bis zu 7 Jahre',
        ],
        stats: [
          { label: 'Kategorie', value: 'Büro & Handel' },
          { label: 'Standort', value: 'Second Sector, Neu-Kairo' },
          { label: 'Ratenzahlung', value: 'Bis zu 7 Jahre' },
        ],
      },
    },
  };

  const currentLoc = localizedSlides[current.id]?.[language] || localizedSlides[current.id]?.en || {};
  const slideTitle = currentLoc.title || current.title;
  const slideSubtitle = currentLoc.subtitle || current.subtitle;
  const slideLocation = currentLoc.location || current.location;
  const slideCategory = currentLoc.category || current.category;
  const slideDescription = currentLoc.description || current.description;
  const slideBadge = currentLoc.badge || current.badge;
  const slideHighlights = currentLoc.highlights || current.highlights || [];
  const slideStats = currentLoc.stats || current.stats;

  // Localized CTA text
  const viewProjectText = language === 'ar' ? 'اكتشف المشروع' : language === 'de' ? 'Projekt entdecken' : 'VIEW PROJECT';
  const requestDetailsText = language === 'ar' ? 'اطلب التفاصيل' : language === 'de' ? 'Details anfordern' : 'REQUEST DETAILS';

  return (
    <section
      className="relative w-full h-[calc(100vh-80px)] lg:h-[calc(100vh-96px)] min-h-[680px] bg-[#061D28] text-white overflow-hidden select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={t('hero.featuredBadge', 'Featured Real Estate Projects')}
    >
      {/* 6 Distinct Real Background Images with Cinematic Fade & Slow Pan/Zoom */}
      {verifiedSlides.map((slide, index) => {
        const isActive = index === currentSlide;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-0' : 'opacity-0 pointer-events-none'
            }`}
            aria-hidden={!isActive}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className={`w-full h-full object-cover transform transition-transform duration-[6000ms] ease-out ${
                isActive ? 'scale-105' : 'scale-100'
              }`}
              loading={index === 0 ? 'eager' : 'lazy'}
              fetchPriority={index === 0 ? 'high' : 'auto'}
            />
            {/* Dark Cinematic Vignette Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#061D28] via-[#061D28]/70 to-[#061D28]/45" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#061D28]/95 via-[#061D28]/60 to-transparent rtl:bg-gradient-to-l" />
          </div>
        );
      })}

      {/* Main Slide Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-between pt-14 sm:pt-18 pb-10 sm:pb-12">
        {/* Top Eyebrow Tag */}
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#C5A880] text-xs font-medium tracking-wide uppercase shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{slideBadge}</span>
          </div>
        </div>

        {/* Central Content Block with Smooth Fade-in on Slide Change */}
        <div 
          key={currentSlide}
          className="max-w-3xl space-y-4 sm:space-y-5 my-auto animate-in fade-in slide-in-from-bottom-3 duration-500"
        >
          {/* Location Line */}
          <div className="flex items-center gap-2 text-xs sm:text-sm font-medium tracking-wide text-slate-300">
            <MapPin className="w-4 h-4 text-[#C5A880] flex-shrink-0" />
            <span>{slideLocation}</span>
          </div>

          {/* Project Title & Subtitle */}
          <div className="space-y-1.5">
            <span className="text-xs sm:text-sm font-medium tracking-wider uppercase text-[#DFCA9F] block">
              {slideSubtitle}
            </span>

            {/* Elegant 600-weight Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold tracking-normal text-white leading-[1.2] max-w-2xl">
              {slideTitle}
            </h1>
          </div>

          {/* Verified Highlights Chips */}
          {slideHighlights.length > 0 && (
            <div className="space-y-1.5 pt-1">
              {slideHighlights.map((highlight: string, hIdx: number) => (
                <div key={hIdx} className="flex items-center gap-2 text-xs sm:text-sm text-slate-200 font-normal">
                  <CheckCircle2 className="w-4 h-4 text-[#25D366] shrink-0" />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          )}

          {/* Short Project Description */}
          <p className="text-sm sm:text-base text-slate-200 leading-[1.75] max-w-2xl font-normal line-clamp-2">
            {slideDescription}
          </p>

          {/* Slide Spec Stats Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1 max-w-lg">
            {slideStats.map((stat: any, idx: number) => (
              <div key={idx} className="bg-black/40 backdrop-blur-md p-3 rounded-xl border border-white/10">
                <span className="text-[11px] text-slate-300 block font-light">
                  {stat.label}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-white tracking-normal block truncate mt-0.5">
                  {stat.value}
                </span>
              </div>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-3">
            {/* Primary Action: View Project */}
            <Link
              to={`/projects/${current.projectSlug}`}
              className="btn-primary flex items-center justify-center gap-2"
              onClick={() => {
                trackEvent('view_project', { project_name: slideTitle, source: 'hero_slider' });
              }}
            >
              <span>{viewProjectText}</span>
              <ArrowRight className={`w-4 h-4 transition-transform ${isRTL ? 'rotate-180' : ''}`} />
            </Link>

            {/* Secondary Action: Request Details / Viewing */}
            <button
              onClick={() => {
                trackRequestViewing('hero_slider', slideTitle);
                if (onRequestViewing) onRequestViewing(slideTitle);
              }}
              className="btn-outline-white flex items-center justify-center gap-2"
              type="button"
            >
              <Calendar className="w-4 h-4" />
              <span>{requestDetailsText}</span>
            </button>
          </div>
        </div>

        {/* Bottom Bar: Slide Counter, Minimal Nav Arrows & Progress Indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-white/10">
          {/* Slide Counter & Dots */}
          <div className="flex items-center gap-4">
            <div className="text-xs font-mono font-medium tracking-wider text-[#C5A880]">
              <span className="text-sm text-white font-semibold">0{currentSlide + 1}</span> / 0{verifiedSlides.length}
            </div>

            {/* Interactive slide pill selectors with fill animation */}
            <div className="flex items-center gap-2">
              {verifiedSlides.map((_, idx) => {
                const isActive = idx === currentSlide;
                return (
                  <button
                    key={idx}
                    onClick={() => goToSlide(idx)}
                    className={`relative h-2 rounded-full overflow-hidden transition-all duration-300 ${
                      isActive
                        ? 'w-10 bg-white/20'
                        : 'w-2.5 bg-white/30 hover:bg-white/60'
                    }`}
                    aria-label={`${t('hero.slide', 'Slide')} ${idx + 1}`}
                  >
                    {isActive && (
                      <span
                        className="absolute inset-0 bg-[#C5A880] rounded-full transition-all ease-linear"
                        style={{ width: `${progress}%` }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Autoplay Toggle */}
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
              aria-label={isAutoPlaying ? t('hero.pause', 'Pause slider') : t('hero.play', 'Start slider')}
              title={isAutoPlaying ? t('hero.pause', 'Pause slider') : t('hero.play', 'Start slider')}
            >
              {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Minimal Rounded Navigation Arrows */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={isRTL ? nextSlide : prevSlide}
              className="p-2.5 rounded-full bg-white/10 hover:bg-[#0B4D68] text-white border border-white/15 transition-all duration-200 focus:outline-none hover:scale-105 active:scale-95"
              aria-label={t('hero.prev', 'Previous Slide')}
            >
              <ChevronLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            </button>

            <button
              onClick={isRTL ? prevSlide : nextSlide}
              className="p-2.5 rounded-full bg-white/10 hover:bg-[#0B4D68] text-white border border-white/15 transition-all duration-200 focus:outline-none hover:scale-105 active:scale-95"
              aria-label={t('hero.next', 'Next Slide')}
            >
              <ChevronRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Minimal Thin Bottom Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-white/10">
          <div
            className="h-full bg-gradient-to-r from-[#C5A880] to-[#E2D1B8] transition-all duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
