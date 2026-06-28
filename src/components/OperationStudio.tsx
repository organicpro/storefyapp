import React, { useEffect, useMemo, useState } from 'react';
import {
  BookOpen, Bot, CalendarDays, Check, ChevronLeft, ChevronRight, Copy, Compass, Download, Film, Gamepad2, Instagram,
  LayoutTemplate, MessageCircle, MonitorPlay, PackageCheck, PackageSearch, Play, Send, Sparkles, Store, Music2, UserRound
} from 'lucide-react';
import { Product, StoreConfig } from '../types';
import {
  buildZip, downloadBlob, getContentPack, getOperationNiche, getOperationProfile,
  getPostingCalendar, getRelevantProducts, getSuggestedOperationName, OPERATION_NICHES, slugify,
  SocialChannel, VideoFormat
} from '../lib/operation';

type StudioMode = 'create' | 'profile' | 'videos' | 'promotion' | 'calendar' | 'export';

interface OperationStudioProps {
  mode: StudioMode;
  products: Product[];
  storeConfig: StoreConfig;
  onUpdateStoreConfig: (config: StoreConfig) => void;
  onToggleAddProduct: (id: string) => void;
  onUpdateSalePrice: (productId: string, newPrice: number) => void;
  onOpenSection: (section: string) => void;
  onPreview: (step?: number, productIds?: string[]) => void;
  onPublish: () => Promise<{ mode: string; url: string; error?: string }>;
  onBuildHtml: () => string;
  initialStep?: number;
}

const typeFor = (product: Product) => product.category === 'Achados Fisicos'
  ? 'Fisico' : product.category === 'Assinaturas Digitais' ? 'Assinatura' : 'Digital';

const FEATURED_NICHE_IDS = ['games', 'social-media', 'subscriptions', 'physical-finds', 'digital-products'];

const NICHE_CARD_META: Record<string, { icon: React.ReactNode; tags: string[] }> = {
  games: { icon: <Gamepad2 size={23} />, tags: ['eFootball', 'Steam', 'Call of Duty', '+5 mais'] },
  'social-media': { icon: <Compass size={23} />, tags: ['Instagram', 'TikTok', 'Redes Sociais', '+2 mais'] },
  subscriptions: { icon: <MonitorPlay size={23} />, tags: ['Disney+', 'Spotify', 'ChatGPT', 'Gemini', 'Canva Pro', '+11 mais'] },
  'apps-tools': { icon: <Bot size={23} />, tags: ['ChatGPT', 'Gemini', 'Canva Pro', '+4 mais'] },
  'physical-finds': { icon: <PackageSearch size={23} />, tags: ['Eletrônicos', 'Áudio e Gadgets', 'Moda e Fitness', '+5 mais'] },
  'digital-products': { icon: <BookOpen size={23} />, tags: ['Emagrecimento', 'Evolução Pessoal', 'Finanças Pessoais', '+3 mais'] }
};

const copy = async (value: string) => {
  try { await navigator.clipboard.writeText(value); } catch { /* Clipboard can be unavailable in previews. */ }
};

const VIRAL_LIBRARY = [
  { id: 'viral-01', title: 'Viral 01', hook: 'Olha isso antes de comprar', caption: 'Base viral pronta para receber sua moldura e CTA.', color: '#f97316', previewGif: '/videos/viral/viral-01.mp4', baseVideoUrl: '/videos/viral/viral-01.mp4' },
  { id: 'viral-02', title: 'Viral 02', hook: 'Esse video prende logo no comeco', caption: 'Entrada rapida para testar CTA curto e visual forte.', color: '#fb7185', previewGif: '/videos/viral/viral-02.mp4', baseVideoUrl: '/videos/viral/viral-02.mp4' },
  { id: 'viral-03', title: 'Viral 03', hook: 'Nao passa sem ver isso', caption: 'Boa opcao para chamar atencao nos primeiros segundos.', color: '#38bdf8', previewGif: '/videos/viral/viral-03.mp4', baseVideoUrl: '/videos/viral/viral-03.mp4' },
  { id: 'viral-04', title: 'Viral 04', hook: 'O detalhe esta aqui', caption: 'Base curta para criativo de impacto com moldura.', color: '#a78bfa', previewGif: '/videos/viral/viral-04.mp4', baseVideoUrl: '/videos/viral/viral-04.mp4' },
  { id: 'viral-05', title: 'Viral 05', hook: 'Qual voce escolheria?', caption: 'Funciona bem para comparacao visual e CTA direto.', color: '#22c55e', previewGif: '/videos/viral/viral-05.mp4', baseVideoUrl: '/videos/viral/viral-05.mp4' },
  { id: 'viral-06', title: 'Viral 06', hook: 'Quem viu isso parou na hora', caption: 'Base com ritmo forte para criativos mais chamativos.', color: '#f59e0b', previewGif: '/videos/viral/viral-06.mp4', baseVideoUrl: '/videos/viral/viral-06.mp4' },
  { id: 'viral-07', title: 'Viral 07', hook: 'Esse corte chama clique', caption: 'Base para teste rapido de headline com foco em venda.', color: '#14b8a6', previewGif: '/videos/viral/viral-07.mp4', baseVideoUrl: '/videos/viral/viral-07.mp4' },
  { id: 'viral-08', title: 'Viral 08', hook: 'Viral bom para oferta', caption: 'Bom para usar moldura com @ e promessa curta.', color: '#e879f9', previewGif: '/videos/viral/viral-08.mp4', baseVideoUrl: '/videos/viral/viral-08.mp4' },
  { id: 'viral-09', title: 'Viral 09', hook: 'Esse aqui segura atencao', caption: 'Mais uma variacao para testar retencao no topo.', color: '#60a5fa', previewGif: '/videos/viral/viral-09.mp4', baseVideoUrl: '/videos/viral/viral-09.mp4' },
  { id: 'viral-10', title: 'Viral 10', hook: 'Olha o que acontece aqui', caption: 'Base pronta para CTA visual sem mudar o fluxo.', color: '#f43f5e', previewGif: '/videos/viral/viral-10.mp4', baseVideoUrl: '/videos/viral/viral-10.mp4' },
  { id: 'viral-11', title: 'Viral 11', hook: 'Nao ignore esse video', caption: 'Viral com bom potencial para legenda curta.', color: '#2dd4bf', previewGif: '/videos/viral/viral-11.mp4', baseVideoUrl: '/videos/viral/viral-11.mp4' },
  { id: 'viral-12', title: 'Viral 12', hook: 'Tem algo aqui que vende', caption: 'Boa base para usar headline forte com moldura.', color: '#f97316', previewGif: '/videos/viral/viral-12.mp4', baseVideoUrl: '/videos/viral/viral-12.mp4' },
  { id: 'viral-13', title: 'Viral 13', hook: 'Veja isso de perto', caption: 'Variacao leve para criativos mais simples e diretos.', color: '#8b5cf6', previewGif: '/videos/viral/viral-13.mp4', baseVideoUrl: '/videos/viral/viral-13.mp4' },
  { id: 'viral-14', title: 'Viral 14', hook: 'Esse frame faz parar', caption: 'Base boa para criativo de feed ou story com CTA.', color: '#06b6d4', previewGif: '/videos/viral/viral-14.mp4', baseVideoUrl: '/videos/viral/viral-14.mp4' },
  { id: 'viral-15', title: 'Viral 15', hook: 'Video forte para anuncio', caption: 'Opcao mais longa para criativo com mais presenca.', color: '#84cc16', previewGif: '/videos/viral/viral-15.mp4', baseVideoUrl: '/videos/viral/viral-15.mp4' },
  { id: 'viral-16', title: 'Viral 16', hook: 'Esse visual chama muito', caption: 'Bom para destacar produto, oferta ou CTA central.', color: '#ec4899', previewGif: '/videos/viral/viral-16.mp4', baseVideoUrl: '/videos/viral/viral-16.mp4' },
  { id: 'viral-17', title: 'Viral 17', hook: 'Fecha bem com sua moldura', caption: 'Ultima variacao da biblioteca viral enviada.', color: '#3b82f6', previewGif: '/videos/viral/viral-17.mp4', baseVideoUrl: '/videos/viral/viral-17.mp4' }
] as const;


type InfluencerVideoBase = {
  id: string;
  label: string;
  previewGif: string;
  baseVideoUrl: string;
};

type InfluencerModel = {
  id: string;
  name: string;
  style: string;
  caption: string;
  color: string;
  photoUrl: string;
  coverGif: string;
  videos: InfluencerVideoBase[];
};

