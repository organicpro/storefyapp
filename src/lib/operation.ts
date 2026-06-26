import { Product, StoreConfig } from '../types';

export type SocialChannel = 'instagram' | 'tiktok';
export type VideoFormat = 'frame' | 'caption';

export interface OperationNiche {
  id: string;
  name: string;
  description: string;
  categories: Product['category'][];
  accent: string;
  names: string[];
  hashtags: string[];
  framePhrase: string;
  captionPhrase: string;
}

export const OPERATION_NICHES: OperationNiche[] = [
  { id: 'games', name: 'Games', description: 'Ofertas, acessórios, contas e itens para jogadores.', categories: ['Games'], accent: '#7c3aed', names: ['LootBarato', 'Pixel Ofertas', 'Player Shop'], hashtags: ['#games', '#gamer', '#ofertasgamer'], framePhrase: 'Achados para quem joga de verdade', captionPhrase: 'Seu setup merece isso.' },
  { id: 'subscriptions', name: 'Assinaturas', description: 'Streaming, acessos e serviços recorrentes.', categories: ['Assinaturas Digitais'], accent: '#2563eb', names: ['Clube Play', 'Acesso Fácil', 'Tela Premium'], hashtags: ['#streaming', '#assinaturas', '#ofertas'], framePhrase: 'Mais entretenimento, menos custo', captionPhrase: 'Olha esse acesso.' },
  { id: 'physical-finds', name: 'Achados físicos', description: 'Produtos úteis, baratos e prontos para divulgar.', categories: ['Achados Fisicos'], accent: '#f97316', names: ['Achado do Dia', 'Garimpo Fácil', 'Oferta em Casa'], hashtags: ['#achadinhos', '#ofertas', '#utilidades'], framePhrase: 'Achados que facilitam a rotina', captionPhrase: 'Pouca gente conhece esse achado.' },
  { id: 'streaming', name: 'Streaming', description: 'Catálogo de entretenimento e acessos digitais.', categories: ['Assinaturas Digitais'], accent: '#ef4444', names: ['Play Agora', 'Tela Livre', 'Seu Streaming'], hashtags: ['#filmes', '#series', '#streaming'], framePhrase: 'Sua próxima maratona começa aqui', captionPhrase: 'Quer assistir mais pagando menos?' },
  { id: 'digital-products', name: 'Produtos digitais', description: 'Guias, materiais e recursos para baixar.', categories: ['Infoprodutos'], accent: '#10b981', names: ['Arquivo Pronto', 'Kit Digital', 'Guia Direto'], hashtags: ['#produtosdigitais', '#ebook', '#rendaextra'], framePhrase: 'Materiais que ajudam você a avançar', captionPhrase: 'Salva isso para ver depois.' },
  { id: 'apps-tools', name: 'Apps e ferramentas', description: 'Ferramentas, IA e assinaturas úteis.', categories: ['Assinaturas Digitais'], accent: '#06b6d4', names: ['Ferramenta Pro', 'App em Dia', 'Atalho Digital'], hashtags: ['#apps', '#ferramentas', '#ia'], framePhrase: 'Ferramentas para fazer mais em menos tempo', captionPhrase: 'Essa ferramenta pode te poupar horas.' },
  { id: 'electronics', name: 'Eletrônicos', description: 'Gadgets, acessórios e tecnologia do dia a dia.', categories: ['Achados Fisicos'], accent: '#0ea5e9', names: ['Tech em Oferta', 'Gadget Agora', 'Conecta Shop'], hashtags: ['#tecnologia', '#gadgets', '#eletronicos'], framePhrase: 'Tecnologia útil com preço que cabe', captionPhrase: 'Você usaria esse gadget?' },
  { id: 'home', name: 'Casa e utilidades', description: 'Itens para deixar a rotina mais prática.', categories: ['Achados Fisicos'], accent: '#f59e0b', names: ['Casa em Dia', 'Utilidade Já', 'Lar Prático'], hashtags: ['#casa', '#utilidades', '#achadinhos'], framePhrase: 'Pequenos achados, grande diferença em casa', captionPhrase: 'Isso resolve uma dor da rotina.' },
  { id: 'beauty', name: 'Beleza', description: 'Cuidados, acessórios e itens de autocuidado.', categories: ['Achados Fisicos'], accent: '#db2777', names: ['Glow em Oferta', 'Beleza Prática', 'Seu Momento'], hashtags: ['#beleza', '#autocuidado', '#ofertas'], framePhrase: 'Beleza prática para o seu dia', captionPhrase: 'Um achado que vale testar.' },
  { id: 'pet', name: 'Pet', description: 'Achados e utilidades para quem cuida de pets.', categories: ['Achados Fisicos'], accent: '#84cc16', names: ['Pet em Dia', 'Mimo Pet', 'Clube do Pet'], hashtags: ['#pet', '#cachorro', '#gato'], framePhrase: 'Mais carinho para quem faz parte da família', captionPhrase: 'Seu pet ia amar isso.' },
  { id: 'fitness', name: 'Fitness', description: 'Acessórios e materiais para movimento e bem-estar.', categories: ['Achados Fisicos', 'Infoprodutos'], accent: '#22c55e', names: ['Movimento Já', 'Fit em Oferta', 'Rotina Ativa'], hashtags: ['#fitness', '#treino', '#bemestar'], framePhrase: 'Um passo simples para uma rotina mais ativa', captionPhrase: 'Seu próximo treino pode começar aqui.' },
  { id: 'income', name: 'Renda extra', description: 'Materiais e ferramentas para criar novas possibilidades.', categories: ['Infoprodutos', 'Redes Sociais'], accent: '#eab308', names: ['Renda em Foco', 'Plano Extra', 'Virada Digital'], hashtags: ['#rendaextra', '#empreendedorismo', '#negocios'], framePhrase: 'Ideias e ferramentas para tirar planos do papel', captionPhrase: 'Isso pode virar sua próxima renda.' }
];

