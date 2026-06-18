export type MainCategory = 'Games' | 'Redes Sociais' | 'Assinaturas Digitais' | 'Infoprodutos' | 'Achados Fisicos';

export interface Product {
  id: string;
  name: string;
  category: MainCategory;
  subcategory: string;
  supplier: string;
  costPrice: number; // Preço de custo do fornecedor
  salePrice: number; // Preço de venda configurado pelo usuário para sua loja
  imageUrl: string;
  fallbackImageUrl?: string;
  benefits: string[];
  deliverable: string; // Ex: "Envio Automático", "Acesso via Link", "Gift Card Pin"
  addedToStore: boolean;
  sourceUrl?: string;
}

export interface Supplier {
  id: string;
  name: string;
  rating: number;
  deliveryRate: string; // Ex: "99.8%"
  category: string;
  productsCount: number;
  featured: boolean;
}

export interface StoreConfig {
  id?: string;
  name: string;
  whatsapp: string;
  niche: string;
  primaryColor: string; // Hex color code
  logoUrl: string;
  subdomain: string;
  welcomeMessage: string;
  instagram?: string;
  faq?: Array<{ question: string; answer: string }>;
  status?: 'draft' | 'published';
  publishedUrl?: string;
  publishedAt?: string;
  netlifyApiToken?: string;
  netlifySiteId?: string;
  downloadHtmlFallback?: boolean;
}

export interface Niche {
  id: string;
  name: string;
  icon: string;
  description: string;
  recommendedSubcategories: string[];
}
