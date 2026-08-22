const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_TIMEOUT_MS = 18000;
const DEFAULT_MODEL = "openai/gpt-oss-20b";
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 24;
const rateBuckets = new Map();

function cleanText(value, maxLength = 2000) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function normalizeMessages(messages) {
  if (!Array.isArray(messages)) return [];
  return messages
    .slice(-12)
    .map(message => ({
      role: message?.role === "assistant" ? "assistant" : "user",
      content: cleanText(message?.content)
    }))
    .filter(message => message.content);
}

function buildCatalogContext(context) {
  const topProducts = Array.isArray(context?.topProducts)
    ? context.topProducts.slice(0, 12).map(product => ({
      id: cleanText(product?.id, 120),
      name: cleanText(product?.name, 120),
      category: cleanText(product?.category, 60),
      subcategory: cleanText(product?.subcategory, 80),
      supplier: cleanText(product?.supplier, 80),
      costPrice: Number(product?.costPrice || 0),
      salePrice: Number(product?.salePrice || 0)
    }))
    : [];

  return {
    assistantMode: context?.assistantMode === "new" ? "new" : "current",
    memory: {
      audience: cleanText(context?.memory?.audience, 100),
      budget: cleanText(context?.memory?.budget, 60),
      niches: Array.isArray(context?.memory?.niches) ? context.memory.niches.slice(0, 8).map(value => cleanText(value, 80)) : [],
      rejectedProductIds: Array.isArray(context?.memory?.rejectedProductIds) ? context.memory.rejectedProductIds.slice(-50).map(value => cleanText(value, 120)) : []
    },
    currentStore: {
      name: cleanText(context?.currentStore?.name, 100),
      niche: cleanText(context?.currentStore?.niche, 100),
      productCount: Number(context?.currentStore?.productCount || 0),
      status: cleanText(context?.currentStore?.status, 30)
    },
    catalogSize: Number(context?.catalogSize || 0),
    productCandidatesAreContextual: context?.productCandidatesAreContextual === true,
    topProducts
  };
}

function localReply(lastMessage, context) {
  const message = cleanText(lastMessage).toLowerCase();
  const storeName = cleanText(context?.currentStore?.name, 80) || "sua loja";

  if (/produto|vender|margem|catalogo|catálogo/.test(message)) {
    return "Posso cruzar nicho, margem e procura para sugerir produtos do catálogo. Use ‘Encontrar produtos’ e eu mostro uma seleção pronta para adicionar.";
  }
  if (/criar|nova loja|começar|comecar/.test(message)) {
    return "Vamos criar sua loja aqui no chat. Use ‘Criar uma loja’ e eu vou pedir apenas nicho, nome, WhatsApp e visual antes de montar a vitrine.";
  }
  if (/divulga|vender mais|marketing|anuncio|anúncio/.test(message)) {
    return `Para divulgar ${storeName}, comece com um produto principal, uma promessa objetiva e três conteúdos curtos levando ao WhatsApp. Posso montar esse plano com você.`;
  }
  return "Posso ajudar a escolher um nicho, encontrar produtos, melhorar sua vitrine ou criar uma nova loja completa pelo chat. Por onde quer começar?";
}

