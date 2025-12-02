import { GoogleGenAI } from "@google/genai";
import { MetricData, SystemAlert } from '../types';

export const analyzeSystemStatus = async (
  metrics: MetricData[], 
  alerts: SystemAlert[]
): Promise<string> => {
  try {
    // Check if API key is available
    if (!process.env.API_KEY) {
      return "错误: 未检测到 API_KEY 环境变量，无法进行 AI 分析。";
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `
      扮演一个智慧校园数字孪生平台的 AI 核心大脑。
      分析以下校园子系统的运行指标和告警信息：安全用电、空调智控、智慧照明、光伏发电、水务系统。
      
      当前指标:
      ${JSON.stringify(metrics, null, 2)}
      
      最近告警:
      ${JSON.stringify(alerts, null, 2)}
      
      请提供一份简短的（100字以内）、科幻风格的系统运行报告。
      请用中文回答。
      重点关注异常数据，如果没有异常则汇报系统运转平稳，并在最后给出一条优化建议。
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "系统分析完成。全域子系统运转正常，未检测到异常波动。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "警告: AI 分析模块离线。无法连接至神经网络核心。";
  }
};