type ModelConfig = {
  temperature: number;
  topP: number;
  maxOutputTokens: number;
  jsonMode?: boolean;
};

type ChatCompletionResponse = {
  choices?: Array<{
    finish_reason?: string;
    message?: {
      content?: unknown;
    };
  }>;
  model?: string;
  error?: {
    code?: number;
    message?: string;
  };
};

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_OPENROUTER_MODELS = [
  "openrouter/free",
  "google/gemma-4-26b-a4b-it:free",
  "qwen/qwen3-next-80b-a3b-instruct:free",
];
const MAX_OPENROUTER_FALLBACK_MODELS = 3;

function getOpenRouterKey() {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error("OPENROUTER_API_KEY environment variable is not set");
  return key;
}

function readMessageContent(content: unknown): string {
  if (typeof content === "string") return content;

  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === "string") return part;
        if (part && typeof part === "object" && "text" in part) {
          return String((part as { text: unknown }).text ?? "");
        }
        return "";
      })
      .join("");
  }

  return "";
}

function getConfiguredModels() {
  const rawModels = process.env.OPENROUTER_MODELS || process.env.OPENROUTER_MODEL;
  if (!rawModels || rawModels.trim() === "openrouter/free") return DEFAULT_OPENROUTER_MODELS;

  const models = rawModels
    .split(",")
    .map((model) => model.trim())
    .filter(Boolean);

  return models.length > 0 ? models.slice(0, MAX_OPENROUTER_FALLBACK_MODELS) : DEFAULT_OPENROUTER_MODELS;
}

function getModelRoute(attempt: number) {
  const models = getConfiguredModels();
  return { model: models[attempt] || models[0] };
}

async function requestOpenRouter(prompt: string, config: ModelConfig, attempt: number) {
  const response = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getOpenRouterKey()}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.OPENROUTER_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || "",
      "X-OpenRouter-Title": process.env.OPENROUTER_APP_NAME || "Landeon",
    },
    body: JSON.stringify({
      ...getModelRoute(attempt),
      messages: [{ role: "user", content: prompt }],
      temperature: config.temperature,
      top_p: config.topP,
      max_tokens: config.maxOutputTokens,
      ...(config.jsonMode ? { response_format: { type: "json_object" } } : {}),
    }),
  });

  const payload = (await response.json().catch(() => null)) as ChatCompletionResponse | null;
  if (!response.ok) {
    const message = payload?.error?.message || response.statusText || "Unknown OpenRouter error";
    throw new Error(`${response.status}: ${message}`);
  }

  if (payload?.error) {
    const message = payload.error.message || "Unknown OpenRouter provider error";
    throw new Error(`${payload.error.code || response.status}: ${message}`);
  }

  return payload;
}

async function generateWithOpenRouter(prompt: string, config: ModelConfig) {
  const maxAttempts = getConfiguredModels().length;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    try {
      const payload = await requestOpenRouter(prompt, config, attempt);
      const choice = payload?.choices?.[0];
      const content = readMessageContent(choice?.message?.content).trim();

      if (content) {
        return {
          response: {
            text: () => content,
          },
        };
      }

      lastError = new Error(
        `OpenRouter returned an empty response from ${payload?.model || "unknown model"}${
          choice?.finish_reason ? ` (finish_reason: ${choice.finish_reason})` : ""
        }`
      );
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
    }
  }

  throw lastError || new Error("OpenRouter returned no usable response");
}

function createModel(config: ModelConfig) {
  return {
    generateContent: (prompt: string) => generateWithOpenRouter(prompt, config),
  };
}

export function getGenerationModel() {
  return createModel({
    temperature: 0.7,
    topP: 0.95,
    maxOutputTokens: 8192,
    jsonMode: true,
  });
}

export function getSectionModel() {
  return createModel({
    temperature: 0.6,
    topP: 0.9,
    maxOutputTokens: 4096,
    jsonMode: true,
  });
}
