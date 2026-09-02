import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, MessageCircle, ArrowRight, Calendar } from 'lucide-react';
import { Project } from '@/types/project';
import { useLanguage } from '@/context/LanguageContext';
import { getLocalizedProject } from '@/i18n/projectTranslations';
import { trackClickWhatsApp, trackRequestViewing } from '@/services/analyticsService';

interface ProjectCardProps {
  project: Project;
  onRequestViewing?: (projectName: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project: rawProject, onRequestViewing }) => {
  const { t, isRTL, language } = useLanguage();
  const project = getLocalizedProject(rawProject, language);

  const whatsappMessage = encodeURIComponent(
    `Hello Capital Pioneers Real Estate, I am interested in inquiring about ${project.name} (${project.location}). Please provide the brochure and payment schedule.`
  );
  const whatsappUrl = `https://wa.me/201066330570?text=${whatsappMessage}`;

  const handleViewingClick = () => {
    trackRequestViewing('project_card', project.name);
    if (onRequestViewing) onRequestViewing(project.name);
  };

  const handleWhatsAppClick = () => {
    trackClickWhatsApp('project_card', project.name);
  };

  const fallbackImage = '/images/brand/capital-pioneers-logo.jpeg';
  const resolvedCover = project.coverImage || project.mainImage || project.videoPoster || fallbackImage;
  const [imgSrc, setImgSrc] = React.useState<string>(resolvedCover);

  React.useEffect(() => {
    setImgSrc(project.coverImage || project.mainImage || project.videoPoster || fallbackImage);
  }, [project.coverImage, project.mainImage, project.videoPoster]);

  const handleImageError = () => {
    if (project.videoPoster && imgSrc !== project.videoPoster) {
      setImgSrc(project.videoPoster);
    } else if (project.galleryImages && project.galleryImages.length > 0 && imgSrc !== project.galleryImages[0]) {
      setImgSrc(project.galleryImages[0]);
    } else if (imgSrc !== fallbackImage) {
      setImgSrc(fallbackImage);
    }
  };

  return (
    <article className="luxury-card flex flex-col justify-between group overflow-hidden bg-white">
      {/* Top Image Container (Dominant visual with soft corners & subtle 1.03 hover scale) */}
      <div className="relative aspect-[16/10] bg-[#061D28] overflow-hidden rounded-t-2xl">
        <Link to={`/projects/${project.slug}`} className="block w-full h-full">
          <img
            src={imgSrc}
            alt={project.seo.imageAltText || project.name}
            onError={handleImageError}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
            loading="lazy"
          />
        </Link>

        {/* Soft Cinematic Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 pointer-events-none" />

        {/* Badges (Top Left / Right in RTL) */}
        <div className="absolute top-3.5 left-3.5 rtl:left-auto rtl:right-3.5 flex flex-wrap gap-1.5 z-10 pointer-events-none">
          <span className="bg-[#0B4D68]/90 backdrop-blur-sm text-white text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm">
            {project.projectType}
          </span>
          <span className="bg-black/50 backdrop-blur-md text-slate-200 text-[10px] font-medium px-2 py-0.5 rounded-md border border-white/10">
            {project.projectStatus}
          </span>
        </div>

        {/* Spotlight / Red Sea Badge */}
        <div className="absolute top-3.5 right-3.5 rtl:right-auto rtl:left-3.5 z-10 pointer-events-none">
          {project.isRedSea ? (
            <span className="bg-[#C5A880] text-[#061D28] text-[10px] font-semibold tracking-wide px-2.5 py-1 rounded-md shadow-sm">
              {language === 'ar' ? 'فرع البحر الأحمر' : language === 'de' ? 'Rotes Meer' : 'Red Sea Branch'}
            </span>
          ) : project.featured ? (
            <span className="bg-white/95 backdrop-blur-md text-[#0F2432] text-[10px] font-semibold tracking-wide px-2.5 py-1 rounded-md shadow-sm">
              {language === 'ar' ? 'مميز' : language === 'de' ? 'Hervorgehoben' : 'Featured'}
            </span>
          ) : null}
        </div>

        {/* Bottom Image Area Spec */}
        <div className="absolute bottom-3 left-3.5 right-3.5 z-10 pointer-events-none flex items-center justify-between text-white text-xs">
          <span className="font-medium drop-shadow-sm truncate max-w-[70%]">
            {project.specs.unitAreaRange}
          </span>
          {!project.hideDeliveryDate && project.deliveryDate ? (
            <span className="text-[11px] text-[#C5A880] font-semibold drop-shadow-sm">
              {project.deliveryDate}
            </span>
          ) : (
            <span className="text-[11px] text-emerald-300 font-semibold drop-shadow-sm">
              {project.badge || project.projectStatus}
            </span>
          )}
        </div>
      </div>

      {/* Content Container */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          {/* Location Line */}
          <div className="flex items-center justify-between text-xs text-slate-500 gap-2">
            <div className="flex items-center gap-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-[#0B4D68] flex-shrink-0" />
              <span className="truncate font-normal">{project.area}</span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium truncate">
              {project.governorate}
            </span>
          </div>

          {/* Project Title (Soft, elegant font weight) */}
          <h3 className="text-base font-semibold text-[#0F2432] group-hover:text-[#0B4D68] transition-colors line-clamp-2 leading-snug">
            <Link to={`/projects/${project.slug}`}>
              {project.name}
            </Link>
          </h3>

          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-light">
            {project.shortDescription}
          </p>

          {/* Property Types Pills */}
          <div className="flex flex-wrap gap-1 pt-1">
            {project.propertyTypes.slice(0, 3).map((pt, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 bg-[#F1F7FA] text-[#0B4D68] text-[10px] font-medium rounded-md border border-[#0B4D68]/10"
              >
                {pt}
              </span>
            ))}
          </div>
        </div>

        {/* Specs Table Strip */}
        <div className="bg-[#FAFBFD] p-3 rounded-xl border border-slate-200/60 text-xs space-y-1">
          {project.originalPrice && project.offerPrice ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-slate-400 line-through">
                  {project.originalPrice}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-bold">
                  {project.cashDiscountPercent ? `${project.cashDiscountPercent}% OFF` : 'OFFER'}
                </span>
              </div>
              <span className="font-semibold text-[#0B4D68] text-sm" dir="ltr">
                {project.offerPrice}
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-normal">
                {project.paymentPlans && project.paymentPlans.length > 0
                  ? t('projectDetail.paymentTerms', 'Payment Terms:')
                  : (language === 'ar' ? 'حالة التوافر:' : language === 'de' ? 'Verfügbarkeit:' : 'Availability:')}
              </span>
              <span className="font-semibold text-[#0B4D68] text-[11px] truncate max-w-[60%]">
                {project.paymentPlans && project.paymentPlans.length > 0
                  ? `${project.paymentPlans[0]?.downPaymentPercent || '10%'} / ${project.paymentPlans[0]?.durationYears || 'Installments'}`
                  : (language === 'ar' ? 'وحدات مختارة متاحة' : language === 'de' ? 'Aktive Einheiten' : 'Selected Active Units')}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center gap-2">
          {/* View Details Link */}
          <Link
            to={`/projects/${project.slug}`}
            className="btn-outline flex-1 py-2.5 text-xs font-semibold text-center flex items-center justify-center gap-1.5 rounded-xl"
          >
            <span>{t('projects.exploreBtn', 'Explore')}</span>
            <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
          </Link>

          {/* Request Viewing */}
          <button
            onClick={handleViewingClick}
            type="button"
            className="btn-primary py-2.5 px-3.5 text-xs font-semibold rounded-xl"
            title={t('projects.viewingBtn', 'Request a Viewing')}
            aria-label={`Request a Viewing for ${project.name}`}
          >
            <Calendar className="w-3.5 h-3.5" />
          </button>

          {/* Direct WhatsApp CTA */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleWhatsAppClick}
            className="p-2.5 bg-[#25D366] text-white hover:bg-[#20ba5a] transition-colors rounded-xl flex items-center justify-center shadow-sm"
            title="WhatsApp Inquiry"
            aria-label={`Inquire about ${project.name} on WhatsApp`}
          >
            <MessageCircle className="w-4 h-4 fill-current" />
          </a>
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
