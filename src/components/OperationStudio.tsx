import React, { useEffect, useMemo, useState } from 'react';
import {
  CalendarDays, Check, ChevronLeft, ChevronRight, Copy, Download, Film, Flame, Heart, Instagram,
  LayoutTemplate, MessageCircle, PackageCheck, Play, Send, Sparkles, Store, ThumbsUp,
  Music2, UserRound, Users
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
  onOpenSection: (section: string) => void;
  onPreview: (step?: number) => void;
  onPublish: () => Promise<{ mode: string; url: string; error?: string }>;
  onBuildHtml: () => string;
  initialStep?: number;
}

const typeFor = (product: Product) => product.category === 'Achados Fisicos'
  ? 'Fisico' : product.category === 'Assinaturas Digitais' ? 'Assinatura' : 'Digital';

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
  },
  {
    id: 'modelo-ia-04',
    name: 'Júlia IA',
    style: 'Estilo livre e criativos',
    caption: 'Persona personalizada para demonstração e ofertas de nicho.',
    color: '#10b981',
    photoUrl: '/images/influencers/julia-ia.png',
    coverGif: '/images/influencers/julia-ia.png',
    videos: [
      { id: 'julia-ia-01', label: 'Vídeo 01', previewGif: '/images/influencers/julia-ia.png', baseVideoUrl: '/videos/influencers/julia-ia-01.mp4' },
      { id: 'julia-ia-02', label: 'Vídeo 02', previewGif: '/images/influencers/julia-ia.png', baseVideoUrl: '/videos/influencers/julia-ia-02.mp4' },
      { id: 'julia-ia-03', label: 'Vídeo 03', previewGif: '/images/influencers/julia-ia.png', baseVideoUrl: '/videos/influencers/julia-ia-03.mp4' },
      { id: 'julia-ia-04', label: 'Vídeo 04', previewGif: '/images/influencers/julia-ia.png', baseVideoUrl: '/videos/influencers/julia-ia-04.mp4' }
    ]
  }
] as const;
export default function OperationStudio({
  mode, products, storeConfig, onUpdateStoreConfig, onToggleAddProduct, onOpenSection, onPreview, onPublish, onBuildHtml, initialStep = 1
}: OperationStudioProps) {
  const profile = getOperationProfile(storeConfig);
  const niche = getOperationNiche(storeConfig);
  const content = getContentPack(storeConfig, products);
  const calendar = getPostingCalendar(storeConfig);
  const relevantProducts = useMemo(() => getRelevantProducts(storeConfig, products), [storeConfig, products]);
  const selectedProducts = products.filter((product) => product.addedToStore);
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
      socialChannels: channels
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
  const influencerCover = 'https://pub-f2affceecf5a48aa8cf880891ff53318.r2.dev/ssstik.io_%40marakoltt_1783654456550.mp4';
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
    const renderScale = 0.75;
    const targetFps = 30;
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
      sourceVideo.muted = true;
      sourceVideo.preload = 'auto';
      sourceVideo.loop = true;
      sourceVideo.playsInline = true;
      sourceVideo.src = baseVideoUrl;
    }

    const stream = canvas.captureStream(targetFps);
    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp8') ? 'video/webm;codecs=vp8' : 'video/webm';
    const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 3000000 });
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
      context.fillStyle = '#07070a'; context.fillRect(0, 0, 720, 1280);
      const gradient = context.createLinearGradient(0, 0, 720, 1280);
      gradient.addColorStop(0, `${niche.accent}cc`);
      gradient.addColorStop(0.46, '#111827');
      gradient.addColorStop(1, '#050507');
      context.fillStyle = gradient;
      context.fillRect(0, 0, 720, 1280);
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

    const stopRecorder = () => {
      if (recorder.state === 'recording') recorder.stop();
    };

    let renderStarted = false;

    const drawCompositeFrame = (frame: number, progress: number) => {
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
        if (!sourceVideo || sourceVideo.readyState < 2) {
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
    };

    const startRender = (allowFallback = false) => {
      if (renderStarted || recorder.state === 'recording') return;
      if (sourceVideo && sourceVideo.readyState < 2 && !allowFallback) return;
      renderStarted = true;

      const sourceDuration = sourceVideo && Number.isFinite(sourceVideo.duration) && sourceVideo.duration > 0
        ? sourceVideo.duration
        : 8;
      const duration = Math.min(12, Math.max(6, sourceDuration));
      let animationFrame = 0;
      let frame = 1;

      if (sourceVideo) {
        sourceVideo.currentTime = 0;
        sourceVideo.play().catch(() => {
          // If autoplay is blocked, the canvas still renders the fallback frame instead of hanging.
        });
      }

      // Paint a complete, stable first frame before capture starts.
      drawCompositeFrame(0, 0);
      recorder.start();
      const startedAt = performance.now();
      const hardStop = window.setTimeout(stopRecorder, Math.ceil(duration * 1000) + 1500);

      const draw = () => {
        const elapsedSeconds = (performance.now() - startedAt) / 1000;
        const progress = Math.min(1, elapsedSeconds / duration);
        drawCompositeFrame(frame, progress);
        frame += 1;

        if (elapsedSeconds < duration && recorder.state === 'recording') {
          animationFrame = window.requestAnimationFrame(draw);
        } else {
          window.clearTimeout(hardStop);
          window.cancelAnimationFrame(animationFrame);
          stopRecorder();
        }
      };

      animationFrame = window.requestAnimationFrame(draw);
    };

    if (sourceVideo) {
      let fallbackTimer = window.setTimeout(() => startRender(true), 2500);
      sourceVideo.onloadedmetadata = () => {
        sourceVideo.currentTime = 0;
      };
      sourceVideo.onloadeddata = () => {
        window.clearTimeout(fallbackTimer);
        startRender();
      };
      sourceVideo.onerror = () => {
        window.clearTimeout(fallbackTimer);
        startRender(true);
      };
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
      <header><p className="text-xs font-black uppercase tracking-[.28em] text-brand-500">Perfil social automatico</p><h1 className="mt-2 font-sans text-3xl font-bold text-gray-900">Uma presenca que conversa com sua vitrine.</h1><p className="mt-2 text-sm text-gray-500">Nome, @, bio e CTA usam o mesmo nicho, identidade e WhatsApp da operacao ativa.</p></header>
      <div className="grid gap-5 lg:grid-cols-[.8fr_1.2fr]"><div className="rounded-3xl border border-gray-200 bg-gradient-to-br from-white/[.09] to-white/[.02] p-6"><div className="flex items-center gap-3"><div className="grid h-14 w-14 place-items-center rounded-xl text-black" style={{ backgroundColor: niche.accent }}><UserRound /></div><div><p className="font-black text-gray-900">{profile.name}</p><p className="text-sm text-gray-500">{profile.handle}</p></div></div><p className="mt-6 whitespace-pre-line text-sm leading-6 text-gray-700">{profile.bio}</p><div className="mt-6 flex flex-wrap gap-2">{profile.channels.map((channel) => <span key={channel} className="rounded-full border border-gray-200 px-3 py-1 text-xs font-bold text-gray-800">{channel === 'instagram' ? 'Instagram' : 'Music2'}</span>)}</div></div><div className="space-y-4 rounded-3xl border border-gray-200 bg-white/[.03] p-6"><label className="block text-xs font-black uppercase tracking-wider text-gray-500">@ sugerido<input value={profile.handle} onChange={(event) => saveOperation({ profileHandle: event.target.value })} className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-100 px-3 py-3 text-sm text-gray-900 outline-none" /></label><label className="block text-xs font-black uppercase tracking-wider text-gray-500">Bio<input value={profile.bio} onChange={(event) => saveOperation({ profileBio: event.target.value })} className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-100 px-3 py-3 text-sm text-gray-900 outline-none" /></label><button onClick={() => copy(`${profile.handle}\n${profile.bio}`)} className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-black text-black"><Copy size={16} /> Copiar perfil</button></div></div>
    </section>
  );

  if (mode === 'videos') return (
    <section className="space-y-6 text-left animate-fade-in">
      {generating && <GenerationOverlay />}
      {generatedVideo && <GeneratedVideoPreview generatedVideo={generatedVideo} content={content} calendar={calendar} profile={profile} products={selectedProducts} onClose={() => setGeneratedVideo(null)} onDownload={() => downloadBlob(generatedVideo.fileName, generatedVideo.blob, generatedVideo.mimeType)} />}
      
      {!videoLibraryPage ? <>
        <div className="mb-6">
          <h1 className="text-[22px] font-bold text-gray-900 tracking-tight">Vídeos automáticos</h1>
          <p className="text-[14px] text-gray-500 mt-1 leading-relaxed max-w-xl">
            Escolha o tipo de vídeo base para gerar seu criativo.
          </p>
        </div>
        <div className="grid max-w-3xl gap-5 sm:grid-cols-2">
          <VideoCard title="Vídeo viral de moldura" description="Use um vídeo base viralizado com a moldura e legenda da loja por cima." icon={<LayoutTemplate size={18} />} active={activeVideoLibrary === 'frame'} onChoose={() => chooseVideoLibrary('frame')} accent={viralVideo.color} phrase={viralVideo.hook} mediaUrl={viralVideo.previewGif || viralVideo.baseVideoUrl} badge="Moldura + @" />
          <VideoCard title="Vídeo Influencer IA" description="Escolha uma modelo IA e gere um criativo com a legenda da sua loja." icon={<Film size={18} />} active={activeVideoLibrary === 'caption'} onChoose={() => chooseVideoLibrary('caption')} accent={influencer.color} phrase={influencer.name} mediaUrl={influencerCover} badge="Legenda IA" />
        </div>
      </> : <>
        <div className="mb-6">
          <button onClick={() => { setVideoLibraryPage(null); setGeneratedVideo(null); }} className="mb-5 inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-[12px] font-semibold text-gray-700 hover:bg-gray-50 shadow-sm transition-colors"><ChevronLeft size={14} /> Voltar aos tipos</button>
          <h1 className="text-[22px] font-bold text-gray-900 tracking-tight">{videoLibraryPage === 'frame' ? 'Biblioteca de moldura' : 'Biblioteca de modelos IA'}</h1>
          <p className="text-[14px] text-gray-500 mt-1 leading-relaxed max-w-xl">{videoLibraryPage === 'frame' ? 'O vídeo base fica por baixo. A Storefy aplica apenas a moldura, @ e legenda em cima.' : 'Cada card representa uma persona. Escolha uma modelo para criar o vídeo com a legenda da sua loja.'}</p>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
            <div className="w-full max-w-lg space-y-4">
              <div>
                <label className="block text-[13px] font-bold text-gray-900 mb-1.5">Legenda / CTA sobreposto</label>
                <input value={selectedVideoCaption} onChange={(event) => { setVideoCaption(event.target.value); saveOperation({ videoCta: event.target.value }); }} className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-[13px] text-gray-900 outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200 shadow-sm transition-all" />
              </div>
              <button type="button" onClick={() => toggleWatermark(!showWatermark)} className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-left transition hover:bg-gray-100">
                <div>
                  <span className="block text-[13px] font-bold text-gray-900">Marca d'água do perfil</span>
                  <span className="mt-0.5 block text-[12px] text-gray-500">Mostrar o @{profile.handle} por cima do vídeo</span>
                </div>
                <span className={`rounded-md px-2.5 py-1 text-[11px] font-bold tracking-wide ${showWatermark ? 'bg-[#0f172a] text-white' : 'bg-gray-200 text-gray-600'}`}>{showWatermark ? 'ATIVA' : 'OCULTA'}</span>
              </button>
            </div>
            <button onClick={() => generateVideo(videoLibraryPage)} disabled={generating !== null} className="inline-flex h-[42px] items-center justify-center gap-2 rounded-lg bg-[#0f172a] hover:bg-[#1e293b] px-6 py-2.5 text-[13px] font-semibold text-white shadow-sm disabled:opacity-60 transition-colors w-full sm:w-auto shrink-0">
              <Play size={16} /> {generating ? 'Gerando...' : 'Gerar preview'}
            </button>
          </div>
        </div>

        {videoLibraryPage === 'frame' ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {VIRAL_LIBRARY.map((item) => (
              <button key={item.id} onClick={() => { setViralVideoId(item.id); setGeneratedVideo(null); saveOperation({ videoFormat: 'frame' }); }} className={`group overflow-hidden rounded-[24px] border text-left transition-all ${viralVideo.id === item.id ? 'border-[#0f172a] ring-1 ring-[#0f172a] shadow-md bg-gray-50' : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'}`}>
                <div className="aspect-[9/12] p-2.5">
                  <div className="w-full h-full rounded-[16px] overflow-hidden relative" style={{ background: `linear-gradient(145deg, ${item.color}dd, #111827 58%, #050507)` }}>
                    {item.previewGif ? (isVideoAsset(item.previewGif) ? <video src={item.previewGif} className="h-full w-full object-cover object-center" autoPlay loop muted playsInline preload="metadata" /> : <img src={item.previewGif} alt="" className="h-full w-full object-cover object-center" />) : <div className="flex h-full flex-col justify-between p-4 bg-gray-100"><span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Preview aqui</span><b className="font-sans text-xl leading-tight text-gray-900">{item.hook}</b></div>}
                  </div>
                </div>
                <div className="px-4 py-3">
                  <b className="block text-[13px] font-bold text-gray-900">{item.title}</b>
                  <span className="mt-0.5 block text-[12px] leading-snug text-gray-500">{item.caption}</span>
                  {viralVideo.id === item.id && <span className="mt-3 inline-block rounded-md bg-[#0f172a]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#0f172a]">Selecionado</span>}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {INFLUENCER_LIBRARY.map((item) => (
              <InfluencerModelCard key={item.id} model={item} selected={influencer.id === item.id} onChoose={() => { setInfluencerId(item.id); setGeneratedVideo(null); saveOperation({ videoFormat: 'caption' }); }} />
            ))}
          </div>
        )}
      </>}
    </section>
  );


  if (mode === 'promotion') return (
    <section className="space-y-10 text-left animate-fade-in">
      {/* Hero Header */}
      <div>
        <h1 className="text-[22px] font-bold text-gray-900 tracking-tight">Divulgação</h1>
        <p className="text-[14px] text-gray-500 mt-1 leading-relaxed max-w-xl">
          Escolha a melhor estratégia para atrair clientes e vender mais na sua loja.
        </p>
      </div>

      {/* Primary Actions - Two Big Cards */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* Card 1: Vídeos Virais */}
        <button
          onClick={() => onOpenSection('videos')}
          className="group relative overflow-hidden rounded-[24px] border border-gray-200 bg-white text-left transition-all duration-300 hover:-translate-y-1 hover:border-gray-200 [box-shadow:0_2px_8px_rgba(0,0,0,0.06)] hover:[box-shadow:0_8px_24px_rgba(0,0,0,0.22),0_2px_8px_rgba(0,0,0,0.08)]"
        >
          {/* Hero area with a clear video editor preview */}
          <div className="aspect-[16/9] min-h-[300px] w-full bg-[#151d2b] relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_52%_22%,rgba(245,158,11,0.16),transparent_43%)]" />
            <div className="absolute inset-x-0 top-0 h-px bg-white/15" />

            <div className="absolute left-1/2 top-[10%] w-[72%] max-w-[340px] -translate-x-1/2 overflow-hidden rounded-2xl border border-white/15 bg-[#0b101a] shadow-2xl transition-all duration-500 group-hover:-translate-y-2 group-hover:scale-[1.02]">
              <div className="flex h-8 items-center justify-between border-b border-white/10 px-3">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#f97316]" />
                  <span className="h-2 w-2 rounded-full bg-white/20" />
                  <span className="h-2 w-2 rounded-full bg-white/20" />
                </div>
                <span className="text-[8px] font-bold uppercase tracking-wider text-white/45">Prévia do criativo</span>
              </div>
              <div className="relative h-[116px] overflow-hidden bg-[#263247]">
                <div className="absolute left-5 top-5 h-14 w-20 rotate-[-5deg] rounded-lg border border-white/10 bg-[#334155]" />
                <div className="absolute right-6 top-3 h-20 w-14 rotate-[6deg] rounded-lg border border-white/10 bg-[#0f172a]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#111827] shadow-lg transition-transform duration-300 group-hover:scale-110">
                    <Play size={17} className="ml-0.5 fill-current" />
                  </span>
                </div>
                <span className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-black/65 px-2.5 py-1 text-[9px] font-bold text-white">Veja antes de comprar</span>
              </div>
              <div className="flex h-8 items-center gap-2 px-3">
                <Play size={10} className="fill-white text-white" />
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/15"><div className="h-full w-[42%] rounded-full bg-[#f59e0b]" /></div>
                <span className="text-[8px] font-semibold text-white/45">0:04 / 0:09</span>
              </div>
            </div>

            <div className="absolute left-[8%] top-[30%] hidden items-center gap-1.5 rounded-lg border border-white/10 bg-white/10 px-2.5 py-2 text-white/75 shadow-lg backdrop-blur sm:flex transition-transform duration-500 group-hover:-translate-x-1">
              <Sparkles size={12} className="text-[#fbbf24]" />
              <span className="text-[9px] font-bold">Legenda automática</span>
            </div>
            <div className="absolute right-[7%] top-[45%] hidden items-center gap-1.5 rounded-lg border border-white/10 bg-white/10 px-2.5 py-2 text-white/75 shadow-lg backdrop-blur sm:flex transition-transform duration-500 group-hover:translate-x-1">
              <Flame size={12} className="text-[#fb923c]" />
              <span className="text-[9px] font-bold">Formato viral</span>
            </div>

            {/* Text overlay */}
            <div className="absolute bottom-5 left-6 right-6 transition-transform duration-500 group-hover:-translate-y-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-white/15 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Mais popular</span>
              </div>
              <h3 className="text-white text-xl font-bold">Criar vídeo viral</h3>
              <p className="text-white/60 text-[13px] mt-1">Atraia clientes com conteúdo que viraliza</p>
            </div>
          </div>
          <div className="px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[15px] font-bold text-gray-900">Conteúdos para redes sociais</p>
                <p className="text-[13px] text-gray-500 mt-0.5">Use vídeos virais de moldura ou influencers IA para criar criativos profissionais.</p>
              </div>
              <ChevronRight size={18} className="text-gray-400 transition-transform duration-200 group-hover:translate-x-1" />
            </div>
          </div>
        </button>

        {/* Card 2: Grupos do Facebook */}
        <button
          onClick={() => onOpenSection('marketing')}
          className="group relative overflow-hidden rounded-[24px] border border-gray-200 bg-white text-left transition-all duration-300 hover:-translate-y-1 hover:border-gray-200 [box-shadow:0_2px_8px_rgba(0,0,0,0.06)] hover:[box-shadow:0_8px_24px_rgba(0,0,0,0.22),0_2px_8px_rgba(0,0,0,0.08)]"
        >
          {/* Hero area with an organized Facebook group feed */}
          <div className="aspect-[16/9] min-h-[300px] w-full bg-[#2453c7] relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.19),transparent_45%)]" />
            <div className="absolute left-1/2 top-[9%] w-[78%] max-w-[360px] -translate-x-1/2 overflow-hidden rounded-2xl border border-white/20 bg-[#f8fafc] shadow-2xl transition-all duration-500 group-hover:-translate-y-2 group-hover:scale-[1.02]">
              <div className="flex h-10 items-center justify-between border-b border-gray-200 bg-white px-3.5">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#1877f2] text-white"><Users size={13} /></span>
                  <div>
                    <p className="text-[9px] font-bold leading-none text-gray-900">Achados e ofertas</p>
                    <p className="mt-1 text-[7px] leading-none text-gray-400">12,4 mil membros</p>
                  </div>
                </div>
                <span className="rounded-md bg-[#e7f0ff] px-2 py-1 text-[8px] font-bold text-[#1769d2]">Entrar no grupo</span>
              </div>
              <div className="p-3">
                <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f97316] text-[9px] font-bold text-white">AL</span>
                    <div><p className="text-[9px] font-bold text-gray-900">Ana Lima</p><p className="text-[7px] text-gray-400">Agora mesmo</p></div>
                  </div>
                  <p className="mt-2 text-[10px] font-medium leading-snug text-gray-700">Comprei nessa loja e adorei. Vale muito a pena conferir!</p>
                  <div className="mt-2 flex items-center gap-3 border-t border-gray-100 pt-2 text-[8px] font-semibold text-gray-500">
                    <span className="flex items-center gap-1"><ThumbsUp size={10} className="text-[#1877f2]" /> 24</span>
                    <span className="flex items-center gap-1"><Heart size={10} className="text-rose-500" /> 8</span>
                    <span className="ml-auto flex items-center gap-1"><MessageCircle size={10} /> 6 comentários</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Text overlay */}
            <div className="absolute bottom-5 left-6 right-6 transition-transform duration-500 group-hover:-translate-y-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-white/15 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Gratuito</span>
              </div>
              <h3 className="text-white text-xl font-bold">Anunciar em grupos</h3>
              <p className="text-white/60 text-[13px] mt-1">Poste em comunidades sem gastar nada</p>
            </div>
          </div>
          <div className="px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[15px] font-bold text-gray-900">Publicar em grupos do Facebook</p>
                <p className="text-[13px] text-gray-500 mt-0.5">Copie a chamada pronta e poste em grupos ligados ao seu nicho gratuitamente.</p>
              </div>
              <ChevronRight size={18} className="text-gray-400 transition-transform duration-200 group-hover:translate-x-1" />
            </div>
          </div>
        </button>
      </div>


      {/* Discovery Section: Como funciona */}
      <div>
        <div className="mb-5">
          <h2 className="text-[16px] font-bold text-gray-900">Como divulgar sua loja em 3 passos</h2>
          <p className="text-[13px] text-gray-500 mt-0.5">Siga a estratégia que funciona para milhares de lojistas.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { step: '1', title: 'Crie o criativo', desc: 'Escolha um vídeo viral de moldura ou uma modelo IA para gerar seu conteúdo promocional.', icon: <Sparkles size={18} /> },
            { step: '2', title: 'Publique nas redes', desc: 'Poste o vídeo no Instagram, TikTok ou grupos do Facebook para atrair visitantes.', icon: <Send size={18} /> },
            { step: '3', title: 'Converta no WhatsApp', desc: 'Os clientes acessam sua loja e entram em contato direto pelo WhatsApp.', icon: <MessageCircle size={18} /> },
          ].map(item => (
            <div key={item.step} className="rounded-[20px] border border-gray-200 bg-white p-5 relative">
              <span className="text-[11px] font-black text-gray-300 uppercase tracking-widest">Passo {item.step}</span>
              <div className="mt-3 w-9 h-9 rounded-xl bg-[#0f172a] flex items-center justify-center text-white">
                {item.icon}
              </div>
              <h3 className="mt-3 text-[14px] font-bold text-gray-900">{item.title}</h3>
              <p className="mt-1 text-[12px] leading-relaxed text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Strategies Discovery */}
      <div>
        <div className="mb-5">
          <h2 className="text-[16px] font-bold text-gray-900">Estratégias que funcionam hoje</h2>
          <p className="text-[13px] text-gray-500 mt-0.5">Descubra formas comprovadas de divulgar sua loja e aumentar suas vendas.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: 'Reels virais', desc: 'Vídeos curtos de 15-30s com alto potencial de alcance orgânico.', icon: <Film size={18} /> },
            { title: 'Grupos de nicho', desc: 'Comunidades específicas no Facebook com público qualificado.', icon: <Users size={18} /> },
            { title: 'Influencers IA', desc: 'Gere criativos com modelos gerados por inteligência artificial.', icon: <Sparkles size={18} /> },
            { title: 'Stories diários', desc: 'Mantenha presença constante e engajamento com seus seguidores.', icon: <Instagram size={18} /> },
          ].map(strat => (
            <div key={strat.title} className="rounded-[16px] border border-gray-100 bg-gray-50/50 p-4 hover:bg-white hover:border-gray-200 hover:shadow-sm transition-all duration-200">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-900 text-white">{strat.icon}</span>
              <h3 className="mt-2.5 text-[13px] font-bold text-gray-900">{strat.title}</h3>
              <p className="mt-1 text-[12px] leading-relaxed text-gray-500">{strat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  if (mode === 'calendar') return (
    <section className="space-y-6 text-left"><header><p className="text-xs font-black uppercase tracking-[.28em] text-brand-500">Calendario de postagem</p><h1 className="mt-2 font-sans text-3xl font-bold text-gray-900">Sete dias de execucao, ja organizados.</h1></header><div className="grid gap-4 xl:grid-cols-2">{calendar.map((day) => <article key={day.day} className="rounded-xl border border-gray-200 bg-white/[.035] p-5"><div className="flex items-center justify-between"><h2 className="font-sans text-xl font-bold text-gray-900">{day.day}</h2><span className="text-xs font-bold text-brand-500">{day.focus}</span></div><div className="mt-4 space-y-3">{day.posts.map((post) => <div key={`${day.day}-${post.time}`} className="rounded-xl border border-gray-100 bg-gray-50 p-3"><p className="text-xs font-black text-gray-900">{post.time} - {post.channel}</p><p className="mt-1 text-xs text-gray-800">{post.action}</p><button onClick={() => copy(post.caption)} className="mt-2 text-[11px] font-black text-brand-500">Copiar legenda</button></div>)}</div></article>)}</div></section>
  );

  if (mode === 'export') return (
    <section className="space-y-6 text-left">
      <header>
        <p className="text-xs font-black uppercase tracking-[.28em] text-brand-500">Exportar kit</p>
        <h1 className="mt-2 font-sans text-3xl font-bold text-gray-900">Leve a operacao pronta para publicar.</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">Baixe a vitrine HTML, copies, perfil social e calendario em um unico pacote.</p>
      </header>
      <div className="grid gap-5 lg:grid-cols-2">
        <article className="rounded-3xl border border-gray-200 bg-white/[.035] p-6">
          <PackageCheck className="text-brand-500" size={24} />
          <h2 className="mt-4 font-sans text-2xl font-bold text-gray-900">Kit Storefy</h2>
          <p className="mt-2 text-sm leading-6 text-gray-500">Inclui vitrine, textos de postagem, bio do perfil e calendario de sete dias.</p>
          <button onClick={exportKit} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-3 text-sm font-black text-black">
            <Download size={16} /> Baixar kit
          </button>
          <div className="mt-3 flex flex-wrap gap-2">
            <button onClick={() => downloadBlob(slugify(profile.name) + '-vitrine.html', onBuildHtml(), 'text/html;charset=utf-8')} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-black text-gray-900">
              <Download size={16} /> Baixar HTML
            </button>
            <button onClick={() => onPreview()} className="inline-flex items-center gap-2 rounded-xl border border-brand-500/40 bg-brand-500/10 px-4 py-3 text-sm font-black text-gray-900">
              <LayoutTemplate size={16} /> Visualizar loja
            </button>
          </div>
          <p className="mt-3 text-xs leading-5 text-gray-500">O HTML usa somente os produtos marcados para esta loja e pode ser aberto no navegador sem instalar nada.</p>
        </article>
        <article className="rounded-3xl border border-brand-500/25 bg-brand-500/10 p-6">
          <Sparkles className="text-brand-500" size={24} />
          <h2 className="mt-4 font-sans text-2xl font-bold text-gray-900">Publicar vitrine</h2>
          <p className="mt-2 text-sm leading-6 text-gray-800">Se quiser, publique a loja agora e use o link no WhatsApp, grupos e redes sociais.</p>
          <button onClick={async () => {
            setPublishState('Publicando...');
            const result = await onPublish();
            setPublishState(result.error ? result.error : 'Publicado: ' + result.url);
          }} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-black text-black">
            <Send size={16} /> Publicar
          </button>
          {publishState && <p className="mt-4 break-words text-xs font-bold text-gray-800">{publishState}</p>}
        </article>
      </div>
    </section>
  );

  const selectedCount = selectedProducts.length;

  return (
    <section className="space-y-7 text-left">
      <header className="rounded-3xl border border-brand-500/25 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,.18),transparent_34%),rgba(255,255,255,.035)] p-6 sm:p-8">
        <p className="text-xs font-black uppercase tracking-[.28em] text-brand-500">Nova operacao de nicho</p>
        <h1 className="mt-3 max-w-3xl font-sans text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Responda o essencial. A Storefy organiza o resto.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-800">Fornecedores &gt; produtos &gt; perfil social &gt; videos &gt; vitrine &gt; WhatsApp &gt; divulgacao.</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {['Nicho', 'Identidade', 'Canais', 'Produtos', 'Divulgacao'].map((item, index) => (
            <span key={item} className={'rounded-full px-3 py-1.5 text-xs font-black ' + (step === index + 1 ? 'bg-brand-500 text-black' : step > index + 1 ? 'bg-emerald-400/15 text-emerald-300' : 'bg-white/[.06] text-slate-500')}>
              {index + 1}. {item}
            </span>
          ))}
        </div>
      </header>

      {step === 1 && (
        <div>
          <h2 className="font-sans text-2xl font-bold text-gray-900">1. Escolha seu nicho</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {OPERATION_NICHES.map((item) => (
              <button key={item.id} onClick={() => chooseNiche(item.id)} className={'rounded-xl border p-4 text-left transition ' + (niche.id === item.id ? 'border-brand-500 bg-brand-500/10' : 'border-gray-200 bg-white/[.03] hover:bg-white/[.06]')}>
                <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.accent }} />
                <h3 className="mt-3 font-bold text-gray-900">{item.name}</h3>
                <p className="mt-1 text-xs leading-5 text-gray-500">{item.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="grid gap-5 lg:grid-cols-2">
          <div>
            <h2 className="font-sans text-2xl font-bold text-gray-900">2. De um nome e atendimento a operacao</h2>
            <p className="mt-2 text-sm text-gray-500">A Storefy sugere um nome, mas voce pode personalizar.</p>
          </div>
          <div className="space-y-4 rounded-xl border border-gray-200 bg-white/[.03] p-5">
            <label className="block text-xs font-black uppercase tracking-wider text-gray-500">Nome
              <input value={name} onChange={(event) => setName(event.target.value)} className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-100 px-3 py-3 text-gray-900 outline-none" />
            </label>
            <button onClick={() => setName(getSuggestedOperationName(niche, 1))} className="text-xs font-black text-brand-500">Sugerir outro nome</button>
            <label className="block text-xs font-black uppercase tracking-wider text-gray-500">WhatsApp
              <input value={whatsapp} onChange={(event) => setWhatsapp(event.target.value)} placeholder="5511999999999" className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-100 px-3 py-3 text-gray-900 outline-none" />
            </label>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2 className="font-sans text-2xl font-bold text-gray-900">3. Onde voce vai postar?</h2>
          <p className="mt-2 text-sm text-gray-500">Os textos, o calendario e os videos serao montados para os canais escolhidos.</p>
          <div className="mt-5 flex flex-wrap gap-4">
            {([{ id: 'instagram', label: 'Instagram', icon: Instagram }, { id: 'tiktok', label: 'TikTok', icon: Music2 }] as const).map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => toggleChannel(id)} className={'flex min-w-52 items-center gap-3 rounded-xl border p-5 text-left ' + (channels.includes(id) ? 'border-brand-500 bg-brand-500/10' : 'border-gray-200 bg-white/[.03]')}>
                <Icon className="text-brand-500" />
                <span><b className="block text-gray-900">{label}</b><small className="text-gray-500">{channels.includes(id) ? 'Incluido no plano' : 'Adicionar canal'}</small></span>
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
              <h2 className="font-sans text-2xl font-bold text-gray-900">4. Monte a vitrine com produtos dos fornecedores</h2>
              <p className="mt-2 text-sm text-gray-500">{relevantProducts.length} produtos relacionados a {niche.name}. Misture fisicos, digitais e assinaturas quando fizer sentido.</p>
            </div>
            <span className="rounded-full bg-brand-500 px-3 py-2 text-xs font-black text-black">{selectedCount} selecionados</span>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {relevantProducts.slice(0, 24).map((product) => (
              <article key={product.id} className={'rounded-xl border p-4 ' + (product.addedToStore ? 'border-brand-500/70 bg-brand-500/10' : 'border-gray-200 bg-white/[.03]')}>
                <div className="flex gap-3">
                  <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-xl bg-gray-100">
                    {product.imageUrl ? <img src={product.imageUrl} alt="" className="h-full w-full object-cover" /> : <PackageCheck size={18} className="text-slate-500" />}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-gray-900">{product.name}</p>
                    <p className="mt-1 text-[11px] text-gray-500">{typeFor(product)} - {product.supplier}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm font-black text-brand-500">R$ {product.salePrice.toFixed(2).replace('.', ',')}</span>
                  <button type="button" onClick={() => onToggleAddProduct(product.id)} className={'rounded-lg px-3 py-2 text-xs font-black ' + (product.addedToStore ? 'bg-white text-black' : 'bg-brand-500 text-black')}>
                    {product.addedToStore ? 'Remover' : 'Adicionar'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
          <article className="rounded-3xl border border-gray-200 bg-white/[.035] p-6">
            <p className="text-xs font-black uppercase tracking-[.28em] text-brand-500">Divulgacao</p>
            <h2 className="mt-3 font-sans text-3xl font-bold text-gray-900">Sua loja esta pronta para ganhar trafego.</h2>
            <p className="mt-3 text-sm leading-6 text-gray-500">Antes de divulgar, confira a vitrine. Quando voltar, voce continua exatamente nesta etapa.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button onClick={() => onPreview(step)} className="rounded-xl border border-brand-500/40 bg-brand-500/10 p-5 text-left transition hover:bg-brand-500/15">
                <Store className="text-brand-500" size={22} />
                <b className="mt-4 block text-gray-900">Ver loja</b>
                <span className="mt-1 block text-xs leading-5 text-gray-500">Visualizar a vitrine gerada com os produtos selecionados.</span>
              </button>
              <button onClick={() => onOpenSection('promotion')} className="rounded-xl border border-gray-200 bg-gray-50 p-5 text-left transition hover:bg-white/[.06]">
                <Sparkles className="text-brand-500" size={22} />
                <b className="mt-4 block text-gray-900">Ir para divulgacao</b>
                <span className="mt-1 block text-xs leading-5 text-gray-500">Escolher conteudos ou anuncio gratis em grupos.</span>
              </button>
            </div>
          </article>
          <aside className="rounded-3xl border border-brand-500/30 bg-[radial-gradient(circle_at_top,rgba(212,175,55,.18),transparent_42%),rgba(255,255,255,.035)] p-6">
            <p className="text-xs font-black uppercase tracking-[.22em] text-brand-500">Resumo</p>
            <h3 className="mt-3 font-sans text-2xl font-bold text-gray-900">{name || profile.name}</h3>
            <div className="mt-5 space-y-3 text-sm text-gray-800">
              <p><b className="text-gray-900">{selectedCount}</b> produtos na vitrine</p>
              <p><b className="text-gray-900">{channels.length}</b> canais preparados</p>
              <p><b className="text-gray-900">{profile.handle}</b> como marca d'agua opcional</p>
            </div>
            <button onClick={async () => {
              setPublishState('Publicando...');
              const result = await onPublish();
              setPublishState(result.error ? result.error : 'Publicado: ' + result.url);
            }} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-3 text-sm font-black text-black">
              <Send size={16} /> Publicar vitrine
            </button>
            {publishState && <p className="mt-4 break-words text-xs font-bold text-gray-800">{publishState}</p>}
          </aside>
        </div>
      )}

      <footer className="flex items-center justify-between border-t border-gray-200 pt-5">
        <button disabled={step === 1} onClick={() => setStep((value) => Math.max(1, value - 1))} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-bold text-gray-900 disabled:opacity-30">
          <ChevronLeft size={16} /> Voltar
        </button>
        <button onClick={() => { saveOperation(); if (step < 5) setStep((value) => value + 1); else onOpenSection('promotion'); }} className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2 text-sm font-black text-black">
          {step === 5 ? 'Abrir divulgacao' : 'Continuar'} <ChevronRight size={16} />
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
  return (
    <button onClick={onChoose} className={`group overflow-hidden rounded-[24px] border text-left transition-all ${active ? 'border-[#0f172a] ring-1 ring-[#0f172a] shadow-md bg-gray-50' : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'}`}>
      <div className="aspect-[9/14] p-2.5">
        <div className="w-full h-full rounded-[16px] overflow-hidden relative" style={{ background: `linear-gradient(145deg, ${accent}cc, #10111b 58%, #050507)` }}>
          {mediaUrl ? (isVideo ? <video src={mediaUrl} className="h-full w-full object-cover object-center" autoPlay loop muted playsInline preload="metadata" /> : <img src={mediaUrl} alt="" className="h-full w-full object-cover object-center" />) : <div className="flex h-full flex-col justify-between p-4 bg-gray-100"><span className="flex items-center justify-between text-gray-500">{icon}<b className="rounded-md bg-gray-200/50 px-2 py-0.5 text-[9px] uppercase tracking-wider">{badge}</b></span><p className="line-clamp-2 font-sans text-xl font-bold leading-tight text-gray-900">{phrase}</p></div>}
        </div>
      </div>
      <div className="px-5 py-4">
        <h2 className="text-[15px] font-bold text-gray-900">{title}</h2>
        <p className="mt-1 text-[13px] leading-relaxed text-gray-500">{description}</p>
        <span className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-[12px] font-semibold text-gray-700 shadow-sm transition-colors group-hover:bg-gray-50">Configurar <ChevronRight size={14} /></span>
      </div>
    </button>
  );
}

function InfluencerModelCard({ model, selected, onChoose }: { key?: string; model: InfluencerModel; selected: boolean; onChoose: () => void }) {
  return (
    <button onClick={onChoose} className={`group overflow-hidden rounded-[24px] border text-left transition-all ${selected ? 'border-[#0f172a] ring-1 ring-[#0f172a] shadow-md bg-gray-50' : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'}`}>
      <div className="aspect-[4/5] p-2.5">
        <div className="w-full h-full rounded-[16px] overflow-hidden relative" style={{ background: `linear-gradient(145deg, ${model.color}cc, #111827 58%, #050507)` }}>
          {model.photoUrl ? <img src={model.photoUrl} alt="" className="h-full w-full object-cover object-center" /> : <div className="flex h-full flex-col justify-between p-4 bg-gray-100"><span className="grid h-12 w-12 place-items-center rounded-full text-lg font-bold text-white shadow-sm" style={{ backgroundColor: model.color }}>{model.name.slice(0, 1)}</span><div><b className="block text-2xl font-bold leading-tight text-gray-900">{model.name}</b><small className="mt-1 block text-gray-500">Foto da persona</small></div></div>}
        </div>
      </div>
      <div className="px-4 py-3">
        <b className="block text-[14px] font-bold text-gray-900">{model.name}</b>
        <span className="mt-0.5 block text-[12.5px] text-gray-500">{model.style}</span>
        {selected && <span className="mt-3 inline-block rounded-md bg-[#0f172a]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#0f172a]">Selecionada</span>}
      </div>
    </button>
  );
}

function GenerationOverlay() {
  const phrases = ['Preparando o criativo...', 'Dando ritmo ao vídeo...', 'Ajustando o visual...', 'Montando a prévia...'];
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setPhraseIndex((value) => (value + 1) % phrases.length), 1500);
    return () => window.clearInterval(timer);
  }, [phrases.length]);

  const phrase = phrases[phraseIndex];
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-white/80 p-4 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-xl">
        <div className="mx-auto grid h-12 w-12 animate-spin place-items-center rounded-full border-4 border-gray-100 border-t-[#0f172a]" />
        <p className="mt-6 text-[10px] font-bold uppercase tracking-widest text-[#d4af37]">Gerando vídeo</p>
        <h3 className="mt-2 text-[20px] font-bold text-gray-900">{phrase}</h3>
        <p className="mt-2 text-[13px] leading-relaxed text-gray-500">Quase pronto para postar.</p>
      </div>
    </div>
  );
}

function GeneratedVideoPreview({ generatedVideo, content, calendar, profile, products, onDownload, onClose }: {
  generatedVideo: { url: string; fileName: string; label: string };
  content: ReturnType<typeof getContentPack>;
  calendar: ReturnType<typeof getPostingCalendar>;
  profile: ReturnType<typeof getOperationProfile>;
  products: Product[];
  onDownload: () => void;
  onClose: () => void;
}) {
  const [copiedAction, setCopiedAction] = useState('');

  const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    if (video.duration === Infinity || isNaN(video.duration)) {
      video.currentTime = 1e9;
      video.onseeked = () => {
        video.onseeked = null;
        video.currentTime = 0;
      };
    }
  };

  const copyWithFeedback = async (key: string, value: string) => {
    await copy(value);
    setCopiedAction(key);
    window.setTimeout(() => setCopiedAction(current => current === key ? '' : current), 1800);
  };

  const suggestedPosts = calendar.flatMap((day) => day.posts.map((post) => ({ ...post, day: day.day }))).slice(0, 4);
  const productTopics = Array.from(new Set(products
    .map(product => product.subcategory?.trim())
    .filter((topic): topic is string => Boolean(topic))))
    .slice(0, 2);
  const primaryTopic = productTopics[0] || profile.niche.name;
  const secondaryTopic = productTopics[1] || primaryTopic;
  const searchesByNiche: Record<string, string[]> = {
    games: [
      `${primaryTopic} jogadores Brasil`,
      `${secondaryTopic} comunidade e ofertas`,
      `${primaryTopic} compra venda e trocas`
    ],
    subscriptions: [
      `${primaryTopic} promoções e descontos`,
      `${secondaryTopic} assinaturas Brasil`,
      'streaming e aplicativos ofertas'
    ],
    streaming: [
      `${primaryTopic} fãs e assinantes`,
      `${secondaryTopic} filmes séries e promoções`,
      'streaming Brasil ofertas e dicas'
    ],
    'apps-tools': [
      `${primaryTopic} usuários Brasil`,
      `${secondaryTopic} ferramentas digitais`,
      'inteligência artificial produtividade e apps'
    ],
    'digital-products': [
      `${primaryTopic} dicas e comunidade`,
      `${secondaryTopic} materiais digitais`,
      'ebooks cursos e produtos digitais Brasil'
    ],
    income: [
      `${primaryTopic} iniciantes e dicas`,
      `${secondaryTopic} empreendedores digitais`,
      'renda extra trabalho em casa Brasil'
    ],
    beauty: [
      `${primaryTopic} beleza e autocuidado`,
      `${secondaryTopic} promoções e achadinhos`,
      'beleza feminina ofertas Brasil'
    ],
    pet: [
      `${primaryTopic} tutores e cuidados`,
      `${secondaryTopic} produtos pet`,
      'cachorros gatos e achadinhos pet'
    ],
    fitness: [
      `${primaryTopic} treino e bem estar`,
      `${secondaryTopic} produtos fitness`,
      'academia treino em casa ofertas'
    ],
    home: [
      `${primaryTopic} casa e decoração`,
      `${secondaryTopic} utilidades domésticas`,
      'achadinhos para casa e cozinha'
    ],
    electronics: [
      `${primaryTopic} tecnologia Brasil`,
      `${secondaryTopic} gadgets e acessórios`,
      'eletrônicos ofertas e promoções'
    ],
    'physical-finds': [
      `${primaryTopic} achadinhos e ofertas`,
      `${secondaryTopic} compra e venda Brasil`,
      `${profile.niche.name} produtos úteis`
    ]
  };
  const facebookSearches = Array.from(new Set(
    searchesByNiche[profile.niche.id] || [
      `${primaryTopic} comunidade Brasil`,
      `${secondaryTopic} ofertas e promoções`,
      `${profile.niche.name} compra e venda`
    ]
  )).slice(0, 3);
  const copyOptions = [
    { key: 'instagram', label: 'Reels / Instagram', text: content.instagram },
    { key: 'tiktok', label: 'TikTok', text: content.tiktok },
    { key: 'story', label: 'Story', text: content.story },
  ];

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-3 backdrop-blur-sm animate-fade-in sm:p-5">
      <div className="grid max-h-[94vh] w-full max-w-5xl gap-5 overflow-auto rounded-2xl bg-white p-4 shadow-2xl lg:grid-cols-[300px_minmax(0,1fr)] sm:p-5">
        <div className="lg:sticky lg:top-0 lg:self-start">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
            <video src={generatedVideo.url} autoPlay controls loop muted playsInline onLoadedMetadata={handleLoadedMetadata} className="mx-auto aspect-[9/16] w-full max-w-[300px] object-cover" />
          </div>
          <button onClick={onClose} className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white text-[12px] font-semibold text-gray-700 hover:bg-gray-50">
            <ChevronLeft size={15} /> Criar outro vídeo
          </button>
        </div>

        <div className="space-y-4 text-left">
          <header className="rounded-xl border border-gray-200 bg-gray-50 p-4 sm:flex sm:items-center sm:justify-between sm:gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase text-emerald-700"><Check size={14} /> Vídeo pronto</span>
              <h3 className="mt-1 text-[21px] font-bold leading-tight text-gray-900">{generatedVideo.label}</h3>
            </div>
            <button onClick={onDownload} className="mt-3 inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#0f172a] px-5 text-[13px] font-semibold text-white hover:bg-[#1e293b] sm:mt-0">
              <Download size={16} /> 1. Baixar vídeo
            </button>
          </header>

          <section className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-start gap-3">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#0f172a] text-[11px] font-bold text-white">2</span>
              <div>
                <h4 className="text-[14px] font-bold text-gray-900">Copie a legenda da rede onde vai postar</h4>
                <p className="mt-0.5 text-[12px] text-gray-500">Escolha somente uma opção. O texto já vem pronto.</p>
              </div>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {copyOptions.map(option => (
                <button key={option.key} onClick={() => copyWithFeedback(option.key, option.text)} className={`inline-flex h-11 items-center justify-between gap-3 rounded-lg border px-3 text-left text-[12px] font-semibold transition-colors ${copiedAction === option.key ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-gray-200 bg-gray-50 text-gray-800 hover:bg-gray-100'}`}>
                  <span>{option.label}</span>
                  {copiedAction === option.key ? <Check size={15} /> : <Copy size={15} className="text-gray-400" />}
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-start gap-3">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#0f172a] text-[11px] font-bold text-white">3</span>
              <div>
                <h4 className="text-[14px] font-bold text-gray-900">Escolha um horário sugerido</h4>
                <p className="mt-0.5 text-[12px] text-gray-500">Ao clicar, você copia a legenda correspondente.</p>
              </div>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {suggestedPosts.map((post) => {
                const key = `schedule-${post.day}-${post.time}-${post.channel}`;
                return (
                  <button key={key} onClick={() => copyWithFeedback(key, post.caption)} className={`flex min-h-12 items-center justify-between gap-3 rounded-lg border px-3 py-2 text-left ${copiedAction === key ? 'border-emerald-300 bg-emerald-50' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'}`}>
                    <span><b className="block text-[13px] text-gray-900">{post.time} · {post.channel}</b><small className="text-[11px] text-gray-500">{post.day}</small></span>
                    <span className={`text-[10px] font-bold uppercase ${copiedAction === key ? 'text-emerald-700' : 'text-gray-400'}`}>{copiedAction === key ? 'Copiado' : 'Copiar'}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-xl border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-start gap-3">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-blue-700 text-[11px] font-bold text-white">4</span>
              <div>
                <h4 className="text-[14px] font-bold text-blue-950">Publique em grupos do Facebook</h4>
                <p className="mt-0.5 text-[12px] text-blue-700">Primeiro copie o texto. Depois abra uma das buscas abaixo.</p>
              </div>
            </div>
            <button onClick={() => copyWithFeedback('facebook-groups', content.groups)} className={`mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg font-semibold ${copiedAction === 'facebook-groups' ? 'bg-emerald-600 text-white' : 'bg-blue-700 text-white hover:bg-blue-800'}`}>
              {copiedAction === 'facebook-groups' ? <Check size={16} /> : <Copy size={16} />}
              {copiedAction === 'facebook-groups' ? 'Texto copiado' : 'Copiar texto para os grupos'}
            </button>
            <div className="mt-3 grid gap-2">
              {facebookSearches.map((term, index) => (
                <a key={term} href={`https://www.facebook.com/search/groups/?q=${encodeURIComponent(term)}`} target="_blank" rel="noreferrer" className="flex min-h-11 items-center justify-between gap-3 rounded-lg border border-blue-200 bg-white px-3 py-2 text-[12px] font-semibold text-blue-800 hover:bg-blue-100">
                  <span>Abrir busca {index + 1}: {term}</span>
                  <ChevronRight size={15} />
                </a>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
