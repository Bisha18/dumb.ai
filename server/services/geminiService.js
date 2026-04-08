const { GoogleGenAI } = require('@google/genai');

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new Error('Valid Gemini API Key is missing.');
  }
  return new GoogleGenAI({ apiKey });
};

const summarizeNote = async (content) => {
  const ai = getGeminiClient();
  const prompt = `Summarize the following note in bullet points. Be extremely concise:\n\n${content}`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });
  
  return response.text;
};

const suggestLinks = async (content, existingTags) => {
  const ai = getGeminiClient();
  const prompt = `Based on the following note, suggest exactly 3 short related topics or tags. The existing tags are: ${existingTags}. Note content:\n\n${content}\n\nFormat the response as comma separated values only, no markdown formatting.`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });
  
  return response.text.split(',').map(item => item.trim());
};

module.exports = {
  summarizeNote,
  suggestLinks,
};