function normalizeForComparison(value) {
  return cleanText(value, 5000)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function isRepeatedReply(reply, messages) {
  const normalizedReply = normalizeForComparison(reply);
  if (!normalizedReply) return false;
  return messages
    .filter(message => message.role === "assistant")
    .slice(-4)
    .some(message => normalizeForComparison(message.content) === normalizedReply);
}

function shouldTakeInitiative(lastMessage, messages, reply) {
  const asksForInitiative = /(me de uma ideia|me dê uma ideia|sugira|sugestao|sugestão|voce escolhe|você escolhe|decida|escolha por mim|qualquer um|em geral)/i.test(lastMessage);
  const recentAssistantQuestions = messages
    .filter(message => message.role === "assistant")
    .slice(-5)
    .filter(message => /\?\s*$/.test(message.content)).length;
  return isRepeatedReply(reply, messages) || ((asksForInitiative || recentAssistantQuestions >= 2) && /\?\s*$/.test(reply));
}

function buildProgressReply(messages) {
  const conversation = normalizeForComparison(messages.map(message => message.content).join(" "));
  if (/idoso|idosa|terceira idade|senior/.test(conversation)) {
    return "Vou tomar a iniciativa. Para o público idoso, eu começaria por três frentes: jardinagem leve, jogos de memória e bem-estar em casa. A opção mais simples para validar é bem-estar em casa, com produtos fáceis de explicar e usar. Posso agora filtrar o catálogo nessa direção.";
  }
  if (/crianca|infantil|bebe/.test(conversation)) {
    return "Vou tomar a iniciativa. Para o público infantil, eu avaliaria brinquedos educativos, acessórios para rotina escolar e itens criativos. Brinquedos educativos são o melhor ponto de partida porque têm proposta clara para pais e responsáveis. Posso filtrar o catálogo por essa direção.";
  }
  if (/pet|cachorro|gato/.test(conversation)) {
    return "Vou tomar a iniciativa. No mercado pet, eu testaria passeio, higiene e entretenimento. A frente de passeio costuma ser mais fácil de demonstrar e divulgar em vídeos curtos. Posso procurar opções reais dessa categoria no catálogo.";
  }
  return "Vou tomar a iniciativa e reduzir as opções: utilidade para casa, cuidado pessoal ou hobby e lazer. Eu começaria por utilidade para casa, porque a demonstração é simples e o benefício fica claro rapidamente. Posso usar essa direção para buscar oportunidades no catálogo.";
}

function getClientKey(req) {
  const forwarded = String(req.headers?.["x-forwarded-for"] || "").split(",")[0].trim();
  return forwarded || req.socket?.remoteAddress || "local";
}

function isRateLimited(req) {
  const now = Date.now();
  const key = getClientKey(req);
  const current = rateBuckets.get(key);
  if (!current || now - current.startedAt >= RATE_LIMIT_WINDOW_MS) {
    rateBuckets.set(key, { startedAt: now, count: 1 });
    return false;
  }
  current.count += 1;
  return current.count > RATE_LIMIT_MAX_REQUESTS;
}

function hasValidOrigin(req) {
  const origin = String(req.headers?.origin || "").trim();
  const host = String(req.headers?.host || "").trim();
  if (!origin || !host) return true;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

async function handleSiaChat(req, res) {
  if (!hasValidOrigin(req)) {
    return res.status(403).json({ error: "Origem não permitida." });
  }
  if (isRateLimited(req)) {
    return res.status(429).json({ error: "Muitas mensagens em pouco tempo. Aguarde um minuto." });
  }

  const messages = normalizeMessages(req.body?.messages);
  const context = buildCatalogContext(req.body?.context || {});
  const lastMessage = messages.at(-1)?.content || "";

  if (!lastMessage) {
    return res.status(400).json({ error: "Envie uma mensagem para a Ayla." });
  }

  const apiKey = cleanText(process.env.GROQ_API_KEY, 500);
  if (!apiKey) {
    return res.json({ reply: localReply(lastMessage, context), provider: "local", configured: false });
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), GROQ_TIMEOUT_MS);

  try {
    const response = await fetch(GROQ_ENDPOINT, {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: cleanText(process.env.GROQ_MODEL, 120) || DEFAULT_MODEL,
        temperature: 0.45,
        max_completion_tokens: 550,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: [
              "Você é a Ayla, assistente comercial inteligente da Storefy.",
              "Responda sempre em português do Brasil, com clareza, objetividade e tom parceiro.",
              "Não use emojis, linguagem infantilizada ou entusiasmo artificial.",
              "Ajude com nichos, seleção de produtos, margem, vitrine, conteúdo e divulgação.",
              "A Storefy cria lojas com pedido pelo WhatsApp e possui catálogo de produtos digitais e físicos.",
              "Nunca diga que executou uma ação. A interface confirma criação de loja, seleção e publicação.",
              "Quando o usuário quiser criar uma loja, oriente a usar o fluxo guiado disponível no chat.",
              "Conduza uma conversa natural. Faça uma pergunta de cada vez quando faltarem público, nicho, orçamento ou objetivo.",
              "Faça no máximo uma pergunta de esclarecimento antes de propor uma direção concreta com as informações disponíveis.",
              "Nunca repita uma pergunta já feita, mesmo com palavras diferentes.",
              "Quando o usuário disser 'me dê uma ideia', 'sugira', 'em geral', 'você escolhe' ou equivalente, tome a iniciativa: ofereça até três caminhos, recomende um deles e explique brevemente por quê. Não responda com outra pergunta.",
              "Respostas curtas do usuário como 'hobby', 'idosos' ou 'crianças' são contexto válido; avance a partir delas em vez de pedir que ele detalhe indefinidamente.",
              "A loja atual no contexto é apenas uma referência da conta. Nunca presuma que o usuário quer continuar naquele nicho, a menos que ele diga explicitamente 'minha loja', 'loja atual' ou mencione o nicho.",
              "Respeite assistantMode: em 'current', trabalhe sobre a loja atual; em 'new', ajude a criar uma operação nova sem misturar decisões da loja existente.",
              "Use memory para lembrar público, orçamento e nichos. Nunca recomende IDs presentes em rejectedProductIds.",
              "Se a pergunta for genérica, como 'qual produto devo vender?', pergunte primeiro sobre público, interesses ou categoria sem citar o nicho da loja atual.",
              "Não mostre produtos só porque a palavra produto, venda ou margem apareceu.",
              "Defina showProducts=true apenas quando o usuário pedir recomendações/exemplos de produtos e já houver contexto suficiente para uma seleção útil.",
              "Se o pedido for vago, responda com uma pergunta curta e use showProducts=false.",
              "Quando showProducts=true, escolha de 1 a 8 IDs exclusivamente de topProducts e ordene os mais pertinentes ao pedido.",
              "Para pedidos infantis, selecione somente itens cujo nome ou contexto realmente seja infantil; nunca complete com produtos genéricos.",
              "Use no máximo quatro parágrafos curtos e não invente métricas, fornecedores ou produtos.",
              "Não afirme alta demanda, boa margem ou baixo risco sem dados em topProducts; quando não houver dados, trate a ideia como hipótese para validar.",
              "Não sugira suplementos, medicamentos ou dispositivos médicos sem um produto real e permitido presente em topProducts.",
              "Retorne somente JSON válido no formato: {\"reply\":\"resposta em português\",\"showProducts\":false,\"productQuery\":\"termos de busca ou vazio\",\"productIds\":[]}.",
              `Contexto atual: ${JSON.stringify(context)}`
            ].join("\n")
          },
          ...messages
        ]
      })
    });

    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      const error = new Error(payload?.error?.message || "A Groq não respondeu agora.");
      error.statusCode = response.status === 401 ? 503 : 502;
      throw error;
    }

    const rawReply = cleanText(payload?.choices?.[0]?.message?.content, 10000);
    let assistantDecision = null;
    try {
      assistantDecision = JSON.parse(rawReply);
    } catch {
      assistantDecision = { reply: rawReply, showProducts: false, productQuery: "", productIds: [] };
    }
    let reply = cleanText(assistantDecision?.reply, 5000);
    if (!reply) throw new Error("A Groq retornou uma resposta vazia.");
    if (shouldTakeInitiative(lastMessage, messages, reply)) {
      reply = buildProgressReply(messages);
      assistantDecision = { reply, showProducts: false, productQuery: "", productIds: [] };
    }
    const availableIds = new Set(context.topProducts.map(product => product.id).filter(Boolean));
    const productIds = Array.isArray(assistantDecision?.productIds)
      ? assistantDecision.productIds.map(id => cleanText(id, 120)).filter(id => availableIds.has(id)).slice(0, 8)
      : [];
    const showProducts = assistantDecision?.showProducts === true && productIds.length > 0;
    return res.json({
      reply,
      showProducts,
      productQuery: cleanText(assistantDecision?.productQuery, 300),
      productIds: showProducts ? productIds : [],
      provider: "groq",
      configured: true
    });
  } catch (requestError) {
    const explicitlyAskedForProducts = /(mostre|indique|recomende|sugira|opcoes|opções|exemplos)/i.test(lastMessage);
    const fallbackProductIds = explicitlyAskedForProducts && context.productCandidatesAreContextual
      ? context.topProducts.map(product => product.id).filter(Boolean).slice(0, 6)
      : [];
    const fallback = fallbackProductIds.length
      ? "Encontrei algumas opções coerentes com o que você descreveu. Veja os itens abaixo e me diga se prefere refinar por preço, margem ou tipo de público."
      : localReply(lastMessage, context);
    return res.status(200).json({
      reply: fallback,
      showProducts: fallbackProductIds.length > 0,
      productQuery: fallbackProductIds.length ? lastMessage : "",
      productIds: fallbackProductIds,
      provider: "local",
      configured: true,
      degraded: true,
      warning: requestError?.name === "AbortError" ? "A Groq demorou para responder." : "A Groq está temporariamente indisponível."
    });
  } finally {
    clearTimeout(timer);
  }
}

