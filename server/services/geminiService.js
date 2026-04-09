const { GoogleGenAI } = require("@google/genai");

const getClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;

  console.log(
    "[Gemini] API Key exists:",
    !!apiKey,
    "| Length:",
    apiKey?.length
  );

  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    throw new Error("Valid Gemini API Key is missing.");
  }

  return new GoogleGenAI({ apiKey });
};

// ✅ Summarize Note
const summarizeNote = async (content) => {
  try {
    const ai = getClient();

    const prompt = `Summarize the following note in bullet points. Be extremely concise:\n\n${content.slice(0, 5000)}`;

    console.log("[Gemini] Calling generateContent for summarize...");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response.text();

    console.log("[Gemini] Summary received, length:", text?.length);

    return text;
  } catch (error) {
    console.error("[Gemini] summarizeNote error:", error.message);
    throw error;
  }
};

// ✅ Suggest Links / Tags
const suggestLinks = async (content, existingTags) => {
  try {
    const ai = getClient();

    const prompt = `Based on the following note, suggest exactly 3 short related topics or tags.
Existing tags: ${existingTags}

Note:
${content.slice(0, 5000)}

Return ONLY comma-separated values. No markdown.`;

    console.log("[Gemini] Calling generateContent for suggest-links...");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response.text();

    console.log(
      "[Gemini] Suggestions received:",
      text?.substring(0, 100)
    );

    return text
      .split(",")
      .map((item) => item.replace(".", "").trim());
  } catch (error) {
    console.error("[Gemini] suggestLinks error:", error.message);
    throw error;
  }
};

module.exports = {
  summarizeNote,
  suggestLinks,
};