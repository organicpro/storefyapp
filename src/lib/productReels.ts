export type ReelTextVariant = {
  hook: string;
  cta: string;
};

export type GeneratedProductReel = ReelTextVariant & {
  id: string;
  url: string;
  blob: Blob;
  fileName: string;
};

type ProductReelInput = {
  videoFile: File;
  variants: ReelTextVariant[];
  productName: string;
  profileName: string;
  profileHandle: string;
  profileImageUrl?: string;
  accent: string;
  onProgress?: (value: number) => void;
};

const WIDTH = 540;
const HEIGHT = 960;
const FPS = 24;
const MAX_DURATION_SECONDS = 12;

const waitFor = (target: EventTarget, event: string) => new Promise<void>((resolve, reject) => {
  target.addEventListener(event, () => resolve(), { once: true });
  target.addEventListener('error', () => reject(new Error('Não foi possível ler o vídeo enviado.')), { once: true });
});

const loadSafeImage = async (source?: string) => {
  if (!source) return null;
  try {
    const parsed = new URL(source, window.location.href);
    if (!['data:', 'blob:'].includes(parsed.protocol) && parsed.origin !== window.location.origin) return null;
    const image = new Image();
    image.src = source;
    await waitFor(image, 'load');
    return image;
  } catch {
    return null;
  }
};

function wrapText(context: CanvasRenderingContext2D, value: string, maxWidth: number, maxLines = 3) {
  const words = value.trim().split(/\s+/);
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (context.measureText(candidate).width <= maxWidth) current = candidate;
    else {
      if (current) lines.push(current);
      current = word;
      if (lines.length === maxLines - 1) break;
    }
  }
  if (current && lines.length < maxLines) lines.push(current);
  if (lines.length === maxLines && words.join(' ').length > lines.join(' ').length) {
    lines[maxLines - 1] = `${lines[maxLines - 1].replace(/[.]+$/, '')}...`;
  }
  return lines;
}

function drawVideoContained(context: CanvasRenderingContext2D, video: HTMLVideoElement, x: number, y: number, width: number, height: number) {
  context.save();
  context.beginPath();
  context.roundRect(x, y, width, height, 18);
  context.clip();
  context.fillStyle = '#0b0d12';
  context.fillRect(x, y, width, height);
  const ratio = Math.min(width / video.videoWidth, height / video.videoHeight);
  const drawWidth = video.videoWidth * ratio;
  const drawHeight = video.videoHeight * ratio;
  context.drawImage(video, x + (width - drawWidth) / 2, y + (height - drawHeight) / 2, drawWidth, drawHeight);
  context.restore();
}

function drawReelFrame(context: CanvasRenderingContext2D, video: HTMLVideoElement, variant: ReelTextVariant, input: ProductReelInput, avatar: HTMLImageElement | null) {
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, WIDTH, HEIGHT);
  context.fillStyle = input.accent || '#dfb52d';
  context.fillRect(0, 0, WIDTH, 7);

  context.save();
  context.beginPath();
  context.arc(48, 49, 25, 0, Math.PI * 2);
  context.clip();
  if (avatar) context.drawImage(avatar, 23, 24, 50, 50);
  else {
    context.fillStyle = input.accent || '#dfb52d';
    context.fillRect(23, 24, 50, 50);
    context.fillStyle = '#111318';
    context.font = '700 18px Arial';
    context.textAlign = 'center';
    context.fillText((input.profileName || 'S').slice(0, 1).toUpperCase(), 48, 56);
  }
  context.restore();

  context.textAlign = 'left';
  context.fillStyle = '#111318';
  context.font = '700 16px Arial';
  context.fillText(input.profileName || 'Storefy', 86, 45);
  context.fillStyle = '#6b7280';
  context.font = '13px Arial';
  context.fillText(input.profileHandle || '@storefy', 86, 66);

  context.fillStyle = '#111318';
  context.font = '800 30px Arial';
  const hookLines = wrapText(context, variant.hook, WIDTH - 64, 3);
  hookLines.forEach((line, index) => context.fillText(line, 32, 126 + index * 35));

  const videoTop = 226;
  drawVideoContained(context, video, 24, videoTop, WIDTH - 48, 570);

  context.fillStyle = '#6b7280';
  context.font = '12px Arial';
  context.fillText(input.productName.slice(0, 64), 32, 834);

  context.fillStyle = '#111318';
  context.beginPath();
  context.roundRect(32, 858, WIDTH - 64, 62, 15);
  context.fill();
  context.fillStyle = '#ffffff';
  context.textAlign = 'center';
  context.font = '700 18px Arial';
  context.fillText(variant.cta, WIDTH / 2, 897);
}

export async function generateProductReels(input: ProductReelInput): Promise<GeneratedProductReel[]> {
  if (!window.MediaRecorder) throw new Error('Este navegador não suporta geração de vídeo.');
  const sourceUrl = URL.createObjectURL(input.videoFile);
  const video = document.createElement('video');
  video.src = sourceUrl;
  video.muted = true;
  video.playsInline = true;
  video.preload = 'auto';
  await waitFor(video, 'loadedmetadata');
  const duration = Math.min(Math.max(Number(video.duration) || 6, 2), MAX_DURATION_SECONDS);
  const avatar = await loadSafeImage(input.profileImageUrl);
  const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp8') ? 'video/webm;codecs=vp8' : 'video/webm';

  const renders = input.variants.slice(0, 5).map((variant, index) => {
    const canvas = document.createElement('canvas');
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    const context = canvas.getContext('2d', { alpha: false });
    if (!context) throw new Error('Não foi possível preparar o renderizador.');
    const stream = canvas.captureStream(FPS);
    const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 2200000 });
    const chunks: BlobPart[] = [];
    recorder.ondataavailable = event => { if (event.data.size) chunks.push(event.data); };
    drawReelFrame(context, video, variant, input, avatar);
    recorder.start(250);
    return { variant, index, context, stream, recorder, chunks };
  });

  const completion = Promise.all(renders.map(render => new Promise<GeneratedProductReel>((resolve, reject) => {
    render.recorder.onerror = () => reject(new Error('Falha ao renderizar uma das variações.'));
    render.recorder.onstop = () => {
      render.stream.getTracks().forEach(track => track.stop());
      const blob = new Blob(render.chunks, { type: mimeType });
      resolve({
        id: `reel-${Date.now()}-${render.index + 1}`,
        hook: render.variant.hook,
        cta: render.variant.cta,
        blob,
        url: URL.createObjectURL(blob),
        fileName: `reel-${render.index + 1}.webm`
      });
    };
  })));

  video.currentTime = 0;
  await video.play();
  const startedAt = performance.now();
  await new Promise<void>(resolve => {
    const draw = () => {
      const elapsed = (performance.now() - startedAt) / 1000;
      renders.forEach(render => drawReelFrame(render.context, video, render.variant, input, avatar));
      input.onProgress?.(Math.min(99, Math.round((elapsed / duration) * 100)));
      if (elapsed >= duration || video.ended) {
        video.pause();
        renders.forEach(render => { if (render.recorder.state !== 'inactive') render.recorder.stop(); });
        resolve();
        return;
      }
      requestAnimationFrame(draw);
    };
    requestAnimationFrame(draw);
  });

  const output = await completion;
  URL.revokeObjectURL(sourceUrl);
  input.onProgress?.(100);
  return output;
}
