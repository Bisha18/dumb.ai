const OpenAI = require("openai");

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

const FREE_MODEL = "meta-llama/llama-3-8b-instruct:free";

const summarizeNote = async (content) => {
  const client = getClient();

  const response = await client.chat.completions.create({
    model: FREE_MODEL,
    messages: [
      {
        role: "user",
        content: `Summarize in bullet points:\n\n${content.slice(0, 5000)}`
      }
    ],
  });

  return response.choices[0].message.content;
};

const suggestLinks = async (content, existingTags) => {
  const client = getClient();

  const response = await client.chat.completions.create({
    model: FREE_MODEL,
    messages: [
      {
        role: "user",
        content: `Suggest 3 tags. Existing: ${existingTags}\n\n${content.slice(0, 5000)}\n\nComma separated only.`
      }
    ],
  });

  return response.choices[0].message.content
    .split(",")
    .map(i => i.trim());
};

module.exports = {
  summarizeNote,
  suggestLinks,
};