import { Project } from '@/types/project';

const BASE_URL = 'https://capitalpioneers.com';

/**
 * Generates Schema.org Organization & RealEstateAgent schema for Capital Pioneers
 */
export const generateOrganizationSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    '@id': `${BASE_URL}/#organization`,
    'name': 'Capital Pioneers Real Estate',
    'alternateName': ['Capital Pioneers', 'كابيتال بايونيرز'],
    'url': BASE_URL,
    'logo': `${BASE_URL}/images/brand/capital-pioneers-logo.jpeg`,
    'image': `${BASE_URL}/images/brand/capital-pioneers-logo.jpeg`,
    'description': 'Professional real estate marketing company specializing in medical, commercial, residential, and coastal developments across Egypt.',
    'telephone': '+201066330570',
    'priceRange': '$$$$',
    'address': [
      {
        '@type': 'PostalAddress',
        'streetAddress': 'Al Shouyfat',
        'addressLocality': 'Fifth Settlement, New Cairo',
        'addressRegion': 'Cairo Governorate',
        'addressCountry': 'EG',
      },
      {
        '@type': 'PostalAddress',
        'streetAddress': 'Coastal Highway',
        'addressLocality': 'Hurghada',
        'addressRegion': 'Red Sea Governorate',
        'addressCountry': 'EG',
      },
    ],
    'areaServed': [
      {
        '@type': 'AdministrativeArea',
        'name': 'New Cairo',
      },
      {
        '@type': 'AdministrativeArea',
        'name': 'Hurghada & Red Sea',
      },
      {
        '@type': 'AdministrativeArea',
        'name': 'New Administrative Capital',
      },
      {
        '@type': 'AdministrativeArea',
        'name': 'Mostakbal City',
      },
      {
        '@type': 'Country',
        'name': 'Egypt',
      },
    ],
    'sameAs': [
      'https://wa.me/201066330570',
    ],
  };
};

/**
 * Generates WebSite Schema with Sitelinks Searchbox
 */
export const generateWebSiteSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    'url': BASE_URL,
    'name': 'Capital Pioneers Real Estate',
    'description': 'Egypt Real Estate Projects & Property Opportunities',
    'publisher': {
      '@id': `${BASE_URL}/#organization`,
    },
    'potentialAction': {
      '@type': 'SearchAction',
      'target': `${BASE_URL}/projects?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
};

/**
 * Generates BreadcrumbList Schema.org structured data
 */
export const generateBreadcrumbSchema = (breadcrumbs: { name: string; item: string }[]) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': crumb.name,
      'item': crumb.item.startsWith('http') ? crumb.item : `${BASE_URL}${crumb.item}`,
    })),
  };
};

/**
 * Generates RealEstateListing Schema for dynamic project details
 */
export const generateRealEstateListingSchema = (project: Project) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    '@id': `${BASE_URL}/projects/${project.slug}#listing`,
    'name': project.name,
    'description': project.shortDescription,
    'url': `${BASE_URL}/projects/${project.slug}`,
    'datePosted': '2026-01-01',
    'image': [
      `${BASE_URL}${project.mainImage}`,
      ...project.galleryImages.map((img) => `${BASE_URL}${img}`),
    ],
    'offers': {
      '@type': 'Offer',
      'priceCurrency': 'EGP',
      'price': project.startingPrice,
      'availability': 'https://schema.org/InStock',
      'validFrom': '2026-01-01',
      'seller': {
        '@id': `${BASE_URL}/#organization`,
      },
    },
    'about': {
      '@type': 'Place',
      'name': project.name,
      'description': project.fullDescription,
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': project.area,
        'addressLocality': project.governorate,
        'addressRegion': project.governorate,
        'addressCountry': 'EG',
      },
      'geo': {
        '@type': 'GeoCoordinates',
        'latitude': project.latitude,
        'longitude': project.longitude,
      },
      'amenityFeature': project.amenities.map((amenity) => ({
        '@type': 'LocationFeatureSpecification',
        'name': amenity,
        'value': 'true',
      })),
    },
  };
};
