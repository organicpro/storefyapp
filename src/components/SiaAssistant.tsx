import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight, AudioLines, Bot, BrainCircuit, ChartNoAxesCombined, Check,
  ChevronDown, ChevronRight, CircleDollarSign, LoaderCircle, Mic,
  Download, Film, PackageSearch, Paintbrush, Plus, RefreshCw, Rocket, Send, ShoppingBag,
  Sparkles, Store, Target, UserRound, WandSparkles, X
} from 'lucide-react';
import { NICHES } from '../data';
import MarketplaceImporter, { type MarketplaceImportInput } from './MarketplaceImporter';
import OperationStudio from './OperationStudio';
import { downloadBlob, type VideoFormat } from '../lib/operation';
import { generateProductReels, type GeneratedProductReel, type ReelTextVariant } from '../lib/productReels';
import type { Product, StoreConfig } from '../types';

type ChatMessage = {
  id: string;
  role: 'assistant' | 'user';
  content: string;
};

type AssistantMode = 'current' | 'new';

type NalaMemory = {
  audience: string;
  budget: string;
  niches: string[];
  rejectedProductIds: string[];
};

type PendingAction =
  | { type: 'add-product'; productId: string; title: string; description: string }
  | { type: 'update-price'; productId: string; price: number; title: string; description: string }
  | { type: 'navigate'; page: string; title: string; description: string };

type StoreFlowStep = 'idle' | 'niche' | 'audience' | 'name' | 'whatsapp' | 'theme' | 'products' | 'review' | 'done';

type SiaStoreDraft = {
  nicheId: string;
  name: string;
  whatsapp: string;
  themePreset: NonNullable<StoreConfig['themePreset']>;
  primaryColor: string;
  productIds: string[];
};

export type SiaStoreRequest = SiaStoreDraft & {
  nicheName: string;
};

interface SiaAssistantProps {
  products: Product[];
  currentStore: StoreConfig;
  storesCount: number;
  accountName?: string;
  onCreateStore: (request: SiaStoreRequest) => void;
  onToggleProduct: (productId: string) => void;
  onUpdateProductPrice: (productId: string, price: number) => void;
  onNavigate: (page: string) => void;
  onPreviewStore: () => void;
  onUpdateStoreConfig: (config: StoreConfig) => void;
  onImportProduct: (input: MarketplaceImportInput, target: 'current' | 'draft') => string;
  onPublishStore: () => Promise<{ mode: string; url: string; error?: string }>;
  onBuildStoreHtml: () => string;
}

const CHAT_STORAGE_KEY = 'storefy.nala.messages.v1';
const CHAT_HISTORY_STORAGE_KEY = 'storefy.nala.history.v2';
const MEMORY_STORAGE_KEY = 'storefy.nala.memory.v1';
const FLOW_STORAGE_KEY = 'storefy.nala.store-flow.v1';
const LEGACY_CHAT_STORAGE_KEY = 'storefy.sia.messages.v1';

const createLocalReelVariants = (productName: string, storeName: string): ReelTextVariant[] => {
  const product = productName.trim().slice(0, 72) || 'esse produto';
  const store = storeName.trim().slice(0, 48) || 'nossa vitrine';
  return [
    { hook: `Você precisa ver ${product} em ação`, cta: `Veja na ${store}` },
    { hook: 'Eu não sabia que isso facilitava tanto a rotina', cta: 'Confira na vitrine' },
    { hook: 'Um achado útil que merece sua atenção', cta: 'Veja todos os detalhes' },
    { hook: 'Olha esse produto funcionando de perto', cta: 'Chame no WhatsApp' },
    { hook: 'Antes de comprar, vale a pena conhecer isso', cta: 'Acesse a loja agora' }
  ];
};
const LEGACY_FLOW_STORAGE_KEY = 'storefy.sia.store-flow.v1';

const GUIDED_FLOW_STEPS: Array<{ id: Exclude<StoreFlowStep, 'idle' | 'done'>; label: string }> = [
  { id: 'niche', label: 'Nicho' },
  { id: 'audience', label: 'Público' },
  { id: 'name', label: 'Nome' },
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'theme', label: 'Visual' },
  { id: 'products', label: 'Produtos' },
  { id: 'review', label: 'Revisão' }
];

const emptyDraft = (): SiaStoreDraft => ({
  nicheId: '',
  name: '',
  whatsapp: '',
  themePreset: 'clean',
  primaryColor: '#0f766e',
  productIds: []
});

const makeMessage = (role: ChatMessage['role'], content: string): ChatMessage => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  role,
  content
});

const initialMessages = (name?: string): ChatMessage[] => [
  makeMessage(
    'assistant',
    `Olá${name ? `, ${name.split(' ')[0]}` : ''}! Eu sou a Ayla. Posso criar sua loja, encontrar produtos com boa margem e montar um plano simples para você começar a vender.`
  )
];

const readHistoryMap = (): Record<string, ChatMessage[]> => {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(CHAT_HISTORY_STORAGE_KEY) || '{}');
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
};

const readMessages = (name: string | undefined, contextKey: string) => {
  try {
    const history = readHistoryMap();
    const stored = history[contextKey] || [];
    return Array.isArray(stored) && stored.length
      ? stored.slice(-30).map((message: ChatMessage) => message.role === 'assistant'
        ? { ...message, content: String(message.content || '').replace(/\bSIA\b/g, 'Ayla').replace(/\bNala\b/g, 'Ayla') }
        : message) as ChatMessage[]
      : initialMessages(name);
  } catch {
    return initialMessages(name);
  }
};

const saveMessages = (contextKey: string, messages: ChatMessage[]) => {
  const history = readHistoryMap();
  history[contextKey] = messages.slice(-30);
  window.localStorage.setItem(CHAT_HISTORY_STORAGE_KEY, JSON.stringify(history));
};

const readMemory = (): NalaMemory => {
  try {
    const stored = JSON.parse(window.localStorage.getItem(MEMORY_STORAGE_KEY) || '{}');
    return {
      audience: String(stored.audience || ''),
      budget: String(stored.budget || ''),
      niches: Array.isArray(stored.niches) ? stored.niches.slice(0, 8) : [],
      rejectedProductIds: Array.isArray(stored.rejectedProductIds) ? stored.rejectedProductIds.slice(-50) : []
    };
  } catch {
    return { audience: '', budget: '', niches: [], rejectedProductIds: [] };
  }
};

const readFlow = (): { step: StoreFlowStep; draft: SiaStoreDraft; showRecommendations: boolean; recommendationNicheId: string; recommendationQuery: string; recommendationProductIds: string[] } => {
  try {
    const stored = JSON.parse(window.localStorage.getItem(FLOW_STORAGE_KEY) || window.localStorage.getItem(LEGACY_FLOW_STORAGE_KEY) || '{}');
    const storedStep = stored.step === 'budget' ? 'name' : stored.step;
    const validSteps: StoreFlowStep[] = ['idle', 'niche', 'audience', 'name', 'whatsapp', 'theme', 'products', 'review', 'done'];
    return {
      step: validSteps.includes(storedStep) ? storedStep : 'idle',
      draft: { ...emptyDraft(), ...(stored.draft || {}), productIds: Array.isArray(stored.draft?.productIds) ? stored.draft.productIds : [] },
      showRecommendations: Boolean(stored.showRecommendations),
      recommendationNicheId: NICHES.some(niche => niche.id === stored.recommendationNicheId) ? stored.recommendationNicheId : NICHES[0].id,
      recommendationQuery: String(stored.recommendationQuery || ''),
      recommendationProductIds: Array.isArray(stored.recommendationProductIds) ? stored.recommendationProductIds : []
    };
  } catch {
    return { step: 'idle', draft: emptyDraft(), showRecommendations: false, recommendationNicheId: NICHES[0].id, recommendationQuery: '', recommendationProductIds: [] };
  }
};

const categoryByNiche: Record<string, Product['category']> = {
  games: 'Games',
  'redes-sociais': 'Redes Sociais',
  'assinaturas-digitais': 'Assinaturas Digitais',
  infoprodutos: 'Infoprodutos',
  'physical-finds': 'Achados Fisicos'
};

const themeOptions: Array<{
  id: NonNullable<StoreConfig['themePreset']>;
  name: string;
  description: string;
  color: string;
}> = [
  { id: 'clean', name: 'Clean', description: 'Claro e direto', color: '#0f766e' },
  { id: 'market', name: 'Market', description: 'Foco em ofertas', color: '#2563eb' },
  { id: 'obsidian', name: 'Obsidian', description: 'Premium e escuro', color: '#d4af37' },
  { id: 'aurora', name: 'Aurora', description: 'Visual vibrante', color: '#db2777' }
];

const formatCurrency = (value: number) => value.toLocaleString('pt-BR', {
  style: 'currency',
  currency: 'BRL'
});

function recommendationScore(product: Product) {
  const margin = product.costPrice > 0 ? (product.salePrice - product.costPrice) / product.costPrice : 0;
  return margin * 30 + Number(product.ordersCount || 0) * 0.08 + Number(product.rating || 0) * 3 + (product.stockQuantity ? 4 : 0);
}

function inferNicheId(value: string, fallback: string) {
  const text = value.toLowerCase();
  if (/gamer|jogo|free fire|roblox|steam|efootball/.test(text)) return 'games';
  if (/instagram|tiktok|seguidor|rede social|youtube/.test(text)) return 'redes-sociais';
  if (/assinatura|streaming|netflix|spotify|chatgpt|canva/.test(text)) return 'assinaturas-digitais';
  if (/ebook|curso|renda extra|infoproduto|template/.test(text)) return 'infoprodutos';
  if (/físico|fisico|casa|beleza|eletrônico|eletronico|achado|drop/.test(text)) return 'physical-finds';
  return fallback;
}

