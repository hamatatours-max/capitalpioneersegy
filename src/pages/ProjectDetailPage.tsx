import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, 
  Phone, 
  MessageCircle, 
  Calendar, 
  Building2, 
  Compass, 
  ChevronRight, 
  CheckCircle2, 
  ExternalLink, 
  Layers, 
  Sparkles, 
  X, 
  ArrowLeft, 
  Maximize2, 
  Check,
  Waves,
  ShieldCheck,
  Cpu,
  Hotel,
  TrendingUp,
  Info,
  ArrowRight,
  Play,
  Activity,
  Stethoscope,
  Pill,
  Microscope,
  Scan,
  FileText,
  Clock,
  Navigation,
  Percent,
  Briefcase,
  Store,
  Calculator,
  Tag,
  Car,
  KeyRound,
  CheckCircle,
  SlidersHorizontal,
  LayoutGrid,
  UtensilsCrossed,
  Coffee
} from 'lucide-react';
import { getProjectBySlug, getRelatedProjects } from '@/data/projectsData';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { DowntownOfferCampaign } from '@/components/campaigns/DowntownOfferCampaign';
import { TheIslandProjectExperience } from '@/components/campaigns/TheIslandProjectExperience';
import { NotionProjectExperience } from '@/components/campaigns/NotionProjectExperience';
import { SokhnaTimeProjectExperience } from '@/components/campaigns/SokhnaTimeProjectExperience';
import { MiraiComplexProjectExperience } from '@/components/campaigns/MiraiComplexProjectExperience';
import { CorePointProjectExperience } from '@/components/campaigns/CorePointProjectExperience';
import { PlatinumResortProjectExperience } from '@/components/campaigns/PlatinumResortProjectExperience';
import { NuxesMallProjectExperience } from '@/components/campaigns/NuxesMallProjectExperience';
import { KernalMallProjectExperience } from '@/components/campaigns/KernalMallProjectExperience';
import { BeitAlWatanF165ProjectExperience } from '@/components/campaigns/BeitAlWatanF165ProjectExperience';
import { NorthernLotusProjectExperience } from '@/components/campaigns/NorthernLotusProjectExperience';
import { AlAndalus641ProjectExperience } from '@/components/campaigns/AlAndalus641ProjectExperience';
import { AvailableUnit } from '@/types/project';
import { SEO } from '@/components/common/SEO';
import { generateRealEstateListingSchema, generateBreadcrumbSchema } from '@/utils/schemaGenerator';
import { submitLead, PRIMARY_PHONE, TEL_URL } from '@/services/leadService';
import { LeadFormData } from '@/types/lead';
import { useLanguage } from '@/context/LanguageContext';
import { getLocalizedProject } from '@/i18n/projectTranslations';
import { 
  trackViewProject, 
  trackClickPhone, 
  trackClickWhatsApp, 
  trackRequestViewing, 
  trackFormStart, 
  trackFormSubmit 
} from '@/services/analyticsService';

