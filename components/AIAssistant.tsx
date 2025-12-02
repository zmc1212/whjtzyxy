import React, { useState } from 'react';
import { Bot, RefreshCw, Cpu } from 'lucide-react';
import { analyzeSystemStatus } from '../services/geminiService';
import { MetricData, SystemAlert } from '../types';

interface AIAssistantProps {
  metrics: MetricData[];
  alerts: SystemAlert[];
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ metrics, alerts }) => {
  const [analysis, setAnalysis] = useState<string>("系统已初始化。等待手动指令启动全域诊断...");
  const [loading, setLoading] = useState(false);

  const handleAnalysis = async () => {
    setLoading(true);
    setAnalysis("正在建立神经连接... 读取传感器遥测数据...");
    const result = await analyzeSystemStatus(metrics, alerts);
    // Simulate typing effect
    setAnalysis('');
    let i = 0;
    const interval = setInterval(() => {
      setAnalysis(prev => prev + result.charAt(i));
      i++;
      if (i >= result.length) clearInterval(interval);
    }, 30); // typing speed
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full gap-3">
      <div className="flex-1 bg-black/40 rounded p-3 border border-cyan-500/20 font-mono text-xs text-cyan-300 overflow-y-auto custom-scrollbar leading-relaxed shadow-inner">
        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/5 text-neon-blue">
          <Bot size={14} />
          <span className="font-bold">AI 智脑核心</span>
        </div>
        <p className="whitespace-pre-wrap">{analysis}</p>
        {loading && <span className="inline-block w-2 h-4 bg-cyan-400 animate-pulse ml-1"></span>}
      </div>
      
      <button 
        onClick={handleAnalysis}
        disabled={loading}
        className={`
          flex items-center justify-center gap-2 py-2 px-4 
          bg-cyan-900/40 hover:bg-cyan-800/60 
          border border-cyan-500/50 hover:border-cyan-400 
          text-cyan-100 font-sci text-xs uppercase tracking-wider 
          transition-all duration-300 rounded group
          ${loading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <div className={`relative ${loading ? 'animate-spin' : ''}`}>
           <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
           {loading && <span className="absolute inset-0 blur-sm bg-cyan-400/50"></span>}
        </div>
        {loading ? '分析中...' : '运行系统诊断'}
      </button>
    </div>
  );
};