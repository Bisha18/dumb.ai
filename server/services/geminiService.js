const { GoogleGenAI } = require('@google/genai');

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  console.log('[Gemini] API Key exists:', !!apiKey, '| Length:', apiKey?.length, '| Starts with:', apiKey?.substring(0, 5));
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new Error('Valid Gemini API Key is missing.');
  }
  return new GoogleGenAI({ apiKey });
};

const summarizeNote = async (content) => {
  try {
    const ai = getGeminiClient();
    const prompt = `Summarize the following note in bullet points. Be extremely concise:\n\n${content}`;
    
    console.log('[Gemini] Calling generateContent for summarize...');
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });
    
    console.log('[Gemini] Response received, text:', typeof response.text, response.text?.substring(0, 100));
    return response.text;
  } catch (error) {
    console.error('[Gemini] summarizeNote error:', error.message);
    console.error('[Gemini] Error details:', JSON.stringify(error, null, 2));
    throw error;
  }
};

const suggestLinks = async (content, existingTags) => {
  try {
    const ai = getGeminiClient();
    const prompt = `Based on the following note, suggest exactly 3 short related topics or tags. The existing tags are: ${existingTags}. Note content:\n\n${content}\n\nFormat the response as comma separated values only, no markdown formatting.`;
    
    console.log('[Gemini] Calling generateContent for suggest-links...');
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });
    
    console.log('[Gemini] Response received:', response.text?.substring(0, 100));
    return response.text.split(',').map(item => item.trim());
  } catch (error) {
    console.error('[Gemini] suggestLinks error:', error.message);
    console.error('[Gemini] Error details:', JSON.stringify(error, null, 2));
    throw error;
  }
};

module.exports = {
  summarizeNote,
  suggestLinks,
};
