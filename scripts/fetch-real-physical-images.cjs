const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const dataPath = path.join(root, 'src', 'data.ts');
const reportPath = path.join(root, 'physical-image-report.json');

const limitArg = process.argv.find((arg) => arg.startsWith('--limit='));
const limit = limitArg ? Number(limitArg.split('=')[1]) : Infinity;
const dryRun = process.argv.includes('--dry-run');

const searchDelayMs = 950;
const userAgent =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function decodeHtml(value) {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function decodeImageUrl(raw) {
  const htmlDecoded = decodeHtml(raw);
  try {
    return JSON.parse(`"${htmlDecoded.replace(/"/g, '\\"')}"`);
  } catch {
    return htmlDecoded.replace(/\\\//g, '/');
  }
}

function extractPhysicalProducts(source) {
  return [...source.matchAll(/\{\s*"id": "physical-\d+"[\s\S]*?\n  \}/g)].map((match) => {
    const block = match[0];
    return {
      block,
      id: block.match(/"id": "([^"]+)"/)?.[1] || '',
      name: block.match(/"name": "([^"]+)"/)?.[1] || '',
      subcategory: block.match(/"subcategory": "([^"]+)"/)?.[1] || '',
      currentImageUrl: block.match(/"imageUrl": "([^"]*)"/)?.[1] || '',
      sourceUrl: block.match(/"sourceUrl": "([^"]*)"/)?.[1] || '',
    };
  });
}

function cleanQueryName(product) {
  return product.name
    .replace(/\((.*?)\)/g, '$1')
    .replace(/[º]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildQueries(product) {
  const cleanName = cleanQueryName(product);
  return [
    `"${product.name}" produto`,
    `"${cleanName}" produto`,
    `"${cleanName}" aliexpress`,
    `${cleanName} ${product.subcategory} produto`,
  ];
}

function isProbablyUsefulImage(url) {
  if (!/^https?:\/\//i.test(url)) return false;
  if (/bing\.com\/th|favicon|logo|sprite|avatar|placeholder|facebook_sharing/i.test(url)) return false;
  if (/\.(svg|gif)(\?|$)/i.test(url)) return false;
  return true;
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      'accept-language': 'pt-BR,pt;q=0.9,en;q=0.8',
      'user-agent': userAgent,
    },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.text();
}

function extractSupplierImageCandidates(html) {
  const found = [];
  const listMatch = html.match(/"imagePathList"\s*:\s*(\[[\s\S]*?\])/);
  if (listMatch) {
    try {
      for (const url of JSON.parse(listMatch[1])) {
        if (isProbablyUsefulImage(url) && !found.includes(url)) found.push(url);
      }
    } catch {
      // Keep trying the lighter fallbacks below.
    }
  }

  for (const pattern of [
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/gi,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/gi,
  ]) {
    for (const match of html.matchAll(pattern)) {
      const url = decodeHtml(match[1]);
      if (isProbablyUsefulImage(url) && !found.includes(url)) found.push(url);
    }
  }

  return found;
}

async function findSupplierImage(product) {
  if (!product.sourceUrl) return null;

  try {
    const html = await fetchText(product.sourceUrl);
    const candidates = extractSupplierImageCandidates(html).slice(0, 8);
    for (const candidate of candidates) {
      if (await validateImage(candidate)) {
        return { imageUrl: candidate, query: product.sourceUrl, candidatesChecked: candidates.length };
      }
    }
  } catch (error) {
    console.log(`supplier-failed ${product.id} ${product.sourceUrl}: ${error.message}`);
  }

  return null;
}

function extractImageCandidates(html) {
  const found = [];
  const patterns = [
    /murl&quot;:&quot;(.*?)&quot;/g,
    /"murl":"(.*?)"/g,
    /"contentUrl":"(https?:\/\/[^"]+)"/g,
  ];

  for (const pattern of patterns) {
    for (const match of html.matchAll(pattern)) {
      const url = decodeImageUrl(match[1]);
      if (isProbablyUsefulImage(url) && !found.includes(url)) found.push(url);
    }
  }

  return found;
}

async function validateImage(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    let response = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'user-agent': userAgent,
        accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      },
    });

    if (!response.ok || !String(response.headers.get('content-type') || '').startsWith('image/')) {
      response = await fetch(url, {
        method: 'GET',
        redirect: 'follow',
        signal: controller.signal,
        headers: {
          range: 'bytes=0-8191',
          'user-agent': userAgent,
          accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        },
      });
    }

    const contentType = String(response.headers.get('content-type') || '').toLowerCase();
    if (!response.ok || !contentType.startsWith('image/')) return false;
    if (contentType.includes('svg') || contentType.includes('gif')) return false;
    return true;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

async function findImage(product) {
  const supplierImage = await findSupplierImage(product);
  if (supplierImage) return supplierImage;
  return null;
}

function replaceImageUrl(source, product, imageUrl) {
  const escapedCurrent = product.currentImageUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const blockPattern = new RegExp(
    `(\\{\\s*"id": "${product.id}"[\\s\\S]*?"imageUrl": ")${escapedCurrent}("[\\s\\S]*?\\n  \\})`,
  );
  return source.replace(blockPattern, `$1${imageUrl}$2`);
}

async function main() {
  let source = fs.readFileSync(dataPath, 'utf8');
  const products = extractPhysicalProducts(source).slice(0, limit);
  const report = [];

  console.log(`products=${products.length} dryRun=${dryRun}`);

  for (const product of products) {
    const result = await findImage(product);
    if (result) {
      console.log(`ok ${product.id} ${product.name} -> ${result.imageUrl}`);
      report.push({ ...product, ...result, status: 'ok' });
      if (!dryRun) source = replaceImageUrl(source, product, result.imageUrl);
    } else {
      console.log(`missing ${product.id} ${product.name}`);
      report.push({ ...product, status: 'missing' });
    }
    await sleep(searchDelayMs);
  }

  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  if (!dryRun) fs.writeFileSync(dataPath, source);
  console.log(`report=${reportPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
