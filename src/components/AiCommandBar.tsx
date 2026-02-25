'use client';

import React, { useState } from 'react';
import { Sparkles, Loader2, Send, Wand2, History, ShieldCheck } from 'lucide-react';

interface AiCommandBarProps {
  pageId?: string;
  onRefresh?: () => void;
}

export default function AiCommandBar({ pageId, onRefresh }: AiCommandBarProps) {
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [showLogs, setShowLogs] = useState(false);

  const handleRunAgent = async () => {
    if (!goal.trim()) return;

    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/agent/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal, pageId, mode: 'autonomous' }),
      });

      const data = await res.json();
      if (data.success) {
        setResult(data.result);
        if (onRefresh) onRefresh();
      } else {
        setResult(`Error: ${data.details || data.error}`);
      }
    } catch (err: any) {
      setResult(`System Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-teal-100 overflow-hidden mb-8 transition-all duration-300">
      <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white font-semibold">
          <Sparkles className="animate-pulse" size={20} />
          <span>Agentic AI CMS Core</span>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium text-teal-100">
          <div className="flex items-center gap-1">
            <ShieldCheck size={14} />
            <span>Autonomous Mode Active</span>
          </div>
          <button
            onClick={() => setShowLogs(!showLogs)}
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <History size={14} />
            <span>View Agent Logs</span>
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="relative">
          <textarea
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            disabled={loading}
            placeholder="What should the AI do? (e.g., 'Optimize the homepage for conversion', 'Add a new services page about Yoga', 'Connect WhatsApp automation')"
            className="w-full h-24 p-4 pr-12 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-gray-700 resize-none"
          />
          <button
            onClick={handleRunAgent}
            disabled={loading || !goal.trim()}
            className={`absolute bottom-3 right-3 p-3 rounded-lg shadow-lg transition-all ${loading
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-teal-600 text-white hover:bg-teal-700 active:scale-95'
              }`}
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
          </button>
        </div>

        {result && (
          <div className="mt-6 p-4 bg-teal-50 border border-teal-200 rounded-xl animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-start gap-3">
              <div className="mt-1 bg-teal-100 p-1.5 rounded-full text-teal-700">
                <Wand2 size={16} />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-teal-900 mb-1">Agent Response:</h4>
                <div className="text-sm text-teal-800 leading-relaxed whitespace-pre-wrap">
                  {result}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          {['Optimize SEO', 'Build Landing Page', 'Marketing Flow', 'CRO Check'].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setGoal(suggestion)}
              className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-teal-50 hover:text-teal-700 rounded-full text-gray-600 transition-colors font-medium"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
