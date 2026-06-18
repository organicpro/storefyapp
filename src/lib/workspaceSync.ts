import { Product, StoreConfig } from '../types';
import { supabase } from './supabase';

export interface WorkspacePayload {
  products: Product[];
  sites: Array<StoreConfig & { id: string }>;
  activeSiteId: string;
}

export async function loadWorkspace(userId: string): Promise<WorkspacePayload | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('storefy_workspaces')
    .select('products,sites,active_site_id')
    .eq('user_id', userId)
    .maybeSingle();

  if (error || !data) return null;

  return {
    products: Array.isArray(data.products) ? data.products : [],
    sites: Array.isArray(data.sites) ? data.sites : [],
    activeSiteId: data.active_site_id || ''
  };
}

export async function saveWorkspace(userId: string, payload: WorkspacePayload) {
  if (!supabase) return;

  await supabase
    .from('storefy_workspaces')
    .upsert({
      user_id: userId,
      products: payload.products,
      sites: payload.sites,
      active_site_id: payload.activeSiteId,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' });
}
