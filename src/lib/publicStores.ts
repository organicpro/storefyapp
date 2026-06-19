import { Product, StoreConfig } from '../types';
import { supabase } from './supabase';

export interface PublicStorePayload {
  slug: string;
  storeConfig: StoreConfig;
  products: Product[];
  updatedAt: string;
}

export async function savePublicStore(userId: string | undefined, payload: PublicStorePayload) {
  if (!supabase || !userId) return;

  await supabase
    .from('storefy_public_stores')
    .upsert({
      slug: payload.slug,
      user_id: userId,
      store_config: payload.storeConfig,
      products: payload.products,
      updated_at: payload.updatedAt
    }, { onConflict: 'slug' });
}

export async function loadPublicStore(slug: string): Promise<PublicStorePayload | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('storefy_public_stores')
    .select('slug,store_config,products,updated_at')
    .eq('slug', slug)
    .maybeSingle();

  if (error || !data) return null;

  return {
    slug: data.slug,
    storeConfig: data.store_config,
    products: Array.isArray(data.products) ? data.products : [],
    updatedAt: data.updated_at
  };
}
