const OpenAI = require("openai");

// 🔑 Create client
const getClient = () => {
  const apiKey = process.env.OPENROUTER_API_KEY;

  console.log(
    "[OpenRouter] API Key exists:",
    !!apiKey,
    "| Length:",
    apiKey?.length
  );

  if (!apiKey) {
    throw new Error("Valid OpenRouter API Key is missing.");
  }

  return new OpenAI({
    apiKey,
    baseURL: "https://openrouter.ai/api/v1",
  });
};

// 🔥 Models (Primary + Fallbacks)
const PRIMARY_MODEL = "nvidia/nemotron-3-super-120b-a12b:free";

const FALLBACK_MODELS = [
  "mistralai/mistral-7b-instruct:free",
  "google/gemma-7b-it:free"
];

// 🔁 Common function to try models
const callModel = async (client, prompt) => {
  const models = [PRIMARY_MODEL, ...FALLBACK_MODELS];

  for (let model of models) {
    try {
      console.log(`[OpenRouter] Trying model: ${model}`);

      const response = await client.chat.completions.create({
        model,
        messages: [{ role: "user", content: prompt }],
      });

      const text = response.choices?.[0]?.message?.content;

      if (!text) throw new Error("Empty response");

      console.log(`[OpenRouter] Success with model: ${model}`);

      return text;

    } catch (err) {
      console.warn(
        `[OpenRouter] Model failed: ${model} → ${err.message}`
      );
    }
  }

  throw new Error("All models failed");
};

// ✅ Summarize Note
const summarizeNote = async (content) => {
  try {
    const client = getClient();

    const prompt = `Summarize the following note in bullet points. Be extremely concise:

${content.slice(0, 5000)}`;

    console.log("[OpenRouter] Summarize request...");

    const text = await callModel(client, prompt);

    console.log("[OpenRouter] Summary length:", text.length);

    return text;

  } catch (error) {
    console.error("[OpenRouter] summarizeNote error:", error.message);
    throw error;
  }
};

// ✅ Suggest Links / Tags
const suggestLinks = async (content, existingTags) => {
  try {
    const client = getClient();

    const prompt = `Suggest exactly 3 short related topics or tags.

Existing tags: ${existingTags}

Note:
${content.slice(0, 5000)}

Return ONLY comma-separated values.`;

    console.log("[OpenRouter] Suggest-links request...");

    const text = await callModel(client, prompt);

    console.log(
      "[OpenRouter] Suggestions raw:",
      text.substring(0, 100)
    );

    return text
      .split(",")
      .map((item) => item.replace(".", "").trim());

  } catch (error) {
    console.error("[OpenRouter] suggestLinks error:", error.message);
    throw error;
  }
};

module.exports = {
  summarizeNote,
  suggestLinks,
};