const OpenRouter = require("@openrouter/sdk");

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

  return new OpenRouter({ apiKey });
};

// 🔥 FREE MODEL (Primary)
const FREE_MODEL = "meta-llama/llama-3-8b-instruct:free";

// 🔁 Backup FREE MODEL
const FALLBACK_MODEL = "mistralai/mistral-7b-instruct:free";

// ✅ Summarize Note
const summarizeNote = async (content) => {
  const client = getClient();
  const prompt = `Summarize the following note in bullet points. Be extremely concise:\n\n${content.slice(0, 5000)}`;

  try {
    console.log("[OpenRouter] Calling summarize (primary model)...");

    const response = await client.chat.completions.create({
      model: FREE_MODEL,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.choices[0].message.content;

    console.log("[OpenRouter] Summary received (primary), length:", text?.length);

    return text;

  } catch (error) {
    console.warn("[OpenRouter] Primary model failed, switching to fallback...");

    try {
      const response = await client.chat.completions.create({
        model: FALLBACK_MODEL,
        messages: [{ role: "user", content: prompt }],
      });

      const text = response.choices[0].message.content;

      console.log("[OpenRouter] Summary received (fallback), length:", text?.length);

      return text;

    } catch (err) {
      console.error("[OpenRouter] summarizeNote error:", err.message);
      throw err;
    }
  }
};

// ✅ Suggest Links / Tags
const suggestLinks = async (content, existingTags) => {
  const client = getClient();

  const prompt = `Suggest exactly 3 short related topics or tags.

Existing tags: ${existingTags}

Note:
${content.slice(0, 5000)}

Return ONLY comma-separated values.`;

  try {
    console.log("[OpenRouter] Calling suggest-links (primary model)...");

    const response = await client.chat.completions.create({
      model: FREE_MODEL,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.choices[0].message.content;

    console.log(
      "[OpenRouter] Suggestions received (primary):",
      text?.substring(0, 100)
    );

    return text
      .split(",")
      .map((item) => item.replace(".", "").trim());

  } catch (error) {
    console.warn("[OpenRouter] Primary model failed, switching to fallback...");

    try {
      const response = await client.chat.completions.create({
        model: FALLBACK_MODEL,
        messages: [{ role: "user", content: prompt }],
      });

      const text = response.choices[0].message.content;

      console.log(
        "[OpenRouter] Suggestions received (fallback):",
        text?.substring(0, 100)
      );

      return text
        .split(",")
        .map((item) => item.replace(".", "").trim());

    } catch (err) {
      console.error("[OpenRouter] suggestLinks error:", err.message);
      throw err;
    }
  }
};

module.exports = {
  summarizeNote,
  suggestLinks,
};