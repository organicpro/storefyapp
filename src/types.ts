export type MainCategory = 'Games' | 'Redes Sociais' | 'Assinaturas Digitais' | 'Infoprodutos' | 'Achados Fisicos';

export interface Product {
  id: string;
  name: string;
  category: MainCategory;
  subcategory: string;
  supplier: string;
  costPrice: number;
  salePrice: number;
  imageUrl: string;
  fallbackImageUrl?: string;
  benefits: string[];
  deliverable: string;
  addedToStore: boolean;
  sourceUrl?: string;
}

export interface Supplier {
  id: string;
  name: string;
  rating: number;
  deliveryRate: string;
  category: string;
  productsCount: number;
  featured: boolean;
}

export interface StoreConfig {
  id?: string;
  name: string;
  whatsapp: string;
  niche: string;
  primaryColor: string;
  logoUrl: string;
  subdomain: string;
  welcomeMessage: string;
  instagram?: string;
  faq?: Array<{ question: string; answer: string }>;
  status?: 'draft' | 'published';
  publishedUrl?: string;
  publishedAt?: string;
  publicSlug?: string;
  netlifySiteId?: string;
  lastNetlifyDeployId?: string;
  netlifySiteName?: string;
  downloadHtmlFallback?: boolean;
  productIds?: string[];
  themePreset?: 'obsidian' | 'aurora' | 'clean' | 'market';
  heroTitle?: string;
  heroSubtitle?: string;
  ctaLabel?: string;
}

export interface Niche {
  id: string;
  name: string;
  icon: string;
  description: string;
  recommendedSubcategories: string[];
}
