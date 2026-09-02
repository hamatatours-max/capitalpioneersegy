import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { getFeaturedProjects } from '@/data/projectsData';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { useLanguage } from '@/context/LanguageContext';

interface FeaturedProjectsProps {
  onRequestViewing?: (projectName: string) => void;
}

export const FeaturedProjects: React.FC<FeaturedProjectsProps> = ({ onRequestViewing }) => {
  const featuredProjects = getFeaturedProjects();
  const { t, isRTL } = useLanguage();

  return (
    <section className="py-24 lg:py-32 bg-[#FAFBFD] border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="space-y-3">
            <div className="eyebrow-tag bg-[#0B4D68]/10 text-[#0B4D68]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('featured.eyebrow', 'Curated Portfolio')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#0F2432] tracking-tight">
              {t('featured.title', 'Featured Project Opportunities')}
            </h2>
            <p className="text-slate-500 text-sm max-w-2xl font-light leading-relaxed">
              {t('featured.desc', 'Explore highlighted commercial, medical, residential, and coastal developments marketed by Capital Pioneers Real Estate across New Cairo and Red Sea.')}
            </p>
          </div>

          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#0B4D68] hover:text-[#083e54] group self-start md:self-auto"
          >
            <span>{t('cta.viewAllProjects', 'View All Projects')}</span>
            <ArrowRight className={`w-4 h-4 transition-transform ${isRTL ? 'rotate-180 group-hover:-translate-x-0.5' : 'group-hover:translate-x-0.5'}`} />
          </Link>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
          {featuredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onRequestViewing={onRequestViewing}
            />
          ))}
        </div>

        {/* Scalability Notice & CTA Bar */}
        <div className="mt-14 p-6 sm:p-8 bg-white rounded-2xl border border-slate-200/70 shadow-soft-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="text-sm font-semibold text-[#0F2432]">
              {t('featured.ctaBoxTitle', 'Looking for a specific unit size or district?')}
            </div>
            <div className="text-xs text-slate-500 font-light leading-relaxed">
              {t('featured.ctaBoxDesc', 'We market specialized clinics, commercial storefronts, administrative offices, and coastal villas across Egypt.')}
            </div>
          </div>

          <Link
            to="/projects"
            className="btn-outline text-xs py-3 px-6 rounded-xl self-start sm:self-auto"
          >
            {t('featured.ctaBoxBtn', 'Filter by Location & Type')}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;
