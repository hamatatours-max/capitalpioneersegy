import React, { useEffect } from 'react';

export interface SEOProps {
  title: string;
  description: string;
  canonicalPath?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'place';
  noIndex?: boolean;
  schema?: Record<string, any> | Record<string, any>[];
}

const BASE_URL = 'https://capitalpioneers.com';
const DEFAULT_OG_IMAGE = `${BASE_URL}/images/brand/capital-pioneers-logo.jpeg`;
const SITE_NAME = 'Capital Pioneers Real Estate';

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  canonicalPath = '',
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  noIndex = false,
  schema,
}) => {
  useEffect(() => {
    // 1. Set Document Title
    const formattedTitle = title.includes('Capital Pioneers') 
      ? title 
      : `${title} | ${SITE_NAME}`;
    document.title = formattedTitle;

    // Helper to set or create meta tag
    const setMetaTag = (attrName: string, attrVal: string, content: string) => {
      let element = document.querySelector(`meta[${attrName}="${attrVal}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrVal);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 2. Set Meta Description & Robots
    setMetaTag('name', 'description', description);
    setMetaTag('name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
    setMetaTag('name', 'author', SITE_NAME);

    // 3. Set Canonical URL
    const canonicalUrl = canonicalPath.startsWith('http') 
      ? canonicalPath 
      : `${BASE_URL}${canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`}`;

    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // 4. Open Graph Meta Tags
    const fullOgImage = ogImage.startsWith('http') ? ogImage : `${BASE_URL}${ogImage}`;
    setMetaTag('property', 'og:title', formattedTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:site_name', SITE_NAME);
    setMetaTag('property', 'og:image', fullOgImage);
    setMetaTag('property', 'og:image:alt', title);
    setMetaTag('property', 'og:locale', 'en_US');

    // 5. Twitter Card Meta Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', formattedTitle);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', fullOgImage);

    // 6. Schema.org JSON-LD Structured Data Injection
    const scriptId = 'cp-schema-jsonld';
    let schemaScript = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (schema) {
      if (!schemaScript) {
        schemaScript = document.createElement('script');
        schemaScript.id = scriptId;
        schemaScript.type = 'application/ld+json';
        document.head.appendChild(schemaScript);
      }
      schemaScript.text = JSON.stringify(Array.isArray(schema) ? schema : [schema]);
    } else if (schemaScript) {
      document.head.removeChild(schemaScript);
    }

    return () => {
      // Cleanup on unmount if needed
    };
  }, [title, description, canonicalPath, ogImage, ogType, noIndex, schema]);

  return null;
};

export default SEO;
