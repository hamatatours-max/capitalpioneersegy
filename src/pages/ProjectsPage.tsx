import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Building2, 
  Search, 
  Sparkles, 
  MapPin, 
  X, 
  Layers
} from 'lucide-react';
import { filterProjects, getFilterOptions } from '@/data/projectsData';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { ProjectFilterState } from '@/types/project';
import { SEO } from '@/components/common/SEO';
import { useLanguage } from '@/context/LanguageContext';
import { generateBreadcrumbSchema } from '@/utils/schemaGenerator';

interface ProjectsPageProps {
  onRequestViewing?: (projectName?: string) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ onRequestViewing }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t, language } = useLanguage();
  const initialLocation = searchParams.get('location') || 'All';
  const initialCategory = searchParams.get('category') || 'All';
  const initialRedSea = searchParams.get('redSea') === 'true';

  const [filters, setFilters] = useState<ProjectFilterState>({
    searchQuery: searchParams.get('q') || '',
    governorate: 'All',
    area: initialLocation,
    projectType: initialCategory,
    propertyType: 'All',
    projectStatus: 'All',
    featuredOnly: false,
    redSeaOnly: initialRedSea,
    sortBy: 'featured',
  });

  const filterOptions = useMemo(() => getFilterOptions(), []);

  const filteredProjects = useMemo(() => {
    return filterProjects(filters);
  }, [filters]);

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      governorate: 'All',
      area: 'All',
      projectType: 'All',
      propertyType: 'All',
      projectStatus: 'All',
      featuredOnly: false,
      redSeaOnly: false,
      sortBy: 'featured',
    });
    setSearchParams({});
  };

  const hasActiveFilters =
    filters.searchQuery !== '' ||
    filters.governorate !== 'All' ||
    filters.area !== 'All' ||
    filters.projectType !== 'All' ||
    filters.propertyType !== 'All' ||
    filters.projectStatus !== 'All' ||
    filters.featuredOnly ||
    filters.redSeaOnly;

  // Category Tab Labels
  const categoryTabs = [
    { key: 'All', label: language === 'ar' ? 'الكل' : language === 'de' ? 'Alle' : 'All' },
    { key: 'Medical', label: language === 'ar' ? 'طبي' : language === 'de' ? 'Medizin' : 'Medical' },
    { key: 'Commercial', label: language === 'ar' ? 'تجاري' : language === 'de' ? 'Gewerbe' : 'Commercial' },
    { key: 'Coastal', label: language === 'ar' ? 'ساحلي' : language === 'de' ? 'Küste' : 'Coastal' },
    { key: 'Administrative', label: language === 'ar' ? 'إداري' : language === 'de' ? 'Büro' : 'Administrative' },
    { key: 'Residential', label: language === 'ar' ? 'سكني' : language === 'de' ? 'Wohnen' : 'Residential' },
  ];

  const dynamicSeoTitle = `${t('projects.title', 'Real Estate Projects & Developments')} | Capital Pioneers`;
  const dynamicSeoDesc = t('projects.desc', 'Explore verified medical, commercial, residential, and coastal developments marketed by Capital Pioneers Real Estate.');

  const breadcrumbsSchema = generateBreadcrumbSchema([
    { name: t('nav.home', 'Home'), item: '/' },
    { name: t('nav.projects', 'Projects'), item: '/projects' },
  ]);

  return (
    <div className="min-h-screen bg-[#FAFBFD]">
      {/* Technical SEO */}
      <SEO
        title={dynamicSeoTitle}
        description={dynamicSeoDesc}
        canonicalPath="/projects"
        schema={breadcrumbsSchema}
      />

      {/* Page Header */}
      <header className="bg-[#061D28] text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-[#153648]">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="eyebrow-tag bg-[#0B4D68]/60 border border-white/10 text-[#C5A880]">
            <Building2 className="w-3.5 h-3.5" />
            <span>{t('projects.eyebrow', 'Development Portfolio')}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white leading-tight">
            {t('projects.title', 'Real Estate Projects & Developments')}
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-3xl font-light leading-relaxed">
            {t('projects.desc', 'Explore verified medical, commercial, residential, and coastal developments marketed by Capital Pioneers Real Estate.')}
          </p>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top Control Bar: Search & Category Filter Pills */}
        <div className="bg-white rounded-3xl border border-slate-200/70 p-6 sm:p-8 shadow-soft-sm space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-lg">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={t('projects.searchPlaceholder', 'Search by project name, developer, or area...')}
                value={filters.searchQuery}
                onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                className="form-input pl-11 rtl:pr-11 rtl:pl-4"
              />
              {filters.searchQuery && (
                <button
                  onClick={() => setFilters({ ...filters, searchQuery: '' })}
                  className="absolute right-3.5 rtl:right-auto rtl:left-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Category Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              {categoryTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilters({ ...filters, projectType: tab.key })}
                  className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all duration-200 ${
                    filters.projectType === tab.key
                      ? 'bg-[#0B4D68] text-white shadow-sm'
                      : 'bg-[#FAFBFD] text-slate-700 hover:bg-slate-100 border border-slate-200/70'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Deep Filter Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-100 text-xs">
            {/* Location / Area Filter */}
            <div>
              <label className="form-label flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#0B4D68]" /> {t('projects.filterLocation', 'Location / Area')}
              </label>
              <select
                value={filters.area}
                onChange={(e) => setFilters({ ...filters, area: e.target.value })}
                className="form-input text-xs py-2.5"
              >
                {filterOptions.areas.map((ar) => (
                  <option key={ar} value={ar}>
                    {ar === 'All' ? (language === 'ar' ? 'جميع المناطق' : language === 'de' ? 'Alle Regionen' : 'All') : ar}
                  </option>
                ))}
              </select>
            </div>

            {/* Property Unit Type Filter */}
            <div>
              <label className="form-label flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#0B4D68]" /> {t('projects.filterUnitType', 'Property Unit Type')}
              </label>
              <select
                value={filters.propertyType}
                onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}
                className="form-input text-xs py-2.5"
              >
                {filterOptions.propertyTypes.map((pt) => (
                  <option key={pt} value={pt}>
                    {pt === 'All' ? (language === 'ar' ? 'جميع أنواع الوحدات' : language === 'de' ? 'Alle Einheitentypen' : 'All') : pt}
                  </option>
                ))}
              </select>
            </div>

            {/* Project Status Filter */}
            <div>
              <label className="form-label flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#0B4D68]" /> {t('projects.filterStatus', 'Project Status')}
              </label>
              <select
                value={filters.projectStatus}
                onChange={(e) => setFilters({ ...filters, projectStatus: e.target.value })}
                className="form-input text-xs py-2.5"
              >
                {filterOptions.projectStatuses.map((st) => (
                  <option key={st} value={st}>
                    {st === 'All' ? (language === 'ar' ? 'جميع الحالات' : language === 'de' ? 'Alle Status' : 'All') : st}
                  </option>
                ))}
              </select>
            </div>

            {/* Red Sea / Featured Checkboxes */}
            <div className="flex flex-col justify-end space-y-2 pt-2">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.redSeaOnly}
                  onChange={(e) => setFilters({ ...filters, redSeaOnly: e.target.checked })}
                  className="rounded text-[#0B4D68] focus:ring-[#0B4D68]"
                />
                <span>{t('projects.redSeaOnly', 'Red Sea Projects Only')}</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.featuredOnly}
                  onChange={(e) => setFilters({ ...filters, featuredOnly: e.target.checked })}
                  className="rounded text-[#0B4D68] focus:ring-[#0B4D68]"
                />
                <span>{t('projects.featuredOnly', 'Featured Projects Only')}</span>
              </label>
            </div>
          </div>

          {/* Active Filter Chips & Reset All */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100 text-xs">
              <span className="text-slate-400 font-medium text-[11px]">{t('projects.activeFilters', 'Active Filters:')}</span>

              {filters.searchQuery && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs border border-slate-200">
                  {t('projects.searchFilter', 'Search:')} "{filters.searchQuery}"
                  <button onClick={() => setFilters({ ...filters, searchQuery: '' })}>
                    <X className="w-3 h-3 text-slate-400 hover:text-slate-600" />
                  </button>
                </span>
              )}

              {filters.area !== 'All' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs border border-slate-200">
                  {t('projects.areaFilter', 'Area:')} {filters.area}
                  <button onClick={() => setFilters({ ...filters, area: 'All' })}>
                    <X className="w-3 h-3 text-slate-400 hover:text-slate-600" />
                  </button>
                </span>
              )}

              {filters.projectType !== 'All' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs border border-slate-200">
                  {t('projects.typeFilter', 'Type:')} {filters.projectType}
                  <button onClick={() => setFilters({ ...filters, projectType: 'All' })}>
                    <X className="w-3 h-3 text-slate-400 hover:text-slate-600" />
                  </button>
                </span>
              )}

              {filters.redSeaOnly && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A880]/20 text-[#061D28] text-xs border border-[#C5A880]/40 font-medium">
                  {t('projects.redSeaFilterBadge', 'Red Sea Only')}
                  <button onClick={() => setFilters({ ...filters, redSeaOnly: false })}>
                    <X className="w-3 h-3 text-slate-600" />
                  </button>
                </span>
              )}

              <button
                onClick={handleResetFilters}
                className="text-xs font-semibold text-red-600 hover:underline ml-2"
              >
                {t('cta.resetFilters', 'Reset All')}
              </button>
            </div>
          )}
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between py-6">
          <div className="text-xs text-slate-500 font-light">
            {t('projects.showing', 'Showing')} <strong className="font-semibold text-slate-800">{filteredProjects.length}</strong> {t('projects.opportunities', 'real estate development opportunities')}
          </div>
        </div>

        {/* Project Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onRequestViewing={onRequestViewing}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200/70 p-12 text-center space-y-4 shadow-soft-sm">
            <Building2 className="w-14 h-14 text-slate-300 mx-auto" />
            <h3 className="text-lg font-semibold text-[#0F2432]">
              {t('projects.noResultsTitle', 'No Projects Matched Your Search Criteria')}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto font-light leading-relaxed">
              {t('projects.noResultsDesc', 'Try adjusting your location, sector type, or resetting active filters.')}
            </p>
            <button
              onClick={handleResetFilters}
              className="btn-primary py-2.5 px-6 text-xs font-semibold mt-2"
            >
              {t('cta.resetFilters', 'Reset All Filters')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
