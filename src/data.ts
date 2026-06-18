import { Product, Supplier, Niche, StoreConfig } from './types';

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    "id": "gamemarket",
    "name": "GameMarket",
    "rating": 4.8,
    "deliveryRate": "98.7%",
    "category": "Games, Redes Sociais, Assinaturas Digitais",
    "productsCount": 157,
    "featured": true
  },
  {
    "id": "storefy-curadoria",
    "name": "Storefy Curadoria",
    "rating": 4.9,
    "deliveryRate": "100%",
    "category": "Infoprodutos",
    "productsCount": 8,
    "featured": true
  },
  {
    "id": "supplier-achados-fisicos",
    "name": "Curadoria Achados Fisicos",
    "rating": 4.8,
    "deliveryRate": "97.5%",
    "category": "Achados Fisicos",
    "productsCount": 79,
    "featured": true
  }
];

export const NICHES: Niche[] = [
  {
    "id": "games",
    "name": "Gamer & Esports",
    "icon": "Gamepad2",
    "description": "Produtos digitais para jogos, contas, itens, keys, moedas, skins e servicos gamer.",
    "recommendedSubcategories": [
      "eFootball",
      "Steam",
      "Call of Duty",
      "Free Fire",
      "Roblox",
      "League of Legends",
      "Valorant",
      "Minecraft"
    ]
  },
  {
    "id": "redes-sociais",
    "name": "Redes Sociais",
    "icon": "Megaphone",
    "description": "Servicos de redes sociais, seguidores, inscritos e engajamento para perfis digitais.",
    "recommendedSubcategories": [
      "Instagram",
      "TikTok",
      "Redes Sociais",
      "YouTube",
      "Discord"
    ]
  },
  {
    "id": "assinaturas-digitais",
    "name": "Assinaturas Digitais",
    "icon": "Tv",
    "description": "Produtos de streaming, assinaturas de IA, ferramentas digitais e acessos recorrentes.",
    "recommendedSubcategories": [
      "Disney+",
      "Spotify",
      "Crunchyroll",
      "HBO Max",
      "Prime Video",
      "Paramount+",
      "YouTube Premium",
      "Netflix",
      "ChatGPT",
      "Gemini",
      "Gemini + Veo",
      "Grok",
      "Gemini Business",
      "Combo IA + Ferramentas"
    ]
  },
  {
    "id": "infoprodutos",
    "name": "Infoprodutos",
    "icon": "BookOpen",
    "description": "Ebooks, templates, checklists, playbooks e materiais digitais prontos para vender.",
    "recommendedSubcategories": [
      "Emagrecimento",
      "Evolucao Pessoal",
      "Financas Pessoais",
      "Renda Extra",
      "Produtividade",
      "Relacionamentos"
    ]
  },
  {
    "id": "physical-finds",
    "name": "Achados Fisicos",
    "icon": "ShoppingBag",
    "description": "Produtos fisicos baratos e chamativos para vender por WhatsApp sem estoque proprio.",
    "recommendedSubcategories": [
      "Eletronicos e Acessorios",
      "Audio e Gadgets",
      "Moda e Fitness",
      "Informática",
      "Casa e Utilidades",
      "Moda e Acessórios",
      "Brinquedos e Colecionáveis",
      "Beleza e Cuidados"
    ]
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    "id": "gm-01-conta-efootball-forca-3069",
    "name": "Conta efootball força 3069",
    "category": "Games",
    "subcategory": "eFootball",
    "supplier": "GameMarket",
    "costPrice": 15,
    "salePrice": 24.75,
    "imageUrl": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22520%22%20viewBox%3D%220%200%20800%20520%22%20data-storefy-brand-cover%3D%221%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20stop-color%3D%22%23061020%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23034ea2%22%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%22s%22%3E%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2222%22%20stdDeviation%3D%2222%22%20flood-color%3D%22%23000%22%20flood-opacity%3D%22.45%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%22520%22%20rx%3D%2236%22%20fill%3D%22url(%23g)%22%2F%3E%3Ccircle%20cx%3D%22665%22%20cy%3D%2278%22%20r%3D%22158%22%20fill%3D%22%23fff%22%20opacity%3D%22.08%22%2F%3E%3Ccircle%20cx%3D%22118%22%20cy%3D%22430%22%20r%3D%22190%22%20fill%3D%22%23fff%22%20opacity%3D%22.06%22%2F%3E%3Crect%20x%3D%2256%22%20y%3D%2256%22%20width%3D%22688%22%20height%3D%22408%22%20rx%3D%2230%22%20fill%3D%22%23000%22%20opacity%3D%22.18%22%20stroke%3D%22%23fff%22%20stroke-opacity%3D%22.14%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22255%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22900%22%20fill%3D%22%23fef200%22%20filter%3D%22url(%23s)%22%3EeFootball%3C%2Ftext%3E%3Crect%20x%3D%22240%22%20y%3D%22330%22%20width%3D%22320%22%20height%3D%227%22%20rx%3D%223.5%22%20fill%3D%22%23fef200%22%20opacity%3D%22.9%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22386%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22800%22%20letter-spacing%3D%225%22%20fill%3D%22%23fff%22%20opacity%3D%22.72%22%3ESTOREFY%20OFERTA%20DIGITAL%3C%2Ftext%3E%3C%2Fsvg%3E",
    "benefits": [
      "Base: R$ 15,00",
      "Valor de venda editavel",
      "Subcategoria eFootball"
    ],
    "deliverable": "Referencia fornecedor - Conta efootball força 3069",
    "addedToStore": false
  },
  {
    "id": "gm-02-conta-efootball-com-musiala-105",
    "name": "CONTA EFOOTBALL COM MUSIALA 105",
    "category": "Games",
    "subcategory": "eFootball",
    "supplier": "GameMarket",
    "costPrice": 20,
    "salePrice": 33,
    "imageUrl": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22520%22%20viewBox%3D%220%200%20800%20520%22%20data-storefy-brand-cover%3D%221%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20stop-color%3D%22%23061020%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23034ea2%22%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%22s%22%3E%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2222%22%20stdDeviation%3D%2222%22%20flood-color%3D%22%23000%22%20flood-opacity%3D%22.45%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%22520%22%20rx%3D%2236%22%20fill%3D%22url(%23g)%22%2F%3E%3Ccircle%20cx%3D%22665%22%20cy%3D%2278%22%20r%3D%22158%22%20fill%3D%22%23fff%22%20opacity%3D%22.08%22%2F%3E%3Ccircle%20cx%3D%22118%22%20cy%3D%22430%22%20r%3D%22190%22%20fill%3D%22%23fff%22%20opacity%3D%22.06%22%2F%3E%3Crect%20x%3D%2256%22%20y%3D%2256%22%20width%3D%22688%22%20height%3D%22408%22%20rx%3D%2230%22%20fill%3D%22%23000%22%20opacity%3D%22.18%22%20stroke%3D%22%23fff%22%20stroke-opacity%3D%22.14%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22255%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22900%22%20fill%3D%22%23fef200%22%20filter%3D%22url(%23s)%22%3EeFootball%3C%2Ftext%3E%3Crect%20x%3D%22240%22%20y%3D%22330%22%20width%3D%22320%22%20height%3D%227%22%20rx%3D%223.5%22%20fill%3D%22%23fef200%22%20opacity%3D%22.9%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22386%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22800%22%20letter-spacing%3D%225%22%20fill%3D%22%23fff%22%20opacity%3D%22.72%22%3ESTOREFY%20OFERTA%20DIGITAL%3C%2Ftext%3E%3C%2Fsvg%3E",
    "benefits": [
      "Base: R$ 20,00",
      "Valor de venda editavel",
      "Subcategoria eFootball"
    ],
    "deliverable": "Referencia fornecedor - CONTA EFOOTBALL COM MUSIALA 105",
    "addedToStore": false
  },
  {
    "id": "gm-03-4500-seguidores-mundial-instagram",
    "name": "4500 SEGUIDORES MUNDIAL INSTAGRAM",
    "category": "Redes Sociais",
    "subcategory": "Instagram",
    "supplier": "GameMarket",
    "costPrice": 25.5,
    "salePrice": 42.07,
    "imageUrl": "https://cdn.simpleicons.org/instagram/E4405F",
    "benefits": [
      "Base: R$ 25,50",
      "Valor de venda editavel",
      "Subcategoria Instagram"
    ],
    "deliverable": "Referencia fornecedor - 4500 SEGUIDORES MUNDIAL INSTAGRAM",
    "addedToStore": false
  },
  {
    "id": "gm-04-seguidores-tiktok-a-partir-de-r-4-99",
    "name": "Seguidores TIKTOK a partir de R$ 4,99",
    "category": "Redes Sociais",
    "subcategory": "TikTok",
    "supplier": "GameMarket",
    "costPrice": 4.99,
    "salePrice": 8.23,
    "imageUrl": "https://cdn.simpleicons.org/tiktok/FFFFFF",
    "benefits": [
      "Base: R$ 4,99",
      "Valor de venda editavel",
      "Subcategoria TikTok"
    ],
    "deliverable": "Referencia fornecedor - Seguidores TIKTOK a partir de R$ 4,99",
    "addedToStore": false
  },
  {
    "id": "gm-05-2x-steam-keys-aleatorias",
    "name": "2x STEAM KEYS ALEATÓRIAS",
    "category": "Games",
    "subcategory": "Steam",
    "supplier": "GameMarket",
    "costPrice": 1,
    "salePrice": 1.65,
    "imageUrl": "https://cdn.simpleicons.org/steam/FFFFFF",
    "benefits": [
      "Base: R$ 1,00",
      "Valor de venda editavel",
      "Subcategoria Steam"
    ],
    "deliverable": "Referencia fornecedor - 2x STEAM KEYS ALEATÓRIAS",
    "addedToStore": false
  },
  {
    "id": "gm-06-cp-mais-barato-presente",
    "name": "CP MAIS BARATO + PRESENTE",
    "category": "Games",
    "subcategory": "Call of Duty",
    "supplier": "GameMarket",
    "costPrice": 10,
    "salePrice": 16.5,
    "imageUrl": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22520%22%20viewBox%3D%220%200%20800%20520%22%20data-storefy-brand-cover%3D%221%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20stop-color%3D%22%23030303%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23262626%22%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%22s%22%3E%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2222%22%20stdDeviation%3D%2222%22%20flood-color%3D%22%23000%22%20flood-opacity%3D%22.45%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%22520%22%20rx%3D%2236%22%20fill%3D%22url(%23g)%22%2F%3E%3Ccircle%20cx%3D%22665%22%20cy%3D%2278%22%20r%3D%22158%22%20fill%3D%22%23fff%22%20opacity%3D%22.08%22%2F%3E%3Ccircle%20cx%3D%22118%22%20cy%3D%22430%22%20r%3D%22190%22%20fill%3D%22%23fff%22%20opacity%3D%22.06%22%2F%3E%3Crect%20x%3D%2256%22%20y%3D%2256%22%20width%3D%22688%22%20height%3D%22408%22%20rx%3D%2230%22%20fill%3D%22%23000%22%20opacity%3D%22.18%22%20stroke%3D%22%23fff%22%20stroke-opacity%3D%22.14%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22255%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22900%22%20fill%3D%22%23f5f5f5%22%20filter%3D%22url(%23s)%22%3ECALL%20OF%20DUTY%3C%2Ftext%3E%3Crect%20x%3D%22240%22%20y%3D%22330%22%20width%3D%22320%22%20height%3D%227%22%20rx%3D%223.5%22%20fill%3D%22%23a3e635%22%20opacity%3D%22.9%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22386%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22800%22%20letter-spacing%3D%225%22%20fill%3D%22%23fff%22%20opacity%3D%22.72%22%3ESTOREFY%20OFERTA%20DIGITAL%3C%2Ftext%3E%3C%2Fsvg%3E",
    "benefits": [
      "Base: R$ 10,00",
      "Valor de venda editavel",
      "Subcategoria Call of Duty"
    ],
    "deliverable": "Referencia fornecedor - CP MAIS BARATO + PRESENTE",
    "addedToStore": false
  },
  {
    "id": "gm-07-itens-free-fire-ff-varios",
    "name": "Itens Free Fire (FF) - Vários",
    "category": "Games",
    "subcategory": "Free Fire",
    "supplier": "GameMarket",
    "costPrice": 1,
    "salePrice": 1.65,
    "imageUrl": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22520%22%20viewBox%3D%220%200%20800%20520%22%20data-storefy-brand-cover%3D%221%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20stop-color%3D%22%23120400%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23f97316%22%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%22s%22%3E%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2222%22%20stdDeviation%3D%2222%22%20flood-color%3D%22%23000%22%20flood-opacity%3D%22.45%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%22520%22%20rx%3D%2236%22%20fill%3D%22url(%23g)%22%2F%3E%3Ccircle%20cx%3D%22665%22%20cy%3D%2278%22%20r%3D%22158%22%20fill%3D%22%23fff%22%20opacity%3D%22.08%22%2F%3E%3Ccircle%20cx%3D%22118%22%20cy%3D%22430%22%20r%3D%22190%22%20fill%3D%22%23fff%22%20opacity%3D%22.06%22%2F%3E%3Crect%20x%3D%2256%22%20y%3D%2256%22%20width%3D%22688%22%20height%3D%22408%22%20rx%3D%2230%22%20fill%3D%22%23000%22%20opacity%3D%22.18%22%20stroke%3D%22%23fff%22%20stroke-opacity%3D%22.14%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22255%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22900%22%20fill%3D%22%23ffffff%22%20filter%3D%22url(%23s)%22%3EFREE%20FIRE%3C%2Ftext%3E%3Crect%20x%3D%22240%22%20y%3D%22330%22%20width%3D%22320%22%20height%3D%227%22%20rx%3D%223.5%22%20fill%3D%22%23facc15%22%20opacity%3D%22.9%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22386%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22800%22%20letter-spacing%3D%225%22%20fill%3D%22%23fff%22%20opacity%3D%22.72%22%3ESTOREFY%20OFERTA%20DIGITAL%3C%2Ftext%3E%3C%2Fsvg%3E",
    "benefits": [
      "Base: R$ 1,00",
      "Valor de venda editavel",
      "Subcategoria Free Fire"
    ],
    "deliverable": "Referencia fornecedor - Itens Free Fire (FF) - Vários",
    "addedToStore": false
  },
  {
    "id": "gm-08-contas-roblox-iniciantes",
    "name": "Contas Roblox Iniciantes",
    "category": "Games",
    "subcategory": "Roblox",
    "supplier": "GameMarket",
    "costPrice": 5,
    "salePrice": 8.25,
    "imageUrl": "https://cdn.simpleicons.org/roblox/FFFFFF",
    "benefits": [
      "Base: R$ 5,00",
      "Valor de venda editavel",
      "Subcategoria Roblox"
    ],
    "deliverable": "Referencia fornecedor - Contas Roblox Iniciantes",
    "addedToStore": false
  },
  {
    "id": "gm-09-diamantes-free-fire-100-un",
    "name": "Diamantes Free Fire 100 un",
    "category": "Games",
    "subcategory": "Free Fire",
    "supplier": "GameMarket",
    "costPrice": 4.5,
    "salePrice": 7.42,
    "imageUrl": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22520%22%20viewBox%3D%220%200%20800%20520%22%20data-storefy-brand-cover%3D%221%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20stop-color%3D%22%23120400%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23f97316%22%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%22s%22%3E%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2222%22%20stdDeviation%3D%2222%22%20flood-color%3D%22%23000%22%20flood-opacity%3D%22.45%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%22520%22%20rx%3D%2236%22%20fill%3D%22url(%23g)%22%2F%3E%3Ccircle%20cx%3D%22665%22%20cy%3D%2278%22%20r%3D%22158%22%20fill%3D%22%23fff%22%20opacity%3D%22.08%22%2F%3E%3Ccircle%20cx%3D%22118%22%20cy%3D%22430%22%20r%3D%22190%22%20fill%3D%22%23fff%22%20opacity%3D%22.06%22%2F%3E%3Crect%20x%3D%2256%22%20y%3D%2256%22%20width%3D%22688%22%20height%3D%22408%22%20rx%3D%2230%22%20fill%3D%22%23000%22%20opacity%3D%22.18%22%20stroke%3D%22%23fff%22%20stroke-opacity%3D%22.14%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22255%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22900%22%20fill%3D%22%23ffffff%22%20filter%3D%22url(%23s)%22%3EFREE%20FIRE%3C%2Ftext%3E%3Crect%20x%3D%22240%22%20y%3D%22330%22%20width%3D%22320%22%20height%3D%227%22%20rx%3D%223.5%22%20fill%3D%22%23facc15%22%20opacity%3D%22.9%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22386%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22800%22%20letter-spacing%3D%225%22%20fill%3D%22%23fff%22%20opacity%3D%22.72%22%3ESTOREFY%20OFERTA%20DIGITAL%3C%2Ftext%3E%3C%2Fsvg%3E",
    "benefits": [
      "Base: R$ 4,50",
      "Valor de venda editavel",
      "Subcategoria Free Fire"
    ],
    "deliverable": "Referencia fornecedor - Diamantes Free Fire 100 un",
    "addedToStore": false
  },
  {
    "id": "gm-10-skin-aleatoria-lol",
    "name": "Skin Aleatória LoL",
    "category": "Games",
    "subcategory": "League of Legends",
    "supplier": "GameMarket",
    "costPrice": 12,
    "salePrice": 19.8,
    "imageUrl": "https://cdn.simpleicons.org/leagueoflegends/C89B3C",
    "benefits": [
      "Base: R$ 12,00",
      "Valor de venda editavel",
      "Subcategoria League of Legends"
    ],
    "deliverable": "Referencia fornecedor - Skin Aleatória LoL",
    "addedToStore": false
  },
  {
    "id": "gm-11-produto-economico-valorant-11",
    "name": "Produto Econômico Valorant #11",
    "category": "Games",
    "subcategory": "Valorant",
    "supplier": "GameMarket",
    "costPrice": 7.9,
    "salePrice": 13.04,
    "imageUrl": "https://cdn.simpleicons.org/valorant/FA4454",
    "benefits": [
      "Base: R$ 7,90",
      "Valor de venda editavel",
      "Subcategoria Valorant"
    ],
    "deliverable": "Referencia fornecedor - Produto Econômico Valorant #11",
    "addedToStore": false
  },
  {
    "id": "gm-12-produto-economico-league-of-legends-12",
    "name": "Produto Econômico League of Legends #12",
    "category": "Games",
    "subcategory": "League of Legends",
    "supplier": "GameMarket",
    "costPrice": 9.99,
    "salePrice": 16.48,
    "imageUrl": "https://cdn.simpleicons.org/leagueoflegends/C89B3C",
    "benefits": [
      "Base: R$ 9,99",
      "Valor de venda editavel",
      "Subcategoria League of Legends"
    ],
    "deliverable": "Referencia fornecedor - Produto Econômico League of Legends #12",
    "addedToStore": false
  },
  {
    "id": "gm-13-produto-economico-efootball-13",
    "name": "Produto Econômico eFootball #13",
    "category": "Games",
    "subcategory": "eFootball",
    "supplier": "GameMarket",
    "costPrice": 12.5,
    "salePrice": 20.63,
    "imageUrl": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22520%22%20viewBox%3D%220%200%20800%20520%22%20data-storefy-brand-cover%3D%221%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20stop-color%3D%22%23061020%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23034ea2%22%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%22s%22%3E%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2222%22%20stdDeviation%3D%2222%22%20flood-color%3D%22%23000%22%20flood-opacity%3D%22.45%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%22520%22%20rx%3D%2236%22%20fill%3D%22url(%23g)%22%2F%3E%3Ccircle%20cx%3D%22665%22%20cy%3D%2278%22%20r%3D%22158%22%20fill%3D%22%23fff%22%20opacity%3D%22.08%22%2F%3E%3Ccircle%20cx%3D%22118%22%20cy%3D%22430%22%20r%3D%22190%22%20fill%3D%22%23fff%22%20opacity%3D%22.06%22%2F%3E%3Crect%20x%3D%2256%22%20y%3D%2256%22%20width%3D%22688%22%20height%3D%22408%22%20rx%3D%2230%22%20fill%3D%22%23000%22%20opacity%3D%22.18%22%20stroke%3D%22%23fff%22%20stroke-opacity%3D%22.14%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22255%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22900%22%20fill%3D%22%23fef200%22%20filter%3D%22url(%23s)%22%3EeFootball%3C%2Ftext%3E%3Crect%20x%3D%22240%22%20y%3D%22330%22%20width%3D%22320%22%20height%3D%227%22%20rx%3D%223.5%22%20fill%3D%22%23fef200%22%20opacity%3D%22.9%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22386%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22800%22%20letter-spacing%3D%225%22%20fill%3D%22%23fff%22%20opacity%3D%22.72%22%3ESTOREFY%20OFERTA%20DIGITAL%3C%2Ftext%3E%3C%2Fsvg%3E",
    "benefits": [
      "Base: R$ 12,50",
      "Valor de venda editavel",
      "Subcategoria eFootball"
    ],
    "deliverable": "Referencia fornecedor - Produto Econômico eFootball #13",
    "addedToStore": false
  },
  {
    "id": "gm-14-produto-economico-redes-sociais-14",
    "name": "Produto Econômico Redes Sociais #14",
    "category": "Redes Sociais",
    "subcategory": "Redes Sociais",
    "supplier": "GameMarket",
    "costPrice": 15,
    "salePrice": 24.75,
    "imageUrl": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22520%22%20viewBox%3D%220%200%20800%20520%22%20data-storefy-brand-cover%3D%221%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20stop-color%3D%22%23151024%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23db2777%22%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%22s%22%3E%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2222%22%20stdDeviation%3D%2222%22%20flood-color%3D%22%23000%22%20flood-opacity%3D%22.45%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%22520%22%20rx%3D%2236%22%20fill%3D%22url(%23g)%22%2F%3E%3Ccircle%20cx%3D%22665%22%20cy%3D%2278%22%20r%3D%22158%22%20fill%3D%22%23fff%22%20opacity%3D%22.08%22%2F%3E%3Ccircle%20cx%3D%22118%22%20cy%3D%22430%22%20r%3D%22190%22%20fill%3D%22%23fff%22%20opacity%3D%22.06%22%2F%3E%3Crect%20x%3D%2256%22%20y%3D%2256%22%20width%3D%22688%22%20height%3D%22408%22%20rx%3D%2230%22%20fill%3D%22%23000%22%20opacity%3D%22.18%22%20stroke%3D%22%23fff%22%20stroke-opacity%3D%22.14%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22255%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22900%22%20fill%3D%22%23ffffff%22%20filter%3D%22url(%23s)%22%3ESocial%20Pack%3C%2Ftext%3E%3Crect%20x%3D%22240%22%20y%3D%22330%22%20width%3D%22320%22%20height%3D%227%22%20rx%3D%223.5%22%20fill%3D%22%2338bdf8%22%20opacity%3D%22.9%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22386%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22800%22%20letter-spacing%3D%225%22%20fill%3D%22%23fff%22%20opacity%3D%22.72%22%3ESTOREFY%20OFERTA%20DIGITAL%3C%2Ftext%3E%3C%2Fsvg%3E",
    "benefits": [
      "Base: R$ 15,00",
      "Valor de venda editavel",
      "Subcategoria Redes Sociais"
    ],
    "deliverable": "Referencia fornecedor - Produto Econômico Redes Sociais #14",
    "addedToStore": false
  },
  {
    "id": "gm-15-produto-economico-steam-15",
    "name": "Produto Econômico Steam #15",
    "category": "Games",
    "subcategory": "Steam",
    "supplier": "GameMarket",
    "costPrice": 19.9,
    "salePrice": 32.83,
    "imageUrl": "https://cdn.simpleicons.org/steam/FFFFFF",
    "benefits": [
      "Base: R$ 19,90",
      "Valor de venda editavel",
      "Subcategoria Steam"
    ],
    "deliverable": "Referencia fornecedor - Produto Econômico Steam #15",
    "addedToStore": false
  },
  {
    "id": "gm-16-produto-economico-free-fire-16",
    "name": "Produto Econômico Free Fire #16",
    "category": "Games",
    "subcategory": "Free Fire",
    "supplier": "GameMarket",
    "costPrice": 1,
    "salePrice": 1.65,
    "imageUrl": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22520%22%20viewBox%3D%220%200%20800%20520%22%20data-storefy-brand-cover%3D%221%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20stop-color%3D%22%23120400%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23f97316%22%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%22s%22%3E%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2222%22%20stdDeviation%3D%2222%22%20flood-color%3D%22%23000%22%20flood-opacity%3D%22.45%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%22520%22%20rx%3D%2236%22%20fill%3D%22url(%23g)%22%2F%3E%3Ccircle%20cx%3D%22665%22%20cy%3D%2278%22%20r%3D%22158%22%20fill%3D%22%23fff%22%20opacity%3D%22.08%22%2F%3E%3Ccircle%20cx%3D%22118%22%20cy%3D%22430%22%20r%3D%22190%22%20fill%3D%22%23fff%22%20opacity%3D%22.06%22%2F%3E%3Crect%20x%3D%2256%22%20y%3D%2256%22%20width%3D%22688%22%20height%3D%22408%22%20rx%3D%2230%22%20fill%3D%22%23000%22%20opacity%3D%22.18%22%20stroke%3D%22%23fff%22%20stroke-opacity%3D%22.14%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22255%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22900%22%20fill%3D%22%23ffffff%22%20filter%3D%22url(%23s)%22%3EFREE%20FIRE%3C%2Ftext%3E%3Crect%20x%3D%22240%22%20y%3D%22330%22%20width%3D%22320%22%20height%3D%227%22%20rx%3D%223.5%22%20fill%3D%22%23facc15%22%20opacity%3D%22.9%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22386%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22800%22%20letter-spacing%3D%225%22%20fill%3D%22%23fff%22%20opacity%3D%22.72%22%3ESTOREFY%20OFERTA%20DIGITAL%3C%2Ftext%3E%3C%2Fsvg%3E",
    "benefits": [
      "Base: R$ 1,00",
      "Valor de venda editavel",
      "Subcategoria Free Fire"
    ],
    "deliverable": "Referencia fornecedor - Produto Econômico Free Fire #16",
    "addedToStore": false
  },
  {
    "id": "gm-17-produto-economico-roblox-17",
    "name": "Produto Econômico Roblox #17",
    "category": "Games",
    "subcategory": "Roblox",
    "supplier": "GameMarket",
    "costPrice": 2.5,
    "salePrice": 4.13,
    "imageUrl": "https://cdn.simpleicons.org/roblox/FFFFFF",
    "benefits": [
      "Base: R$ 2,50",
      "Valor de venda editavel",
      "Subcategoria Roblox"
    ],
    "deliverable": "Referencia fornecedor - Produto Econômico Roblox #17",
    "addedToStore": false
  },
  {
    "id": "gm-18-produto-economico-minecraft-18",
    "name": "Produto Econômico Minecraft #18",
    "category": "Games",
    "subcategory": "Minecraft",
    "supplier": "GameMarket",
    "costPrice": 5,
    "salePrice": 8.25,
    "imageUrl": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22520%22%20viewBox%3D%220%200%20800%20520%22%20data-storefy-brand-cover%3D%221%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20stop-color%3D%22%2311250f%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%233ca63c%22%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%22s%22%3E%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2222%22%20stdDeviation%3D%2222%22%20flood-color%3D%22%23000%22%20flood-opacity%3D%22.45%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%22520%22%20rx%3D%2236%22%20fill%3D%22url(%23g)%22%2F%3E%3Ccircle%20cx%3D%22665%22%20cy%3D%2278%22%20r%3D%22158%22%20fill%3D%22%23fff%22%20opacity%3D%22.08%22%2F%3E%3Ccircle%20cx%3D%22118%22%20cy%3D%22430%22%20r%3D%22190%22%20fill%3D%22%23fff%22%20opacity%3D%22.06%22%2F%3E%3Crect%20x%3D%2256%22%20y%3D%2256%22%20width%3D%22688%22%20height%3D%22408%22%20rx%3D%2230%22%20fill%3D%22%23000%22%20opacity%3D%22.18%22%20stroke%3D%22%23fff%22%20stroke-opacity%3D%22.14%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22255%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22900%22%20fill%3D%22%23ffffff%22%20filter%3D%22url(%23s)%22%3EMINECRAFT%3C%2Ftext%3E%3Crect%20x%3D%22240%22%20y%3D%22330%22%20width%3D%22320%22%20height%3D%227%22%20rx%3D%223.5%22%20fill%3D%22%237dd957%22%20opacity%3D%22.9%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22386%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22800%22%20letter-spacing%3D%225%22%20fill%3D%22%23fff%22%20opacity%3D%22.72%22%3ESTOREFY%20OFERTA%20DIGITAL%3C%2Ftext%3E%3C%2Fsvg%3E",
    "benefits": [
      "Base: R$ 5,00",
      "Valor de venda editavel",
      "Subcategoria Minecraft"
    ],
    "deliverable": "Referencia fornecedor - Produto Econômico Minecraft #18",
    "addedToStore": false
  },
  {
    "id": "gm-19-produto-economico-valorant-19",
    "name": "Produto Econômico Valorant #19",
    "category": "Games",
    "subcategory": "Valorant",
    "supplier": "GameMarket",
    "costPrice": 7.9,
    "salePrice": 13.04,
    "imageUrl": "https://cdn.simpleicons.org/valorant/FA4454",
    "benefits": [
      "Base: R$ 7,90",
      "Valor de venda editavel",
      "Subcategoria Valorant"
    ],
    "deliverable": "Referencia fornecedor - Produto Econômico Valorant #19",
    "addedToStore": false
  },
  {
    "id": "gm-20-produto-economico-league-of-legends-20",
    "name": "Produto Econômico League of Legends #20",
    "category": "Games",
    "subcategory": "League of Legends",
    "supplier": "GameMarket",
    "costPrice": 9.99,
    "salePrice": 16.48,
    "imageUrl": "https://cdn.simpleicons.org/leagueoflegends/C89B3C",
    "benefits": [
      "Base: R$ 9,99",
      "Valor de venda editavel",
      "Subcategoria League of Legends"
    ],
    "deliverable": "Referencia fornecedor - Produto Econômico League of Legends #20",
    "addedToStore": false
  },
  {
    "id": "gm-21-produto-economico-efootball-21",
    "name": "Produto Econômico eFootball #21",
    "category": "Games",
    "subcategory": "eFootball",
    "supplier": "GameMarket",
    "costPrice": 12.5,
    "salePrice": 20.63,
    "imageUrl": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22520%22%20viewBox%3D%220%200%20800%20520%22%20data-storefy-brand-cover%3D%221%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20stop-color%3D%22%23061020%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23034ea2%22%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%22s%22%3E%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2222%22%20stdDeviation%3D%2222%22%20flood-color%3D%22%23000%22%20flood-opacity%3D%22.45%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%22520%22%20rx%3D%2236%22%20fill%3D%22url(%23g)%22%2F%3E%3Ccircle%20cx%3D%22665%22%20cy%3D%2278%22%20r%3D%22158%22%20fill%3D%22%23fff%22%20opacity%3D%22.08%22%2F%3E%3Ccircle%20cx%3D%22118%22%20cy%3D%22430%22%20r%3D%22190%22%20fill%3D%22%23fff%22%20opacity%3D%22.06%22%2F%3E%3Crect%20x%3D%2256%22%20y%3D%2256%22%20width%3D%22688%22%20height%3D%22408%22%20rx%3D%2230%22%20fill%3D%22%23000%22%20opacity%3D%22.18%22%20stroke%3D%22%23fff%22%20stroke-opacity%3D%22.14%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22255%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22900%22%20fill%3D%22%23fef200%22%20filter%3D%22url(%23s)%22%3EeFootball%3C%2Ftext%3E%3Crect%20x%3D%22240%22%20y%3D%22330%22%20width%3D%22320%22%20height%3D%227%22%20rx%3D%223.5%22%20fill%3D%22%23fef200%22%20opacity%3D%22.9%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22386%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22800%22%20letter-spacing%3D%225%22%20fill%3D%22%23fff%22%20opacity%3D%22.72%22%3ESTOREFY%20OFERTA%20DIGITAL%3C%2Ftext%3E%3C%2Fsvg%3E",
    "benefits": [
      "Base: R$ 12,50",
      "Valor de venda editavel",
      "Subcategoria eFootball"
    ],
    "deliverable": "Referencia fornecedor - Produto Econômico eFootball #21",
    "addedToStore": false
  },
  {
    "id": "gm-22-produto-economico-redes-sociais-22",
    "name": "Produto Econômico Redes Sociais #22",
    "category": "Redes Sociais",
    "subcategory": "Redes Sociais",
    "supplier": "GameMarket",
    "costPrice": 15,
    "salePrice": 24.75,
    "imageUrl": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22520%22%20viewBox%3D%220%200%20800%20520%22%20data-storefy-brand-cover%3D%221%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20stop-color%3D%22%23151024%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23db2777%22%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%22s%22%3E%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2222%22%20stdDeviation%3D%2222%22%20flood-color%3D%22%23000%22%20flood-opacity%3D%22.45%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%22520%22%20rx%3D%2236%22%20fill%3D%22url(%23g)%22%2F%3E%3Ccircle%20cx%3D%22665%22%20cy%3D%2278%22%20r%3D%22158%22%20fill%3D%22%23fff%22%20opacity%3D%22.08%22%2F%3E%3Ccircle%20cx%3D%22118%22%20cy%3D%22430%22%20r%3D%22190%22%20fill%3D%22%23fff%22%20opacity%3D%22.06%22%2F%3E%3Crect%20x%3D%2256%22%20y%3D%2256%22%20width%3D%22688%22%20height%3D%22408%22%20rx%3D%2230%22%20fill%3D%22%23000%22%20opacity%3D%22.18%22%20stroke%3D%22%23fff%22%20stroke-opacity%3D%22.14%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22255%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22900%22%20fill%3D%22%23ffffff%22%20filter%3D%22url(%23s)%22%3ESocial%20Pack%3C%2Ftext%3E%3Crect%20x%3D%22240%22%20y%3D%22330%22%20width%3D%22320%22%20height%3D%227%22%20rx%3D%223.5%22%20fill%3D%22%2338bdf8%22%20opacity%3D%22.9%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22386%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22800%22%20letter-spacing%3D%225%22%20fill%3D%22%23fff%22%20opacity%3D%22.72%22%3ESTOREFY%20OFERTA%20DIGITAL%3C%2Ftext%3E%3C%2Fsvg%3E",
    "benefits": [
      "Base: R$ 15,00",
      "Valor de venda editavel",
      "Subcategoria Redes Sociais"
    ],
    "deliverable": "Referencia fornecedor - Produto Econômico Redes Sociais #22",
    "addedToStore": false
  },
  {
    "id": "gm-23-produto-economico-steam-23",
    "name": "Produto Econômico Steam #23",
    "category": "Games",
    "subcategory": "Steam",
    "supplier": "GameMarket",
    "costPrice": 19.9,
    "salePrice": 32.83,
    "imageUrl": "https://cdn.simpleicons.org/steam/FFFFFF",
    "benefits": [
      "Base: R$ 19,90",
      "Valor de venda editavel",
      "Subcategoria Steam"
    ],
    "deliverable": "Referencia fornecedor - Produto Econômico Steam #23",
    "addedToStore": false
  },
  {
    "id": "gm-24-produto-economico-free-fire-24",
    "name": "Produto Econômico Free Fire #24",
    "category": "Games",
    "subcategory": "Free Fire",
    "supplier": "GameMarket",
    "costPrice": 1,
    "salePrice": 1.65,
    "imageUrl": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22520%22%20viewBox%3D%220%200%20800%20520%22%20data-storefy-brand-cover%3D%221%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20stop-color%3D%22%23120400%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23f97316%22%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%22s%22%3E%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2222%22%20stdDeviation%3D%2222%22%20flood-color%3D%22%23000%22%20flood-opacity%3D%22.45%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%22520%22%20rx%3D%2236%22%20fill%3D%22url(%23g)%22%2F%3E%3Ccircle%20cx%3D%22665%22%20cy%3D%2278%22%20r%3D%22158%22%20fill%3D%22%23fff%22%20opacity%3D%22.08%22%2F%3E%3Ccircle%20cx%3D%22118%22%20cy%3D%22430%22%20r%3D%22190%22%20fill%3D%22%23fff%22%20opacity%3D%22.06%22%2F%3E%3Crect%20x%3D%2256%22%20y%3D%2256%22%20width%3D%22688%22%20height%3D%22408%22%20rx%3D%2230%22%20fill%3D%22%23000%22%20opacity%3D%22.18%22%20stroke%3D%22%23fff%22%20stroke-opacity%3D%22.14%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22255%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22900%22%20fill%3D%22%23ffffff%22%20filter%3D%22url(%23s)%22%3EFREE%20FIRE%3C%2Ftext%3E%3Crect%20x%3D%22240%22%20y%3D%22330%22%20width%3D%22320%22%20height%3D%227%22%20rx%3D%223.5%22%20fill%3D%22%23facc15%22%20opacity%3D%22.9%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22386%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22800%22%20letter-spacing%3D%225%22%20fill%3D%22%23fff%22%20opacity%3D%22.72%22%3ESTOREFY%20OFERTA%20DIGITAL%3C%2Ftext%3E%3C%2Fsvg%3E",
    "benefits": [
      "Base: R$ 1,00",
      "Valor de venda editavel",
      "Subcategoria Free Fire"
    ],
    "deliverable": "Referencia fornecedor - Produto Econômico Free Fire #24",
    "addedToStore": false
  },
  {
    "id": "gm-25-produto-economico-roblox-25",
    "name": "Produto Econômico Roblox #25",
    "category": "Games",
    "subcategory": "Roblox",
    "supplier": "GameMarket",
    "costPrice": 2.5,
    "salePrice": 4.13,
    "imageUrl": "https://cdn.simpleicons.org/roblox/FFFFFF",
    "benefits": [
      "Base: R$ 2,50",
      "Valor de venda editavel",
      "Subcategoria Roblox"
    ],
    "deliverable": "Referencia fornecedor - Produto Econômico Roblox #25",
    "addedToStore": false
  },
  {
    "id": "gm-26-produto-economico-minecraft-26",
    "name": "Produto Econômico Minecraft #26",
    "category": "Games",
    "subcategory": "Minecraft",
    "supplier": "GameMarket",
    "costPrice": 5,
    "salePrice": 8.25,
    "imageUrl": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22520%22%20viewBox%3D%220%200%20800%20520%22%20data-storefy-brand-cover%3D%221%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20stop-color%3D%22%2311250f%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%233ca63c%22%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%22s%22%3E%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2222%22%20stdDeviation%3D%2222%22%20flood-color%3D%22%23000%22%20flood-opacity%3D%22.45%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%22520%22%20rx%3D%2236%22%20fill%3D%22url(%23g)%22%2F%3E%3Ccircle%20cx%3D%22665%22%20cy%3D%2278%22%20r%3D%22158%22%20fill%3D%22%23fff%22%20opacity%3D%22.08%22%2F%3E%3Ccircle%20cx%3D%22118%22%20cy%3D%22430%22%20r%3D%22190%22%20fill%3D%22%23fff%22%20opacity%3D%22.06%22%2F%3E%3Crect%20x%3D%2256%22%20y%3D%2256%22%20width%3D%22688%22%20height%3D%22408%22%20rx%3D%2230%22%20fill%3D%22%23000%22%20opacity%3D%22.18%22%20stroke%3D%22%23fff%22%20stroke-opacity%3D%22.14%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22255%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22900%22%20fill%3D%22%23ffffff%22%20filter%3D%22url(%23s)%22%3EMINECRAFT%3C%2Ftext%3E%3Crect%20x%3D%22240%22%20y%3D%22330%22%20width%3D%22320%22%20height%3D%227%22%20rx%3D%223.5%22%20fill%3D%22%237dd957%22%20opacity%3D%22.9%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22386%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22800%22%20letter-spacing%3D%225%22%20fill%3D%22%23fff%22%20opacity%3D%22.72%22%3ESTOREFY%20OFERTA%20DIGITAL%3C%2Ftext%3E%3C%2Fsvg%3E",
    "benefits": [
      "Base: R$ 5,00",
      "Valor de venda editavel",
      "Subcategoria Minecraft"
    ],
    "deliverable": "Referencia fornecedor - Produto Econômico Minecraft #26",
    "addedToStore": false
  },
  {
    "id": "gm-27-produto-economico-valorant-27",
    "name": "Produto Econômico Valorant #27",
    "category": "Games",
    "subcategory": "Valorant",
    "supplier": "GameMarket",
    "costPrice": 7.9,
    "salePrice": 13.04,
    "imageUrl": "https://cdn.simpleicons.org/valorant/FA4454",
    "benefits": [
      "Base: R$ 7,90",
      "Valor de venda editavel",
      "Subcategoria Valorant"
    ],
    "deliverable": "Referencia fornecedor - Produto Econômico Valorant #27",
    "addedToStore": false
  },
  {
    "id": "gm-28-produto-economico-league-of-legends-28",
    "name": "Produto Econômico League of Legends #28",
    "category": "Games",
    "subcategory": "League of Legends",
    "supplier": "GameMarket",
    "costPrice": 9.99,
    "salePrice": 16.48,
    "imageUrl": "https://cdn.simpleicons.org/leagueoflegends/C89B3C",
    "benefits": [
      "Base: R$ 9,99",
      "Valor de venda editavel",
      "Subcategoria League of Legends"
    ],
    "deliverable": "Referencia fornecedor - Produto Econômico League of Legends #28",
    "addedToStore": false
  },
  {
    "id": "gm-29-produto-economico-efootball-29",
    "name": "Produto Econômico eFootball #29",
    "category": "Games",
    "subcategory": "eFootball",
    "supplier": "GameMarket",
    "costPrice": 12.5,
    "salePrice": 20.63,
    "imageUrl": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22520%22%20viewBox%3D%220%200%20800%20520%22%20data-storefy-brand-cover%3D%221%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20stop-color%3D%22%23061020%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23034ea2%22%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%22s%22%3E%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2222%22%20stdDeviation%3D%2222%22%20flood-color%3D%22%23000%22%20flood-opacity%3D%22.45%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%22520%22%20rx%3D%2236%22%20fill%3D%22url(%23g)%22%2F%3E%3Ccircle%20cx%3D%22665%22%20cy%3D%2278%22%20r%3D%22158%22%20fill%3D%22%23fff%22%20opacity%3D%22.08%22%2F%3E%3Ccircle%20cx%3D%22118%22%20cy%3D%22430%22%20r%3D%22190%22%20fill%3D%22%23fff%22%20opacity%3D%22.06%22%2F%3E%3Crect%20x%3D%2256%22%20y%3D%2256%22%20width%3D%22688%22%20height%3D%22408%22%20rx%3D%2230%22%20fill%3D%22%23000%22%20opacity%3D%22.18%22%20stroke%3D%22%23fff%22%20stroke-opacity%3D%22.14%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22255%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22900%22%20fill%3D%22%23fef200%22%20filter%3D%22url(%23s)%22%3EeFootball%3C%2Ftext%3E%3Crect%20x%3D%22240%22%20y%3D%22330%22%20width%3D%22320%22%20height%3D%227%22%20rx%3D%223.5%22%20fill%3D%22%23fef200%22%20opacity%3D%22.9%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22386%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22800%22%20letter-spacing%3D%225%22%20fill%3D%22%23fff%22%20opacity%3D%22.72%22%3ESTOREFY%20OFERTA%20DIGITAL%3C%2Ftext%3E%3C%2Fsvg%3E",
    "benefits": [
      "Base: R$ 12,50",
      "Valor de venda editavel",
      "Subcategoria eFootball"
    ],
    "deliverable": "Referencia fornecedor - Produto Econômico eFootball #29",
    "addedToStore": false
  },
  {
    "id": "gm-30-produto-economico-redes-sociais-30",
    "name": "Produto Econômico Redes Sociais #30",
    "category": "Redes Sociais",
    "subcategory": "Redes Sociais",
    "supplier": "GameMarket",
    "costPrice": 15,
    "salePrice": 24.75,
    "imageUrl": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22520%22%20viewBox%3D%220%200%20800%20520%22%20data-storefy-brand-cover%3D%221%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20stop-color%3D%22%23151024%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23db2777%22%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%22s%22%3E%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2222%22%20stdDeviation%3D%2222%22%20flood-color%3D%22%23000%22%20flood-opacity%3D%22.45%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%22520%22%20rx%3D%2236%22%20fill%3D%22url(%23g)%22%2F%3E%3Ccircle%20cx%3D%22665%22%20cy%3D%2278%22%20r%3D%22158%22%20fill%3D%22%23fff%22%20opacity%3D%22.08%22%2F%3E%3Ccircle%20cx%3D%22118%22%20cy%3D%22430%22%20r%3D%22190%22%20fill%3D%22%23fff%22%20opacity%3D%22.06%22%2F%3E%3Crect%20x%3D%2256%22%20y%3D%2256%22%20width%3D%22688%22%20height%3D%22408%22%20rx%3D%2230%22%20fill%3D%22%23000%22%20opacity%3D%22.18%22%20stroke%3D%22%23fff%22%20stroke-opacity%3D%22.14%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22255%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22900%22%20fill%3D%22%23ffffff%22%20filter%3D%22url(%23s)%22%3ESocial%20Pack%3C%2Ftext%3E%3Crect%20x%3D%22240%22%20y%3D%22330%22%20width%3D%22320%22%20height%3D%227%22%20rx%3D%223.5%22%20fill%3D%22%2338bdf8%22%20opacity%3D%22.9%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22386%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22800%22%20letter-spacing%3D%225%22%20fill%3D%22%23fff%22%20opacity%3D%22.72%22%3ESTOREFY%20OFERTA%20DIGITAL%3C%2Ftext%3E%3C%2Fsvg%3E",
    "benefits": [
      "Base: R$ 15,00",
      "Valor de venda editavel",
      "Subcategoria Redes Sociais"
    ],
    "deliverable": "Referencia fornecedor - Produto Econômico Redes Sociais #30",
    "addedToStore": false
  },
  {
    "id": "gm-31-produto-economico-steam-31",
    "name": "Produto Econômico Steam #31",
    "category": "Games",
    "subcategory": "Steam",
    "supplier": "GameMarket",
    "costPrice": 19.9,
    "salePrice": 32.83,
    "imageUrl": "https://cdn.simpleicons.org/steam/FFFFFF",
    "benefits": [
      "Base: R$ 19,90",
      "Valor de venda editavel",
      "Subcategoria Steam"
    ],
    "deliverable": "Referencia fornecedor - Produto Econômico Steam #31",
    "addedToStore": false
  },
  {
    "id": "gm-32-produto-economico-free-fire-32",
    "name": "Produto Econômico Free Fire #32",
    "category": "Games",
    "subcategory": "Free Fire",
    "supplier": "GameMarket",
    "costPrice": 1,
    "salePrice": 1.65,
    "imageUrl": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22520%22%20viewBox%3D%220%200%20800%20520%22%20data-storefy-brand-cover%3D%221%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20stop-color%3D%22%23120400%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23f97316%22%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%22s%22%3E%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2222%22%20stdDeviation%3D%2222%22%20flood-color%3D%22%23000%22%20flood-opacity%3D%22.45%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%22520%22%20rx%3D%2236%22%20fill%3D%22url(%23g)%22%2F%3E%3Ccircle%20cx%3D%22665%22%20cy%3D%2278%22%20r%3D%22158%22%20fill%3D%22%23fff%22%20opacity%3D%22.08%22%2F%3E%3Ccircle%20cx%3D%22118%22%20cy%3D%22430%22%20r%3D%22190%22%20fill%3D%22%23fff%22%20opacity%3D%22.06%22%2F%3E%3Crect%20x%3D%2256%22%20y%3D%2256%22%20width%3D%22688%22%20height%3D%22408%22%20rx%3D%2230%22%20fill%3D%22%23000%22%20opacity%3D%22.18%22%20stroke%3D%22%23fff%22%20stroke-opacity%3D%22.14%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22255%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22900%22%20fill%3D%22%23ffffff%22%20filter%3D%22url(%23s)%22%3EFREE%20FIRE%3C%2Ftext%3E%3Crect%20x%3D%22240%22%20y%3D%22330%22%20width%3D%22320%22%20height%3D%227%22%20rx%3D%223.5%22%20fill%3D%22%23facc15%22%20opacity%3D%22.9%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22386%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22800%22%20letter-spacing%3D%225%22%20fill%3D%22%23fff%22%20opacity%3D%22.72%22%3ESTOREFY%20OFERTA%20DIGITAL%3C%2Ftext%3E%3C%2Fsvg%3E",
    "benefits": [
      "Base: R$ 1,00",
      "Valor de venda editavel",
      "Subcategoria Free Fire"
    ],
    "deliverable": "Referencia fornecedor - Produto Econômico Free Fire #32",
    "addedToStore": false
  },
  {
    "id": "gm-33-produto-economico-roblox-33",
    "name": "Produto Econômico Roblox #33",
    "category": "Games",
    "subcategory": "Roblox",
    "supplier": "GameMarket",
    "costPrice": 2.5,
    "salePrice": 4.13,
    "imageUrl": "https://cdn.simpleicons.org/roblox/FFFFFF",
    "benefits": [
      "Base: R$ 2,50",
      "Valor de venda editavel",
      "Subcategoria Roblox"
    ],
    "deliverable": "Referencia fornecedor - Produto Econômico Roblox #33",
    "addedToStore": false
  },
  {
    "id": "gm-34-produto-economico-minecraft-34",
    "name": "Produto Econômico Minecraft #34",
    "category": "Games",
    "subcategory": "Minecraft",
    "supplier": "GameMarket",
    "costPrice": 5,
    "salePrice": 8.25,
    "imageUrl": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22520%22%20viewBox%3D%220%200%20800%20520%22%20data-storefy-brand-cover%3D%221%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20stop-color%3D%22%2311250f%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%233ca63c%22%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%22s%22%3E%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2222%22%20stdDeviation%3D%2222%22%20flood-color%3D%22%23000%22%20flood-opacity%3D%22.45%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%22520%22%20rx%3D%2236%22%20fill%3D%22url(%23g)%22%2F%3E%3Ccircle%20cx%3D%22665%22%20cy%3D%2278%22%20r%3D%22158%22%20fill%3D%22%23fff%22%20opacity%3D%22.08%22%2F%3E%3Ccircle%20cx%3D%22118%22%20cy%3D%22430%22%20r%3D%22190%22%20fill%3D%22%23fff%22%20opacity%3D%22.06%22%2F%3E%3Crect%20x%3D%2256%22%20y%3D%2256%22%20width%3D%22688%22%20height%3D%22408%22%20rx%3D%2230%22%20fill%3D%22%23000%22%20opacity%3D%22.18%22%20stroke%3D%22%23fff%22%20stroke-opacity%3D%22.14%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22255%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22900%22%20fill%3D%22%23ffffff%22%20filter%3D%22url(%23s)%22%3EMINECRAFT%3C%2Ftext%3E%3Crect%20x%3D%22240%22%20y%3D%22330%22%20width%3D%22320%22%20height%3D%227%22%20rx%3D%223.5%22%20fill%3D%22%237dd957%22%20opacity%3D%22.9%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22386%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22800%22%20letter-spacing%3D%225%22%20fill%3D%22%23fff%22%20opacity%3D%22.72%22%3ESTOREFY%20OFERTA%20DIGITAL%3C%2Ftext%3E%3C%2Fsvg%3E",
    "benefits": [
      "Base: R$ 5,00",
      "Valor de venda editavel",
      "Subcategoria Minecraft"
    ],
    "deliverable": "Referencia fornecedor - Produto Econômico Minecraft #34",
    "addedToStore": false
  },
  {
    "id": "gm-35-produto-economico-valorant-35",
    "name": "Produto Econômico Valorant #35",
    "category": "Games",
    "subcategory": "Valorant",
    "supplier": "GameMarket",
    "costPrice": 7.9,
    "salePrice": 13.04,
    "imageUrl": "https://cdn.simpleicons.org/valorant/FA4454",
    "benefits": [
      "Base: R$ 7,90",
      "Valor de venda editavel",
      "Subcategoria Valorant"
    ],
    "deliverable": "Referencia fornecedor - Produto Econômico Valorant #35",
    "addedToStore": false
  },
  {
    "id": "gm-36-produto-economico-league-of-legends-36",
    "name": "Produto Econômico League of Legends #36",
    "category": "Games",
    "subcategory": "League of Legends",
    "supplier": "GameMarket",
    "costPrice": 9.99,
    "salePrice": 16.48,
    "imageUrl": "https://cdn.simpleicons.org/leagueoflegends/C89B3C",
    "benefits": [
      "Base: R$ 9,99",
      "Valor de venda editavel",
      "Subcategoria League of Legends"
    ],
    "deliverable": "Referencia fornecedor - Produto Econômico League of Legends #36",
    "addedToStore": false
  },
  {
    "id": "gm-37-produto-economico-efootball-37",
    "name": "Produto Econômico eFootball #37",
    "category": "Games",
    "subcategory": "eFootball",
    "supplier": "GameMarket",
    "costPrice": 12.5,
    "salePrice": 20.63,
    "imageUrl": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22520%22%20viewBox%3D%220%200%20800%20520%22%20data-storefy-brand-cover%3D%221%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20stop-color%3D%22%23061020%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23034ea2%22%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%22s%22%3E%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2222%22%20stdDeviation%3D%2222%22%20flood-color%3D%22%23000%22%20flood-opacity%3D%22.45%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%22520%22%20rx%3D%2236%22%20fill%3D%22url(%23g)%22%2F%3E%3Ccircle%20cx%3D%22665%22%20cy%3D%2278%22%20r%3D%22158%22%20fill%3D%22%23fff%22%20opacity%3D%22.08%22%2F%3E%3Ccircle%20cx%3D%22118%22%20cy%3D%22430%22%20r%3D%22190%22%20fill%3D%22%23fff%22%20opacity%3D%22.06%22%2F%3E%3Crect%20x%3D%2256%22%20y%3D%2256%22%20width%3D%22688%22%20height%3D%22408%22%20rx%3D%2230%22%20fill%3D%22%23000%22%20opacity%3D%22.18%22%20stroke%3D%22%23fff%22%20stroke-opacity%3D%22.14%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22255%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22900%22%20fill%3D%22%23fef200%22%20filter%3D%22url(%23s)%22%3EeFootball%3C%2Ftext%3E%3Crect%20x%3D%22240%22%20y%3D%22330%22%20width%3D%22320%22%20height%3D%227%22%20rx%3D%223.5%22%20fill%3D%22%23fef200%22%20opacity%3D%22.9%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22386%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22800%22%20letter-spacing%3D%225%22%20fill%3D%22%23fff%22%20opacity%3D%22.72%22%3ESTOREFY%20OFERTA%20DIGITAL%3C%2Ftext%3E%3C%2Fsvg%3E",
    "benefits": [
      "Base: R$ 12,50",
      "Valor de venda editavel",
      "Subcategoria eFootball"
    ],
    "deliverable": "Referencia fornecedor - Produto Econômico eFootball #37",
    "addedToStore": false
  },
  {
    "id": "gm-38-produto-economico-redes-sociais-38",
    "name": "Produto Econômico Redes Sociais #38",
    "category": "Redes Sociais",
    "subcategory": "Redes Sociais",
    "supplier": "GameMarket",
    "costPrice": 15,
    "salePrice": 24.75,
    "imageUrl": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22520%22%20viewBox%3D%220%200%20800%20520%22%20data-storefy-brand-cover%3D%221%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20stop-color%3D%22%23151024%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23db2777%22%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%22s%22%3E%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2222%22%20stdDeviation%3D%2222%22%20flood-color%3D%22%23000%22%20flood-opacity%3D%22.45%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%22520%22%20rx%3D%2236%22%20fill%3D%22url(%23g)%22%2F%3E%3Ccircle%20cx%3D%22665%22%20cy%3D%2278%22%20r%3D%22158%22%20fill%3D%22%23fff%22%20opacity%3D%22.08%22%2F%3E%3Ccircle%20cx%3D%22118%22%20cy%3D%22430%22%20r%3D%22190%22%20fill%3D%22%23fff%22%20opacity%3D%22.06%22%2F%3E%3Crect%20x%3D%2256%22%20y%3D%2256%22%20width%3D%22688%22%20height%3D%22408%22%20rx%3D%2230%22%20fill%3D%22%23000%22%20opacity%3D%22.18%22%20stroke%3D%22%23fff%22%20stroke-opacity%3D%22.14%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22255%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22900%22%20fill%3D%22%23ffffff%22%20filter%3D%22url(%23s)%22%3ESocial%20Pack%3C%2Ftext%3E%3Crect%20x%3D%22240%22%20y%3D%22330%22%20width%3D%22320%22%20height%3D%227%22%20rx%3D%223.5%22%20fill%3D%22%2338bdf8%22%20opacity%3D%22.9%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22386%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22800%22%20letter-spacing%3D%225%22%20fill%3D%22%23fff%22%20opacity%3D%22.72%22%3ESTOREFY%20OFERTA%20DIGITAL%3C%2Ftext%3E%3C%2Fsvg%3E",
    "benefits": [
      "Base: R$ 15,00",
      "Valor de venda editavel",
      "Subcategoria Redes Sociais"
    ],
    "deliverable": "Referencia fornecedor - Produto Econômico Redes Sociais #38",
    "addedToStore": false
  },
  {
    "id": "gm-39-produto-economico-steam-39",
    "name": "Produto Econômico Steam #39",
    "category": "Games",
    "subcategory": "Steam",
    "supplier": "GameMarket",
    "costPrice": 19.9,
    "salePrice": 32.83,
    "imageUrl": "https://cdn.simpleicons.org/steam/FFFFFF",
    "benefits": [
      "Base: R$ 19,90",
      "Valor de venda editavel",
      "Subcategoria Steam"
    ],
    "deliverable": "Referencia fornecedor - Produto Econômico Steam #39",
    "addedToStore": false
  },
  {
    "id": "gm-40-produto-economico-free-fire-40",
    "name": "Produto Econômico Free Fire #40",
    "category": "Games",
    "subcategory": "Free Fire",
    "supplier": "GameMarket",
    "costPrice": 1,
    "salePrice": 1.65,
    "imageUrl": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22520%22%20viewBox%3D%220%200%20800%20520%22%20data-storefy-brand-cover%3D%221%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20stop-color%3D%22%23120400%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23f97316%22%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%22s%22%3E%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2222%22%20stdDeviation%3D%2222%22%20flood-color%3D%22%23000%22%20flood-opacity%3D%22.45%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%22520%22%20rx%3D%2236%22%20fill%3D%22url(%23g)%22%2F%3E%3Ccircle%20cx%3D%22665%22%20cy%3D%2278%22%20r%3D%22158%22%20fill%3D%22%23fff%22%20opacity%3D%22.08%22%2F%3E%3Ccircle%20cx%3D%22118%22%20cy%3D%22430%22%20r%3D%22190%22%20fill%3D%22%23fff%22%20opacity%3D%22.06%22%2F%3E%3Crect%20x%3D%2256%22%20y%3D%2256%22%20width%3D%22688%22%20height%3D%22408%22%20rx%3D%2230%22%20fill%3D%22%23000%22%20opacity%3D%22.18%22%20stroke%3D%22%23fff%22%20stroke-opacity%3D%22.14%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22255%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22900%22%20fill%3D%22%23ffffff%22%20filter%3D%22url(%23s)%22%3EFREE%20FIRE%3C%2Ftext%3E%3Crect%20x%3D%22240%22%20y%3D%22330%22%20width%3D%22320%22%20height%3D%227%22%20rx%3D%223.5%22%20fill%3D%22%23facc15%22%20opacity%3D%22.9%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22386%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22800%22%20letter-spacing%3D%225%22%20fill%3D%22%23fff%22%20opacity%3D%22.72%22%3ESTOREFY%20OFERTA%20DIGITAL%3C%2Ftext%3E%3C%2Fsvg%3E",
    "benefits": [
      "Base: R$ 1,00",
      "Valor de venda editavel",
      "Subcategoria Free Fire"
    ],
    "deliverable": "Referencia fornecedor - Produto Econômico Free Fire #40",
    "addedToStore": false
  },
  {
    "id": "gm-41-produto-economico-roblox-41",
    "name": "Produto Econômico Roblox #41",
    "category": "Games",
    "subcategory": "Roblox",
    "supplier": "GameMarket",
    "costPrice": 2.5,
    "salePrice": 4.13,
    "imageUrl": "https://cdn.simpleicons.org/roblox/FFFFFF",
    "benefits": [
      "Base: R$ 2,50",
      "Valor de venda editavel",
      "Subcategoria Roblox"
    ],
    "deliverable": "Referencia fornecedor - Produto Econômico Roblox #41",
    "addedToStore": false
  },
  {
    "id": "gm-42-produto-economico-minecraft-42",
    "name": "Produto Econômico Minecraft #42",
    "category": "Games",
    "subcategory": "Minecraft",
    "supplier": "GameMarket",
    "costPrice": 5,
    "salePrice": 8.25,
    "imageUrl": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22520%22%20viewBox%3D%220%200%20800%20520%22%20data-storefy-brand-cover%3D%221%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20stop-color%3D%22%2311250f%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%233ca63c%22%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%22s%22%3E%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2222%22%20stdDeviation%3D%2222%22%20flood-color%3D%22%23000%22%20flood-opacity%3D%22.45%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%22520%22%20rx%3D%2236%22%20fill%3D%22url(%23g)%22%2F%3E%3Ccircle%20cx%3D%22665%22%20cy%3D%2278%22%20r%3D%22158%22%20fill%3D%22%23fff%22%20opacity%3D%22.08%22%2F%3E%3Ccircle%20cx%3D%22118%22%20cy%3D%22430%22%20r%3D%22190%22%20fill%3D%22%23fff%22%20opacity%3D%22.06%22%2F%3E%3Crect%20x%3D%2256%22%20y%3D%2256%22%20width%3D%22688%22%20height%3D%22408%22%20rx%3D%2230%22%20fill%3D%22%23000%22%20opacity%3D%22.18%22%20stroke%3D%22%23fff%22%20stroke-opacity%3D%22.14%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22255%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22900%22%20fill%3D%22%23ffffff%22%20filter%3D%22url(%23s)%22%3EMINECRAFT%3C%2Ftext%3E%3Crect%20x%3D%22240%22%20y%3D%22330%22%20width%3D%22320%22%20height%3D%227%22%20rx%3D%223.5%22%20fill%3D%22%237dd957%22%20opacity%3D%22.9%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22386%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22800%22%20letter-spacing%3D%225%22%20fill%3D%22%23fff%22%20opacity%3D%22.72%22%3ESTOREFY%20OFERTA%20DIGITAL%3C%2Ftext%3E%3C%2Fsvg%3E",
    "benefits": [
      "Base: R$ 5,00",
      "Valor de venda editavel",
      "Subcategoria Minecraft"
    ],
    "deliverable": "Referencia fornecedor - Produto Econômico Minecraft #42",
    "addedToStore": false
  },
  {
    "id": "gm-43-produto-economico-valorant-43",
    "name": "Produto Econômico Valorant #43",
    "category": "Games",
    "subcategory": "Valorant",
    "supplier": "GameMarket",
    "costPrice": 7.9,
    "salePrice": 13.04,
    "imageUrl": "https://cdn.simpleicons.org/valorant/FA4454",
    "benefits": [
      "Base: R$ 7,90",
      "Valor de venda editavel",
      "Subcategoria Valorant"
    ],
    "deliverable": "Referencia fornecedor - Produto Econômico Valorant #43",
    "addedToStore": false
  },
  {
    "id": "gm-44-produto-economico-league-of-legends-44",
    "name": "Produto Econômico League of Legends #44",
    "category": "Games",
    "subcategory": "League of Legends",
    "supplier": "GameMarket",
    "costPrice": 9.99,
    "salePrice": 16.48,
    "imageUrl": "https://cdn.simpleicons.org/leagueoflegends/C89B3C",
    "benefits": [
      "Base: R$ 9,99",
      "Valor de venda editavel",
      "Subcategoria League of Legends"
    ],
    "deliverable": "Referencia fornecedor - Produto Econômico League of Legends #44",
    "addedToStore": false
  },
  {
    "id": "gm-45-produto-economico-efootball-45",
    "name": "Produto Econômico eFootball #45",
    "category": "Games",
    "subcategory": "eFootball",
    "supplier": "GameMarket",
    "costPrice": 12.5,
    "salePrice": 20.63,
    "imageUrl": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22520%22%20viewBox%3D%220%200%20800%20520%22%20data-storefy-brand-cover%3D%221%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20stop-color%3D%22%23061020%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23034ea2%22%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%22s%22%3E%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2222%22%20stdDeviation%3D%2222%22%20flood-color%3D%22%23000%22%20flood-opacity%3D%22.45%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%22520%22%20rx%3D%2236%22%20fill%3D%22url(%23g)%22%2F%3E%3Ccircle%20cx%3D%22665%22%20cy%3D%2278%22%20r%3D%22158%22%20fill%3D%22%23fff%22%20opacity%3D%22.08%22%2F%3E%3Ccircle%20cx%3D%22118%22%20cy%3D%22430%22%20r%3D%22190%22%20fill%3D%22%23fff%22%20opacity%3D%22.06%22%2F%3E%3Crect%20x%3D%2256%22%20y%3D%2256%22%20width%3D%22688%22%20height%3D%22408%22%20rx%3D%2230%22%20fill%3D%22%23000%22%20opacity%3D%22.18%22%20stroke%3D%22%23fff%22%20stroke-opacity%3D%22.14%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22255%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22900%22%20fill%3D%22%23fef200%22%20filter%3D%22url(%23s)%22%3EeFootball%3C%2Ftext%3E%3Crect%20x%3D%22240%22%20y%3D%22330%22%20width%3D%22320%22%20height%3D%227%22%20rx%3D%223.5%22%20fill%3D%22%23fef200%22%20opacity%3D%22.9%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22386%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22800%22%20letter-spacing%3D%225%22%20fill%3D%22%23fff%22%20opacity%3D%22.72%22%3ESTOREFY%20OFERTA%20DIGITAL%3C%2Ftext%3E%3C%2Fsvg%3E",
    "benefits": [
      "Base: R$ 12,50",
      "Valor de venda editavel",
      "Subcategoria eFootball"
    ],
    "deliverable": "Referencia fornecedor - Produto Econômico eFootball #45",
    "addedToStore": false
  },
  {
    "id": "gm-46-produto-economico-redes-sociais-46",
    "name": "Produto Econômico Redes Sociais #46",
    "category": "Redes Sociais",
    "subcategory": "Redes Sociais",
    "supplier": "GameMarket",
    "costPrice": 15,
    "salePrice": 24.75,
    "imageUrl": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22520%22%20viewBox%3D%220%200%20800%20520%22%20data-storefy-brand-cover%3D%221%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20stop-color%3D%22%23151024%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23db2777%22%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%22s%22%3E%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2222%22%20stdDeviation%3D%2222%22%20flood-color%3D%22%23000%22%20flood-opacity%3D%22.45%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%22520%22%20rx%3D%2236%22%20fill%3D%22url(%23g)%22%2F%3E%3Ccircle%20cx%3D%22665%22%20cy%3D%2278%22%20r%3D%22158%22%20fill%3D%22%23fff%22%20opacity%3D%22.08%22%2F%3E%3Ccircle%20cx%3D%22118%22%20cy%3D%22430%22%20r%3D%22190%22%20fill%3D%22%23fff%22%20opacity%3D%22.06%22%2F%3E%3Crect%20x%3D%2256%22%20y%3D%2256%22%20width%3D%22688%22%20height%3D%22408%22%20rx%3D%2230%22%20fill%3D%22%23000%22%20opacity%3D%22.18%22%20stroke%3D%22%23fff%22%20stroke-opacity%3D%22.14%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22255%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22900%22%20fill%3D%22%23ffffff%22%20filter%3D%22url(%23s)%22%3ESocial%20Pack%3C%2Ftext%3E%3Crect%20x%3D%22240%22%20y%3D%22330%22%20width%3D%22320%22%20height%3D%227%22%20rx%3D%223.5%22%20fill%3D%22%2338bdf8%22%20opacity%3D%22.9%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22386%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22800%22%20letter-spacing%3D%225%22%20fill%3D%22%23fff%22%20opacity%3D%22.72%22%3ESTOREFY%20OFERTA%20DIGITAL%3C%2Ftext%3E%3C%2Fsvg%3E",
    "benefits": [
      "Base: R$ 15,00",
      "Valor de venda editavel",
      "Subcategoria Redes Sociais"
    ],
    "deliverable": "Referencia fornecedor - Produto Econômico Redes Sociais #46",
    "addedToStore": false
  },
  {
    "id": "gm-47-produto-economico-steam-47",
    "name": "Produto Econômico Steam #47",
    "category": "Games",
    "subcategory": "Steam",
    "supplier": "GameMarket",
    "costPrice": 19.9,
    "salePrice": 32.83,
    "imageUrl": "https://cdn.simpleicons.org/steam/FFFFFF",
    "benefits": [
      "Base: R$ 19,90",
      "Valor de venda editavel",
      "Subcategoria Steam"
    ],
    "deliverable": "Referencia fornecedor - Produto Econômico Steam #47",
    "addedToStore": false
  },
  {
    "id": "gm-48-produto-economico-free-fire-48",
    "name": "Produto Econômico Free Fire #48",
    "category": "Games",
    "subcategory": "Free Fire",
    "supplier": "GameMarket",
    "costPrice": 1,
    "salePrice": 1.65,
    "imageUrl": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22520%22%20viewBox%3D%220%200%20800%20520%22%20data-storefy-brand-cover%3D%221%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20stop-color%3D%22%23120400%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23f97316%22%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%22s%22%3E%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2222%22%20stdDeviation%3D%2222%22%20flood-color%3D%22%23000%22%20flood-opacity%3D%22.45%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%22520%22%20rx%3D%2236%22%20fill%3D%22url(%23g)%22%2F%3E%3Ccircle%20cx%3D%22665%22%20cy%3D%2278%22%20r%3D%22158%22%20fill%3D%22%23fff%22%20opacity%3D%22.08%22%2F%3E%3Ccircle%20cx%3D%22118%22%20cy%3D%22430%22%20r%3D%22190%22%20fill%3D%22%23fff%22%20opacity%3D%22.06%22%2F%3E%3Crect%20x%3D%2256%22%20y%3D%2256%22%20width%3D%22688%22%20height%3D%22408%22%20rx%3D%2230%22%20fill%3D%22%23000%22%20opacity%3D%22.18%22%20stroke%3D%22%23fff%22%20stroke-opacity%3D%22.14%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22255%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22900%22%20fill%3D%22%23ffffff%22%20filter%3D%22url(%23s)%22%3EFREE%20FIRE%3C%2Ftext%3E%3Crect%20x%3D%22240%22%20y%3D%22330%22%20width%3D%22320%22%20height%3D%227%22%20rx%3D%223.5%22%20fill%3D%22%23facc15%22%20opacity%3D%22.9%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22386%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22800%22%20letter-spacing%3D%225%22%20fill%3D%22%23fff%22%20opacity%3D%22.72%22%3ESTOREFY%20OFERTA%20DIGITAL%3C%2Ftext%3E%3C%2Fsvg%3E",
    "benefits": [
      "Base: R$ 1,00",
      "Valor de venda editavel",
      "Subcategoria Free Fire"
    ],
    "deliverable": "Referencia fornecedor - Produto Econômico Free Fire #48",
    "addedToStore": false
  },
  {
    "id": "gm-49-produto-economico-roblox-49",
    "name": "Produto Econômico Roblox #49",
    "category": "Games",
    "subcategory": "Roblox",
    "supplier": "GameMarket",
    "costPrice": 2.5,
    "salePrice": 4.13,
    "imageUrl": "https://cdn.simpleicons.org/roblox/FFFFFF",
    "benefits": [
      "Base: R$ 2,50",
      "Valor de venda editavel",
      "Subcategoria Roblox"
    ],
    "deliverable": "Referencia fornecedor - Produto Econômico Roblox #49",
    "addedToStore": false
  },
  {
    "id": "gm-50-produto-economico-minecraft-50",
    "name": "Produto Econômico Minecraft #50",
    "category": "Games",
    "subcategory": "Minecraft",
    "supplier": "GameMarket",
    "costPrice": 5,
    "salePrice": 8.25,
    "imageUrl": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22520%22%20viewBox%3D%220%200%20800%20520%22%20data-storefy-brand-cover%3D%221%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20stop-color%3D%22%2311250f%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%233ca63c%22%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%22s%22%3E%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2222%22%20stdDeviation%3D%2222%22%20flood-color%3D%22%23000%22%20flood-opacity%3D%22.45%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%22520%22%20rx%3D%2236%22%20fill%3D%22url(%23g)%22%2F%3E%3Ccircle%20cx%3D%22665%22%20cy%3D%2278%22%20r%3D%22158%22%20fill%3D%22%23fff%22%20opacity%3D%22.08%22%2F%3E%3Ccircle%20cx%3D%22118%22%20cy%3D%22430%22%20r%3D%22190%22%20fill%3D%22%23fff%22%20opacity%3D%22.06%22%2F%3E%3Crect%20x%3D%2256%22%20y%3D%2256%22%20width%3D%22688%22%20height%3D%22408%22%20rx%3D%2230%22%20fill%3D%22%23000%22%20opacity%3D%22.18%22%20stroke%3D%22%23fff%22%20stroke-opacity%3D%22.14%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22255%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22900%22%20fill%3D%22%23ffffff%22%20filter%3D%22url(%23s)%22%3EMINECRAFT%3C%2Ftext%3E%3Crect%20x%3D%22240%22%20y%3D%22330%22%20width%3D%22320%22%20height%3D%227%22%20rx%3D%223.5%22%20fill%3D%22%237dd957%22%20opacity%3D%22.9%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22386%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22800%22%20letter-spacing%3D%225%22%20fill%3D%22%23fff%22%20opacity%3D%22.72%22%3ESTOREFY%20OFERTA%20DIGITAL%3C%2Ftext%3E%3C%2Fsvg%3E",
    "benefits": [
      "Base: R$ 5,00",
      "Valor de venda editavel",
      "Subcategoria Minecraft"
    ],
    "deliverable": "Referencia fornecedor - Produto Econômico Minecraft #50",
    "addedToStore": false
  },
  {
    "id": "gm-51-personagem-alok-free-fire-promo-51",
    "name": "Personagem Alok - Free Fire Promo #51",
    "category": "Games",
    "subcategory": "Free Fire",
    "supplier": "GameMarket",
    "costPrice": 20.75,
    "salePrice": 34.24,
    "imageUrl": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22520%22%20viewBox%3D%220%200%20800%20520%22%20data-storefy-brand-cover%3D%221%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20stop-color%3D%22%23120400%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23f97316%22%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%22s%22%3E%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2222%22%20stdDeviation%3D%2222%22%20flood-color%3D%22%23000%22%20flood-opacity%3D%22.45%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%22520%22%20rx%3D%2236%22%20fill%3D%22url(%23g)%22%2F%3E%3Ccircle%20cx%3D%22665%22%20cy%3D%2278%22%20r%3D%22158%22%20fill%3D%22%23fff%22%20opacity%3D%22.08%22%2F%3E%3Ccircle%20cx%3D%22118%22%20cy%3D%22430%22%20r%3D%22190%22%20fill%3D%22%23fff%22%20opacity%3D%22.06%22%2F%3E%3Crect%20x%3D%2256%22%20y%3D%2256%22%20width%3D%22688%22%20height%3D%22408%22%20rx%3D%2230%22%20fill%3D%22%23000%22%20opacity%3D%22.18%22%20stroke%3D%22%23fff%22%20stroke-opacity%3D%22.14%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22255%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22900%22%20fill%3D%22%23ffffff%22%20filter%3D%22url(%23s)%22%3EFREE%20FIRE%3C%2Ftext%3E%3Crect%20x%3D%22240%22%20y%3D%22330%22%20width%3D%22320%22%20height%3D%227%22%20rx%3D%223.5%22%20fill%3D%22%23facc15%22%20opacity%3D%22.9%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22386%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22800%22%20letter-spacing%3D%225%22%20fill%3D%22%23fff%22%20opacity%3D%22.72%22%3ESTOREFY%20OFERTA%20DIGITAL%3C%2Ftext%3E%3C%2Fsvg%3E",
    "benefits": [
      "Base: R$ 20,75",
      "Valor de venda editavel",
      "Subcategoria Free Fire"
    ],
    "deliverable": "Referencia fornecedor - Personagem Alok - Free Fire Promo #51",
    "addedToStore": false
  },
  {
    "id": "gm-52-gp-infinito-servico-efootball-promo-52",
    "name": "GP Infinito (Serviço) - eFootball Promo #52",
    "category": "Games",
    "subcategory": "eFootball",
    "supplier": "GameMarket",
    "costPrice": 4.92,
    "salePrice": 8.12,
    "imageUrl": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22520%22%20viewBox%3D%220%200%20800%20520%22%20data-storefy-brand-cover%3D%221%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20stop-color%3D%22%23061020%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23034ea2%22%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%22s%22%3E%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2222%22%20stdDeviation%3D%2222%22%20flood-color%3D%22%23000%22%20flood-opacity%3D%22.45%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%22520%22%20rx%3D%2236%22%20fill%3D%22url(%23g)%22%2F%3E%3Ccircle%20cx%3D%22665%22%20cy%3D%2278%22%20r%3D%22158%22%20fill%3D%22%23fff%22%20opacity%3D%22.08%22%2F%3E%3Ccircle%20cx%3D%22118%22%20cy%3D%22430%22%20r%3D%22190%22%20fill%3D%22%23fff%22%20opacity%3D%22.06%22%2F%3E%3Crect%20x%3D%2256%22%20y%3D%2256%22%20width%3D%22688%22%20height%3D%22408%22%20rx%3D%2230%22%20fill%3D%22%23000%22%20opacity%3D%22.18%22%20stroke%3D%22%23fff%22%20stroke-opacity%3D%22.14%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22255%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22900%22%20fill%3D%22%23fef200%22%20filter%3D%22url(%23s)%22%3EeFootball%3C%2Ftext%3E%3Crect%20x%3D%22240%22%20y%3D%22330%22%20width%3D%22320%22%20height%3D%227%22%20rx%3D%223.5%22%20fill%3D%22%23fef200%22%20opacity%3D%22.9%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22386%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22800%22%20letter-spacing%3D%225%22%20fill%3D%22%23fff%22%20opacity%3D%22.72%22%3ESTOREFY%20OFERTA%20DIGITAL%3C%2Ftext%3E%3C%2Fsvg%3E",
    "benefits": [
      "Base: R$ 4,92",
      "Valor de venda editavel",
      "Subcategoria eFootball"
    ],
    "deliverable": "Referencia fornecedor - GP Infinito (Serviço) - eFootball Promo #52",
    "addedToStore": false
  },
  {
    "id": "gm-53-pets-adopt-me-roblox-promo-53",
    "name": "Pets Adopt Me - Roblox Promo #53",
    "category": "Games",
    "subcategory": "Roblox",
    "supplier": "GameMarket",
    "costPrice": 4.9,
    "salePrice": 8.09,
    "imageUrl": "https://cdn.simpleicons.org/roblox/FFFFFF",
    "benefits": [
      "Base: R$ 4,90",
      "Valor de venda editavel",
      "Subcategoria Roblox"
    ],
    "deliverable": "Referencia fornecedor - Pets Adopt Me - Roblox Promo #53",
    "addedToStore": false
  },
  {
    "id": "gm-54-diamantes-100-free-fire-promo-54",
    "name": "Diamantes 100 - Free Fire Promo #54",
    "category": "Games",
    "subcategory": "Free Fire",
    "supplier": "GameMarket",
    "costPrice": 27.68,
    "salePrice": 45.67,
    "imageUrl": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22520%22%20viewBox%3D%220%200%20800%20520%22%20data-storefy-brand-cover%3D%221%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20stop-color%3D%22%23120400%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23f97316%22%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%22s%22%3E%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2222%22%20stdDeviation%3D%2222%22%20flood-color%3D%22%23000%22%20flood-opacity%3D%22.45%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%22520%22%20rx%3D%2236%22%20fill%3D%22url(%23g)%22%2F%3E%3Ccircle%20cx%3D%22665%22%20cy%3D%2278%22%20r%3D%22158%22%20fill%3D%22%23fff%22%20opacity%3D%22.08%22%2F%3E%3Ccircle%20cx%3D%22118%22%20cy%3D%22430%22%20r%3D%22190%22%20fill%3D%22%23fff%22%20opacity%3D%22.06%22%2F%3E%3Crect%20x%3D%2256%22%20y%3D%2256%22%20width%3D%22688%22%20height%3D%22408%22%20rx%3D%2230%22%20fill%3D%22%23000%22%20opacity%3D%22.18%22%20stroke%3D%22%23fff%22%20stroke-opacity%3D%22.14%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22255%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22900%22%20fill%3D%22%23ffffff%22%20filter%3D%22url(%23s)%22%3EFREE%20FIRE%3C%2Ftext%3E%3Crect%20x%3D%22240%22%20y%3D%22330%22%20width%3D%22320%22%20height%3D%227%22%20rx%3D%223.5%22%20fill%3D%22%23facc15%22%20opacity%3D%22.9%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22386%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22800%22%20letter-spacing%3D%225%22%20fill%3D%22%23fff%22%20opacity%3D%22.72%22%3ESTOREFY%20OFERTA%20DIGITAL%3C%2Ftext%3E%3C%2Fsvg%3E",
    "benefits": [
      "Base: R$ 27,68",
      "Valor de venda editavel",
      "Subcategoria Free Fire"
    ],
    "deliverable": "Referencia fornecedor - Diamantes 100 - Free Fire Promo #54",
    "addedToStore": false
  },
  {
    "id": "gm-55-500-curtidas-tiktok-redes-sociais-promo-55",
    "name": "500 Curtidas TikTok - Redes Sociais Promo #55",
    "category": "Redes Sociais",
    "subcategory": "TikTok",
    "supplier": "GameMarket",
    "costPrice": 26.13,
    "salePrice": 43.11,
    "imageUrl": "https://cdn.simpleicons.org/tiktok/FFFFFF",
    "benefits": [
      "Base: R$ 26,13",
      "Valor de venda editavel",
      "Subcategoria TikTok"
    ],
    "deliverable": "Referencia fornecedor - 500 Curtidas TikTok - Redes Sociais Promo #55",
    "addedToStore": false
  },
  {
    "id": "gm-56-diamantes-100-free-fire-promo-56",
    "name": "Diamantes 100 - Free Fire Promo #56",
    "category": "Games",
    "subcategory": "Free Fire",
    "supplier": "GameMarket",
    "costPrice": 15.1,
    "salePrice": 24.91,
    "imageUrl": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22520%22%20viewBox%3D%220%200%20800%20520%22%20data-storefy-brand-cover%3D%221%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20stop-color%3D%22%23120400%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23f97316%22%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%22s%22%3E%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2222%22%20stdDeviation%3D%2222%22%20flood-color%3D%22%23000%22%20flood-opacity%3D%22.45%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%22520%22%20rx%3D%2236%22%20fill%3D%22url(%23g)%22%2F%3E%3Ccircle%20cx%3D%22665%22%20cy%3D%2278%22%20r%3D%22158%22%20fill%3D%22%23fff%22%20opacity%3D%22.08%22%2F%3E%3Ccircle%20cx%3D%22118%22%20cy%3D%22430%22%20r%3D%22190%22%20fill%3D%22%23fff%22%20opacity%3D%22.06%22%2F%3E%3Crect%20x%3D%2256%22%20y%3D%2256%22%20width%3D%22688%22%20height%3D%22408%22%20rx%3D%2230%22%20fill%3D%22%23000%22%20opacity%3D%22.18%22%20stroke%3D%22%23fff%22%20stroke-opacity%3D%22.14%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22255%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22900%22%20fill%3D%22%23ffffff%22%20filter%3D%22url(%23s)%22%3EFREE%20FIRE%3C%2Ftext%3E%3Crect%20x%3D%22240%22%20y%3D%22330%22%20width%3D%22320%22%20height%3D%227%22%20rx%3D%223.5%22%20fill%3D%22%23facc15%22%20opacity%3D%22.9%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22386%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22800%22%20letter-spacing%3D%225%22%20fill%3D%22%23fff%22%20opacity%3D%22.72%22%3ESTOREFY%20OFERTA%20DIGITAL%3C%2Ftext%3E%3C%2Fsvg%3E",
    "benefits": [
      "Base: R$ 15,10",
      "Valor de venda editavel",
      "Subcategoria Free Fire"
    ],
    "deliverable": "Referencia fornecedor - Diamantes 100 - Free Fire Promo #56",
    "addedToStore": false
  },
  {
    "id": "gm-57-1000-seguidores-instagram-redes-sociais-promo-57",
    "name": "1000 Seguidores Instagram - Redes Sociais Promo #57",
    "category": "Redes Sociais",
    "subcategory": "Instagram",
    "supplier": "GameMarket",
    "costPrice": 29.19,
    "salePrice": 48.16,
    "imageUrl": "https://cdn.simpleicons.org/instagram/E4405F",
    "benefits": [
      "Base: R$ 29,19",
      "Valor de venda editavel",
      "Subcategoria Instagram"
    ],
    "deliverable": "Referencia fornecedor - 1000 Seguidores Instagram - Redes Sociais Promo #57",
    "addedToStore": false
  },
  {
    "id": "gm-58-diamantes-100-free-fire-promo-58",
    "name": "Diamantes 100 - Free Fire Promo #58",
    "category": "Games",
    "subcategory": "Free Fire",
    "supplier": "GameMarket",
    "costPrice": 17.65,
    "salePrice": 29.12,
    "imageUrl": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22520%22%20viewBox%3D%220%200%20800%20520%22%20data-storefy-brand-cover%3D%221%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20stop-color%3D%22%23120400%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23f97316%22%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%22s%22%3E%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2222%22%20stdDeviation%3D%2222%22%20flood-color%3D%22%23000%22%20flood-opacity%3D%22.45%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%22520%22%20rx%3D%2236%22%20fill%3D%22url(%23g)%22%2F%3E%3Ccircle%20cx%3D%22665%22%20cy%3D%2278%22%20r%3D%22158%22%20fill%3D%22%23fff%22%20opacity%3D%22.08%22%2F%3E%3Ccircle%20cx%3D%22118%22%20cy%3D%22430%22%20r%3D%22190%22%20fill%3D%22%23fff%22%20opacity%3D%22.06%22%2F%3E%3Crect%20x%3D%2256%22%20y%3D%2256%22%20width%3D%22688%22%20height%3D%22408%22%20rx%3D%2230%22%20fill%3D%22%23000%22%20opacity%3D%22.18%22%20stroke%3D%22%23fff%22%20stroke-opacity%3D%22.14%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22255%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22900%22%20fill%3D%22%23ffffff%22%20filter%3D%22url(%23s)%22%3EFREE%20FIRE%3C%2Ftext%3E%3Crect%20x%3D%22240%22%20y%3D%22330%22%20width%3D%22320%22%20height%3D%227%22%20rx%3D%223.5%22%20fill%3D%22%23facc15%22%20opacity%3D%22.9%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22386%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22800%22%20letter-spacing%3D%225%22%20fill%3D%22%23fff%22%20opacity%3D%22.72%22%3ESTOREFY%20OFERTA%20DIGITAL%3C%2Ftext%3E%3C%2Fsvg%3E",
    "benefits": [
      "Base: R$ 17,65",
      "Valor de venda editavel",
      "Subcategoria Free Fire"
    ],
    "deliverable": "Referencia fornecedor - Diamantes 100 - Free Fire Promo #58",
    "addedToStore": false
  },
  {
    "id": "gm-59-treinamento-de-jogador-efootball-promo-59",
    "name": "Treinamento de Jogador - eFootball Promo #59",
    "category": "Games",
    "subcategory": "eFootball",
    "supplier": "GameMarket",
    "costPrice": 15.61,
    "salePrice": 25.76,
    "imageUrl": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22520%22%20viewBox%3D%220%200%20800%20520%22%20data-storefy-brand-cover%3D%221%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20stop-color%3D%22%23061020%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23034ea2%22%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%22s%22%3E%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2222%22%20stdDeviation%3D%2222%22%20flood-color%3D%22%23000%22%20flood-opacity%3D%22.45%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%22520%22%20rx%3D%2236%22%20fill%3D%22url(%23g)%22%2F%3E%3Ccircle%20cx%3D%22665%22%20cy%3D%2278%22%20r%3D%22158%22%20fill%3D%22%23fff%22%20opacity%3D%22.08%22%2F%3E%3Ccircle%20cx%3D%22118%22%20cy%3D%22430%22%20r%3D%22190%22%20fill%3D%22%23fff%22%20opacity%3D%22.06%22%2F%3E%3Crect%20x%3D%2256%22%20y%3D%2256%22%20width%3D%22688%22%20height%3D%22408%22%20rx%3D%2230%22%20fill%3D%22%23000%22%20opacity%3D%22.18%22%20stroke%3D%22%23fff%22%20stroke-opacity%3D%22.14%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22255%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22900%22%20fill%3D%22%23fef200%22%20filter%3D%22url(%23s)%22%3EeFootball%3C%2Ftext%3E%3Crect%20x%3D%22240%22%20y%3D%22330%22%20width%3D%22320%22%20height%3D%227%22%20rx%3D%223.5%22%20fill%3D%22%23fef200%22%20opacity%3D%22.9%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22386%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22800%22%20letter-spacing%3D%225%22%20fill%3D%22%23fff%22%20opacity%3D%22.72%22%3ESTOREFY%20OFERTA%20DIGITAL%3C%2Ftext%3E%3C%2Fsvg%3E",
    "benefits": [
      "Base: R$ 15,61",
      "Valor de venda editavel",
      "Subcategoria eFootball"
    ],
    "deliverable": "Referencia fornecedor - Treinamento de Jogador - eFootball Promo #59",
    "addedToStore": false
  },
  {
    "id": "gm-60-contas-com-lendas-efootball-promo-60",
    "name": "Contas com Lendas - eFootball Promo #60",
    "category": "Games",
    "subcategory": "eFootball",
    "supplier": "GameMarket",
    "costPrice": 2.37,
    "salePrice": 3.91,
    "imageUrl": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22520%22%20viewBox%3D%220%200%20800%20520%22%20data-storefy-brand-cover%3D%221%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20stop-color%3D%22%23061020%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23034ea2%22%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%22s%22%3E%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2222%22%20stdDeviation%3D%2222%22%20flood-color%3D%22%23000%22%20flood-opacity%3D%22.45%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%22520%22%20rx%3D%2236%22%20fill%3D%22url(%23g)%22%2F%3E%3Ccircle%20cx%3D%22665%22%20cy%3D%2278%22%20r%3D%22158%22%20fill%3D%22%23fff%22%20opacity%3D%22.08%22%2F%3E%3Ccircle%20cx%3D%22118%22%20cy%3D%22430%22%20r%3D%22190%22%20fill%3D%22%23fff%22%20opacity%3D%22.06%22%2F%3E%3Crect%20x%3D%2256%22%20y%3D%2256%22%20width%3D%22688%22%20height%3D%22408%22%20rx%3D%2230%22%20fill%3D%22%23000%22%20opacity%3D%22.18%22%20stroke%3D%22%23fff%22%20stroke-opacity%3D%22.14%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22255%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22900%22%20fill%3D%22%23fef200%22%20filter%3D%22url(%23s)%22%3EeFootball%3C%2Ftext%3E%3Crect%20x%3D%22240%22%20y%3D%22330%22%20width%3D%22320%22%20height%3D%227%22%20rx%3D%223.5%22%20fill%3D%22%23fef200%22%20opacity%3D%22.9%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22386%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22800%22%20letter-spacing%3D%225%22%20fill%3D%22%23fff%22%20opacity%3D%22.72%22%3ESTOREFY%20OFERTA%20DIGITAL%3C%2Ftext%3E%3C%2Fsvg%3E",
    "benefits": [
      "Base: R$ 2,37",
      "Valor de venda editavel",
      "Subcategoria eFootball"
    ],
    "deliverable": "Referencia fornecedor - Contas com Lendas - eFootball Promo #60",
    "addedToStore": false
  },
  {
    "id": "gm-61-inscritos-youtube-redes-sociais-promo-61",
    "name": "Inscritos YouTube - Redes Sociais Promo #61",
    "category": "Redes Sociais",
    "subcategory": "YouTube",
    "supplier": "GameMarket",
    "costPrice": 11.29,
    "salePrice": 18.63,
    "imageUrl": "https://cdn.simpleicons.org/youtube/FF0000",
    "benefits": [
      "Base: R$ 11,29",
      "Valor de venda editavel",
      "Subcategoria YouTube"
    ],
    "deliverable": "Referencia fornecedor - Inscritos YouTube - Redes Sociais Promo #61",
    "addedToStore": false
  },
  {
    "id": "gm-62-skins-aleatorias-free-fire-promo-62",
    "name": "Skins Aleatórias - Free Fire Promo #62",
    "category": "Games",
    "subcategory": "Free Fire",
    "supplier": "GameMarket",
    "costPrice": 24.18,
    "salePrice": 39.9,
    "imageUrl": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22520%22%20viewBox%3D%220%200%20800%20520%22%20data-storefy-brand-cover%3D%221%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20stop-color%3D%22%23120400%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23f97316%22%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%22s%22%3E%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2222%22%20stdDeviation%3D%2222%22%20flood-color%3D%22%23000%22%20flood-opacity%3D%22.45%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%22520%22%20rx%3D%2236%22%20fill%3D%22url(%23g)%22%2F%3E%3Ccircle%20cx%3D%22665%22%20cy%3D%2278%22%20r%3D%22158%22%20fill%3D%22%23fff%22%20opacity%3D%22.08%22%2F%3E%3Ccircle%20cx%3D%22118%22%20cy%3D%22430%22%20r%3D%22190%22%20fill%3D%22%23fff%22%20opacity%3D%22.06%22%2F%3E%3Crect%20x%3D%2256%22%20y%3D%2256%22%20width%3D%22688%22%20height%3D%22408%22%20rx%3D%2230%22%20fill%3D%22%23000%22%20opacity%3D%22.18%22%20stroke%3D%22%23fff%22%20stroke-opacity%3D%22.14%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22255%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22900%22%20fill%3D%22%23ffffff%22%20filter%3D%22url(%23s)%22%3EFREE%20FIRE%3C%2Ftext%3E%3Crect%20x%3D%22240%22%20y%3D%22330%22%20width%3D%22320%22%20height%3D%227%22%20rx%3D%223.5%22%20fill%3D%22%23facc15%22%20opacity%3D%22.9%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22386%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22800%22%20letter-spacing%3D%225%22%20fill%3D%22%23fff%22%20opacity%3D%22.72%22%3ESTOREFY%20OFERTA%20DIGITAL%3C%2Ftext%3E%3C%2Fsvg%3E",
    "benefits": [
      "Base: R$ 24,18",
      "Valor de venda editavel",
      "Subcategoria Free Fire"
    ],
    "deliverable": "Referencia fornecedor - Skins Aleatórias - Free Fire Promo #62",
    "addedToStore": false
  },
  {
    "id": "gm-63-frutas-blox-fruits-roblox-promo-63",
    "name": "Frutas Blox Fruits - Roblox Promo #63",
    "category": "Games",
    "subcategory": "Roblox",
    "supplier": "GameMarket",
    "costPrice": 26.63,
    "salePrice": 43.94,
    "imageUrl": "https://cdn.simpleicons.org/roblox/FFFFFF",
    "benefits": [
      "Base: R$ 26,63",
      "Valor de venda editavel",
      "Subcategoria Roblox"
    ],
    "deliverable": "Referencia fornecedor - Frutas Blox Fruits - Roblox Promo #63",
    "addedToStore": false
  },
  {
    "id": "gm-64-cartas-colecionaveis-steam-promo-64",
    "name": "Cartas Colecionáveis - Steam Promo #64",
    "category": "Games",
    "subcategory": "Steam",
    "supplier": "GameMarket",
    "costPrice": 9.76,
    "salePrice": 16.1,
    "imageUrl": "https://cdn.simpleicons.org/steam/FFFFFF",
    "benefits": [
      "Base: R$ 9,76",
      "Valor de venda editavel",
      "Subcategoria Steam"
    ],
    "deliverable": "Referencia fornecedor - Cartas Colecionáveis - Steam Promo #64",
    "addedToStore": false
  },
  {
    "id": "gm-65-1000-seguidores-instagram-redes-sociais-promo-65",
    "name": "1000 Seguidores Instagram - Redes Sociais Promo #65",
    "category": "Redes Sociais",
    "subcategory": "Instagram",
    "supplier": "GameMarket",
    "costPrice": 3.01,
    "salePrice": 4.97,
    "imageUrl": "https://cdn.simpleicons.org/instagram/E4405F",
    "benefits": [
      "Base: R$ 3,01",
      "Valor de venda editavel",
      "Subcategoria Instagram"
    ],
    "deliverable": "Referencia fornecedor - 1000 Seguidores Instagram - Redes Sociais Promo #65",
    "addedToStore": false
  },
  {
    "id": "gm-66-gp-infinito-servico-efootball-promo-66",
    "name": "GP Infinito (Serviço) - eFootball Promo #66",
    "category": "Games",
    "subcategory": "eFootball",
    "supplier": "GameMarket",
    "costPrice": 28.11,
    "salePrice": 46.38,
    "imageUrl": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22520%22%20viewBox%3D%220%200%20800%20520%22%20data-storefy-brand-cover%3D%221%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20stop-color%3D%22%23061020%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23034ea2%22%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%22s%22%3E%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2222%22%20stdDeviation%3D%2222%22%20flood-color%3D%22%23000%22%20flood-opacity%3D%22.45%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%22520%22%20rx%3D%2236%22%20fill%3D%22url(%23g)%22%2F%3E%3Ccircle%20cx%3D%22665%22%20cy%3D%2278%22%20r%3D%22158%22%20fill%3D%22%23fff%22%20opacity%3D%22.08%22%2F%3E%3Ccircle%20cx%3D%22118%22%20cy%3D%22430%22%20r%3D%22190%22%20fill%3D%22%23fff%22%20opacity%3D%22.06%22%2F%3E%3Crect%20x%3D%2256%22%20y%3D%2256%22%20width%3D%22688%22%20height%3D%22408%22%20rx%3D%2230%22%20fill%3D%22%23000%22%20opacity%3D%22.18%22%20stroke%3D%22%23fff%22%20stroke-opacity%3D%22.14%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22255%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22900%22%20fill%3D%22%23fef200%22%20filter%3D%22url(%23s)%22%3EeFootball%3C%2Ftext%3E%3Crect%20x%3D%22240%22%20y%3D%22330%22%20width%3D%22320%22%20height%3D%227%22%20rx%3D%223.5%22%20fill%3D%22%23fef200%22%20opacity%3D%22.9%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22386%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22800%22%20letter-spacing%3D%225%22%20fill%3D%22%23fff%22%20opacity%3D%22.72%22%3ESTOREFY%20OFERTA%20DIGITAL%3C%2Ftext%3E%3C%2Fsvg%3E",
    "benefits": [
      "Base: R$ 28,11",
      "Valor de venda editavel",
      "Subcategoria eFootball"
    ],
    "deliverable": "Referencia fornecedor - GP Infinito (Serviço) - eFootball Promo #66",
    "addedToStore": false
  },
  {
    "id": "gm-67-frutas-blox-fruits-roblox-promo-67",
    "name": "Frutas Blox Fruits - Roblox Promo #67",
    "category": "Games",
    "subcategory": "Roblox",
    "supplier": "GameMarket",
    "costPrice": 8.78,
    "salePrice": 14.49,
    "imageUrl": "https://cdn.simpleicons.org/roblox/FFFFFF",
    "benefits": [
      "Base: R$ 8,78",
      "Valor de venda editavel",
      "Subcategoria Roblox"
    ],
    "deliverable": "Referencia fornecedor - Frutas Blox Fruits - Roblox Promo #67",
    "addedToStore": false
  },
  {
    "id": "gm-68-robux-400-roblox-promo-68",
    "name": "Robux 400 - Roblox Promo #68",
    "category": "Games",
    "subcategory": "Roblox",
    "supplier": "GameMarket",
    "costPrice": 20.81,
    "salePrice": 34.34,
    "imageUrl": "https://cdn.simpleicons.org/roblox/FFFFFF",
    "benefits": [
      "Base: R$ 20,81",
      "Valor de venda editavel",
      "Subcategoria Roblox"
    ],
    "deliverable": "Referencia fornecedor - Robux 400 - Roblox Promo #68",
    "addedToStore": false
  },
  {
    "id": "gm-69-contas-com-lendas-efootball-promo-69",
    "name": "Contas com Lendas - eFootball Promo #69",
    "category": "Games",
    "subcategory": "eFootball",
    "supplier": "GameMarket",
    "costPrice": 12.33,
    "salePrice": 20.34,
    "imageUrl": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22520%22%20viewBox%3D%220%200%20800%20520%22%20data-storefy-brand-cover%3D%221%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20stop-color%3D%22%23061020%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23034ea2%22%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%22s%22%3E%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2222%22%20stdDeviation%3D%2222%22%20flood-color%3D%22%23000%22%20flood-opacity%3D%22.45%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%22520%22%20rx%3D%2236%22%20fill%3D%22url(%23g)%22%2F%3E%3Ccircle%20cx%3D%22665%22%20cy%3D%2278%22%20r%3D%22158%22%20fill%3D%22%23fff%22%20opacity%3D%22.08%22%2F%3E%3Ccircle%20cx%3D%22118%22%20cy%3D%22430%22%20r%3D%22190%22%20fill%3D%22%23fff%22%20opacity%3D%22.06%22%2F%3E%3Crect%20x%3D%2256%22%20y%3D%2256%22%20width%3D%22688%22%20height%3D%22408%22%20rx%3D%2230%22%20fill%3D%22%23000%22%20opacity%3D%22.18%22%20stroke%3D%22%23fff%22%20stroke-opacity%3D%22.14%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22255%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22900%22%20fill%3D%22%23fef200%22%20filter%3D%22url(%23s)%22%3EeFootball%3C%2Ftext%3E%3Crect%20x%3D%22240%22%20y%3D%22330%22%20width%3D%22320%22%20height%3D%227%22%20rx%3D%223.5%22%20fill%3D%22%23fef200%22%20opacity%3D%22.9%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22386%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22800%22%20letter-spacing%3D%225%22%20fill%3D%22%23fff%22%20opacity%3D%22.72%22%3ESTOREFY%20OFERTA%20DIGITAL%3C%2Ftext%3E%3C%2Fsvg%3E",
    "benefits": [
      "Base: R$ 12,33",
      "Valor de venda editavel",
      "Subcategoria eFootball"
    ],
    "deliverable": "Referencia fornecedor - Contas com Lendas - eFootball Promo #69",
    "addedToStore": false
  },
  {
    "id": "gm-70-cartao-presente-r-20-free-fire-promo-70",
    "name": "Cartão Presente R$ 20 - Free Fire Promo #70",
    "category": "Games",
    "subcategory": "Free Fire",
    "supplier": "GameMarket",
    "costPrice": 11.37,
    "salePrice": 18.76,
    "imageUrl": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22520%22%20viewBox%3D%220%200%20800%20520%22%20data-storefy-brand-cover%3D%221%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20stop-color%3D%22%23120400%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23f97316%22%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%22s%22%3E%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2222%22%20stdDeviation%3D%2222%22%20flood-color%3D%22%23000%22%20flood-opacity%3D%22.45%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%22520%22%20rx%3D%2236%22%20fill%3D%22url(%23g)%22%2F%3E%3Ccircle%20cx%3D%22665%22%20cy%3D%2278%22%20r%3D%22158%22%20fill%3D%22%23fff%22%20opacity%3D%22.08%22%2F%3E%3Ccircle%20cx%3D%22118%22%20cy%3D%22430%22%20r%3D%22190%22%20fill%3D%22%23fff%22%20opacity%3D%22.06%22%2F%3E%3Crect%20x%3D%2256%22%20y%3D%2256%22%20width%3D%22688%22%20height%3D%22408%22%20rx%3D%2230%22%20fill%3D%22%23000%22%20opacity%3D%22.18%22%20stroke%3D%22%23fff%22%20stroke-opacity%3D%22.14%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22255%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22900%22%20fill%3D%22%23ffffff%22%20filter%3D%22url(%23s)%22%3EFREE%20FIRE%3C%2Ftext%3E%3Crect%20x%3D%22240%22%20y%3D%22330%22%20width%3D%22320%22%20height%3D%227%22%20rx%3D%223.5%22%20fill%3D%22%23facc15%22%20opacity%3D%22.9%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22386%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22800%22%20letter-spacing%3D%225%22%20fill%3D%22%23fff%22%20opacity%3D%22.72%22%3ESTOREFY%20OFERTA%20DIGITAL%3C%2Ftext%3E%3C%2Fsvg%3E",
    "benefits": [
      "Base: R$ 11,37",
      "Valor de venda editavel",
      "Subcategoria Free Fire"
    ],
    "deliverable": "Referencia fornecedor - Cartão Presente R$ 20 - Free Fire Promo #70",
    "addedToStore": false
  },
  {
    "id": "gm-71-membros-discord-redes-sociais-promo-71",
    "name": "Membros Discord - Redes Sociais Promo #71",
    "category": "Redes Sociais",
    "subcategory": "Discord",
    "supplier": "GameMarket",
    "costPrice": 28.9,
    "salePrice": 47.68,
    "imageUrl": "https://cdn.simpleicons.org/discord/5865F2",
    "benefits": [
      "Base: R$ 28,90",
      "Valor de venda editavel",
      "Subcategoria Discord"
    ],
    "deliverable": "Referencia fornecedor - Membros Discord - Redes Sociais Promo #71",
    "addedToStore": false
  },
  {
    "id": "gm-72-gp-infinito-servico-efootball-promo-72",
    "name": "GP Infinito (Serviço) - eFootball Promo #72",
    "category": "Games",
    "subcategory": "eFootball",
    "supplier": "GameMarket",
    "costPrice": 9.14,
    "salePrice": 15.08,
    "imageUrl": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22520%22%20viewBox%3D%220%200%20800%20520%22%20data-storefy-brand-cover%3D%221%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20stop-color%3D%22%23061020%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23034ea2%22%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%22s%22%3E%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2222%22%20stdDeviation%3D%2222%22%20flood-color%3D%22%23000%22%20flood-opacity%3D%22.45%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%22520%22%20rx%3D%2236%22%20fill%3D%22url(%23g)%22%2F%3E%3Ccircle%20cx%3D%22665%22%20cy%3D%2278%22%20r%3D%22158%22%20fill%3D%22%23fff%22%20opacity%3D%22.08%22%2F%3E%3Ccircle%20cx%3D%22118%22%20cy%3D%22430%22%20r%3D%22190%22%20fill%3D%22%23fff%22%20opacity%3D%22.06%22%2F%3E%3Crect%20x%3D%2256%22%20y%3D%2256%22%20width%3D%22688%22%20height%3D%22408%22%20rx%3D%2230%22%20fill%3D%22%23000%22%20opacity%3D%22.18%22%20stroke%3D%22%23fff%22%20stroke-opacity%3D%22.14%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22255%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22900%22%20fill%3D%22%23fef200%22%20filter%3D%22url(%23s)%22%3EeFootball%3C%2Ftext%3E%3Crect%20x%3D%22240%22%20y%3D%22330%22%20width%3D%22320%22%20height%3D%227%22%20rx%3D%223.5%22%20fill%3D%22%23fef200%22%20opacity%3D%22.9%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22386%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22800%22%20letter-spacing%3D%225%22%20fill%3D%22%23fff%22%20opacity%3D%22.72%22%3ESTOREFY%20OFERTA%20DIGITAL%3C%2Ftext%3E%3C%2Fsvg%3E",
    "benefits": [
      "Base: R$ 9,14",
      "Valor de venda editavel",
      "Subcategoria eFootball"
    ],
    "deliverable": "Referencia fornecedor - GP Infinito (Serviço) - eFootball Promo #72",
    "addedToStore": false
  },
  {
    "id": "gm-73-skins-aleatorias-free-fire-promo-73",
    "name": "Skins Aleatórias - Free Fire Promo #73",
    "category": "Games",
    "subcategory": "Free Fire",
    "supplier": "GameMarket",
    "costPrice": 8.99,
    "salePrice": 14.83,
    "imageUrl": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22520%22%20viewBox%3D%220%200%20800%20520%22%20data-storefy-brand-cover%3D%221%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20stop-color%3D%22%23120400%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23f97316%22%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%22s%22%3E%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2222%22%20stdDeviation%3D%2222%22%20flood-color%3D%22%23000%22%20flood-opacity%3D%22.45%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%22520%22%20rx%3D%2236%22%20fill%3D%22url(%23g)%22%2F%3E%3Ccircle%20cx%3D%22665%22%20cy%3D%2278%22%20r%3D%22158%22%20fill%3D%22%23fff%22%20opacity%3D%22.08%22%2F%3E%3Ccircle%20cx%3D%22118%22%20cy%3D%22430%22%20r%3D%22190%22%20fill%3D%22%23fff%22%20opacity%3D%22.06%22%2F%3E%3Crect%20x%3D%2256%22%20y%3D%2256%22%20width%3D%22688%22%20height%3D%22408%22%20rx%3D%2230%22%20fill%3D%22%23000%22%20opacity%3D%22.18%22%20stroke%3D%22%23fff%22%20stroke-opacity%3D%22.14%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22255%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22900%22%20fill%3D%22%23ffffff%22%20filter%3D%22url(%23s)%22%3EFREE%20FIRE%3C%2Ftext%3E%3Crect%20x%3D%22240%22%20y%3D%22330%22%20width%3D%22320%22%20height%3D%227%22%20rx%3D%223.5%22%20fill%3D%22%23facc15%22%20opacity%3D%22.9%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22386%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22800%22%20letter-spacing%3D%225%22%20fill%3D%22%23fff%22%20opacity%3D%22.72%22%3ESTOREFY%20OFERTA%20DIGITAL%3C%2Ftext%3E%3C%2Fsvg%3E",
    "benefits": [
      "Base: R$ 8,99",
      "Valor de venda editavel",
      "Subcategoria Free Fire"
    ],
    "deliverable": "Referencia fornecedor - Skins Aleatórias - Free Fire Promo #73",
    "addedToStore": false
  },
  {
    "id": "gm-74-skins-cs2-steam-promo-74",
    "name": "Skins CS2 - Steam Promo #74",
    "category": "Games",
    "subcategory": "Steam",
    "supplier": "GameMarket",
    "costPrice": 1.01,
    "salePrice": 1.67,
    "imageUrl": "https://cdn.simpleicons.org/steam/FFFFFF",
    "benefits": [
      "Base: R$ 1,01",
      "Valor de venda editavel",
      "Subcategoria Steam"
    ],
    "deliverable": "Referencia fornecedor - Skins CS2 - Steam Promo #74",
    "addedToStore": false
  },
  {
    "id": "gm-75-diamantes-100-free-fire-promo-75",
    "name": "Diamantes 100 - Free Fire Promo #75",
    "category": "Games",
    "subcategory": "Free Fire",
    "supplier": "GameMarket",
    "costPrice": 19.56,
    "salePrice": 32.27,
    "imageUrl": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22520%22%20viewBox%3D%220%200%20800%20520%22%20data-storefy-brand-cover%3D%221%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20stop-color%3D%22%23120400%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23f97316%22%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%22s%22%3E%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2222%22%20stdDeviation%3D%2222%22%20flood-color%3D%22%23000%22%20flood-opacity%3D%22.45%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%22520%22%20rx%3D%2236%22%20fill%3D%22url(%23g)%22%2F%3E%3Ccircle%20cx%3D%22665%22%20cy%3D%2278%22%20r%3D%22158%22%20fill%3D%22%23fff%22%20opacity%3D%22.08%22%2F%3E%3Ccircle%20cx%3D%22118%22%20cy%3D%22430%22%20r%3D%22190%22%20fill%3D%22%23fff%22%20opacity%3D%22.06%22%2F%3E%3Crect%20x%3D%2256%22%20y%3D%2256%22%20width%3D%22688%22%20height%3D%22408%22%20rx%3D%2230%22%20fill%3D%22%23000%22%20opacity%3D%22.18%22%20stroke%3D%22%23fff%22%20stroke-opacity%3D%22.14%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22255%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22900%22%20fill%3D%22%23ffffff%22%20filter%3D%22url(%23s)%22%3EFREE%20FIRE%3C%2Ftext%3E%3Crect%20x%3D%22240%22%20y%3D%22330%22%20width%3D%22320%22%20height%3D%227%22%20rx%3D%223.5%22%20fill%3D%22%23facc15%22%20opacity%3D%22.9%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22386%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22800%22%20letter-spacing%3D%225%22%20fill%3D%22%23fff%22%20opacity%3D%22.72%22%3ESTOREFY%20OFERTA%20DIGITAL%3C%2Ftext%3E%3C%2Fsvg%3E",
    "benefits": [
      "Base: R$ 19,56",
      "Valor de venda editavel",
      "Subcategoria Free Fire"
    ],
    "deliverable": "Referencia fornecedor - Diamantes 100 - Free Fire Promo #75",
    "addedToStore": false
  },
  {
    "id": "gm-76-key-aleatoria-gold-steam-promo-76",
    "name": "Key Aleatória Gold - Steam Promo #76",
    "category": "Games",
    "subcategory": "Steam",
    "supplier": "GameMarket",
    "costPrice": 15.5,
    "salePrice": 25.57,
    "imageUrl": "https://cdn.simpleicons.org/steam/FFFFFF",
    "benefits": [
      "Base: R$ 15,50",
      "Valor de venda editavel",
      "Subcategoria Steam"
    ],
    "deliverable": "Referencia fornecedor - Key Aleatória Gold - Steam Promo #76",
    "addedToStore": false
  },
  {
    "id": "gm-77-key-aleatoria-gold-steam-promo-77",
    "name": "Key Aleatória Gold - Steam Promo #77",
    "category": "Games",
    "subcategory": "Steam",
    "supplier": "GameMarket",
    "costPrice": 22.82,
    "salePrice": 37.65,
    "imageUrl": "https://cdn.simpleicons.org/steam/FFFFFF",
    "benefits": [
      "Base: R$ 22,82",
      "Valor de venda editavel",
      "Subcategoria Steam"
    ],
    "deliverable": "Referencia fornecedor - Key Aleatória Gold - Steam Promo #77",
    "addedToStore": false
  },
  {
    "id": "gm-78-frutas-blox-fruits-roblox-promo-78",
    "name": "Frutas Blox Fruits - Roblox Promo #78",
    "category": "Games",
    "subcategory": "Roblox",
    "supplier": "GameMarket",
    "costPrice": 28.95,
    "salePrice": 47.77,
    "imageUrl": "https://cdn.simpleicons.org/roblox/FFFFFF",
    "benefits": [
      "Base: R$ 28,95",
      "Valor de venda editavel",
      "Subcategoria Roblox"
    ],
    "deliverable": "Referencia fornecedor - Frutas Blox Fruits - Roblox Promo #78",
    "addedToStore": false
  },
  {
    "id": "gm-79-gift-card-r-10-steam-promo-79",
    "name": "Gift Card R$ 10 - Steam Promo #79",
    "category": "Games",
    "subcategory": "Steam",
    "supplier": "GameMarket",
    "costPrice": 22.08,
    "salePrice": 36.43,
    "imageUrl": "https://cdn.simpleicons.org/steam/FFFFFF",
    "benefits": [
      "Base: R$ 22,08",
      "Valor de venda editavel",
      "Subcategoria Steam"
    ],
    "deliverable": "Referencia fornecedor - Gift Card R$ 10 - Steam Promo #79",
    "addedToStore": false
  },
  {
    "id": "gm-80-inscritos-youtube-redes-sociais-promo-80",
    "name": "Inscritos YouTube - Redes Sociais Promo #80",
    "category": "Redes Sociais",
    "subcategory": "YouTube",
    "supplier": "GameMarket",
    "costPrice": 18.49,
    "salePrice": 30.51,
    "imageUrl": "https://cdn.simpleicons.org/youtube/FF0000",
    "benefits": [
      "Base: R$ 18,49",
      "Valor de venda editavel",
      "Subcategoria YouTube"
    ],
    "deliverable": "Referencia fornecedor - Inscritos YouTube - Redes Sociais Promo #80",
    "addedToStore": false
  },
  {
    "id": "gm-81-gift-card-r-10-steam-promo-81",
    "name": "Gift Card R$ 10 - Steam Promo #81",
    "category": "Games",
    "subcategory": "Steam",
    "supplier": "GameMarket",
    "costPrice": 17.83,
    "salePrice": 29.42,
    "imageUrl": "https://cdn.simpleicons.org/steam/FFFFFF",
    "benefits": [
      "Base: R$ 17,83",
      "Valor de venda editavel",
      "Subcategoria Steam"
    ],
    "deliverable": "Referencia fornecedor - Gift Card R$ 10 - Steam Promo #81",
    "addedToStore": false
  },
  {
    "id": "gm-82-key-aleatoria-gold-steam-promo-82",
    "name": "Key Aleatória Gold - Steam Promo #82",
    "category": "Games",
    "subcategory": "Steam",
    "supplier": "GameMarket",
    "costPrice": 13.85,
    "salePrice": 22.85,
    "imageUrl": "https://cdn.simpleicons.org/steam/FFFFFF",
    "benefits": [
      "Base: R$ 13,85",
      "Valor de venda editavel",
      "Subcategoria Steam"
    ],
    "deliverable": "Referencia fornecedor - Key Aleatória Gold - Steam Promo #82",
    "addedToStore": false
  },
  {
    "id": "gm-83-1000-seguidores-instagram-redes-sociais-promo-83",
    "name": "1000 Seguidores Instagram - Redes Sociais Promo #83",
    "category": "Redes Sociais",
    "subcategory": "Instagram",
    "supplier": "GameMarket",
    "costPrice": 1.38,
    "salePrice": 2.28,
    "imageUrl": "https://cdn.simpleicons.org/instagram/E4405F",
    "benefits": [
      "Base: R$ 1,38",
      "Valor de venda editavel",
      "Subcategoria Instagram"
    ],
    "deliverable": "Referencia fornecedor - 1000 Seguidores Instagram - Redes Sociais Promo #83",
    "addedToStore": false
  },
  {
    "id": "gm-84-robux-400-roblox-promo-84",
    "name": "Robux 400 - Roblox Promo #84",
    "category": "Games",
    "subcategory": "Roblox",
    "supplier": "GameMarket",
    "costPrice": 28.91,
    "salePrice": 47.7,
    "imageUrl": "https://cdn.simpleicons.org/roblox/FFFFFF",
    "benefits": [
      "Base: R$ 28,91",
      "Valor de venda editavel",
      "Subcategoria Roblox"
    ],
    "deliverable": "Referencia fornecedor - Robux 400 - Roblox Promo #84",
    "addedToStore": false
  },
  {
    "id": "gm-85-diamantes-100-free-fire-promo-85",
    "name": "Diamantes 100 - Free Fire Promo #85",
    "category": "Games",
    "subcategory": "Free Fire",
    "supplier": "GameMarket",
    "costPrice": 15.16,
    "salePrice": 25.01,
    "imageUrl": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22520%22%20viewBox%3D%220%200%20800%20520%22%20data-storefy-brand-cover%3D%221%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20stop-color%3D%22%23120400%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23f97316%22%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%22s%22%3E%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2222%22%20stdDeviation%3D%2222%22%20flood-color%3D%22%23000%22%20flood-opacity%3D%22.45%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%22520%22%20rx%3D%2236%22%20fill%3D%22url(%23g)%22%2F%3E%3Ccircle%20cx%3D%22665%22%20cy%3D%2278%22%20r%3D%22158%22%20fill%3D%22%23fff%22%20opacity%3D%22.08%22%2F%3E%3Ccircle%20cx%3D%22118%22%20cy%3D%22430%22%20r%3D%22190%22%20fill%3D%22%23fff%22%20opacity%3D%22.06%22%2F%3E%3Crect%20x%3D%2256%22%20y%3D%2256%22%20width%3D%22688%22%20height%3D%22408%22%20rx%3D%2230%22%20fill%3D%22%23000%22%20opacity%3D%22.18%22%20stroke%3D%22%23fff%22%20stroke-opacity%3D%22.14%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22255%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22900%22%20fill%3D%22%23ffffff%22%20filter%3D%22url(%23s)%22%3EFREE%20FIRE%3C%2Ftext%3E%3Crect%20x%3D%22240%22%20y%3D%22330%22%20width%3D%22320%22%20height%3D%227%22%20rx%3D%223.5%22%20fill%3D%22%23facc15%22%20opacity%3D%22.9%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22386%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22800%22%20letter-spacing%3D%225%22%20fill%3D%22%23fff%22%20opacity%3D%22.72%22%3ESTOREFY%20OFERTA%20DIGITAL%3C%2Ftext%3E%3C%2Fsvg%3E",
    "benefits": [
      "Base: R$ 15,16",
      "Valor de venda editavel",
      "Subcategoria Free Fire"
    ],
    "deliverable": "Referencia fornecedor - Diamantes 100 - Free Fire Promo #85",
    "addedToStore": false
  },
  {
    "id": "gm-86-cartas-colecionaveis-steam-promo-86",
    "name": "Cartas Colecionáveis - Steam Promo #86",
    "category": "Games",
    "subcategory": "Steam",
    "supplier": "GameMarket",
    "costPrice": 1.9,
    "salePrice": 3.13,
    "imageUrl": "https://cdn.simpleicons.org/steam/FFFFFF",
    "benefits": [
      "Base: R$ 1,90",
      "Valor de venda editavel",
      "Subcategoria Steam"
    ],
    "deliverable": "Referencia fornecedor - Cartas Colecionáveis - Steam Promo #86",
    "addedToStore": false
  },
  {
    "id": "gm-87-1000-seguidores-instagram-redes-sociais-promo-87",
    "name": "1000 Seguidores Instagram - Redes Sociais Promo #87",
    "category": "Redes Sociais",
    "subcategory": "Instagram",
    "supplier": "GameMarket",
    "costPrice": 3.48,
    "salePrice": 5.74,
    "imageUrl": "https://cdn.simpleicons.org/instagram/E4405F",
    "benefits": [
      "Base: R$ 3,48",
      "Valor de venda editavel",
      "Subcategoria Instagram"
    ],
    "deliverable": "Referencia fornecedor - 1000 Seguidores Instagram - Redes Sociais Promo #87",
    "addedToStore": false
  },
  {
    "id": "gm-88-skins-aleatorias-free-fire-promo-88",
    "name": "Skins Aleatórias - Free Fire Promo #88",
    "category": "Games",
    "subcategory": "Free Fire",
    "supplier": "GameMarket",
    "costPrice": 12.84,
    "salePrice": 21.19,
    "imageUrl": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22520%22%20viewBox%3D%220%200%20800%20520%22%20data-storefy-brand-cover%3D%221%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20stop-color%3D%22%23120400%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23f97316%22%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%22s%22%3E%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2222%22%20stdDeviation%3D%2222%22%20flood-color%3D%22%23000%22%20flood-opacity%3D%22.45%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%22520%22%20rx%3D%2236%22%20fill%3D%22url(%23g)%22%2F%3E%3Ccircle%20cx%3D%22665%22%20cy%3D%2278%22%20r%3D%22158%22%20fill%3D%22%23fff%22%20opacity%3D%22.08%22%2F%3E%3Ccircle%20cx%3D%22118%22%20cy%3D%22430%22%20r%3D%22190%22%20fill%3D%22%23fff%22%20opacity%3D%22.06%22%2F%3E%3Crect%20x%3D%2256%22%20y%3D%2256%22%20width%3D%22688%22%20height%3D%22408%22%20rx%3D%2230%22%20fill%3D%22%23000%22%20opacity%3D%22.18%22%20stroke%3D%22%23fff%22%20stroke-opacity%3D%22.14%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22255%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22900%22%20fill%3D%22%23ffffff%22%20filter%3D%22url(%23s)%22%3EFREE%20FIRE%3C%2Ftext%3E%3Crect%20x%3D%22240%22%20y%3D%22330%22%20width%3D%22320%22%20height%3D%227%22%20rx%3D%223.5%22%20fill%3D%22%23facc15%22%20opacity%3D%22.9%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22386%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22800%22%20letter-spacing%3D%225%22%20fill%3D%22%23fff%22%20opacity%3D%22.72%22%3ESTOREFY%20OFERTA%20DIGITAL%3C%2Ftext%3E%3C%2Fsvg%3E",
    "benefits": [
      "Base: R$ 12,84",
      "Valor de venda editavel",
      "Subcategoria Free Fire"
    ],
    "deliverable": "Referencia fornecedor - Skins Aleatórias - Free Fire Promo #88",
    "addedToStore": false
  },
  {
    "id": "gm-89-inscritos-youtube-redes-sociais-promo-89",
    "name": "Inscritos YouTube - Redes Sociais Promo #89",
    "category": "Redes Sociais",
    "subcategory": "YouTube",
    "supplier": "GameMarket",
    "costPrice": 14.15,
    "salePrice": 23.35,
    "imageUrl": "https://cdn.simpleicons.org/youtube/FF0000",
    "benefits": [
      "Base: R$ 14,15",
      "Valor de venda editavel",
      "Subcategoria YouTube"
    ],
    "deliverable": "Referencia fornecedor - Inscritos YouTube - Redes Sociais Promo #89",
    "addedToStore": false
  },
  {
    "id": "gm-90-pets-adopt-me-roblox-promo-90",
    "name": "Pets Adopt Me - Roblox Promo #90",
    "category": "Games",
    "subcategory": "Roblox",
    "supplier": "GameMarket",
    "costPrice": 9.98,
    "salePrice": 16.47,
    "imageUrl": "https://cdn.simpleicons.org/roblox/FFFFFF",
    "benefits": [
      "Base: R$ 9,98",
      "Valor de venda editavel",
      "Subcategoria Roblox"
    ],
    "deliverable": "Referencia fornecedor - Pets Adopt Me - Roblox Promo #90",
    "addedToStore": false
  },
  {
    "id": "gm-91-1000-seguidores-instagram-redes-sociais-promo-91",
    "name": "1000 Seguidores Instagram - Redes Sociais Promo #91",
    "category": "Redes Sociais",
    "subcategory": "Instagram",
    "supplier": "GameMarket",
    "costPrice": 5.59,
    "salePrice": 9.22,
    "imageUrl": "https://cdn.simpleicons.org/instagram/E4405F",
    "benefits": [
      "Base: R$ 5,59",
      "Valor de venda editavel",
      "Subcategoria Instagram"
    ],
    "deliverable": "Referencia fornecedor - 1000 Seguidores Instagram - Redes Sociais Promo #91",
    "addedToStore": false
  },
  {
    "id": "gm-92-gift-card-r-10-steam-promo-92",
    "name": "Gift Card R$ 10 - Steam Promo #92",
    "category": "Games",
    "subcategory": "Steam",
    "supplier": "GameMarket",
    "costPrice": 5.68,
    "salePrice": 9.37,
    "imageUrl": "https://cdn.simpleicons.org/steam/FFFFFF",
    "benefits": [
      "Base: R$ 5,68",
      "Valor de venda editavel",
      "Subcategoria Steam"
    ],
    "deliverable": "Referencia fornecedor - Gift Card R$ 10 - Steam Promo #92",
    "addedToStore": false
  },
  {
    "id": "gm-93-contas-com-lendas-efootball-promo-93",
    "name": "Contas com Lendas - eFootball Promo #93",
    "category": "Games",
    "subcategory": "eFootball",
    "supplier": "GameMarket",
    "costPrice": 9.93,
    "salePrice": 16.38,
    "imageUrl": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22520%22%20viewBox%3D%220%200%20800%20520%22%20data-storefy-brand-cover%3D%221%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20stop-color%3D%22%23061020%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23034ea2%22%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%22s%22%3E%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2222%22%20stdDeviation%3D%2222%22%20flood-color%3D%22%23000%22%20flood-opacity%3D%22.45%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%22520%22%20rx%3D%2236%22%20fill%3D%22url(%23g)%22%2F%3E%3Ccircle%20cx%3D%22665%22%20cy%3D%2278%22%20r%3D%22158%22%20fill%3D%22%23fff%22%20opacity%3D%22.08%22%2F%3E%3Ccircle%20cx%3D%22118%22%20cy%3D%22430%22%20r%3D%22190%22%20fill%3D%22%23fff%22%20opacity%3D%22.06%22%2F%3E%3Crect%20x%3D%2256%22%20y%3D%2256%22%20width%3D%22688%22%20height%3D%22408%22%20rx%3D%2230%22%20fill%3D%22%23000%22%20opacity%3D%22.18%22%20stroke%3D%22%23fff%22%20stroke-opacity%3D%22.14%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22255%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22900%22%20fill%3D%22%23fef200%22%20filter%3D%22url(%23s)%22%3EeFootball%3C%2Ftext%3E%3Crect%20x%3D%22240%22%20y%3D%22330%22%20width%3D%22320%22%20height%3D%227%22%20rx%3D%223.5%22%20fill%3D%22%23fef200%22%20opacity%3D%22.9%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22386%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22800%22%20letter-spacing%3D%225%22%20fill%3D%22%23fff%22%20opacity%3D%22.72%22%3ESTOREFY%20OFERTA%20DIGITAL%3C%2Ftext%3E%3C%2Fsvg%3E",
    "benefits": [
      "Base: R$ 9,93",
      "Valor de venda editavel",
      "Subcategoria eFootball"
    ],
    "deliverable": "Referencia fornecedor - Contas com Lendas - eFootball Promo #93",
    "addedToStore": false
  },
  {
    "id": "gm-94-murder-mystery-2-itens-roblox-promo-94",
    "name": "Murder Mystery 2 Itens - Roblox Promo #94",
    "category": "Games",
    "subcategory": "Roblox",
    "supplier": "GameMarket",
    "costPrice": 21.73,
    "salePrice": 35.85,
    "imageUrl": "https://cdn.simpleicons.org/roblox/FFFFFF",
    "benefits": [
      "Base: R$ 21,73",
      "Valor de venda editavel",
      "Subcategoria Roblox"
    ],
    "deliverable": "Referencia fornecedor - Murder Mystery 2 Itens - Roblox Promo #94",
    "addedToStore": false
  },
  {
    "id": "gm-95-contas-antigas-roblox-promo-95",
    "name": "Contas Antigas - Roblox Promo #95",
    "category": "Games",
    "subcategory": "Roblox",
    "supplier": "GameMarket",
    "costPrice": 13.67,
    "salePrice": 22.56,
    "imageUrl": "https://cdn.simpleicons.org/roblox/FFFFFF",
    "benefits": [
      "Base: R$ 13,67",
      "Valor de venda editavel",
      "Subcategoria Roblox"
    ],
    "deliverable": "Referencia fornecedor - Contas Antigas - Roblox Promo #95",
    "addedToStore": false
  },
  {
    "id": "gm-96-membros-discord-redes-sociais-promo-96",
    "name": "Membros Discord - Redes Sociais Promo #96",
    "category": "Redes Sociais",
    "subcategory": "Discord",
    "supplier": "GameMarket",
    "costPrice": 12.59,
    "salePrice": 20.77,
    "imageUrl": "https://cdn.simpleicons.org/discord/5865F2",
    "benefits": [
      "Base: R$ 12,59",
      "Valor de venda editavel",
      "Subcategoria Discord"
    ],
    "deliverable": "Referencia fornecedor - Membros Discord - Redes Sociais Promo #96",
    "addedToStore": false
  },
  {
    "id": "gm-97-moedas-myclub-efootball-promo-97",
    "name": "Moedas MyClub - eFootball Promo #97",
    "category": "Games",
    "subcategory": "eFootball",
    "supplier": "GameMarket",
    "costPrice": 12.91,
    "salePrice": 21.3,
    "imageUrl": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22520%22%20viewBox%3D%220%200%20800%20520%22%20data-storefy-brand-cover%3D%221%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20stop-color%3D%22%23061020%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23034ea2%22%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%22s%22%3E%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2222%22%20stdDeviation%3D%2222%22%20flood-color%3D%22%23000%22%20flood-opacity%3D%22.45%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%22520%22%20rx%3D%2236%22%20fill%3D%22url(%23g)%22%2F%3E%3Ccircle%20cx%3D%22665%22%20cy%3D%2278%22%20r%3D%22158%22%20fill%3D%22%23fff%22%20opacity%3D%22.08%22%2F%3E%3Ccircle%20cx%3D%22118%22%20cy%3D%22430%22%20r%3D%22190%22%20fill%3D%22%23fff%22%20opacity%3D%22.06%22%2F%3E%3Crect%20x%3D%2256%22%20y%3D%2256%22%20width%3D%22688%22%20height%3D%22408%22%20rx%3D%2230%22%20fill%3D%22%23000%22%20opacity%3D%22.18%22%20stroke%3D%22%23fff%22%20stroke-opacity%3D%22.14%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22255%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22900%22%20fill%3D%22%23fef200%22%20filter%3D%22url(%23s)%22%3EeFootball%3C%2Ftext%3E%3Crect%20x%3D%22240%22%20y%3D%22330%22%20width%3D%22320%22%20height%3D%227%22%20rx%3D%223.5%22%20fill%3D%22%23fef200%22%20opacity%3D%22.9%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22386%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22800%22%20letter-spacing%3D%225%22%20fill%3D%22%23fff%22%20opacity%3D%22.72%22%3ESTOREFY%20OFERTA%20DIGITAL%3C%2Ftext%3E%3C%2Fsvg%3E",
    "benefits": [
      "Base: R$ 12,91",
      "Valor de venda editavel",
      "Subcategoria eFootball"
    ],
    "deliverable": "Referencia fornecedor - Moedas MyClub - eFootball Promo #97",
    "addedToStore": false
  },
  {
    "id": "gm-98-skins-cs2-steam-promo-98",
    "name": "Skins CS2 - Steam Promo #98",
    "category": "Games",
    "subcategory": "Steam",
    "supplier": "GameMarket",
    "costPrice": 12.97,
    "salePrice": 21.4,
    "imageUrl": "https://cdn.simpleicons.org/steam/FFFFFF",
    "benefits": [
      "Base: R$ 12,97",
      "Valor de venda editavel",
      "Subcategoria Steam"
    ],
    "deliverable": "Referencia fornecedor - Skins CS2 - Steam Promo #98",
    "addedToStore": false
  },
  {
    "id": "gm-99-moedas-myclub-efootball-promo-99",
    "name": "Moedas MyClub - eFootball Promo #99",
    "category": "Games",
    "subcategory": "eFootball",
    "supplier": "GameMarket",
    "costPrice": 15.9,
    "salePrice": 26.23,
    "imageUrl": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22520%22%20viewBox%3D%220%200%20800%20520%22%20data-storefy-brand-cover%3D%221%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20stop-color%3D%22%23061020%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23034ea2%22%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%22s%22%3E%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2222%22%20stdDeviation%3D%2222%22%20flood-color%3D%22%23000%22%20flood-opacity%3D%22.45%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%22520%22%20rx%3D%2236%22%20fill%3D%22url(%23g)%22%2F%3E%3Ccircle%20cx%3D%22665%22%20cy%3D%2278%22%20r%3D%22158%22%20fill%3D%22%23fff%22%20opacity%3D%22.08%22%2F%3E%3Ccircle%20cx%3D%22118%22%20cy%3D%22430%22%20r%3D%22190%22%20fill%3D%22%23fff%22%20opacity%3D%22.06%22%2F%3E%3Crect%20x%3D%2256%22%20y%3D%2256%22%20width%3D%22688%22%20height%3D%22408%22%20rx%3D%2230%22%20fill%3D%22%23000%22%20opacity%3D%22.18%22%20stroke%3D%22%23fff%22%20stroke-opacity%3D%22.14%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22255%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22900%22%20fill%3D%22%23fef200%22%20filter%3D%22url(%23s)%22%3EeFootball%3C%2Ftext%3E%3Crect%20x%3D%22240%22%20y%3D%22330%22%20width%3D%22320%22%20height%3D%227%22%20rx%3D%223.5%22%20fill%3D%22%23fef200%22%20opacity%3D%22.9%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22386%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22800%22%20letter-spacing%3D%225%22%20fill%3D%22%23fff%22%20opacity%3D%22.72%22%3ESTOREFY%20OFERTA%20DIGITAL%3C%2Ftext%3E%3C%2Fsvg%3E",
    "benefits": [
      "Base: R$ 15,90",
      "Valor de venda editavel",
      "Subcategoria eFootball"
    ],
    "deliverable": "Referencia fornecedor - Moedas MyClub - eFootball Promo #99",
    "addedToStore": false
  },
  {
    "id": "gm-100-gp-infinito-servico-efootball-promo-100",
    "name": "GP Infinito (Serviço) - eFootball Promo #100",
    "category": "Games",
    "subcategory": "eFootball",
    "supplier": "GameMarket",
    "costPrice": 9.28,
    "salePrice": 15.31,
    "imageUrl": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22520%22%20viewBox%3D%220%200%20800%20520%22%20data-storefy-brand-cover%3D%221%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20stop-color%3D%22%23061020%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23034ea2%22%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%22s%22%3E%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2222%22%20stdDeviation%3D%2222%22%20flood-color%3D%22%23000%22%20flood-opacity%3D%22.45%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%22520%22%20rx%3D%2236%22%20fill%3D%22url(%23g)%22%2F%3E%3Ccircle%20cx%3D%22665%22%20cy%3D%2278%22%20r%3D%22158%22%20fill%3D%22%23fff%22%20opacity%3D%22.08%22%2F%3E%3Ccircle%20cx%3D%22118%22%20cy%3D%22430%22%20r%3D%22190%22%20fill%3D%22%23fff%22%20opacity%3D%22.06%22%2F%3E%3Crect%20x%3D%2256%22%20y%3D%2256%22%20width%3D%22688%22%20height%3D%22408%22%20rx%3D%2230%22%20fill%3D%22%23000%22%20opacity%3D%22.18%22%20stroke%3D%22%23fff%22%20stroke-opacity%3D%22.14%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22255%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22900%22%20fill%3D%22%23fef200%22%20filter%3D%22url(%23s)%22%3EeFootball%3C%2Ftext%3E%3Crect%20x%3D%22240%22%20y%3D%22330%22%20width%3D%22320%22%20height%3D%227%22%20rx%3D%223.5%22%20fill%3D%22%23fef200%22%20opacity%3D%22.9%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22386%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22800%22%20letter-spacing%3D%225%22%20fill%3D%22%23fff%22%20opacity%3D%22.72%22%3ESTOREFY%20OFERTA%20DIGITAL%3C%2Ftext%3E%3C%2Fsvg%3E",
    "benefits": [
      "Base: R$ 9,28",
      "Valor de venda editavel",
      "Subcategoria eFootball"
    ],
    "deliverable": "Referencia fornecedor - GP Infinito (Serviço) - eFootball Promo #100",
    "addedToStore": false
  },
  {
    "id": "gm-101-disney-premium-1",
    "name": "Disney+ Premium #1",
    "category": "Assinaturas Digitais",
    "subcategory": "Disney+",
    "supplier": "GameMarket",
    "costPrice": 5,
    "salePrice": 8.25,
    "imageUrl": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22520%22%20viewBox%3D%220%200%20800%20520%22%20data-storefy-brand-cover%3D%221%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20stop-color%3D%22%23061a45%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23163d9a%22%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%22s%22%3E%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2222%22%20stdDeviation%3D%2222%22%20flood-color%3D%22%23000%22%20flood-opacity%3D%22.45%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%22520%22%20rx%3D%2236%22%20fill%3D%22url(%23g)%22%2F%3E%3Ccircle%20cx%3D%22665%22%20cy%3D%2278%22%20r%3D%22158%22%20fill%3D%22%23fff%22%20opacity%3D%22.08%22%2F%3E%3Ccircle%20cx%3D%22118%22%20cy%3D%22430%22%20r%3D%22190%22%20fill%3D%22%23fff%22%20opacity%3D%22.06%22%2F%3E%3Crect%20x%3D%2256%22%20y%3D%2256%22%20width%3D%22688%22%20height%3D%22408%22%20rx%3D%2230%22%20fill%3D%22%23000%22%20opacity%3D%22.18%22%20stroke%3D%22%23fff%22%20stroke-opacity%3D%22.14%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22255%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22900%22%20fill%3D%22%23ffffff%22%20filter%3D%22url(%23s)%22%3EDisney%2B%3C%2Ftext%3E%3Crect%20x%3D%22240%22%20y%3D%22330%22%20width%3D%22320%22%20height%3D%227%22%20rx%3D%223.5%22%20fill%3D%22%2365b7ff%22%20opacity%3D%22.9%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22386%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22800%22%20letter-spacing%3D%225%22%20fill%3D%22%23fff%22%20opacity%3D%22.72%22%3ESTOREFY%20OFERTA%20DIGITAL%3C%2Ftext%3E%3C%2Fsvg%3E",
    "benefits": [
      "Base: R$ 5,00",
      "Valor de venda editavel",
      "Subcategoria Disney+"
    ],
    "deliverable": "Referencia fornecedor - Disney+ Premium #1",
    "addedToStore": false
  },
  {
    "id": "gm-102-spotify-premium-1-mes-2",
    "name": "Spotify Premium 1 Mês #2",
    "category": "Assinaturas Digitais",
    "subcategory": "Spotify",
    "supplier": "GameMarket",
    "costPrice": 25,
    "salePrice": 41.25,
    "imageUrl": "https://cdn.simpleicons.org/spotify/1DB954",
    "benefits": [
      "Base: R$ 25,00",
      "Valor de venda editavel",
      "Subcategoria Spotify"
    ],
    "deliverable": "Referencia fornecedor - Spotify Premium 1 Mês #2",
    "addedToStore": false
  },
  {
    "id": "gm-103-crunchyroll-mega-fan-3",
    "name": "Crunchyroll Mega Fan #3",
    "category": "Assinaturas Digitais",
    "subcategory": "Crunchyroll",
    "supplier": "GameMarket",
    "costPrice": 3,
    "salePrice": 4.95,
    "imageUrl": "https://cdn.simpleicons.org/crunchyroll/F47521",
    "benefits": [
      "Base: R$ 3,00",
      "Valor de venda editavel",
      "Subcategoria Crunchyroll"
    ],
    "deliverable": "Referencia fornecedor - Crunchyroll Mega Fan #3",
    "addedToStore": false
  },
  {
    "id": "gm-104-hbo-max-anual-4",
    "name": "HBO Max Anual #4",
    "category": "Assinaturas Digitais",
    "subcategory": "HBO Max",
    "supplier": "GameMarket",
    "costPrice": 45,
    "salePrice": 74.25,
    "imageUrl": "https://cdn.simpleicons.org/hbomax/A855F7",
    "benefits": [
      "Base: R$ 45,00",
      "Valor de venda editavel",
      "Subcategoria HBO Max"
    ],
    "deliverable": "Referencia fornecedor - HBO Max Anual #4",
    "addedToStore": false
  },
  {
    "id": "gm-105-prime-video-30-dias-5",
    "name": "Prime Video 30 Dias #5",
    "category": "Assinaturas Digitais",
    "subcategory": "Prime Video",
    "supplier": "GameMarket",
    "costPrice": 4,
    "salePrice": 6.6,
    "imageUrl": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22520%22%20viewBox%3D%220%200%20800%20520%22%20data-storefy-brand-cover%3D%221%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20stop-color%3D%22%2306111f%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%2300a8e1%22%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%22s%22%3E%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2222%22%20stdDeviation%3D%2222%22%20flood-color%3D%22%23000%22%20flood-opacity%3D%22.45%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%22520%22%20rx%3D%2236%22%20fill%3D%22url(%23g)%22%2F%3E%3Ccircle%20cx%3D%22665%22%20cy%3D%2278%22%20r%3D%22158%22%20fill%3D%22%23fff%22%20opacity%3D%22.08%22%2F%3E%3Ccircle%20cx%3D%22118%22%20cy%3D%22430%22%20r%3D%22190%22%20fill%3D%22%23fff%22%20opacity%3D%22.06%22%2F%3E%3Crect%20x%3D%2256%22%20y%3D%2256%22%20width%3D%22688%22%20height%3D%22408%22%20rx%3D%2230%22%20fill%3D%22%23000%22%20opacity%3D%22.18%22%20stroke%3D%22%23fff%22%20stroke-opacity%3D%22.14%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22255%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22900%22%20fill%3D%22%23ffffff%22%20filter%3D%22url(%23s)%22%3EPrime%20Video%3C%2Ftext%3E%3Crect%20x%3D%22240%22%20y%3D%22330%22%20width%3D%22320%22%20height%3D%227%22%20rx%3D%223.5%22%20fill%3D%22%2300a8e1%22%20opacity%3D%22.9%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22386%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22800%22%20letter-spacing%3D%225%22%20fill%3D%22%23fff%22%20opacity%3D%22.72%22%3ESTOREFY%20OFERTA%20DIGITAL%3C%2Ftext%3E%3C%2Fsvg%3E",
    "benefits": [
      "Base: R$ 4,00",
      "Valor de venda editavel",
      "Subcategoria Prime Video"
    ],
    "deliverable": "Referencia fornecedor - Prime Video 30 Dias #5",
    "addedToStore": false
  },
  {
    "id": "gm-106-paramount-tela-6",
    "name": "Paramount+ Tela #6",
    "category": "Assinaturas Digitais",
    "subcategory": "Paramount+",
    "supplier": "GameMarket",
    "costPrice": 3,
    "salePrice": 4.95,
    "imageUrl": "https://cdn.simpleicons.org/paramountplus/0064FF",
    "benefits": [
      "Base: R$ 3,00",
      "Valor de venda editavel",
      "Subcategoria Paramount+"
    ],
    "deliverable": "Referencia fornecedor - Paramount+ Tela #6",
    "addedToStore": false
  },
  {
    "id": "gm-107-youtube-premium-1-mes-7",
    "name": "YouTube Premium 1 Mês #7",
    "category": "Assinaturas Digitais",
    "subcategory": "YouTube Premium",
    "supplier": "GameMarket",
    "costPrice": 5,
    "salePrice": 8.25,
    "imageUrl": "https://cdn.simpleicons.org/youtube/FF0000",
    "benefits": [
      "Base: R$ 5,00",
      "Valor de venda editavel",
      "Subcategoria YouTube Premium"
    ],
    "deliverable": "Referencia fornecedor - YouTube Premium 1 Mês #7",
    "addedToStore": false
  },
  {
    "id": "gm-108-netflix-4k-tela-privada-30-dias-8",
    "name": "Netflix 4K Tela Privada 30 Dias #8",
    "category": "Assinaturas Digitais",
    "subcategory": "Netflix",
    "supplier": "GameMarket",
    "costPrice": 15,
    "salePrice": 24.75,
    "imageUrl": "https://cdn.simpleicons.org/netflix/E50914",
    "benefits": [
      "Base: R$ 15,00",
      "Valor de venda editavel",
      "Subcategoria Netflix"
    ],
    "deliverable": "Referencia fornecedor - Netflix 4K Tela Privada 30 Dias #8",
    "addedToStore": false
  },
  {
    "id": "gm-109-disney-plus-conta-privada-9",
    "name": "Disney Plus Conta Privada #9",
    "category": "Assinaturas Digitais",
    "subcategory": "Disney+",
    "supplier": "GameMarket",
    "costPrice": 5,
    "salePrice": 8.25,
    "imageUrl": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22520%22%20viewBox%3D%220%200%20800%20520%22%20data-storefy-brand-cover%3D%221%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20stop-color%3D%22%23061a45%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23163d9a%22%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%22s%22%3E%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2222%22%20stdDeviation%3D%2222%22%20flood-color%3D%22%23000%22%20flood-opacity%3D%22.45%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%22520%22%20rx%3D%2236%22%20fill%3D%22url(%23g)%22%2F%3E%3Ccircle%20cx%3D%22665%22%20cy%3D%2278%22%20r%3D%22158%22%20fill%3D%22%23fff%22%20opacity%3D%22.08%22%2F%3E%3Ccircle%20cx%3D%22118%22%20cy%3D%22430%22%20r%3D%22190%22%20fill%3D%22%23fff%22%20opacity%3D%22.06%22%2F%3E%3Crect%20x%3D%2256%22%20y%3D%2256%22%20width%3D%22688%22%20height%3D%22408%22%20rx%3D%2230%22%20fill%3D%22%23000%22%20opacity%3D%22.18%22%20stroke%3D%22%23fff%22%20stroke-opacity%3D%22.14%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22255%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22900%22%20fill%3D%22%23ffffff%22%20filter%3D%22url(%23s)%22%3EDisney%2B%3C%2Ftext%3E%3Crect%20x%3D%22240%22%20y%3D%22330%22%20width%3D%22320%22%20height%3D%227%22%20rx%3D%223.5%22%20fill%3D%22%2365b7ff%22%20opacity%3D%22.9%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22386%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22800%22%20letter-spacing%3D%225%22%20fill%3D%22%23fff%22%20opacity%3D%22.72%22%3ESTOREFY%20OFERTA%20DIGITAL%3C%2Ftext%3E%3C%2Fsvg%3E",
    "benefits": [
      "Base: R$ 5,00",
      "Valor de venda editavel",
      "Subcategoria Disney+"
    ],
    "deliverable": "Referencia fornecedor - Disney Plus Conta Privada #9",
    "addedToStore": false
  },
  {
    "id": "gm-110-spotify-premium-1-mes-10",
    "name": "Spotify Premium 1 Mês #10",
    "category": "Assinaturas Digitais",
    "subcategory": "Spotify",
    "supplier": "GameMarket",
    "costPrice": 4.99,
    "salePrice": 8.23,
    "imageUrl": "https://cdn.simpleicons.org/spotify/1DB954",
    "benefits": [
      "Base: R$ 4,99",
      "Valor de venda editavel",
      "Subcategoria Spotify"
    ],
    "deliverable": "Referencia fornecedor - Spotify Premium 1 Mês #10",
    "addedToStore": false
  },
  {
    "id": "gm-111-crunchyroll-anual-11",
    "name": "Crunchyroll Anual #11",
    "category": "Assinaturas Digitais",
    "subcategory": "Crunchyroll",
    "supplier": "GameMarket",
    "costPrice": 15,
    "salePrice": 24.75,
    "imageUrl": "https://cdn.simpleicons.org/crunchyroll/F47521",
    "benefits": [
      "Base: R$ 15,00",
      "Valor de venda editavel",
      "Subcategoria Crunchyroll"
    ],
    "deliverable": "Referencia fornecedor - Crunchyroll Anual #11",
    "addedToStore": false
  },
  {
    "id": "gm-112-hbo-max-tela-privada-12",
    "name": "HBO Max Tela Privada #12",
    "category": "Assinaturas Digitais",
    "subcategory": "HBO Max",
    "supplier": "GameMarket",
    "costPrice": 9.9,
    "salePrice": 16.34,
    "imageUrl": "https://cdn.simpleicons.org/hbomax/A855F7",
    "benefits": [
      "Base: R$ 9,90",
      "Valor de venda editavel",
      "Subcategoria HBO Max"
    ],
    "deliverable": "Referencia fornecedor - HBO Max Tela Privada #12",
    "addedToStore": false
  },
  {
    "id": "gm-113-prime-video-privado-13",
    "name": "Prime Video Privado #13",
    "category": "Assinaturas Digitais",
    "subcategory": "Prime Video",
    "supplier": "GameMarket",
    "costPrice": 2.2,
    "salePrice": 3.63,
    "imageUrl": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22520%22%20viewBox%3D%220%200%20800%20520%22%20data-storefy-brand-cover%3D%221%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20stop-color%3D%22%2306111f%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%2300a8e1%22%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%22s%22%3E%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2222%22%20stdDeviation%3D%2222%22%20flood-color%3D%22%23000%22%20flood-opacity%3D%22.45%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%22520%22%20rx%3D%2236%22%20fill%3D%22url(%23g)%22%2F%3E%3Ccircle%20cx%3D%22665%22%20cy%3D%2278%22%20r%3D%22158%22%20fill%3D%22%23fff%22%20opacity%3D%22.08%22%2F%3E%3Ccircle%20cx%3D%22118%22%20cy%3D%22430%22%20r%3D%22190%22%20fill%3D%22%23fff%22%20opacity%3D%22.06%22%2F%3E%3Crect%20x%3D%2256%22%20y%3D%2256%22%20width%3D%22688%22%20height%3D%22408%22%20rx%3D%2230%22%20fill%3D%22%23000%22%20opacity%3D%22.18%22%20stroke%3D%22%23fff%22%20stroke-opacity%3D%22.14%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22255%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22900%22%20fill%3D%22%23ffffff%22%20filter%3D%22url(%23s)%22%3EPrime%20Video%3C%2Ftext%3E%3Crect%20x%3D%22240%22%20y%3D%22330%22%20width%3D%22320%22%20height%3D%227%22%20rx%3D%223.5%22%20fill%3D%22%2300a8e1%22%20opacity%3D%22.9%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22386%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22800%22%20letter-spacing%3D%225%22%20fill%3D%22%23fff%22%20opacity%3D%22.72%22%3ESTOREFY%20OFERTA%20DIGITAL%3C%2Ftext%3E%3C%2Fsvg%3E",
    "benefits": [
      "Base: R$ 2,20",
      "Valor de venda editavel",
      "Subcategoria Prime Video"
    ],
    "deliverable": "Referencia fornecedor - Prime Video Privado #13",
    "addedToStore": false
  },
  {
    "id": "gm-114-paramount-tela-14",
    "name": "Paramount+ Tela #14",
    "category": "Assinaturas Digitais",
    "subcategory": "Paramount+",
    "supplier": "GameMarket",
    "costPrice": 4.5,
    "salePrice": 7.42,
    "imageUrl": "https://cdn.simpleicons.org/paramountplus/0064FF",
    "benefits": [
      "Base: R$ 4,50",
      "Valor de venda editavel",
      "Subcategoria Paramount+"
    ],
    "deliverable": "Referencia fornecedor - Paramount+ Tela #14",
    "addedToStore": false
  },
  {
    "id": "gm-115-youtube-premium-convite-familia-15",
    "name": "YouTube Premium Convite Família #15",
    "category": "Assinaturas Digitais",
    "subcategory": "YouTube Premium",
    "supplier": "GameMarket",
    "costPrice": 35,
    "salePrice": 57.75,
    "imageUrl": "https://cdn.simpleicons.org/youtube/FF0000",
    "benefits": [
      "Base: R$ 35,00",
      "Valor de venda editavel",
      "Subcategoria YouTube Premium"
    ],
    "deliverable": "Referencia fornecedor - YouTube Premium Convite Família #15",
    "addedToStore": false
  },
  {
    "id": "gm-116-netflix-ultra-hd-16",
    "name": "Netflix Ultra HD #16",
    "category": "Assinaturas Digitais",
    "subcategory": "Netflix",
    "supplier": "GameMarket",
    "costPrice": 15,
    "salePrice": 24.75,
    "imageUrl": "https://cdn.simpleicons.org/netflix/E50914",
    "benefits": [
      "Base: R$ 15,00",
      "Valor de venda editavel",
      "Subcategoria Netflix"
    ],
    "deliverable": "Referencia fornecedor - Netflix Ultra HD #16",
    "addedToStore": false
  },
  {
    "id": "gm-117-disney-assinatura-30-dias-17",
    "name": "Disney+ Assinatura 30 Dias #17",
    "category": "Assinaturas Digitais",
    "subcategory": "Disney+",
    "supplier": "GameMarket",
    "costPrice": 5,
    "salePrice": 8.25,
    "imageUrl": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22520%22%20viewBox%3D%220%200%20800%20520%22%20data-storefy-brand-cover%3D%221%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20stop-color%3D%22%23061a45%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23163d9a%22%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%22s%22%3E%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2222%22%20stdDeviation%3D%2222%22%20flood-color%3D%22%23000%22%20flood-opacity%3D%22.45%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%22520%22%20rx%3D%2236%22%20fill%3D%22url(%23g)%22%2F%3E%3Ccircle%20cx%3D%22665%22%20cy%3D%2278%22%20r%3D%22158%22%20fill%3D%22%23fff%22%20opacity%3D%22.08%22%2F%3E%3Ccircle%20cx%3D%22118%22%20cy%3D%22430%22%20r%3D%22190%22%20fill%3D%22%23fff%22%20opacity%3D%22.06%22%2F%3E%3Crect%20x%3D%2256%22%20y%3D%2256%22%20width%3D%22688%22%20height%3D%22408%22%20rx%3D%2230%22%20fill%3D%22%23000%22%20opacity%3D%22.18%22%20stroke%3D%22%23fff%22%20stroke-opacity%3D%22.14%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22255%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22900%22%20fill%3D%22%23ffffff%22%20filter%3D%22url(%23s)%22%3EDisney%2B%3C%2Ftext%3E%3Crect%20x%3D%22240%22%20y%3D%22330%22%20width%3D%22320%22%20height%3D%227%22%20rx%3D%223.5%22%20fill%3D%22%2365b7ff%22%20opacity%3D%22.9%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22386%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22800%22%20letter-spacing%3D%225%22%20fill%3D%22%23fff%22%20opacity%3D%22.72%22%3ESTOREFY%20OFERTA%20DIGITAL%3C%2Ftext%3E%3C%2Fsvg%3E",
    "benefits": [
      "Base: R$ 5,00",
      "Valor de venda editavel",
      "Subcategoria Disney+"
    ],
    "deliverable": "Referencia fornecedor - Disney+ Assinatura 30 Dias #17",
    "addedToStore": false
  },
  {
    "id": "gm-118-spotify-individual-18",
    "name": "Spotify Individual #18",
    "category": "Assinaturas Digitais",
    "subcategory": "Spotify",
    "supplier": "GameMarket",
    "costPrice": 25,
    "salePrice": 41.25,
    "imageUrl": "https://cdn.simpleicons.org/spotify/1DB954",
    "benefits": [
      "Base: R$ 25,00",
      "Valor de venda editavel",
      "Subcategoria Spotify"
    ],
    "deliverable": "Referencia fornecedor - Spotify Individual #18",
    "addedToStore": false
  },
  {
    "id": "gm-119-crunchyroll-anual-19",
    "name": "Crunchyroll Anual #19",
    "category": "Assinaturas Digitais",
    "subcategory": "Crunchyroll",
    "supplier": "GameMarket",
    "costPrice": 2.5,
    "salePrice": 4.13,
    "imageUrl": "https://cdn.simpleicons.org/crunchyroll/F47521",
    "benefits": [
      "Base: R$ 2,50",
      "Valor de venda editavel",
      "Subcategoria Crunchyroll"
    ],
    "deliverable": "Referencia fornecedor - Crunchyroll Anual #19",
    "addedToStore": false
  },
  {
    "id": "gm-120-hbo-max-anual-20",
    "name": "HBO Max Anual #20",
    "category": "Assinaturas Digitais",
    "subcategory": "HBO Max",
    "supplier": "GameMarket",
    "costPrice": 9.9,
    "salePrice": 16.34,
    "imageUrl": "https://cdn.simpleicons.org/hbomax/A855F7",
    "benefits": [
      "Base: R$ 9,90",
      "Valor de venda editavel",
      "Subcategoria HBO Max"
    ],
    "deliverable": "Referencia fornecedor - HBO Max Anual #20",
    "addedToStore": false
  },
  {
    "id": "gm-121-prime-video-privado-21",
    "name": "Prime Video Privado #21",
    "category": "Assinaturas Digitais",
    "subcategory": "Prime Video",
    "supplier": "GameMarket",
    "costPrice": 3.5,
    "salePrice": 5.77,
    "imageUrl": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22520%22%20viewBox%3D%220%200%20800%20520%22%20data-storefy-brand-cover%3D%221%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20stop-color%3D%22%2306111f%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%2300a8e1%22%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%22s%22%3E%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2222%22%20stdDeviation%3D%2222%22%20flood-color%3D%22%23000%22%20flood-opacity%3D%22.45%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%22520%22%20rx%3D%2236%22%20fill%3D%22url(%23g)%22%2F%3E%3Ccircle%20cx%3D%22665%22%20cy%3D%2278%22%20r%3D%22158%22%20fill%3D%22%23fff%22%20opacity%3D%22.08%22%2F%3E%3Ccircle%20cx%3D%22118%22%20cy%3D%22430%22%20r%3D%22190%22%20fill%3D%22%23fff%22%20opacity%3D%22.06%22%2F%3E%3Crect%20x%3D%2256%22%20y%3D%2256%22%20width%3D%22688%22%20height%3D%22408%22%20rx%3D%2230%22%20fill%3D%22%23000%22%20opacity%3D%22.18%22%20stroke%3D%22%23fff%22%20stroke-opacity%3D%22.14%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22255%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22900%22%20fill%3D%22%23ffffff%22%20filter%3D%22url(%23s)%22%3EPrime%20Video%3C%2Ftext%3E%3Crect%20x%3D%22240%22%20y%3D%22330%22%20width%3D%22320%22%20height%3D%227%22%20rx%3D%223.5%22%20fill%3D%22%2300a8e1%22%20opacity%3D%22.9%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22386%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22800%22%20letter-spacing%3D%225%22%20fill%3D%22%23fff%22%20opacity%3D%22.72%22%3ESTOREFY%20OFERTA%20DIGITAL%3C%2Ftext%3E%3C%2Fsvg%3E",
    "benefits": [
      "Base: R$ 3,50",
      "Valor de venda editavel",
      "Subcategoria Prime Video"
    ],
    "deliverable": "Referencia fornecedor - Prime Video Privado #21",
    "addedToStore": false
  },
  {
    "id": "gm-122-paramount-30-dias-22",
    "name": "Paramount+ 30 Dias #22",
    "category": "Assinaturas Digitais",
    "subcategory": "Paramount+",
    "supplier": "GameMarket",
    "costPrice": 2.5,
    "salePrice": 4.13,
    "imageUrl": "https://cdn.simpleicons.org/paramountplus/0064FF",
    "benefits": [
      "Base: R$ 2,50",
      "Valor de venda editavel",
      "Subcategoria Paramount+"
    ],
    "deliverable": "Referencia fornecedor - Paramount+ 30 Dias #22",
    "addedToStore": false
  },
  {
    "id": "gm-123-youtube-premium-permanente-23",
    "name": "YouTube Premium Permanente #23",
    "category": "Assinaturas Digitais",
    "subcategory": "YouTube Premium",
    "supplier": "GameMarket",
    "costPrice": 6.5,
    "salePrice": 10.72,
    "imageUrl": "https://cdn.simpleicons.org/youtube/FF0000",
    "benefits": [
      "Base: R$ 6,50",
      "Valor de venda editavel",
      "Subcategoria YouTube Premium"
    ],
    "deliverable": "Referencia fornecedor - YouTube Premium Permanente #23",
    "addedToStore": false
  },
  {
    "id": "gm-124-netflix-conta-compartilhada-24",
    "name": "Netflix Conta Compartilhada #24",
    "category": "Assinaturas Digitais",
    "subcategory": "Netflix",
    "supplier": "GameMarket",
    "costPrice": 7.9,
    "salePrice": 13.04,
    "imageUrl": "https://cdn.simpleicons.org/netflix/E50914",
    "benefits": [
      "Base: R$ 7,90",
      "Valor de venda editavel",
      "Subcategoria Netflix"
    ],
    "deliverable": "Referencia fornecedor - Netflix Conta Compartilhada #24",
    "addedToStore": false
  },
  {
    "id": "gm-125-disney-assinatura-30-dias-25",
    "name": "Disney+ Assinatura 30 Dias #25",
    "category": "Assinaturas Digitais",
    "subcategory": "Disney+",
    "supplier": "GameMarket",
    "costPrice": 5,
    "salePrice": 8.25,
    "imageUrl": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22520%22%20viewBox%3D%220%200%20800%20520%22%20data-storefy-brand-cover%3D%221%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20stop-color%3D%22%23061a45%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23163d9a%22%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%22s%22%3E%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2222%22%20stdDeviation%3D%2222%22%20flood-color%3D%22%23000%22%20flood-opacity%3D%22.45%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%22520%22%20rx%3D%2236%22%20fill%3D%22url(%23g)%22%2F%3E%3Ccircle%20cx%3D%22665%22%20cy%3D%2278%22%20r%3D%22158%22%20fill%3D%22%23fff%22%20opacity%3D%22.08%22%2F%3E%3Ccircle%20cx%3D%22118%22%20cy%3D%22430%22%20r%3D%22190%22%20fill%3D%22%23fff%22%20opacity%3D%22.06%22%2F%3E%3Crect%20x%3D%2256%22%20y%3D%2256%22%20width%3D%22688%22%20height%3D%22408%22%20rx%3D%2230%22%20fill%3D%22%23000%22%20opacity%3D%22.18%22%20stroke%3D%22%23fff%22%20stroke-opacity%3D%22.14%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22255%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22900%22%20fill%3D%22%23ffffff%22%20filter%3D%22url(%23s)%22%3EDisney%2B%3C%2Ftext%3E%3Crect%20x%3D%22240%22%20y%3D%22330%22%20width%3D%22320%22%20height%3D%227%22%20rx%3D%223.5%22%20fill%3D%22%2365b7ff%22%20opacity%3D%22.9%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22386%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22800%22%20letter-spacing%3D%225%22%20fill%3D%22%23fff%22%20opacity%3D%22.72%22%3ESTOREFY%20OFERTA%20DIGITAL%3C%2Ftext%3E%3C%2Fsvg%3E",
    "benefits": [
      "Base: R$ 5,00",
      "Valor de venda editavel",
      "Subcategoria Disney+"
    ],
    "deliverable": "Referencia fornecedor - Disney+ Assinatura 30 Dias #25",
    "addedToStore": false
  },
  {
    "id": "gm-126-spotify-plano-familiar-vaga-26",
    "name": "Spotify Plano Familiar (Vaga) #26",
    "category": "Assinaturas Digitais",
    "subcategory": "Spotify",
    "supplier": "GameMarket",
    "costPrice": 3.5,
    "salePrice": 5.77,
    "imageUrl": "https://cdn.simpleicons.org/spotify/1DB954",
    "benefits": [
      "Base: R$ 3,50",
      "Valor de venda editavel",
      "Subcategoria Spotify"
    ],
    "deliverable": "Referencia fornecedor - Spotify Plano Familiar (Vaga) #26",
    "addedToStore": false
  },
  {
    "id": "gm-127-crunchyroll-premium-30-dias-27",
    "name": "Crunchyroll Premium 30 Dias #27",
    "category": "Assinaturas Digitais",
    "subcategory": "Crunchyroll",
    "supplier": "GameMarket",
    "costPrice": 3,
    "salePrice": 4.95,
    "imageUrl": "https://cdn.simpleicons.org/crunchyroll/F47521",
    "benefits": [
      "Base: R$ 3,00",
      "Valor de venda editavel",
      "Subcategoria Crunchyroll"
    ],
    "deliverable": "Referencia fornecedor - Crunchyroll Premium 30 Dias #27",
    "addedToStore": false
  },
  {
    "id": "gm-128-hbo-max-tela-privada-28",
    "name": "HBO Max Tela Privada #28",
    "category": "Assinaturas Digitais",
    "subcategory": "HBO Max",
    "supplier": "GameMarket",
    "costPrice": 6,
    "salePrice": 9.9,
    "imageUrl": "https://cdn.simpleicons.org/hbomax/A855F7",
    "benefits": [
      "Base: R$ 6,00",
      "Valor de venda editavel",
      "Subcategoria HBO Max"
    ],
    "deliverable": "Referencia fornecedor - HBO Max Tela Privada #28",
    "addedToStore": false
  },
  {
    "id": "gm-129-prime-video-privado-29",
    "name": "Prime Video Privado #29",
    "category": "Assinaturas Digitais",
    "subcategory": "Prime Video",
    "supplier": "GameMarket",
    "costPrice": 5,
    "salePrice": 8.25,
    "imageUrl": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22520%22%20viewBox%3D%220%200%20800%20520%22%20data-storefy-brand-cover%3D%221%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20stop-color%3D%22%2306111f%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%2300a8e1%22%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%22s%22%3E%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2222%22%20stdDeviation%3D%2222%22%20flood-color%3D%22%23000%22%20flood-opacity%3D%22.45%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%22520%22%20rx%3D%2236%22%20fill%3D%22url(%23g)%22%2F%3E%3Ccircle%20cx%3D%22665%22%20cy%3D%2278%22%20r%3D%22158%22%20fill%3D%22%23fff%22%20opacity%3D%22.08%22%2F%3E%3Ccircle%20cx%3D%22118%22%20cy%3D%22430%22%20r%3D%22190%22%20fill%3D%22%23fff%22%20opacity%3D%22.06%22%2F%3E%3Crect%20x%3D%2256%22%20y%3D%2256%22%20width%3D%22688%22%20height%3D%22408%22%20rx%3D%2230%22%20fill%3D%22%23000%22%20opacity%3D%22.18%22%20stroke%3D%22%23fff%22%20stroke-opacity%3D%22.14%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22255%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22900%22%20fill%3D%22%23ffffff%22%20filter%3D%22url(%23s)%22%3EPrime%20Video%3C%2Ftext%3E%3Crect%20x%3D%22240%22%20y%3D%22330%22%20width%3D%22320%22%20height%3D%227%22%20rx%3D%223.5%22%20fill%3D%22%2300a8e1%22%20opacity%3D%22.9%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22386%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22800%22%20letter-spacing%3D%225%22%20fill%3D%22%23fff%22%20opacity%3D%22.72%22%3ESTOREFY%20OFERTA%20DIGITAL%3C%2Ftext%3E%3C%2Fsvg%3E",
    "benefits": [
      "Base: R$ 5,00",
      "Valor de venda editavel",
      "Subcategoria Prime Video"
    ],
    "deliverable": "Referencia fornecedor - Prime Video Privado #29",
    "addedToStore": false
  },
  {
    "id": "gm-130-paramount-30-dias-30",
    "name": "Paramount+ 30 Dias #30",
    "category": "Assinaturas Digitais",
    "subcategory": "Paramount+",
    "supplier": "GameMarket",
    "costPrice": 3,
    "salePrice": 4.95,
    "imageUrl": "https://cdn.simpleicons.org/paramountplus/0064FF",
    "benefits": [
      "Base: R$ 3,00",
      "Valor de venda editavel",
      "Subcategoria Paramount+"
    ],
    "deliverable": "Referencia fornecedor - Paramount+ 30 Dias #30",
    "addedToStore": false
  },
  {
    "id": "gm-131-youtube-premium-convite-familia-31",
    "name": "YouTube Premium Convite Família #31",
    "category": "Assinaturas Digitais",
    "subcategory": "YouTube Premium",
    "supplier": "GameMarket",
    "costPrice": 35,
    "salePrice": 57.75,
    "imageUrl": "https://cdn.simpleicons.org/youtube/FF0000",
    "benefits": [
      "Base: R$ 35,00",
      "Valor de venda editavel",
      "Subcategoria YouTube Premium"
    ],
    "deliverable": "Referencia fornecedor - YouTube Premium Convite Família #31",
    "addedToStore": false
  },
  {
    "id": "gm-132-netflix-ultra-hd-32",
    "name": "Netflix Ultra HD #32",
    "category": "Assinaturas Digitais",
    "subcategory": "Netflix",
    "supplier": "GameMarket",
    "costPrice": 9,
    "salePrice": 14.85,
    "imageUrl": "https://cdn.simpleicons.org/netflix/E50914",
    "benefits": [
      "Base: R$ 9,00",
      "Valor de venda editavel",
      "Subcategoria Netflix"
    ],
    "deliverable": "Referencia fornecedor - Netflix Ultra HD #32",
    "addedToStore": false
  },
  {
    "id": "gm-133-disney-star-combo-33",
    "name": "Disney+ & Star+ Combo #33",
    "category": "Assinaturas Digitais",
    "subcategory": "Disney+",
    "supplier": "GameMarket",
    "costPrice": 5,
    "salePrice": 8.25,
    "imageUrl": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22520%22%20viewBox%3D%220%200%20800%20520%22%20data-storefy-brand-cover%3D%221%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20stop-color%3D%22%23061a45%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23163d9a%22%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%22s%22%3E%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2222%22%20stdDeviation%3D%2222%22%20flood-color%3D%22%23000%22%20flood-opacity%3D%22.45%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%22520%22%20rx%3D%2236%22%20fill%3D%22url(%23g)%22%2F%3E%3Ccircle%20cx%3D%22665%22%20cy%3D%2278%22%20r%3D%22158%22%20fill%3D%22%23fff%22%20opacity%3D%22.08%22%2F%3E%3Ccircle%20cx%3D%22118%22%20cy%3D%22430%22%20r%3D%22190%22%20fill%3D%22%23fff%22%20opacity%3D%22.06%22%2F%3E%3Crect%20x%3D%2256%22%20y%3D%2256%22%20width%3D%22688%22%20height%3D%22408%22%20rx%3D%2230%22%20fill%3D%22%23000%22%20opacity%3D%22.18%22%20stroke%3D%22%23fff%22%20stroke-opacity%3D%22.14%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22255%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22900%22%20fill%3D%22%23ffffff%22%20filter%3D%22url(%23s)%22%3EDisney%2B%3C%2Ftext%3E%3Crect%20x%3D%22240%22%20y%3D%22330%22%20width%3D%22320%22%20height%3D%227%22%20rx%3D%223.5%22%20fill%3D%22%2365b7ff%22%20opacity%3D%22.9%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22386%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22800%22%20letter-spacing%3D%225%22%20fill%3D%22%23fff%22%20opacity%3D%22.72%22%3ESTOREFY%20OFERTA%20DIGITAL%3C%2Ftext%3E%3C%2Fsvg%3E",
    "benefits": [
      "Base: R$ 5,00",
      "Valor de venda editavel",
      "Subcategoria Disney+"
    ],
    "deliverable": "Referencia fornecedor - Disney+ & Star+ Combo #33",
    "addedToStore": false
  },
  {
    "id": "gm-134-spotify-plano-familiar-vaga-34",
    "name": "Spotify Plano Familiar (Vaga) #34",
    "category": "Assinaturas Digitais",
    "subcategory": "Spotify",
    "supplier": "GameMarket",
    "costPrice": 3.5,
    "salePrice": 5.77,
    "imageUrl": "https://cdn.simpleicons.org/spotify/1DB954",
    "benefits": [
      "Base: R$ 3,50",
      "Valor de venda editavel",
      "Subcategoria Spotify"
    ],
    "deliverable": "Referencia fornecedor - Spotify Plano Familiar (Vaga) #34",
    "addedToStore": false
  },
  {
    "id": "gm-135-crunchyroll-fan-1-mes-35",
    "name": "Crunchyroll Fan 1 Mês #35",
    "category": "Assinaturas Digitais",
    "subcategory": "Crunchyroll",
    "supplier": "GameMarket",
    "costPrice": 3,
    "salePrice": 4.95,
    "imageUrl": "https://cdn.simpleicons.org/crunchyroll/F47521",
    "benefits": [
      "Base: R$ 3,00",
      "Valor de venda editavel",
      "Subcategoria Crunchyroll"
    ],
    "deliverable": "Referencia fornecedor - Crunchyroll Fan 1 Mês #35",
    "addedToStore": false
  },
  {
    "id": "gm-136-hbo-max-mobile-36",
    "name": "HBO Max Mobile #36",
    "category": "Assinaturas Digitais",
    "subcategory": "HBO Max",
    "supplier": "GameMarket",
    "costPrice": 5.5,
    "salePrice": 9.07,
    "imageUrl": "https://cdn.simpleicons.org/hbomax/A855F7",
    "benefits": [
      "Base: R$ 5,50",
      "Valor de venda editavel",
      "Subcategoria HBO Max"
    ],
    "deliverable": "Referencia fornecedor - HBO Max Mobile #36",
    "addedToStore": false
  },
  {
    "id": "gm-137-prime-video-conta-completa-37",
    "name": "Prime Video Conta Completa #37",
    "category": "Assinaturas Digitais",
    "subcategory": "Prime Video",
    "supplier": "GameMarket",
    "costPrice": 5,
    "salePrice": 8.25,
    "imageUrl": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22520%22%20viewBox%3D%220%200%20800%20520%22%20data-storefy-brand-cover%3D%221%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20stop-color%3D%22%2306111f%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%2300a8e1%22%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%22s%22%3E%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2222%22%20stdDeviation%3D%2222%22%20flood-color%3D%22%23000%22%20flood-opacity%3D%22.45%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%22520%22%20rx%3D%2236%22%20fill%3D%22url(%23g)%22%2F%3E%3Ccircle%20cx%3D%22665%22%20cy%3D%2278%22%20r%3D%22158%22%20fill%3D%22%23fff%22%20opacity%3D%22.08%22%2F%3E%3Ccircle%20cx%3D%22118%22%20cy%3D%22430%22%20r%3D%22190%22%20fill%3D%22%23fff%22%20opacity%3D%22.06%22%2F%3E%3Crect%20x%3D%2256%22%20y%3D%2256%22%20width%3D%22688%22%20height%3D%22408%22%20rx%3D%2230%22%20fill%3D%22%23000%22%20opacity%3D%22.18%22%20stroke%3D%22%23fff%22%20stroke-opacity%3D%22.14%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22255%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22900%22%20fill%3D%22%23ffffff%22%20filter%3D%22url(%23s)%22%3EPrime%20Video%3C%2Ftext%3E%3Crect%20x%3D%22240%22%20y%3D%22330%22%20width%3D%22320%22%20height%3D%227%22%20rx%3D%223.5%22%20fill%3D%22%2300a8e1%22%20opacity%3D%22.9%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22386%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22800%22%20letter-spacing%3D%225%22%20fill%3D%22%23fff%22%20opacity%3D%22.72%22%3ESTOREFY%20OFERTA%20DIGITAL%3C%2Ftext%3E%3C%2Fsvg%3E",
    "benefits": [
      "Base: R$ 5,00",
      "Valor de venda editavel",
      "Subcategoria Prime Video"
    ],
    "deliverable": "Referencia fornecedor - Prime Video Conta Completa #37",
    "addedToStore": false
  },
  {
    "id": "gm-138-paramount-tela-38",
    "name": "Paramount+ Tela #38",
    "category": "Assinaturas Digitais",
    "subcategory": "Paramount+",
    "supplier": "GameMarket",
    "costPrice": 3,
    "salePrice": 4.95,
    "imageUrl": "https://cdn.simpleicons.org/paramountplus/0064FF",
    "benefits": [
      "Base: R$ 3,00",
      "Valor de venda editavel",
      "Subcategoria Paramount+"
    ],
    "deliverable": "Referencia fornecedor - Paramount+ Tela #38",
    "addedToStore": false
  },
  {
    "id": "gm-139-youtube-premium-sem-anuncios-39",
    "name": "YouTube Premium Sem Anúncios #39",
    "category": "Assinaturas Digitais",
    "subcategory": "YouTube Premium",
    "supplier": "GameMarket",
    "costPrice": 35,
    "salePrice": 57.75,
    "imageUrl": "https://cdn.simpleicons.org/youtube/FF0000",
    "benefits": [
      "Base: R$ 35,00",
      "Valor de venda editavel",
      "Subcategoria YouTube Premium"
    ],
    "deliverable": "Referencia fornecedor - YouTube Premium Sem Anúncios #39",
    "addedToStore": false
  },
  {
    "id": "gm-140-netflix-conta-compartilhada-40",
    "name": "Netflix Conta Compartilhada #40",
    "category": "Assinaturas Digitais",
    "subcategory": "Netflix",
    "supplier": "GameMarket",
    "costPrice": 7.9,
    "salePrice": 13.04,
    "imageUrl": "https://cdn.simpleicons.org/netflix/E50914",
    "benefits": [
      "Base: R$ 7,90",
      "Valor de venda editavel",
      "Subcategoria Netflix"
    ],
    "deliverable": "Referencia fornecedor - Netflix Conta Compartilhada #40",
    "addedToStore": false
  },
  {
    "id": "gm-141-disney-assinatura-30-dias-41",
    "name": "Disney+ Assinatura 30 Dias #41",
    "category": "Assinaturas Digitais",
    "subcategory": "Disney+",
    "supplier": "GameMarket",
    "costPrice": 5,
    "salePrice": 8.25,
    "imageUrl": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22520%22%20viewBox%3D%220%200%20800%20520%22%20data-storefy-brand-cover%3D%221%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20stop-color%3D%22%23061a45%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23163d9a%22%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%22s%22%3E%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2222%22%20stdDeviation%3D%2222%22%20flood-color%3D%22%23000%22%20flood-opacity%3D%22.45%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%22520%22%20rx%3D%2236%22%20fill%3D%22url(%23g)%22%2F%3E%3Ccircle%20cx%3D%22665%22%20cy%3D%2278%22%20r%3D%22158%22%20fill%3D%22%23fff%22%20opacity%3D%22.08%22%2F%3E%3Ccircle%20cx%3D%22118%22%20cy%3D%22430%22%20r%3D%22190%22%20fill%3D%22%23fff%22%20opacity%3D%22.06%22%2F%3E%3Crect%20x%3D%2256%22%20y%3D%2256%22%20width%3D%22688%22%20height%3D%22408%22%20rx%3D%2230%22%20fill%3D%22%23000%22%20opacity%3D%22.18%22%20stroke%3D%22%23fff%22%20stroke-opacity%3D%22.14%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22255%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22900%22%20fill%3D%22%23ffffff%22%20filter%3D%22url(%23s)%22%3EDisney%2B%3C%2Ftext%3E%3Crect%20x%3D%22240%22%20y%3D%22330%22%20width%3D%22320%22%20height%3D%227%22%20rx%3D%223.5%22%20fill%3D%22%2365b7ff%22%20opacity%3D%22.9%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22386%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22800%22%20letter-spacing%3D%225%22%20fill%3D%22%23fff%22%20opacity%3D%22.72%22%3ESTOREFY%20OFERTA%20DIGITAL%3C%2Ftext%3E%3C%2Fsvg%3E",
    "benefits": [
      "Base: R$ 5,00",
      "Valor de venda editavel",
      "Subcategoria Disney+"
    ],
    "deliverable": "Referencia fornecedor - Disney+ Assinatura 30 Dias #41",
    "addedToStore": false
  },
  {
    "id": "gm-142-spotify-premium-permanente-servico-42",
    "name": "Spotify Premium Permanente (Serviço) #42",
    "category": "Assinaturas Digitais",
    "subcategory": "Spotify",
    "supplier": "GameMarket",
    "costPrice": 4.99,
    "salePrice": 8.23,
    "imageUrl": "https://cdn.simpleicons.org/spotify/1DB954",
    "benefits": [
      "Base: R$ 4,99",
      "Valor de venda editavel",
      "Subcategoria Spotify"
    ],
    "deliverable": "Referencia fornecedor - Spotify Premium Permanente (Serviço) #42",
    "addedToStore": false
  },
  {
    "id": "gm-143-crunchyroll-anual-43",
    "name": "Crunchyroll Anual #43",
    "category": "Assinaturas Digitais",
    "subcategory": "Crunchyroll",
    "supplier": "GameMarket",
    "costPrice": 2.5,
    "salePrice": 4.13,
    "imageUrl": "https://cdn.simpleicons.org/crunchyroll/F47521",
    "benefits": [
      "Base: R$ 2,50",
      "Valor de venda editavel",
      "Subcategoria Crunchyroll"
    ],
    "deliverable": "Referencia fornecedor - Crunchyroll Anual #43",
    "addedToStore": false
  },
  {
    "id": "gm-144-hbo-max-tela-privada-44",
    "name": "HBO Max Tela Privada #44",
    "category": "Assinaturas Digitais",
    "subcategory": "HBO Max",
    "supplier": "GameMarket",
    "costPrice": 45,
    "salePrice": 74.25,
    "imageUrl": "https://cdn.simpleicons.org/hbomax/A855F7",
    "benefits": [
      "Base: R$ 45,00",
      "Valor de venda editavel",
      "Subcategoria HBO Max"
    ],
    "deliverable": "Referencia fornecedor - HBO Max Tela Privada #44",
    "addedToStore": false
  },
  {
    "id": "gm-145-amazon-prime-servico-45",
    "name": "Amazon Prime (Serviço) #45",
    "category": "Assinaturas Digitais",
    "subcategory": "Prime Video",
    "supplier": "GameMarket",
    "costPrice": 5,
    "salePrice": 8.25,
    "imageUrl": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22520%22%20viewBox%3D%220%200%20800%20520%22%20data-storefy-brand-cover%3D%221%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20stop-color%3D%22%2306111f%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%2300a8e1%22%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%22s%22%3E%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2222%22%20stdDeviation%3D%2222%22%20flood-color%3D%22%23000%22%20flood-opacity%3D%22.45%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%22520%22%20rx%3D%2236%22%20fill%3D%22url(%23g)%22%2F%3E%3Ccircle%20cx%3D%22665%22%20cy%3D%2278%22%20r%3D%22158%22%20fill%3D%22%23fff%22%20opacity%3D%22.08%22%2F%3E%3Ccircle%20cx%3D%22118%22%20cy%3D%22430%22%20r%3D%22190%22%20fill%3D%22%23fff%22%20opacity%3D%22.06%22%2F%3E%3Crect%20x%3D%2256%22%20y%3D%2256%22%20width%3D%22688%22%20height%3D%22408%22%20rx%3D%2230%22%20fill%3D%22%23000%22%20opacity%3D%22.18%22%20stroke%3D%22%23fff%22%20stroke-opacity%3D%22.14%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22255%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22900%22%20fill%3D%22%23ffffff%22%20filter%3D%22url(%23s)%22%3EPrime%20Video%3C%2Ftext%3E%3Crect%20x%3D%22240%22%20y%3D%22330%22%20width%3D%22320%22%20height%3D%227%22%20rx%3D%223.5%22%20fill%3D%22%2300a8e1%22%20opacity%3D%22.9%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22386%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22800%22%20letter-spacing%3D%225%22%20fill%3D%22%23fff%22%20opacity%3D%22.72%22%3ESTOREFY%20OFERTA%20DIGITAL%3C%2Ftext%3E%3C%2Fsvg%3E",
    "benefits": [
      "Base: R$ 5,00",
      "Valor de venda editavel",
      "Subcategoria Prime Video"
    ],
    "deliverable": "Referencia fornecedor - Amazon Prime (Serviço) #45",
    "addedToStore": false
  },
  {
    "id": "gm-146-paramount-plus-premium-46",
    "name": "Paramount Plus Premium #46",
    "category": "Assinaturas Digitais",
    "subcategory": "Paramount+",
    "supplier": "GameMarket",
    "costPrice": 2.5,
    "salePrice": 4.13,
    "imageUrl": "https://cdn.simpleicons.org/paramountplus/0064FF",
    "benefits": [
      "Base: R$ 2,50",
      "Valor de venda editavel",
      "Subcategoria Paramount+"
    ],
    "deliverable": "Referencia fornecedor - Paramount Plus Premium #46",
    "addedToStore": false
  },
  {
    "id": "gm-147-youtube-premium-sem-anuncios-47",
    "name": "YouTube Premium Sem Anúncios #47",
    "category": "Assinaturas Digitais",
    "subcategory": "YouTube Premium",
    "supplier": "GameMarket",
    "costPrice": 4,
    "salePrice": 6.6,
    "imageUrl": "https://cdn.simpleicons.org/youtube/FF0000",
    "benefits": [
      "Base: R$ 4,00",
      "Valor de venda editavel",
      "Subcategoria YouTube Premium"
    ],
    "deliverable": "Referencia fornecedor - YouTube Premium Sem Anúncios #47",
    "addedToStore": false
  },
  {
    "id": "gm-148-netflix-ultra-hd-48",
    "name": "Netflix Ultra HD #48",
    "category": "Assinaturas Digitais",
    "subcategory": "Netflix",
    "supplier": "GameMarket",
    "costPrice": 7.9,
    "salePrice": 13.04,
    "imageUrl": "https://cdn.simpleicons.org/netflix/E50914",
    "benefits": [
      "Base: R$ 7,90",
      "Valor de venda editavel",
      "Subcategoria Netflix"
    ],
    "deliverable": "Referencia fornecedor - Netflix Ultra HD #48",
    "addedToStore": false
  },
  {
    "id": "gm-149-disney-plus-conta-privada-49",
    "name": "Disney Plus Conta Privada #49",
    "category": "Assinaturas Digitais",
    "subcategory": "Disney+",
    "supplier": "GameMarket",
    "costPrice": 10,
    "salePrice": 16.5,
    "imageUrl": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22520%22%20viewBox%3D%220%200%20800%20520%22%20data-storefy-brand-cover%3D%221%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20stop-color%3D%22%23061a45%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23163d9a%22%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%22s%22%3E%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2222%22%20stdDeviation%3D%2222%22%20flood-color%3D%22%23000%22%20flood-opacity%3D%22.45%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%22520%22%20rx%3D%2236%22%20fill%3D%22url(%23g)%22%2F%3E%3Ccircle%20cx%3D%22665%22%20cy%3D%2278%22%20r%3D%22158%22%20fill%3D%22%23fff%22%20opacity%3D%22.08%22%2F%3E%3Ccircle%20cx%3D%22118%22%20cy%3D%22430%22%20r%3D%22190%22%20fill%3D%22%23fff%22%20opacity%3D%22.06%22%2F%3E%3Crect%20x%3D%2256%22%20y%3D%2256%22%20width%3D%22688%22%20height%3D%22408%22%20rx%3D%2230%22%20fill%3D%22%23000%22%20opacity%3D%22.18%22%20stroke%3D%22%23fff%22%20stroke-opacity%3D%22.14%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22255%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22900%22%20fill%3D%22%23ffffff%22%20filter%3D%22url(%23s)%22%3EDisney%2B%3C%2Ftext%3E%3Crect%20x%3D%22240%22%20y%3D%22330%22%20width%3D%22320%22%20height%3D%227%22%20rx%3D%223.5%22%20fill%3D%22%2365b7ff%22%20opacity%3D%22.9%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22386%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22800%22%20letter-spacing%3D%225%22%20fill%3D%22%23fff%22%20opacity%3D%22.72%22%3ESTOREFY%20OFERTA%20DIGITAL%3C%2Ftext%3E%3C%2Fsvg%3E",
    "benefits": [
      "Base: R$ 10,00",
      "Valor de venda editavel",
      "Subcategoria Disney+"
    ],
    "deliverable": "Referencia fornecedor - Disney Plus Conta Privada #49",
    "addedToStore": false
  },
  {
    "id": "gm-150-spotify-premium-permanente-servico-50",
    "name": "Spotify Premium Permanente (Serviço) #50",
    "category": "Assinaturas Digitais",
    "subcategory": "Spotify",
    "supplier": "GameMarket",
    "costPrice": 5,
    "salePrice": 8.25,
    "imageUrl": "https://cdn.simpleicons.org/spotify/1DB954",
    "benefits": [
      "Base: R$ 5,00",
      "Valor de venda editavel",
      "Subcategoria Spotify"
    ],
    "deliverable": "Referencia fornecedor - Spotify Premium Permanente (Serviço) #50",
    "addedToStore": false
  },
  {
    "id": "gm-ai-001-chatgpt-plus-30-dias",
    "name": "CHATGPT PLUS 30 DIAS - ACESSO PREMIUM INDIVIDUAL",
    "category": "Assinaturas Digitais",
    "subcategory": "ChatGPT",
    "supplier": "GameMarket",
    "costPrice": 1,
    "salePrice": 9.9,
    "imageUrl": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22520%22%20viewBox%3D%220%200%20800%20520%22%20data-storefy-brand-cover%3D%221%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20stop-color%3D%22%230b1110%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%2310a37f%22%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%22s%22%3E%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2222%22%20stdDeviation%3D%2222%22%20flood-color%3D%22%23000%22%20flood-opacity%3D%22.48%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%22520%22%20rx%3D%2236%22%20fill%3D%22url(%23g)%22%2F%3E%3Ccircle%20cx%3D%22662%22%20cy%3D%2282%22%20r%3D%22164%22%20fill%3D%22%23fff%22%20opacity%3D%22.08%22%2F%3E%3Ccircle%20cx%3D%22120%22%20cy%3D%22422%22%20r%3D%22190%22%20fill%3D%22%23fff%22%20opacity%3D%22.065%22%2F%3E%3Crect%20x%3D%2256%22%20y%3D%2256%22%20width%3D%22688%22%20height%3D%22408%22%20rx%3D%2230%22%20fill%3D%22%23000%22%20opacity%3D%22.2%22%20stroke%3D%22%23fff%22%20stroke-opacity%3D%22.14%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22118%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2218%22%20font-weight%3D%22900%22%20letter-spacing%3D%226%22%20fill%3D%22%23fff%22%20opacity%3D%22.68%22%3EOPENAI%20PREMIUM%3C%2Ftext%3E%3Ctext%20x%3D%22400%22%20y%3D%22262%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2274%22%20font-weight%3D%22900%22%20fill%3D%22%23ffffff%22%20filter%3D%22url(%23s)%22%3EChatGPT%3C%2Ftext%3E%3Crect%20x%3D%22230%22%20y%3D%22334%22%20width%3D%22340%22%20height%3D%227%22%20rx%3D%223.5%22%20fill%3D%22%2310a37f%22%20opacity%3D%22.95%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22390%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22800%22%20letter-spacing%3D%225%22%20fill%3D%22%23fff%22%20opacity%3D%22.72%22%3ESTOREFY%20OFERTA%20DIGITAL%3C%2Ftext%3E%3C%2Fsvg%3E",
    "benefits": [
      "Acesso premium por 30 dias",
      "Produto de alta procura em IA",
      "Preco de venda editavel"
    ],
    "deliverable": "Acesso premium ChatGPT por 30 dias",
    "addedToStore": false,
    "sourceUrl": "https://gamemarket.com.br/"
  },
  {
    "id": "gm-ai-002-gemini-3-pro-2tb-veo-31",
    "name": "GEMINI 3 PRO + 2TB + VEO 3.1 + BRINDE - 30 DIAS",
    "category": "Assinaturas Digitais",
    "subcategory": "Gemini + Veo",
    "supplier": "GameMarket",
    "costPrice": 33.3,
    "salePrice": 59.9,
    "imageUrl": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22520%22%20viewBox%3D%220%200%20800%20520%22%20data-storefy-brand-cover%3D%221%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20stop-color%3D%22%23071226%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%234285f4%22%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%22s%22%3E%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2222%22%20stdDeviation%3D%2222%22%20flood-color%3D%22%23000%22%20flood-opacity%3D%22.48%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%22520%22%20rx%3D%2236%22%20fill%3D%22url(%23g)%22%2F%3E%3Ccircle%20cx%3D%22662%22%20cy%3D%2282%22%20r%3D%22164%22%20fill%3D%22%23fff%22%20opacity%3D%22.08%22%2F%3E%3Ccircle%20cx%3D%22120%22%20cy%3D%22422%22%20r%3D%22190%22%20fill%3D%22%23fff%22%20opacity%3D%22.065%22%2F%3E%3Crect%20x%3D%2256%22%20y%3D%2256%22%20width%3D%22688%22%20height%3D%22408%22%20rx%3D%2230%22%20fill%3D%22%23000%22%20opacity%3D%22.2%22%20stroke%3D%22%23fff%22%20stroke-opacity%3D%22.14%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22118%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2218%22%20font-weight%3D%22900%22%20letter-spacing%3D%226%22%20fill%3D%22%23fff%22%20opacity%3D%22.68%22%3EGOOGLE%20IA%3C%2Ftext%3E%3Ctext%20x%3D%22400%22%20y%3D%22262%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2274%22%20font-weight%3D%22900%22%20fill%3D%22%23ffffff%22%20filter%3D%22url(%23s)%22%3EGemini%20%2B%20Veo%3C%2Ftext%3E%3Crect%20x%3D%22230%22%20y%3D%22334%22%20width%3D%22340%22%20height%3D%227%22%20rx%3D%223.5%22%20fill%3D%22%23a78bfa%22%20opacity%3D%22.95%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22390%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22800%22%20letter-spacing%3D%225%22%20fill%3D%22%23fff%22%20opacity%3D%22.72%22%3ESTOREFY%20OFERTA%20DIGITAL%3C%2Ftext%3E%3C%2Fsvg%3E",
    "benefits": [
      "Gemini Pro com pacote avancado",
      "Inclui 2TB e Veo 3.1",
      "Oferta premium de 30 dias"
    ],
    "deliverable": "Acesso Gemini Pro + 2TB + Veo por 30 dias",
    "addedToStore": false,
    "sourceUrl": "https://gamemarket.com.br/"
  },
  {
    "id": "gm-ai-003-super-grok-30-dias",
    "name": "SUPER GROK - 30 DIAS PRIVADO + BRINDE",
    "category": "Assinaturas Digitais",
    "subcategory": "Grok",
    "supplier": "GameMarket",
    "costPrice": 36.9,
    "salePrice": 64.9,
    "imageUrl": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22520%22%20viewBox%3D%220%200%20800%20520%22%20data-storefy-brand-cover%3D%221%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20stop-color%3D%22%23030712%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23111827%22%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%22s%22%3E%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2222%22%20stdDeviation%3D%2222%22%20flood-color%3D%22%23000%22%20flood-opacity%3D%22.48%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%22520%22%20rx%3D%2236%22%20fill%3D%22url(%23g)%22%2F%3E%3Ccircle%20cx%3D%22662%22%20cy%3D%2282%22%20r%3D%22164%22%20fill%3D%22%23fff%22%20opacity%3D%22.08%22%2F%3E%3Ccircle%20cx%3D%22120%22%20cy%3D%22422%22%20r%3D%22190%22%20fill%3D%22%23fff%22%20opacity%3D%22.065%22%2F%3E%3Crect%20x%3D%2256%22%20y%3D%2256%22%20width%3D%22688%22%20height%3D%22408%22%20rx%3D%2230%22%20fill%3D%22%23000%22%20opacity%3D%22.2%22%20stroke%3D%22%23fff%22%20stroke-opacity%3D%22.14%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22118%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2218%22%20font-weight%3D%22900%22%20letter-spacing%3D%226%22%20fill%3D%22%23fff%22%20opacity%3D%22.68%22%3EXAI%20PREMIUM%3C%2Ftext%3E%3Ctext%20x%3D%22400%22%20y%3D%22262%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2274%22%20font-weight%3D%22900%22%20fill%3D%22%23ffffff%22%20filter%3D%22url(%23s)%22%3EGrok%3C%2Ftext%3E%3Crect%20x%3D%22230%22%20y%3D%22334%22%20width%3D%22340%22%20height%3D%227%22%20rx%3D%223.5%22%20fill%3D%22%239ca3af%22%20opacity%3D%22.95%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22390%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22800%22%20letter-spacing%3D%225%22%20fill%3D%22%23fff%22%20opacity%3D%22.72%22%3ESTOREFY%20OFERTA%20DIGITAL%3C%2Ftext%3E%3C%2Fsvg%3E",
    "benefits": [
      "Acesso privado por 30 dias",
      "Ferramenta de IA premium",
      "Inclui brinde do fornecedor"
    ],
    "deliverable": "Acesso Super Grok privado por 30 dias",
    "addedToStore": false,
    "sourceUrl": "https://gamemarket.com.br/"
  },
  {
    "id": "gm-ai-004-gemini-pro-30-dias",
    "name": "GEMINI PRO 30 DIAS (CONTA PRIVADA)",
    "category": "Assinaturas Digitais",
    "subcategory": "Gemini",
    "supplier": "GameMarket",
    "costPrice": 35.99,
    "salePrice": 59.9,
    "imageUrl": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22520%22%20viewBox%3D%220%200%20800%20520%22%20data-storefy-brand-cover%3D%221%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20stop-color%3D%22%23071226%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%237c3aed%22%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%22s%22%3E%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2222%22%20stdDeviation%3D%2222%22%20flood-color%3D%22%23000%22%20flood-opacity%3D%22.48%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%22520%22%20rx%3D%2236%22%20fill%3D%22url(%23g)%22%2F%3E%3Ccircle%20cx%3D%22662%22%20cy%3D%2282%22%20r%3D%22164%22%20fill%3D%22%23fff%22%20opacity%3D%22.08%22%2F%3E%3Ccircle%20cx%3D%22120%22%20cy%3D%22422%22%20r%3D%22190%22%20fill%3D%22%23fff%22%20opacity%3D%22.065%22%2F%3E%3Crect%20x%3D%2256%22%20y%3D%2256%22%20width%3D%22688%22%20height%3D%22408%22%20rx%3D%2230%22%20fill%3D%22%23000%22%20opacity%3D%22.2%22%20stroke%3D%22%23fff%22%20stroke-opacity%3D%22.14%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22118%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2218%22%20font-weight%3D%22900%22%20letter-spacing%3D%226%22%20fill%3D%22%23fff%22%20opacity%3D%22.68%22%3EGOOGLE%20IA%3C%2Ftext%3E%3Ctext%20x%3D%22400%22%20y%3D%22262%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2274%22%20font-weight%3D%22900%22%20fill%3D%22%23ffffff%22%20filter%3D%22url(%23s)%22%3EGemini%20Pro%3C%2Ftext%3E%3Crect%20x%3D%22230%22%20y%3D%22334%22%20width%3D%22340%22%20height%3D%227%22%20rx%3D%223.5%22%20fill%3D%22%2360a5fa%22%20opacity%3D%22.95%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22390%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22800%22%20letter-spacing%3D%225%22%20fill%3D%22%23fff%22%20opacity%3D%22.72%22%3ESTOREFY%20OFERTA%20DIGITAL%3C%2Ftext%3E%3C%2Fsvg%3E",
    "benefits": [
      "Conta privada por 30 dias",
      "Assinatura Gemini Pro",
      "Boa margem para revenda"
    ],
    "deliverable": "Conta privada Gemini Pro por 30 dias",
    "addedToStore": false,
    "sourceUrl": "https://gamemarket.com.br/"
  },
  {
    "id": "gm-ai-005-chatgpt-55-plus-email",
    "name": "CHATGPT 5.5 PLUS PRIVADO NO SEU E-MAIL - 30 DIAS",
    "category": "Assinaturas Digitais",
    "subcategory": "ChatGPT",
    "supplier": "GameMarket",
    "costPrice": 7.9,
    "salePrice": 19.9,
    "imageUrl": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22520%22%20viewBox%3D%220%200%20800%20520%22%20data-storefy-brand-cover%3D%221%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20stop-color%3D%22%230b1110%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%2310a37f%22%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%22s%22%3E%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2222%22%20stdDeviation%3D%2222%22%20flood-color%3D%22%23000%22%20flood-opacity%3D%22.48%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%22520%22%20rx%3D%2236%22%20fill%3D%22url(%23g)%22%2F%3E%3Ccircle%20cx%3D%22662%22%20cy%3D%2282%22%20r%3D%22164%22%20fill%3D%22%23fff%22%20opacity%3D%22.08%22%2F%3E%3Ccircle%20cx%3D%22120%22%20cy%3D%22422%22%20r%3D%22190%22%20fill%3D%22%23fff%22%20opacity%3D%22.065%22%2F%3E%3Crect%20x%3D%2256%22%20y%3D%2256%22%20width%3D%22688%22%20height%3D%22408%22%20rx%3D%2230%22%20fill%3D%22%23000%22%20opacity%3D%22.2%22%20stroke%3D%22%23fff%22%20stroke-opacity%3D%22.14%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22118%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2218%22%20font-weight%3D%22900%22%20letter-spacing%3D%226%22%20fill%3D%22%23fff%22%20opacity%3D%22.68%22%3EOPENAI%20PRIVADO%3C%2Ftext%3E%3Ctext%20x%3D%22400%22%20y%3D%22262%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2274%22%20font-weight%3D%22900%22%20fill%3D%22%23ffffff%22%20filter%3D%22url(%23s)%22%3EChatGPT%205.5%3C%2Ftext%3E%3Crect%20x%3D%22230%22%20y%3D%22334%22%20width%3D%22340%22%20height%3D%227%22%20rx%3D%223.5%22%20fill%3D%22%2310a37f%22%20opacity%3D%22.95%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22390%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22800%22%20letter-spacing%3D%225%22%20fill%3D%22%23fff%22%20opacity%3D%22.72%22%3ESTOREFY%20OFERTA%20DIGITAL%3C%2Ftext%3E%3C%2Fsvg%3E",
    "benefits": [
      "Ativado no e-mail do cliente",
      "Acesso privado por 30 dias",
      "Produto chamativo para vitrine"
    ],
    "deliverable": "Acesso ChatGPT Plus privado por e-mail por 30 dias",
    "addedToStore": false,
    "sourceUrl": "https://gamemarket.com.br/"
  },
  {
    "id": "gm-ai-006-gemini-business-30-dias",
    "name": "GEMINI BUSINESS - 30 DIAS",
    "category": "Assinaturas Digitais",
    "subcategory": "Gemini Business",
    "supplier": "GameMarket",
    "costPrice": 3,
    "salePrice": 14.9,
    "imageUrl": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22520%22%20viewBox%3D%220%200%20800%20520%22%20data-storefy-brand-cover%3D%221%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20stop-color%3D%22%23071226%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%230ea5e9%22%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%22s%22%3E%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2222%22%20stdDeviation%3D%2222%22%20flood-color%3D%22%23000%22%20flood-opacity%3D%22.48%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%22520%22%20rx%3D%2236%22%20fill%3D%22url(%23g)%22%2F%3E%3Ccircle%20cx%3D%22662%22%20cy%3D%2282%22%20r%3D%22164%22%20fill%3D%22%23fff%22%20opacity%3D%22.08%22%2F%3E%3Ccircle%20cx%3D%22120%22%20cy%3D%22422%22%20r%3D%22190%22%20fill%3D%22%23fff%22%20opacity%3D%22.065%22%2F%3E%3Crect%20x%3D%2256%22%20y%3D%2256%22%20width%3D%22688%22%20height%3D%22408%22%20rx%3D%2230%22%20fill%3D%22%23000%22%20opacity%3D%22.2%22%20stroke%3D%22%23fff%22%20stroke-opacity%3D%22.14%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22118%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2218%22%20font-weight%3D%22900%22%20letter-spacing%3D%226%22%20fill%3D%22%23fff%22%20opacity%3D%22.68%22%3EGOOGLE%20BUSINESS%3C%2Ftext%3E%3Ctext%20x%3D%22400%22%20y%3D%22262%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2274%22%20font-weight%3D%22900%22%20fill%3D%22%23ffffff%22%20filter%3D%22url(%23s)%22%3EGemini%20Business%3C%2Ftext%3E%3Crect%20x%3D%22230%22%20y%3D%22334%22%20width%3D%22340%22%20height%3D%227%22%20rx%3D%223.5%22%20fill%3D%22%2393c5fd%22%20opacity%3D%22.95%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22390%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22800%22%20letter-spacing%3D%225%22%20fill%3D%22%23fff%22%20opacity%3D%22.72%22%3ESTOREFY%20OFERTA%20DIGITAL%3C%2Ftext%3E%3C%2Fsvg%3E",
    "benefits": [
      "Plano business por 30 dias",
      "Custo agressivo para revenda",
      "Preco de venda editavel"
    ],
    "deliverable": "Acesso Gemini Business por 30 dias",
    "addedToStore": false,
    "sourceUrl": "https://gamemarket.com.br/"
  },
  {
    "id": "gm-ai-007-combo-chatgpt-canva-spotify",
    "name": "COMBO PREMIUM: CHATGPT PLUS + CANVA PRO + SPOTIFY",
    "category": "Assinaturas Digitais",
    "subcategory": "Combo IA + Ferramentas",
    "supplier": "GameMarket",
    "costPrice": 9.9,
    "salePrice": 29.9,
    "imageUrl": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22520%22%20viewBox%3D%220%200%20800%20520%22%20data-storefy-brand-cover%3D%221%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20stop-color%3D%22%23150b2e%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%2306b6d4%22%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%22s%22%3E%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2222%22%20stdDeviation%3D%2222%22%20flood-color%3D%22%23000%22%20flood-opacity%3D%22.48%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%22520%22%20rx%3D%2236%22%20fill%3D%22url(%23g)%22%2F%3E%3Ccircle%20cx%3D%22662%22%20cy%3D%2282%22%20r%3D%22164%22%20fill%3D%22%23fff%22%20opacity%3D%22.08%22%2F%3E%3Ccircle%20cx%3D%22120%22%20cy%3D%22422%22%20r%3D%22190%22%20fill%3D%22%23fff%22%20opacity%3D%22.065%22%2F%3E%3Crect%20x%3D%2256%22%20y%3D%2256%22%20width%3D%22688%22%20height%3D%22408%22%20rx%3D%2230%22%20fill%3D%22%23000%22%20opacity%3D%22.2%22%20stroke%3D%22%23fff%22%20stroke-opacity%3D%22.14%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22118%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2218%22%20font-weight%3D%22900%22%20letter-spacing%3D%226%22%20fill%3D%22%23fff%22%20opacity%3D%22.68%22%3ECHATGPT%20%2B%20CANVA%20%2B%20SPOTIFY%3C%2Ftext%3E%3Ctext%20x%3D%22400%22%20y%3D%22262%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2274%22%20font-weight%3D%22900%22%20fill%3D%22%23ffffff%22%20filter%3D%22url(%23s)%22%3EAI%20Combo%3C%2Ftext%3E%3Crect%20x%3D%22230%22%20y%3D%22334%22%20width%3D%22340%22%20height%3D%227%22%20rx%3D%223.5%22%20fill%3D%22%2322c55e%22%20opacity%3D%22.95%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22390%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22800%22%20letter-spacing%3D%225%22%20fill%3D%22%23fff%22%20opacity%3D%22.72%22%3ESTOREFY%20OFERTA%20DIGITAL%3C%2Ftext%3E%3C%2Fsvg%3E",
    "benefits": [
      "Combo com 3 ferramentas desejadas",
      "Inclui IA, design e musica",
      "Oferta facil de vender"
    ],
    "deliverable": "Combo ChatGPT Plus + Canva Pro + Spotify",
    "addedToStore": false,
    "sourceUrl": "https://gamemarket.com.br/"
  },
  {
    "id": "gm-151-guia-loja-digital-lucrativa",
    "name": "Metodo Emagrecimento 21 Dias",
    "category": "Infoprodutos",
    "subcategory": "Emagrecimento",
    "supplier": "Storefy Curadoria",
    "costPrice": 7.9,
    "salePrice": 27.9,
    "imageUrl": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22520%22%20viewBox%3D%220%200%20800%20520%22%20data-storefy-brand-cover%3D%221%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20stop-color%3D%22%23102014%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%2322c55e%22%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%22s%22%3E%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2222%22%20stdDeviation%3D%2222%22%20flood-color%3D%22%23000%22%20flood-opacity%3D%22.45%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%22520%22%20rx%3D%2236%22%20fill%3D%22url(%23g)%22%2F%3E%3Ccircle%20cx%3D%22665%22%20cy%3D%2278%22%20r%3D%22158%22%20fill%3D%22%23fff%22%20opacity%3D%22.08%22%2F%3E%3Ccircle%20cx%3D%22118%22%20cy%3D%22430%22%20r%3D%22190%22%20fill%3D%22%23fff%22%20opacity%3D%22.06%22%2F%3E%3Crect%20x%3D%2256%22%20y%3D%2256%22%20width%3D%22688%22%20height%3D%22408%22%20rx%3D%2230%22%20fill%3D%22%23000%22%20opacity%3D%22.18%22%20stroke%3D%22%23fff%22%20stroke-opacity%3D%22.14%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22255%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22900%22%20fill%3D%22%23ffffff%22%20filter%3D%22url(%23s)%22%3EEBOOK%20FITNESS%3C%2Ftext%3E%3Crect%20x%3D%22240%22%20y%3D%22330%22%20width%3D%22320%22%20height%3D%227%22%20rx%3D%223.5%22%20fill%3D%22%2386efac%22%20opacity%3D%22.9%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22386%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22800%22%20letter-spacing%3D%225%22%20fill%3D%22%23fff%22%20opacity%3D%22.72%22%3ESTOREFY%20OFERTA%20DIGITAL%3C%2Ftext%3E%3C%2Fsvg%3E",
    "benefits": [
      "Cardapio simples por fase",
      "Lista de compras economica",
      "Plano de acompanhamento diario"
    ],
    "deliverable": "Ebook + planner 21 dias + checklist alimentar",
    "addedToStore": false
  },
  {
    "id": "gm-152-ebook-copy-para-whatsapp",
    "name": "Receitas Low Carb Economicas",
    "category": "Infoprodutos",
    "subcategory": "Emagrecimento",
    "supplier": "Storefy Curadoria",
    "costPrice": 6.9,
    "salePrice": 24.9,
    "imageUrl": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22520%22%20viewBox%3D%220%200%20800%20520%22%20data-storefy-brand-cover%3D%221%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20stop-color%3D%22%23102014%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%2322c55e%22%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%22s%22%3E%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2222%22%20stdDeviation%3D%2222%22%20flood-color%3D%22%23000%22%20flood-opacity%3D%22.45%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%22520%22%20rx%3D%2236%22%20fill%3D%22url(%23g)%22%2F%3E%3Ccircle%20cx%3D%22665%22%20cy%3D%2278%22%20r%3D%22158%22%20fill%3D%22%23fff%22%20opacity%3D%22.08%22%2F%3E%3Ccircle%20cx%3D%22118%22%20cy%3D%22430%22%20r%3D%22190%22%20fill%3D%22%23fff%22%20opacity%3D%22.06%22%2F%3E%3Crect%20x%3D%2256%22%20y%3D%2256%22%20width%3D%22688%22%20height%3D%22408%22%20rx%3D%2230%22%20fill%3D%22%23000%22%20opacity%3D%22.18%22%20stroke%3D%22%23fff%22%20stroke-opacity%3D%22.14%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22255%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22900%22%20fill%3D%22%23ffffff%22%20filter%3D%22url(%23s)%22%3EEBOOK%20FITNESS%3C%2Ftext%3E%3Crect%20x%3D%22240%22%20y%3D%22330%22%20width%3D%22320%22%20height%3D%227%22%20rx%3D%223.5%22%20fill%3D%22%2386efac%22%20opacity%3D%22.9%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22386%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22800%22%20letter-spacing%3D%225%22%20fill%3D%22%23fff%22%20opacity%3D%22.72%22%3ESTOREFY%20OFERTA%20DIGITAL%3C%2Ftext%3E%3C%2Fsvg%3E",
    "benefits": [
      "45 receitas praticas",
      "Opcoes para marmita",
      "Ingredientes faceis de encontrar"
    ],
    "deliverable": "Ebook de receitas + tabela de substituicoes",
    "addedToStore": false
  },
  {
    "id": "gm-153-manual-de-vendas-de-assinaturas",
    "name": "Desafio Disciplina e Habitos",
    "category": "Infoprodutos",
    "subcategory": "Evolucao Pessoal",
    "supplier": "Storefy Curadoria",
    "costPrice": 8.5,
    "salePrice": 29.9,
    "imageUrl": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22520%22%20viewBox%3D%220%200%20800%20520%22%20data-storefy-brand-cover%3D%221%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20stop-color%3D%22%23161226%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%237c3aed%22%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%22s%22%3E%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2222%22%20stdDeviation%3D%2222%22%20flood-color%3D%22%23000%22%20flood-opacity%3D%22.45%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%22520%22%20rx%3D%2236%22%20fill%3D%22url(%23g)%22%2F%3E%3Ccircle%20cx%3D%22665%22%20cy%3D%2278%22%20r%3D%22158%22%20fill%3D%22%23fff%22%20opacity%3D%22.08%22%2F%3E%3Ccircle%20cx%3D%22118%22%20cy%3D%22430%22%20r%3D%22190%22%20fill%3D%22%23fff%22%20opacity%3D%22.06%22%2F%3E%3Crect%20x%3D%2256%22%20y%3D%2256%22%20width%3D%22688%22%20height%3D%22408%22%20rx%3D%2230%22%20fill%3D%22%23000%22%20opacity%3D%22.18%22%20stroke%3D%22%23fff%22%20stroke-opacity%3D%22.14%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22255%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22900%22%20fill%3D%22%23ffffff%22%20filter%3D%22url(%23s)%22%3EEBOOK%20MENTE%3C%2Ftext%3E%3Crect%20x%3D%22240%22%20y%3D%22330%22%20width%3D%22320%22%20height%3D%227%22%20rx%3D%223.5%22%20fill%3D%22%23c4b5fd%22%20opacity%3D%22.9%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22386%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22800%22%20letter-spacing%3D%225%22%20fill%3D%22%23fff%22%20opacity%3D%22.72%22%3ESTOREFY%20OFERTA%20DIGITAL%3C%2Ftext%3E%3C%2Fsvg%3E",
    "benefits": [
      "Rotina de 30 dias",
      "Rastreador de habitos",
      "Exercicios de foco e constancia"
    ],
    "deliverable": "Workbook + planner de habitos + audios curtos",
    "addedToStore": false
  },
  {
    "id": "gm-154-checklist-fornecedor-seguro",
    "name": "Guia Controle da Ansiedade",
    "category": "Infoprodutos",
    "subcategory": "Evolucao Pessoal",
    "supplier": "Storefy Curadoria",
    "costPrice": 7.5,
    "salePrice": 27.9,
    "imageUrl": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22520%22%20viewBox%3D%220%200%20800%20520%22%20data-storefy-brand-cover%3D%221%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20stop-color%3D%22%23161226%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%237c3aed%22%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%22s%22%3E%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2222%22%20stdDeviation%3D%2222%22%20flood-color%3D%22%23000%22%20flood-opacity%3D%22.45%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%22520%22%20rx%3D%2236%22%20fill%3D%22url(%23g)%22%2F%3E%3Ccircle%20cx%3D%22665%22%20cy%3D%2278%22%20r%3D%22158%22%20fill%3D%22%23fff%22%20opacity%3D%22.08%22%2F%3E%3Ccircle%20cx%3D%22118%22%20cy%3D%22430%22%20r%3D%22190%22%20fill%3D%22%23fff%22%20opacity%3D%22.06%22%2F%3E%3Crect%20x%3D%2256%22%20y%3D%2256%22%20width%3D%22688%22%20height%3D%22408%22%20rx%3D%2230%22%20fill%3D%22%23000%22%20opacity%3D%22.18%22%20stroke%3D%22%23fff%22%20stroke-opacity%3D%22.14%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22255%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22900%22%20fill%3D%22%23ffffff%22%20filter%3D%22url(%23s)%22%3EEBOOK%20MENTE%3C%2Ftext%3E%3Crect%20x%3D%22240%22%20y%3D%22330%22%20width%3D%22320%22%20height%3D%227%22%20rx%3D%223.5%22%20fill%3D%22%23c4b5fd%22%20opacity%3D%22.9%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22386%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22800%22%20letter-spacing%3D%225%22%20fill%3D%22%23fff%22%20opacity%3D%22.72%22%3ESTOREFY%20OFERTA%20DIGITAL%3C%2Ftext%3E%3C%2Fsvg%3E",
    "benefits": [
      "Tecnicas de respiracao",
      "Diario emocional",
      "Plano de organizacao semanal"
    ],
    "deliverable": "Ebook + diario guiado + checklist anti-estresse",
    "addedToStore": false
  },
  {
    "id": "gm-155-playbook-games-e-contas-digitais",
    "name": "Planilha Financas Pessoais 360",
    "category": "Infoprodutos",
    "subcategory": "Financas Pessoais",
    "supplier": "Storefy Curadoria",
    "costPrice": 9.9,
    "salePrice": 34.9,
    "imageUrl": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22520%22%20viewBox%3D%220%200%20800%20520%22%20data-storefy-brand-cover%3D%221%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20stop-color%3D%22%23071711%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23059669%22%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%22s%22%3E%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2222%22%20stdDeviation%3D%2222%22%20flood-color%3D%22%23000%22%20flood-opacity%3D%22.45%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%22520%22%20rx%3D%2236%22%20fill%3D%22url(%23g)%22%2F%3E%3Ccircle%20cx%3D%22665%22%20cy%3D%2278%22%20r%3D%22158%22%20fill%3D%22%23fff%22%20opacity%3D%22.08%22%2F%3E%3Ccircle%20cx%3D%22118%22%20cy%3D%22430%22%20r%3D%22190%22%20fill%3D%22%23fff%22%20opacity%3D%22.06%22%2F%3E%3Crect%20x%3D%2256%22%20y%3D%2256%22%20width%3D%22688%22%20height%3D%22408%22%20rx%3D%2230%22%20fill%3D%22%23000%22%20opacity%3D%22.18%22%20stroke%3D%22%23fff%22%20stroke-opacity%3D%22.14%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22255%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22900%22%20fill%3D%22%23ffffff%22%20filter%3D%22url(%23s)%22%3EEBOOK%20FINANCAS%3C%2Ftext%3E%3Crect%20x%3D%22240%22%20y%3D%22330%22%20width%3D%22320%22%20height%3D%227%22%20rx%3D%223.5%22%20fill%3D%22%236ee7b7%22%20opacity%3D%22.9%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22386%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22800%22%20letter-spacing%3D%225%22%20fill%3D%22%23fff%22%20opacity%3D%22.72%22%3ESTOREFY%20OFERTA%20DIGITAL%3C%2Ftext%3E%3C%2Fsvg%3E",
    "benefits": [
      "Controle de gastos",
      "Metas mensais",
      "Dashboard de economia"
    ],
    "deliverable": "Planilha editavel + guia de uso + modelo de metas",
    "addedToStore": false
  },
  {
    "id": "gm-156-pack-templates-de-oferta",
    "name": "Renda Extra com Produtos Digitais",
    "category": "Infoprodutos",
    "subcategory": "Renda Extra",
    "supplier": "Storefy Curadoria",
    "costPrice": 9.5,
    "salePrice": 39.9,
    "imageUrl": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22520%22%20viewBox%3D%220%200%20800%20520%22%20data-storefy-brand-cover%3D%221%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20stop-color%3D%22%231c1307%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23f59e0b%22%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%22s%22%3E%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2222%22%20stdDeviation%3D%2222%22%20flood-color%3D%22%23000%22%20flood-opacity%3D%22.45%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%22520%22%20rx%3D%2236%22%20fill%3D%22url(%23g)%22%2F%3E%3Ccircle%20cx%3D%22665%22%20cy%3D%2278%22%20r%3D%22158%22%20fill%3D%22%23fff%22%20opacity%3D%22.08%22%2F%3E%3Ccircle%20cx%3D%22118%22%20cy%3D%22430%22%20r%3D%22190%22%20fill%3D%22%23fff%22%20opacity%3D%22.06%22%2F%3E%3Crect%20x%3D%2256%22%20y%3D%2256%22%20width%3D%22688%22%20height%3D%22408%22%20rx%3D%2230%22%20fill%3D%22%23000%22%20opacity%3D%22.18%22%20stroke%3D%22%23fff%22%20stroke-opacity%3D%22.14%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22255%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22900%22%20fill%3D%22%23ffffff%22%20filter%3D%22url(%23s)%22%3ERENDA%20EXTRA%3C%2Ftext%3E%3Crect%20x%3D%22240%22%20y%3D%22330%22%20width%3D%22320%22%20height%3D%227%22%20rx%3D%223.5%22%20fill%3D%22%23fde68a%22%20opacity%3D%22.9%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22386%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22800%22%20letter-spacing%3D%225%22%20fill%3D%22%23fff%22%20opacity%3D%22.72%22%3ESTOREFY%20OFERTA%20DIGITAL%3C%2Ftext%3E%3C%2Fsvg%3E",
    "benefits": [
      "Mapa de ofertas",
      "Scripts de venda",
      "Checklist de validacao"
    ],
    "deliverable": "Ebook + scripts de WhatsApp + planilha de precificacao",
    "addedToStore": false
  },
  {
    "id": "gm-157-ebook-ia-para-atendimento",
    "name": "Planner Produtividade Profissional",
    "category": "Infoprodutos",
    "subcategory": "Produtividade",
    "supplier": "Storefy Curadoria",
    "costPrice": 6.5,
    "salePrice": 22.9,
    "imageUrl": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22520%22%20viewBox%3D%220%200%20800%20520%22%20data-storefy-brand-cover%3D%221%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20stop-color%3D%22%230f172a%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%230284c7%22%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%22s%22%3E%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2222%22%20stdDeviation%3D%2222%22%20flood-color%3D%22%23000%22%20flood-opacity%3D%22.45%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%22520%22%20rx%3D%2236%22%20fill%3D%22url(%23g)%22%2F%3E%3Ccircle%20cx%3D%22665%22%20cy%3D%2278%22%20r%3D%22158%22%20fill%3D%22%23fff%22%20opacity%3D%22.08%22%2F%3E%3Ccircle%20cx%3D%22118%22%20cy%3D%22430%22%20r%3D%22190%22%20fill%3D%22%23fff%22%20opacity%3D%22.06%22%2F%3E%3Crect%20x%3D%2256%22%20y%3D%2256%22%20width%3D%22688%22%20height%3D%22408%22%20rx%3D%2230%22%20fill%3D%22%23000%22%20opacity%3D%22.18%22%20stroke%3D%22%23fff%22%20stroke-opacity%3D%22.14%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22255%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22900%22%20fill%3D%22%23ffffff%22%20filter%3D%22url(%23s)%22%3EPLANNER%20PRO%3C%2Ftext%3E%3Crect%20x%3D%22240%22%20y%3D%22330%22%20width%3D%22320%22%20height%3D%227%22%20rx%3D%223.5%22%20fill%3D%22%237dd3fc%22%20opacity%3D%22.9%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22386%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22800%22%20letter-spacing%3D%225%22%20fill%3D%22%23fff%22%20opacity%3D%22.72%22%3ESTOREFY%20OFERTA%20DIGITAL%3C%2Ftext%3E%3C%2Fsvg%3E",
    "benefits": [
      "Organizacao semanal",
      "Priorizacao de tarefas",
      "Rituais de revisao"
    ],
    "deliverable": "Planner PDF + template editavel + checklist",
    "addedToStore": false
  },
  {
    "id": "gm-158-planilha-controle-de-pedidos",
    "name": "Guia Comunicacao e Relacionamentos",
    "category": "Infoprodutos",
    "subcategory": "Relacionamentos",
    "supplier": "Storefy Curadoria",
    "costPrice": 7.9,
    "salePrice": 29.9,
    "imageUrl": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22520%22%20viewBox%3D%220%200%20800%20520%22%20data-storefy-brand-cover%3D%221%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20stop-color%3D%22%23211018%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23e11d48%22%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%22s%22%3E%3CfeDropShadow%20dx%3D%220%22%20dy%3D%2222%22%20stdDeviation%3D%2222%22%20flood-color%3D%22%23000%22%20flood-opacity%3D%22.45%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%22520%22%20rx%3D%2236%22%20fill%3D%22url(%23g)%22%2F%3E%3Ccircle%20cx%3D%22665%22%20cy%3D%2278%22%20r%3D%22158%22%20fill%3D%22%23fff%22%20opacity%3D%22.08%22%2F%3E%3Ccircle%20cx%3D%22118%22%20cy%3D%22430%22%20r%3D%22190%22%20fill%3D%22%23fff%22%20opacity%3D%22.06%22%2F%3E%3Crect%20x%3D%2256%22%20y%3D%2256%22%20width%3D%22688%22%20height%3D%22408%22%20rx%3D%2230%22%20fill%3D%22%23000%22%20opacity%3D%22.18%22%20stroke%3D%22%23fff%22%20stroke-opacity%3D%22.14%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22255%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2276%22%20font-weight%3D%22900%22%20fill%3D%22%23ffffff%22%20filter%3D%22url(%23s)%22%3EEBOOK%20RELACOES%3C%2Ftext%3E%3Crect%20x%3D%22240%22%20y%3D%22330%22%20width%3D%22320%22%20height%3D%227%22%20rx%3D%223.5%22%20fill%3D%22%23fda4af%22%20opacity%3D%22.9%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22386%22%20text-anchor%3D%22middle%22%20font-family%3D%22Inter%2CArial%2Csans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22800%22%20letter-spacing%3D%225%22%20fill%3D%22%23fff%22%20opacity%3D%22.72%22%3ESTOREFY%20OFERTA%20DIGITAL%3C%2Ftext%3E%3C%2Fsvg%3E",
    "benefits": [
      "Conversas dificeis",
      "Acordos de rotina",
      "Exercicios de escuta ativa"
    ],
    "deliverable": "Ebook + exercicios praticos + cards de conversa",
    "addedToStore": false
  },
  {
    "id": "physical-1",
    "name": "Smartwatch para Mulheres (Bluetooth/Fitness)",
    "category": "Achados Fisicos",
    "subcategory": "Eletronicos e Acessorios",
    "supplier": "Curadoria Achados Fisicos",
    "costPrice": 16.9,
    "salePrice": 39.9,
    "imageUrl": "https://ae01.alicdn.com/kf/S7bdef60be47342448cbba584f45ef2b8U.jpg",
    "benefits": [
      "Produto fisico de alta procura",
      "Boa opcao para oferta no WhatsApp",
      "Imagem do fornecedor incluida"
    ],
    "deliverable": "Produto fisico com imagem e link de fornecedor",
    "addedToStore": false,
    "sourceUrl": "https://pt.aliexpress.com/item/1005006813411227.html"
  },
  {
    "id": "physical-2",
    "name": "Pulseira Magnética 20mm/22mm (Amazfit/GTR)",
    "category": "Achados Fisicos",
    "subcategory": "Eletronicos e Acessorios",
    "supplier": "Curadoria Achados Fisicos",
    "costPrice": 4.9,
    "salePrice": 12.9,
    "imageUrl": "https://ae01.alicdn.com/kf/Sfe15d6fa9ad34ae78011bd9ff0185d784.jpg",
    "benefits": [
      "Produto fisico de alta procura",
      "Boa opcao para oferta no WhatsApp",
      "Imagem do fornecedor incluida"
    ],
    "deliverable": "Produto fisico com imagem e link de fornecedor",
    "addedToStore": false,
    "sourceUrl": "https://pt.aliexpress.com/item/1005006997326443.html"
  },
  {
    "id": "physical-3",
    "name": "Controle Gamepad G6 (Switch/PC/Mobile)",
    "category": "Achados Fisicos",
    "subcategory": "Audio e Gadgets",
    "supplier": "Curadoria Achados Fisicos",
    "costPrice": 15.9,
    "salePrice": 34.9,
    "imageUrl": "https://ae01.alicdn.com/kf/S2408615500f54ac68be74cb51724acbac.jpg",
    "benefits": [
      "Produto fisico de alta procura",
      "Boa opcao para oferta no WhatsApp",
      "Imagem do fornecedor incluida"
    ],
    "deliverable": "Produto fisico com imagem e link de fornecedor",
    "addedToStore": false,
    "sourceUrl": "https://pt.aliexpress.com/item/1005009881248536.html"
  },
  {
    "id": "physical-4",
    "name": "Smartwatch Masculino (Fitness/Música)",
    "category": "Achados Fisicos",
    "subcategory": "Eletronicos e Acessorios",
    "supplier": "Curadoria Achados Fisicos",
    "costPrice": 16.9,
    "salePrice": 39.9,
    "imageUrl": "https://ae01.alicdn.com/kf/Sa55f03d947244a6ab70162288d0d19e3Q.jpg",
    "benefits": [
      "Produto fisico de alta procura",
      "Boa opcao para oferta no WhatsApp",
      "Imagem do fornecedor incluida"
    ],
    "deliverable": "Produto fisico com imagem e link de fornecedor",
    "addedToStore": false,
    "sourceUrl": "https://pt.aliexpress.com/item/1005007709091696.html"
  },
  {
    "id": "physical-5",
    "name": "Jaqueta Fitness Manga Longa (Yoga/Ginásio)",
    "category": "Achados Fisicos",
    "subcategory": "Moda e Fitness",
    "supplier": "Curadoria Achados Fisicos",
    "costPrice": 12.9,
    "salePrice": 29.9,
    "imageUrl": "https://ae01.alicdn.com/kf/S2a102c2570624f13a0958d469a5f2e3dY.jpg",
    "benefits": [
      "Produto fisico de alta procura",
      "Boa opcao para oferta no WhatsApp",
      "Imagem do fornecedor incluida"
    ],
    "deliverable": "Produto fisico com imagem e link de fornecedor",
    "addedToStore": false,
    "sourceUrl": "https://pt.aliexpress.com/item/1005008682768784.html"
  },
  {
    "id": "physical-6",
    "name": "Smartwatch Multifuncional 2026 (Crianças/Adultos)",
    "category": "Achados Fisicos",
    "subcategory": "Eletronicos e Acessorios",
    "supplier": "Curadoria Achados Fisicos",
    "costPrice": 16.9,
    "salePrice": 39.9,
    "imageUrl": "https://ae01.alicdn.com/kf/S83f5083becf7485ea83322ba574b0331K.jpg",
    "benefits": [
      "Produto fisico de alta procura",
      "Boa opcao para oferta no WhatsApp",
      "Imagem do fornecedor incluida"
    ],
    "deliverable": "Produto fisico com imagem e link de fornecedor",
    "addedToStore": false,
    "sourceUrl": "https://pt.aliexpress.com/item/1005011839761605.html"
  },
  {
    "id": "physical-7",
    "name": "Smartwatch Esportivo Y68/D20",
    "category": "Achados Fisicos",
    "subcategory": "Eletronicos e Acessorios",
    "supplier": "Curadoria Achados Fisicos",
    "costPrice": 16.9,
    "salePrice": 39.9,
    "imageUrl": "https://ae01.alicdn.com/kf/S46699660cea04d589868fc762c53890e7.jpg",
    "benefits": [
      "Produto fisico de alta procura",
      "Boa opcao para oferta no WhatsApp",
      "Imagem do fornecedor incluida"
    ],
    "deliverable": "Produto fisico com imagem e link de fornecedor",
    "addedToStore": false,
    "sourceUrl": "https://pt.aliexpress.com/item/1005007695095628.html"
  },
  {
    "id": "physical-8",
    "name": "Pulseira Silicone Apple Watch (Série 1-11/Ultra)",
    "category": "Achados Fisicos",
    "subcategory": "Eletronicos e Acessorios",
    "supplier": "Curadoria Achados Fisicos",
    "costPrice": 4.9,
    "salePrice": 12.9,
    "imageUrl": "https://ae01.alicdn.com/kf/S2810954781a64c54a094928a5b673cbcc.jpg",
    "benefits": [
      "Produto fisico de alta procura",
      "Boa opcao para oferta no WhatsApp",
      "Imagem do fornecedor incluida"
    ],
    "deliverable": "Produto fisico com imagem e link de fornecedor",
    "addedToStore": false,
    "sourceUrl": "https://pt.aliexpress.com/item/1005006759279636.html"
  },
  {
    "id": "physical-9",
    "name": "Headset P47 Bluetooth 5.0 Stereo",
    "category": "Achados Fisicos",
    "subcategory": "Audio e Gadgets",
    "supplier": "Curadoria Achados Fisicos",
    "costPrice": 11.9,
    "salePrice": 29.9,
    "imageUrl": "https://ae01.alicdn.com/kf/S557fba8e51704347bf25365c9d5ca8f8Z.jpg",
    "benefits": [
      "Produto fisico de alta procura",
      "Boa opcao para oferta no WhatsApp",
      "Imagem do fornecedor incluida"
    ],
    "deliverable": "Produto fisico com imagem e link de fornecedor",
    "addedToStore": false,
    "sourceUrl": "https://pt.aliexpress.com/item/1005010546036557.html"
  },
  {
    "id": "physical-10",
    "name": "Câmera de Segurança A7 (WiFi/360º/HD)",
    "category": "Achados Fisicos",
    "subcategory": "Informática",
    "supplier": "Curadoria Achados Fisicos",
    "costPrice": 11.9,
    "salePrice": 29.9,
    "imageUrl": "https://ae01.alicdn.com/kf/S1deaf37c58e44796893a6ff6a804d7fbm.png",
    "benefits": [
      "Produto fisico de alta procura",
      "Boa opcao para oferta no WhatsApp",
      "Imagem do fornecedor incluida"
    ],
    "deliverable": "Produto fisico com imagem e link de fornecedor",
    "addedToStore": false,
    "sourceUrl": "https://pt.aliexpress.com/item/1005012315564567.html"
  },
  {
    "id": "physical-11",
    "name": "Relógio Digital Retrô Ouro Rosa",
    "category": "Achados Fisicos",
    "subcategory": "Eletronicos e Acessorios",
    "supplier": "Curadoria Achados Fisicos",
    "costPrice": 7.9,
    "salePrice": 19.9,
    "imageUrl": "https://ae01.alicdn.com/kf/S3d4ab4537e3749eaa225ef9736ceb68ed.jpg",
    "benefits": [
      "Produto fisico de alta procura",
      "Boa opcao para oferta no WhatsApp",
      "Imagem do fornecedor incluida"
    ],
    "deliverable": "Produto fisico com imagem e link de fornecedor",
    "addedToStore": false,
    "sourceUrl": "https://pt.aliexpress.com/item/1005012397759388.html"
  },
  {
    "id": "physical-12",
    "name": "Fones Lenovo LP40 TWS Original",
    "category": "Achados Fisicos",
    "subcategory": "Audio e Gadgets",
    "supplier": "Curadoria Achados Fisicos",
    "costPrice": 11.9,
    "salePrice": 29.9,
    "imageUrl": "https://ae01.alicdn.com/kf/Sa0d6d677c5a149199c2c0ef198f49eb5q.jpg",
    "benefits": [
      "Produto fisico de alta procura",
      "Boa opcao para oferta no WhatsApp",
      "Imagem do fornecedor incluida"
    ],
    "deliverable": "Produto fisico com imagem e link de fornecedor",
    "addedToStore": false,
    "sourceUrl": "https://pt.aliexpress.com/item/1005007431129955.html"
  },
  {
    "id": "physical-13",
    "name": "Smartwatch Keshuyou 2025 (Chamadas/Saúde)",
    "category": "Achados Fisicos",
    "subcategory": "Eletronicos e Acessorios",
    "supplier": "Curadoria Achados Fisicos",
    "costPrice": 16.9,
    "salePrice": 39.9,
    "imageUrl": "https://ae01.alicdn.com/kf/S86f0a7efe74c43e5817a5183e488beecw.jpg",
    "benefits": [
      "Produto fisico de alta procura",
      "Boa opcao para oferta no WhatsApp",
      "Imagem do fornecedor incluida"
    ],
    "deliverable": "Produto fisico com imagem e link de fornecedor",
    "addedToStore": false,
    "sourceUrl": "https://pt.aliexpress.com/item/1005010211702620.html"
  },
  {
    "id": "physical-14",
    "name": "Tapete de Pelúcia Tie-Dye (Sala/Quarto)",
    "category": "Achados Fisicos",
    "subcategory": "Casa e Utilidades",
    "supplier": "Curadoria Achados Fisicos",
    "costPrice": 9.9,
    "salePrice": 24.9,
    "imageUrl": "https://ae01.alicdn.com/kf/S86b494270acb466ab8951ee5f790c899k.jpg",
    "benefits": [
      "Produto fisico de alta procura",
      "Boa opcao para oferta no WhatsApp",
      "Imagem do fornecedor incluida"
    ],
    "deliverable": "Produto fisico com imagem e link de fornecedor",
    "addedToStore": false,
    "sourceUrl": "https://pt.aliexpress.com/item/1005007727176617.html"
  },
  {
    "id": "physical-15",
    "name": "Pijama de Seda/Renda Feminino",
    "category": "Achados Fisicos",
    "subcategory": "Moda e Fitness",
    "supplier": "Curadoria Achados Fisicos",
    "costPrice": 12.9,
    "salePrice": 29.9,
    "imageUrl": "https://ae01.alicdn.com/kf/Se481309d2d92424b9f0a79bc6e7326d11.jpg",
    "benefits": [
      "Produto fisico de alta procura",
      "Boa opcao para oferta no WhatsApp",
      "Imagem do fornecedor incluida"
    ],
    "deliverable": "Produto fisico com imagem e link de fornecedor",
    "addedToStore": false,
    "sourceUrl": "https://pt.aliexpress.com/item/1005007879054168.html"
  },
  {
    "id": "physical-16",
    "name": "Jaqueta Secagem Rápida Outono 2025",
    "category": "Achados Fisicos",
    "subcategory": "Moda e Fitness",
    "supplier": "Curadoria Achados Fisicos",
    "costPrice": 12.9,
    "salePrice": 29.9,
    "imageUrl": "https://ae01.alicdn.com/kf/S514e4b5e262f46c09c5ca808efd33176r.png",
    "benefits": [
      "Produto fisico de alta procura",
      "Boa opcao para oferta no WhatsApp",
      "Imagem do fornecedor incluida"
    ],
    "deliverable": "Produto fisico com imagem e link de fornecedor",
    "addedToStore": false,
    "sourceUrl": "https://pt.aliexpress.com/item/1005010491064307.html"
  },
  {
    "id": "physical-17",
    "name": "Relógio Digital Simples Masculino (Silicone)",
    "category": "Achados Fisicos",
    "subcategory": "Eletronicos e Acessorios",
    "supplier": "Curadoria Achados Fisicos",
    "costPrice": 7.9,
    "salePrice": 19.9,
    "imageUrl": "https://ae01.alicdn.com/kf/Sc9dd2ead14b642658d79b5bcdb59fa682.jpg",
    "benefits": [
      "Produto fisico de alta procura",
      "Boa opcao para oferta no WhatsApp",
      "Imagem do fornecedor incluida"
    ],
    "deliverable": "Produto fisico com imagem e link de fornecedor",
    "addedToStore": false,
    "sourceUrl": "https://pt.aliexpress.com/item/1005009489432468.html"
  },
  {
    "id": "physical-18",
    "name": "Válvula de Pressão Silicone Divertida",
    "category": "Achados Fisicos",
    "subcategory": "Casa e Utilidades",
    "supplier": "Curadoria Achados Fisicos",
    "costPrice": 7.9,
    "salePrice": 19.9,
    "imageUrl": "https://ae01.alicdn.com/kf/S1deaf37c58e44796893a6ff6a804d7fbm.png",
    "benefits": [
      "Produto fisico de alta procura",
      "Boa opcao para oferta no WhatsApp",
      "Imagem do fornecedor incluida"
    ],
    "deliverable": "Produto fisico com imagem e link de fornecedor",
    "addedToStore": false,
    "sourceUrl": "https://pt.aliexpress.com/item/1005012315564567.html"
  },
  {
    "id": "physical-19",
    "name": "Smartwatch Watch 10 Ultra 49mm (GPS/NFC)",
    "category": "Achados Fisicos",
    "subcategory": "Eletronicos e Acessorios",
    "supplier": "Curadoria Achados Fisicos",
    "costPrice": 16.9,
    "salePrice": 39.9,
    "imageUrl": "https://ae01.alicdn.com/kf/S86f0a7efe74c43e5817a5183e488beecw.jpg",
    "benefits": [
      "Produto fisico de alta procura",
      "Boa opcao para oferta no WhatsApp",
      "Imagem do fornecedor incluida"
    ],
    "deliverable": "Produto fisico com imagem e link de fornecedor",
    "addedToStore": false,
    "sourceUrl": "https://pt.aliexpress.com/item/1005010211702620.html"
  },
  {
    "id": "physical-20",
    "name": "Chinelos Masculinos EVA Verão",
    "category": "Achados Fisicos",
    "subcategory": "Moda e Fitness",
    "supplier": "Curadoria Achados Fisicos",
    "costPrice": 9.9,
    "salePrice": 24.9,
    "imageUrl": "https://ae01.alicdn.com/kf/S922b0a47bdcc478597247ec5a741a26bo.jpg",
    "benefits": [
      "Produto fisico de alta procura",
      "Boa opcao para oferta no WhatsApp",
      "Imagem do fornecedor incluida"
    ],
    "deliverable": "Produto fisico com imagem e link de fornecedor",
    "addedToStore": false,
    "sourceUrl": "https://pt.aliexpress.com/item/1005009357002790.html"
  },
  {
    "id": "physical-21",
    "name": "Fones M10 Bluetooth à Prova d'Água",
    "category": "Achados Fisicos",
    "subcategory": "Audio e Gadgets",
    "supplier": "Curadoria Achados Fisicos",
    "costPrice": 11.9,
    "salePrice": 29.9,
    "imageUrl": "https://ae01.alicdn.com/kf/S6d2c72d674e0491db255be135851f2c0W.jpg",
    "benefits": [
      "Produto fisico de alta procura",
      "Boa opcao para oferta no WhatsApp",
      "Imagem do fornecedor incluida"
    ],
    "deliverable": "Produto fisico com imagem e link de fornecedor",
    "addedToStore": false,
    "sourceUrl": "https://pt.aliexpress.com/item/1005008148860952.html"
  },
  {
    "id": "physical-22",
    "name": "Conjunto de Joias Prata (51 peças)",
    "category": "Achados Fisicos",
    "subcategory": "Moda e Acessórios",
    "supplier": "Curadoria Achados Fisicos",
    "costPrice": 7.9,
    "salePrice": 19.9,
    "imageUrl": "https://ae01.alicdn.com/kf/S9d536717e48b41c69b8cf1a000aea77d8.jpg",
    "benefits": [
      "Produto fisico de alta procura",
      "Boa opcao para oferta no WhatsApp",
      "Imagem do fornecedor incluida"
    ],
    "deliverable": "Produto fisico com imagem e link de fornecedor",
    "addedToStore": false,
    "sourceUrl": "https://pt.aliexpress.com/item/1005007806183543.html"
  },
  {
    "id": "physical-23",
    "name": "Conjunto de Relógios Árabes (2/4 peças)",
    "category": "Achados Fisicos",
    "subcategory": "Eletronicos e Acessorios",
    "supplier": "Curadoria Achados Fisicos",
    "costPrice": 9.9,
    "salePrice": 24.9,
    "imageUrl": "https://ae01.alicdn.com/kf/Sf5a1fe1e72d741dbbc4f045298b95f1b2.jpg",
    "benefits": [
      "Produto fisico de alta procura",
      "Boa opcao para oferta no WhatsApp",
      "Imagem do fornecedor incluida"
    ],
    "deliverable": "Produto fisico com imagem e link de fornecedor",
    "addedToStore": false,
    "sourceUrl": "https://pt.aliexpress.com/item/1005009708202554.html"
  },
  {
    "id": "physical-24",
    "name": "Cinta Modeladora Fitness (Queima Gordura)",
    "category": "Achados Fisicos",
    "subcategory": "Moda e Fitness",
    "supplier": "Curadoria Achados Fisicos",
    "costPrice": 12.9,
    "salePrice": 29.9,
    "imageUrl": "https://ae01.alicdn.com/kf/Sf76a13bc33ee4638958b76a752c3f42cK.jpg",
    "benefits": [
      "Produto fisico de alta procura",
      "Boa opcao para oferta no WhatsApp",
      "Imagem do fornecedor incluida"
    ],
    "deliverable": "Produto fisico com imagem e link de fornecedor",
    "addedToStore": false,
    "sourceUrl": "https://pt.aliexpress.com/item/1005006982504378.html"
  },
  {
    "id": "physical-25",
    "name": "Capa Silicone AirPods Pro",
    "category": "Achados Fisicos",
    "subcategory": "Eletronicos e Acessorios",
    "supplier": "Curadoria Achados Fisicos",
    "costPrice": 4.9,
    "salePrice": 12.9,
    "imageUrl": "https://ae01.alicdn.com/kf/S85e57d13c1cb4a8289195ff37e006d29U.jpg",
    "benefits": [
      "Produto fisico de alta procura",
      "Boa opcao para oferta no WhatsApp",
      "Imagem do fornecedor incluida"
    ],
    "deliverable": "Produto fisico com imagem e link de fornecedor",
    "addedToStore": false,
    "sourceUrl": "https://pt.aliexpress.com/item/1005007532276116.html"
  },
  {
    "id": "physical-26",
    "name": "Relógio Astronauta Infantil (Touch)",
    "category": "Achados Fisicos",
    "subcategory": "Brinquedos e Colecionáveis",
    "supplier": "Curadoria Achados Fisicos",
    "costPrice": 7.9,
    "salePrice": 19.9,
    "imageUrl": "https://ae01.alicdn.com/kf/Sbc49698b3d6f452b8c93d30c116e9de6q.jpg",
    "benefits": [
      "Produto fisico de alta procura",
      "Boa opcao para oferta no WhatsApp",
      "Imagem do fornecedor incluida"
    ],
    "deliverable": "Produto fisico com imagem e link de fornecedor",
    "addedToStore": false,
    "sourceUrl": "https://pt.aliexpress.com/item/1005006994509654.html"
  },
  {
    "id": "physical-27",
    "name": "Smartwatch Chamadas/Música iPhone/Android",
    "category": "Achados Fisicos",
    "subcategory": "Eletronicos e Acessorios",
    "supplier": "Curadoria Achados Fisicos",
    "costPrice": 16.9,
    "salePrice": 39.9,
    "imageUrl": "https://ae01.alicdn.com/kf/S86f0a7efe74c43e5817a5183e488beecw.jpg",
    "benefits": [
      "Produto fisico de alta procura",
      "Boa opcao para oferta no WhatsApp",
      "Imagem do fornecedor incluida"
    ],
    "deliverable": "Produto fisico com imagem e link de fornecedor",
    "addedToStore": false,
    "sourceUrl": "https://pt.aliexpress.com/item/1005010211702620.html"
  },
  {
    "id": "physical-28",
    "name": "Conjunto Relógio + Joias (6 peças)",
    "category": "Achados Fisicos",
    "subcategory": "Moda e Acessórios",
    "supplier": "Curadoria Achados Fisicos",
    "costPrice": 9.9,
    "salePrice": 24.9,
    "imageUrl": "https://ae01.alicdn.com/kf/S69fe043912bb4cdeb26dc2504ab35ba9V.jpg",
    "benefits": [
      "Produto fisico de alta procura",
      "Boa opcao para oferta no WhatsApp",
      "Imagem do fornecedor incluida"
    ],
    "deliverable": "Produto fisico com imagem e link de fornecedor",
    "addedToStore": false,
    "sourceUrl": "https://pt.aliexpress.com/item/1005010419185088.html"
  },
  {
    "id": "physical-29",
    "name": "Pente de Bambu Natural (Antiestático)",
    "category": "Achados Fisicos",
    "subcategory": "Beleza e Cuidados",
    "supplier": "Curadoria Achados Fisicos",
    "costPrice": 6.9,
    "salePrice": 16.9,
    "imageUrl": "https://ae01.alicdn.com/kf/Sfd3278c1e6c84d07adccf055406a4b7f1.jpg",
    "benefits": [
      "Produto fisico de alta procura",
      "Boa opcao para oferta no WhatsApp",
      "Imagem do fornecedor incluida"
    ],
    "deliverable": "Produto fisico com imagem e link de fornecedor",
    "addedToStore": false,
    "sourceUrl": "https://pt.aliexpress.com/item/1005009261871587.html"
  },
  {
    "id": "physical-30",
    "name": "Fones Bluetooth 5.3 Dobráveis",
    "category": "Achados Fisicos",
    "subcategory": "Audio e Gadgets",
    "supplier": "Curadoria Achados Fisicos",
    "costPrice": 11.9,
    "salePrice": 29.9,
    "imageUrl": "https://ae01.alicdn.com/kf/S557fba8e51704347bf25365c9d5ca8f8Z.jpg",
    "benefits": [
      "Produto fisico de alta procura",
      "Boa opcao para oferta no WhatsApp",
      "Imagem do fornecedor incluida"
    ],
    "deliverable": "Produto fisico com imagem e link de fornecedor",
    "addedToStore": false,
    "sourceUrl": "https://pt.aliexpress.com/item/1005010546036557.html"
  },
  {
    "id": "physical-31",
    "name": "Relógio Eletrônico Quadrado (Moda)",
    "category": "Achados Fisicos",
    "subcategory": "Eletronicos e Acessorios",
    "supplier": "Curadoria Achados Fisicos",
    "costPrice": 7.9,
    "salePrice": 19.9,
    "imageUrl": "https://ae01.alicdn.com/kf/Sc9dd2ead14b642658d79b5bcdb59fa682.jpg",
    "benefits": [
      "Produto fisico de alta procura",
      "Boa opcao para oferta no WhatsApp",
      "Imagem do fornecedor incluida"
    ],
    "deliverable": "Produto fisico com imagem e link de fornecedor",
    "addedToStore": false,
    "sourceUrl": "https://pt.aliexpress.com/item/1005009489432468.html"
  },
  {
    "id": "physical-32",
    "name": "Fita LED RGB (5m/10m/20m/30m)",
    "category": "Achados Fisicos",
    "subcategory": "Casa e Utilidades",
    "supplier": "Curadoria Achados Fisicos",
    "costPrice": 11.9,
    "salePrice": 29.9,
    "imageUrl": "https://ae01.alicdn.com/kf/Sc878225485cd4ab0b11252807a2a1f5fp.jpg",
    "benefits": [
      "Produto fisico de alta procura",
      "Boa opcao para oferta no WhatsApp",
      "Imagem do fornecedor incluida"
    ],
    "deliverable": "Produto fisico com imagem e link de fornecedor",
    "addedToStore": false,
    "sourceUrl": "https://pt.aliexpress.com/item/1005005079019011.html"
  },
  {
    "id": "physical-33",
    "name": "Microfone de Lapela Sem Fio (iPhone/Android)",
    "category": "Achados Fisicos",
    "subcategory": "Audio e Gadgets",
    "supplier": "Curadoria Achados Fisicos",
    "costPrice": 11.9,
    "salePrice": 29.9,
    "imageUrl": "https://ae01.alicdn.com/kf/Sc319ffe36b5a4d67998deaf422bb06bd6.jpg",
    "benefits": [
      "Produto fisico de alta procura",
      "Boa opcao para oferta no WhatsApp",
      "Imagem do fornecedor incluida"
    ],
    "deliverable": "Produto fisico com imagem e link de fornecedor",
    "addedToStore": false,
    "sourceUrl": "https://pt.aliexpress.com/item/1005010621278637.html"
  },
  {
    "id": "physical-34",
    "name": "Chinelos EVA Design Profissional",
    "category": "Achados Fisicos",
    "subcategory": "Moda e Fitness",
    "supplier": "Curadoria Achados Fisicos",
    "costPrice": 9.9,
    "salePrice": 24.9,
    "imageUrl": "https://ae01.alicdn.com/kf/S10aa36530eac424aa3d049acc5576bcba.jpg",
    "benefits": [
      "Produto fisico de alta procura",
      "Boa opcao para oferta no WhatsApp",
      "Imagem do fornecedor incluida"
    ],
    "deliverable": "Produto fisico com imagem e link de fornecedor",
    "addedToStore": false,
    "sourceUrl": "https://pt.aliexpress.com/item/1005008170498395.html"
  },
  {
    "id": "physical-35",
    "name": "Protetor de Tela Lokmat Appllp 4 Pro",
    "category": "Achados Fisicos",
    "subcategory": "Informática",
    "supplier": "Curadoria Achados Fisicos",
    "costPrice": 4.9,
    "salePrice": 12.9,
    "imageUrl": "https://ae01.alicdn.com/kf/Sf831b6e972054e098f2e6c15bcb16924P.jpg",
    "benefits": [
      "Produto fisico de alta procura",
      "Boa opcao para oferta no WhatsApp",
      "Imagem do fornecedor incluida"
    ],
    "deliverable": "Produto fisico com imagem e link de fornecedor",
    "addedToStore": false,
    "sourceUrl": "https://pt.aliexpress.com/item/1005007283535204.html"
  },
  {
    "id": "physical-36",
    "name": "Fones Lenovo GM2 Pro TWS",
    "category": "Achados Fisicos",
    "subcategory": "Audio e Gadgets",
    "supplier": "Curadoria Achados Fisicos",
    "costPrice": 11.9,
    "salePrice": 29.9,
    "imageUrl": "https://ae01.alicdn.com/kf/Sa0d6d677c5a149199c2c0ef198f49eb5q.jpg",
    "benefits": [
      "Produto fisico de alta procura",
      "Boa opcao para oferta no WhatsApp",
      "Imagem do fornecedor incluida"
    ],
    "deliverable": "Produto fisico com imagem e link de fornecedor",
    "addedToStore": false,
    "sourceUrl": "https://pt.aliexpress.com/item/1005007431129955.html"
  },
  {
    "id": "physical-37",
    "name": "Conjunto Relógio Love + Borboleta",
    "category": "Achados Fisicos",
    "subcategory": "Moda e Acessórios",
    "supplier": "Curadoria Achados Fisicos",
    "costPrice": 9.9,
    "salePrice": 24.9,
    "imageUrl": "https://ae01.alicdn.com/kf/Scd4bc76c348c4ef4a9d54e64c8340046w.jpg",
    "benefits": [
      "Produto fisico de alta procura",
      "Boa opcao para oferta no WhatsApp",
      "Imagem do fornecedor incluida"
    ],
    "deliverable": "Produto fisico com imagem e link de fornecedor",
    "addedToStore": false,
    "sourceUrl": "https://pt.aliexpress.com/item/1005011992944856.html"
  },
  {
    "id": "physical-38",
    "name": "Kit Manicure Elétrico USB",
    "category": "Achados Fisicos",
    "subcategory": "Beleza e Cuidados",
    "supplier": "Curadoria Achados Fisicos",
    "costPrice": 6.9,
    "salePrice": 16.9,
    "imageUrl": "https://ae01.alicdn.com/kf/Sfd3278c1e6c84d07adccf055406a4b7f1.jpg",
    "benefits": [
      "Produto fisico de alta procura",
      "Boa opcao para oferta no WhatsApp",
      "Imagem do fornecedor incluida"
    ],
    "deliverable": "Produto fisico com imagem e link de fornecedor",
    "addedToStore": false,
    "sourceUrl": "https://pt.aliexpress.com/item/1005009261871587.html"
  },
  {
    "id": "physical-39",
    "name": "Smartwatch Militar 2026 (IP67/BT)",
    "category": "Achados Fisicos",
    "subcategory": "Eletronicos e Acessorios",
    "supplier": "Curadoria Achados Fisicos",
    "costPrice": 16.9,
    "salePrice": 39.9,
    "imageUrl": "https://ae01.alicdn.com/kf/Sa82a2c18c6d04220b9455c443e3436e47.png",
    "benefits": [
      "Produto fisico de alta procura",
      "Boa opcao para oferta no WhatsApp",
      "Imagem do fornecedor incluida"
    ],
    "deliverable": "Produto fisico com imagem e link de fornecedor",
    "addedToStore": false,
    "sourceUrl": "https://pt.aliexpress.com/item/1005008464589215.html"
  },
  {
    "id": "physical-40",
    "name": "Toalhas Premium Macias (1 Pacote)",
    "category": "Achados Fisicos",
    "subcategory": "Casa e Utilidades",
    "supplier": "Curadoria Achados Fisicos",
    "costPrice": 7.9,
    "salePrice": 19.9,
    "imageUrl": "https://ae01.alicdn.com/kf/S9e018d4fbd804e2784f8b12684d65163H.png",
    "benefits": [
      "Produto fisico de alta procura",
      "Boa opcao para oferta no WhatsApp",
      "Imagem do fornecedor incluida"
    ],
    "deliverable": "Produto fisico com imagem e link de fornecedor",
    "addedToStore": false,
    "sourceUrl": "https://pt.aliexpress.com/item/1005006736492092.html"
  },
  {
    "id": "physical-41",
    "name": "Conjunto Joias Pérola (86 peças)",
    "category": "Achados Fisicos",
    "subcategory": "Moda e Acessórios",
    "supplier": "Curadoria Achados Fisicos",
    "costPrice": 7.9,
    "salePrice": 19.9,
    "imageUrl": "https://ae01.alicdn.com/kf/S9d536717e48b41c69b8cf1a000aea77d8.jpg",
    "benefits": [
      "Produto fisico de alta procura",
      "Boa opcao para oferta no WhatsApp",
      "Imagem do fornecedor incluida"
    ],
    "deliverable": "Produto fisico com imagem e link de fornecedor",
    "addedToStore": false,
    "sourceUrl": "https://pt.aliexpress.com/item/1005007806183543.html"
  },
  {
    "id": "physical-42",
    "name": "Relógio LED Orientado ao Amor",
    "category": "Achados Fisicos",
    "subcategory": "Eletronicos e Acessorios",
    "supplier": "Curadoria Achados Fisicos",
    "costPrice": 7.9,
    "salePrice": 19.9,
    "imageUrl": "https://ae01.alicdn.com/kf/Sc9dd2ead14b642658d79b5bcdb59fa682.jpg",
    "benefits": [
      "Produto fisico de alta procura",
      "Boa opcao para oferta no WhatsApp",
      "Imagem do fornecedor incluida"
    ],
    "deliverable": "Produto fisico com imagem e link de fornecedor",
    "addedToStore": false,
    "sourceUrl": "https://pt.aliexpress.com/item/1005009489432468.html"
  },
  {
    "id": "physical-43",
    "name": "Cartas Pokemon (40/360 pçs)",
    "category": "Achados Fisicos",
    "subcategory": "Brinquedos e Colecionáveis",
    "supplier": "Curadoria Achados Fisicos",
    "costPrice": 7.9,
    "salePrice": 19.9,
    "imageUrl": "https://ae01.alicdn.com/kf/S1c170707fd304fb79921b62f3e2385daL.jpg",
    "benefits": [
      "Produto fisico de alta procura",
      "Boa opcao para oferta no WhatsApp",
      "Imagem do fornecedor incluida"
    ],
    "deliverable": "Produto fisico com imagem e link de fornecedor",
    "addedToStore": false,
    "sourceUrl": "https://pt.aliexpress.com/item/1005010375388847.html"
  },
  {
    "id": "physical-44",
    "name": "Lençol de Cama Estampa Coração",
    "category": "Achados Fisicos",
    "subcategory": "Casa e Utilidades",
    "supplier": "Curadoria Achados Fisicos",
    "costPrice": 7.9,
    "salePrice": 19.9,
    "imageUrl": "https://ae01.alicdn.com/kf/S86b494270acb466ab8951ee5f790c899k.jpg",
    "benefits": [
      "Produto fisico de alta procura",
      "Boa opcao para oferta no WhatsApp",
      "Imagem do fornecedor incluida"
    ],
    "deliverable": "Produto fisico com imagem e link de fornecedor",
    "addedToStore": false,
    "sourceUrl": "https://pt.aliexpress.com/item/1005007727176617.html"
  },
  {
    "id": "physical-45",
    "name": "Relógio Digital LED 2026 Infantil",
    "category": "Achados Fisicos",
    "subcategory": "Brinquedos e Colecionáveis",
    "supplier": "Curadoria Achados Fisicos",
    "costPrice": 7.9,
    "salePrice": 19.9,
    "imageUrl": "https://ae01.alicdn.com/kf/S44666fd333e845f69b69e8a1cd09726fH.jpg",
    "benefits": [
      "Produto fisico de alta procura",
      "Boa opcao para oferta no WhatsApp",
      "Imagem do fornecedor incluida"
    ],
    "deliverable": "Produto fisico com imagem e link de fornecedor",
    "addedToStore": false,
    "sourceUrl": "https://pt.aliexpress.com/item/1005006114568653.html"
  },
  {
    "id": "physical-46",
    "name": "Alça de Pulso Subwoofer Resistente",
    "category": "Achados Fisicos",
    "subcategory": "Informática",
    "supplier": "Curadoria Achados Fisicos",
    "costPrice": 4.9,
    "salePrice": 12.9,
    "imageUrl": "https://ae01.alicdn.com/kf/Sc319ffe36b5a4d67998deaf422bb06bd6.jpg",
    "benefits": [
      "Produto fisico de alta procura",
      "Boa opcao para oferta no WhatsApp",
      "Imagem do fornecedor incluida"
    ],
    "deliverable": "Produto fisico com imagem e link de fornecedor",
    "addedToStore": false,
    "sourceUrl": "https://pt.aliexpress.com/item/1005010621278637.html"
  },
  {
    "id": "physical-47",
    "name": "Smartwatch Y68 D20 (Pulseira/Música)",
    "category": "Achados Fisicos",
    "subcategory": "Eletronicos e Acessorios",
    "supplier": "Curadoria Achados Fisicos",
    "costPrice": 4.9,
    "salePrice": 12.9,
    "imageUrl": "https://ae01.alicdn.com/kf/S8b26dabd770740d886606597442daeaeK.jpg",
    "benefits": [
      "Produto fisico de alta procura",
      "Boa opcao para oferta no WhatsApp",
      "Imagem do fornecedor incluida"
    ],
    "deliverable": "Produto fisico com imagem e link de fornecedor",
    "addedToStore": false,
    "sourceUrl": "https://pt.aliexpress.com/item/1005012056031340.html"
  },
  {
    "id": "physical-48",
    "name": "Tênis Corrida Placa Carbono",
    "category": "Achados Fisicos",
    "subcategory": "Moda e Fitness",
    "supplier": "Curadoria Achados Fisicos",
    "costPrice": 22.9,
    "salePrice": 49.9,
    "imageUrl": "https://ae01.alicdn.com/kf/Seca37513ac994225ba26995802a6eba6n.jpg",
    "benefits": [
      "Produto fisico de alta procura",
      "Boa opcao para oferta no WhatsApp",
      "Imagem do fornecedor incluida"
    ],
    "deliverable": "Produto fisico com imagem e link de fornecedor",
    "addedToStore": false,
    "sourceUrl": "https://pt.aliexpress.com/item/1005010512748039.html"
  },
  {
    "id": "physical-49",
    "name": "Relógio Digital Elegante (Ouro/Prata)",
    "category": "Achados Fisicos",
    "subcategory": "Eletronicos e Acessorios",
    "supplier": "Curadoria Achados Fisicos",
    "costPrice": 7.9,
    "salePrice": 19.9,
    "imageUrl": "https://ae01.alicdn.com/kf/Sbe204e6ec11745918501bbac29dd282fh.jpg",
    "benefits": [
      "Produto fisico de alta procura",
      "Boa opcao para oferta no WhatsApp",
      "Imagem do fornecedor incluida"
    ],
    "deliverable": "Produto fisico com imagem e link de fornecedor",
    "addedToStore": false,
    "sourceUrl": "https://pt.aliexpress.com/item/1005005994778380.html"
  },
  {
    "id": "physical-50",
    "name": "Bolsa de Ombro Alça Larga",
    "category": "Achados Fisicos",
    "subcategory": "Moda e Acessórios",
    "supplier": "Curadoria Achados Fisicos",
    "costPrice": 12.9,
    "salePrice": 29.9,
    "imageUrl": "https://ae01.alicdn.com/kf/S727d0c36caae411d8f31f539bacc91ddX.jpg",
    "benefits": [
      "Produto fisico de alta procura",
      "Boa opcao para oferta no WhatsApp",
      "Imagem do fornecedor incluida"
    ],
    "deliverable": "Produto fisico com imagem e link de fornecedor",
    "addedToStore": false,
    "sourceUrl": "https://pt.aliexpress.com/item/1005006635718226.html"
  },
  {
    "id": "physical-51",
    "name": "Fone Dobrável Bluetooth 5.0",
    "category": "Achados Fisicos",
    "subcategory": "Audio e Gadgets",
    "supplier": "Curadoria Achados Fisicos",
    "costPrice": 11.9,
    "salePrice": 29.9,
    "imageUrl": "https://ae01.alicdn.com/kf/S557fba8e51704347bf25365c9d5ca8f8Z.jpg",
    "benefits": [
      "Produto fisico de alta procura",
      "Boa opcao para oferta no WhatsApp",
      "Imagem do fornecedor incluida"
    ],
    "deliverable": "Produto fisico com imagem e link de fornecedor",
    "addedToStore": false,
    "sourceUrl": "https://pt.aliexpress.com/item/1005010546036557.html"
  },
  {
    "id": "physical-52",
    "name": "Toalhas Faciais Lã Coral (5 peças)",
    "category": "Achados Fisicos",
    "subcategory": "Casa e Utilidades",
    "supplier": "Curadoria Achados Fisicos",
    "costPrice": 7.9,
    "salePrice": 19.9,
    "imageUrl": "",
    "benefits": [
      "Produto fisico de alta procura",
      "Boa opcao para oferta no WhatsApp",
      "Imagem do fornecedor incluida"
    ],
    "deliverable": "Produto fisico com imagem e link de fornecedor",
    "addedToStore": false,
    "sourceUrl": "https://pt.aliexpress.com/item/1005010338536169.html"
  },
  {
    "id": "physical-53",
    "name": "Smartwatch Frequência Cardíaca/Chamadas",
    "category": "Achados Fisicos",
    "subcategory": "Eletronicos e Acessorios",
    "supplier": "Curadoria Achados Fisicos",
    "costPrice": 16.9,
    "salePrice": 39.9,
    "imageUrl": "https://photos.enjoei.com.br/relogio-com-batimentos-cardiacos-passos-calorias-smartwatch-78018960/828xN/czM6Ly9waG90b3MuZW5qb2VpLmNvbS5ici9wcm9kdWN0cy8yNTQ2OTAxMS9kYzhmNzczMmMwM2I4YTRkMjIxNzQxNzgwYzYxNDVlMi5qcGc",
    "benefits": [
      "Produto fisico de alta procura",
      "Boa opcao para oferta no WhatsApp",
      "Imagem do fornecedor incluida"
    ],
    "deliverable": "Produto fisico com imagem e link de fornecedor",
    "addedToStore": false,
    "sourceUrl": "https://pt.aliexpress.com/item/1005007716457033.html"
  },
  {
    "id": "physical-54",
    "name": "Óculos de Sol Quadrado Sem Aro",
    "category": "Achados Fisicos",
    "subcategory": "Moda e Acessórios",
    "supplier": "Curadoria Achados Fisicos",
    "costPrice": 8.9,
    "salePrice": 19.9,
    "imageUrl": "http://lojasla.com/cdn/shop/products/oculos-de-sol-feminino-quadrado-em-metal-897506.jpg?v=1694910477",
    "benefits": [
      "Produto fisico de alta procura",
      "Boa opcao para oferta no WhatsApp",
      "Imagem do fornecedor incluida"
    ],
    "deliverable": "Produto fisico com imagem e link de fornecedor",
    "addedToStore": false,
    "sourceUrl": "https://pt.aliexpress.com/item/1005008468277084.html"
  },
  {
    "id": "physical-55",
    "name": "Projetor Céu Estrelado USB",
    "category": "Achados Fisicos",
    "subcategory": "Casa e Utilidades",
    "supplier": "Curadoria Achados Fisicos",
    "costPrice": 11.9,
    "salePrice": 29.9,
    "imageUrl": "",
    "benefits": [
      "Produto fisico de alta procura",
      "Boa opcao para oferta no WhatsApp",
      "Imagem do fornecedor incluida"
    ],
    "deliverable": "Produto fisico com imagem e link de fornecedor",
    "addedToStore": false,
    "sourceUrl": "https://pt.aliexpress.com/item/1005007573820052.html"
  },
  {
    "id": "physical-56",
    "name": "Mochila Feminina Moda 2022",
    "category": "Achados Fisicos",
    "subcategory": "Moda e Acessórios",
    "supplier": "Curadoria Achados Fisicos",
    "costPrice": 12.9,
    "salePrice": 29.9,
    "imageUrl": "",
    "benefits": [
      "Produto fisico de alta procura",
      "Boa opcao para oferta no WhatsApp",
      "Imagem do fornecedor incluida"
    ],
    "deliverable": "Produto fisico com imagem e link de fornecedor",
    "addedToStore": false,
    "sourceUrl": "https://pt.aliexpress.com/item/1005007329172807.html"
  },
  {
    "id": "physical-57",
    "name": "Conjunto Camisola Renda Sexy",
    "category": "Achados Fisicos",
    "subcategory": "Moda e Fitness",
    "supplier": "Curadoria Achados Fisicos",
    "costPrice": 12.9,
    "salePrice": 29.9,
    "imageUrl": "https://ae01.alicdn.com/kf/Sda59c617b6514786a143feb340f26a2fm.jpg",
    "benefits": [
      "Produto fisico de alta procura",
      "Boa opcao para oferta no WhatsApp",
      "Imagem do fornecedor incluida"
    ],
    "deliverable": "Produto fisico com imagem e link de fornecedor",
    "addedToStore": false,
    "sourceUrl": "https://pt.aliexpress.com/item/1005008461157173.html"
  },
  {
    "id": "physical-58",
    "name": "Relógio Eletrônico Simples + Joias",
    "category": "Achados Fisicos",
    "subcategory": "Moda e Acessórios",
    "supplier": "Curadoria Achados Fisicos",
    "costPrice": 9.9,
    "salePrice": 24.9,
    "imageUrl": "https://ae01.alicdn.com/kf/S69fe043912bb4cdeb26dc2504ab35ba9V.jpg",
    "benefits": [
      "Produto fisico de alta procura",
      "Boa opcao para oferta no WhatsApp",
      "Imagem do fornecedor incluida"
    ],
    "deliverable": "Produto fisico com imagem e link de fornecedor",
    "addedToStore": false,
    "sourceUrl": "https://pt.aliexpress.com/item/1005010419185088.html"
  },
  {
    "id": "physical-59",
    "name": "Toalha Banho Algodão Multiuso",
    "category": "Achados Fisicos",
    "subcategory": "Casa e Utilidades",
    "supplier": "Curadoria Achados Fisicos",
    "costPrice": 7.9,
    "salePrice": 19.9,
    "imageUrl": "https://ae01.alicdn.com/kf/S9e018d4fbd804e2784f8b12684d65163H.png",
    "benefits": [
      "Produto fisico de alta procura",
      "Boa opcao para oferta no WhatsApp",
      "Imagem do fornecedor incluida"
    ],
    "deliverable": "Produto fisico com imagem e link de fornecedor",
    "addedToStore": false,
    "sourceUrl": "https://pt.aliexpress.com/item/1005006736492092.html"
  },
  {
    "id": "physical-60",
    "name": "Relógio Yikaze Infantil (Silicone)",
    "category": "Achados Fisicos",
    "subcategory": "Brinquedos e Colecionáveis",
    "supplier": "Curadoria Achados Fisicos",
    "costPrice": 7.9,
    "salePrice": 19.9,
    "imageUrl": "https://ae01.alicdn.com/kf/Sa2fac587ca6d4ebb9624a34b4c55a827Z.jpg",
    "benefits": [
      "Produto fisico de alta procura",
      "Boa opcao para oferta no WhatsApp",
      "Imagem do fornecedor incluida"
    ],
    "deliverable": "Produto fisico com imagem e link de fornecedor",
    "addedToStore": false,
    "sourceUrl": "https://pt.aliexpress.com/item/1005008191585498.html"
  },
  {
    "id": "physical-61",
    "name": "Chinelos Casal Antiderrapante",
    "category": "Achados Fisicos",
    "subcategory": "Moda e Fitness",
    "supplier": "Curadoria Achados Fisicos",
    "costPrice": 9.9,
    "salePrice": 24.9,
    "imageUrl": "https://ae01.alicdn.com/kf/S922b0a47bdcc478597247ec5a741a26bo.jpg",
    "benefits": [
      "Produto fisico de alta procura",
      "Boa opcao para oferta no WhatsApp",
      "Imagem do fornecedor incluida"
    ],
    "deliverable": "Produto fisico com imagem e link de fornecedor",
    "addedToStore": false,
    "sourceUrl": "https://pt.aliexpress.com/item/1005009357002790.html"
  },
  {
    "id": "physical-62",
    "name": "Máquina Cortar Cabelo Vintage T9",
    "category": "Achados Fisicos",
    "subcategory": "Beleza e Cuidados",
    "supplier": "Curadoria Achados Fisicos",
    "costPrice": 6.9,
    "salePrice": 16.9,
    "imageUrl": "https://ae01.alicdn.com/kf/Sfd3278c1e6c84d07adccf055406a4b7f1.jpg",
    "benefits": [
      "Produto fisico de alta procura",
      "Boa opcao para oferta no WhatsApp",
      "Imagem do fornecedor incluida"
    ],
    "deliverable": "Produto fisico com imagem e link de fornecedor",
    "addedToStore": false,
    "sourceUrl": "https://pt.aliexpress.com/item/1005009261871587.html"
  },
  {
    "id": "physical-63",
    "name": "Bolsa Mensageiro Borla",
    "category": "Achados Fisicos",
    "subcategory": "Moda e Acessórios",
    "supplier": "Curadoria Achados Fisicos",
    "costPrice": 12.9,
    "salePrice": 29.9,
    "imageUrl": "https://ae01.alicdn.com/kf/S5a59be1133c04418bc72194f36bfa879Y.jpg",
    "benefits": [
      "Produto fisico de alta procura",
      "Boa opcao para oferta no WhatsApp",
      "Imagem do fornecedor incluida"
    ],
    "deliverable": "Produto fisico com imagem e link de fornecedor",
    "addedToStore": false,
    "sourceUrl": "https://pt.aliexpress.com/item/1005006946116874.html"
  },
  {
    "id": "physical-64",
    "name": "Relógio Quartzo Luxo Aço Inoxidável",
    "category": "Achados Fisicos",
    "subcategory": "Eletronicos e Acessorios",
    "supplier": "Curadoria Achados Fisicos",
    "costPrice": 9.9,
    "salePrice": 24.9,
    "imageUrl": "https://ae01.alicdn.com/kf/Sa55d5a84cdf34fa8b7ec2693df5ad6add.jpg",
    "benefits": [
      "Produto fisico de alta procura",
      "Boa opcao para oferta no WhatsApp",
      "Imagem do fornecedor incluida"
    ],
    "deliverable": "Produto fisico com imagem e link de fornecedor",
    "addedToStore": false,
    "sourceUrl": "https://pt.aliexpress.com/item/1005010764122945.html"
  },
  {
    "id": "physical-65",
    "name": "Película JBL Live Beam 3",
    "category": "Achados Fisicos",
    "subcategory": "Informática",
    "supplier": "Curadoria Achados Fisicos",
    "costPrice": 4.9,
    "salePrice": 12.9,
    "imageUrl": "https://ae01.alicdn.com/kf/Sf926b0422bac409185267e72a373c3e5R.jpg",
    "benefits": [
      "Produto fisico de alta procura",
      "Boa opcao para oferta no WhatsApp",
      "Imagem do fornecedor incluida"
    ],
    "deliverable": "Produto fisico com imagem e link de fornecedor",
    "addedToStore": false,
    "sourceUrl": "https://pt.aliexpress.com/item/1005011665518983.html"
  },
  {
    "id": "physical-66",
    "name": "Relógio Hello Kitty Digital",
    "category": "Achados Fisicos",
    "subcategory": "Brinquedos e Colecionáveis",
    "supplier": "Curadoria Achados Fisicos",
    "costPrice": 7.9,
    "salePrice": 19.9,
    "imageUrl": "https://ae01.alicdn.com/kf/S6d5ceac427e6478eb74cf2143f346366M.jpg",
    "benefits": [
      "Produto fisico de alta procura",
      "Boa opcao para oferta no WhatsApp",
      "Imagem do fornecedor incluida"
    ],
    "deliverable": "Produto fisico com imagem e link de fornecedor",
    "addedToStore": false,
    "sourceUrl": "https://pt.aliexpress.com/item/1005007876093515.html"
  },
  {
    "id": "physical-67",
    "name": "Mouse Gamer SmailWolf RS8 (10000DPI)",
    "category": "Achados Fisicos",
    "subcategory": "Informática",
    "supplier": "Curadoria Achados Fisicos",
    "costPrice": 15.9,
    "salePrice": 34.9,
    "imageUrl": "https://ae01.alicdn.com/kf/S7737a66aa8694f5ea9690cb8c67d4cb97.jpg",
    "benefits": [
      "Produto fisico de alta procura",
      "Boa opcao para oferta no WhatsApp",
      "Imagem do fornecedor incluida"
    ],
    "deliverable": "Produto fisico com imagem e link de fornecedor",
    "addedToStore": false,
    "sourceUrl": "https://pt.aliexpress.com/item/1005008935336122.html"
  },
  {
    "id": "physical-68",
    "name": "Fone Gancho Bluetooth 5.2",
    "category": "Achados Fisicos",
    "subcategory": "Audio e Gadgets",
    "supplier": "Curadoria Achados Fisicos",
    "costPrice": 11.9,
    "salePrice": 29.9,
    "imageUrl": "https://ae01.alicdn.com/kf/Sbe0f029f8744409db87220c3e5a2031cq.jpg",
    "benefits": [
      "Produto fisico de alta procura",
      "Boa opcao para oferta no WhatsApp",
      "Imagem do fornecedor incluida"
    ],
    "deliverable": "Produto fisico com imagem e link de fornecedor",
    "addedToStore": false,
    "sourceUrl": "https://pt.aliexpress.com/item/1005010273187491.html"
  },
  {
    "id": "physical-69",
    "name": "Vidro Temperado Lenovo Tab M11",
    "category": "Achados Fisicos",
    "subcategory": "Informática",
    "supplier": "Curadoria Achados Fisicos",
    "costPrice": 4.9,
    "salePrice": 12.9,
    "imageUrl": "https://ae01.alicdn.com/kf/Sf831b6e972054e098f2e6c15bcb16924P.jpg",
    "benefits": [
      "Produto fisico de alta procura",
      "Boa opcao para oferta no WhatsApp",
      "Imagem do fornecedor incluida"
    ],
    "deliverable": "Produto fisico com imagem e link de fornecedor",
    "addedToStore": false,
    "sourceUrl": "https://pt.aliexpress.com/item/1005007283535204.html"
  },
  {
    "id": "physical-70",
    "name": "Relógio Inteligente Rastreador Fitness",
    "category": "Achados Fisicos",
    "subcategory": "Eletronicos e Acessorios",
    "supplier": "Curadoria Achados Fisicos",
    "costPrice": 16.9,
    "salePrice": 39.9,
    "imageUrl": "",
    "benefits": [
      "Produto fisico de alta procura",
      "Boa opcao para oferta no WhatsApp",
      "Imagem do fornecedor incluida"
    ],
    "deliverable": "Produto fisico com imagem e link de fornecedor",
    "addedToStore": false,
    "sourceUrl": "https://pt.aliexpress.com/item/1005008061280253.html"
  },
  {
    "id": "physical-71",
    "name": "Clipe de Cabelo Tubarão (11 peças)",
    "category": "Achados Fisicos",
    "subcategory": "Beleza e Cuidados",
    "supplier": "Curadoria Achados Fisicos",
    "costPrice": 6.9,
    "salePrice": 16.9,
    "imageUrl": "",
    "benefits": [
      "Produto fisico de alta procura",
      "Boa opcao para oferta no WhatsApp",
      "Imagem do fornecedor incluida"
    ],
    "deliverable": "Produto fisico com imagem e link de fornecedor",
    "addedToStore": false,
    "sourceUrl": "https://pt.aliexpress.com/item/1005007523157773.html"
  },
  {
    "id": "physical-72",
    "name": "Acessórios Stanley Cup (9 peças)",
    "category": "Achados Fisicos",
    "subcategory": "Casa e Utilidades",
    "supplier": "Curadoria Achados Fisicos",
    "costPrice": 7.9,
    "salePrice": 19.9,
    "imageUrl": "",
    "benefits": [
      "Produto fisico de alta procura",
      "Boa opcao para oferta no WhatsApp",
      "Imagem do fornecedor incluida"
    ],
    "deliverable": "Produto fisico com imagem e link de fornecedor",
    "addedToStore": false,
    "sourceUrl": "https://pt.aliexpress.com/item/1005007335709104.html"
  },
  {
    "id": "physical-73",
    "name": "Shorts Corrida Masculino (Camada Única)",
    "category": "Achados Fisicos",
    "subcategory": "Moda e Fitness",
    "supplier": "Curadoria Achados Fisicos",
    "costPrice": 12.9,
    "salePrice": 29.9,
    "imageUrl": "",
    "benefits": [
      "Produto fisico de alta procura",
      "Boa opcao para oferta no WhatsApp",
      "Imagem do fornecedor incluida"
    ],
    "deliverable": "Produto fisico com imagem e link de fornecedor",
    "addedToStore": false,
    "sourceUrl": "https://pt.aliexpress.com/item/1005008167768972.html"
  },
  {
    "id": "physical-74",
    "name": "Relógio Quadrado Borboleta/Nave",
    "category": "Achados Fisicos",
    "subcategory": "Moda e Acessórios",
    "supplier": "Curadoria Achados Fisicos",
    "costPrice": 7.9,
    "salePrice": 19.9,
    "imageUrl": "",
    "benefits": [
      "Produto fisico de alta procura",
      "Boa opcao para oferta no WhatsApp",
      "Imagem do fornecedor incluida"
    ],
    "deliverable": "Produto fisico com imagem e link de fornecedor",
    "addedToStore": false,
    "sourceUrl": "https://pt.aliexpress.com/item/1005011992944856.html"
  },
  {
    "id": "physical-75",
    "name": "Chinelos Nuvem Plataforma",
    "category": "Achados Fisicos",
    "subcategory": "Moda e Fitness",
    "supplier": "Curadoria Achados Fisicos",
    "costPrice": 9.9,
    "salePrice": 24.9,
    "imageUrl": "",
    "benefits": [
      "Produto fisico de alta procura",
      "Boa opcao para oferta no WhatsApp",
      "Imagem do fornecedor incluida"
    ],
    "deliverable": "Produto fisico com imagem e link de fornecedor",
    "addedToStore": false,
    "sourceUrl": "https://pt.aliexpress.com/item/1005008170498395.html"
  },
  {
    "id": "physical-76",
    "name": "Acessórios Stanley Cup Roxo (8 peças)",
    "category": "Achados Fisicos",
    "subcategory": "Casa e Utilidades",
    "supplier": "Curadoria Achados Fisicos",
    "costPrice": 7.9,
    "salePrice": 19.9,
    "imageUrl": "",
    "benefits": [
      "Produto fisico de alta procura",
      "Boa opcao para oferta no WhatsApp",
      "Imagem do fornecedor incluida"
    ],
    "deliverable": "Produto fisico com imagem e link de fornecedor",
    "addedToStore": false,
    "sourceUrl": "https://pt.aliexpress.com/item/1005008796124357.html"
  },
  {
    "id": "physical-77",
    "name": "Frascos Plástico Cozinha Selados",
    "category": "Achados Fisicos",
    "subcategory": "Casa e Utilidades",
    "supplier": "Curadoria Achados Fisicos",
    "costPrice": 7.9,
    "salePrice": 19.9,
    "imageUrl": "",
    "benefits": [
      "Produto fisico de alta procura",
      "Boa opcao para oferta no WhatsApp",
      "Imagem do fornecedor incluida"
    ],
    "deliverable": "Produto fisico com imagem e link de fornecedor",
    "addedToStore": false,
    "sourceUrl": "https://pt.aliexpress.com/item/1005006116459385.html"
  },
  {
    "id": "physical-78",
    "name": "Smartwatch Laxasfit Bluetooth Talk",
    "category": "Achados Fisicos",
    "subcategory": "Eletronicos e Acessorios",
    "supplier": "Curadoria Achados Fisicos",
    "costPrice": 16.9,
    "salePrice": 39.9,
    "imageUrl": "",
    "benefits": [
      "Produto fisico de alta procura",
      "Boa opcao para oferta no WhatsApp",
      "Imagem do fornecedor incluida"
    ],
    "deliverable": "Produto fisico com imagem e link de fornecedor",
    "addedToStore": false,
    "sourceUrl": "https://pt.aliexpress.com/item/1005008464589215.html"
  },
  {
    "id": "physical-79",
    "name": "Camiseta + Shorts Urso de Pelúcia",
    "category": "Achados Fisicos",
    "subcategory": "Moda e Fitness",
    "supplier": "Curadoria Achados Fisicos",
    "costPrice": 12.9,
    "salePrice": 29.9,
    "imageUrl": "",
    "benefits": [
      "Produto fisico de alta procura",
      "Boa opcao para oferta no WhatsApp",
      "Imagem do fornecedor incluida"
    ],
    "deliverable": "Produto fisico com imagem e link de fornecedor",
    "addedToStore": false,
    "sourceUrl": "https://pt.aliexpress.com/item/1005008844326362.html"
  }
];

export const DEFAULT_STORE_CONFIG: StoreConfig = {
  "name": "Storefy Digital",
  "whatsapp": "5511999998888",
  "niche": "Gamer & Esports",
  "primaryColor": "#d4af37",
  "logoUrl": "https://i.imgur.com/nUsczZV.png",
  "subdomain": "storefy",
  "welcomeMessage": "Olá! Vim através da vitrine Storefy e gostaria de comprar estes produtos:",
  "instagram": "storefy.digital",
  "faq": [
    {
      "question": "Como recebo meu produto após o pagamento?",
      "answer": "A entrega é combinada pelo WhatsApp após a confirmação do pagamento, conforme o produto escolhido."
    },
    {
      "question": "Posso comprar mais de um produto?",
      "answer": "Sim. Adicione os itens ao carrinho e envie o pedido completo pelo WhatsApp."
    },
    {
      "question": "Os valores podem mudar?",
      "answer": "Os preços exibidos são os valores configurados pela loja. Sempre confirme disponibilidade antes de finalizar."
    }
  ]
};
