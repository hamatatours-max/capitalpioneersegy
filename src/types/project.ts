export type ProjectType = 
  | 'Commercial' 
  | 'Medical' 
  | 'Residential' 
  | 'Administrative' 
  | 'Coastal' 
  | 'Mixed-Use';

export type PropertyType = 
  | 'Specialized Clinics'
  | 'Retail Stores & F&B'
  | 'Administrative Offices'
  | 'Standalone Villas'
  | 'Townhouses & Twin Houses'
  | 'Luxury Apartments'
  | 'Beachfront Chalets'
  | 'Hotel-serviced Chalets'
  | 'Lagoon Penthouses'
  | 'Duplexes'
  | 'Hotel Duplex / Mini Villa'
  | 'Serviced Hotel Suites';

export type ProjectStatus = 
  | 'Launch Phase'
  | 'Under Construction'
  | 'Near Delivery'
  | 'Ready to Move'
  | 'Off-Plan';

export interface PaymentPlan {
  id: string;
  name: string; // e.g. "Option 1 — 6 Years Plan"
  downPaymentPercent: string; // e.g. "10%"
  downPaymentPercentNum?: number; // e.g. 10
  downPaymentEGP?: number; // e.g. 569415
  durationYears: string; // e.g. "6 Years"
  yearsNum?: number; // e.g. 4
  quarterlyInstallmentEGP?: number; // e.g. 320296
  discount?: string; // e.g. "23% Discount"
  installmentsType: string; // e.g. "Equal Installments"
  notes?: string;
}

export interface UnitConfiguration {
  id: string;
  type: string; // e.g. "Studio", "One Bedroom", "Two Bedrooms", "Duplex"
  title: string;
  areaRange: string; // e.g. "54 m²", "90 — 150 m²"
  availableAreas?: string[]; // e.g. ["90 m²", "112 m²", "130 m²", "150 m²"]
  description?: string;
  startingPrice?: string;
  badge?: string;
}

export interface PricingTier {
  id: string;
  area: string; // e.g. "112 m²"
  priceRange: string; // e.g. "EGP 9,161,152 — EGP 10,786,720"
  unitType?: string;
  notes?: string;
}

export interface AmenityGroup {
  category: string; // e.g. "Beach & Water", "Entertainment", "Wellness & Spa", "Hotel Services"
  iconName: string;
  items: string[];
}

export interface HotelOperator {
  name: string; // e.g. "Gravity Hotel"
  branch?: string; // e.g. "Fifth Branch in Egypt"
  description: string;
  services: string[];
  bookingUrl?: string; // Optional booking.com placeholder
  bookingPlaceholderText?: string;
}

export interface InvestmentInfo {
  title: string;
  subtitle: string;
  description: string;
  services: string[];
  ctaText?: string;
}

export interface DoubleViewHighlight {
  title: string;
  description: string;
  badge?: string;
  features: string[];
}

export interface Amenity {
  id: string;
  name: string;
  category: 'Infrastructure' | 'Security' | 'Leisure' | 'Business' | 'Healthcare';
  iconName?: string;
}

export interface SEOData {
  seoTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  imageAltText: string;
  index: boolean;
}

export interface ProjectVideo {
  id: string;
  title: string;
  src: string;
  poster?: string;
  description?: string;
  badge?: string;
}

export interface DevelopmentStatus {
  landDocumentation: {
    status: string;
    description: string;
  };
  licensing: {
    status: string;
    description: string;
  };
  disclaimer?: string;
}

export interface SpecializedMedicalCategory {
  id: string;
  type: string;
  nameAr: string;
  nameEn: string;
  minAreaSqm: number;
  typicalMaxAreaSqm?: number;
  pricePerSqmEGP?: number;
  pricePerSqmFromEGP?: number;
  priceDisplayEn: string;
  priceDisplayAr: string;
  isPriceOnRequest?: boolean;
  descriptionEn: string;
  descriptionAr: string;
  iconName?: string;
}

export interface MedicalEcosystemItem {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  iconName: 'radiology' | 'laboratory' | 'pharmacy' | 'clinic' | string;
  isExclusive?: boolean;
}

export interface LaunchOffer {
  discountPercent: string; // e.g. "10% Launch Discount"
  badge: string; // e.g. "Limited Launch Offer"
  terms: string; // e.g. "Subject to developer terms and current availability"
}

