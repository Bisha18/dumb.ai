import React, { useState } from 'react';
import api from '../services/api';

const AIInsights = () => {
  const [query, setQuery] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const res = await api.post('/ai/summarize', { content: query });
      setSummary(res.data.summary);
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Unknown error';
      setSummary(`Failed to fetch summary: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h2 className="text-4xl font-black uppercase bg-neo-black text-white p-4 inline-block transform rotate-1 border-brutal border-neo-yellow mb-8">
        AI Insights
      </h2>

      <div className="bg-neo-blue border-brutal-lg shadow-brutal p-6">
        <label className="block font-bold text-white text-xl mb-4">Paste Note Content to Summarize:</label>
        <textarea 
          className="w-full h-48 border-brutal p-4 font-medium text-lg outline-none resize-none mb-4"
          placeholder="Paste anything here..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button 
          onClick={handleSummarize}
          disabled={loading}
          className="bg-neo-yellow text-neo-black border-brutal shadow-brutal hover:translate-y-1 hover:shadow-none transition-all px-6 py-3 font-bold text-xl uppercase w-full cursor-pointer disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Summarize'}
        </button>
      </div>

      {summary && (
        <div className="bg-white border-brutal shadow-brutal p-6 mt-8 relative">
          <div className="absolute -top-3 -right-3 bg-neo-red text-white border-brutal px-3 py-1 font-bold text-sm transform -rotate-6">
            Result
          </div>
          <h3 className="font-bold text-2xl mb-4 border-b-brutal pb-2">Summary</h3>
          <div className="prose prose-lg font-medium">
            {summary.split('\n').map((line, idx) => (
              <p key={idx} className="mb-2">{line}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIInsights;