export function slugify(value: string) {
  return String(value || 'storefy').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '').slice(0, 24) || 'storefy';
}

export function getOperationNiche(config: StoreConfig) {
  return OPERATION_NICHES.find((item) => item.id === config.operationNiche)
    || OPERATION_NICHES.find((item) => item.name === config.niche)
    || OPERATION_NICHES[0];
}

export function getSuggestedOperationName(niche: OperationNiche, offset = 0) {
  return niche.names[offset % niche.names.length];
}

export function getOperationProfile(config: StoreConfig) {
  const niche = getOperationNiche(config);
  const name = config.name || getSuggestedOperationName(niche);
  const handle = config.profileHandle || `@${slugify(name)}`;
  const channels: SocialChannel[] = config.socialChannels?.length ? config.socialChannels : ['instagram', 'tiktok'];
  const cta = config.videoCta || 'Veja a vitrine e chame no WhatsApp';
  const bio = config.profileBio || `${niche.description}\n↓ ${cta}`;
  return { niche, name, handle, channels, cta, bio };
}

export function getRelevantProducts(config: StoreConfig, products: Product[]) {
  const niche = getOperationNiche(config);
  return products.filter((product) => niche.categories.includes(product.category));
}

export function getContentPack(config: StoreConfig, products: Product[]) {
  const profile = getOperationProfile(config);
  const selected = products.filter((product) => product.addedToStore);
  const highlight = selected[0]?.name || 'as ofertas da vitrine';
  const hashtags = [...profile.niche.hashtags, '#storefy', `#${slugify(profile.name)}`].join(' ');
  return {
    instagram: `Separei ${highlight} na ${profile.name}. Confira os detalhes na vitrine e me chama no WhatsApp para receber o atendimento.\n\n${hashtags}`,
    tiktok: `${profile.niche.captionPhrase} Temos novidades na vitrine da ${profile.name}.\n\n${hashtags}`,
    story: `Novidade na ${profile.name}: ${highlight}. Toque no link da bio ou chama no WhatsApp.`,
    whatsapp: `Olá! Vi ${highlight} na ${profile.name} e quero mais informações.`,
    groups: `Pessoal, separei ofertas de ${profile.niche.name} na ${profile.name}. A vitrine está pronta para consultar: ${profile.cta}.`,
    bioCta: `${profile.cta} ↓`,
    hashtags
  };
}

export function getPostingCalendar(config: StoreConfig) {
  const profile = getOperationProfile(config);
  const content = getContentPack(config, []);
  return Array.from({ length: 7 }, (_, index) => ({
    day: `Dia ${index + 1}`,
    focus: index % 2 === 0 ? 'Produto em destaque' : 'Conteúdo de descoberta',
    posts: [
      { time: '10h', channel: profile.channels.includes('tiktok') ? 'TikTok' : 'Conteúdo', action: 'Publicar vídeo curto', caption: content.tiktok },
      { time: '12h', channel: profile.channels.includes('instagram') ? 'Instagram Reels' : 'Vitrine', action: 'Publicar vídeo e link da bio', caption: content.instagram },
      { time: '19h', channel: 'Story / grupos', action: index % 2 === 0 ? 'Story com CTA para a vitrine' : 'Divulgar em um grupo relevante', caption: index % 2 === 0 ? content.story : content.groups }
    ]
  }));
}

export function downloadBlob(filename: string, content: BlobPart, type = 'text/plain;charset=utf-8') {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement('a');
  link.href = url; link.download = filename; link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1500);
}

function crc32(bytes: Uint8Array) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
  }
  return (crc ^ 0xffffffff) >>> 0;
}

export function buildZip(files: Array<{ name: string; content: string }>) {
  const encoder = new TextEncoder();
  const locals: Uint8Array[] = [];
  const centrals: Uint8Array[] = [];
  let offset = 0;
  for (const file of files) {
    const name = encoder.encode(file.name);
    const data = encoder.encode(file.content);
    const crc = crc32(data);
    const local = new Uint8Array(30 + name.length + data.length);
    const view = new DataView(local.buffer);
    view.setUint32(0, 0x04034b50, true); view.setUint16(4, 20, true); view.setUint16(6, 0x0800, true);
    view.setUint32(14, crc, true); view.setUint32(18, data.length, true); view.setUint32(22, data.length, true); view.setUint16(26, name.length, true);
    local.set(name, 30); local.set(data, 30 + name.length); locals.push(local);
    const central = new Uint8Array(46 + name.length); const centralView = new DataView(central.buffer);
    centralView.setUint32(0, 0x02014b50, true); centralView.setUint16(4, 20, true); centralView.setUint16(6, 20, true); centralView.setUint16(8, 0x0800, true);
    centralView.setUint32(16, crc, true); centralView.setUint32(20, data.length, true); centralView.setUint32(24, data.length, true); centralView.setUint16(28, name.length, true); centralView.setUint32(42, offset, true);
    central.set(name, 46); centrals.push(central); offset += local.length;
  }
  const centralSize = centrals.reduce((total, part) => total + part.length, 0);
  const end = new Uint8Array(22); const endView = new DataView(end.buffer);
  endView.setUint32(0, 0x06054b50, true); endView.setUint16(8, files.length, true); endView.setUint16(10, files.length, true); endView.setUint32(12, centralSize, true); endView.setUint32(16, offset, true);
  return new Blob([...locals, ...centrals, end], { type: 'application/zip' });
}
