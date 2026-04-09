const { GoogleGenerativeAI } = require('@google/generative-ai');

const getModel = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  console.log('[Gemini] API Key exists:', !!apiKey, '| Length:', apiKey?.length);
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new Error('Valid Gemini API Key is missing.');
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
};

const summarizeNote = async (content) => {
  try {
    const model = getModel();
    const prompt = `Summarize the following note in bullet points. Be extremely concise:\n\n${content}`;

    console.log('[Gemini] Calling generateContent for summarize...');
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    console.log('[Gemini] Summary received, length:', text?.length);
    return text;
  } catch (error) {
    console.error('[Gemini] summarizeNote error:', error.message);
    throw error;
  }
};

const suggestLinks = async (content, existingTags) => {
  try {
    const model = getModel();
    const prompt = `Based on the following note, suggest exactly 3 short related topics or tags. The existing tags are: ${existingTags}. Note content:\n\n${content}\n\nFormat the response as comma separated values only, no markdown formatting.`;

    console.log('[Gemini] Calling generateContent for suggest-links...');
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    console.log('[Gemini] Suggestions received:', text?.substring(0, 100));
    return text.split(',').map(item => item.trim());
  } catch (error) {
    console.error('[Gemini] suggestLinks error:', error.message);
    throw error;
  }
};

module.exports = {
  summarizeNote,
  suggestLinks,
};
