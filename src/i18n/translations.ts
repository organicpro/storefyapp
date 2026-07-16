export type Language = 'pt' | 'en' | 'es';

export const translations = {
  pt: {
    sidebar: {
      dashboard: 'Visão geral',
      operation: 'Loja virtual',
      promotion: 'Divulgação',
      videos: 'Vídeos automáticos',
      productsHeader: 'Produtos',
      products: 'Produtos',
      suppliers: 'Fornecedores',
      settings: 'Configurações'
    },
    header: {
      editProfile: 'Editar perfil',
      logout: 'Sair'
    }
  },
  en: {
    sidebar: {
      dashboard: 'Overview',
      operation: 'Store',
      promotion: 'Promotion',
      videos: 'Auto videos',
      productsHeader: 'Products',
      products: 'Products',
      suppliers: 'Suppliers',
      settings: 'Settings'
    },
    header: {
      editProfile: 'Edit profile',
      logout: 'Log out'
    }
  },
  es: {
    sidebar: {
      dashboard: 'Resumen',
      operation: 'Tienda',
      promotion: 'Promoción',
      videos: 'Videos automáticos',
      productsHeader: 'Productos',
      products: 'Productos',
      suppliers: 'Proveedores',
      settings: 'Ajustes'
    },
    header: {
      editProfile: 'Editar perfil',
      logout: 'Cerrar sesión'
    }
  }
};

export function getTranslation(lang: Language, keyPath: string): string {
  const keys = keyPath.split('.');
  let current: any = translations[lang] || translations.pt;
  
  for (const k of keys) {
    if (current && current[k] !== undefined) {
      current = current[k];
    } else {
      let fallback: any = translations.pt;
      for (const f of keys) {
        if (fallback && fallback[f] !== undefined) {
          fallback = fallback[f];
        } else {
          return keyPath;
        }
      }
      return fallback;
    }
  }
  
  return current as string;
}

