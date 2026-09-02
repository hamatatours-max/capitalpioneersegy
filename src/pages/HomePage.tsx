import React from 'react';
import { HeroSlider } from '@/components/home/HeroSlider';
import { Introduction } from '@/components/home/Introduction';
import { FeaturedProjects } from '@/components/home/FeaturedProjects';
import { ExploreByLocation } from '@/components/home/ExploreByLocation';
import { RedSeaSpotlight } from '@/components/home/RedSeaSpotlight';
import { ServicesSection } from '@/components/home/ServicesSection';
import { WhyUsSection } from '@/components/home/WhyUsSection';
import { ProjectMapSection } from '@/components/home/ProjectMapSection';
import { LeadGenerationCta } from '@/components/home/LeadGenerationCta';
import { ContactFormSection } from '@/components/home/ContactFormSection';
import { SEO } from '@/components/common/SEO';
import { generateOrganizationSchema, generateWebSiteSchema, generateBreadcrumbSchema } from '@/utils/schemaGenerator';

interface HomePageProps {
  onRequestViewing?: (projectName?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onRequestViewing }) => {
  const structuredSchemas = [
    generateOrganizationSchema(),
    generateWebSiteSchema(),
    generateBreadcrumbSchema([
      { name: 'Home', item: '/' }
    ]),
  ];

  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* Technical SEO Metadata & Structured Data */}
      <SEO
        title="Capital Pioneers Real Estate | Egypt Real Estate Marketing & Property Opportunities"
        description="Capital Pioneers Real Estate specializes in marketing premier medical clinics, commercial retail, luxury residential, and Red Sea coastal projects across Egypt."
        canonicalPath="/"
        ogType="website"
        schema={structuredSchemas}
      />

      {/* 1. Full-Screen Cinematic Hero Slider */}
      <HeroSlider onRequestViewing={onRequestViewing} />

      {/* 2. Corporate Introduction */}
      <Introduction />

      {/* 3. Featured Real Estate Projects (Demo Placeholders) */}
      <FeaturedProjects onRequestViewing={onRequestViewing} />

      {/* 4. Explore by Location */}
      <ExploreByLocation />

      {/* 5. Capital Pioneers Red Sea Branch Spotlight */}
      <RedSeaSpotlight onRequestViewing={onRequestViewing} />

      {/* 6. Marketing & Advisory Services */}
      <ServicesSection />

      {/* 7. Why Capital Pioneers */}
      <WhyUsSection />

      {/* 8. Strategic Project Map & Regional Hubs */}
      <ProjectMapSection onRequestViewing={onRequestViewing} />

      {/* 9. Lead Generation CTA Banner */}
      <LeadGenerationCta onRequestViewing={() => onRequestViewing && onRequestViewing()} />

      {/* 10. Contact & Viewing Form Section */}
      <ContactFormSection />
    </div>
  );
};

export default HomePage;