const INFLUENCER_LIBRARY: InfluencerModel[] = [
  {
    id: 'modelo-ia-01',
    name: 'Clara IA',
    style: 'Lifestyle e oferta direta',
    caption: 'Persona principal para videos de apresentacao e oferta.',
    color: '#db2777',
    photoUrl: '/images/influencers/clara-ia.jpg',
    coverGif: '/videos/influencers/modelo-ia-01.gif',
    videos: [
      { id: 'modelo-ia-01-base', label: 'Video base 01', previewGif: '/videos/influencers/modelo-ia-01.gif', baseVideoUrl: '/videos/influencers/modelo-ia-01.mp4' }
    ]
  },
  {
    id: 'modelo-ia-02',
    name: 'Sofia IA',
    style: 'Cozinha e rotina',
    caption: 'Persona de cozinha para receitas, rotina e ofertas leves.',
    color: '#f97316',
    photoUrl: '/images/influencers/sofia-ia.jpg',
    coverGif: '/videos/influencers/modelo-ia-02-cozinha.gif',
    videos: [
      { id: 'modelo-ia-02-cozinha', label: 'Video base cozinha', previewGif: '/videos/influencers/modelo-ia-02-cozinha.gif', baseVideoUrl: '/videos/influencers/modelo-ia-02-cozinha.mp4' }
    ]
  },
  {
    id: 'modelo-ia-03',
    name: 'Maya IA',
    style: 'Fashion e achadinhos',
    caption: 'Persona para achadinhos, provador e ofertas.',
    color: '#7c3aed',
    photoUrl: '/images/influencers/maya-ia.jpg',
    coverGif: '/videos/influencers/modelo-ia-03-look-01.gif',
    videos: [
      { id: 'modelo-ia-03-look-01', label: 'Look casual 01', previewGif: '/videos/influencers/modelo-ia-03-look-01.gif', baseVideoUrl: '/videos/influencers/modelo-ia-03-look-01.mp4' },
      { id: 'modelo-ia-03-look-02', label: 'Look casual 02', previewGif: '/videos/influencers/modelo-ia-03-look-02.gif', baseVideoUrl: '/videos/influencers/modelo-ia-03-look-02.mp4' },
      { id: 'modelo-ia-03-look-03', label: 'Look casual 03', previewGif: '/videos/influencers/modelo-ia-03-look-03.gif', baseVideoUrl: '/videos/influencers/modelo-ia-03-look-03.mp4' },
      { id: 'modelo-ia-03-look-04', label: 'Look movimento', previewGif: '/videos/influencers/modelo-ia-03-look-04.gif', baseVideoUrl: '/videos/influencers/modelo-ia-03-look-04.mp4' },
      { id: 'modelo-ia-03-look-05', label: 'Look vermelho', previewGif: '/videos/influencers/modelo-ia-03-look-05.gif', baseVideoUrl: '/videos/influencers/modelo-ia-03-look-05.mp4' }
    ]
  }
] as const;
export default function OperationStudio({
  mode, products, storeConfig, onUpdateStoreConfig, onToggleAddProduct, onUpdateSalePrice, onOpenSection, onPreview, onPublish, onBuildHtml, initialStep = 1
}: OperationStudioProps) {
  const profile = getOperationProfile(storeConfig);
  const niche = getOperationNiche(storeConfig);
  const content = getContentPack(storeConfig, products);
  const calendar = getPostingCalendar(storeConfig);
  const relevantProducts = useMemo(() => getRelevantProducts(storeConfig, products), [storeConfig, products]);
  const selectedProducts = relevantProducts.filter((product) => product.addedToStore);
  const [step, setStep] = useState(initialStep);
  const [name, setName] = useState(storeConfig.name || getSuggestedOperationName(niche));
  const [whatsapp, setWhatsapp] = useState(storeConfig.whatsapp || '');
  const [channels, setChannels] = useState<SocialChannel[]>(storeConfig.socialChannels?.length ? storeConfig.socialChannels : ['instagram', 'tiktok']);
  const [videoCaption, setVideoCaption] = useState(storeConfig.videoCta ?? 'Veja a vitrine e chame no WhatsApp');
  const [showWatermark, setShowWatermark] = useState(storeConfig.videoWatermarkEnabled ?? true);
  const [generating, setGenerating] = useState<VideoFormat | null>(null);
  const [activeVideoLibrary, setActiveVideoLibrary] = useState<VideoFormat>(storeConfig.videoFormat || 'frame');
  const [videoLibraryPage, setVideoLibraryPage] = useState<VideoFormat | null>(null);
  const [viralVideoId, setViralVideoId] = useState<string>(VIRAL_LIBRARY[0].id);
  const [influencerId, setInfluencerId] = useState<string>(INFLUENCER_LIBRARY[0].id);
  const [generatedVideo, setGeneratedVideo] = useState<{ url: string; blob: Blob; mimeType: string; fileName: string; label: string } | null>(null);
  const [publishState, setPublishState] = useState('');
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState('');

  useEffect(() => {
    if (mode === 'create') setStep(initialStep);
  }, [initialStep, mode]);

  const saveOperation = (overrides: Partial<StoreConfig> = {}) => {
    const nextName = (overrides.name ?? name).trim() || getSuggestedOperationName(niche);
    const nextNiche = OPERATION_NICHES.find((item) => item.id === (overrides.operationNiche ?? storeConfig.operationNiche)) || niche;
    onUpdateStoreConfig({
      ...storeConfig,
      ...overrides,
      name: nextName,
      whatsapp: overrides.whatsapp ?? whatsapp,
      niche: nextNiche.name,
      operationNiche: nextNiche.id,
      socialChannels: overrides.socialChannels ?? channels,
      primaryColor: overrides.primaryColor ?? nextNiche.accent,
      profileHandle: overrides.profileHandle ?? `@${slugify(nextName)}`,
      profileBio: overrides.profileBio ?? `${nextNiche.description}\nVeja a vitrine e chame no WhatsApp`,
      videoCta: Object.prototype.hasOwnProperty.call(overrides, 'videoCta') ? overrides.videoCta : videoCaption,
      videoWatermarkEnabled: Object.prototype.hasOwnProperty.call(overrides, 'videoWatermarkEnabled') ? overrides.videoWatermarkEnabled : showWatermark
    });
  };

  const chooseNiche = (id: string) => {
    const next = OPERATION_NICHES.find((item) => item.id === id) || OPERATION_NICHES[0];
    setName(getSuggestedOperationName(next));
    onUpdateStoreConfig({
      ...storeConfig,
      operationNiche: next.id,
      niche: next.name,
      primaryColor: next.accent,
      name: getSuggestedOperationName(next),
      profileHandle: `@${slugify(getSuggestedOperationName(next))}`,
      profileBio: `${next.description}\n↓ Veja a vitrine e chame no WhatsApp`,
      socialChannels: channels,
      productIds: []
    });
  };

  const toggleChannel = (channel: SocialChannel) => {
    setChannels((current) => current.includes(channel)
      ? current.length === 1 ? current : current.filter((item) => item !== channel)
      : [...current, channel]);
  };

  const viralVideo = VIRAL_LIBRARY.find((item) => item.id === viralVideoId) || VIRAL_LIBRARY[0];
  const influencer = INFLUENCER_LIBRARY.find((item) => item.id === influencerId) || INFLUENCER_LIBRARY[0];
  const influencerBaseVideo = influencer.videos[(Math.abs(influencer.id.split('').reduce((total, char) => total + char.charCodeAt(0), 0)) + new Date().getMinutes()) % influencer.videos.length] || influencer.videos[0];
  const influencerCover = influencer.coverGif || influencerBaseVideo?.previewGif || influencer.photoUrl;
  const selectedVideoCaption = videoCaption;

  const chooseVideoLibrary = (format: VideoFormat) => {
    setActiveVideoLibrary(format);
    setVideoLibraryPage(format);
    saveOperation({ videoFormat: format });
  };

  const toggleWatermark = (enabled: boolean) => {
    setShowWatermark(enabled);
    saveOperation({ videoWatermarkEnabled: enabled });
  };

  const formatMoney = (value: number) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const startPriceEdit = (product: Product) => {
    setEditingPriceId(product.id);
    setTempPrice(product.salePrice.toFixed(2).replace('.', ','));
  };

  const savePriceEdit = (product: Product) => {
    const parsed = Number(tempPrice.replace(/[^\d,.-]/g, '').replace(',', '.'));
    if (!Number.isNaN(parsed) && parsed >= 0) {
      onUpdateSalePrice(product.id, parsed);
    }
    setEditingPriceId(null);
  };


  const generateVideo = (format: VideoFormat) => {
    const creativeName = format === 'frame' ? viralVideo.title : influencer.name;
    const includeWatermark = showWatermark;
    const selectedBase = format === 'frame'
      ? { baseVideoUrl: viralVideo.baseVideoUrl, previewGif: viralVideo.previewGif, label: viralVideo.title }
      : influencerBaseVideo;
    const baseVideoUrl = selectedBase?.baseVideoUrl || '';
    const fileName = `${slugify(profile.name)}-${format === 'frame' ? 'moldura-viral' : slugify(influencer.name)}.webm`;
    setGeneratedVideo(null);
    setGenerating(format);
    const generationStartedAt = performance.now();

    const viewWidth = 720;
    const viewHeight = 1280;
    const renderScale = 0.58;
    const targetFps = 24;
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(viewWidth * renderScale);
    canvas.height = Math.round(viewHeight * renderScale);
    const context = canvas.getContext('2d', { alpha: false });
    if (!context || !window.MediaRecorder) { setGenerating(null); return; }
    context.setTransform(renderScale, 0, 0, renderScale, 0, 0);
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'medium';

    const sourceVideo = baseVideoUrl ? document.createElement('video') : null;
    if (sourceVideo) {
      sourceVideo.crossOrigin = 'anonymous';
      sourceVideo.muted = true;
      sourceVideo.preload = 'auto';
      sourceVideo.disablePictureInPicture = true;
      sourceVideo.loop = false;
      sourceVideo.playsInline = true;
      sourceVideo.src = baseVideoUrl;
    }

    const stream = canvas.captureStream(targetFps);
    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp8') ? 'video/webm;codecs=vp8' : 'video/webm';
    const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 2600000 });
    const chunks: BlobPart[] = [];
    recorder.ondataavailable = (event) => { if (event.data.size) chunks.push(event.data); };
    recorder.onstop = () => {
      sourceVideo?.pause();
      stream.getTracks().forEach((track) => track.stop());
      const blob = new Blob(chunks, { type: mimeType });
      const elapsed = performance.now() - generationStartedAt;
      const delay = Math.max(0, 3800 - elapsed);
      window.setTimeout(() => {
        const url = URL.createObjectURL(blob);
        setGeneratedVideo({ url, blob, mimeType, fileName, label: format === 'frame' ? 'Criativo viral pronto' : `Criativo da ${influencer.name} pronto` });
        setGenerating(null);
      }, delay);
    };

    const wrap = (text: string, max = 22) => text.match(new RegExp(`.{1,${max}}(?:\\s|$)|.{1,${max}}`, 'g')) || [text];
    const drawRoundedRect = (x: number, y: number, width: number, height: number, radius: number) => {
      context.beginPath();
      context.roundRect(x, y, width, height, radius);
      context.fill();
    };
    const drawBase = (frame: number) => {
      if (sourceVideo && sourceVideo.readyState >= 2 && sourceVideo.videoWidth && sourceVideo.videoHeight) {
        const ratio = Math.max(viewWidth / sourceVideo.videoWidth, viewHeight / sourceVideo.videoHeight);
        const width = sourceVideo.videoWidth * ratio;
        const height = sourceVideo.videoHeight * ratio;
        context.drawImage(sourceVideo, (viewWidth - width) / 2, (viewHeight - height) / 2, width, height);
        context.fillStyle = format === 'frame' ? 'rgba(0,0,0,.08)' : 'rgba(0,0,0,.18)';
        context.fillRect(0, 0, viewWidth, viewHeight);
        return;
      }
      const glow = 0.25 + Math.sin(frame / 12) * 0.12;
      context.fillStyle = '#07070a'; context.fillRect(0, 0, 720, 1280);
      const gradient = context.createLinearGradient(0, 0, 720, 1280);
      gradient.addColorStop(0, `${niche.accent}cc`);
      gradient.addColorStop(0.46, '#111827');
      gradient.addColorStop(1, '#050507');
      context.fillStyle = gradient;
      context.fillRect(0, 0, 720, 1280);
      context.fillStyle = `rgba(255,255,255,${glow})`;
      context.beginPath();
      context.arc(580, 180 + Math.sin(frame / 14) * 24, 220, 0, Math.PI * 2);
      context.fill();
    };
    const drawCaptionOverlay = () => {
      const caption = selectedVideoCaption.trim();
      if (!caption) return;
      const lines = wrap(caption, 22).slice(0, 4);
      const startY = 735 - Math.max(0, lines.length - 2) * 26;
      context.save();
      context.textAlign = 'center';
      context.lineJoin = 'round';
      context.shadowColor = 'rgba(0,0,0,.95)';
      context.shadowBlur = 14;
      context.shadowOffsetY = 4;
      context.font = '900 46px Arial';
      lines.forEach((line, index) => {
        const y = startY + index * 52;
        context.lineWidth = 9;
        context.strokeStyle = 'rgba(0,0,0,.82)';
        context.strokeText(line.trim(), 360, y);
        context.fillStyle = '#ffffff';
        context.fillText(line.trim(), 360, y);
      });
      if (includeWatermark) {
        context.shadowBlur = 10;
        context.shadowOffsetY = 3;
        context.font = '800 23px Arial';
        context.lineWidth = 5;
        context.strokeStyle = 'rgba(0,0,0,.75)';
        context.strokeText(profile.handle, 360, startY + lines.length * 52 + 12);
        context.fillStyle = niche.accent;
        context.fillText(profile.handle, 360, startY + lines.length * 52 + 12);
      }
      context.restore();
    };

    let frame = 0;
    let renderDurationMs = 12000;
    let renderStartedAt = 0;
    const draw = (timestamp = performance.now()) => {
      if (!renderStartedAt) renderStartedAt = timestamp;
      const elapsedMs = timestamp - renderStartedAt;
      const progress = Math.min(1, elapsedMs / renderDurationMs);
      drawBase(frame);
      if (format === 'frame') {
        context.fillStyle = sourceVideo ? 'rgba(4,4,7,.04)' : 'rgba(4,4,7,.88)';
        drawRoundedRect(44, 90, 632, 1010, 44);
        context.strokeStyle = niche.accent;
        context.lineWidth = 5;
        context.beginPath();
        context.roundRect(44, 90, 632, 1010, 44);
        context.stroke();
        context.fillStyle = niche.accent;
        drawRoundedRect(76, 124, 568, 96, 24);
        context.fillStyle = '#07070a';
        context.font = '700 27px Arial';
        context.fillText(profile.name, 104, includeWatermark ? 166 : 184);
        if (includeWatermark) {
          context.font = '500 20px Arial';
          context.fillText(profile.handle, 104, 198);
        }
        if (!sourceVideo) {
          context.fillStyle = 'rgba(255,255,255,.08)';
          drawRoundedRect(76, 254, 568, 570, 28);
        }
        const frameCaption = selectedVideoCaption.trim();
        if (frameCaption) {
          context.fillStyle = '#ffffff';
          context.font = '900 44px Arial';
          wrap(frameCaption, 22).slice(0, 3).forEach((line, index) => context.fillText(line.trim(), 88, 880 + index * 56));
        }
        if (includeWatermark) {
          context.fillStyle = niche.accent;
          context.font = '800 24px Arial';
          context.fillText(profile.handle, 88, 1040);
        }
      } else {
        drawCaptionOverlay();
      }
      context.fillStyle = `rgba(255,255,255,${0.2 + progress * 0.35})`;
      context.font = '600 15px Arial';
      context.fillText(`Storefy - ${creativeName}`, 50, 1230);
      frame += 1;
      if (elapsedMs < renderDurationMs && recorder.state === 'recording') window.requestAnimationFrame(draw);
      else if (recorder.state !== 'inactive') recorder.stop();
    };

    const startRender = () => {
      renderStartedAt = 0;
      recorder.start(250);
      window.requestAnimationFrame(draw);
    };
    if (sourceVideo) {
      sourceVideo.onloadedmetadata = () => {
        const duration = sourceVideo.duration;
        renderDurationMs = Number.isFinite(duration) && duration > 0 ? Math.ceil(duration * 1000) + 250 : 12000;
        sourceVideo.currentTime = 0;
        sourceVideo.play().catch(() => undefined).finally(startRender);
      };
      sourceVideo.onerror = startRender;
      sourceVideo.load();
    } else {
      startRender();
    }
  };

  const exportKit = () => {
    const profileText = `PERFIL SOCIAL\nNome: ${profile.name}\nUsuario: ${profile.handle}\nBio:\n${profile.bio}\n\nCTA: ${profile.cta}`;
    const copies = `INSTAGRAM\n${content.instagram}\n\nTIKTOK\n${content.tiktok}\n\nSTORY\n${content.story}\n\nWHATSAPP\n${content.whatsapp}\n\nGRUPOS\n${content.groups}`;
    const calendarText = calendar.map((day) => `${day.day} - ${day.focus}\n${day.posts.map((post) => `${post.time} | ${post.channel}: ${post.action}\n${post.caption}`).join('\n')}`).join('\n\n');
    const zip = buildZip([
      { name: 'vitrine/index.html', content: onBuildHtml() },
      { name: 'perfil-social.txt', content: profileText },
      { name: 'copies-e-legendas.txt', content: copies },
      { name: 'calendario-7-dias.txt', content: calendarText },
      { name: 'leia-me.txt', content: 'Seu kit Storefy contem a vitrine HTML, perfil social, copies e calendario. Os videos em WebM sao gerados individualmente no modulo Videos automaticos.' }
    ]);
    downloadBlob(`${slugify(profile.name)}-kit-storefy.zip`, zip, 'application/zip');
  };

  if (mode === 'profile') return (
    <section className="space-y-6 text-left">
      <header><p className="text-xs font-black uppercase tracking-[.28em] text-brand-500">Perfil social automatico</p><h1 className="mt-2 font-display text-3xl font-bold text-white">Uma presenca que conversa com sua vitrine.</h1><p className="mt-2 text-sm text-slate-400">Nome, @, bio e CTA usam o mesmo nicho, identidade e WhatsApp da operacao ativa.</p></header>
      <div className="grid gap-5 lg:grid-cols-[.8fr_1.2fr]"><div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[.09] to-white/[.02] p-6"><div className="flex items-center gap-3"><div className="grid h-14 w-14 place-items-center rounded-2xl text-black" style={{ backgroundColor: niche.accent }}><UserRound /></div><div><p className="font-black text-white">{profile.name}</p><p className="text-sm text-slate-400">{profile.handle}</p></div></div><p className="mt-6 whitespace-pre-line text-sm leading-6 text-slate-200">{profile.bio}</p><div className="mt-6 flex flex-wrap gap-2">{profile.channels.map((channel) => <span key={channel} className="rounded-full border border-white/10 px-3 py-1 text-xs font-bold text-slate-300">{channel === 'instagram' ? 'Instagram' : 'Music2'}</span>)}</div></div><div className="space-y-4 rounded-3xl border border-white/10 bg-white/[.03] p-6"><label className="block text-xs font-black uppercase tracking-wider text-slate-400">@ sugerido<input value={profile.handle} onChange={(event) => saveOperation({ profileHandle: event.target.value })} className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-3 text-sm text-white outline-none" /></label><label className="block text-xs font-black uppercase tracking-wider text-slate-400">Bio<input value={profile.bio} onChange={(event) => saveOperation({ profileBio: event.target.value })} className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-3 text-sm text-white outline-none" /></label><button onClick={() => copy(`${profile.handle}\n${profile.bio}`)} className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-black text-black"><Copy size={16} /> Copiar perfil</button></div></div>
    </section>
  );

  if (mode === 'videos') return (
    <section className="space-y-7 text-left">
      {generating && <GenerationOverlay />}
      {generatedVideo && <GeneratedVideoPreview generatedVideo={generatedVideo} onClose={() => setGeneratedVideo(null)} onDownload={() => downloadBlob(generatedVideo.fileName, generatedVideo.blob, generatedVideo.mimeType)} />}
      {!videoLibraryPage ? <>
        <header><p className="text-xs font-black uppercase tracking-[.28em] text-brand-500">Videos automaticos</p><h1 className="mt-2 font-display text-3xl font-bold text-white">Escolha o tipo de video.</h1><p className="mt-2 max-w-3xl text-sm text-slate-400">Primeiro escolha uma entrada. A capa de Influencer IA pode usar GIF, mas dentro da biblioteca aparecem apenas os modelos/personas.</p></header>
        <div className="grid max-w-3xl gap-5 sm:grid-cols-2">
          <VideoCard title="Video viral de moldura" description="Entra na biblioteca de videos viralizados. A Storefy usa o video base e aplica por cima a moldura, @ e legenda da operacao." icon={<LayoutTemplate size={22} />} active={activeVideoLibrary === 'frame'} onChoose={() => chooseVideoLibrary('frame')} accent={viralVideo.color} phrase={viralVideo.hook} mediaUrl={viralVideo.previewGif || viralVideo.baseVideoUrl} badge="Moldura + @" />
          <VideoCard title="Video Influencer IA" description="Escolha uma modelo IA e gere um criativo com a legenda da sua loja." icon={<Film size={22} />} active={activeVideoLibrary === 'caption'} onChoose={() => chooseVideoLibrary('caption')} accent={influencer.color} phrase={influencer.name} mediaUrl={influencerCover} badge="Legenda IA" />
        </div>
      </> : <>
        <header className="flex flex-wrap items-start justify-between gap-4"><div><button onClick={() => { setVideoLibraryPage(null); setGeneratedVideo(null); }} className="mb-4 inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs font-black text-white hover:bg-white/[.06]"><ChevronLeft size={15} /> Voltar aos tipos</button><p className="text-xs font-black uppercase tracking-[.28em] text-brand-500">{videoLibraryPage === 'frame' ? 'Biblioteca de moldura' : 'Biblioteca de modelos IA'}</p><h1 className="mt-2 font-display text-3xl font-bold text-white">{videoLibraryPage === 'frame' ? 'Escolha um video viralizado base' : 'Escolha uma modelo'}</h1><p className="mt-2 max-w-3xl text-sm text-slate-400">{videoLibraryPage === 'frame' ? 'O video base fica por baixo. A Storefy aplica apenas a moldura, @ e legenda em cima.' : 'Cada card representa uma persona. Escolha uma modelo para criar o video com a legenda da sua loja.'}</p></div></header>
        <div className="rounded-3xl border border-white/10 bg-white/[.035] p-5">
          <div className="flex flex-wrap items-end justify-between gap-4"><div className="w-full max-w-lg space-y-3"><label className="block text-xs font-black uppercase tracking-wider text-slate-400">Legenda/CTA sobreposto<input value={selectedVideoCaption} onChange={(event) => { setVideoCaption(event.target.value); saveOperation({ videoCta: event.target.value }); }} className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-3 text-sm normal-case tracking-normal text-white outline-none" /></label><button type="button" onClick={() => toggleWatermark(!showWatermark)} className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-black/25 px-3 py-3 text-left transition hover:bg-white/[.05]"><span><b className="block text-xs font-black uppercase tracking-wider text-white">Marca d'agua do perfil</b><small className="mt-1 block text-xs text-slate-400">Mostrar o {profile.handle} por cima do video.</small></span><span className={`rounded-full px-3 py-1 text-[11px] font-black ${showWatermark ? 'bg-emerald-400/15 text-emerald-300' : 'bg-white/10 text-slate-300'}`}>{showWatermark ? 'Ativa' : 'Oculta'}</span></button></div><button onClick={() => generateVideo(videoLibraryPage)} disabled={generating !== null} className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-3 text-sm font-black text-black disabled:opacity-60"><Play size={16} /> {generating ? 'Gerando preview...' : videoLibraryPage === 'frame' ? 'Gerar preview com moldura' : 'Gerar preview com legenda'}</button></div>
          {videoLibraryPage === 'frame' ? <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{VIRAL_LIBRARY.map((item) => {
            const selected = viralVideo.id === item.id;
            return <button key={item.id} onClick={() => { setViralVideoId(item.id); setGeneratedVideo(null); saveOperation({ videoFormat: 'frame' }); }} className={`overflow-hidden rounded-2xl border text-left ${selected ? 'border-brand-500 bg-brand-500/10' : 'border-white/10 bg-black/20 hover:bg-white/[.05]'}`}><div className="aspect-[9/12] p-4" style={{ background: `linear-gradient(145deg, ${item.color}dd, #111827 58%, #050507)` }}>{item.previewGif ? (isVideoAsset(item.previewGif) ? <PreviewVideo src={item.previewGif} active={selected} className="h-full w-full rounded-xl object-cover object-center" /> : <img src={item.previewGif} alt="" className="h-full w-full rounded-xl object-cover object-center" />) : <div className="flex h-full flex-col justify-between rounded-xl border border-white/15 bg-black/30 p-4"><span className="text-[11px] font-black uppercase tracking-[.2em] text-white/70">Preview aqui</span><b className="font-display text-2xl leading-tight text-white">{item.hook}</b><small className="text-white/70">base viral</small></div>}</div><div className="p-4"><b className="block text-sm text-white">{item.title}</b><span className="mt-1 block text-xs leading-5 text-slate-400">{item.caption}</span>{selected && <span className="mt-3 inline-flex text-[11px] font-black text-brand-500">Selecionado</span>}</div></button>;
          })}</div> : <div className="mt-5 grid gap-3 md:grid-cols-3">{INFLUENCER_LIBRARY.map((item) => <InfluencerModelCard key={item.id} model={item} selected={influencer.id === item.id} onChoose={() => { setInfluencerId(item.id); setGeneratedVideo(null); saveOperation({ videoFormat: 'caption' }); }} />)}</div>}
        </div>
      </>}
    </section>
  );


  if (mode === 'promotion') return (
    <section className="space-y-7 text-left">
      <header className="rounded-3xl border border-brand-500/25 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,.16),transparent_34%),rgba(255,255,255,.035)] p-6 sm:p-8">
        <p className="text-xs font-black uppercase tracking-[.28em] text-brand-500">Divulgacao da loja</p>
        <h1 className="mt-3 max-w-3xl font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">Agora escolha como colocar essa vitrine na rua.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">Depois de visualizar a loja, o fluxo continua por dois caminhos: conteudos para atrair atencao ou anuncio gratis em grupos.</p>
      </header>

      <div className="grid gap-5 lg:grid-cols-2">
        <article className="rounded-3xl border border-white/10 bg-white/[.035] p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[.22em] text-brand-500">Conteudos</p>
              <h2 className="mt-2 font-display text-2xl font-bold text-white">Criativos para postar</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">Use a biblioteca de videos para criar um conteudo viral ou uma peca com influencer IA antes de divulgar a loja.</p>
            </div>
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-500/15 text-brand-500"><Film size={22} /></div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button onClick={() => onOpenSection('videos')} className="rounded-2xl border border-white/10 bg-black/20 p-4 text-left transition hover:border-brand-500/40 hover:bg-white/[.06]">
              <Sparkles className="text-brand-500" size={19} />
              <b className="mt-3 block text-sm text-white">Conteudo viral</b>
              <span className="mt-1 block text-xs leading-5 text-slate-400">Entrar nos videos de moldura e escolher uma base viral.</span>
            </button>
            <button onClick={() => onOpenSection('videos')} className="rounded-2xl border border-white/10 bg-black/20 p-4 text-left transition hover:border-brand-500/40 hover:bg-white/[.06]">
              <UserRound className="text-brand-500" size={19} />
              <b className="mt-3 block text-sm text-white">Influencer IA</b>
              <span className="mt-1 block text-xs leading-5 text-slate-400">Escolher uma modelo e gerar o video com o texto da loja.</span>
            </button>
          </div>
        </article>

        <article className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[.07] to-white/[.025] p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[.22em] text-brand-500">Anuncio gratis</p>
              <h2 className="mt-2 font-display text-2xl font-bold text-white">Publicar em grupos do Facebook</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">Mantem o caminho que ja existia: copiar a chamada da vitrine e postar em grupos, comunidades e espacos gratuitos.</p>
            </div>
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/10 text-white"><MessageCircle size={22} /></div>
          </div>
          <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-xs font-black uppercase tracking-[.18em] text-slate-500">Fluxo sugerido</p>
            <ol className="mt-3 space-y-2 text-sm text-slate-300">
              <li>1. Copie a chamada pronta.</li>
              <li>2. Entre em grupos ligados ao nicho.</li>
              <li>3. Poste com o link da vitrine.</li>
            </ol>
          </div>
          <button onClick={() => onOpenSection('marketing')} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-sm font-black text-black"><Send size={16} /> Abrir anuncio gratis</button>
        </article>
      </div>
    </section>
  );

  if (mode === 'calendar') return (
    <section className="space-y-6 text-left"><header><p className="text-xs font-black uppercase tracking-[.28em] text-brand-500">Calendario de postagem</p><h1 className="mt-2 font-display text-3xl font-bold text-white">Sete dias de execucao, ja organizados.</h1></header><div className="grid gap-4 xl:grid-cols-2">{calendar.map((day) => <article key={day.day} className="rounded-2xl border border-white/10 bg-white/[.035] p-5"><div className="flex items-center justify-between"><h2 className="font-display text-xl font-bold text-white">{day.day}</h2><span className="text-xs font-bold text-brand-500">{day.focus}</span></div><div className="mt-4 space-y-3">{day.posts.map((post) => <div key={`${day.day}-${post.time}`} className="rounded-xl border border-white/5 bg-black/20 p-3"><p className="text-xs font-black text-white">{post.time} - {post.channel}</p><p className="mt-1 text-xs text-slate-300">{post.action}</p><button onClick={() => copy(post.caption)} className="mt-2 text-[11px] font-black text-brand-500">Copiar legenda</button></div>)}</div></article>)}</div></section>
  );

  if (mode === 'export') return (
    <section className="space-y-6 text-left">
      <header>
        <p className="text-xs font-black uppercase tracking-[.28em] text-brand-500">Exportar kit</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-white">Leve a operacao pronta para publicar.</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Baixe a vitrine HTML, copies, perfil social e calendario em um unico pacote.</p>
      </header>
      <div className="grid gap-5 lg:grid-cols-2">
        <article className="rounded-3xl border border-white/10 bg-white/[.035] p-6">
          <PackageCheck className="text-brand-500" size={24} />
          <h2 className="mt-4 font-display text-2xl font-bold text-white">Kit Storefy</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">Inclui vitrine, textos de postagem, bio do perfil e calendario de sete dias.</p>
          <button onClick={exportKit} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-3 text-sm font-black text-black">
            <Download size={16} /> Baixar kit
          </button>
        </article>
        <article className="rounded-3xl border border-brand-500/25 bg-brand-500/10 p-6">
          <Sparkles className="text-brand-500" size={24} />
          <h2 className="mt-4 font-display text-2xl font-bold text-white">Publicar vitrine</h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">Se quiser, publique a loja agora e use o link no WhatsApp, grupos e redes sociais.</p>
          <button onClick={async () => {
            setPublishState('Publicando...');
            const result = await onPublish();
            setPublishState(result.error ? result.error : 'Publicado: ' + result.url);
          }} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-black text-black">
            <Send size={16} /> Publicar
          </button>
          {publishState && <p className="mt-4 break-words text-xs font-bold text-slate-300">{publishState}</p>}
        </article>
      </div>
    </section>
  );

  const selectedCount = selectedProducts.length;

  return (
    <section className="space-y-7 text-left">
      <header className="rounded-3xl border border-brand-500/25 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,.18),transparent_34%),rgba(255,255,255,.035)] p-6 sm:p-8">
        <p className="text-xs font-black uppercase tracking-[.28em] text-brand-500">Nova operacao de nicho</p>
        <h1 className="mt-3 max-w-3xl font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">Responda o essencial. A Storefy organiza o resto.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">Nicho &gt; identidade &gt; canais &gt; produtos &gt; estrutura da loja &gt; divulgacao.</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {['Nicho', 'Identidade', 'Canais', 'Produtos', 'Loja', 'Divulgacao'].map((item, index) => (
            <span key={item} className={'rounded-full px-3 py-1.5 text-xs font-black ' + (step === index + 1 ? 'bg-brand-500 text-black' : step > index + 1 ? 'bg-emerald-400/15 text-emerald-300' : 'bg-white/[.06] text-slate-500')}>
              {index + 1}. {item}
            </span>
          ))}
        </div>
      </header>

      {step === 1 && (
        <div className="border-t border-white/10 pt-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-2xl font-bold text-white">1. Escolha seu nicho de atuação</h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">Isso nos ajuda a pré-configurar os produtos com maior potencial de venda para sua operação inicial.</p>
          </div>
          <div className="mt-7 grid gap-4 lg:grid-cols-2">
            {OPERATION_NICHES.filter((item) => FEATURED_NICHE_IDS.includes(item.id)).map((item) => {
              const cardMeta = NICHE_CARD_META[item.id] || { icon: <Sparkles size={23} />, tags: item.hashtags };
              const active = niche.id === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => chooseNiche(item.id)}
                  className={'group relative flex min-h-[116px] items-start gap-4 rounded-2xl border p-5 text-left transition duration-200 ' + (active ? 'border-brand-500 bg-brand-500/10 shadow-[0_0_0_1px_rgba(212,175,55,.18),0_20px_70px_rgba(212,175,55,.08)]' : 'border-white/10 bg-gradient-to-br from-white/[.045] to-white/[.018] hover:border-white/20 hover:bg-white/[.06]')}
                >
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[.06] text-slate-200 transition group-hover:scale-105" style={active ? { color: item.accent, backgroundColor: `${item.accent}18`, borderColor: `${item.accent}55` } : undefined}>
                    {cardMeta.icon}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-start justify-between gap-3">
                      <b className="block text-base text-white">{item.name}</b>
                      {active && <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-500 text-black"><Check size={13} strokeWidth={4} /></span>}
                    </span>
                    <span className="mt-1 block text-sm leading-5 text-slate-400">{item.description}</span>
                    <span className="mt-3 flex flex-wrap gap-1.5">
                      {cardMeta.tags.map((tag) => (
                        <span key={tag} className="rounded-md border border-white/10 bg-white/[.065] px-2 py-1 font-mono text-[10px] font-black text-slate-300">{tag}</span>
                      ))}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="grid gap-5 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-bold text-white">2. De um nome e atendimento a operacao</h2>
            <p className="mt-2 text-sm text-slate-400">A Storefy sugere um nome, mas voce pode personalizar.</p>
          </div>
          <div className="space-y-4 rounded-2xl border border-white/10 bg-white/[.03] p-5">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-400">Nome
              <input value={name} onChange={(event) => setName(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-3 text-white outline-none" />
            </label>
            <button onClick={() => setName(getSuggestedOperationName(niche, 1))} className="text-xs font-black text-brand-500">Sugerir outro nome</button>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-400">WhatsApp
              <input value={whatsapp} onChange={(event) => setWhatsapp(event.target.value)} placeholder="5511999999999" className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-3 text-white outline-none" />
            </label>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2 className="font-display text-2xl font-bold text-white">3. Onde voce vai postar?</h2>
          <p className="mt-2 text-sm text-slate-400">Os textos, o calendario e os videos serao montados para os canais escolhidos.</p>
          <div className="mt-5 flex flex-wrap gap-4">
            {([{ id: 'instagram', label: 'Instagram', icon: Instagram }, { id: 'tiktok', label: 'TikTok', icon: Music2 }] as const).map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => toggleChannel(id)} className={'flex min-w-52 items-center gap-3 rounded-2xl border p-5 text-left ' + (channels.includes(id) ? 'border-brand-500 bg-brand-500/10' : 'border-white/10 bg-white/[.03]')}>
                <Icon className="text-brand-500" />
                <span><b className="block text-white">{label}</b><small className="text-slate-400">{channels.includes(id) ? 'Incluido no plano' : 'Adicionar canal'}</small></span>
                {channels.includes(id) && <Check className="ml-auto text-emerald-400" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 4 && (
        <div>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl font-bold text-white">4. Monte a vitrine com produtos dos fornecedores</h2>
              <p className="mt-2 text-sm text-slate-400">{relevantProducts.length} produtos relacionados a {niche.name}, organizados por prioridade do nicho. A vitrine vai usar somente os produtos marcados aqui.</p>
            </div>
            <span className="rounded-full bg-brand-500 px-3 py-2 text-xs font-black text-black">{selectedCount} selecionados</span>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {relevantProducts.slice(0, 48).map((product) => (
              <article key={product.id} className={'rounded-2xl border p-4 ' + (product.addedToStore ? 'border-brand-500/70 bg-brand-500/10' : 'border-white/10 bg-white/[.03]')}>
                {(() => {
                  const profit = product.salePrice - product.costPrice;
                  const marginPercent = product.salePrice > 0 ? Math.round((profit / product.salePrice) * 100) : 0;
                  const markupPercent = product.costPrice > 0 ? Math.round((profit / product.costPrice) * 100) : 0;
                  const isEditingPrice = editingPriceId === product.id;

                  return (
                    <>
                      <div className="flex gap-3">
                        <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-xl bg-black/30">
                          {product.imageUrl ? <img src={product.imageUrl} alt="" className="h-full w-full object-cover" /> : <PackageCheck size={18} className="text-slate-500" />}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-white">{product.name}</p>
                          <p className="mt-1 text-[11px] text-slate-400">{typeFor(product)} - {product.supplier}</p>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl border border-white/10 bg-black/20 p-3">
                        <div>
                          <span className="block text-[10px] font-black uppercase tracking-wider text-slate-500">Custo</span>
                          <b className="mt-1 block text-xs text-slate-200">{formatMoney(product.costPrice)}</b>
                        </div>
                        <div className="col-span-2">
                          <span className="block text-[10px] font-black uppercase tracking-wider text-slate-500">Quero vender por</span>
                          {isEditingPrice ? (
                            <div className="mt-1 flex gap-1.5">
                              <input
                                value={tempPrice}
                                onChange={(event) => setTempPrice(event.target.value)}
                                onKeyDown={(event) => {
                                  if (event.key === 'Enter') savePriceEdit(product);
                                  if (event.key === 'Escape') setEditingPriceId(null);
                                }}
                                autoFocus
                                className="min-w-0 flex-1 rounded-lg border border-brand-500/40 bg-black/50 px-2 py-1 text-xs font-black text-white outline-none"
                              />
                              <button type="button" onClick={() => savePriceEdit(product)} className="rounded-lg bg-brand-500 px-2 py-1 text-[10px] font-black text-black">OK</button>
                            </div>
                          ) : (
                            <button type="button" onClick={() => startPriceEdit(product)} className="mt-1 text-left text-sm font-black text-brand-500">
                              {formatMoney(product.salePrice)}
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap gap-2 text-[11px] font-black">
                          <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-emerald-300">Lucro {formatMoney(profit)}</span>
                          <span className="rounded-full bg-white/[.06] px-2.5 py-1 text-slate-300">Margem {marginPercent}%</span>
                          <span className="rounded-full bg-white/[.06] px-2.5 py-1 text-slate-300">Markup {markupPercent}%</span>
                        </div>
                        <button type="button" onClick={() => onToggleAddProduct(product.id)} className={'rounded-lg px-3 py-2 text-xs font-black ' + (product.addedToStore ? 'bg-white text-black' : 'bg-brand-500 text-black')}>
                          {product.addedToStore ? 'Remover' : 'Adicionar'}
                        </button>
                      </div>
                    </>
                  );
                })()}
              </article>
            ))}
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="grid gap-5 lg:grid-cols-[1.05fr_.95fr]">
          <article className="rounded-3xl border border-white/10 bg-white/[.035] p-6">
            <p className="text-xs font-black uppercase tracking-[.28em] text-brand-500">Estrutura da loja</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-white">Defina como a vitrine vai aparecer para o cliente.</h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">Aqui ficam os dados finais da loja: WhatsApp, texto principal, chamada do botao e layout visual.</p>

            <div className="mt-6 grid gap-4">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-400">WhatsApp de atendimento
                <input value={whatsapp} onChange={(event) => { setWhatsapp(event.target.value); saveOperation({ whatsapp: event.target.value }); }} placeholder="5511999999999" className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-3 text-sm normal-case tracking-normal text-white outline-none" />
              </label>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-400">Titulo da loja
                <input value={storeConfig.heroTitle || name || storeConfig.name} onChange={(event) => saveOperation({ heroTitle: event.target.value })} className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-3 text-sm normal-case tracking-normal text-white outline-none" />
              </label>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-400">Subtitulo / promessa
                <textarea value={storeConfig.heroSubtitle || 'Escolha o produto, veja detalhes e envie o pedido direto no WhatsApp.'} onChange={(event) => saveOperation({ heroSubtitle: event.target.value })} rows={3} className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-3 text-sm normal-case tracking-normal text-white outline-none" />
              </label>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-400">Texto do botao principal
                <input value={storeConfig.ctaLabel || 'Ver produtos'} onChange={(event) => saveOperation({ ctaLabel: event.target.value })} className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-3 text-sm normal-case tracking-normal text-white outline-none" />
              </label>
            </div>
          </article>

          <aside className="rounded-3xl border border-brand-500/30 bg-[radial-gradient(circle_at_top,rgba(212,175,55,.18),transparent_42%),rgba(255,255,255,.035)] p-6">
            <p className="text-xs font-black uppercase tracking-[.22em] text-brand-500">Layout</p>
            <h3 className="mt-3 font-display text-2xl font-bold text-white">Escolha a cara da loja</h3>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {([
                { id: 'obsidian', name: 'Dark premium', hint: 'Escuro, elegante e direto.', bg: '#050507', surface: '#18181b', card: '#0b0b10', text: '#ffffff', accent: storeConfig.primaryColor || '#d4af37' },
                { id: 'aurora', name: 'Neon glass', hint: 'Moderno, roxo e chamativo.', bg: '#050312', surface: '#312e81', card: '#111827', text: '#ffffff', accent: '#8b5cf6' },
                { id: 'clean', name: 'Clean claro', hint: 'Claro, simples e confiavel.', bg: '#f8fafc', surface: '#ffffff', card: '#e2e8f0', text: '#0f172a', accent: '#0ea5e9' },
                { id: 'market', name: 'Oferta pop', hint: 'Forte para promoções e preço.', bg: '#09090b', surface: '#7c2d12', card: '#1f2937', text: '#fff7ed', accent: '#f97316' }
              ] as const).map((theme) => {
                const active = (storeConfig.themePreset || 'obsidian') === theme.id;

                return (
                  <button key={theme.id} type="button" onClick={() => saveOperation({ themePreset: theme.id, primaryColor: theme.accent })} className={'group overflow-hidden rounded-2xl border text-left transition hover:-translate-y-0.5 ' + (active ? 'border-brand-500 bg-brand-500/10 shadow-[0_0_0_1px_rgba(212,175,55,.18)]' : 'border-white/10 bg-black/20 hover:bg-white/[.06]')}>
                    <div className="p-3" style={{ background: theme.bg }}>
                      <div className="overflow-hidden rounded-xl border border-white/10" style={{ background: theme.surface }}>
                        <div className="flex items-center justify-between gap-2 border-b border-black/10 p-2">
                          <span className="h-3 w-16 rounded-full" style={{ background: theme.text, opacity: .85 }} />
                          <span className="h-4 w-10 rounded-full" style={{ background: theme.accent }} />
                        </div>
                        <div className="grid gap-2 p-2">
                          <span className="h-5 w-4/5 rounded-lg" style={{ background: theme.text, opacity: .9 }} />
                          <span className="h-3 w-3/5 rounded-lg" style={{ background: theme.text, opacity: .45 }} />
                          <div className="grid grid-cols-3 gap-1.5 pt-1">
                            {[0, 1, 2].map((item) => (
                              <span key={item} className="h-12 rounded-lg border border-black/10" style={{ background: theme.card }} />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <span>
                          <b className="block text-sm text-white">{theme.name}</b>
                          <small className="mt-1 block text-xs text-slate-400">{theme.hint}</small>
                        </span>
                        {active && <span className="rounded-full bg-brand-500 px-2 py-1 text-[10px] font-black text-black">Ativo</span>}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            <label className="mt-5 block text-xs font-black uppercase tracking-wider text-slate-400">Cor principal
              <input type="color" value={storeConfig.primaryColor || niche.accent} onChange={(event) => saveOperation({ primaryColor: event.target.value })} className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-black/30 p-1" />
            </label>
            <button type="button" onClick={() => { saveOperation(); onPreview(5); }} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 px-4 py-3 text-sm font-black text-black">
              <Store size={16} /> Ver loja agora
            </button>
          </aside>
        </div>
      )}

      {step === 6 && (
        <div className="grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
          <article className="rounded-3xl border border-white/10 bg-white/[.035] p-6">
            <p className="text-xs font-black uppercase tracking-[.28em] text-brand-500">Divulgacao</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-white">Sua loja esta pronta para ganhar trafego.</h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">Antes de divulgar, confira a vitrine. Quando voltar, voce continua exatamente nesta etapa.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button onClick={() => { const selectedIds = selectedProducts.map((product) => product.id); saveOperation({ productIds: selectedIds }); onPreview(step, selectedIds); }} className="rounded-2xl border border-brand-500/40 bg-brand-500/10 p-5 text-left transition hover:bg-brand-500/15">
                <Store className="text-brand-500" size={22} />
                <b className="mt-4 block text-white">Ver loja</b>
                <span className="mt-1 block text-xs leading-5 text-slate-400">Visualizar a vitrine gerada com os produtos selecionados.</span>
              </button>
              <button onClick={() => onOpenSection('promotion')} className="rounded-2xl border border-white/10 bg-black/20 p-5 text-left transition hover:bg-white/[.06]">
                <Sparkles className="text-brand-500" size={22} />
                <b className="mt-4 block text-white">Ir para divulgacao</b>
                <span className="mt-1 block text-xs leading-5 text-slate-400">Escolher conteudos ou anuncio gratis em grupos.</span>
              </button>
            </div>
          </article>
          <aside className="rounded-3xl border border-brand-500/30 bg-[radial-gradient(circle_at_top,rgba(212,175,55,.18),transparent_42%),rgba(255,255,255,.035)] p-6">
            <p className="text-xs font-black uppercase tracking-[.22em] text-brand-500">Resumo</p>
            <h3 className="mt-3 font-display text-2xl font-bold text-white">{name || profile.name}</h3>
            <div className="mt-5 space-y-3 text-sm text-slate-300">
              <p><b className="text-white">{selectedCount}</b> produtos na vitrine</p>
              <p><b className="text-white">{channels.length}</b> canais preparados</p>
              <p><b className="text-white">{profile.handle}</b> como marca d'agua opcional</p>
            </div>
            <button onClick={async () => {
              setPublishState('Publicando...');
              const result = await onPublish();
              setPublishState(result.error ? result.error : 'Publicado: ' + result.url);
            }} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-3 text-sm font-black text-black">
              <Send size={16} /> Publicar vitrine
            </button>
            {publishState && <p className="mt-4 break-words text-xs font-bold text-slate-300">{publishState}</p>}
          </aside>
        </div>
      )}

      <footer className="flex items-center justify-between border-t border-white/10 pt-5">
        <button disabled={step === 1} onClick={() => setStep((value) => Math.max(1, value - 1))} className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm font-bold text-white disabled:opacity-30">
          <ChevronLeft size={16} /> Voltar
        </button>
        <button onClick={() => { if (step === 4) saveOperation({ productIds: selectedProducts.map((product) => product.id) }); else saveOperation(); if (step < 6) setStep((value) => value + 1); else onOpenSection('promotion'); }} className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2 text-sm font-black text-black">
          {step === 6 ? 'Abrir divulgacao' : 'Continuar'} <ChevronRight size={16} />
        </button>
      </footer>
    </section>
  );
}


function isVideoAsset(url?: string) {
  return Boolean(url && /\.(mp4|webm|ogg)(\?.*)?$/i.test(url));
}

function VideoCard({ title, description, icon, active, onChoose, accent, phrase, mediaUrl, badge }: { title: string; description: string; icon: React.ReactNode; active: boolean; onChoose: () => void; accent: string; phrase: string; mediaUrl?: string; badge: string }) {
  const isVideo = isVideoAsset(mediaUrl);
  return <button onClick={onChoose} className={`group overflow-hidden rounded-2xl border text-left transition hover:-translate-y-0.5 ${active ? 'border-brand-500 bg-brand-500/10 shadow-[0_0_0_1px_rgba(212,175,55,.18)]' : 'border-white/10 bg-white/[.03] hover:bg-white/[.06]'}`}><div className="aspect-[9/14] p-3" style={{ background: `linear-gradient(145deg, ${accent}cc, #10111b 58%, #050507)` }}>{mediaUrl ? (isVideo ? <PreviewVideo src={mediaUrl} active={active} className="h-full w-full rounded-xl object-cover object-center" /> : <img src={mediaUrl} alt="" className="h-full w-full rounded-xl object-cover object-center" />) : <div className="flex h-full flex-col justify-between rounded-xl border border-white/25 bg-black/25 p-4"><span className="flex items-center justify-between text-white">{icon}<b className="rounded-full bg-white/15 px-2.5 py-1 text-[10px] uppercase tracking-wider">{badge}</b></span><p className="line-clamp-2 font-display text-2xl font-black leading-tight text-white">{phrase}</p><span className="text-xs font-bold text-white/70">Preview 9:16</span></div>}</div><div className="p-4"><h2 className="font-display text-lg font-bold text-white">{title}</h2><p className="mt-1 text-xs leading-5 text-slate-400">{description}</p><span className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-black text-black">Entrar <ChevronRight size={14} /></span></div></button>;
}


function PreviewVideo({ src, active, className }: { src: string; active: boolean; className: string }) {
  const ref = React.useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (active) {
      video.play().catch(() => undefined);
    } else {
      video.pause();
      try { video.currentTime = 0; } catch { /* ignore seek failures */ }
    }
  }, [active, src]);

  return <video ref={ref} src={src} className={className} muted loop playsInline preload={active ? 'metadata' : 'none'} />;
}

function InfluencerModelCard({ model, selected, onChoose }: { key?: string; model: InfluencerModel; selected: boolean; onChoose: () => void }) {
  return <button onClick={onChoose} className={`overflow-hidden rounded-2xl border text-left transition hover:-translate-y-0.5 ${selected ? 'border-brand-500 bg-brand-500/10' : 'border-white/10 bg-black/20 hover:bg-white/[.05]'}`}><div className="aspect-[4/5] p-4" style={{ background: `linear-gradient(145deg, ${model.color}cc, #111827 58%, #050507)` }}>{model.photoUrl ? <img src={model.photoUrl} alt="" className="h-full w-full rounded-xl object-cover object-center" /> : <div className="flex h-full flex-col justify-between rounded-xl border border-dashed border-white/25 bg-black/30 p-4"><span className="grid h-14 w-14 place-items-center rounded-full text-lg font-black text-black" style={{ backgroundColor: model.color }}>{model.name.slice(0, 1)}</span><div><b className="block font-display text-3xl leading-tight text-white">{model.name}</b><small className="mt-2 block text-white/70">Foto da persona aqui</small></div></div>}</div><div className="p-4"><b className="block text-sm text-white">{model.name}</b><span className="mt-1 block text-xs text-slate-400">{model.style}</span>{selected && <span className="mt-3 inline-flex text-[11px] font-black text-brand-500">Selecionada</span>}</div></button>;
}

function GenerationOverlay() {
  const phrases = ['Preparando o criativo', 'Dando ritmo ao video', 'Ajustando o visual', 'Montando a previa'];
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setPhraseIndex((value) => (value + 1) % phrases.length), 1100);
    return () => window.clearInterval(timer);
  }, [phrases.length]);

  const phrase = phrases[phraseIndex];
  return <div className="fixed inset-0 z-[80] grid min-h-dvh place-items-center bg-[#030305]/95 p-4"><div className="w-full max-w-sm rounded-3xl border border-brand-500/30 bg-[#0b0b10] p-6 text-center shadow-2xl"><div className="mx-auto grid h-16 w-16 animate-spin place-items-center rounded-full border-4 border-white/10 border-t-brand-500" /><p className="mt-5 text-xs font-black uppercase tracking-[.24em] text-brand-500">Gerando video</p><h3 className="mt-2 font-display text-2xl font-bold text-white">{phrase}</h3><p className="mt-2 text-sm leading-6 text-slate-400">Quase pronto para postar.</p></div></div>;
}

type ScheduledVideoPost = {
  id: string;
  date: string;
  time: string;
  channel: 'Instagram' | 'TikTok' | 'Facebook' | 'WhatsApp';
  status: 'Pronto' | 'IA ativa';
};

function GeneratedVideoPreview({ generatedVideo, onDownload, onClose }: { generatedVideo: { url: string; fileName: string; label: string }; onDownload: () => void; onClose: () => void }) {
  const dateFromNow = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().slice(0, 10);
  };
  const storageKey = `storefy.video.schedule.${generatedVideo.fileName}`;
  const defaultSchedule: ScheduledVideoPost[] = [
    { id: 'post-1', date: dateFromNow(1), time: '09:00', channel: 'Instagram', status: 'Pronto' },
    { id: 'post-2', date: dateFromNow(2), time: '12:30', channel: 'TikTok', status: 'Pronto' },
    { id: 'post-3', date: dateFromNow(3), time: '19:00', channel: 'Facebook', status: 'Pronto' }
  ];
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledVideoPost[]>(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      const parsed = raw ? JSON.parse(raw) : null;
      return Array.isArray(parsed) && parsed.length ? parsed : defaultSchedule;
    } catch {
      return defaultSchedule;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(scheduledPosts));
  }, [scheduledPosts, storageKey]);

  const updatePost = (id: string, patch: Partial<ScheduledVideoPost>) => {
    setScheduledPosts((items) => items.map((item) => item.id === id ? { ...item, ...patch } : item));
  };
  const addPost = () => {
    setScheduledPosts((items) => [
      ...items,
      { id: `post-${Date.now()}`, date: dateFromNow(items.length + 1), time: '18:00', channel: 'Instagram', status: 'Pronto' }
    ]);
  };
  const activateAll = () => setScheduledPosts((items) => items.map((item) => ({ ...item, status: 'IA ativa' })));
  const removePost = (id: string) => setScheduledPosts((items) => items.length === 1 ? items : items.filter((item) => item.id !== id));
  const activeCount = scheduledPosts.filter((item) => item.status === 'IA ativa').length;

  return (
    <div className="fixed inset-0 z-[80] grid min-h-dvh place-items-center overflow-y-auto bg-[#030305]/95 p-3 sm:p-5">
      <div className="grid w-full max-w-6xl gap-5 rounded-3xl border border-brand-500/30 bg-[#09090d] p-4 shadow-2xl lg:grid-cols-[310px_1fr]">
        <div className="space-y-4">
          <video src={generatedVideo.url} autoPlay controls loop muted playsInline preload="auto" className="mx-auto aspect-[9/16] w-full max-w-[310px] rounded-2xl bg-black object-cover" />
          <div className="flex flex-wrap gap-2">
            <button onClick={onDownload} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-black text-black"><Download size={16} /> Baixar</button>
            <button onClick={onClose} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[.04] px-4 py-3 text-sm font-black text-white">Outro video</button>
          </div>
        </div>

        <div className="p-2 lg:p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="w-fit rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-[11px] font-black uppercase tracking-[.22em] text-brand-500">Pronto para postar</span>
              <h3 className="mt-4 font-display text-3xl font-bold text-white">{generatedVideo.label}</h3>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">Agora organize os dias de postagem desse video. A IA publica nos canais marcados conforme o calendario abaixo.</p>
            </div>
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-right">
              <p className="text-[10px] font-black uppercase tracking-[.2em] text-emerald-300">Postagem IA</p>
              <b className="mt-1 block text-xl text-white">{activeCount}/{scheduledPosts.length}</b>
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-white/10 bg-black/20 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[.24em] text-brand-500">Ultimo passo</p>
                <h4 className="mt-1 font-display text-2xl font-bold text-white">Calendario de divulgacao</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={addPost} className="rounded-xl border border-white/10 bg-white/[.04] px-3 py-2 text-xs font-black text-white hover:bg-white/[.08]">Adicionar dia</button>
                <button onClick={activateAll} className="rounded-xl bg-brand-500 px-3 py-2 text-xs font-black text-black">Ativar postagem IA</button>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {scheduledPosts.map((post, index) => (
                <div key={post.id} className="grid gap-2 rounded-2xl border border-white/10 bg-white/[.035] p-3 md:grid-cols-[70px_1fr_110px_130px_95px_auto]">
                  <div className="rounded-xl bg-black/25 px-3 py-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Post</span>
                    <b className="block text-sm text-white">#{index + 1}</b>
                  </div>
                  <input type="date" value={post.date} onChange={(event) => updatePost(post.id, { date: event.target.value })} className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-xs font-bold text-white outline-none" />
                  <input type="time" value={post.time} onChange={(event) => updatePost(post.id, { time: event.target.value })} className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-xs font-bold text-white outline-none" />
                  <select value={post.channel} onChange={(event) => updatePost(post.id, { channel: event.target.value as ScheduledVideoPost['channel'] })} className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-xs font-bold text-white outline-none">
                    <option>Instagram</option>
                    <option>TikTok</option>
                    <option>Facebook</option>
                    <option>WhatsApp</option>
                  </select>
                  <button onClick={() => updatePost(post.id, { status: post.status === 'IA ativa' ? 'Pronto' : 'IA ativa' })} className={`rounded-xl px-3 py-2 text-xs font-black ${post.status === 'IA ativa' ? 'bg-emerald-400/15 text-emerald-300' : 'bg-white/10 text-slate-300'}`}>
                    {post.status}
                  </button>
                  <button onClick={() => removePost(post.id)} className="rounded-xl border border-white/10 px-3 py-2 text-xs font-black text-slate-400 hover:text-white">Remover</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