export interface AvailableUnit {
  id: string;
  unitCode?: string; // e.g. "G-04", "S-B", "T-01"
  propertyType: string; // e.g. "Commercial", "Standalone Commercial Building", "Office"
  suitableUses?: string[]; // e.g. ["Restaurant", "Café"]
  floor?: string | null; // e.g. "Ground Floor", null
  indoorAreaSqm?: number; // e.g. 449
  outdoorAreaSqm?: number; // e.g. 271
  areaSqm: number; // e.g. 720 (Combined)
  pricePerSqmEGP?: number;
  indoorPricePerSqmEGP?: number; // e.g. 240000
  outdoorPricePerSqmEGP?: number; // e.g. 80000
  totalPriceEGP: number; // e.g. 129440000
  downPaymentPercent?: number; // e.g. 10
  downPaymentEGP?: number; // e.g. 12944000
  installmentYears?: number; // e.g. 8
  quarterlyInstallmentEGP?: number; // e.g. 2831500
  maintenancePercent?: number; // e.g. 10
  maintenanceEGP?: number; // e.g. 12944000
  cashDiscountPercent?: number; // e.g. 30
  delivery?: string; // e.g. "December 2027", "Immediate"
  status: 'Available' | 'Reserved' | 'Sold';
  collection?: string; // e.g. "The Island Chalets", "Serviced Blu Stay"
  category?: string; // e.g. "Apartments", "Townhouses", "Villas"
  gardenAreaSqm?: number; // e.g. 195, 224
  builtUpAreaSqm?: number; // e.g. 213, 240
  floorPlan?: string;
  floorPlanSheet?: string;
  planPricing?: Record<string, number | string>;
  isStartingArea?: boolean;
  paymentPlans?: PaymentPlan[];
  whatsappMessage?: string;
  bedrooms?: number; // e.g. 1, 2, 3
  bathrooms?: number; // e.g. 1, 2
  view?: string;
  positioning?: string;
  originalPriceEGP?: number;
  discountPercent?: number;
  discountAmountEGP?: number;
  discountedPriceEGP?: number;
  campaignBadge?: string;
  installmentFrequency?: string;
  rentalOption?: string;
  floorPlanImage?: string;
  cashPriceEGP?: number;
  installmentPriceEGP?: number;
  paymentPeriodMonths?: number;
  finishing?: string;
  privateToilet?: boolean;
  airConditioning?: boolean;
  visibility?: string;
  activity?: string;
  combinedAreaSqm?: number;
  image?: string;
  masterBedrooms?: number;
  reception?: boolean;
  livingArea?: boolean;
  kitchen?: boolean;
  terrace?: boolean;
  garageShare?: boolean;
  garage?: boolean;
  garageIncluded?: boolean;
  storageShare?: boolean;
  videoUrl?: string;
  videoPoster?: string;
  plotNumber?: string;
  unitPosition?: string;
  notes?: string;
}

export interface DeveloperPortfolioProject {
  name: string;
  slug?: string;
  isAvailableOnSite?: boolean;
}

export interface Project {
  id: string;
  slug: string;
  name: string; // e.g. "Marina Hills Sokhna"
  developer: string;
  developerLogo?: string;
  developerPortfolioImage?: string;
  developerProjectsList?: DeveloperPortfolioProject[];
  mainImage: string;
  coverImage?: string;
  galleryImages: string[];
  videoUrl?: string;
  videoPoster?: string;
  videos?: ProjectVideo[];
  shortDescription: string;
  fullDescription: string;
  location: string;
  locationDescription?: string;
  locationStatusNote?: string;
  governorate: 'Cairo' | 'Red Sea' | 'Giza' | 'Matrouh' | 'Suez';
  area: string; // e.g. "Ain Sokhna", "El Banafseg, New Cairo", "New Cairo"
  latitude: number;
  longitude: number;
  googleMapsUrl: string;
  projectType: ProjectType;
  propertyTypes: PropertyType[];
  amenities: string[];
  amenityGroups?: AmenityGroup[];
  paymentPlans: PaymentPlan[];
  unitConfigurations?: UnitConfiguration[];
  availableUnitsList?: AvailableUnit[];
  pricingTiers?: PricingTier[];
  hotelOperator?: HotelOperator;
  investmentInfo?: InvestmentInfo;
  doubleViewHighlight?: DoubleViewHighlight;
  developmentStatus?: DevelopmentStatus;
  medicalEcosystem?: MedicalEcosystemItem[];
  specializedMedicalCategories?: SpecializedMedicalCategory[];
  launchOffer?: LaunchOffer;
  pricePerMeter?: string;
  originalPrice?: string;
  offerPrice?: string;
  cashDiscountPercent?: number | string;
  offerDeadline?: string;
  incentiveScheme?: string;
  isCampaignOffer?: boolean;
  keyFeatures?: string[];
  startingPrice: string;
  deliveryDate?: string | null;
  immediateDeliveryBadge?: boolean;
  hideDeliveryDate?: boolean;
  hidePaymentPlans?: boolean;
  finishingStatus?: string;
  availableUnits: string;
  projectStatus: ProjectStatus;
  featured: boolean;
  isRedSea: boolean;
  redSeaProject?: boolean;
  brochurePdf?: string;
  nearbyLandmarks: string[];
  specs: {
    totalArea?: string;
    unitAreaRange: string;
    buildingFloors?: string;
    parkingSpaces?: string;
    landAreaSqm?: string;
    groundFloorAreaSqm?: string;
    parkingCapacity?: string;
    basementsCount?: number | string;
    basementAreaSqmEach?: string;
  };
  seo: SEOData;
  badge?: string;
  whatsappMessage?: string;
}

export interface ProjectFilterState {
  searchQuery: string;
  governorate: string;
  area: string;
  projectType: string;
  propertyType: string;
  projectStatus: string;
  featuredOnly: boolean;
  redSeaOnly: boolean;
  sortBy: 'featured' | 'newest' | 'name';
}
