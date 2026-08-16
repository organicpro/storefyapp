export type MainCategory = 'Games' | 'Redes Sociais' | 'Assinaturas Digitais' | 'Infoprodutos' | 'Achados Fisicos';

export interface Product {
  id: string;
  productId?: string;
  externalId?: string;
  name: string;
  category: MainCategory;
  subcategory: string;
  supplier: string;
  brand?: string;
  model?: string;
  sku?: string;
  source?: string;
  costPrice: number;
  salePrice: number;
  originalPrice?: number;
  marginPercent?: number;
  stockQuantity?: number;
  weightKg?: number;
  rating?: number;
  ordersCount?: number;
  reviewsCount?: number;
  imageUrl: string;
  fallbackImageUrl?: string;
  images?: Array<{
    productId: string;
    externalId: string;
    imageNumber: number;
    localPath: string;
    imageUrl: string;
    sourceUrl: string;
    downloadStatus: string;
    fileSizeBytes: number;
  }>;
  variants?: Array<{
    productId: string;
    externalId: string;
    title: string;
    name: string;
    value: string;
    sku: string;
    stock: number;
    costPrice: number;
  }>;
  descriptionHtml?: string;
  descriptionText?: string;
  benefits: string[];
  deliverable: string;
  addedToStore: boolean;
  sourceUrl?: string;
  productUrl?: string;
  detailUrl?: string;
  importUrl?: string;
  allLocalImages?: string;
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
  operationNiche?: string;
  socialChannels?: Array<'instagram' | 'tiktok'>;
  profileHandle?: string;
  profileBio?: string;
  videoFormat?: 'frame' | 'caption';
  videoCta?: string;
  videoWatermarkEnabled?: boolean;
  ownerLevel?: number;
}

export interface Niche {
  id: string;
  name: string;
  icon: string;
  description: string;
  recommendedSubcategories: string[];
}

export type StoreSite = StoreConfig & { id: string };


export interface UserAccessProfile {
  userId: string;
  email: string;
  name: string;
  level: number;
  partnerCode: string | null;
  isAdmin: boolean;
}

export interface InviteCode {
  id: number | string;
  code: string;
  uses: number;
  maxUses: number;
  status: 'ativo' | 'expirado';
  createdAt: string;
  expiresAt: string | null;
  remaining: number;
}