const SEARCH_STOP_WORDS = new Set(['a', 'as', 'o', 'os', 'de', 'da', 'das', 'do', 'dos', 'e', 'em', 'para', 'por', 'um', 'uma', 'me', 'mostre', 'indique', 'quero', 'qual', 'quais', 'produto', 'produtos', 'vender', 'venda', 'opcao', 'opcoes', 'adequado', 'adequada', 'adequados', 'adequadas', 'exemplo', 'exemplos']);
const SEARCH_EXPANSIONS: Record<string, string[]> = {
  crianca: ['infantil', 'bebe', 'brinquedo', 'escolar', 'menino', 'menina', 'kids'],
  infantil: ['crianca', 'bebe', 'brinquedo', 'escolar', 'kids'],
  bebe: ['infantil', 'crianca', 'maternidade'],
  pet: ['cachorro', 'gato', 'animal'],
  beleza: ['maquiagem', 'cosmetico', 'pele', 'cabelo'],
  casa: ['cozinha', 'decoracao', 'banheiro', 'organizacao'],
  gamer: ['jogo', 'gaming', 'console', 'computador'],
  fitness: ['academia', 'treino', 'esporte']
};

function normalizeSearch(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function productSearchTokens(value: string) {
  const base = normalizeSearch(value).split(/\s+/).filter(token => token.length > 2 && !SEARCH_STOP_WORDS.has(token));
  return Array.from(new Set(base.flatMap(token => [token, ...(SEARCH_EXPANSIONS[token] || [])])));
}

function rankProductsForQuery(allProducts: Product[], query: string, nicheId?: string) {
  const tokens = productSearchTokens(query);
  const nicheCategory = nicheId ? categoryByNiche[nicheId] : undefined;
  return allProducts
    .map(product => {
      const name = normalizeSearch(product.name);
      const subcategory = normalizeSearch(product.subcategory || '');
      const description = normalizeSearch(product.descriptionText || '');
      const benefits = normalizeSearch((product.benefits || []).join(' '));
      let relevance = 0;
      for (const token of tokens) {
        if (name.includes(token)) relevance += 12;
        if (subcategory.includes(token)) relevance += 8;
        if (benefits.includes(token)) relevance += 4;
        if (description.includes(token)) relevance += 2;
      }
      if (!tokens.length && product.category === nicheCategory) relevance += 1;
      return { product, relevance, quality: recommendationScore(product) };
    })
    .filter(item => item.relevance > 0)
    .sort((a, b) => b.relevance - a.relevance || b.quality - a.quality)
    .map(item => item.product);
}

function updateMemoryFromText(current: NalaMemory, value: string) {
  const normalized = normalizeSearch(value);
  const audienceMatch = normalized.match(/\b(idosos?|terceira idade|criancas?|infantil|bebes?|mulheres?|homens?|gamers?|pets?|donos de pets?)\b/);
  const budgetMatch = value.match(/(?:r\$\s*)?([0-9]{2,6}(?:[.,][0-9]{1,2})?)/i);
  const niche = NICHES.find(item => normalized.includes(normalizeSearch(item.name)));
  return {
    ...current,
    audience: audienceMatch?.[0] || current.audience,
    budget: budgetMatch?.[1] ? `R$ ${budgetMatch[1]}` : current.budget,
    niches: niche && !current.niches.includes(niche.name) ? [...current.niches, niche.name].slice(-8) : current.niches
  };
}

function recommendationReason(product: Product, query: string) {
  const profit = Math.max(0, product.salePrice - product.costPrice);
  const margin = product.costPrice > 0 ? Math.round((profit / product.costPrice) * 100) : 0;
  const signals = [`margem estimada de ${margin}%`];
  if (product.ordersCount) signals.push(`${product.ordersCount} vendas registradas`);
  if (product.rating) signals.push(`avaliação ${product.rating.toFixed(1)}`);
  const risk = product.stockQuantity === 0 ? 'sem estoque' : product.stockQuantity && product.stockQuantity < 10 ? 'estoque baixo' : 'estoque a confirmar antes de publicar';
  return `${query ? `Relacionado a “${query}” e com ` : ''}${signals.join(', ')}. Atenção: ${risk}.`;
}

export default function SiaAssistant({
  products,
  currentStore,
  storesCount,
  accountName,
  onCreateStore,
  onToggleProduct,
  onUpdateProductPrice,
  onNavigate,
  onPreviewStore,
  onUpdateStoreConfig,
  onImportProduct,
  onPublishStore,
  onBuildStoreHtml
}: SiaAssistantProps) {
  const currentStoreConversationKey = `store:${currentStore.id || normalizeSearch(currentStore.name) || 'current'}`;
  const savedFlow = useMemo(() => readFlow(), []);
  const [assistantMode, setAssistantMode] = useState<AssistantMode>('current');
  const [messages, setMessages] = useState<ChatMessage[]>(() => readMessages(accountName, currentStoreConversationKey));
  const [memory, setMemory] = useState<NalaMemory>(() => readMemory());
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [flowStep, setFlowStep] = useState<StoreFlowStep>(savedFlow.step);
  const [recommendationNicheId, setRecommendationNicheId] = useState(() => savedFlow.recommendationNicheId || NICHES.find(niche => niche.name === currentStore.niche)?.id || NICHES[0].id);
  const [draft, setDraft] = useState<SiaStoreDraft>(savedFlow.draft);
  const [showRecommendations, setShowRecommendations] = useState(savedFlow.showRecommendations);
  const [recommendationQuery, setRecommendationQuery] = useState(savedFlow.recommendationQuery);
  const [recommendationProductIds, setRecommendationProductIds] = useState<string[]>(savedFlow.recommendationProductIds);
  const [guidedProductLimit, setGuidedProductLimit] = useState(8);
  const [composerFocused, setComposerFocused] = useState(false);
  const [commandMenuOpen, setCommandMenuOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const [priceEditorProductId, setPriceEditorProductId] = useState('');
  const [priceInput, setPriceInput] = useState('');
  const [showStorePreview, setShowStorePreview] = useState(false);
  const [creativeMode, setCreativeMode] = useState<'choose' | VideoFormat | null>(null);
  const [creativeProductId, setCreativeProductId] = useState('');
  const [reelVideoFile, setReelVideoFile] = useState<File | null>(null);
  const [reelVideoPreview, setReelVideoPreview] = useState('');
  const [reelProfileImage, setReelProfileImage] = useState(currentStore.logoUrl || '');
  const [reelGenerating, setReelGenerating] = useState(false);
  const [reelProgress, setReelProgress] = useState(0);
  const [reelError, setReelError] = useState('');
  const [reelVariants, setReelVariants] = useState<ReelTextVariant[]>([]);
  const [generatedReels, setGeneratedReels] = useState<GeneratedProductReel[]>([]);
  const [marketplaceImportUrl, setMarketplaceImportUrl] = useState('');
  const [marketplaceImportToken, setMarketplaceImportToken] = useState(0);
  const [processingStage, setProcessingStage] = useState('Analisando contexto');
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const conversationKey = assistantMode === 'current' ? currentStoreConversationKey : 'new-store';
  const lastConversationKeyRef = useRef(conversationKey);
  const skipNextConversationSaveRef = useRef(false);
  const postCreateHandoffRef = useRef<{ storeName: string; productCount: number } | null>(null);

  const activeNicheId = draft.nicheId || recommendationNicheId;
  const activeNiche = NICHES.find(niche => niche.id === activeNicheId) || NICHES[0];
  const guidedStepIndex = GUIDED_FLOW_STEPS.findIndex(step => step.id === flowStep);
  const recommendedProducts = useMemo(() => {
    if (recommendationProductIds.length) {
      const byId = new Map(products.map(product => [product.id, product]));
      return recommendationProductIds.map(id => byId.get(id)).filter((product): product is Product => Boolean(product) && !memory.rejectedProductIds.includes(product.id)).slice(0, guidedProductLimit);
    }
    if (recommendationQuery.trim()) {
      return rankProductsForQuery(products, recommendationQuery, activeNicheId).filter(product => !memory.rejectedProductIds.includes(product.id)).slice(0, guidedProductLimit);
    }
    const category = categoryByNiche[activeNicheId];
    return products
      .filter(product => product.category === category)
      .filter(product => !memory.rejectedProductIds.includes(product.id))
      .filter(product => product.stockQuantity === undefined || product.stockQuantity > 0)
      .sort((a, b) => recommendationScore(b) - recommendationScore(a))
      .slice(0, guidedProductLimit);
  }, [activeNicheId, guidedProductLimit, memory.rejectedProductIds, products, recommendationProductIds, recommendationQuery]);

  useEffect(() => {
    if (lastConversationKeyRef.current === conversationKey) return;
    saveMessages(lastConversationKeyRef.current, messages);
    skipNextConversationSaveRef.current = true;
    lastConversationKeyRef.current = conversationKey;
    const handoff = postCreateHandoffRef.current;
    if (handoff) {
      postCreateHandoffRef.current = null;
      setMessages([makeMessage('assistant', `A loja “${handoff.storeName}” foi criada com ${handoff.productCount} produtos. O que você gostaria de fazer agora?`)]);
      setFlowStep('done');
      setShowRecommendations(false);
      setRecommendationQuery('');
      setRecommendationProductIds([]);
      return;
    }
    setMessages(readMessages(accountName, conversationKey));
    setFlowStep('idle');
    setShowRecommendations(false);
    setRecommendationQuery('');
    setRecommendationProductIds([]);
  }, [accountName, conversationKey]);

  useEffect(() => {
    if (skipNextConversationSaveRef.current) {
      skipNextConversationSaveRef.current = false;
      return;
    }
    saveMessages(conversationKey, messages);
    const shouldShowWelcome = messages.length === 1 && flowStep === 'idle' && !showRecommendations;
    scrollRef.current?.scrollTo({
      top: shouldShowWelcome ? 0 : scrollRef.current.scrollHeight,
      behavior: shouldShowWelcome ? 'auto' : 'smooth'
    });
  }, [conversationKey, messages, flowStep, showRecommendations]);

  useEffect(() => {
    window.localStorage.setItem(MEMORY_STORAGE_KEY, JSON.stringify(memory));
  }, [memory]);

  useEffect(() => {
    window.localStorage.setItem(FLOW_STORAGE_KEY, JSON.stringify({
      step: flowStep,
      draft,
      showRecommendations,
      recommendationNicheId,
      recommendationQuery,
      recommendationProductIds
    }));
  }, [draft, flowStep, recommendationNicheId, recommendationProductIds, recommendationQuery, showRecommendations]);

  const addAssistantMessage = (content: string) => {
    setMessages(current => [...current, makeMessage('assistant', content)]);
  };

  const startStoreFlow = () => {
    setShowRecommendations(false);
    setRecommendationQuery('');
    setRecommendationProductIds([]);
    setDraft(emptyDraft());
    setGuidedProductLimit(8);
    setFlowStep('niche');
    addAssistantMessage('Vamos montar sua loja em sete etapas rápidas. Primeiro, escolha o tipo de produto que combina mais com você.');
  };

  const selectNiche = (nicheId: string) => {
    const niche = NICHES.find(item => item.id === nicheId) || NICHES[0];
    setDraft(current => ({ ...current, nicheId, productIds: [] }));
    setRecommendationNicheId(nicheId);
    setRecommendationQuery('');
    setRecommendationProductIds([]);
    setGuidedProductLimit(8);
    setFlowStep('audience');
    addAssistantMessage(`Boa escolha: ${niche.name}. Para quem você quer vender? Escolha uma opção ou descreva o público com suas palavras.`);
  };

  const selectAudience = (audience: string) => {
    setMemory(current => ({ ...current, audience }));
    setFlowStep('name');
    addAssistantMessage(`Público definido: ${audience}. Agora me diga qual será o nome da loja.`);
  };

  const leaveGuidedFlow = () => {
    setFlowStep('idle');
    setDraft(emptyDraft());
    setShowRecommendations(false);
    addAssistantMessage('Modo guiado encerrado. Podemos continuar conversando ou começar novamente quando você quiser.');
  };

  const goBackGuidedFlow = () => {
    const previousByStep: Partial<Record<StoreFlowStep, StoreFlowStep>> = {
      audience: 'niche', name: 'audience', whatsapp: 'name',
      theme: 'whatsapp', products: 'theme', review: 'products'
    };
    const previous = previousByStep[flowStep];
    if (previous) setFlowStep(previous);
  };

  const skipGuidedStep = () => {
    if (flowStep === 'audience') {
      setFlowStep('name');
      addAssistantMessage('Sem problema. Podemos definir o público depois. Qual será o nome da loja?');
    }
  };

  const chooseTheme = (themeId: NonNullable<StoreConfig['themePreset']>) => {
    const theme = themeOptions.find(option => option.id === themeId) || themeOptions[0];
    const nicheCategory = categoryByNiche[activeNicheId];
    const stableProductIds = products
      .filter(product => product.category === nicheCategory)
      .filter(product => !memory.rejectedProductIds.includes(product.id))
      .filter(product => product.stockQuantity === undefined || product.stockQuantity > 0)
      .sort((a, b) => recommendationScore(b) - recommendationScore(a))
      .map(product => product.id);
    const suggestedIds = stableProductIds.slice(0, 5);
    setRecommendationProductIds(stableProductIds);
    setDraft(current => ({
      ...current,
      themePreset: theme.id,
      primaryColor: theme.color,
      productIds: suggestedIds
    }));
    setFlowStep('products');
    addAssistantMessage(`Visual ${theme.name} selecionado. Separei os produtos mais promissores desse nicho; você pode ajustar a seleção.`);
  };

  const toggleDraftProduct = (productId: string) => {
    setDraft(current => ({
      ...current,
      productIds: current.productIds.includes(productId)
        ? current.productIds.filter(id => id !== productId)
        : [...current.productIds, productId]
    }));
  };

  const submitWorkflowText = (value: string) => {
    if (flowStep === 'audience') {
      selectAudience(value);
      return true;
    }

    if (flowStep === 'name') {
      if (value.length < 2) {
        addAssistantMessage('Digite um nome com pelo menos 2 caracteres.');
        return true;
      }
      setDraft(current => ({ ...current, name: value }));
      setFlowStep('whatsapp');
      addAssistantMessage(`Gostei de “${value}”. Qual WhatsApp receberá os pedidos? Use DDI + DDD + número.`);
      return true;
    }

    if (flowStep === 'whatsapp') {
      const whatsapp = value.replace(/\D/g, '');
      if (whatsapp.length < 10 || whatsapp.length > 13) {
        addAssistantMessage('Esse número parece incompleto. Exemplo: 5511999999999.');
        return true;
      }
      setDraft(current => ({ ...current, whatsapp }));
      setFlowStep('theme');
      addAssistantMessage('Agora escolha o estilo visual. Todos são responsivos e você poderá editar depois.');
      return true;
    }

    return false;
  };

  const askNala = async (value: string, nextMessages: ChatMessage[]) => {
    setLoading(true);
    setProcessingStage('Analisando contexto e preferências');
    try {
      const memoryForRequest = updateMemoryFromText(memory, value);
      setMemory(memoryForRequest);
      const contextualProducts = rankProductsForQuery(products, value, inferNicheId(value, recommendationNicheId))
        .filter(product => !memoryForRequest.rejectedProductIds.includes(product.id));
      const candidateProducts = contextualProducts.slice(0, 16);
      const topProducts = candidateProducts.map(product => ({
        id: product.id,
        name: product.name,
        category: product.category,
        subcategory: product.subcategory,
        supplier: product.supplier,
        costPrice: product.costPrice,
        salePrice: product.salePrice
      }));
      const requestBody = JSON.stringify({
          messages: nextMessages.slice(-12).map(message => ({ role: message.role, content: message.content })),
          context: {
            assistantMode,
            memory: memoryForRequest,
            currentStore: {
              name: currentStore.name,
              niche: currentStore.niche,
              productCount: currentStore.productIds?.length || 0,
              status: currentStore.status || 'draft'
            },
            catalogSize: products.length,
            productCandidatesAreContextual: contextualProducts.length > 0,
            topProducts
          }
        });
      let payload: Record<string, any> = {};
      for (let attempt = 0; attempt < 2; attempt += 1) {
        setProcessingStage(attempt === 0 ? 'Consultando a Ayla' : 'Reconectando automaticamente');
        const response = await fetch('/api/assistant/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: requestBody
        });
        const nextPayload = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(nextPayload.error || 'A Ayla não respondeu agora.');
        payload = nextPayload;
        if (!nextPayload.degraded || attempt === 1) break;
        await new Promise(resolve => window.setTimeout(resolve, 700));
      }
      setMessages(current => [...current, makeMessage('assistant', payload.reply || 'Não consegui responder agora. Tente novamente em instantes.')]);
      if (payload.showProducts === true) {
        const validIds = Array.isArray(payload.productIds)
          ? payload.productIds.filter((id: unknown): id is string => typeof id === 'string' && candidateProducts.some(product => product.id === id)).slice(0, 8)
          : [];
        const nextQuery = String(payload.productQuery || value).trim();
        setRecommendationQuery(nextQuery);
        setRecommendationProductIds(validIds.length ? validIds : candidateProducts.slice(0, 8).map(product => product.id));
        setRecommendationNicheId(inferNicheId(nextQuery, recommendationNicheId));
        setShowRecommendations(true);
        setFlowStep('idle');
      } else {
        setShowRecommendations(false);
        setRecommendationProductIds([]);
      }
    } catch {
      setMessages(current => [...current, makeMessage('assistant', 'Estou sem conexão com o serviço de respostas, mas o criador de lojas e as recomendações continuam disponíveis.')]);
    } finally {
      setLoading(false);
    }
  };

  const submitPrompt = (rawValue: string) => {
    const value = rawValue.trim();
    if (!value || loading) return;
    const userMessage = makeMessage('user', value);
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput('');
    setCommandMenuOpen(false);

    if (submitWorkflowText(value)) return;
    const pastedMarketplaceUrl = value.match(/https?:\/\/[^\s]+/i)?.[0] || '';
    const hasMarketplaceUrl = /(?:mercadolivre|mercadolivre\.com|meli\.la|shopee|shp\.ee)/i.test(pastedMarketplaceUrl);
    const requestsMarketplaceImport = /(?:adicionar|colocar|importar|por|trazer|cadastrar|quero).{0,40}(?:produto|item).{0,40}(?:mercado livre|mercadolivre|\bml\b|shopee)|(?:mercado livre|mercadolivre|\bml\b|shopee).{0,40}(?:produto|item|adicionar|importar)/i.test(value);
    if (assistantMode === 'current' && (hasMarketplaceUrl || requestsMarketplaceImport)) {
      setMarketplaceImportUrl(hasMarketplaceUrl ? pastedMarketplaceUrl : '');
      setMarketplaceImportToken(current => current + 1);
      setMessages(current => [...current, makeMessage('assistant', hasMarketplaceUrl
        ? 'Abri o importador com o link preenchido. Gere a prévia, revise as informações e confirme para adicionar o produto à loja atual.'
        : 'Claro. Abri o importador da Storefy; cole o link do Mercado Livre ou da Shopee para gerar a prévia antes de adicionar.')]);
      return;
    }
    if (/criar|montar|nova loja/i.test(value) && /loja|vitrine/i.test(value)) {
      startStoreFlow();
      return;
    }
    if (assistantMode === 'current' && /(?:ver|mostrar|mostre|abrir|visualizar|preview|prévia|previa|conferir).{0,24}(?:loja|vitrine)|(?:loja|vitrine).{0,24}(?:ver|mostrar|mostre|abrir|visualizar|preview|prévia|previa|conferir)/i.test(value)) {
      setShowRecommendations(false);
      setRecommendationProductIds([]);
      setShowStorePreview(true);
      setMessages(current => [...current, makeMessage('assistant', 'Claro. Preparei uma prévia da sua loja atual com os produtos e o visual que estão salvos agora.')]);
      return;
    }
    if (assistantMode === 'current' && /(?:criar|gerar|fazer|produzir|quero).{0,32}(?:reel|vídeo|video|criativo|influencer)|(?:reel|vídeo|video|criativo|influencer).{0,32}(?:criar|gerar|fazer|produzir|quero)/i.test(value)) {
      const nextCreativeMode: 'choose' | VideoFormat = /influencer|modelo|persona/i.test(value)
        ? 'caption'
        : /reel|viral|moldura/i.test(value) ? 'frame' : 'choose';
      setShowRecommendations(false);
      setShowStorePreview(false);
      setCreativeMode(nextCreativeMode);
      setMessages(current => [...current, makeMessage('assistant', nextCreativeMode === 'caption'
        ? 'Vamos criar com uma influencer IA. Escolha o produto e a persona para eu montar o criativo.'
        : nextCreativeMode === 'frame'
          ? 'Vamos criar um Reel. Escolha o produto e uma base viral para gerar o vídeo.'
          : 'Perfeito. Escolha se você quer um Reel de moldura ou um vídeo com influencer IA.')]);
      return;
    }
    void askNala(value, nextMessages);
  };

  const sendMessage = () => {
    submitPrompt(input);
  };

  const showProductRecommendations = () => {
    setFlowStep('idle');
    setRecommendationQuery('');
    setRecommendationProductIds([]);
    setShowRecommendations(true);
    addAssistantMessage(`Separei oportunidades de ${activeNiche.name} usando margem, estoque, avaliação e vendas disponíveis no catálogo.`);
  };

  const finishProductSelection = () => {
    if (!draft.productIds.length) {
      addAssistantMessage('Selecione pelo menos um produto para a primeira versão da loja.');
      return;
    }
    setFlowStep('review');
    addAssistantMessage('Tudo pronto. Confira o resumo antes de eu salvar a nova loja na sua conta.');
  };

  const createStore = () => {
    const niche = NICHES.find(item => item.id === draft.nicheId) || NICHES[0];
    postCreateHandoffRef.current = { storeName: draft.name, productCount: draft.productIds.length };
    onCreateStore({ ...draft, nicheName: niche.name });
    setFlowStep('done');
  };

  const resetConversation = () => {
    const fresh = initialMessages(accountName);
    setMessages(fresh);
    setFlowStep('idle');
    setDraft(emptyDraft());
    setShowRecommendations(false);
    setRecommendationQuery('');
    setRecommendationProductIds([]);
    setInput('');
    setCommandMenuOpen(false);
  };

  const rejectProduct = (product: Product) => {
    setMemory(current => ({
      ...current,
      rejectedProductIds: Array.from(new Set([...current.rejectedProductIds, product.id])).slice(-50)
    }));
    setRecommendationProductIds(current => current.filter(id => id !== product.id));
    addAssistantMessage(`Entendido. Não vou recomendar “${product.name}” novamente nesta conta.`);
  };

  const confirmPendingAction = () => {
    if (!pendingAction) return;
    if (pendingAction.type === 'add-product') {
      onToggleProduct(pendingAction.productId);
      addAssistantMessage(`“${pendingAction.title}” foi adicionado à loja atual.`);
    } else if (pendingAction.type === 'update-price') {
      onUpdateProductPrice(pendingAction.productId, pendingAction.price);
      addAssistantMessage(`Preço de “${pendingAction.title}” atualizado para ${formatCurrency(pendingAction.price)}.`);
    } else {
      onNavigate(pendingAction.page);
    }
    setPendingAction(null);
    setPriceEditorProductId('');
    setPriceInput('');
  };

  const toggleVoice = () => {
    if (listening) {
      recognitionRef.current?.stop?.();
      recognitionRef.current = null;
      setListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      addAssistantMessage('A entrada por voz não está disponível neste navegador. Você pode continuar digitando normalmente.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results || [])
        .map((result: any) => result?.[0]?.transcript || '')
        .join(' ')
        .trim();
      if (transcript) setInput(transcript);
    };
    recognition.onend = () => {
      recognitionRef.current = null;
      setListening(false);
    };
    recognition.onerror = () => {
      recognitionRef.current = null;
      setListening(false);
    };
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  const selectedProducts = recommendedProducts.filter(product => draft.productIds.includes(product.id));
  const currentStoreProducts = products.filter(product => currentStore.productIds?.includes(product.id));
  const creativeProducts = products.map(product => ({
    ...product,
    addedToStore: Boolean(currentStore.productIds?.includes(product.id))
  }));
  const chooseCreativeProduct = (productId: string) => {
    setCreativeProductId(productId);
    const product = products.find(item => item.id === productId);
    if (!product) return;
    onUpdateStoreConfig({
      ...currentStore,
      videoCta: `${product.name}: veja o valor na vitrine e chame no WhatsApp`
    });
  };
  const clearGeneratedReels = () => {
    generatedReels.forEach(reel => URL.revokeObjectURL(reel.url));
    setGeneratedReels([]);
  };
  const closeCreativeStudio = () => {
    clearGeneratedReels();
    if (reelVideoPreview) URL.revokeObjectURL(reelVideoPreview);
    if (reelProfileImage.startsWith('blob:')) URL.revokeObjectURL(reelProfileImage);
    setReelVideoFile(null);
    setReelVideoPreview('');
    setReelProfileImage(currentStore.logoUrl || '');
    setReelVariants([]);
    setReelError('');
    setCreativeMode(null);
  };
  const selectReelVideo = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith('video/')) {
      setReelError('Escolha um arquivo de vídeo válido.');
      return;
    }
    if (file.size > 150 * 1024 * 1024) {
      setReelError('O vídeo deve ter no máximo 150 MB.');
      return;
    }
    if (reelVideoPreview) URL.revokeObjectURL(reelVideoPreview);
    clearGeneratedReels();
    setReelVideoFile(file);
    setReelVideoPreview(URL.createObjectURL(file));
    setReelVariants([]);
    setReelError('');
  };
  const selectReelProfileImage = (file?: File) => {
    if (!file || !file.type.startsWith('image/')) {
      setReelError('Escolha uma foto de perfil válida.');
      return;
    }
    if (reelProfileImage.startsWith('blob:')) URL.revokeObjectURL(reelProfileImage);
    setReelProfileImage(URL.createObjectURL(file));
    clearGeneratedReels();
    setReelError('');
  };
  const generateFiveProductReels = async () => {
    const product = products.find(item => item.id === creativeProductId);
    if (!product) {
      setReelError('Escolha o produto que aparece no vídeo.');
      return;
    }
    if (!reelVideoFile) {
      setReelError('Envie o vídeo original do produto.');
      return;
    }
    clearGeneratedReels();
    setReelGenerating(true);
    setReelProgress(2);
    setReelError('');
    try {
      let variants = createLocalReelVariants(product.name, currentStore.name);
      const captionController = new AbortController();
      const captionTimeout = window.setTimeout(() => captionController.abort(), 9000);
      try {
        const response = await fetch('/api/assistant/reel-captions', {
          method: 'POST',
          signal: captionController.signal,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            product: { name: product.name, description: product.descriptionText || '', price: product.salePrice },
            store: { name: currentStore.name, niche: currentStore.niche }
          })
        });
        const payload = await response.json().catch(() => ({}));
        if (response.ok && Array.isArray(payload.variants) && payload.variants.length === 5) {
          const validVariants = payload.variants
            .map((item: ReelTextVariant) => ({ hook: String(item?.hook || '').trim(), cta: String(item?.cta || '').trim() }))
            .filter((item: ReelTextVariant) => item.hook && item.cta);
          if (validVariants.length === 5) variants = validVariants;
        }
      } catch {
        // The local variants keep Reel creation available when the AI service is offline.
      } finally {
        window.clearTimeout(captionTimeout);
      }
      setReelVariants(variants);
      setReelProgress(8);
      const reels = await generateProductReels({
        videoFile: reelVideoFile,
        variants,
        productName: product.name,
        profileName: currentStore.name,
        profileHandle: currentStore.profileHandle || `@${normalizeSearch(currentStore.name).replace(/\s+/g, '')}`,
        profileImageUrl: reelProfileImage,
        accent: currentStore.primaryColor || '#dfb52d',
        onProgress: value => setReelProgress(Math.max(8, value))
      });
      setGeneratedReels(reels);
      addAssistantMessage('Seus cinco Reels estão prontos. Cada versão usa o mesmo vídeo com um gancho e CTA diferentes.');
    } catch (error) {
      setReelError(error instanceof Error ? error.message : 'Não foi possível gerar os Reels agora.');
    } finally {
      setReelGenerating(false);
    }
  };
  const estimatedProfit = selectedProducts.reduce((sum, product) => sum + Math.max(0, product.salePrice - product.costPrice), 0);
  const operationInsight = useMemo(() => {
    const productCount = currentStore.productIds?.length || 0;
    if (!productCount) return { title: 'Sua vitrine ainda não tem produtos', body: 'Adicionar uma seleção inicial é o passo com maior impacto agora.', page: 'products', action: 'Escolher produtos' };
    if (!currentStore.whatsapp) return { title: 'Pedidos sem destino configurado', body: 'Defina o WhatsApp antes de divulgar para não perder contatos.', page: 'operation', action: 'Configurar WhatsApp' };
    if (currentStore.status !== 'published') return { title: 'A loja está pronta para uma revisão final', body: `${productCount} produtos selecionados. Revise a vitrine antes de publicar.`, page: 'shop-preview', action: 'Revisar vitrine' };
    return { title: 'Operação publicada', body: 'O próximo ganho deve vir de divulgação e testes de oferta.', page: 'promotion', action: 'Planejar divulgação' };
  }, [currentStore.productIds, currentStore.status, currentStore.whatsapp]);

  return (
    <section className="relative mx-auto flex h-[calc(100vh-105px)] min-h-[560px] max-w-[1500px] overflow-hidden bg-[#f7f7f8]">
      <MarketplaceImporter
        hideTrigger
        initialUrl={marketplaceImportUrl}
        autoOpenToken={marketplaceImportToken}
        onImportProduct={product => {
          const target = flowStep === 'products' ? 'draft' : 'current';
          const productId = onImportProduct(product, target);
          if (target === 'draft') {
            setDraft(current => ({ ...current, productIds: Array.from(new Set([...current.productIds, productId])) }));
            setRecommendationProductIds(current => [productId, ...current.filter(id => id !== productId)]);
          }
          setMessages(current => [...current, makeMessage('assistant', target === 'draft'
            ? `“${product.name}” foi importado, recebeu margem de ${product.marginPercent}% e entrou na seleção da nova loja.`
            : `“${product.name}” foi importado e adicionado à loja atual com margem de ${product.marginPercent}%.`)]);
        }}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 pb-44 pt-5 sm:px-6 sm:pb-48">
          <div className="mx-auto max-w-5xl space-y-7">
            {messages.length === 1 && flowStep === 'idle' && !showRecommendations && (
              <div className="mx-auto max-w-3xl pb-3 pt-5 text-center sm:pt-9">
                <p className="flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.16em] text-amber-700"><span className="h-px w-7 bg-amber-400" /> Inteligência comercial Storefy <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /></p>
                <h2 className="mt-3 text-2xl font-black tracking-normal text-gray-950 sm:text-4xl">O que vamos colocar para vender hoje?</h2>
                <p className="mx-auto mt-3 max-w-xl text-xs leading-relaxed text-gray-500 sm:text-sm">Converse naturalmente. Eu encontro oportunidades, comparo margens, estruturo sua vitrine e salvo a loja na sua conta.</p>
              </div>
            )}
            {messages.map(message => (
              <div key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'} ${messages.length === 1 ? 'hidden' : ''}`}>
                {message.role === 'assistant' && (
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-amber-200 bg-amber-50 text-amber-600"><Sparkles size={14} /></span>
                )}
                <div className={message.role === 'user'
                  ? 'max-w-[82%] rounded-lg bg-[#111318] px-4 py-3 text-[13px] leading-relaxed text-white'
                  : 'max-w-[86%] px-1 py-1 text-[13px] leading-6 text-gray-700'}>
                  {message.content}
                </div>
              </div>
            ))}

            {showStorePreview && assistantMode === 'current' && (
              <div className="overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-[0_18px_55px_rgba(29,35,48,0.10)]">
                <div className="relative min-h-48 overflow-hidden bg-[#111318] px-6 py-6 text-white">
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-300 via-[#dfb52d] to-emerald-400" />
                  <div className="relative z-10 flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-amber-300">Prévia da vitrine</p>
                      <h3 className="mt-2 truncate text-2xl font-black">{currentStore.name}</h3>
                      <p className="mt-1 text-xs text-gray-300">{currentStore.niche || 'Loja Storefy'} · {currentStoreProducts.length} {currentStoreProducts.length === 1 ? 'produto' : 'produtos'}</p>
                    </div>
                    <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-bold text-white">{currentStore.status === 'published' ? 'Publicada' : 'Rascunho'}</span>
                  </div>
                  <div className="relative z-10 mt-6 flex gap-3">
                    {currentStoreProducts.slice(0, 4).map(product => (
                      <div key={product.id} className="h-20 w-20 overflow-hidden rounded-xl border border-white/10 bg-white p-2 shadow-lg">
                        <img src={product.imageUrl} alt="" loading="lazy" className="h-full w-full object-contain" />
                      </div>
                    ))}
                    {!currentStoreProducts.length && (
                      <div className="flex h-20 flex-1 items-center rounded-xl border border-dashed border-white/20 bg-white/5 px-4 text-xs text-gray-300">A vitrine ainda não possui produtos selecionados.</div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <strong className="text-sm text-gray-950">Veja como seus clientes verão a loja</strong>
                    <p className="mt-1 text-[11px] text-gray-500">O preview abre com layout, produtos, preços e checkout atualizados.</p>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setShowStorePreview(false)} className="rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-bold text-gray-600">Fechar</button>
                    <button type="button" onClick={onPreviewStore} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#dfb52d] px-4 py-2.5 text-xs font-black text-gray-950 shadow-sm transition hover:bg-[#cfa51e]">Abrir preview <ArrowRight size={14} /></button>
                  </div>
                </div>
              </div>
            )}

            {creativeMode && assistantMode === 'current' && (
              <div className="overflow-hidden rounded-2xl border border-amber-200 bg-[#f4f4f5] shadow-[0_18px_55px_rgba(29,35,48,0.10)]">
                <div className="flex flex-col gap-4 border-b border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#111318] text-amber-300"><Film size={18} /></span>
                    <div><p className="text-[10px] font-black uppercase tracking-[0.14em] text-amber-700">Ayla Creative</p><strong className="text-sm text-gray-950">Crie sem sair da conversa</strong></div>
                  </div>
                  <button type="button" onClick={closeCreativeStudio} className="self-start rounded-lg border border-gray-200 px-3 py-2 text-[11px] font-bold text-gray-600 sm:self-auto">Fechar</button>
                </div>

                {creativeMode === 'choose' ? (
                  <div className="grid gap-3 p-4 sm:grid-cols-2">
                    <button type="button" onClick={() => setCreativeMode('frame')} className="group overflow-hidden rounded-2xl border border-gray-200 bg-white text-left transition hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md">
                      <div className="relative aspect-[16/8] overflow-hidden bg-[#172033]">
                        <video src="/videos/viral/viral-01.mp4" autoPlay loop muted playsInline preload="metadata" className="h-full w-full object-cover opacity-75" />
                        <span className="absolute inset-0 grid place-items-center"><span className="rounded-xl bg-black/65 px-4 py-2 text-sm font-black text-white">Reel viral</span></span>
                      </div>
                      <div className="p-4"><strong className="text-sm text-gray-950">Reels de produto</strong><p className="mt-1 text-xs text-gray-500">Envie um vídeo e receba cinco variações prontas.</p></div>
                    </button>
                    <button type="button" onClick={() => setCreativeMode('caption')} className="group overflow-hidden rounded-2xl border border-gray-200 bg-white text-left transition hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md">
                      <div className="relative aspect-[16/8] overflow-hidden bg-[#37223d]"><img src="/images/influencers/clara-ia.jpg" alt="Influencer IA" className="h-full w-full object-cover object-top opacity-80" /><span className="absolute inset-0 grid place-items-center"><span className="rounded-xl bg-black/65 px-4 py-2 text-sm font-black text-white">Influencer IA</span></span></div>
                      <div className="p-4"><strong className="text-sm text-gray-950">Vídeo com influencer</strong><p className="mt-1 text-xs text-gray-500">Persona digital com mensagem da sua oferta.</p></div>
                    </button>
                  </div>
                ) : (
                  <div className="p-3 sm:p-4">
                    <div className="mb-3 rounded-xl border border-gray-200 bg-white p-3">
                      <label htmlFor="nala-creative-product" className="text-[10px] font-black uppercase tracking-[0.1em] text-gray-500">Produto do criativo</label>
                      <select id="nala-creative-product" value={creativeProductId} onChange={event => chooseCreativeProduct(event.target.value)} className="mt-2 h-10 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-xs font-semibold text-gray-800 outline-none focus:border-amber-400">
                        <option value="">Oferta geral da loja</option>
                        {currentStoreProducts.map(product => <option key={product.id} value={product.id}>{product.name}</option>)}
                      </select>
                      <p className="mt-2 text-[10px] text-gray-500">A Ayla usa o produto escolhido para preparar automaticamente a chamada do vídeo.</p>
                      {creativeMode === 'frame' && (
                        <div className="mt-3 flex items-center gap-3 border-t border-gray-100 pt-3">
                          <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full bg-amber-200 text-xs font-black text-gray-900">
                            {reelProfileImage ? <img src={reelProfileImage} alt="Foto do perfil" className="h-full w-full object-cover" /> : currentStore.name.slice(0, 1).toUpperCase()}
                          </span>
                          <div className="min-w-0 flex-1"><strong className="block truncate text-xs text-gray-900">{currentStore.name}</strong><span className="text-[10px] text-gray-500">{currentStore.profileHandle || `@${normalizeSearch(currentStore.name).replace(/\s+/g, '')}`}</span></div>
                          <label className="cursor-pointer rounded-lg border border-gray-200 px-3 py-2 text-[10px] font-bold text-gray-700 hover:bg-gray-50">Trocar foto<input type="file" accept="image/*" onChange={event => selectReelProfileImage(event.target.files?.[0])} className="hidden" /></label>
                        </div>
                      )}
                    </div>
                    {creativeMode === 'frame' ? (
                      <div className="space-y-4">
                        <label className="block cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed border-gray-300 bg-white transition hover:border-amber-400 hover:bg-amber-50/30">
                          {reelVideoPreview ? (
                            <div className="grid gap-4 p-4 sm:grid-cols-[160px_1fr] sm:items-center">
                              <video src={reelVideoPreview} controls muted playsInline className="aspect-[9/16] w-full rounded-xl bg-black object-contain" />
                              <div><strong className="text-sm text-gray-950">Vídeo do produto carregado</strong><p className="mt-1 text-xs text-gray-500">{reelVideoFile?.name}</p><span className="mt-3 inline-flex rounded-lg border border-gray-200 px-3 py-2 text-[11px] font-bold text-gray-700">Trocar vídeo</span></div>
                            </div>
                          ) : (
                            <div className="flex min-h-40 flex-col items-center justify-center p-6 text-center">
                              <Film size={25} className="text-amber-600" />
                              <strong className="mt-3 text-sm text-gray-950">Envie o vídeo original do produto</strong>
                              <p className="mt-1 max-w-sm text-xs leading-relaxed text-gray-500">A Storefy mantém o vídeo no centro e adiciona o perfil, a frase e o CTA nas faixas brancas.</p>
                              <span className="mt-4 rounded-xl bg-[#111318] px-4 py-2.5 text-xs font-black text-white">Escolher vídeo</span>
                            </div>
                          )}
                          <input type="file" accept="video/*" onChange={event => selectReelVideo(event.target.files?.[0])} className="hidden" />
                        </label>

                        {reelVariants.length > 0 && (
                          <div className="grid gap-2 sm:grid-cols-5">
                            {reelVariants.map((variant, index) => <div key={`${variant.hook}-${index}`} className="rounded-xl border border-gray-200 bg-white p-3"><span className="text-[9px] font-black uppercase text-amber-700">Variação {index + 1}</span><p className="mt-1 text-[11px] font-bold leading-snug text-gray-800">{variant.hook}</p></div>)}
                          </div>
                        )}

                        {reelGenerating && (
                          <div className="rounded-xl border border-amber-200 bg-white p-4">
                            <div className="flex items-center justify-between text-xs"><span className="flex items-center gap-2 font-bold text-gray-800"><LoaderCircle size={14} className="animate-spin text-amber-600" /> Gerando cinco Reels</span><b>{reelProgress}%</b></div>
                            <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100"><div className="h-full rounded-full bg-[#dfb52d] transition-all" style={{ width: `${reelProgress}%` }} /></div>
                            <p className="mt-2 text-[10px] text-gray-500">O mesmo vídeo está sendo renderizado com cinco textos diferentes.</p>
                          </div>
                        )}

                        {reelError && <p className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700">{reelError}</p>}

                        {!generatedReels.length && (
                          <button type="button" onClick={() => void generateFiveProductReels()} disabled={reelGenerating} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#111318] text-xs font-black text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"><Sparkles size={15} /> {reelGenerating ? 'Gerando variações...' : 'Gerar 5 Reels com a Ayla'}</button>
                        )}

                        {generatedReels.length > 0 && (
                          <div>
                            <div className="mb-3 flex items-center justify-between"><div><strong className="text-sm text-gray-950">Cinco Reels prontos</strong><p className="mt-0.5 text-[11px] text-gray-500">Visualize e baixe cada variação.</p></div><button type="button" onClick={() => void generateFiveProductReels()} className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-[10px] font-bold text-gray-700">Gerar novamente</button></div>
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                              {generatedReels.map((reel, index) => (
                                <article key={reel.id} className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                                  <video src={reel.url} controls playsInline preload="metadata" className="aspect-[9/16] w-full bg-black object-contain" />
                                  <div className="p-3"><p className="line-clamp-2 min-h-8 text-[10px] font-bold leading-snug text-gray-800">{reel.hook}</p><button type="button" onClick={() => downloadBlob(reel.fileName, reel.blob, reel.blob.type)} className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#111318] px-2 py-2 text-[10px] font-black text-white"><Download size={12} /> Baixar Reel {index + 1}</button></div>
                                </article>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div key={`${creativeMode}-${creativeProductId}`}>
                        <OperationStudio
                          mode="videos"
                          embedded
                          initialVideoFormat="caption"
                          products={creativeProducts}
                          storeConfig={currentStore}
                          onUpdateStoreConfig={onUpdateStoreConfig}
                          onToggleAddProduct={onToggleProduct}
                          onOpenSection={onNavigate}
                          onPreview={onPreviewStore}
                          onPublish={onPublishStore}
                          onBuildHtml={onBuildStoreHtml}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {messages.length === 1 && flowStep === 'idle' && (
              <div className="sm:mt-80">
                <div className="mb-3 flex items-center justify-between px-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-500">Comece por uma ação</p>
                  <span className="text-[10px] text-gray-400">ou escreva livremente acima</span>
                </div>
                <div className="grid overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm sm:grid-cols-2 lg:grid-cols-3">
                  <button type="button" onClick={startStoreFlow} className="group flex min-h-24 items-start gap-3 border-b border-gray-100 p-4 text-left transition hover:bg-amber-50/60 sm:border-r lg:border-b-0">
                    <Store size={17} className="mt-0.5 shrink-0 text-amber-600" />
                    <span className="min-w-0 flex-1"><strong className="block text-xs text-gray-950">Criar uma loja</strong><span className="mt-1 block text-[11px] leading-relaxed text-gray-500">Estrutura completa do zero</span></span>
                    <ChevronRight size={14} className="mt-0.5 text-gray-300 transition group-hover:translate-x-0.5" />
                  </button>
                  <button type="button" onClick={showProductRecommendations} className="group flex min-h-24 items-start gap-3 border-b border-gray-100 p-4 text-left transition hover:bg-emerald-50/60 lg:border-r">
                    <PackageSearch size={17} className="mt-0.5 shrink-0 text-emerald-600" />
                    <span className="min-w-0 flex-1"><strong className="block text-xs text-gray-950">Explorar produtos</strong><span className="mt-1 block text-[11px] leading-relaxed text-gray-500">Oportunidades do catálogo</span></span>
                    <ChevronRight size={14} className="mt-0.5 text-gray-300 transition group-hover:translate-x-0.5" />
                  </button>
                  <button type="button" onClick={() => submitPrompt('Analise minha vitrine atual e diga o que devo melhorar primeiro.')} className="group flex min-h-24 items-start gap-3 border-b border-gray-100 p-4 text-left transition hover:bg-blue-50/60">
                    <WandSparkles size={17} className="mt-0.5 shrink-0 text-blue-600" />
                    <span className="min-w-0 flex-1"><strong className="block text-xs text-gray-950">Analisar a vitrine</strong><span className="mt-1 block text-[11px] leading-relaxed text-gray-500">Diagnóstico da loja atual</span></span>
                    <ChevronRight size={14} className="mt-0.5 text-gray-300 transition group-hover:translate-x-0.5" />
                  </button>
                  <button type="button" onClick={() => submitPrompt('Quero importar um produto do Mercado Livre.')} className="group flex min-h-24 items-start gap-3 border-b border-gray-100 p-4 text-left transition hover:bg-yellow-50/70 sm:border-b-0 sm:border-r">
                    <ShoppingBag size={17} className="mt-0.5 shrink-0 text-amber-600" />
                    <span className="min-w-0 flex-1"><strong className="block text-xs text-gray-950">Importar produto</strong><span className="mt-1 block text-[11px] leading-relaxed text-gray-500">Mercado Livre ou Shopee</span></span>
                    <ChevronRight size={14} className="mt-0.5 text-gray-300 transition group-hover:translate-x-0.5" />
                  </button>
                  <button type="button" onClick={() => submitPrompt('Quero criar um Reel para minha loja.')} className="group flex min-h-24 items-start gap-3 border-b border-gray-100 p-4 text-left transition hover:bg-violet-50/60 sm:border-b-0 sm:border-r">
                    <Film size={17} className="mt-0.5 shrink-0 text-violet-600" />
                    <span className="min-w-0 flex-1"><strong className="block text-xs text-gray-950">Criar Reels</strong><span className="mt-1 block text-[11px] leading-relaxed text-gray-500">Vídeos e influencer IA</span></span>
                    <ChevronRight size={14} className="mt-0.5 text-gray-300 transition group-hover:translate-x-0.5" />
                  </button>
                  <button type="button" onClick={() => submitPrompt('Monte um plano simples de divulgação para minha loja.')} className="group flex min-h-24 items-start gap-3 p-4 text-left transition hover:bg-rose-50/60">
                    <Target size={17} className="mt-0.5 shrink-0 text-rose-600" />
                    <span className="min-w-0 flex-1"><strong className="block text-xs text-gray-950">Planejar divulgação</strong><span className="mt-1 block text-[11px] leading-relaxed text-gray-500">Conteúdo e canais prioritários</span></span>
                    <ChevronRight size={14} className="mt-0.5 text-gray-300 transition group-hover:translate-x-0.5" />
                  </button>
                </div>
                {assistantMode === 'current' && (
                  <div className="mt-3 flex flex-col gap-3 border-l-2 border-amber-400 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-amber-700">Próxima melhor ação</p>
                      <strong className="mt-1 block text-xs text-gray-950">{operationInsight.title}</strong>
                      <span className="mt-0.5 block text-[11px] text-gray-500">{operationInsight.body}</span>
                    </div>
                    <button type="button" onClick={() => setPendingAction({ type: 'navigate', page: operationInsight.page, title: operationInsight.action, description: `A Ayla abrirá “${operationInsight.action}” para você continuar com segurança.` })} className="shrink-0 rounded-lg border border-gray-200 px-3 py-2 text-[11px] font-bold text-gray-800 transition hover:border-amber-300 hover:bg-amber-50">
                      {operationInsight.action}
                    </button>
                  </div>
                )}
              </div>
            )}

            {guidedStepIndex >= 0 && (
              <div className="overflow-hidden rounded-xl border border-amber-200 bg-white shadow-sm">
                <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <div><p className="text-[10px] font-black uppercase tracking-[0.14em] text-amber-700">Modo guiado</p><strong className="mt-1 block text-sm text-gray-950">{GUIDED_FLOW_STEPS[guidedStepIndex].label}</strong></div>
                      <span className="shrink-0 text-[11px] font-bold text-gray-500">Etapa {guidedStepIndex + 1} de {GUIDED_FLOW_STEPS.length}</span>
                    </div>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-100"><div className="h-full rounded-full bg-amber-400 transition-all" style={{ width: `${((guidedStepIndex + 1) / GUIDED_FLOW_STEPS.length) * 100}%` }} /></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={goBackGuidedFlow} disabled={guidedStepIndex === 0} className="rounded-lg border border-gray-200 px-3 py-2 text-[11px] font-bold text-gray-600 disabled:cursor-not-allowed disabled:opacity-35">Voltar</button>
                    {flowStep === 'audience' && <button type="button" onClick={skipGuidedStep} className="rounded-lg border border-gray-200 px-3 py-2 text-[11px] font-bold text-gray-600">Pular</button>}
                    <button type="button" onClick={leaveGuidedFlow} className="rounded-lg px-3 py-2 text-[11px] font-bold text-rose-600 hover:bg-rose-50">Sair</button>
                  </div>
                </div>
              </div>
            )}

            {flowStep === 'niche' && (
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {NICHES.map(niche => (
                  <button key={niche.id} type="button" onClick={() => selectNiche(niche.id)} className="rounded-lg border border-gray-200 bg-white p-3 text-left transition hover:border-gray-500">
                    <strong className="text-[13px] text-gray-950">{niche.name}</strong>
                    <span className="mt-1 block line-clamp-2 text-[11px] leading-relaxed text-gray-500">{niche.description}</span>
                  </button>
                ))}
              </div>
            )}

            {flowStep === 'audience' && (
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {['Público geral', 'Jovens e universitários', 'Mulheres', 'Homens', 'Crianças e famílias', 'Pessoas 50+'].map(audience => (
                  <button key={audience} type="button" onClick={() => selectAudience(audience)} className="rounded-lg border border-gray-200 bg-white p-3 text-left text-[12px] font-bold text-gray-800 transition hover:border-amber-400 hover:bg-amber-50">{audience}</button>
                ))}
              </div>
            )}

            {flowStep === 'theme' && (
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {themeOptions.map(theme => (
                  <button key={theme.id} type="button" onClick={() => chooseTheme(theme.id)} className="rounded-lg border border-gray-200 bg-white p-3 text-left transition hover:border-gray-500">
                    <span className="mb-3 block h-2 w-12 rounded-full" style={{ backgroundColor: theme.color }} />
                    <strong className="text-[13px] text-gray-950">{theme.name}</strong>
                    <span className="mt-1 block text-[11px] text-gray-500">{theme.description}</span>
                  </button>
                ))}
              </div>
            )}

            {(flowStep === 'products' || showRecommendations) && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-emerald-700">Radar de oportunidades</p>
                    <strong className="mt-1 block text-lg text-gray-950">{recommendationQuery ? `Produtos relacionados a “${recommendationQuery}”` : `Produtos indicados para ${activeNiche.name}`}</strong>
                    <p className="mt-0.5 text-[11px] text-gray-500">Selecione quantos quiser e clique na margem de cada card para ajustar o preço.</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {flowStep === 'products' && <button type="button" onClick={() => { setMarketplaceImportUrl(''); setMarketplaceImportToken(current => current + 1); addAssistantMessage('Cole o link do Mercado Livre ou da Shopee. Depois revise os dados e defina a margem antes de incluir na nova loja.'); }} className="inline-flex items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-[11px] font-black text-amber-900 transition hover:bg-amber-100"><ShoppingBag size={14} /> Importar marketplace</button>}
                    {showRecommendations && (
                      <select value={recommendationNicheId} onChange={event => { setRecommendationNicheId(event.target.value); setRecommendationQuery(''); setRecommendationProductIds([]); setGuidedProductLimit(8); }} className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 outline-none">
                        {NICHES.map(niche => <option key={niche.id} value={niche.id}>{niche.name}</option>)}
                      </select>
                    )}
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {recommendedProducts.map(product => {
                    const selected = draft.productIds.includes(product.id);
                    const inStore = Boolean(currentStore.productIds?.includes(product.id));
                    const profit = Math.max(0, product.salePrice - product.costPrice);
                    const margin = product.costPrice > 0 ? Math.round((profit / product.costPrice) * 100) : 0;
                    return (
                      <article key={product.id} className={`overflow-hidden rounded-lg border bg-white transition hover:-translate-y-0.5 hover:shadow-md ${selected ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-gray-200'}`}>
                        <div className="relative aspect-[16/10] border-b border-gray-100 bg-[#f8f9fa] p-4">
                          <img src={product.imageUrl} alt={product.name} loading="lazy" className="h-full w-full object-contain" />
                          <span className="absolute left-3 top-3 rounded-md border border-gray-200 bg-white/95 px-2 py-1 text-[9px] font-black uppercase text-gray-600">{product.supplier || 'Fornecedor'}</span>
                          <button type="button" onClick={() => { setPriceEditorProductId(product.id); setPriceInput(String(margin)); }} className="absolute right-3 top-3 rounded-md bg-[#101318] px-2 py-1 text-[9px] font-black text-white transition hover:bg-amber-500 hover:text-gray-950" title="Editar margem de lucro">{margin}% margem</button>
                        </div>
                        <div className="p-3.5">
                          <h3 className="line-clamp-2 min-h-9 text-xs font-bold leading-snug text-gray-950">{product.name}</h3>
                          <div className="mt-3 grid grid-cols-3 gap-2 border-y border-gray-100 py-3">
                            <div><span className="block text-[9px] uppercase text-gray-400">Custo</span><strong className="text-[11px] text-gray-700">{formatCurrency(product.costPrice)}</strong></div>
                            <div><span className="block text-[9px] uppercase text-gray-400">Venda</span><strong className="text-[11px] text-gray-950">{formatCurrency(product.salePrice)}</strong></div>
                            <div><span className="block text-[9px] uppercase text-gray-400">Lucro</span><strong className="text-[11px] text-emerald-700">{formatCurrency(profit)}</strong></div>
                          </div>
                          {priceEditorProductId === product.id && (
                            <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50/70 p-3">
                              <div className="flex items-center justify-between gap-2">
                                <label htmlFor={`margin-${product.id}`} className="text-[10px] font-black uppercase text-amber-800">Margem de lucro</label>
                                <span className="text-[10px] text-gray-500">Preço: {formatCurrency(product.costPrice * (1 + Math.max(0, Number(priceInput.replace(',', '.')) || 0) / 100))}</span>
                              </div>
                              <div className="mt-2 flex gap-2">
                                <div className="relative min-w-0 flex-1">
                                  <input id={`margin-${product.id}`} value={priceInput} onChange={event => setPriceInput(event.target.value.replace(/[^0-9,.]/g, ''))} inputMode="decimal" className="h-9 w-full rounded-lg border border-amber-200 bg-white px-3 pr-8 text-xs font-bold outline-none focus:border-amber-500" aria-label="Margem de lucro em porcentagem" />
                                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">%</span>
                                </div>
                                <button type="button" disabled={product.costPrice <= 0} onClick={() => { const nextMargin = Number(priceInput.replace(',', '.')); const price = product.costPrice * (1 + nextMargin / 100); if (Number.isFinite(nextMargin) && nextMargin >= 0 && price > 0) setPendingAction({ type: 'update-price', productId: product.id, price: Number(price.toFixed(2)), title: product.name, description: `Aplicar margem de ${nextMargin}% e alterar o preço de venda para ${formatCurrency(price)}.` }); }} className="rounded-lg bg-[#111318] px-3 text-[10px] font-black text-white disabled:cursor-not-allowed disabled:opacity-40">Aplicar</button>
                                <button type="button" onClick={() => { setPriceEditorProductId(''); setPriceInput(''); }} className="grid h-9 w-9 place-items-center rounded-lg border border-gray-200 bg-white text-gray-500" aria-label="Cancelar edição"><X size={13} /></button>
                              </div>
                              {product.costPrice <= 0 && <p className="mt-2 text-[10px] text-rose-600">Cadastre o preço de custo para calcular a margem.</p>}
                            </div>
                          )}
                          <details className="border-b border-gray-100 py-2.5 text-[10px] text-gray-500">
                            <summary className="cursor-pointer font-bold text-gray-700">Por que a Ayla indicou?</summary>
                            <p className="mt-2 leading-relaxed">{recommendationReason(product, recommendationQuery)}</p>
                          </details>
                          {flowStep === 'products' ? (
                            <button type="button" onClick={() => toggleDraftProduct(product.id)} className={`mt-3 flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-[11px] font-black transition ${selected ? 'bg-emerald-100 text-emerald-800' : 'bg-[#101318] text-white hover:bg-gray-800'}`}>
                              {selected ? <Check size={14} /> : <Plus size={14} />} {selected ? 'Selecionado' : 'Selecionar produto'}
                            </button>
                          ) : (
                            <div className="mt-3 space-y-2">
                              <button type="button" disabled={inStore} onClick={() => setPendingAction({ type: 'add-product', productId: product.id, title: product.name, description: `Adicionar este produto à loja atual com preço de venda de ${formatCurrency(product.salePrice)}.` })} className={`flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-[11px] font-black transition ${inStore ? 'border border-gray-200 bg-gray-50 text-gray-600' : 'bg-[#101318] text-white hover:bg-emerald-700'}`}>
                                {inStore ? <Check size={14} /> : <Plus size={14} />} {inStore ? 'Na loja' : 'Adicionar à loja'}
                              </button>
                              <div className="flex justify-between">
                                <button type="button" onClick={() => { setPriceEditorProductId(product.id); setPriceInput(String(margin)); }} className="text-[10px] font-bold text-gray-500 hover:text-gray-900">Editar margem</button>
                                <button type="button" onClick={() => rejectProduct(product)} className="text-[10px] font-bold text-gray-400 hover:text-rose-600">Não recomendar</button>
                              </div>
                            </div>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
                {flowStep === 'products' && (
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <button type="button" onClick={() => setGuidedProductLimit(current => current + 8)} className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 transition hover:border-amber-300 hover:bg-amber-50"><Plus size={14} /> Mostrar mais produtos</button>
                    <button type="button" onClick={finishProductSelection} className="flex items-center justify-center gap-2 rounded-lg bg-[#111827] px-4 py-2.5 text-xs font-bold text-white">
                      Continuar com {draft.productIds.length} produtos <ArrowRight size={14} />
                    </button>
                  </div>
                )}
              </div>
            )}

            {flowStep === 'review' && (
              <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                <div className="border-b border-gray-200 px-4 py-3">
                  <p className="text-[10px] font-black uppercase tracking-wider text-amber-600">Resumo da nova loja</p>
                  <h3 className="mt-1 text-lg font-bold text-gray-950">{draft.name}</h3>
                </div>
                <div className="grid gap-px bg-gray-200 sm:grid-cols-4">
                  <div className="bg-white p-4"><span className="text-[10px] uppercase text-gray-500">Nicho</span><strong className="mt-1 block text-xs text-gray-900">{activeNiche.name}</strong></div>
                  <div className="bg-white p-4"><span className="text-[10px] uppercase text-gray-500">Produtos</span><strong className="mt-1 block text-xs text-gray-900">{draft.productIds.length} selecionados</strong></div>
                  <div className="bg-white p-4"><span className="text-[10px] uppercase text-gray-500">Visual</span><strong className="mt-1 block text-xs capitalize text-gray-900">{draft.themePreset}</strong></div>
                  <div className="bg-white p-4"><span className="text-[10px] uppercase text-gray-500">Lucro (1 venda/item)</span><strong className="mt-1 block text-xs text-emerald-700">{formatCurrency(estimatedProfit)}</strong></div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 p-4">
                  <button type="button" onClick={() => setFlowStep('products')} className="text-xs font-bold text-gray-600 underline">Revisar produtos</button>
                  <button type="button" onClick={createStore} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-3 text-xs font-black text-white transition hover:bg-emerald-700">
                    <Plus size={15} /> Criar loja agora
                  </button>
                </div>
              </div>
            )}

            {flowStep === 'done' && (
              <div className="overflow-hidden rounded-xl border border-emerald-200 bg-white shadow-sm">
                <div className="flex items-center gap-3 border-b border-emerald-100 bg-emerald-50 p-4">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-600 text-white"><Check size={18} /></span>
                  <div><strong className="text-sm text-emerald-950">Loja criada e salva</strong><p className="mt-0.5 text-xs text-emerald-800">Escolha o próximo passo e continue com a Ayla.</p></div>
                </div>
                <div className="grid gap-px bg-gray-200 sm:grid-cols-2 lg:grid-cols-4">
                  <button type="button" onClick={() => onNavigate('promotion')} className="group flex items-start gap-3 bg-white p-4 text-left transition hover:bg-amber-50"><Rocket size={17} className="mt-0.5 shrink-0 text-amber-600" /><span><strong className="block text-xs text-gray-950">Preparar divulgação</strong><span className="mt-1 block text-[10px] leading-relaxed text-gray-500">Copys, grupos e calendário</span></span></button>
                  <button type="button" onClick={() => { setFlowStep('idle'); setCreativeMode('choose'); addAssistantMessage('Perfeito. Vamos criar o primeiro conteúdo da nova loja. Escolha o formato abaixo.'); }} className="group flex items-start gap-3 bg-white p-4 text-left transition hover:bg-violet-50"><Film size={17} className="mt-0.5 shrink-0 text-violet-600" /><span><strong className="block text-xs text-gray-950">Criar Reels</strong><span className="mt-1 block text-[10px] leading-relaxed text-gray-500">Vídeo viral ou influencer IA</span></span></button>
                  <button type="button" onClick={onPreviewStore} className="group flex items-start gap-3 bg-white p-4 text-left transition hover:bg-emerald-50"><Paintbrush size={17} className="mt-0.5 shrink-0 text-emerald-600" /><span><strong className="block text-xs text-gray-950">Visualizar loja</strong><span className="mt-1 block text-[10px] leading-relaxed text-gray-500">Conferir a vitrine pronta</span></span></button>
                  <button type="button" onClick={() => onNavigate('operation')} className="group flex items-start gap-3 bg-white p-4 text-left transition hover:bg-blue-50"><Store size={17} className="mt-0.5 shrink-0 text-blue-600" /><span><strong className="block text-xs text-gray-950">Continuar ajustando</strong><span className="mt-1 block text-[10px] leading-relaxed text-gray-500">Editar dados e produtos</span></span></button>
                </div>
              </div>
            )}

            {loading && (
              <div className="flex items-center gap-3 border-l-2 border-amber-400 bg-white px-4 py-3 text-xs text-gray-600 shadow-sm"><LoaderCircle size={16} className="animate-spin text-amber-600" /><span><strong className="block text-gray-900">{processingStage}</strong><span className="mt-0.5 block text-[10px] text-gray-400">Sua conversa continua salva enquanto processamos.</span></span></div>
            )}
          </div>
        </div>

        <footer className={`pointer-events-none absolute inset-x-0 z-20 p-3 sm:p-5 ${messages.length === 1 && flowStep === 'idle' && !showRecommendations ? 'bottom-0 sm:bottom-auto sm:top-[300px]' : 'bottom-0'}`}>
          <div className="pointer-events-auto relative mx-auto max-w-4xl">
            {commandMenuOpen && (
              <div className="absolute bottom-[calc(100%+10px)] left-0 w-72 overflow-hidden rounded-lg border border-gray-200/80 bg-white p-1.5 shadow-[0_18px_45px_rgba(15,23,42,0.14)]">
                {[
                  { icon: RefreshCw, label: 'Começar uma nova conversa', action: resetConversation },
                  { icon: Store, label: 'Criar uma nova loja', action: startStoreFlow },
                  { icon: PackageSearch, label: 'Encontrar produtos para vender', action: showProductRecommendations },
                  { icon: Film, label: 'Criar Reel ou influencer', action: () => setCreativeMode('choose') },
                  { icon: ChartNoAxesCombined, label: 'Analisar minha operação', action: () => submitPrompt('Analise minha operação atual e priorize três melhorias.') },
                  { icon: ShoppingBag, label: 'Abrir catálogo completo', action: () => setPendingAction({ type: 'navigate', page: 'products', title: 'Abrir catálogo', description: 'A Ayla abrirá o catálogo completo sem alterar sua loja.' }) },
                  { icon: Paintbrush, label: 'Revisar vitrine gerada', action: () => setPendingAction({ type: 'navigate', page: 'shop-preview', title: 'Revisar vitrine', description: 'A Ayla abrirá a visualização da loja atual para revisão.' }) },
                  { icon: Rocket, label: 'Preparar divulgação', action: () => setPendingAction({ type: 'navigate', page: 'promotion', title: 'Preparar divulgação', description: 'A Ayla abrirá o estúdio de divulgação da loja atual.' }) }
                ].map(item => (
                  <button key={item.label} type="button" onClick={() => { item.action(); setCommandMenuOpen(false); }} className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-xs font-semibold text-gray-700 transition hover:bg-gray-100 hover:text-gray-950">
                    <item.icon size={15} className="text-gray-500" /> {item.label}
                  </button>
                ))}
              </div>
            )}
            <div
              className={`rounded-2xl border-2 border-transparent p-2 transition-all duration-200 ${composerFocused ? 'shadow-[0_20px_60px_rgba(211,166,34,0.24)] ring-4 ring-amber-100/70' : 'shadow-[0_18px_45px_rgba(15,23,42,0.13)]'}`}
              style={{
                background: 'linear-gradient(#ffffff, #ffffff) padding-box, linear-gradient(120deg, #fff1a8 0%, #e5b82d 42%, #f6d96f 72%, #fff7cf 100%) border-box'
              }}
            >
              <textarea
                value={input}
                onChange={event => setInput(event.target.value)}
                onFocus={() => setComposerFocused(true)}
                onBlur={() => setComposerFocused(false)}
                onKeyDown={event => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    sendMessage();
                  }
                }}
                rows={messages.length === 1 && flowStep === 'idle' && !showRecommendations ? 3 : composerFocused || input ? 2 : 1}
                placeholder={flowStep === 'name' ? 'Digite o nome da loja...' : flowStep === 'whatsapp' ? 'Ex.: 5511999999999' : 'Converse com a Ayla...'}
                className="max-h-32 min-h-11 w-full resize-none bg-transparent px-2 py-2 text-[13px] leading-relaxed text-gray-900 outline-none placeholder:text-gray-400"
              />
              <div className="flex items-center justify-between gap-2 border-t border-gray-100 pt-2">
                <div className="flex items-center gap-1.5">
                  <button type="button" onClick={() => setCommandMenuOpen(value => !value)} className={`grid h-8 w-8 place-items-center rounded-md transition ${commandMenuOpen ? 'bg-amber-100 text-amber-700' : 'text-gray-500 hover:bg-gray-100'}`} title="Ações da Ayla">
                    {commandMenuOpen ? <X size={15} /> : <Plus size={16} />}
                  </button>
                  <button type="button" onClick={toggleVoice} className={`grid h-8 w-8 place-items-center rounded-md transition ${listening ? 'bg-rose-100 text-rose-600' : 'text-gray-500 hover:bg-gray-100'}`} title={listening ? 'Parar gravação' : 'Falar com a Ayla'}>
                    {listening ? <AudioLines size={16} className="animate-pulse" /> : <Mic size={16} />}
                  </button>
                  <div className="ml-1 flex rounded-lg bg-gray-100 p-0.5" aria-label="Contexto da conversa">
                    <button type="button" onClick={() => setAssistantMode('current')} className={`rounded-md px-2.5 py-1.5 text-[10px] font-bold transition ${assistantMode === 'current' ? 'bg-white text-gray-950 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}>Loja atual</button>
                    <button type="button" onClick={() => setAssistantMode('new')} className={`rounded-md px-2.5 py-1.5 text-[10px] font-bold transition ${assistantMode === 'new' ? 'bg-white text-gray-950 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}>Nova loja</button>
                  </div>
                </div>
                <button type="button" onClick={sendMessage} disabled={!input.trim() || loading} className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#dfb52d] text-gray-950 shadow-sm transition hover:bg-[#cfa51e] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 disabled:opacity-100" aria-label="Enviar mensagem">
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
            <p className="mt-2 text-center text-[9px] text-gray-400">A Ayla usa dados reais da sua Storefy. Confirme preços e disponibilidade antes de publicar.</p>
          </div>
        </footer>
      </div>
      {pendingAction && (
        <div className="absolute inset-0 z-40 grid place-items-center bg-gray-950/25 p-4 backdrop-blur-[2px]" role="dialog" aria-modal="true" aria-label="Confirmar ação da Ayla">
          <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-5 shadow-[0_24px_70px_rgba(15,23,42,0.24)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-amber-700">Confirmação necessária</p>
                <h3 className="mt-2 text-base font-bold text-gray-950">{pendingAction.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-gray-500">{pendingAction.description}</p>
              </div>
              <button type="button" onClick={() => setPendingAction(null)} className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700" aria-label="Cancelar"><X size={16} /></button>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setPendingAction(null)} className="rounded-lg border border-gray-200 px-4 py-2.5 text-xs font-bold text-gray-600">Cancelar</button>
              <button type="button" onClick={confirmPendingAction} className="rounded-lg bg-[#111318] px-4 py-2.5 text-xs font-bold text-white hover:bg-gray-800">Confirmar ação</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