interface ProjectDetailPageProps {
  onRequestViewing?: (projectName?: string) => void;
}

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({ onRequestViewing }) => {
  const { slug } = useParams<{ slug: string }>();
  const [activeGalleryIndex, setActiveGalleryIndex] = useState<number | null>(null);
  const [activeModalImage, setActiveModalImage] = useState<string | null>(null);
  const [activeVideo, setActiveVideo] = useState<{ src: string; title: string } | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [whatsappHandoffUrl, setWhatsappHandoffUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedPlanTab, setSelectedPlanTab] = useState<number>(0);
  const hasStartedForm = useRef(false);
  const heroVideoRef = useRef<HTMLVideoElement | null>(null);
  const { t, isRTL, language } = useLanguage();

  // Dynamic Lead Form state supporting general, coastal, medical and commercial project inquiries
  const [leadForm, setLeadForm] = useState<LeadFormData>({
    fullName: '',
    phoneNumber: '',
    email: '',
    interestedProject: '',
    propertyType: 'Commercial',
    purpose: 'Investment',
    budget: 'Standard Plan',
    preferredContactMethod: 'WhatsApp',
    message: '',
  });

  // Custom Form additions for projects with verified available units (e.g. Twenty Plus, ARTEA MALL)
  const [selectedUnitId, setSelectedUnitId] = useState<string>('');
  const [selectedInventoryUnit, setSelectedInventoryUnit] = useState<string>('');
  const [propertyTypeSelection, setPropertyTypeSelection] = useState<string>('Commercial');
  const [medicalUnitType, setMedicalUnitType] = useState('Medical Clinic');
  const [preferredAreaChoice, setPreferredAreaChoice] = useState('Starting from 29 m²');
  const [purchaseTimeline, setPurchaseTimeline] = useState('Ready to purchase');

  const rawProject = getProjectBySlug(slug || '');
  const project = rawProject ? getLocalizedProject(rawProject, language) : null;

  const activeUnit = (project?.availableUnitsList && project.availableUnitsList.length > 0)
    ? (project.availableUnitsList.find((u) => u.id === selectedUnitId) || project.availableUnitsList[0])
    : null;

  useEffect(() => {
    window.scrollTo(0, 0);
    if (project) {
      trackViewProject({
        project_id: project.id,
        project_slug: project.slug,
        project_name: project.name,
        project_category: project.projectType,
        project_location: project.location,
        developer: project.developer,
        is_red_sea: project.isRedSea,
      });

      if (project.availableUnitsList && project.availableUnitsList.length > 0) {
        const currentSelected = project.availableUnitsList.find((u) => u.id === selectedUnitId) || project.availableUnitsList[0];
        if (!selectedUnitId || !project.availableUnitsList.some((u) => u.id === selectedUnitId)) {
          setSelectedUnitId(currentSelected.id);
        }
        setSelectedInventoryUnit(
          `${currentSelected.unitCode ? currentSelected.unitCode + ' – ' : ''}${currentSelected.floor ? currentSelected.floor + ' ' : ''}${currentSelected.propertyType} – ${currentSelected.areaSqm} m² (EGP ${currentSelected.totalPriceEGP.toLocaleString()})`
        );
      }
    }
  }, [slug, project, selectedUnitId]);

  useEffect(() => {
    if (heroVideoRef.current) {
      heroVideoRef.current.defaultMuted = true;
      heroVideoRef.current.muted = true;
      heroVideoRef.current.play().catch(() => {
        // Autoplay may be restricted by browser policy; graceful silent fallback
      });
    }
  }, [project?.videoUrl]);

  const handleVideoPlay = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    // Avoid multiple audio/video streams playing simultaneously
    const allVideos = document.querySelectorAll('video');
    allVideos.forEach((vid) => {
      if (vid !== e.currentTarget && vid !== heroVideoRef.current) {
        vid.pause();
      }
    });
  };

  if (!project) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center bg-[#FAFBFD]">
        <SEO
          title={`${t('projectDetail.notFoundTitle', 'Project Not Found')} | Capital Pioneers Real Estate`}
          description={t('projectDetail.notFoundDesc', 'The requested real estate project listing could not be found.')}
          noIndex={true}
        />
        <Building2 className="w-16 h-16 text-[#0B4D68] mb-4" />
        <h1 className="text-2xl font-semibold text-[#0F2432]">
          {t('projectDetail.notFoundTitle', 'Project Not Found')}
        </h1>
        <p className="text-sm text-slate-500 max-w-md my-3 font-light leading-relaxed">
          {t('projectDetail.notFoundDesc', 'The requested project opportunity could not be found or has been updated in our real estate directory.')}
        </p>
        <Link to="/projects" className="btn-primary mt-2">
          <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
          <span>{t('projectDetail.returnBtn', 'Return to All Projects')}</span>
        </Link>
      </div>
    );
  }

  // Dedicated Campaign Experience for Downtown 1 & Downtown 2 Limited Offer
  if (project.slug === 'downtown-offices' || project.slug === 'downtown-1-2' || project.slug === 'downtown' || project.isCampaignOffer) {
    return <DowntownOfferCampaign project={project} onRequestViewing={onRequestViewing} />;
  }

  // Dedicated Campaign Experience for The Island (Marina Al Alamein)
  if (project.slug === 'the-island' || project.slug === 'theisland' || project.slug === 'island-22' || project.slug === 'the-island-marina') {
    return <TheIslandProjectExperience project={project} onRequestViewing={onRequestViewing} />;
  }

  // Dedicated Campaign Experience for NOTION (Extension Golden Square, New Cairo)
  if (project.slug === 'notion' || project.slug === 'notion-new-cairo') {
    return <NotionProjectExperience project={project} onRequestViewing={onRequestViewing} />;
  }

  // Dedicated Campaign Experience for SOKHNA TIME (Hotel Chalet Directly at Yacht Marina)
  if (project.slug === 'sokhna-time' || project.slug === 'sokhnatime' || project.id === 'sokhna-time') {
    return <SokhnaTimeProjectExperience project={project} onRequestViewing={onRequestViewing} />;
  }

  // Dedicated Experience for MIRAI Complex (Orbit Developments - Mall of Egypt Axis)
  if (project.slug === 'mirai-complex' || project.slug === 'mirai' || project.slug === 'mirai-orbit' || project.id === 'mirai-complex') {
    return <MiraiComplexProjectExperience project={project} onRequestViewing={onRequestViewing} />;
  }

  // Dedicated Experience for CORE POINT (New Cairo Medical Destination beside Air Force Hospital)
  if (project.slug === 'core-point' || project.slug === 'corepoint' || project.slug === 'core_point' || project.id === 'core-point' || project.slug === 'new-cairo-medical-building') {
    return <CorePointProjectExperience project={project} onRequestViewing={onRequestViewing} />;
  }

  // Dedicated Experience for PLATINUM RESORT HURGHADA (Touristic Resort in Magawish Extension)
  if (project.slug === 'platinum-resort-hurghada' || project.slug === 'platinum' || project.slug === 'platinum-resort' || project.slug === 'platinum-hurghada' || project.id === 'platinum-resort-hurghada') {
    return <PlatinumResortProjectExperience project={project} onRequestViewing={onRequestViewing} />;
  }

  // Dedicated Experience for NEXUS MALL / NUXES MALL (43 m² Administrative Office & 71 m² Pharmacy in New Cairo)
  if (
    project.slug === 'nexus-mall' ||
    project.slug === 'nexus' ||
    project.slug === 'nexus-admin' ||
    project.slug === 'nexus-43' ||
    project.slug === 'nexus-mall-admin-43sqm' ||
    project.slug === 'nuxes-mall' ||
    project.slug === 'nuxes' ||
    project.slug === 'nuxes-pharmacy' ||
    project.slug === 'nuxes-71' ||
    project.id === 'nexus-mall' ||
    project.id === 'nuxes-mall'
  ) {
    return <NuxesMallProjectExperience project={project} onRequestViewing={onRequestViewing} />;
  }

  // Dedicated Experience for KERNEL MALL / KERNEL BUSINESS HUB (Ground Floor F&B 74+39 m² & Second Floor Clinic 41 m²)
  if (
    project.slug === 'kernal-mall-41-sqm-clinic-office-new-cairo' ||
    project.slug === 'kernel-mall-fnb-74sqm-39sqm-outdoor' ||
    project.slug === 'kernel-mall-fnb-74sqm' ||
    project.slug === 'kernel-mall-fnb' ||
    project.slug === 'kernel-55' ||
    project.slug === 'kernel-mall-55' ||
    project.slug === 'kernel-55sqm' ||
    project.slug === 'kernel-mall-55sqm' ||
    project.slug === 'kernel-mall-clinic-55sqm' ||
    project.slug === 'kernel-fnb' ||
    project.slug === 'kernel-mall' ||
    project.slug === 'kernel' ||
    project.slug === 'kernel-business-hub' ||
    project.slug === 'kernal-mall' ||
    project.slug === 'kernal' ||
    project.slug === 'kernal-41' ||
    project.slug === 'kernal-55' ||
    project.id === 'kernal-mall' ||
    project.id === 'kernel-mall'
  ) {
    return <KernalMallProjectExperience project={project} onRequestViewing={onRequestViewing} />;
  }

  // Dedicated Experience for FIRST DISTRICT – BEIT AL WATAN (Plot F165 - 196 m² Apartment)
  if (
    project.slug === 'beit-al-watan-f165-apartment-196sqm' ||
    project.slug === 'beit-al-watan-f165' ||
    project.slug === 'beit-al-watan-165' ||
    project.slug === 'f165' ||
    project.slug === 'first-district-beit-al-watan' ||
    project.slug === 'first-district-beit-al-watan-f165' ||
    project.id === 'beit-al-watan-f165'
  ) {
    return <BeitAlWatanF165ProjectExperience project={project} onRequestViewing={onRequestViewing} />;
  }

  // Dedicated Experience for NORTHERN LOTUS (Ready-to-Move 170 m² & 175 m² Apartments - 3rd row from North 90th)
  if (
    project.slug === 'northern-lotus-ready-to-move-apartments' ||
    project.slug === 'northern-lotus-ready-to-move' ||
    project.slug === 'northern-lotus' ||
    project.slug === 'lotus-north' ||
    project.slug === 'northern-lotus-apartments' ||
    project.id === 'northern-lotus-ready-to-move'
  ) {
    return <NorthernLotusProjectExperience project={project} onRequestViewing={onRequestViewing} />;
  }

  // Dedicated Experience for PROJECT NO. 641 – AL ANDALUS 2 (Ready-to-Move 184 m² 4th Floor Apartment)
  if (
    project.slug === 'project-641-al-andalus-2-ready-to-move-apartment-184sqm' ||
    project.slug === 'project-641-al-andalus-2' ||
    project.slug === 'project-641' ||
    project.slug === 'al-andalus-641' ||
    project.slug === 'andalus-641' ||
    project.slug === 'al-andalus-2' ||
    project.slug === 'al-andalus' ||
    project.slug === 'andalus' ||
    project.id === 'project-641-al-andalus-2'
  ) {
    return <AlAndalus641ProjectExperience project={project} onRequestViewing={onRequestViewing} />;
  }

  const relatedProjects = getRelatedProjects(project, 3);

  const structuredSchemas = [
    generateRealEstateListingSchema(project),
    generateBreadcrumbSchema([
      { name: t('nav.home', 'Home'), item: '/' },
      { name: t('nav.projects', 'Projects'), item: '/projects' },
      { name: project.governorate, item: `/projects?location=${encodeURIComponent(project.governorate)}` },
      { name: project.name, item: `/projects/${project.slug}` },
    ]),
  ];

  const handleInputFocus = (fieldName: string) => {
    if (!hasStartedForm.current) {
      hasStartedForm.current = true;
      trackFormStart('project_sidebar_form', fieldName);
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let enrichedMessage = leadForm.message || '';
      if (project.availableUnitsList && project.availableUnitsList.length > 0) {
        enrichedMessage = `[Selected Unit: ${selectedInventoryUnit}] [Type: ${propertyTypeSelection}] [Timeline: ${purchaseTimeline}] ${enrichedMessage}`.trim();
      } else if (project.projectType === 'Medical') {
        enrichedMessage = `[Medical Inquiry: ${medicalUnitType}] [Area: ${preferredAreaChoice}] [Timeline: ${purchaseTimeline}] ${enrichedMessage}`.trim();
      }

      const result = await submitLead({
        ...leadForm,
        interestedProject: `${project.name} (${project.location})`,
        message: enrichedMessage,
      }, 'project_detail');

      setFormSubmitted(true);

      trackFormSubmit({
        form_name: 'project_sidebar_form',
        lead_id: result.leadId,
        interested_project: project.name,
        property_type: leadForm.propertyType,
        purpose: leadForm.purpose,
        budget_range: leadForm.budget,
        preferred_contact: leadForm.preferredContactMethod,
      });

      if (result.whatsappDirectUrl) {
        setWhatsappHandoffUrl(result.whatsappDirectUrl);
      }
    } catch (err) {
      console.error('Lead error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewingClick = () => {
    trackRequestViewing('project_detail_hero', project.name);
    if (onRequestViewing) {
      onRequestViewing(project.name);
    }
  };

  const handlePhoneClick = () => {
    trackClickPhone('project_detail_hero', project.name);
  };

  const handleWhatsAppClick = () => {
    trackClickWhatsApp('project_detail_hero', project.name);
  };

  const defaultWhatsAppMsg = language === 'ar'
    ? `مرحباً Capital Pioneers، أرغب في معرفة تفاصيل مشروع ${project.name} والوحدات المتاحة والأسعار وأنظمة السداد.`
    : language === 'de'
    ? `Hallo Capital Pioneers, ich interessiere mich für ${project.name} und möchte Informationen zu verfügbaren Einheiten, Preisen und Zahlungsplänen erhalten.`
    : `Hello Capital Pioneers, I am interested in ${project.name} and would like to know the available units, prices and payment plans.`;

  const projectWhatsAppText = project.whatsappMessage || defaultWhatsAppMsg;
  const whatsappInquiryUrl = `https://wa.me/201066330570?text=${encodeURIComponent(projectWhatsAppText)}`;

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectUnitInquiry = (unitTitle: string) => {
    setSelectedInventoryUnit(unitTitle);
    setLeadForm((prev) => ({
      ...prev,
      message: `${t('projectDetail.inquiryAbout', 'Inquiring specifically about:')} ${unitTitle}`,
    }));
    handleViewingClick();
  };

  const handleUnitCardSelect = (unit: AvailableUnit) => {
    setSelectedUnitId(unit.id);
    const unitStr = `${unit.unitCode ? unit.unitCode + ' – ' : ''}${unit.floor ? unit.floor + ' ' : ''}${unit.propertyType} – ${unit.areaSqm} m² (EGP ${unit.totalPriceEGP.toLocaleString()})`;
    setSelectedInventoryUnit(unitStr);
    if (unit.propertyType.includes('Commercial') || unit.propertyType.includes('تجاري') || unit.propertyType.includes('Gewerbe')) {
      setPropertyTypeSelection('Commercial');
    } else if (unit.propertyType.includes('Medical') || unit.propertyType.includes('طبي') || unit.propertyType.includes('Medizin')) {
      setPropertyTypeSelection('Medical');
    } else if (unit.propertyType.includes('Office') || unit.propertyType.includes('إداري') || unit.propertyType.includes('Büro')) {
      setPropertyTypeSelection('Administrative');
    }
    setLeadForm((prev) => ({
      ...prev,
      message: `${t('projectDetail.inquiryAbout', 'Inquiring specifically about:')} ${unitStr}`,
    }));
  };

  return (
    <div className="min-h-screen bg-[#FAFBFD]">
      {/* Technical Dynamic Project SEO */}
      <SEO
        title={project.seo.seoTitle}
        description={project.seo.metaDescription}
        canonicalPath={`/projects/${project.slug}`}
        ogImage={project.seo.ogImage || project.mainImage}
        ogType="place"
        noIndex={!project.seo.index}
        schema={structuredSchemas}
      />

      {/* 1. Structured Breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        className="bg-[#061D28] text-slate-400 py-3.5 px-4 sm:px-6 lg:px-8 border-b border-white/10 text-xs font-light"
      >
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-white transition-colors">
            {t('nav.home', 'Home')}
          </Link>
          <ChevronRight className={`w-3.5 h-3.5 text-slate-500 ${isRTL ? 'rotate-180' : ''}`} />
          <Link to="/projects" className="hover:text-white transition-colors">
            {t('nav.projects', 'Projects')}
          </Link>
          <ChevronRight className={`w-3.5 h-3.5 text-slate-500 ${isRTL ? 'rotate-180' : ''}`} />
          <span className="text-slate-400">{project.governorate}</span>
          <ChevronRight className={`w-3.5 h-3.5 text-slate-500 ${isRTL ? 'rotate-180' : ''}`} />
          <span className="text-[#C5A880] font-medium truncate max-w-xs sm:max-w-md">
            {project.name}
          </span>
        </div>
      </nav>

      {/* 2. Full-Screen Cinematic Project Hero Banner */}
      <header className="relative bg-[#061D28] text-white py-16 lg:py-24 border-b border-[#153648] overflow-hidden">
        <div className="absolute inset-0 z-0">
          {project.videoUrl ? (
            <video
              ref={heroVideoRef}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={project.videoPoster || project.mainImage}
              className="w-full h-full object-cover opacity-25 pointer-events-none"
            >
              <source src={project.videoUrl} type="video/mp4" />
              <img
                src={project.mainImage}
                alt={project.seo.imageAltText || project.name}
                className="w-full h-full object-cover opacity-25"
              />
            </video>
          ) : (
            <img
              src={project.mainImage}
              alt={project.seo.imageAltText || project.name}
              onError={(e) => {
                e.currentTarget.src = project.mainImage;
              }}
              className="w-full h-full object-cover opacity-30"
              loading="eager"
              fetchPriority="high"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#061D28] via-[#061D28]/85 to-[#061D28]/60" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#061D28] via-[#061D28]/80 to-transparent rtl:bg-gradient-to-l" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Main Project Details */}
            <div className="lg:col-span-8 space-y-6">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                {project.badge && (
                  <span className="bg-[#C5A880] text-[#061D28] text-xs font-bold tracking-wider uppercase px-3.5 py-1.5 rounded-lg shadow-md flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{project.badge}</span>
                  </span>
                )}
                <span className="bg-[#0B4D68] text-white text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-md">
                  {project.projectType}
                </span>
                <span className="bg-white/10 text-white text-xs font-medium px-2.5 py-1 rounded-md border border-white/20">
                  {project.projectStatus}
                </span>
                {project.isRedSea && (
                  <span className="bg-cyan-900/60 text-cyan-200 text-xs font-medium px-2.5 py-1 rounded-md border border-cyan-500/30">
                    {language === 'ar' ? 'البحر الأحمر والساحل' : language === 'de' ? 'Rotes Meer & Küste' : 'Red Sea Coastal Corridor'}
                  </span>
                )}
              </div>

              {/* Project Name & Developer */}
              <div className="space-y-2.5">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white leading-tight">
                  {project.name}
                </h1>
                {project.slug === 'artea-mall' ? (
                  <div className="text-sm sm:text-base text-[#C5A880] font-bold uppercase tracking-wider">
                    {language === 'ar' ? '4 وحدات تجارية وإدارية وطبية • جاهز للاستلام / 30/09/2026' : language === 'de' ? '4 Einheiten (Gewerbe, Praxis, Büro) • Übergabe 30.09.2026' : '4 AVAILABLE UNITS • READY TO DELIVER'}
                  </div>
                ) : project.slug === 'twenty-plus' ? (
                  <div className="text-sm sm:text-base text-[#C5A880] font-bold uppercase tracking-wider">
                    {language === 'ar' ? 'فرصة تجارية مستقلة في الياسمين فيلات' : language === 'de' ? 'Freistehendes Gewerbegebäude in Al Yasmeen Villas' : 'A Standalone Commercial Opportunity in Al Yasmeen Villas'}
                  </div>
                ) : null}
                <div className="flex items-center gap-2 text-xs text-[#C5A880] font-medium tracking-wide">
                  <span>{t('projectDetail.developer', 'Developer / Operator:')}</span>
                  <span className="text-white font-normal">{project.developer}</span>
                </div>
              </div>

              {/* Location & Google Maps */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#C5A880]" />
                  <span>{project.location}</span>
                </div>
                {project.googleMapsUrl ? (
                  <a
                    href={project.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#C5A880] hover:underline flex items-center gap-1 font-medium"
                  >
                    <span>{t('cta.viewOnMaps', 'View on Google Maps')}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : project.locationStatusNote ? (
                  <span className="text-slate-400 italic text-[11px]">
                    ({project.locationStatusNote})
                  </span>
                ) : null}
              </div>

              {/* Short Lead Summary */}
              <p className="text-slate-200 text-sm sm:text-base font-light leading-relaxed max-w-2xl">
                {project.shortDescription}
              </p>

              {/* Key Highlights Strip */}
              {project.keyFeatures && project.keyFeatures.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {project.keyFeatures.map((feat, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm text-white text-xs border border-white/15"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A880]" />
                      <span>{feat}</span>
                    </span>
                  ))}
                </div>
              )}

              {/* Project Signature Commercial Strip for ARTEA */}
              {project.slug === 'artea-mall' && activeUnit && (
                <div className="p-3.5 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex flex-wrap items-center justify-between gap-3 text-xs text-white">
                  <div className="flex items-center gap-2">
                    <span className="text-[#C5A880] font-bold text-sm sm:text-base" dir="ltr">
                      EGP {activeUnit.totalPriceEGP >= 1000000 ? `${(activeUnit.totalPriceEGP / 1000000).toFixed(2)}M` : activeUnit.totalPriceEGP.toLocaleString()}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="font-semibold text-emerald-400">
                      {activeUnit.unitCode ? `${activeUnit.unitCode} (${activeUnit.propertyType})` : activeUnit.propertyType} • {activeUnit.areaSqm} m²
                    </span>
                    <span className="text-slate-300 hidden sm:inline">•</span>
                    <span className="text-slate-200 hidden sm:inline">
                      {language === 'ar' ? 'مقدم 40% • تقسيط 3 سنوات' : language === 'de' ? '40% Anzahlung • 3 Jahre Raten' : '40% DP • 3 Yrs Installments'}
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold uppercase tracking-wider">
                    {activeUnit.unitCode === 'S-18'
                      ? (language === 'ar' ? 'جاهز للاستلام • 30/09/2026' : language === 'de' ? 'Übergabe: 30/09/2026' : 'Ready to Deliver • 30/09/2026')
                      : (language === 'ar' ? 'استلام فوري' : language === 'de' ? 'Sofortige Übergabe' : 'Immediate Delivery')}
                  </span>
                </div>
              )}

              {/* Project Signature Commercial Strip for TWENTY PLUS */}
              {project.slug === 'twenty-plus' && activeUnit && (
                <div className="p-3.5 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex flex-wrap items-center justify-between gap-3 text-xs text-white">
                  <div className="flex flex-wrap items-center gap-2">
                    {activeUnit.discountedPriceEGP ? (
                      <>
                        <span className="text-[#DFCA9F] font-semibold text-sm sm:text-base font-mono tabular-nums" dir="ltr">
                          EGP {activeUnit.discountedPriceEGP >= 1000000 ? `${(activeUnit.discountedPriceEGP / 1000000).toFixed(2)}M` : activeUnit.discountedPriceEGP.toLocaleString()}
                        </span>
                        <span className="text-slate-400 line-through text-xs font-mono tabular-nums" dir="ltr">
                          EGP {activeUnit.totalPriceEGP >= 1000000 ? `${(activeUnit.totalPriceEGP / 1000000).toFixed(2)}M` : activeUnit.totalPriceEGP.toLocaleString()}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                          {language === 'ar' ? 'خصم 10%' : '10% OFF'}
                        </span>
                      </>
                    ) : (
                      <span className="text-[#C5A880] font-bold text-sm sm:text-base font-mono tabular-nums" dir="ltr">
                        EGP {activeUnit.totalPriceEGP >= 1000000 ? `${(activeUnit.totalPriceEGP / 1000000).toFixed(2)}M` : activeUnit.totalPriceEGP.toLocaleString()}
                      </span>
                    )}
                    <span className="text-slate-300">•</span>
                    <span className="font-semibold text-emerald-400">
                      {activeUnit.unitCode ? `${activeUnit.unitCode} (${activeUnit.propertyType})` : activeUnit.propertyType} • {activeUnit.outdoorAreaSqm ? `${activeUnit.areaSqm} m² (${activeUnit.indoorAreaSqm} + ${activeUnit.outdoorAreaSqm})` : `${activeUnit.areaSqm} m²`}
                    </span>
                    <span className="text-slate-300 hidden sm:inline">•</span>
                    <span className="text-slate-200 hidden sm:inline">
                      {language === 'ar' ? 'الاستلام: ديسمبر 2027 • مقدم 10%' : language === 'de' ? 'Übergabe: Dez 2027 • 10% Anzahlung' : 'Delivery: Dec 2027 • 10% DP'}
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-bold uppercase tracking-wider">
                    {activeUnit.unitCode === 'S-B'
                      ? (language === 'ar' ? 'مناسب لمطعم أو كافيه' : language === 'de' ? 'Ideal für Restaurant / Café' : 'Suitable for Restaurant or Café')
                      : activeUnit.unitCode === 'G-43'
                      ? (language === 'ar' ? 'محل تجاري بالدور الأرضي' : language === 'de' ? 'Gewerbe im EG • Yasmine Villas' : 'Ground Floor Retail • Yasmine Villas')
                      : (language === 'ar' ? 'محل تجاري بالدور الأول' : language === 'de' ? 'Gewerbe im 1. OG' : 'First Floor Retail')}
                  </span>
                </div>
              )}

              {/* Hero Action CTAs */}
              <div className="flex flex-wrap items-center gap-3.5 pt-3">
                <button
                  onClick={handleViewingClick}
                  type="button"
                  className="btn-gold py-3 px-6 text-xs font-semibold flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{language === 'ar' ? 'اطلب التفاصيل' : language === 'de' ? 'Details anfordern' : 'Request Details'}</span>
                </button>

                <a
                  href={activeUnit?.whatsappMessage ? `https://wa.me/201066330570?text=${encodeURIComponent(activeUnit.whatsappMessage)}` : whatsappInquiryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleWhatsAppClick}
                  className="btn-whatsapp py-3 px-6 text-xs font-semibold flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>{language === 'ar' ? 'تحدث مع مستشار عقاري' : language === 'de' ? 'Mit Berater sprechen' : 'Speak With an Advisor'}</span>
                </a>

                {project.availableUnitsList && project.availableUnitsList.length > 0 && (
                  <button
                    onClick={() => scrollToSection('inventory-section')}
                    type="button"
                    className="btn-outline-white py-3 px-5 text-xs font-semibold flex items-center gap-2"
                  >
                    <Layers className="w-4 h-4" />
                    <span>
                      {project.slug === 'artea-mall'
                        ? (language === 'ar' ? 'استعراض الـ 4 وحدات المتاحة' : language === 'de' ? '4 verfügbare Einheiten' : 'View 4 Available Units')
                        : project.slug === 'twenty-plus'
                        ? (language === 'ar' ? 'استعراض الـ 3 وحدات المتاحة' : language === 'de' ? '3 verfügbare Einheiten' : 'View 3 Available Units')
                        : (language === 'ar' ? 'استعرض الوحدة المتاحة' : language === 'de' ? 'Verfügbare Einheit ansehen' : 'View Available Unit')}
                    </span>
                  </button>
                )}

                <a
                  href={TEL_URL}
                  onClick={handlePhoneClick}
                  className="btn-outline-white py-3 px-4 text-xs font-semibold flex items-center gap-2"
                >
                  <Phone className="w-4 h-4 text-[#C5A880]" />
                  <span dir="ltr">{PRIMARY_PHONE}</span>
                </a>
              </div>
            </div>

            {/* Right Project Highlights Card */}
            <div className="lg:col-span-4">
              <div className="luxury-dark-card p-6 sm:p-7 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs uppercase font-semibold text-[#C5A880]">
                    {t('projectDetail.metricsTitle', 'Quick Project Metrics')}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {t('projectDetail.officialPortfolio', 'Capital Pioneers')}
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  {project.slug === 'artea-mall' && activeUnit ? (
                    <>
                      <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                        <span className="text-slate-400">{language === 'ar' ? 'الوحدة المختارة:' : language === 'de' ? 'Gewählte Einheit:' : 'Selected Unit:'}</span>
                        <span className="font-bold text-[#C5A880]">{activeUnit.unitCode} ({activeUnit.propertyType})</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                        <span className="text-slate-400">{language === 'ar' ? 'المساحة:' : language === 'de' ? 'Fläche:' : 'Area:'}</span>
                        <span className="font-semibold text-white">{activeUnit.areaSqm} m²</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                        <span className="text-slate-400">{language === 'ar' ? 'سعر المتر:' : language === 'de' ? 'Preis pro m²:' : 'Price / m²:'}</span>
                        <span className="font-semibold text-emerald-400" dir="ltr">EGP {activeUnit.pricePerSqmEGP?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                        <span className="text-slate-400">{language === 'ar' ? 'السعر الإجمالي:' : language === 'de' ? 'Gesamtpreis:' : 'Total Price:'}</span>
                        <span className="font-bold text-[#C5A880] text-sm" dir="ltr">EGP {activeUnit.totalPriceEGP.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                        <span className="text-slate-400">{language === 'ar' ? 'المقدم (40%):' : language === 'de' ? 'Anzahlung (40%):' : 'Down Payment (40%):'}</span>
                        <span className="font-semibold text-white" dir="ltr">EGP {activeUnit.downPaymentEGP ? activeUnit.downPaymentEGP.toLocaleString() : '—'}</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                        <span className="text-slate-400">{language === 'ar' ? 'القسط الربع سنوي:' : language === 'de' ? 'Quartalsrate:' : 'Quarterly Rate:'}</span>
                        <span className="font-semibold text-emerald-400" dir="ltr">EGP {activeUnit.quarterlyInstallmentEGP ? activeUnit.quarterlyInstallmentEGP.toLocaleString() : '—'}</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                        <span className="text-slate-400">{language === 'ar' ? 'وديعة الصيانة (10%):' : language === 'de' ? 'Instandhaltung (10%):' : 'Maintenance (10%):'}</span>
                        <span className="font-medium text-amber-300" dir="ltr">EGP {activeUnit.maintenanceEGP ? activeUnit.maintenanceEGP.toLocaleString() : '—'}</span>
                      </div>
                    </>
                  ) : project.slug === 'twenty-plus' && activeUnit ? (
                    <>
                      <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                        <span className="text-slate-400">{language === 'ar' ? 'كود الوحدة:' : language === 'de' ? 'Einheitencode:' : 'Unit Code:'}</span>
                        <span className="font-bold text-[#C5A880]">{activeUnit.unitCode} ({activeUnit.propertyType})</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                        <span className="text-slate-400">{language === 'ar' ? 'المساحة:' : language === 'de' ? 'Fläche:' : 'Area:'}</span>
                        <span className="font-semibold text-white">
                          {activeUnit.outdoorAreaSqm ? `${activeUnit.areaSqm} m² (${activeUnit.indoorAreaSqm} + ${activeUnit.outdoorAreaSqm})` : `${activeUnit.areaSqm} m²`}
                        </span>
                      </div>
                      {activeUnit.indoorPricePerSqmEGP ? (
                        <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                          <span className="text-slate-400">{language === 'ar' ? 'سعر المتر الداخلي:' : language === 'de' ? 'Innenpreis / m²:' : 'Indoor Price / m²:'}</span>
                          <span className="font-semibold text-emerald-400" dir="ltr">EGP {activeUnit.indoorPricePerSqmEGP.toLocaleString()}</span>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                          <span className="text-slate-400">{language === 'ar' ? 'سعر المتر:' : language === 'de' ? 'Preis pro m²:' : 'Price / m²:'}</span>
                          <span className="font-semibold text-emerald-400" dir="ltr">EGP {activeUnit.pricePerSqmEGP?.toLocaleString()}</span>
                        </div>
                      )}
                      {activeUnit.outdoorPricePerSqmEGP ? (
                        <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                          <span className="text-slate-400">{language === 'ar' ? 'سعر المتر الخارجي:' : language === 'de' ? 'Außenpreis / m²:' : 'Outdoor Price / m²:'}</span>
                          <span className="font-semibold text-emerald-400" dir="ltr">EGP {activeUnit.outdoorPricePerSqmEGP.toLocaleString()}</span>
                        </div>
                      ) : null}
                      <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                        <span className="text-slate-400">{language === 'ar' ? 'السعر الإجمالي:' : language === 'de' ? 'Gesamtpreis:' : 'Total Price:'}</span>
                        <span className="font-bold text-[#C5A880] text-sm" dir="ltr">EGP {activeUnit.totalPriceEGP.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                        <span className="text-slate-400">{language === 'ar' ? 'المقدم يبدأ من:' : language === 'de' ? 'Anzahlung ab:' : 'Down Payment from:'}</span>
                        <span className="font-semibold text-white" dir="ltr">
                          10% (EGP {activeUnit.downPaymentEGP ? (activeUnit.downPaymentEGP >= 1000000 ? `${(activeUnit.downPaymentEGP / 1000000).toFixed(3)}M` : activeUnit.downPaymentEGP.toLocaleString()) : '10%'})
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                        <span className="text-slate-400">{language === 'ar' ? 'فترات التقسيط:' : language === 'de' ? 'Ratenlaufzeit:' : 'Installments:'}</span>
                        <span className="font-semibold text-[#C5A880]">{language === 'ar' ? 'حتى 8 سنوات' : language === 'de' ? 'Bis zu 8 Jahre' : 'Up to 8 Years'}</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                        <span className="text-slate-400">{language === 'ar' ? 'وديعة الصيانة (10%):' : language === 'de' ? 'Instandhaltung (10%):' : 'Maintenance (10%):'}</span>
                        <span className="font-medium text-amber-300" dir="ltr">
                          EGP {activeUnit.maintenanceEGP ? activeUnit.maintenanceEGP.toLocaleString() : '—'}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      {project.pricePerMeter && (
                        <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                          <span className="text-slate-400">{language === 'ar' ? 'سعر المتر:' : language === 'de' ? 'Quadratmeterpreis:' : 'Price / m²:'}</span>
                          <span className="font-semibold text-emerald-400">{project.pricePerMeter}</span>
                        </div>
                      )}

                      {!project.hidePaymentPlans && project.paymentPlans && project.paymentPlans.length > 0 && (
                        <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                          <span className="text-slate-400">{t('projectDetail.paymentTerms', 'Payment Terms:')}</span>
                          <span className="font-semibold text-[#C5A880]">
                            {project.paymentPlans[0]?.downPaymentPercent || (language === 'ar' ? 'مقدم يبدأ من 10%' : 'From 10% Down')}
                          </span>
                        </div>
                      )}
                    </>
                  )}

                  <div className="flex justify-between items-center py-1.5">
                    <span className="text-slate-400">{t('projectDetail.status', 'Status:')}</span>
                    <span className="font-semibold text-emerald-400">{project.projectStatus}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10">
                  <div className="text-[11px] text-slate-300 font-light text-center">
                    {project.startingPrice || t('projectDetail.inquirePrice', 'Inquire for Price List & Schedule')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 3. Limited Launch Offer Strip (if present) */}
      {project.launchOffer && (
        <section className="bg-gradient-to-r from-emerald-900 via-[#061D28] to-emerald-950 text-white py-4 px-4 sm:px-6 lg:px-8 border-b border-emerald-500/20">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 text-center sm:text-left rtl:sm:text-right">
              <span className="px-2.5 py-1 rounded bg-emerald-500 text-white font-semibold text-[11px]">
                {project.launchOffer.badge}
              </span>
              <strong className="text-emerald-300 font-semibold text-sm">
                {project.launchOffer.discountPercent}
              </strong>
              <span className="text-slate-300 font-light">
                — {project.launchOffer.terms}
              </span>
            </div>
            <button
              onClick={handleViewingClick}
              className="text-[#C5A880] hover:underline font-semibold flex items-center gap-1"
            >
              <span>{language === 'ar' ? 'احصل على عرض الإطلاق' : language === 'de' ? 'Angebot anfordern' : 'Claim Launch Offer'}</span>
              <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </section>
      )}

      {/* 4. IMMEDIATE DELIVERY SIGNATURE SHOWCASE SECTION */}
      {project.immediateDeliveryBadge && (
        <section className="bg-gradient-to-r from-emerald-950 via-[#061D28] to-emerald-950 text-white py-8 sm:py-10 border-b border-emerald-500/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-6 sm:p-8 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left rtl:md:text-right">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/40">
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'استلام فوري' : language === 'de' ? 'Sofortige Übergabe' : 'Ready for Immediate Delivery'}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {language === 'ar' ? 'وحدات مختارة جاهزة للاستلام الفوري والتشغيل' : language === 'de' ? 'Ausgewählte Einheiten zur sofortigen Übergabe' : 'Selected Units Ready for Immediate Handover'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 font-light max-w-2xl leading-relaxed">
                  {language === 'ar'
                    ? 'تتوافر وحدات مختارة بمشروع ARTEA MALL بنظام الاستلام الفوري وفق أحدث الاشتراطات والتوافر التجاري المعتمد لدى Capital Pioneers.'
                    : language === 'de'
                    ? 'Ausgewählte Einheiten im ARTEA MALL stehen gemäß offiziellem Verkaufsstatus zur sofortigen Übergabe und gewerblichen Nutzung bereit.'
                    : 'Selected units at ARTEA MALL are currently offered with immediate delivery according to the supplied commercial availability.'}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 whitespace-nowrap">
                <button
                  onClick={() => scrollToSection('inventory-section')}
                  className="btn-gold py-3 px-6 text-xs font-bold flex items-center gap-2"
                >
                  <Layers className="w-4 h-4" />
                  <span>{language === 'ar' ? 'تفاصيل الوحدة المتاحة' : language === 'de' ? 'Einheit ansehen' : 'View Available Unit'}</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 5. Main Project Body Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Main Content (Left 8 Cols) */}
          <div className="lg:col-span-8 space-y-14">
            
            {/* Overview Section */}
            <section className="space-y-5 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/70 shadow-soft-sm">
              <div className="space-y-2 border-b border-slate-100 pb-4">
                <div className="eyebrow-tag bg-[#F1F7FA] text-[#0B4D68]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t('projectDetail.overviewEyebrow', 'Project Overview')}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-semibold text-[#0F2432] tracking-tight">
                  {project.availableUnitsList && project.availableUnitsList.length > 0
                    ? (language === 'ar' ? 'نظرة عامة على المشروع وموقعه' : language === 'de' ? 'Projektübersicht & Standort' : 'Project Overview & Location')
                    : project.projectType === 'Medical'
                    ? (language === 'ar' ? 'المخطط الطبي والرؤية الاستثمارية' : language === 'de' ? 'Medizinischer Masterplan & Positionierung' : 'Medical Masterplan & Destination Overview')
                    : t('projectDetail.overviewTitle', 'Architectural Masterplan & Positioning')}
                </h2>
              </div>

              <div className="prose max-w-none text-slate-600 font-light leading-relaxed space-y-4 text-sm sm:text-base">
                <p>{project.fullDescription}</p>
              </div>

              {/* Delivery Date Highlight Card */}
              {!project.hideDeliveryDate && project.deliveryDate && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-white border border-emerald-500/20 flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                      <KeyRound className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 font-medium block">
                        {language === 'ar' ? 'حالة الاستلام' : language === 'de' ? 'Übergabestatus' : 'Delivery Status'}
                      </span>
                      <strong className="text-base font-semibold text-emerald-900">
                        {project.deliveryDate}
                      </strong>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
                    {project.projectStatus}
                  </span>
                </div>
              )}

              {/* Project at a Glance / Engineering Specs Grid */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs font-bold text-[#0F2432] uppercase tracking-wider">
                  <Building2 className="w-3.5 h-3.5 text-[#0B4D68]" />
                  <span>{language === 'ar' ? 'المشروع في أرقام — Key Metrics' : language === 'de' ? 'Projekt im Überblick' : 'Key Metrics at a Glance'}</span>
                </div>

                {project.slug === 'twenty-plus' && activeUnit ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
                    <div className="p-3.5 rounded-2xl bg-[#FAFBFD] border border-slate-200/60 space-y-1 text-center">
                      <span className="text-[11px] text-slate-400 block">{language === 'ar' ? 'كود الوحدة' : language === 'de' ? 'Einheitencode' : 'Unit Code'}</span>
                      <strong className="text-base text-[#0F2432] block font-semibold">{activeUnit.unitCode || '—'}</strong>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-[#FAFBFD] border border-slate-200/60 space-y-1 text-center">
                      <span className="text-[11px] text-slate-400 block">{language === 'ar' ? 'المساحة الداخلية' : language === 'de' ? 'Innenfläche' : 'Indoor Area'}</span>
                      <strong className="text-base text-[#0F2432] block font-semibold">{activeUnit.indoorAreaSqm || activeUnit.areaSqm} m²</strong>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-[#FAFBFD] border border-slate-200/60 space-y-1 text-center">
                      <span className="text-[11px] text-slate-400 block">{language === 'ar' ? 'المساحة الخارجية' : language === 'de' ? 'Außenfläche' : 'Outdoor Area'}</span>
                      <strong className="text-base text-[#0F2432] block font-semibold">{activeUnit.outdoorAreaSqm ? `${activeUnit.outdoorAreaSqm} m²` : '—'}</strong>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-[#FAFBFD] border border-slate-200/60 space-y-1 text-center">
                      <span className="text-[11px] text-slate-400 block">{language === 'ar' ? 'إجمالي السعر' : language === 'de' ? 'Gesamtpreis' : 'Total Price'}</span>
                      <strong className="text-sm text-[#C5A880] block font-semibold" dir="ltr">
                        EGP {activeUnit.totalPriceEGP >= 1000000 ? `${(activeUnit.totalPriceEGP / 1000000).toFixed(2)}M` : activeUnit.totalPriceEGP.toLocaleString()}
                      </strong>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-[#FAFBFD] border border-slate-200/60 space-y-1 text-center">
                      <span className="text-[11px] text-slate-400 block">{language === 'ar' ? 'المقدم يبدأ من' : language === 'de' ? 'Anzahlung ab' : 'Down Payment'}</span>
                      <strong className="text-sm text-[#061D28] block font-semibold" dir="ltr">10%</strong>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-[#FAFBFD] border border-slate-200/60 space-y-1 text-center">
                      <span className="text-[11px] text-slate-400 block">{language === 'ar' ? 'فترات التقسيط' : language === 'de' ? 'Ratenlaufzeit' : 'Installments'}</span>
                      <strong className="text-sm text-emerald-700 block font-semibold">{language === 'ar' ? 'حتى 8 سنوات' : language === 'de' ? 'Bis 8 Jahre' : 'Up to 8 Yrs'}</strong>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
                    {project.specs.landAreaSqm && (
                      <div className="p-3.5 rounded-2xl bg-[#FAFBFD] border border-slate-200/60 space-y-1 text-center">
                        <span className="text-[11px] text-slate-400 block">{language === 'ar' ? 'مساحة الأرض' : language === 'de' ? 'Grundstücksfläche' : 'Land Area'}</span>
                        <strong className="text-sm sm:text-base text-[#0F2432] block font-bold">{project.specs.landAreaSqm}</strong>
                      </div>
                    )}

                    {project.specs.groundFloorAreaSqm && (
                      <div className="p-3.5 rounded-2xl bg-[#FAFBFD] border border-slate-200/60 space-y-1 text-center">
                        <span className="text-[11px] text-slate-400 block">{language === 'ar' ? 'مساحة الدور الأرضي' : language === 'de' ? 'Erdgeschossfläche' : 'Ground Floor Area'}</span>
                        <strong className="text-sm sm:text-base text-[#0F2432] block font-bold">{project.specs.groundFloorAreaSqm}</strong>
                      </div>
                    )}

                    {project.specs.parkingCapacity && (
                      <div className="p-3.5 rounded-2xl bg-[#FAFBFD] border border-slate-200/60 space-y-1 text-center">
                        <span className="text-[11px] text-slate-400 block">{language === 'ar' ? 'سعة انتظار السيارات' : language === 'de' ? 'Parkplätze' : 'Parking Capacity'}</span>
                        <strong className="text-sm sm:text-base text-[#0F2432] block font-bold">{project.specs.parkingCapacity}</strong>
                      </div>
                    )}

                    {project.specs.basementsCount && (
                      <div className="p-3.5 rounded-2xl bg-[#FAFBFD] border border-slate-200/60 space-y-1 text-center">
                        <span className="text-[11px] text-slate-400 block">{language === 'ar' ? 'عدد البدرومات' : language === 'de' ? 'Tiefgaragenebenen' : 'Basement Levels'}</span>
                        <strong className="text-sm sm:text-base text-[#0F2432] block font-bold">{project.specs.basementsCount}</strong>
                      </div>
                    )}

                    {project.specs.basementAreaSqmEach && (
                      <div className="p-3.5 rounded-2xl bg-[#FAFBFD] border border-slate-200/60 space-y-1 text-center col-span-2 sm:col-span-1">
                        <span className="text-[11px] text-slate-400 block">{language === 'ar' ? 'مساحة كل بدروم' : language === 'de' ? 'Fläche pro UG' : 'Basement Area'}</span>
                        <strong className="text-xs sm:text-sm text-[#0B4D68] block font-bold">{project.specs.basementAreaSqmEach}</strong>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>

            {/* 5b. STANDALONE BUILDING FEATURE SECTION (TWENTY PLUS) */}
            {project.slug === 'twenty-plus' && (
              <section className="space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/70 shadow-soft-sm">
                <div className="space-y-2 border-b border-slate-100 pb-4">
                  <div className="eyebrow-tag bg-[#F1F7FA] text-[#0B4D68]">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'مفهوم العقار المستقل' : language === 'de' ? 'Freistehendes Konzept' : 'Standalone Property Concept'}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-semibold text-[#0F2432] tracking-tight">
                    {language === 'ar' ? 'مبنى تجاري مستقل بالكامل — Your Own Standalone Building' : language === 'de' ? 'Ihr eigenes freistehendes Gewerbegebäude' : 'Your Own Standalone Commercial Building'}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-light leading-relaxed">
                    {language === 'ar'
                      ? 'يوفر TWENTY PLUS خصوصية تشغيلية كاملة واستقلالية استثمارية لمشروعك التجاري في موقع استراتيجي محاط بمنطقة الياسمين فيلات.'
                      : language === 'de'
                      ? 'TWENTY PLUS bietet vollständige operative Unabhängigkeit und exklusive Markenpräsenz im Herzen von Al Yasmeen Villas.'
                      : 'TWENTY PLUS provides complete operational independence, distinctive corporate branding, and private arrival within Al Yasmeen Villas.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-5 rounded-2xl bg-[#FAFBFD] border border-slate-200/70 space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-[#0B4D68]/10 text-[#0B4D68] flex items-center justify-center font-bold">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <h4 className="font-bold text-[#0F2432] text-sm">
                      {language === 'ar' ? 'استقلالية وخصوصية كاملة' : language === 'de' ? 'Vollständige Autonomie' : 'Full Building Autonomy'}
                    </h4>
                    <p className="text-slate-500 font-light leading-relaxed">
                      {language === 'ar'
                        ? 'مبنى مستقل بالكامل دون مشاركة مداخل أو مساحات مشتركة مع مستأجرين آخرين، مما يمنح علامتك التجارية حضوراً بارزاً.'
                        : language === 'de'
                        ? 'Vollkommen eigenständiges Gebäude ohne geteilte Eingänge für maximale Markenwirkung.'
                        : 'Independent standalone structure without shared entrances or common areas, giving your brand maximum visibility.'}
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#FAFBFD] border border-slate-200/70 space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-[#0B4D68]/10 text-[#0B4D68] flex items-center justify-center font-bold">
                      <UtensilsCrossed className="w-4 h-4" />
                    </div>
                    <h4 className="font-bold text-[#0F2432] text-sm">
                      {language === 'ar' ? 'جاهزية لقطاع الضيافة والمطاعم' : language === 'de' ? 'Gastronomie & Café Bereit' : 'Hospitality & F&B Readiness'}
                    </h4>
                    <p className="text-slate-500 font-light leading-relaxed">
                      {language === 'ar'
                        ? 'توزيع معماري متناسق يجمع بين صالة داخلية فسيحة ومساحات جلوس خارجية مفتوحة تناسب كبرى سلاسل المطاعم والكافيهات.'
                        : language === 'de'
                        ? 'Harmonische Aufteilung von Innen- und Außenflächen für Premium-Restaurants und Cafés.'
                        : 'Engineered layout combining high-capacity indoor dining and expansive open-air seating for destination dining concepts.'}
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* 5c. AREA BREAKDOWN VISUAL SECTION (TWENTY PLUS) */}
            {project.slug === 'twenty-plus' && (
              <section className="space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/70 shadow-soft-sm">
                <div className="space-y-2 border-b border-slate-100 pb-4">
                  <div className="eyebrow-tag bg-[#F1F7FA] text-[#0B4D68]">
                    <Layers className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'توزيع المساحات والأسعار' : language === 'de' ? 'Flächen- & Preisaufteilung' : 'Area & Pricing Breakdown'}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-semibold text-[#0F2432] tracking-tight">
                    {activeUnit?.unitCode === 'S-B'
                      ? (language === 'ar' ? '720 م² المساحة الإجمالية المجمعة — كود S-B' : language === 'de' ? '720 m² Kombinierte Gesamtnutzfläche — Einheit S-B' : '720 m² of Combined Space — Unit S-B')
                      : activeUnit?.unitCode === 'G-43'
                      ? (language === 'ar' ? '40 م² مساحة المحل التجاري بالدور الأرضي — كود G-43' : language === 'de' ? '40 m² Gewerbeeinheit im EG — Einheit G-43' : '40 m² Ground Floor Commercial Unit — Unit G-43')
                      : (language === 'ar' ? '29 م² مساحة المحل التجاري بالدور الأول — كود F-04' : language === 'de' ? '29 m² Gewerbeeinheit 1. OG — Einheit F-04' : '29 m² First Floor Commercial Unit — Unit F-04')}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-light">
                    {activeUnit?.unitCode === 'S-B'
                      ? (language === 'ar'
                        ? 'تقسيم هندسي متكامل يجمع بين المساحة الداخلية المغلقة والمساحة الخارجية المفتوحة بأسعار متر محددة لكل قسم.'
                        : language === 'de'
                        ? 'Klare Trennung von Innen- und Außenbereichen mit individuellen Quadratmeterpreisen.'
                        : 'Precise architectural division between indoor climate-controlled space and open-air outdoor terrace space.')
                      : activeUnit?.unitCode === 'G-43'
                      ? (language === 'ar'
                        ? 'محل تجاري مميز بالدور الأرضي بمساحة 40 م² في الياسمين فيلات بسعر إجمالي 8,904,000 جنيه (222,600 ج/م²)، مع خطط سداد مرنة تبدأ من 10% مقدم وحتى 8 سنوات.'
                        : language === 'de'
                        ? 'Erstklassiges Ladenlokal im Erdgeschoss mit 40 m² in Al Yasmeen Villas zum Gesamtpreis von 8.904.000 EGP (222.600 EGP/m²) mit flexiblen Ratenplänen ab 10% Anzahlung bis zu 8 Jahren.'
                        : 'Prime Ground Floor retail shop with 40 m² in Yasmine Villas priced at EGP 8,904,000 (EGP 222,600/m²) with flexible payment plans from 10% down and up to 8 years.')
                      : (language === 'ar'
                        ? 'محل تجاري مميز بالدور الأول بمساحة 29 م² وسعر متر 196,350 جنيه، مع خطط سداد مرنة حتى 8 سنوات وخصم كاش 30%.'
                        : language === 'de'
                        ? 'Erstklassige 29 m² Gewerbeeinheit im 1. OG zum Quadratmeterpreis von 196.350 EGP mit Raten bis zu 8 Jahren und 30% Barzahlungsrabatt.'
                        : 'Prime 29 m² First Floor commercial unit priced at EGP 196,350/m² with structured payment plans up to 8 years and 30% cash discount.')}
                  </p>
                </div>

                {activeUnit?.unitCode === 'S-B' || activeUnit?.outdoorAreaSqm ? (
                  <>
                    {/* Proportional Space Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-semibold text-[#0F2432]">
                        <span>{language === 'ar' ? 'المساحة الداخلية (62.4%)' : language === 'de' ? 'Innenfläche (62,4%)' : 'Indoor Area (62.4%)'}</span>
                        <span>{language === 'ar' ? 'المساحة الخارجية (37.6%)' : language === 'de' ? 'Außenfläche (37,6%)' : 'Outdoor Area (37.6%)'}</span>
                      </div>
                      <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex p-0.5 border border-slate-200">
                        <div className="h-full bg-[#0B4D68] rounded-l-full" style={{ width: '62.4%' }} />
                        <div className="h-full bg-[#C5A880] rounded-r-full" style={{ width: '37.6%' }} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      {/* Indoor Metric */}
                      <div className="p-5 rounded-2xl bg-[#FAFBFD] border border-slate-200/80 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] uppercase font-bold text-[#0B4D68] tracking-wider">
                            {language === 'ar' ? 'المساحة الداخلية' : language === 'de' ? 'Innenbereich' : 'Indoor Space'}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-[#0B4D68]/10 text-[#0B4D68] text-[10px] font-bold">
                            62.4%
                          </span>
                        </div>
                        <div className="text-2xl sm:text-3xl font-semibold text-[#0F2432]">
                          449 m²
                        </div>
                        <div className="pt-2 border-t border-slate-200/60 flex justify-between items-center text-slate-500">
                          <span>{language === 'ar' ? 'سعر المتر الداخلي:' : language === 'de' ? 'Innenpreis / m²:' : 'Indoor Price / m²:'}</span>
                          <strong className="text-emerald-700 font-bold" dir="ltr">EGP 240,000</strong>
                        </div>
                      </div>

                      {/* Outdoor Metric */}
                      <div className="p-5 rounded-2xl bg-[#FAFBFD] border border-slate-200/80 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] uppercase font-bold text-[#8A714C] tracking-wider">
                            {language === 'ar' ? 'المساحة الخارجية' : language === 'de' ? 'Außenbereich' : 'Outdoor Space'}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-[#C5A880]/20 text-[#8A714C] text-[10px] font-bold">
                            37.6%
                          </span>
                        </div>
                        <div className="text-2xl sm:text-3xl font-semibold text-[#0F2432]">
                          271 m²
                        </div>
                        <div className="pt-2 border-t border-slate-200/60 flex justify-between items-center text-slate-500">
                          <span>{language === 'ar' ? 'سعر المتر الخارجي:' : language === 'de' ? 'Außenpreis / m²:' : 'Outdoor Price / m²:'}</span>
                          <strong className="text-emerald-700 font-bold" dir="ltr">EGP 80,000</strong>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div className="p-5 rounded-2xl bg-[#FAFBFD] border border-slate-200/80 space-y-2">
                      <span className="text-[11px] uppercase font-bold text-[#0B4D68] tracking-wider block">
                        {language === 'ar' ? 'المساحة المعتمدة' : language === 'de' ? 'Nutzfläche' : 'Certified Area'}
                      </span>
                      <div className="text-2xl sm:text-3xl font-semibold text-[#0F2432]">
                        {activeUnit?.areaSqm || (activeUnit?.unitCode === 'G-43' ? 40 : 29)} m²
                      </div>
                      <div className="text-slate-500 pt-2 border-t border-slate-200/60">
                        {activeUnit?.unitCode === 'G-43'
                          ? (language === 'ar' ? 'محل تجاري بالدور الأرضي' : language === 'de' ? 'Ladenlokal im EG' : 'Ground Floor Commercial Unit')
                          : (language === 'ar' ? 'محل تجاري بالدور الأول' : language === 'de' ? 'Gewerbeeinheit im 1. OG' : 'First Floor Commercial Unit')}
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-[#FAFBFD] border border-slate-200/80 space-y-2">
                      <span className="text-[11px] uppercase font-bold text-[#0B4D68] tracking-wider block">
                        {language === 'ar' ? 'سعر المتر المعتمد' : language === 'de' ? 'Quadratmeterpreis' : 'Price / m²'}
                      </span>
                      <div className="text-2xl sm:text-3xl font-semibold text-emerald-700" dir="ltr">
                        EGP {(activeUnit?.pricePerSqmEGP || activeUnit?.indoorPricePerSqmEGP || (activeUnit?.unitCode === 'G-43' ? 222600 : 196350)).toLocaleString()}
                      </div>
                      <div className="text-slate-500 pt-2 border-t border-slate-200/60">
                        {language === 'ar' ? 'سعر المتر الصافي' : 'Net Price per SQM'}
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-[#FAFBFD] border border-slate-200/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] uppercase font-bold text-[#8A714C] tracking-wider block">
                          {language === 'ar' ? 'إجمالي السعر' : language === 'de' ? 'Gesamtpreis' : 'Total Price'}
                        </span>
                        {activeUnit?.discountPercent && (
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-semibold">
                            {language === 'ar' ? 'خصم 10%' : '10% OFF'}
                          </span>
                        )}
                      </div>
                      {activeUnit?.discountedPriceEGP ? (
                        <div className="space-y-0.5">
                          <div className="text-2xl sm:text-3xl font-semibold text-emerald-700 font-mono tabular-nums" dir="ltr">
                            EGP {activeUnit.discountedPriceEGP >= 1000000 ? `${(activeUnit.discountedPriceEGP / 1000000).toFixed(2)}M` : activeUnit.discountedPriceEGP.toLocaleString()}
                          </div>
                          <div className="text-xs text-slate-400 line-through font-mono tabular-nums" dir="ltr">
                            EGP {(activeUnit.originalPriceEGP || activeUnit.totalPriceEGP).toLocaleString()}
                          </div>
                        </div>
                      ) : (
                        <div className="text-2xl sm:text-3xl font-semibold text-[#C5A880] font-mono tabular-nums" dir="ltr">
                          EGP {activeUnit ? (activeUnit.totalPriceEGP >= 1000000 ? `${(activeUnit.totalPriceEGP / 1000000).toFixed(2)}M` : activeUnit.totalPriceEGP.toLocaleString()) : '8.90M'}
                        </div>
                      )}
                      <div className="text-slate-500 pt-2 border-t border-slate-200/60 text-[11px]">
                        {activeUnit?.discountAmountEGP ? (
                          <span className="text-emerald-700 font-bold block">
                            {language === 'ar' ? `قيمة التوفير: ${activeUnit.discountAmountEGP.toLocaleString()} ج.م` : `Savings: EGP ${activeUnit.discountAmountEGP.toLocaleString()}`}
                          </span>
                        ) : activeUnit?.unitCode === 'G-43' ? (
                          (language === 'ar' ? 'مقدم 10% وتقسيط حتى 8 سنوات' : language === 'de' ? '10% Anzahlung & bis 8 Jahre' : '10% DP & Up to 8 Years')
                        ) : (
                          (language === 'ar' ? 'خصم 30% كاش متاح' : '30% Cash Discount Available')
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* 5d. COMMERCIAL SUITABILITY CARDS (TWENTY PLUS) */}
            {project.slug === 'twenty-plus' && (
              <section className="space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/70 shadow-soft-sm">
                <div className="space-y-2 border-b border-slate-100 pb-4">
                  <div className="eyebrow-tag bg-[#F1F7FA] text-[#0B4D68]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'الاستخدامات التجارية المناسبة' : language === 'de' ? 'Kommerzielle Eignung' : 'Commercial Suitability'}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-semibold text-[#0F2432] tracking-tight">
                    {language === 'ar' ? 'وجهة استثنائية لقطاع الأغذية والمشروبات' : language === 'de' ? 'Gebaut für Gastronomie & Destination-Konzepte' : 'Built for a Destination Concept'}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-light">
                    {language === 'ar'
                      ? 'تصميم معماري ومساحات تلائم مفاهيم المطاعم الراقية والكافيهات العالمية.'
                      : language === 'de'
                      ? 'Ideale architektonische Voraussetzungen für gehobene Restaurant- und Café-Konzepte.'
                      : 'Architectural proportions and outdoor integration tailored for high-end dining and lifestyle café operators.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {/* Restaurant Card */}
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-[#061D28] to-[#0B3042] text-white space-y-3 border border-white/10 shadow-soft-sm">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-md bg-[#C5A880] text-[#061D28] text-[11px] font-semibold uppercase tracking-wider">
                        RESTAURANT
                      </span>
                      <UtensilsCrossed className="w-5 h-5 text-[#C5A880]" />
                    </div>
                    <h3 className="text-base font-bold text-white">
                      {language === 'ar' ? 'مطعم متكامل راقٍ' : language === 'de' ? 'Gehobenes Restaurant' : 'Full-Service Restaurant'}
                    </h3>
                    <p className="text-slate-300 font-light leading-relaxed">
                      {language === 'ar'
                        ? 'سعة داخلية واسعة للمطابخ وصالات الطعام، مع تراس خارجي فسيح (271 م²) لتجارب تناول الطعام في الهواء الطلق.'
                        : language === 'de'
                        ? 'Großzügiger Innenbereich für Küchen und Gasträume plus 271 m² Außenterrasse für ganzjährige Außengastronomie.'
                        : 'Spacious 449 m² indoor capacity for commercial kitchens and multi-zone dining, paired with a 271 m² open-air dining terrace.'}
                    </p>
                  </div>

                  {/* Café Card */}
                  <div className="p-6 rounded-2xl bg-[#FAFBFD] border border-slate-200/80 space-y-3 shadow-soft-sm">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-md bg-[#0B4D68] text-white text-[11px] font-semibold uppercase tracking-wider">
                        CAFÉ
                      </span>
                      <Coffee className="w-5 h-5 text-[#0B4D68]" />
                    </div>
                    <h3 className="text-base font-bold text-[#0F2432]">
                      {language === 'ar' ? 'كافيه أو محمصة متخصصة' : language === 'de' ? 'Specialty Café & Lounge' : 'Specialty Café & Roastery'}
                    </h3>
                    <p className="text-slate-600 font-light leading-relaxed">
                      {language === 'ar'
                        ? 'بيئة حيوية لاجتماعات العمل واللقاءات الاجتماعية، مستفيدة من الكثافة السكنية الراقية في منطقة الياسمين فيلات.'
                        : language === 'de'
                        ? 'Lebendiges Ambiente für Arbeit und soziale Treffen im kaufkraftstarken Villenviertel Al Yasmeen.'
                        : 'Vibrant indoor seating and garden patio seating commanding high organic footfall within the affluent Al Yasmeen residential catchment.'}
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* 6. CURRENT AVAILABILITY & FEATURED UNIT DETAILS SECTION */}
            {project.availableUnitsList && project.availableUnitsList.length > 0 && (
              <section id="inventory-section" className="space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/70 shadow-soft-sm">
                <div className="space-y-2 border-b border-slate-100 pb-4">
                  <div className="eyebrow-tag bg-[#F1F7FA] text-[#0B4D68]">
                    <Layers className="w-3.5 h-3.5" />
                    <span>
                      {project.slug === 'artea-mall'
                        ? (language === 'ar' ? 'الوحدات المتاحة في ARTEA' : language === 'de' ? 'Verfügbare Einheiten in ARTEA' : 'Available ARTEA Units')
                        : project.slug === 'twenty-plus'
                        ? (language === 'ar' ? 'اختر وحدتك في Twenty Plus' : language === 'de' ? 'Verfügbare Einheiten in Twenty Plus' : 'Available Twenty Plus Units')
                        : (language === 'ar' ? 'الوحدة المعتمدة' : language === 'de' ? 'Verifizierte Einheit' : 'Featured Available Unit')}
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-semibold text-[#0F2432] tracking-tight">
                    {project.slug === 'artea-mall'
                      ? (language === 'ar' ? 'الوحدات المتاحة في ARTEA — استلام فوري' : language === 'de' ? 'Verfügbare Einheiten im ARTEA — Sofortige Übergabe' : 'Available ARTEA Units — Immediate Delivery')
                      : project.slug === 'twenty-plus'
                      ? (language === 'ar' ? 'الوحدات التجارية المتاحة في TWENTY PLUS' : language === 'de' ? 'Verfügbare Gewerbeeinheiten im TWENTY PLUS' : 'Available Commercial Units in TWENTY PLUS')
                      : (language === 'ar' ? 'تفاصيل الوحدة التجارية المتاحة' : language === 'de' ? 'Verfügbare Gewerbeeinheit' : 'Featured Commercial Availability')}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-light">
                    {project.slug === 'artea-mall'
                      ? (language === 'ar'
                        ? 'اختر من بين 4 وحدات معتمدة بنظام استلام فوري / جاهز للاستلام (عيادة طبية/مكتب إداري 74 م² دور ثانٍ كود S-18، مكتب 200 م² كود T-01، محل تجاري 42.5 م² كود G-04، أو وحدة 52 م² كود M-02) بمقدم 40% وتقسيط على 3 سنوات. اضغط على أي وحدة لتحديث تفاصيلها ومخططها وخطة سدادها.'
                        : language === 'de'
                        ? 'Wählen Sie aus 4 verifizierten Einheiten mit sofortiger Übergabe / Übergabe 30.09.2026 (74 m² Praxis/Büro S-18 im 2. OG, 200 m² Büro T-01, 42.5 m² Gewerbe G-04 oder 52 m² M-02) mit 40% Anzahlung und 3 Jahren Ratenzahlung. Klicken Sie auf eine Einheit, um Details und Grundriss zu aktualisieren.'
                        : 'Select from 4 verified units with immediate / 30/09/2026 delivery (74 m² Medical/Admin S-18 on Second Floor, 200 m² Office T-01, 42.5 m² Retail G-04, or 52 m² M-02) with 40% down payment and 3 years installments. Click any unit to dynamically update its details, floor plan, and payment plan.')
                      : project.slug === 'twenty-plus'
                      ? (language === 'ar'
                        ? 'اختر من بين 3 وحدات تجارية معتمدة (محل تجاري دور أرضي 40 م² كود G-43، محل تجاري 29 م² كود F-04، أو مبنى تجاري مستقل 720 م² كود S-B) بمقدمات تبدأ من 10% وتقسيط حتى 8 سنوات. اضغط على أي وحدة لتحديث تفاصيلها ومخططها وخطة سدادها.'
                        : language === 'de'
                        ? 'Wählen Sie aus 3 verifizierten Gewerbeeinheiten (Ladenlokal im EG mit 40 m² G-43, 29 m² Gewerbeeinheit F-04 oder 720 m² freistehendes Gebäude S-B) mit Anzahlungen ab 10% und bis zu 8 Jahren Ratenzahlung. Klicken Sie auf eine Einheit, um Details, Grundriss und Zahlungsplan zu aktualisieren.'
                        : 'Select from 3 verified commercial units (Ground Floor retail unit 40 m² G-43, 29 m² retail unit F-04, or 720 m² standalone building S-B) with down payments from 10% and up to 8 years installments. Click any unit to dynamically update its details, floor plan, and payment plan.')
                      : (language === 'ar'
                        ? `تفاصيل الوحدة المتاحة بمشروع ${project.name} وفق البيانات التجارية والهندسية المعتمدة.`
                        : language === 'de'
                        ? `Offizielle Immobiliendaten für ${project.name} gemäß Entwicklerangaben.`
                        : `Authoritative verified property details for ${project.name}.`)}
                  </p>
                </div>

                <div className="space-y-6">
                  {project.availableUnitsList.map((unit) => {
                    const isSelected = activeUnit?.id === unit.id;
                    const unitWhatsAppUrl = `https://wa.me/201066330570?text=${encodeURIComponent(
                      unit.whatsappMessage || defaultWhatsAppMsg
                    )}`;

                    return (
                      <div
                        key={unit.id}
                        onClick={() => handleUnitCardSelect(unit)}
                        className={`p-6 sm:p-8 rounded-3xl transition-all space-y-6 relative cursor-pointer ${
                          isSelected
                            ? 'bg-gradient-to-br from-[#FAFBFD] to-[#F1F7FA] border-2 border-[#C5A880] ring-4 ring-[#C5A880]/15 shadow-soft-lg'
                            : 'bg-[#FAFBFD] border-2 border-slate-200/80 hover:border-[#0B4D68]/40 shadow-soft-sm'
                        }`}
                      >
                        {/* Unit Header Strip */}
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/70 pb-4">
                          <div className="flex items-center gap-2.5">
                            {unit.unitCode && (
                              <span className={`px-3 py-1.5 rounded-xl text-sm font-semibold tracking-wider ${
                                isSelected ? 'bg-[#061D28] text-[#C5A880]' : 'bg-slate-800 text-white'
                              }`}>
                                {unit.unitCode}
                              </span>
                            )}
                            <span className="px-3 py-1 rounded-lg bg-[#0B4D68]/10 text-[#0B4D68] text-xs font-bold">
                              {unit.propertyType} {unit.floor ? `– ${unit.floor}` : ''}
                            </span>
                            {isSelected && (
                              <span className="px-2.5 py-0.5 rounded-md bg-[#C5A880] text-[#061D28] text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1">
                                <Check className="w-3 h-3" />
                                <span>{language === 'ar' ? 'الوحدة المحددة' : language === 'de' ? 'Ausgewählt' : 'Selected'}</span>
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            {unit.delivery && (
                              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
                                <KeyRound className="w-3.5 h-3.5" />
                                <span>{unit.delivery}</span>
                              </span>
                            )}
                            <span className="px-2.5 py-1 rounded-full bg-slate-200/70 text-slate-700 text-xs font-medium">
                              {language === 'ar' ? 'متاح' : language === 'de' ? 'Verfügbar' : unit.status}
                            </span>
                          </div>
                        </div>

                        {/* Minimal Sophisticated Specs & Pricing Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 text-xs">
                          {/* Unit Code */}
                          <div className="p-4 rounded-2xl bg-white border border-slate-200/70 space-y-1">
                            <span className="text-[11px] text-slate-400 font-light block">
                              {language === 'ar' ? 'كود الوحدة:' : language === 'de' ? 'Einheitencode:' : 'Unit Code:'}
                            </span>
                            <strong className="text-base sm:text-lg font-semibold text-[#061D28]">
                              {unit.unitCode || '—'}
                            </strong>
                          </div>

                          {/* Area */}
                          <div className="p-4 rounded-2xl bg-white border border-slate-200/70 space-y-1">
                            <span className="text-[11px] text-slate-400 font-light block">
                              {unit.outdoorAreaSqm
                                ? (language === 'ar' ? 'المساحة المجمعة:' : language === 'de' ? 'Gesamtfläche:' : 'Combined Area:')
                                : (language === 'ar' ? 'المساحة الداخلية:' : language === 'de' ? 'Innenfläche:' : 'Indoor Area:')}
                            </span>
                            <strong className="text-base sm:text-lg font-bold text-[#0F2432]">
                              {unit.outdoorAreaSqm
                                ? `${unit.areaSqm} m² (${unit.indoorAreaSqm} + ${unit.outdoorAreaSqm})`
                                : `${unit.areaSqm} m²`}
                            </strong>
                          </div>

                          {/* Price per m² */}
                          <div className="p-4 rounded-2xl bg-white border border-slate-200/70 space-y-1">
                            <span className="text-[11px] text-slate-400 font-light block">
                              {unit.indoorPricePerSqmEGP
                                ? (language === 'ar' ? 'سعر المتر الداخلي:' : language === 'de' ? 'Innenpreis / m²:' : 'Indoor Price / m²:')
                                : (language === 'ar' ? 'سعر المتر:' : language === 'de' ? 'Preis / m²:' : 'Price / m²:')}
                            </span>
                            <strong className="text-base sm:text-lg font-bold text-[#0B4D68]" dir="ltr">
                              EGP {(unit.indoorPricePerSqmEGP || unit.pricePerSqmEGP || Math.round(unit.totalPriceEGP / unit.areaSqm)).toLocaleString()}
                            </strong>
                          </div>

                          {/* Total Unit Price */}
                          <div className="p-4 rounded-2xl bg-white border border-slate-200/70 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] text-slate-400 font-light block">
                                {language === 'ar' ? 'إجمالي السعر:' : language === 'de' ? 'Gesamtpreis:' : 'Total Price:'}
                              </span>
                              {unit.discountPercent && (
                                <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[9px] font-semibold">
                                  {language === 'ar' ? 'خصم 10%' : '10% OFF'}
                                </span>
                              )}
                            </div>
                            {unit.discountedPriceEGP ? (
                              <div className="space-y-0.5">
                                <div className="text-base sm:text-lg font-semibold text-emerald-700 font-mono tabular-nums" dir="ltr">
                                  EGP {unit.discountedPriceEGP >= 1000000 ? `${(unit.discountedPriceEGP / 1000000).toFixed(2)}M` : unit.discountedPriceEGP.toLocaleString()}
                                </div>
                                <div className="text-[11px] text-slate-400 line-through font-mono tabular-nums" dir="ltr">
                                  EGP {unit.totalPriceEGP >= 1000000 ? `${(unit.totalPriceEGP / 1000000).toFixed(2)}M` : unit.totalPriceEGP.toLocaleString()}
                                </div>
                              </div>
                            ) : (
                              <div className="text-base sm:text-lg font-semibold text-[#0B4D68] font-mono tabular-nums" dir="ltr">
                                EGP {unit.totalPriceEGP >= 1000000 ? `${(unit.totalPriceEGP / 1000000).toFixed(2)}M` : unit.totalPriceEGP.toLocaleString()}
                              </div>
                            )}
                          </div>

                          {/* Delivery */}
                          <div className="p-4 rounded-2xl bg-white border border-slate-200/70 space-y-1">
                            <span className="text-[11px] text-slate-400 font-light block">
                              {language === 'ar' ? 'الاستلام:' : language === 'de' ? 'Übergabe:' : 'Delivery:'}
                            </span>
                            <strong className="text-sm font-bold text-emerald-700 block">
                              {unit.delivery || (language === 'ar' ? 'استلام فوري' : 'Immediate')}
                            </strong>
                          </div>

                          {/* Down Payment */}
                          <div className="p-4 rounded-2xl bg-white border border-slate-200/70 space-y-1">
                            <span className="text-[11px] text-slate-400 font-light block">
                              {language === 'ar' ? 'المقدم:' : language === 'de' ? 'Anzahlung:' : 'Down Payment:'}
                            </span>
                            <strong className="text-sm font-bold text-[#061D28] block">
                              {unit.downPaymentPercent || 10}% ({unit.downPaymentEGP ? `EGP ${(unit.downPaymentEGP / 1000000).toFixed(2)}M` : '10%'})
                            </strong>
                          </div>

                          {/* Installments */}
                          <div className="p-4 rounded-2xl bg-white border border-slate-200/70 space-y-1">
                            <span className="text-[11px] text-slate-400 font-light block">
                              {language === 'ar' ? 'مدة التقسيط:' : language === 'de' ? 'Laufzeit:' : 'Installments:'}
                            </span>
                            <strong className="text-sm font-bold text-[#0F2432] block">
                              {unit.installmentYears || 8} {language === 'ar' ? 'سنوات' : language === 'de' ? 'Jahre' : 'Years'}
                            </strong>
                          </div>

                          {/* Quarterly Installment */}
                          {unit.outdoorPricePerSqmEGP ? (
                            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-1">
                              <span className="text-[11px] text-amber-800 font-semibold block">
                                {language === 'ar' ? 'سعر المتر الخارجي:' : language === 'de' ? 'Außenpreis / m²:' : 'Outdoor Price / m²:'}
                              </span>
                              <strong className="text-sm font-semibold text-amber-900 block" dir="ltr">
                                EGP {unit.outdoorPricePerSqmEGP.toLocaleString()}
                              </strong>
                            </div>
                          ) : (
                            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                              <span className="text-[11px] text-emerald-800 font-semibold block">
                                {language === 'ar' ? 'القسط الربع سنوي:' : language === 'de' ? 'Quartalsrate:' : 'Quarterly Installment:'}
                              </span>
                              <strong className="text-sm font-semibold text-emerald-900 block" dir="ltr">
                                {unit.quarterlyInstallmentEGP ? (unit.quarterlyInstallmentEGP >= 1000000 ? `EGP ${(unit.quarterlyInstallmentEGP / 1000000).toFixed(4)}M` : `EGP ${unit.quarterlyInstallmentEGP.toLocaleString()}`) : '—'}
                              </strong>
                            </div>
                          )}
                        </div>

                        {/* Maintenance Note (Separated) */}
                        {unit.maintenanceEGP && (
                          <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-center justify-between text-xs">
                            <span className="text-amber-900 font-medium">
                              {language === 'ar' ? `وديعة الصيانة للوحدة ${unit.unitCode || ''} (10% منفصلة عن سعر الوحدة):` : language === 'de' ? `Instandhaltungsrücklage Einheit ${unit.unitCode || ''} (10% separat):` : `Maintenance for Unit ${unit.unitCode || ''} (10% Separated from Unit Price):`}
                            </span>
                            <strong className="font-semibold text-amber-950 text-sm" dir="ltr">
                              10% — EGP {unit.maintenanceEGP.toLocaleString()}
                            </strong>
                          </div>
                        )}

                        {/* Unit CTAs */}
                        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => {
                              handleUnitCardSelect(unit);
                              handleSelectUnitInquiry(`${unit.unitCode ? unit.unitCode + ' ' : ''}${unit.propertyType} (${unit.areaSqm} m²) – EGP ${unit.totalPriceEGP.toLocaleString()}`);
                            }}
                            className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-2 ${
                              isSelected ? 'btn-gold' : 'btn-outline-gold'
                            }`}
                          >
                            <Calendar className="w-4 h-4" />
                            <span>
                              {isSelected
                                ? (language === 'ar' ? 'طلب تفاصيل هذه الوحدة' : language === 'de' ? 'Details anfordern' : 'Request Details')
                                : (language === 'ar' ? 'اختيار وطلب هذه الوحدة' : language === 'de' ? 'Diese Einheit wählen' : 'Select & Request Unit')}
                            </span>
                          </button>

                          <a
                            href={unitWhatsAppUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={handleWhatsAppClick}
                            className="btn-whatsapp flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-2"
                          >
                            <MessageCircle className="w-4 h-4 fill-current" />
                            <span>{language === 'ar' ? 'تحدث مع مستشار عقاري' : language === 'de' ? 'Mit Berater sprechen' : 'Speak With an Advisor'}</span>
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* 7a. DEDICATED FLOOR PLAN SECTION (ARTEA) */}
            {project.slug === 'artea-mall' && (
              <section id="floor-plan-section" className="space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/70 shadow-soft-sm">
                <div className="space-y-2 border-b border-slate-100 pb-4">
                  <div className="eyebrow-tag bg-[#F1F7FA] text-[#0B4D68]">
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>
                      {activeUnit?.unitCode === 'S-18'
                        ? (language === 'ar' ? 'موقع الوحدة على مخطط الدور' : language === 'de' ? 'Einheitenlage auf dem Grundriss' : 'UNIT LOCATION ON FLOOR PLAN')
                        : (language === 'ar' ? 'المخطط الهندسي والمعماري' : language === 'de' ? 'Architektonischer Grundriss' : 'Architectural Floor Plan')}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-2xl sm:text-3xl font-semibold text-[#0F2432] tracking-tight">
                      {activeUnit?.unitCode === 'S-18'
                        ? (language === 'ar' ? 'مخطط وموقع الوحدة S-18 — الدور الثاني (74 م²)' : language === 'de' ? 'Grundriss & Lage Einheit S-18 — 2. OG (74 m²)' : 'Unit S-18 Floor Plan & Location — Second Floor (74 m²)')
                        : activeUnit?.unitCode
                        ? (language === 'ar' ? `مخطط الوحدة ${activeUnit.unitCode} — Floor Plan` : `Unit ${activeUnit.unitCode} — Floor Plan`)
                        : (language === 'ar' ? 'المخطط المعماري لمشروع ARTEA' : 'ARTEA Floor Plan')}
                    </h2>
                    {activeUnit && (
                      <span className="px-3 py-1 rounded-full bg-[#0B4D68]/10 text-[#0B4D68] text-xs font-bold">
                        {activeUnit.unitCode} • {activeUnit.areaSqm} m² ({activeUnit.propertyType})
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-[#0B4D68]">
                    {activeUnit?.unitCode === 'S-18'
                      ? (language === 'ar' ? 'عيادة طبية / مكتب إداري 74 م² بالدور الثاني • تشطيب كامل بالتكييفات ومحددة بالسهم الأحمر' : language === 'de' ? 'Praxis / Büro 74 m² im 2. OG • Vollständig ausgebaut + Klima (mit rotem Pfeil)' : '74 SQM Medical / Admin Unit — Second Floor • Fully Finished + AC (Identified by Red Arrow)')
                      : activeUnit?.unitCode === 'T-01'
                      ? (language === 'ar' ? 'مكتب إداري 200 م² • 200 SQM Office Plan' : '200 SQM Office Plan')
                      : activeUnit?.unitCode === 'G-04'
                      ? (language === 'ar' ? 'محل تجاري 42.5 م² دور أرضي • Ground Floor Commercial Plan' : 'Ground Floor Commercial Plan')
                      : (language === 'ar' ? 'وحدة طبية/إدارية 52 م² • 52 SQM Medical/Admin Unit' : '52 SQM Medical/Admin Unit')}
                  </p>
                </div>

                {/* Floor Plan Display Box */}
                <div className="relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-200/80 shadow-soft-md group">
                  <div className="w-full bg-slate-950 flex items-center justify-center p-2 sm:p-4">
                    <img
                      src={activeUnit?.floorPlan || (activeUnit?.unitCode === 'S-18' ? '/images/projects/artea-mall/units/s18/artea-s18-74m-second-floor-plan.jpg' : '/images/projects/artea-mall/hero.jpg')}
                      alt={`Unit ${activeUnit?.unitCode || 'S-18'} Floor Plan ARTEA`}
                      onError={(e) => {
                        e.currentTarget.src = project.mainImage;
                      }}
                      className="w-full h-auto max-h-[750px] object-contain cursor-zoom-in group-hover:scale-[1.01] transition-transform duration-300 rounded-xl"
                      onClick={() => setActiveModalImage(activeUnit?.floorPlan || (activeUnit?.unitCode === 'S-18' ? '/images/projects/artea-mall/units/s18/artea-s18-74m-second-floor-plan.jpg' : '/images/projects/artea-mall/hero.jpg'))}
                      loading="lazy"
                    />
                  </div>

                  {/* Overlay Bottom Bar with View Full Floor Plan CTA */}
                  <div className="p-4 bg-gradient-to-r from-[#061D28] via-[#0B3042] to-[#061D28] text-white flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10">
                    <div className="flex items-center gap-2 text-xs text-slate-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="font-semibold text-white">
                        {language === 'ar'
                          ? `المخطط الهندسي المعتمد للوحدة ${activeUnit?.unitCode || 'S-18'} (${activeUnit?.areaSqm || 74} م²)`
                          : `Official Architectural Plan — Unit ${activeUnit?.unitCode || 'S-18'} (${activeUnit?.areaSqm || 74} SQM)`}
                      </span>
                    </div>

                    <button
                      onClick={() => setActiveModalImage(activeUnit?.floorPlan || (activeUnit?.unitCode === 'S-18' ? '/images/projects/artea-mall/units/s18/artea-s18-74m-second-floor-plan.jpg' : '/images/projects/artea-mall/hero.jpg'))}
                      type="button"
                      className="btn-gold py-2 px-5 text-xs font-bold flex items-center gap-2 shadow-sm"
                    >
                      <Maximize2 className="w-4 h-4" />
                      <span>{language === 'ar' ? 'عرض المخطط بالحجم الكامل' : language === 'de' ? 'Vollständigen Plan ansehen' : 'View Full Floor Plan'}</span>
                    </button>
                  </div>
                </div>

                {/* Project Scale Metrics Below Plan (Land, Ground Floor, Parking, Basements) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-2 text-xs">
                  <div className="p-3.5 rounded-2xl bg-[#FAFBFD] border border-slate-200/60 space-y-1 text-center">
                    <span className="text-[11px] text-slate-400 block">{language === 'ar' ? 'مساحة الأرض' : language === 'de' ? 'Grundstück' : 'Land Area'}</span>
                    <strong className="text-base font-bold text-[#0F2432] block">2,832 m²</strong>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#FAFBFD] border border-slate-200/60 space-y-1 text-center">
                    <span className="text-[11px] text-slate-400 block">{language === 'ar' ? 'مساحة الدور الأرضي' : language === 'de' ? 'Erdgeschoss' : 'Ground Floor'}</span>
                    <strong className="text-base font-bold text-[#0F2432] block">1,132 m²</strong>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#FAFBFD] border border-slate-200/60 space-y-1 text-center">
                    <span className="text-[11px] text-slate-400 block">{language === 'ar' ? 'سعة الجراج' : language === 'de' ? 'Parkplätze' : 'Parking Capacity'}</span>
                    <strong className="text-base font-bold text-[#0F2432] block">150+</strong>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#FAFBFD] border border-slate-200/60 space-y-1 text-center">
                    <span className="text-[11px] text-slate-400 block">{language === 'ar' ? 'مساحة البدروم' : language === 'de' ? 'UG-Ebenen' : '2 Basements Area'}</span>
                    <strong className="text-sm font-bold text-[#0B4D68] block">2,832 m² each</strong>
                  </div>
                </div>
              </section>
            )}

            {/* 7b. DEDICATED FLOOR PLAN SECTION (TWENTY PLUS) */}
            {project.slug === 'twenty-plus' && (
              <section id="floor-plan-section" className="space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/70 shadow-soft-sm">
                <div className="space-y-2 border-b border-slate-100 pb-4">
                  <div className="eyebrow-tag bg-[#F1F7FA] text-[#0B4D68]">
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>
                      {activeUnit?.unitCode === 'G-43'
                        ? (language === 'ar' ? 'موقع الوحدة وتفاصيل السداد' : language === 'de' ? 'Einheitenlage & Zahlungsdetails' : 'UNIT LOCATION & PAYMENT DETAILS')
                        : (language === 'ar' ? 'المخطط الهندسي والمعماري' : language === 'de' ? 'Architektonischer Grundriss' : 'Architectural Floor Plan')}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-2xl sm:text-3xl font-semibold text-[#0F2432] tracking-tight">
                      {activeUnit?.unitCode === 'G-43'
                        ? (language === 'ar' ? 'مخطط وموقع الوحدة G-43 وتفاصيل السداد — الياسمين فيلات' : language === 'de' ? 'Lageplan & Zahlungsdetails Einheit G-43 — Al Yasmeen Villas' : 'Unit G-43 Master Plan & Payment Details — Yasmine Villas')
                        : activeUnit?.unitCode
                        ? (language === 'ar' ? `مخطط الوحدة ${activeUnit.unitCode} — Floor Plan` : `Unit ${activeUnit.unitCode} — Floor Plan`)
                        : (language === 'ar' ? 'المخطط المعماري لمشروع TWENTY PLUS' : 'TWENTY PLUS Floor Plan')}
                    </h2>
                    {activeUnit && (
                      <span className="px-3 py-1 rounded-full bg-[#0B4D68]/10 text-[#0B4D68] text-xs font-bold">
                        {activeUnit.unitCode} • {activeUnit.outdoorAreaSqm ? `${activeUnit.areaSqm} m² (${activeUnit.indoorAreaSqm} + ${activeUnit.outdoorAreaSqm})` : `${activeUnit.areaSqm} m²`} ({activeUnit.propertyType})
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-[#0B4D68]">
                    {activeUnit?.unitCode === 'G-43'
                      ? (language === 'ar' ? 'محل تجاري 40 م² دور أرضي • المخطط التفصيلي وأنظمة السداد المعتمدة بالياسمين فيلات' : language === 'de' ? '40 m² Ladenlokal im EG • Detaillierter Lageplan & Zahlungsplan in Al Yasmeen Villas' : '40 SQM Ground Floor Retail Shop • Official Master Plan & Payment Schedule')
                      : activeUnit?.unitCode === 'F-04'
                      ? (language === 'ar' ? 'محل تجاري 29 م² دور أول • 29 SQM First Floor Commercial Unit' : '29 SQM First Floor Commercial Unit')
                      : (language === 'ar' ? 'مبنى تجاري مستقل 720 م² مجمع (449 م² داخلي + 271 م² خارجي)' : '449 SQM Indoor • 271 SQM Outdoor (720 SQM Combined)')}
                  </p>
                </div>

                {/* Floor Plan Display Box */}
                <div className="relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-200/80 shadow-soft-md group">
                  <div className="w-full bg-slate-950 flex items-center justify-center p-2 sm:p-4">
                    <img
                      src={activeUnit?.floorPlan || (activeUnit?.unitCode === 'G-43' ? '/images/projects/twenty-plus/units/g43/twenty-plus-g43-masterplan-payment-plan.jpg' : activeUnit?.unitCode === 'F-04' ? '/images/projects/twenty-plus/unit-f04-plan.jpg' : '/images/projects/twenty-plus/unit-sb-plan.jpg')}
                      alt={`Unit ${activeUnit?.unitCode || 'G-43'} Master Plan & Payment Details TWENTY PLUS`}
                      onError={(e) => {
                        e.currentTarget.src = project.mainImage;
                      }}
                      className="w-full h-auto max-h-[750px] object-contain cursor-zoom-in group-hover:scale-[1.01] transition-transform duration-300 rounded-xl"
                      onClick={() => setActiveModalImage(activeUnit?.floorPlan || (activeUnit?.unitCode === 'G-43' ? '/images/projects/twenty-plus/units/g43/twenty-plus-g43-masterplan-payment-plan.jpg' : activeUnit?.unitCode === 'F-04' ? '/images/projects/twenty-plus/unit-f04-plan.jpg' : '/images/projects/twenty-plus/unit-sb-plan.jpg'))}
                      loading="lazy"
                    />
                  </div>

                  {/* Overlay Bottom Bar with View Full Floor Plan CTA */}
                  <div className="p-4 bg-gradient-to-r from-[#061D28] via-[#0B3042] to-[#061D28] text-white flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10">
                    <div className="flex items-center gap-2 text-xs text-slate-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="font-semibold text-white">
                        {language === 'ar'
                          ? `المخطط الهندسي المعتمد للوحدة ${activeUnit?.unitCode || 'G-43'} (${activeUnit?.areaSqm || 40} م²)`
                          : `Official Architectural Plan — Unit ${activeUnit?.unitCode || 'G-43'} (${activeUnit?.areaSqm || 40} SQM)`}
                      </span>
                    </div>

                    <button
                      onClick={() => setActiveModalImage(activeUnit?.floorPlan || (activeUnit?.unitCode === 'G-43' ? '/images/projects/twenty-plus/units/g43/twenty-plus-g43-masterplan-payment-plan.jpg' : activeUnit?.unitCode === 'F-04' ? '/images/projects/twenty-plus/unit-f04-plan.jpg' : '/images/projects/twenty-plus/unit-sb-plan.jpg'))}
                      type="button"
                      className="btn-gold py-2 px-5 text-xs font-bold flex items-center gap-2 shadow-sm"
                    >
                      <Maximize2 className="w-4 h-4" />
                      <span>{language === 'ar' ? 'عرض المخطط وتفاصيل السداد بالحجم الكامل' : language === 'de' ? 'Plan in voller Größe ansehen' : 'View Full Master Plan & Details'}</span>
                    </button>
                  </div>
                </div>

                {/* Specs Summary Below Plan */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-2 text-xs">
                  <div className="p-3.5 rounded-2xl bg-[#FAFBFD] border border-slate-200/60 space-y-1 text-center">
                    <span className="text-[11px] text-slate-400 block">{language === 'ar' ? 'المساحة الداخلية' : language === 'de' ? 'Innenfläche' : 'Indoor Area'}</span>
                    <strong className="text-base font-bold text-[#0F2432] block">{activeUnit?.indoorAreaSqm || activeUnit?.areaSqm || 40} m²</strong>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#FAFBFD] border border-slate-200/60 space-y-1 text-center">
                    <span className="text-[11px] text-slate-400 block">{language === 'ar' ? 'المساحة الخارجية' : language === 'de' ? 'Außenfläche' : 'Outdoor Area'}</span>
                    <strong className="text-base font-bold text-[#0F2432] block">{activeUnit?.outdoorAreaSqm ? `${activeUnit.outdoorAreaSqm} m²` : '—'}</strong>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#FAFBFD] border border-slate-200/60 space-y-1 text-center">
                    <span className="text-[11px] text-slate-400 block">{language === 'ar' ? 'المساحة الإجمالية' : language === 'de' ? 'Gesamtfläche' : 'Total Area'}</span>
                    <strong className="text-base font-bold text-[#0B4D68] block">{activeUnit?.areaSqm || 40} m²</strong>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#FAFBFD] border border-slate-200/60 space-y-1 text-center">
                    <span className="text-[11px] text-slate-400 block">{language === 'ar' ? 'موعد الاستلام' : language === 'de' ? 'Übergabe' : 'Delivery'}</span>
                    <strong className="text-sm font-bold text-emerald-700 block">{activeUnit?.delivery || 'December 2027'}</strong>
                  </div>
                </div>
              </section>
            )}

            {/* 8a. ARTEA PAYMENT PLAN SECTION WITH VISUAL STEP FLOW */}
            {project.slug === 'artea-mall' ? (
              <section id="payment-section" className="space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/70 shadow-soft-sm">
                <div className="space-y-2 border-b border-slate-100 pb-4">
                  <div className="eyebrow-tag bg-[#F1F7FA] text-[#0B4D68]">
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'النظام المالي المعتمد' : language === 'de' ? 'Finanzierungsplan' : 'Payment Plan'}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-semibold text-[#0F2432] tracking-tight">
                    {language === 'ar' ? `خطة سداد ARTEA — الوحدة ${activeUnit?.unitCode || 'S-18'}` : `ARTEA Payment Plan — Unit ${activeUnit?.unitCode || 'S-18'}`}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-light">
                    {language === 'ar'
                      ? `الجدول المالي المعتمد للوحدة ${activeUnit?.unitCode || 'S-18'} (${activeUnit?.propertyType || ''} بمساحة ${activeUnit?.areaSqm || 74} م²) بنظام ${activeUnit?.delivery || 'جاهز للاستلام'}.`
                      : `Authoritative financial breakdown for Unit ${activeUnit?.unitCode || 'S-18'} (${activeUnit?.areaSqm || 74} SQM ${activeUnit?.propertyType || ''}) — ${activeUnit?.delivery || 'Ready to Deliver'}.`}
                  </p>
                </div>

                {/* Elegant Breakdown Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  {/* Total Unit Price */}
                  <div className="p-5 rounded-2xl bg-[#FAFBFD] border border-slate-200/80 space-y-1.5">
                    <span className="text-[11px] text-slate-400 uppercase font-semibold tracking-wider block">
                      {language === 'ar' ? 'إجمالي سعر الوحدة' : language === 'de' ? 'Gesamtpreis' : 'Total Unit Price'}
                    </span>
                    <div className="text-xl sm:text-2xl font-semibold text-[#0B4D68]" dir="ltr">
                      EGP {activeUnit ? activeUnit.totalPriceEGP.toLocaleString() : '11,266,500'}
                    </div>
                    <span className="text-[11px] text-slate-500 block font-light">
                      {language === 'ar' ? `سعر المتر: ${activeUnit?.pricePerSqmEGP?.toLocaleString()} جنيه` : `EGP ${activeUnit?.pricePerSqmEGP?.toLocaleString()} / m²`}
                    </span>
                  </div>

                  {/* Down Payment */}
                  <div className="p-5 rounded-2xl bg-[#061D28] text-white border border-[#153648] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-[#C5A880] uppercase font-semibold tracking-wider">
                        {language === 'ar' ? 'المقدم' : language === 'de' ? 'Anzahlung' : 'Down Payment'}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#C5A880] text-[#061D28] text-[11px] font-semibold">
                        {activeUnit?.downPaymentPercent || 40}%
                      </span>
                    </div>
                    <div className="text-xl sm:text-2xl font-semibold text-white" dir="ltr">
                      EGP {activeUnit?.downPaymentEGP ? activeUnit.downPaymentEGP.toLocaleString() : '4,506,600'}
                    </div>
                    <span className="text-[11px] text-slate-300 block font-light">
                      {language === 'ar' ? 'مبلغ المقدم المطلوب' : language === 'de' ? 'Anzahlungsbetrag' : 'Down Payment Amount'}
                    </span>
                  </div>

                  {/* Installment Period */}
                  <div className="p-5 rounded-2xl bg-[#FAFBFD] border border-slate-200/80 space-y-1.5">
                    <span className="text-[11px] text-slate-400 uppercase font-semibold tracking-wider block">
                      {language === 'ar' ? 'فترة السداد' : language === 'de' ? 'Laufzeit' : 'Installment Period'}
                    </span>
                    <div className="text-xl sm:text-2xl font-semibold text-[#0F2432]">
                      {activeUnit?.installmentYears || 3} {language === 'ar' ? 'سنوات' : 'Years'}
                    </div>
                    <span className="text-[11px] text-slate-500 block font-light">
                      {language === 'ar' ? 'أقساط ربع سنوية متساوية' : 'Equal Quarterly Installments'}
                    </span>
                  </div>

                  {/* Quarterly Installment */}
                  <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-1.5">
                    <span className="text-[11px] text-emerald-800 uppercase font-semibold tracking-wider block">
                      {language === 'ar' ? 'القسط الربع سنوي' : language === 'de' ? 'Quartalsrate' : 'Quarterly Installment'}
                    </span>
                    <div className="text-xl sm:text-2xl font-semibold text-emerald-900" dir="ltr">
                      EGP {activeUnit?.quarterlyInstallmentEGP ? activeUnit.quarterlyInstallmentEGP.toLocaleString() : '563,325'}
                    </div>
                    <span className="text-[11px] text-emerald-700 block font-light">
                      {language === 'ar' ? 'لكل ربع سنة (12 قسطاً)' : language === 'de' ? 'Pro Quartal (12 Raten)' : 'Per Quarter (12 Qtrs)'}
                    </span>
                  </div>
                </div>

                {/* Clean Premium Payment Visualization Step Flow */}
                <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-[#061D28] to-[#0B3042] text-white space-y-5 border border-white/10 shadow-soft-md">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <h3 className="font-bold text-sm text-[#C5A880] flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#C5A880]" />
                      <span>{language === 'ar' ? `مخطط الدفع — الوحدة ${activeUnit?.unitCode || 'S-18'}` : `Payment Flow — Unit ${activeUnit?.unitCode || 'S-18'}`}</span>
                    </h3>
                    <span className="text-[11px] text-emerald-400 font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                      {activeUnit?.unitCode === 'S-18' || activeUnit?.delivery === '30/09/2026'
                        ? (language === 'ar' ? 'جاهز للاستلام • 30/09/2026' : language === 'de' ? 'Übergabe: 30/09/2026' : 'Ready to Deliver • 30/09/2026')
                        : (language === 'ar' ? 'استلام فوري' : language === 'de' ? 'Sofortige Übergabe' : 'Immediate Handover')}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
                    {/* Step 1 */}
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-[#C5A880] tracking-wider block">
                        STEP 1 • {language === 'ar' ? 'مقدم التعاقد (40%)' : language === 'de' ? 'Anzahlung (40%)' : 'Entry Payment (40%)'}
                      </span>
                      <div className="text-base sm:text-lg font-semibold text-white" dir="ltr">
                        EGP {activeUnit?.downPaymentEGP ? activeUnit.downPaymentEGP.toLocaleString() : '4,506,600'}
                      </div>
                      <div className="text-xs text-emerald-400 font-bold">
                        {activeUnit?.unitCode === 'S-18'
                          ? (language === 'ar' ? 'عند التعاقد (الاستلام 30/09/2026)' : 'Upon Contract (Delivery 30/09/2026)')
                          : (language === 'ar' ? 'عند التعاقد والاستلام الفوري' : 'Upon Contract & Delivery')}
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-[#C5A880] tracking-wider block">
                        STEP 2 • {language === 'ar' ? 'فترة التقسيط' : language === 'de' ? 'Laufzeit' : 'Term'}
                      </span>
                      <div className="text-base sm:text-lg font-semibold text-white">
                        {activeUnit?.installmentYears || 3} {language === 'ar' ? 'سنوات' : 'YEARS'}
                      </div>
                      <div className="text-xs text-slate-300 font-light">
                        {language === 'ar' ? '12 قسطاً ربع سنوي' : '12 Quarterly Installments'}
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-[#C5A880] tracking-wider block">
                        STEP 3 • {language === 'ar' ? 'القسط الربع سنوي' : language === 'de' ? 'Ratenhöhe' : 'Recurring Installment'}
                      </span>
                      <div className="text-base sm:text-lg font-semibold text-emerald-400" dir="ltr">
                        EGP {activeUnit?.quarterlyInstallmentEGP ? activeUnit.quarterlyInstallmentEGP.toLocaleString() : '563,325'}
                      </div>
                      <div className="text-xs text-slate-300 font-light uppercase tracking-wider">
                        {language === 'ar' ? 'لكل ربع سنة' : language === 'de' ? 'Pro Quartal' : '/ QUARTER'}
                      </div>
                    </div>
                  </div>

                  {/* Maintenance Separator Note - only when maintenance is explicitly configured */}
                  {activeUnit?.maintenancePercent ? (
                    <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-400/30 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-amber-200">
                      <div className="flex items-center gap-2">
                        <Info className="w-4 h-4 text-amber-400 flex-shrink-0" />
                        <span className="font-medium">
                          {language === 'ar' ? `وديعة الصيانة للوحدة ${activeUnit?.unitCode || ''} (${activeUnit.maintenancePercent}% تدفع بشكل منفصل):` : `Maintenance for Unit ${activeUnit?.unitCode || ''} (${activeUnit.maintenancePercent}% payable separately):`}
                        </span>
                      </div>
                      <strong className="text-white font-bold text-sm" dir="ltr">
                        {activeUnit.maintenancePercent}% — EGP {activeUnit.maintenanceEGP?.toLocaleString()}
                      </strong>
                    </div>
                  ) : null}

                  {/* Interactive Plan CTA */}
                  <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10">
                    <div className="text-xs text-slate-300">
                      <span className="font-semibold text-[#C5A880]">
                        {activeUnit?.unitCode ? `${activeUnit.unitCode} • ` : ''}
                        {activeUnit?.propertyType} ({activeUnit?.areaSqm} m²)
                      </span>
                      <span className="mx-2">•</span>
                      <span>
                        {activeUnit?.unitCode === 'S-18' || activeUnit?.delivery === '30/09/2026'
                          ? (language === 'ar' ? 'جاهز للاستلام — الاستلام 30/09/2026' : 'Ready to Deliver — 30/09/2026')
                          : (language === 'ar' ? 'استلام فوري' : 'Immediate Delivery')}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        handleSelectUnitInquiry(
                          `ARTEA Mall — Unit ${activeUnit?.unitCode || 'S-18'} (${activeUnit?.areaSqm || 74} m² ${activeUnit?.propertyType || ''})`
                        );
                      }}
                      type="button"
                      className="btn-gold py-2.5 px-6 text-xs font-bold flex items-center justify-center gap-2 w-full sm:w-auto shadow-md"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>{language === 'ar' ? 'استفسر عن هذه الوحدة' : language === 'de' ? 'Diese Einheit anfragen' : 'REQUEST THIS UNIT'}</span>
                    </button>
                  </div>
                </div>
              </section>
            ) : project.slug === 'twenty-plus' ? (
              /* 8b. TWENTY PLUS 5-OPTION PAYMENT PLANS & CASH DISCOUNT SECTION */
              <section id="payment-section" className="space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/70 shadow-soft-sm">
                <div className="space-y-2 border-b border-slate-100 pb-4">
                  <div className="eyebrow-tag bg-[#F1F7FA] text-[#0B4D68]">
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'النظام المالي المعتمد' : language === 'de' ? 'Finanzierungsplan' : 'Payment Plans'}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-semibold text-[#0F2432] tracking-tight">
                    {language === 'ar' ? `خطط سداد TWENTY PLUS — الوحدة ${activeUnit?.unitCode || 'G-43'}` : `TWENTY PLUS Payment Plans — Unit ${activeUnit?.unitCode || 'G-43'}`}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-light">
                    {language === 'ar'
                      ? `اختر خطة السداد المناسبة من بين 5 أنظمة تقسيط مرنة تمتد حتى 8 سنوات للوحدة ${activeUnit?.unitCode || 'G-43'} (${activeUnit?.propertyType || ''}).`
                      : `Choose from 5 verified flexible installment schedules extending up to 8 years for Unit ${activeUnit?.unitCode || 'G-43'} (${activeUnit?.propertyType || ''}).`}
                  </p>
                </div>

                {/* 5-Option Plan Selector Tabs */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                    {(activeUnit?.paymentPlans || project.paymentPlans || []).map((plan, idx) => (
                      <button
                        key={plan.id || idx}
                        onClick={() => setSelectedPlanTab(idx)}
                        type="button"
                        className={`p-3 rounded-2xl text-xs font-semibold transition-all border text-center ${
                          selectedPlanTab === idx
                            ? 'bg-[#061D28] text-[#C5A880] border-[#061D28] shadow-soft-sm scale-[1.02]'
                            : 'bg-[#FAFBFD] text-slate-700 border-slate-200/80 hover:bg-slate-100/80'
                        }`}
                      >
                        <div className="text-[10px] text-slate-400 block mb-0.5">
                          Option {idx + 1}
                        </div>
                        <strong className="text-sm font-bold block">
                          {plan.downPaymentPercent.split(' ')[0]} / {plan.durationYears.replace('Installments', '').trim()}
                        </strong>
                      </button>
                    ))}
                  </div>

                  {/* Active Selected Plan Feature Box */}
                  {(activeUnit?.paymentPlans || project.paymentPlans || [])[selectedPlanTab] && (
                    <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-[#061D28] to-[#0B3042] text-white space-y-5 border border-white/10 shadow-soft-md">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                        <div>
                          <span className="text-[10px] text-[#C5A880] uppercase font-bold tracking-wider block">
                            OPTION {selectedPlanTab + 1}
                          </span>
                          <h3 className="font-bold text-base text-white">
                            {(activeUnit?.paymentPlans || project.paymentPlans || [])[selectedPlanTab].name}
                          </h3>
                        </div>
                        <span className="text-[11px] text-emerald-400 font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                          {(activeUnit?.paymentPlans || project.paymentPlans || [])[selectedPlanTab].installmentsType}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 relative">
                        {/* Total Price */}
                        <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-center space-y-1">
                          <span className="text-[10px] uppercase font-bold text-[#C5A880] tracking-wider block">
                            {language === 'ar' ? 'إجمالي السعر' : language === 'de' ? 'Gesamtpreis' : 'Total Price'}
                          </span>
                          <div className="text-base font-semibold text-white" dir="ltr">
                            EGP {activeUnit ? (activeUnit.totalPriceEGP >= 1000000 ? `${(activeUnit.totalPriceEGP / 1000000).toFixed(2)}M` : activeUnit.totalPriceEGP.toLocaleString()) : '8.90M'}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Unit {activeUnit?.unitCode || 'G-43'} ({activeUnit?.areaSqm || 40} m²)
                          </div>
                        </div>

                        {/* Down Payment */}
                        <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-center space-y-1">
                          <span className="text-[10px] uppercase font-bold text-[#C5A880] tracking-wider block">
                            {language === 'ar' ? 'المقدم' : language === 'de' ? 'Anzahlung' : 'Down Payment'}
                          </span>
                          <div className="text-base font-semibold text-emerald-400" dir="ltr">
                            {(activeUnit?.paymentPlans || project.paymentPlans || [])[selectedPlanTab].downPaymentPercent.split(' ')[0]}
                          </div>
                          <div className="text-[10px] text-slate-300 font-medium">
                            {(activeUnit?.paymentPlans || project.paymentPlans || [])[selectedPlanTab].downPaymentEGP
                              ? `EGP ${((activeUnit?.paymentPlans || project.paymentPlans || [])[selectedPlanTab].downPaymentEGP! / 1000000).toFixed(3)}M`
                              : (activeUnit?.paymentPlans || project.paymentPlans || [])[selectedPlanTab].downPaymentPercent}
                          </div>
                        </div>

                        {/* Term */}
                        <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-center space-y-1">
                          <span className="text-[10px] uppercase font-bold text-[#C5A880] tracking-wider block">
                            {language === 'ar' ? 'فترة السداد' : language === 'de' ? 'Laufzeit' : 'Term'}
                          </span>
                          <div className="text-base font-semibold text-white">
                            {(activeUnit?.paymentPlans || project.paymentPlans || [])[selectedPlanTab].durationYears}
                          </div>
                          <div className="text-[10px] text-slate-300 font-light">
                            {language === 'ar' ? 'أقساط متساوية' : language === 'de' ? 'Gleichbleibend' : 'Equal Installments'}
                          </div>
                        </div>

                        {/* Quarterly Installment */}
                        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-1">
                          <span className="text-[10px] uppercase font-bold text-emerald-300 tracking-wider block">
                            {language === 'ar' ? 'القسط الربع سنوي' : language === 'de' ? 'Quartalsrate' : 'Quarterly Installment'}
                          </span>
                          <div className="text-base font-semibold text-emerald-300" dir="ltr">
                            {(activeUnit?.paymentPlans || project.paymentPlans || [])[selectedPlanTab].quarterlyInstallmentEGP
                              ? `EGP ${((activeUnit?.paymentPlans || project.paymentPlans || [])[selectedPlanTab].quarterlyInstallmentEGP! >= 1000000 ? ((activeUnit?.paymentPlans || project.paymentPlans || [])[selectedPlanTab].quarterlyInstallmentEGP! / 1000000).toFixed(4) + 'M' : (activeUnit?.paymentPlans || project.paymentPlans || [])[selectedPlanTab].quarterlyInstallmentEGP!.toLocaleString())}`
                              : 'Inquire'}
                          </div>
                          <div className="text-[10px] text-emerald-400/80 font-light">
                            {language === 'ar' ? 'لكل ربع سنة' : language === 'de' ? 'Pro Quartal' : '/ Quarter'}
                          </div>
                        </div>
                      </div>

                      {/* Maintenance Separator Note */}
                      <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-400/30 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-amber-200">
                        <div className="flex items-center gap-2">
                          <Info className="w-4 h-4 text-amber-400 flex-shrink-0" />
                          <span className="font-medium">
                            {language === 'ar' ? `وديعة الصيانة للوحدة ${activeUnit?.unitCode || ''} (10% تدفع بشكل منفصل عن سعر الوحدة):` : `Maintenance Deposit for Unit ${activeUnit?.unitCode || ''} (10% Separated from Unit Price):`}
                          </span>
                        </div>
                        <strong className="text-white font-bold text-sm" dir="ltr">
                          10% — EGP {activeUnit?.maintenanceEGP ? activeUnit.maintenanceEGP.toLocaleString() : (activeUnit ? (activeUnit.totalPriceEGP * 0.1).toLocaleString() : '890,400')}
                        </strong>
                      </div>

                      {/* Interactive Plan CTA */}
                      <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10">
                        <div className="text-xs text-slate-300">
                          <span className="font-semibold text-[#C5A880]">
                            {activeUnit?.unitCode ? `${activeUnit.unitCode} • ` : ''}
                            {activeUnit?.propertyType} ({activeUnit?.areaSqm} m²)
                          </span>
                          <span className="mx-2">•</span>
                          <span>
                            {language === 'ar' ? 'أقساط متساوية بدون فوائد' : language === 'de' ? 'Gleichbleibende Raten ohne Zinsen' : 'Equal Installments'}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            const planName = (activeUnit?.paymentPlans || project.paymentPlans || [])[selectedPlanTab]?.name || 'Selected Plan';
                            handleSelectUnitInquiry(
                              `${activeUnit?.unitCode ? activeUnit.unitCode + ' ' : ''}${activeUnit?.propertyType} (${activeUnit?.areaSqm} m²) — ${planName}`
                            );
                          }}
                          type="button"
                          className="btn-gold py-2.5 px-6 text-xs font-bold flex items-center justify-center gap-2 w-full sm:w-auto shadow-md"
                        >
                          <Calendar className="w-4 h-4" />
                          <span>{language === 'ar' ? 'استفسر عن هذه الوحدة' : language === 'de' ? 'Diese Einheit anfragen' : 'REQUEST THIS UNIT'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Cash Option Callout Card */}
                <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-amber-500/15 via-[#FAFBFD] to-amber-500/15 border-2 border-[#C5A880]/40 flex flex-col sm:flex-row items-center justify-between gap-5">
                  <div className="space-y-1.5 text-center sm:text-left rtl:sm:text-right">
                    <div className="flex items-center gap-2 justify-center sm:justify-start rtl:sm:justify-end">
                      <span className="px-2.5 py-0.5 rounded bg-[#C5A880] text-[#061D28] text-[10px] font-semibold uppercase tracking-wider">
                        CASH SPECIAL OFFER
                      </span>
                      <span className="text-xs font-bold text-amber-700">
                        {language === 'ar' ? 'عرض السداد الكاش — خصم 30%' : language === 'de' ? 'Barzahlungsangebot — 30% Rabatt' : 'Cash Discount — 30% OFF'}
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-[#0F2432]">
                      {language === 'ar' ? `خصم 30% كاش على الوحدة ${activeUnit?.unitCode || 'F-04'}` : `30% CASH DISCOUNT on Unit ${activeUnit?.unitCode || 'F-04'}`}
                    </h3>
                    <p className="text-xs text-slate-600 font-light max-w-xl">
                      {language === 'ar'
                        ? `سعر الوحدة الأصلي: ${activeUnit ? activeUnit.totalPriceEGP.toLocaleString() : '5,694,150'} جنيه • السعر بعد خصم 30% كاش: ${activeUnit ? Math.round(activeUnit.totalPriceEGP * 0.7).toLocaleString() : '3,985,905'} جنيه (وفر ${activeUnit ? Math.round(activeUnit.totalPriceEGP * 0.3).toLocaleString() : '1,708,245'} جنيه).`
                        : `Original Price: EGP ${activeUnit ? activeUnit.totalPriceEGP.toLocaleString() : '5,694,150'} • After 30% Cash Discount: EGP ${activeUnit ? Math.round(activeUnit.totalPriceEGP * 0.7).toLocaleString() : '3,985,905'} (Save EGP ${activeUnit ? Math.round(activeUnit.totalPriceEGP * 0.3).toLocaleString() : '1,708,245'}).`}
                    </p>
                  </div>

                  <a
                    href={`https://wa.me/201066330570?text=${encodeURIComponent(
                      language === 'ar'
                        ? `مرحباً Capital Pioneers، أود الاستفسار عن السعر النهائي للوحدة ${activeUnit?.unitCode || 'F-04'} بمشروع TWENTY PLUS بعد خصم الكاش 30% (${activeUnit ? Math.round(activeUnit.totalPriceEGP * 0.7).toLocaleString() : '3,985,905'} جنيه).`
                        : `Hello Capital Pioneers, I would like to inquire about the cash discounted price for TWENTY PLUS Unit ${activeUnit?.unitCode || 'F-04'} (30% Cash Discount - EGP ${activeUnit ? Math.round(activeUnit.totalPriceEGP * 0.7).toLocaleString() : '3,985,905'}).`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleWhatsAppClick}
                    className="btn-gold py-3 px-6 text-xs font-bold whitespace-nowrap shadow-soft-sm flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{language === 'ar' ? 'اسأل عن سعر الكاش' : language === 'de' ? 'Barpreis anfragen' : 'Ask About Cash Price'}</span>
                  </a>
                </div>
              </section>
            ) : project.paymentPlans && project.paymentPlans.length > 0 ? (
              /* General Payment Plans for other projects */
              <section className="space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/70 shadow-soft-sm">
                <div className="space-y-2 border-b border-slate-100 pb-4">
                  <div className="eyebrow-tag bg-[#F1F7FA] text-[#0B4D68]">
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>{t('projectDetail.financialEyebrow', 'Financial Terms')}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-semibold text-[#0F2432] tracking-tight">
                    {language === 'ar' ? 'أنظمة السداد وخطط التقسيط' : language === 'de' ? 'Zahlungspläne & Ratenoptionen' : 'Payment Plans & Installment Comparison'}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-light">
                    {language === 'ar'
                      ? 'مقدمات تبدأ من 10% وأنظمة تقسيط مرنة تمتد حتى 8 سنوات وفق الشروط التجارية للمطور.'
                      : language === 'de'
                      ? 'Anzahlungen ab 10% und Ratenlaufzeiten bis zu 8 Jahren gemäß offiziellen Entwicklerkonditionen.'
                      : 'Down payments starting from 10% and installment periods up to 8 years.'}
                  </p>
                </div>

                {/* If multiple payment plans exist, provide an interactive pill selector */}
                {project.paymentPlans.length > 1 && (
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {project.paymentPlans.map((plan, idx) => (
                        <button
                          key={plan.id || idx}
                          onClick={() => setSelectedPlanTab(idx)}
                          type="button"
                          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                            selectedPlanTab === idx
                              ? 'bg-[#0B4D68] text-white shadow-sm'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
                          }`}
                        >
                          {plan.durationYears} ({plan.downPaymentPercent.split(' ')[0]})
                        </button>
                      ))}
                    </div>

                    {/* Active Selected Plan Feature Box */}
                    {project.paymentPlans[selectedPlanTab] && (
                      <div className="p-6 rounded-2xl bg-gradient-to-br from-[#061D28] to-[#0A2738] text-white space-y-4 shadow-soft-md">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                          <h3 className="font-bold text-sm text-[#C5A880]">
                            {project.paymentPlans[selectedPlanTab].name}
                          </h3>
                          <span className="text-[11px] text-emerald-400 font-medium">
                            {project.paymentPlans[selectedPlanTab].installmentsType}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                            <span className="text-slate-400 text-[11px] block">{language === 'ar' ? 'المقدم:' : language === 'de' ? 'Anzahlung:' : 'Down Payment:'}</span>
                            <strong className="text-base font-bold text-white block">
                              {project.paymentPlans[selectedPlanTab].downPaymentPercent}
                            </strong>
                          </div>

                          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                            <span className="text-slate-400 text-[11px] block">{language === 'ar' ? 'مدة التقسيط:' : language === 'de' ? 'Laufzeit:' : 'Duration:'}</span>
                            <strong className="text-base font-bold text-[#C5A880] block">
                              {project.paymentPlans[selectedPlanTab].durationYears}
                            </strong>
                          </div>

                          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                            <span className="text-slate-400 text-[11px] block">{language === 'ar' ? 'القسط الربع سنوي:' : language === 'de' ? 'Quartalsrate:' : 'Quarterly Rate:'}</span>
                            <strong className="text-base font-bold text-emerald-400 block" dir="ltr">
                              {project.paymentPlans[selectedPlanTab].quarterlyInstallmentEGP
                                ? `EGP ${project.paymentPlans[selectedPlanTab].quarterlyInstallmentEGP?.toLocaleString()} / Qtr`
                                : project.paymentPlans[selectedPlanTab].installmentsType}
                            </strong>
                          </div>
                        </div>

                        {project.paymentPlans[selectedPlanTab].notes && (
                          <p className="text-[11px] text-slate-300 font-light italic">
                            {project.paymentPlans[selectedPlanTab].notes}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* All Plans Full Comparison Grid */}
                <div className={`grid grid-cols-1 ${project.paymentPlans.length > 2 ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2'} gap-4 pt-2`}>
                  {project.paymentPlans.map((plan, idx) => (
                    <div
                      key={plan.id || idx}
                      className={`p-5 rounded-2xl border transition-all space-y-3.5 flex flex-col justify-between ${
                        selectedPlanTab === idx
                          ? 'bg-[#F1F7FA] border-[#0B4D68]'
                          : 'bg-[#FAFBFD] border-slate-200/80 hover:border-[#0B4D68]/40'
                      }`}
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <strong className="text-xs font-bold text-[#0F2432]">{plan.name}</strong>
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-semibold">
                            {plan.durationYears}
                          </span>
                        </div>

                        <div className="space-y-1.5 text-xs text-slate-600 font-light">
                          <div className="flex justify-between items-center py-1 border-b border-slate-200/50">
                            <span className="text-slate-400">{language === 'ar' ? 'المقدم:' : language === 'de' ? 'Anzahlung:' : 'Down Payment:'}</span>
                            <strong className="text-[#0B4D68] font-bold">{plan.downPaymentPercent}</strong>
                          </div>
                          <div className="flex justify-between items-center py-1 border-b border-slate-200/50">
                            <span className="text-slate-400">{language === 'ar' ? 'فترة السداد:' : language === 'de' ? 'Laufzeit:' : 'Duration:'}</span>
                            <strong className="text-[#0F2432] font-semibold">{plan.durationYears}</strong>
                          </div>
                          <div className="flex justify-between items-center py-1">
                            <span className="text-slate-400">{language === 'ar' ? 'نوع الأقساط:' : language === 'de' ? 'Ratenart:' : 'Installment:'}</span>
                            <strong className="text-emerald-700 font-semibold text-[11px] truncate max-w-[65%]">{plan.installmentsType}</strong>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedPlanTab(idx);
                          handleViewingClick();
                        }}
                        className="btn-outline w-full py-2 text-xs font-semibold text-center"
                      >
                        {language === 'ar' ? 'اختيار هذا النظام' : language === 'de' ? 'Diesen Plan anfragen' : 'Select Plan'}
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {/* 8. PROPERTY TYPES SECTION ("Choose Your Investment Type" - Hidden on artea-mall where real unit inventory is displayed) */}
            {project.slug !== 'artea-mall' && (
              <section className="space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/70 shadow-soft-sm">
                <div className="space-y-2 border-b border-slate-100 pb-4">
                  <div className="eyebrow-tag bg-[#F1F7FA] text-[#0B4D68]">
                    <Tag className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'خيارات الاستثمار' : language === 'de' ? 'Investitionstypen' : 'Investment Types'}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-semibold text-[#0F2432] tracking-tight">
                    {language === 'ar' ? 'اختر نوع وحدتك الاستثمارية' : language === 'de' ? 'Wählen Sie Ihren Anlagentyp' : 'Choose Your Investment Type'}
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {/* Commercial */}
                  <div className="p-6 rounded-2xl bg-[#FAFBFD] border border-slate-200/80 space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="w-10 h-10 rounded-xl bg-[#0B4D68]/10 text-[#0B4D68] flex items-center justify-center">
                        <Store className="w-5 h-5" />
                      </div>
                      <h3 className="font-semibold text-base text-[#0F2432]">
                        {language === 'ar' ? 'تجاري' : language === 'de' ? 'Gewerbe' : 'Commercial'}
                      </h3>
                      <p className="text-xs text-slate-500 font-light leading-relaxed">
                        {language === 'ar'
                          ? 'مناسب للأنشطة التجارية والتجزئة والمطاعم وفق الاشتراطات والأنشطة المعتمدة في المشروع.'
                          : language === 'de'
                          ? 'Geeignet für Einzelhandel und Gastronomie gemäß den behördlichen Genehmigungen.'
                          : 'Suitable for retail, dining and business use according to project designation.'}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setPropertyTypeSelection('Commercial');
                        handleViewingClick();
                      }}
                      className="text-xs font-semibold text-[#0B4D68] hover:underline pt-2 text-left rtl:text-right flex items-center gap-1"
                    >
                      <span>{language === 'ar' ? 'طلب وحدات تجارية' : language === 'de' ? 'Gewerbe anfragen' : 'Inquire Commercial'}</span>
                      <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
                    </button>
                  </div>

                  {/* Medical */}
                  <div className="p-6 rounded-2xl bg-[#FAFBFD] border border-slate-200/80 space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="w-10 h-10 rounded-xl bg-[#0B4D68]/10 text-[#0B4D68] flex items-center justify-center">
                        <Stethoscope className="w-5 h-5" />
                      </div>
                      <h3 className="font-semibold text-base text-[#0F2432]">
                        {language === 'ar' ? 'طبي' : language === 'de' ? 'Medizin' : 'Medical'}
                      </h3>
                      <p className="text-xs text-slate-500 font-light leading-relaxed">
                        {language === 'ar'
                          ? 'مساحات مجهزة لخدمة الفرص والأنشطة الطبية والعيادات المتخصصة المصرح بها.'
                          : language === 'de'
                          ? 'Für medizinische Dienstleistungen und Praxen im Rahmen der Genehmigungen.'
                          : 'For medical-related business opportunities and private practices where permitted.'}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setPropertyTypeSelection('Medical');
                        handleViewingClick();
                      }}
                      className="text-xs font-semibold text-[#0B4D68] hover:underline pt-2 text-left rtl:text-right flex items-center gap-1"
                    >
                      <span>{language === 'ar' ? 'طلب وحدات طبية' : language === 'de' ? 'Medizin anfragen' : 'Inquire Medical'}</span>
                      <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
                    </button>
                  </div>

                  {/* Administrative */}
                  <div className="p-6 rounded-2xl bg-[#FAFBFD] border border-slate-200/80 space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="w-10 h-10 rounded-xl bg-[#0B4D68]/10 text-[#0B4D68] flex items-center justify-center">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <h3 className="font-semibold text-base text-[#0F2432]">
                        {language === 'ar' ? 'إداري' : language === 'de' ? 'Büro' : 'Administrative'}
                      </h3>
                      <p className="text-xs text-slate-500 font-light leading-relaxed">
                        {language === 'ar'
                          ? 'مساحات للاستخدام الإداري والمكاتب والشركات في موقع حيوي متكامل.'
                          : language === 'de'
                          ? 'Für administrative und bürobezogene Nutzung in erstklassiger Lage.'
                          : 'For administrative and corporate office use where permitted.'}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setPropertyTypeSelection('Administrative');
                        handleViewingClick();
                      }}
                      className="text-xs font-semibold text-[#0B4D68] hover:underline pt-2 text-left rtl:text-right flex items-center gap-1"
                    >
                      <span>{language === 'ar' ? 'طلب وحدات إدارية' : language === 'de' ? 'Büros anfragen' : 'Inquire Administrative'}</span>
                      <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>
              </section>
            )}

            {/* 9. DEVELOPER SECTION & MAINLANDS PROJECTS PORTFOLIO */}
            {project.developerPortfolioImage && (
              <section className="space-y-6 bg-gradient-to-br from-[#061D28] to-[#0A2738] text-white p-8 sm:p-10 rounded-3xl border border-white/10 shadow-soft-lg">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A880]/20 text-[#C5A880] text-xs font-semibold border border-[#C5A880]/30">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'المطور العقاري' : language === 'de' ? 'Bauträger' : 'Developer Portfolio'}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
                    {language === 'ar' ? 'من تطوير Mainlands Development' : language === 'de' ? 'Entwickelt von Mainlands Development' : 'Developed by Mainlands Development'}
                  </h2>
                  <p className="text-slate-300 text-sm font-light leading-relaxed">
                    {language === 'ar'
                      ? `يأتي مشروع ${project.name} ضمن محفظة مشروعات شركة Mainlands Development العقارية والتجارية.`
                      : language === 'de'
                      ? `${project.name} ist Teil des Immobilien- und Gewerbeportfolios von Mainlands Development.`
                      : `${project.name} is part of the commercial and real estate portfolio by Mainlands Development.`}
                  </p>
                </div>

                {/* Portfolio Visual Showcase */}
                <div className="rounded-2xl overflow-hidden border border-white/15 bg-black/40">
                  <img
                    src={project.developerPortfolioImage}
                    alt="Mainlands Development Portfolio Projects"
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Interactive / Referenced Projects List */}
                {project.developerProjectsList && (
                  <div className="pt-2 space-y-3">
                    <span className="text-xs text-[#C5A880] font-semibold uppercase tracking-wider block">
                      {language === 'ar' ? 'مشروعات المطور المرجعية:' : language === 'de' ? 'Referenzprojekte des Entwicklers:' : 'Developer Project Portfolio:'}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {project.developerProjectsList.map((p, idx) => {
                        if (p.isAvailableOnSite && p.slug) {
                          return (
                            <Link
                              key={idx}
                              to={`/projects/${p.slug}`}
                              className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-[#C5A880] hover:text-[#061D28] text-white text-xs font-semibold transition-all border border-white/20 flex items-center gap-1"
                            >
                              <span>{p.name}</span>
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          );
                        }
                        return (
                          <span
                            key={idx}
                            className="px-3 py-1.5 rounded-xl bg-white/5 text-slate-300 text-xs font-light border border-white/10"
                          >
                            {p.name}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* 10. Amenities & Project Infrastructure */}
            {project.amenities && project.amenities.length > 0 && (
              <section className="space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/70 shadow-soft-sm">
                <div className="space-y-2 border-b border-slate-100 pb-4">
                  <div className="eyebrow-tag bg-[#F1F7FA] text-[#0B4D68]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{t('projectDetail.amenitiesEyebrow', 'Project Infrastructure')}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-semibold text-[#0F2432] tracking-tight">
                    {t('projectDetail.amenitiesTitle', 'Amenities & Project Infrastructure')}
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.amenities.map((amenity, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#FAFBFD] border border-slate-200/60 text-xs text-slate-700"
                    >
                      <Check className="w-4 h-4 text-[#0B4D68] flex-shrink-0 mt-0.5" />
                      <span className="font-medium leading-relaxed">{amenity}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 11. Visual Gallery & Architectural Perspectives */}
            {project.galleryImages && project.galleryImages.length > 0 && (
              <section className="space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/70 shadow-soft-sm">
                <div className="space-y-2 border-b border-slate-100 pb-4">
                  <div className="eyebrow-tag bg-[#F1F7FA] text-[#0B4D68]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{t('projectDetail.galleryEyebrow', 'Visual Showcase')}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-semibold text-[#0F2432] tracking-tight">
                    {t('projectDetail.galleryTitle', 'Project Gallery & Perspectives')}
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveGalleryIndex(idx)}
                      className="group relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-900 border border-slate-200/60 focus:outline-none"
                    >
                      <img
                        src={img}
                        alt={`${project.name} Perspective ${idx + 1}`}
                        onError={(e) => {
                          e.currentTarget.src = project.mainImage;
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Maximize2 className="w-5 h-5 text-white" />
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* 12. Strategic Location Intelligence & Proximity */}
            <section className="space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/70 shadow-soft-sm">
              <div className="space-y-2 border-b border-slate-100 pb-4">
                <div className="eyebrow-tag bg-[#F1F7FA] text-[#0B4D68]">
                  <Compass className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'الموقع' : language === 'de' ? 'Lage' : 'Location Information'}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-semibold text-[#0F2432] tracking-tight">
                  {language === 'ar' ? 'موقع المشروع' : language === 'de' ? 'Projektlage' : 'Project Location & Access'}
                </h2>
              </div>

              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-[#FAFBFD] border border-slate-200/70 text-xs space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2 font-semibold text-sm text-[#0F2432]">
                      <MapPin className="w-4 h-4 text-[#0B4D68]" />
                      <span>{project.locationDescription || project.location}</span>
                    </div>
                    {project.googleMapsUrl ? (
                      <a
                        href={project.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-outline py-2 px-3 text-xs font-semibold flex items-center gap-1.5"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>{language === 'ar' ? 'اعرف طريقك للمشروع' : language === 'de' ? 'Wegbeschreibung' : 'Get Directions'}</span>
                      </a>
                    ) : (
                      <button
                        onClick={handleViewingClick}
                        className="btn-outline py-2 px-3 text-xs font-semibold flex items-center gap-1.5"
                      >
                        <MapPin className="w-3.5 h-3.5 text-[#C5A880]" />
                        <span>{language === 'ar' ? 'طلب تفاصيل الموقع' : language === 'de' ? 'Lagedetails anfragen' : 'Request Exact Location'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {project.nearbyLandmarks && project.nearbyLandmarks.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                      {t('projectDetail.strategicProximity', 'Strategic Proximity & Key Highlights:')}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-600 font-light">
                      {project.nearbyLandmarks.map((landmark, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#0B4D68] flex-shrink-0" />
                          <span>{landmark}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Sticky Sidebar Consultation Form (Right 4 Cols) */}
          <div className="lg:col-span-4 sticky top-28 space-y-6">
            <div className="luxury-dark-card p-6 sm:p-8 space-y-6">
              <div className="space-y-2 border-b border-white/10 pb-4">
                <span className="text-[11px] font-semibold text-[#C5A880] uppercase tracking-wider">
                  {t('projectDetail.sidebarEyebrow', 'Project Advisory Desk')}
                </span>
                <h3 className="text-xl font-semibold text-white tracking-tight">
                  {t('projectDetail.sidebarTitle', 'Inquire About This Project')}
                </h3>
                <p className="text-xs text-slate-300 font-light">
                  {t('projectDetail.sidebarDesc', 'Direct connection with Capital Pioneers real estate advisors.')}
                </p>
              </div>

              {formSubmitted ? (
                <div className="py-6 text-center space-y-4 animate-in fade-in">
                  <div className="w-12 h-12 rounded-2xl bg-[#0B4D68] text-white mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-semibold text-white">
                    {language === 'ar'
                      ? 'شكراً لتواصلك. سيتصل بك مستشار عقاري من Capital Pioneers قريباً.'
                      : language === 'de'
                      ? 'Vielen Dank. Ein Immobilienberater von Capital Pioneers wird Sie in Kürze kontaktieren.'
                      : 'Thank you. A Capital Pioneers property consultant will contact you shortly.'}
                  </h4>
                  <p className="text-xs text-slate-300 font-light">
                    {t('form.thankYouDesc', 'Our real estate consultant will contact you shortly.')}
                  </p>
                  {whatsappHandoffUrl && (
                    <a
                      href={whatsappHandoffUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-whatsapp w-full py-3 text-xs font-semibold flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4 fill-current" />
                      <span>{t('cta.openWhatsAppChat', 'Open WhatsApp Chat')}</span>
                    </a>
                  )}
                </div>
              ) : (
                <form onSubmit={handleLeadSubmit} className="space-y-3.5 text-xs">
                  <div>
                    <label className="form-label-dark">{t('form.fullName', 'Full Name *')}</label>
                    <input
                      type="text"
                      required
                      placeholder={t('form.fullNamePlaceholder', 'e.g. Dr. Ahmed Tarek')}
                      value={leadForm.fullName}
                      onFocus={() => handleInputFocus('fullName')}
                      onChange={(e) => setLeadForm({ ...leadForm, fullName: e.target.value })}
                      className="form-input-dark"
                    />
                  </div>

                  <div>
                    <label className="form-label-dark">{t('form.phoneNumber', 'Phone Number *')}</label>
                    <input
                      type="tel"
                      required
                      placeholder={t('form.phonePlaceholder', '01066330570')}
                      value={leadForm.phoneNumber}
                      onFocus={() => handleInputFocus('phoneNumber')}
                      onChange={(e) => setLeadForm({ ...leadForm, phoneNumber: e.target.value })}
                      className="form-input-dark"
                      dir="ltr"
                    />
                  </div>

                  {/* Available Units Specific Form fields */}
                  {project.availableUnitsList && project.availableUnitsList.length > 0 ? (
                    <>
                      <div>
                        <label className="form-label-dark">
                          {language === 'ar' ? 'نوع العقار المطلوب' : language === 'de' ? 'Immobilientyp' : 'Interested Property Type'}
                        </label>
                        <select
                          value={propertyTypeSelection}
                          onChange={(e) => setPropertyTypeSelection(e.target.value)}
                          className="form-input-dark"
                        >
                          <option value="Commercial">{language === 'ar' ? 'تجاري' : language === 'de' ? 'Gewerbe' : 'Commercial'}</option>
                          <option value="Medical">{language === 'ar' ? 'طبي' : language === 'de' ? 'Medizin' : 'Medical'}</option>
                          <option value="Administrative">{language === 'ar' ? 'إداري' : language === 'de' ? 'Büro' : 'Administrative'}</option>
                          <option value="Investment">{language === 'ar' ? 'استثمار عام' : language === 'de' ? 'Investition' : 'Investment'}</option>
                        </select>
                      </div>

                      <div>
                        <label className="form-label-dark">
                          {language === 'ar' ? 'الوحدة المفضلة' : language === 'de' ? 'Bevorzugte Einheit' : 'Preferred Unit'}
                        </label>
                        <select
                          value={selectedInventoryUnit}
                          onChange={(e) => setSelectedInventoryUnit(e.target.value)}
                          className="form-input-dark"
                        >
                          {project.availableUnitsList.map((unit) => (
                            <option
                              key={unit.id}
                              value={`${unit.unitCode ? unit.unitCode + ' – ' : ''}${unit.floor ? unit.floor + ' ' : ''}${unit.propertyType} – ${unit.areaSqm} m² (EGP ${unit.totalPriceEGP.toLocaleString()})`}
                            >
                              {unit.unitCode ? `${unit.unitCode} – ` : ''}{unit.propertyType} {unit.floor ? `(${unit.floor}) ` : ''}– {unit.areaSqm} m² (EGP {unit.totalPriceEGP.toLocaleString()})
                            </option>
                          ))}
                          <option value="I need another available unit">
                            {language === 'ar' ? 'أحتاج وحدة أخرى متاحة' : 'I need another available unit'}
                          </option>
                        </select>
                      </div>

                      <div>
                        <label className="form-label-dark">
                          {language === 'ar' ? 'موعد الشراء المتوقع' : language === 'de' ? 'Kaufzeitraum' : 'Purchase Timeline'}
                        </label>
                        <select
                          value={purchaseTimeline}
                          onChange={(e) => setPurchaseTimeline(e.target.value)}
                          className="form-input-dark"
                        >
                          <option value="Ready to purchase">{language === 'ar' ? 'جاهز للشراء فوراً' : language === 'de' ? 'Sofort kaufbereit' : 'Ready to purchase'}</option>
                          <option value="Within 1 month">{language === 'ar' ? 'خلال شهر' : language === 'de' ? 'Innerhalb 1 Monat' : 'Within 1 month'}</option>
                          <option value="Within 1–3 months">{language === 'ar' ? 'خلال 1–3 أشهر' : language === 'de' ? 'Innerhalb 1–3 Monate' : 'Within 1–3 months'}</option>
                          <option value="Within 3–6 months">{language === 'ar' ? 'خلال 3–6 أشهر' : language === 'de' ? 'Innerhalb 3–6 Monate' : 'Within 3–6 months'}</option>
                          <option value="Just exploring">{language === 'ar' ? 'استكشاف فقط' : language === 'de' ? 'Nur Information' : 'Just exploring'}</option>
                        </select>
                      </div>
                    </>
                  ) : project.projectType === 'Medical' ? (
                    <>
                      <div>
                        <label className="form-label-dark">
                          {language === 'ar' ? 'نوع الوحدة المطلوبة *' : language === 'de' ? 'Gewünschter Einheitstyp *' : 'Interested Unit Type *'}
                        </label>
                        <select
                          value={medicalUnitType}
                          onChange={(e) => setMedicalUnitType(e.target.value)}
                          className="form-input-dark"
                        >
                          <option value="Medical Clinic">{language === 'ar' ? 'عيادة طبية متخصصة' : language === 'de' ? 'Facharztpraxis' : 'Medical Clinic'}</option>
                          <option value="Radiology Center">{language === 'ar' ? 'مركز أشعة' : language === 'de' ? 'Radiologiezentrum' : 'Radiology Center'}</option>
                          <option value="Medical Laboratory">{language === 'ar' ? 'معمل تحاليل' : language === 'de' ? 'Medizinisches Labor' : 'Medical Laboratory'}</option>
                          <option value="Pharmacy">{language === 'ar' ? 'صيدلية' : language === 'de' ? 'Apotheke' : 'Pharmacy'}</option>
                          <option value="Investment Opportunity">{language === 'ar' ? 'فرصة استثمارية' : language === 'de' ? 'Investitionsgelegenheit' : 'Investment Opportunity'}</option>
                        </select>
                      </div>

                      <div>
                        <label className="form-label-dark">
                          {language === 'ar' ? 'المساحة المفضلة' : language === 'de' ? 'Bevorzugte Fläche' : 'Preferred Area'}
                        </label>
                        <select
                          value={preferredAreaChoice}
                          onChange={(e) => setPreferredAreaChoice(e.target.value)}
                          className="form-input-dark"
                        >
                          <option value="Starting from 33 m²">{language === 'ar' ? 'تبدأ من 33 م²' : language === 'de' ? 'Ab 33 m²' : 'Starting from 33 m²'}</option>
                          <option value="I need a larger unit">{language === 'ar' ? 'أحتاج مساحة أكبر' : language === 'de' ? 'Größere Fläche benötigt' : 'I need a larger unit'}</option>
                          <option value="Not decided yet">{language === 'ar' ? 'لم أقرر بعد' : language === 'de' ? 'Noch nicht entschieden' : 'Not decided yet'}</option>
                        </select>
                      </div>

                      <div>
                        <label className="form-label-dark">
                          {language === 'ar' ? 'موعد الشراء المتوقع' : language === 'de' ? 'Kaufzeitraum' : 'Purchase Timeline'}
                        </label>
                        <select
                          value={purchaseTimeline}
                          onChange={(e) => setPurchaseTimeline(e.target.value)}
                          className="form-input-dark"
                        >
                          <option value="Ready to purchase">{language === 'ar' ? 'جاهز للشراء فوراً' : language === 'de' ? 'Sofort kaufbereit' : 'Ready to purchase'}</option>
                          <option value="Within 1 month">{language === 'ar' ? 'خلال شهر' : language === 'de' ? 'Innerhalb 1 Monat' : 'Within 1 month'}</option>
                          <option value="Within 1–3 months">{language === 'ar' ? 'خلال 1–3 أشهر' : language === 'de' ? 'Innerhalb 1–3 Monate' : 'Within 1–3 months'}</option>
                          <option value="Within 3–6 months">{language === 'ar' ? 'خلال 3–6 أشهر' : language === 'de' ? 'Innerhalb 3–6 Monate' : 'Within 3–6 months'}</option>
                          <option value="Just exploring">{language === 'ar' ? 'استكشاف فقط' : language === 'de' ? 'Nur Information' : 'Just exploring'}</option>
                        </select>
                      </div>
                    </>
                  ) : null}

                  <div>
                    <label className="form-label-dark">{t('form.email', 'Email (Optional)')}</label>
                    <input
                      type="email"
                      placeholder={t('form.emailPlaceholder', 'name@example.com')}
                      value={leadForm.email}
                      onFocus={() => handleInputFocus('email')}
                      onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                      className="form-input-dark"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="form-label-dark">{t('form.message', 'Specific Inquiries')}</label>
                    <textarea
                      rows={2}
                      placeholder={t('form.specificInquiryPlaceholder', 'Ask about unit layouts, payment discounts, or floor availability...')}
                      value={leadForm.message}
                      onFocus={() => handleInputFocus('message')}
                      onChange={(e) => setLeadForm({ ...leadForm, message: e.target.value })}
                      className="form-input-dark resize-none"
                    />
                  </div>

                  <div className="pt-2 space-y-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-gold w-full py-3.5 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>{language === 'ar' ? 'طلب تفاصيل المشروع' : language === 'de' ? 'Projektdetails anfordern' : 'REQUEST PROJECT DETAILS'}</span>
                    </button>

                    <a
                      href={whatsappInquiryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={handleWhatsAppClick}
                      className="btn-whatsapp w-full py-3 text-xs font-semibold flex items-center justify-center gap-2 text-center"
                    >
                      <MessageCircle className="w-4 h-4 fill-current" />
                      <span>{t('cta.whatsappConsultation', 'WhatsApp Consultation')}</span>
                    </a>
                  </div>
                </form>
              )}

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 font-light">
                <span>{t('leadcta.hotline', 'Hotline:')} <a href={TEL_URL} className="text-[#C5A880] hover:underline" dir="ltr">{PRIMARY_PHONE}</a></span>
                <span>{t('form.privacyNote', 'Confidential')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 13. Explore More Capital Pioneers Projects Navigation */}
        {relatedProjects.length > 0 && (
          <section className="mt-20 pt-14 border-t border-slate-200/70 space-y-8">
            <div className="space-y-2">
              <div className="eyebrow-tag bg-[#F1F7FA] text-[#0B4D68]">
                <Building2 className="w-3.5 h-3.5" />
                <span>{t('projectDetail.similarEyebrow', 'Similar Opportunities')}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#0F2432] tracking-tight">
                {language === 'ar' ? 'استكشف المزيد من مشروعات Capital Pioneers' : language === 'de' ? 'Weitere Projekte von Capital Pioneers' : 'Explore More Capital Pioneers Projects'}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {relatedProjects.map((relProj) => (
                <ProjectCard
                  key={relProj.id}
                  project={relProj}
                  onRequestViewing={onRequestViewing}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Sticky Mobile CTA Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#061D28]/95 backdrop-blur-md border-t border-white/10 p-3 px-4 flex items-center gap-3">
        <a
          href={whatsappInquiryUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleWhatsAppClick}
          className="flex-1 py-3 bg-[#25D366] text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5"
        >
          <MessageCircle className="w-4 h-4 fill-current" />
          <span>WhatsApp</span>
        </a>
        <button
          onClick={handleViewingClick}
          className="flex-1 py-3 bg-[#C5A880] text-[#061D28] rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5"
        >
          <Calendar className="w-4 h-4" />
          <span>{language === 'ar' ? 'اطلب التفاصيل' : language === 'de' ? 'Details' : 'Request Details'}</span>
        </button>
      </div>

      {/* Lightbox Image Modal */}
      {(activeGalleryIndex !== null || activeModalImage !== null) && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => {
            setActiveGalleryIndex(null);
            setActiveModalImage(null);
          }}
        >
          <button
            onClick={() => {
              setActiveGalleryIndex(null);
              setActiveModalImage(null);
            }}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 z-10"
            aria-label={t('cta.close', 'Close')}
          >
            <X className="w-6 h-6" />
          </button>
          <div 
            className="max-w-5xl max-h-[88vh] overflow-hidden rounded-2xl p-1 bg-black/40 border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={
                activeModalImage ||
                (activeGalleryIndex !== null && project.galleryImages ? project.galleryImages[activeGalleryIndex] : '')
              }
              alt={`${project.name} Enlarged View`}
              className="w-full max-h-[85vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}

      {/* Video Player Modal */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-[#061D28] rounded-3xl overflow-hidden shadow-2xl border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 px-6 border-b border-white/10 flex items-center justify-between text-white">
              <h4 className="font-semibold text-sm truncate pr-4">{activeVideo.title}</h4>
              <button
                onClick={() => setActiveVideo(null)}
                className="p-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors flex-shrink-0"
                aria-label={t('cta.close', 'Close')}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-video bg-black">
              <video
                autoPlay
                controls
                playsInline
                className="w-full h-full object-contain"
              >
                <source src={activeVideo.src} type="video/mp4" />
                Your browser does not support HTML5 video.
              </video>
            </div>
          </div>
        </div>
      )}

      {/* Booking.com Information Modal */}
      {showBookingModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowBookingModal(false)}
        >
          <div
            className="bg-[#061D28] text-white p-6 sm:p-8 rounded-3xl border border-white/20 max-w-md w-full space-y-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowBookingModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 text-white hover:bg-white/20"
              aria-label={t('cta.close', 'Close')}
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-12 h-12 rounded-2xl bg-[#C5A880]/20 text-[#C5A880] flex items-center justify-center">
              <Hotel className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white">
              {language === 'ar' ? 'فنادق جرافيتي (Gravity Hotels)' : language === 'de' ? 'Gravity Hotels Gruppe' : 'Gravity Hotels Portfolio'}
            </h3>
            <p className="text-xs text-slate-300 font-light leading-relaxed">
              {language === 'ar'
                ? 'تمتلك مجموعة جرافيتي 4 فروع فندقية عاملة في مصر، ويمثل مارينا هيلز العين السخنة فرعها الخامس. سيتم توفير روابط التقييم والحجوزات الرسمية على منصة Booking.com فور تدشين النظام الفندقي الرسمي.'
                : language === 'de'
                ? 'Die Gravity Gruppe betreibt 4 etablierte Resorts in Ägypten. Marina Hills Ain Sokhna stellt ihren fünften Standort dar. Offizielle Buchungs- und Bewertungslinks auf Booking.com werden mit dem offiziellen Hotelstart bereitgestellt.'
                : 'The Gravity Hotel Group operates 4 established 5-star properties in Egypt. Marina Hills Ain Sokhna represents their fifth branch. Verified Booking.com ratings and reservations will be linked upon official hotel operational opening.'}
            </p>
            <button
              onClick={() => setShowBookingModal(false)}
              className="btn-gold w-full py-2.5 text-xs font-semibold"
            >
              {language === 'ar' ? 'فهمت ذلك' : language === 'de' ? 'Verstanden' : 'Understood'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetailPage;