function fallbackReelVariants(productName, storeName) {
  const product = cleanText(productName, 80) || "esse produto";
  const store = cleanText(storeName, 60) || "nossa vitrine";
  return [
    { hook: `Você precisa ver o que ${product} pode fazer`, cta: `Veja na ${store}` },
    { hook: "Eu não sabia que isso existia até agora", cta: "Confira o valor na vitrine" },
    { hook: "Um achado simples que facilita a rotina", cta: "Chame no WhatsApp" },
    { hook: "Olha esse produto funcionando de perto", cta: "Veja todos os detalhes" },
    { hook: "Vale a pena conhecer antes de comprar", cta: "Acesse a loja agora" }
  ];
}

async function handleSiaReelCaptions(req, res) {
  if (!hasValidOrigin(req)) return res.status(403).json({ error: "Origem não permitida." });
  if (isRateLimited(req)) return res.status(429).json({ error: "Muitas gerações em pouco tempo. Aguarde um minuto." });

  const productName = cleanText(req.body?.product?.name, 120);
  const productDescription = cleanText(req.body?.product?.description, 500);
  const price = Number(req.body?.product?.price || 0);
  const storeName = cleanText(req.body?.store?.name, 100);
  const niche = cleanText(req.body?.store?.niche, 100);
  const fallback = fallbackReelVariants(productName, storeName);
  const apiKey = cleanText(process.env.GROQ_API_KEY, 500);

  if (!apiKey) return res.json({ variants: fallback, provider: "local", configured: false });

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), GROQ_TIMEOUT_MS);
  try {
    const response = await fetch(GROQ_ENDPOINT, {
      method: "POST",
      signal: controller.signal,
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: cleanText(process.env.GROQ_MODEL, 120) || DEFAULT_MODEL,
        temperature: 0.72,
        max_completion_tokens: 500,
        response_format: { type: "json_object" },
        messages: [{
          role: "system",
          content: [
            "Você é a Ayla, estrategista de Reels da Storefy.",
            "Crie exatamente 5 variações diferentes para apresentar o mesmo vídeo de produto.",
            "Cada hook deve ter no máximo 68 caracteres, ser natural, específico e fácil de ler em até 3 segundos.",
            "Não invente benefícios, resultados, escassez, desconto ou métricas.",
            "Evite emojis, caixa alta, aspas e promessas enganosas.",
            "Cada CTA deve ter no máximo 36 caracteres.",
            "Retorne somente JSON válido no formato {\"variants\":[{\"hook\":\"...\",\"cta\":\"...\"}]}",
            `Loja: ${storeName || "Storefy"}`,
            `Nicho: ${niche || "geral"}`,
            `Produto: ${productName || "oferta geral"}`,
            `Descrição disponível: ${productDescription || "não informada"}`,
            `Preço disponível: ${price > 0 ? `R$ ${price.toFixed(2)}` : "não informado"}`
          ].join("\n")
        }]
      })
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok) throw new Error(payload?.error?.message || "A Groq não respondeu agora.");
    const parsed = JSON.parse(cleanText(payload?.choices?.[0]?.message?.content, 8000));
    const variants = Array.isArray(parsed?.variants)
      ? parsed.variants.map(item => ({ hook: cleanText(item?.hook, 80), cta: cleanText(item?.cta, 45) })).filter(item => item.hook && item.cta).slice(0, 5)
      : [];
    if (variants.length !== 5) throw new Error("A Ayla não retornou cinco variações válidas.");
    return res.json({ variants, provider: "groq", configured: true });
  } catch {
    return res.json({ variants: fallback, provider: "local", configured: true, degraded: true });
  } finally {
    clearTimeout(timer);
  }
}

module.exports = { handleSiaChat, handleSiaReelCaptions };
