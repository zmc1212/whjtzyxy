import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie } from 'recharts';
import { Video } from 'lucide-react';

// --- Types & Interfaces ---
interface ChartProps {
  data: any[];
}

const customTooltipStyle = {
  backgroundColor: 'rgba(3, 7, 18, 0.95)',
  border: '1px solid rgba(6, 182, 212, 0.5)',
  color: '#e0f2fe',
  fontSize: '12px',
  fontFamily: 'Rajdhani, sans-serif',
  boxShadow: '0 0 10px rgba(6, 182, 212, 0.2)'
};

// --- Power Usage Area Chart ---
export const PowerChart: React.FC<ChartProps> = ({ data }) => (
  <ResponsiveContainer width="100%" height="100%">
    <AreaChart data={data}>
      <defs>
        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.6}/>
          <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
        </linearGradient>
        <linearGradient id="colorValue2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.6}/>
          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
      <XAxis dataKey="time" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} dy={10} />
      <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} dx={-10} />
      <Tooltip contentStyle={customTooltipStyle} itemStyle={{ color: '#22d3ee' }} />
      <Area 
        type="monotone" 
        dataKey="value" 
        stroke="#06b6d4" 
        strokeWidth={2}
        fillOpacity={1} 
        fill="url(#colorValue)" 
        isAnimationActive={true}
      />
      {data[0]?.value2 && (
        <Area 
          type="monotone" 
          dataKey="value2" 
          stroke="#8b5cf6" 
          strokeWidth={2}
          fillOpacity={1} 
          fill="url(#colorValue2)" 
          isAnimationActive={true}
        />
      )}
    </AreaChart>
  </ResponsiveContainer>
);

// --- Device Status Bar Chart ---
export const DeviceStatusChart: React.FC<ChartProps> = ({ data }) => (
  <ResponsiveContainer width="100%" height="100%">
    <BarChart data={data} layout="vertical" barSize={12}>
      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={true} vertical={false} />
      <XAxis type="number" stroke="#475569" fontSize={10} hide />
      <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} width={70} tickLine={false} axisLine={false} />
      <Tooltip cursor={{fill: 'rgba(6,182,212,0.1)'}} contentStyle={customTooltipStyle} />
      <Bar dataKey="value" radius={[0, 4, 4, 0]}>
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#06b6d4' : '#6366f1'} />
        ))}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
);

// --- Efficiency Pie Chart ---
export const EfficiencyChart: React.FC<ChartProps> = ({ data }) => (
  <ResponsiveContainer width="100%" height="100%">
    <PieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        innerRadius={45}
        outerRadius={65}
        paddingAngle={4}
        dataKey="value"
        stroke="none"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={['#06b6d4', '#3b82f6', '#1e293b', '#64748b'][index % 4]} />
        ))}
      </Pie>
      <Tooltip contentStyle={customTooltipStyle} />
    </PieChart>
  </ResponsiveContainer>
);

// --- Simulated Video Grid for Security ---
export const VideoGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-2 gap-3 h-full p-1">
      {[1, 2, 3, 4].map((cam) => (
        <div key={cam} className="relative bg-black/60 border border-white/10 rounded-sm overflow-hidden group">
          {/* Static Noise Effect Overlay */}
          <div className="absolute inset-0 bg-[url('https://media.giphy.com/media/oEI9uBYSzLpBK/giphy.gif')] opacity-5 pointer-events-none mix-blend-overlay bg-cover scale-150"></div>
          
          {/* Camera Info Header */}
          <div className="absolute top-2 left-2 right-2 flex justify-between items-center z-10">
             <div className="bg-black/60 px-1.5 py-0.5 rounded text-[8px] font-mono text-cyan-500 tracking-wider">
               摄像头_0{cam} [实时]
             </div>
             <div className="flex items-center gap-1 bg-black/60 px-1.5 py-0.5 rounded text-[8px] font-mono text-red-500">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                录制
             </div>
          </div>

          {/* Timestamp */}
          <div className="absolute bottom-2 right-2 text-[8px] font-mono text-white/70 bg-black/40 px-1 rounded z-10">
             {new Date().toLocaleTimeString()}
          </div>
          
          {/* Center Placeholder */}
          <div className="flex items-center justify-center h-full text-cyan-900/30 group-hover:text-cyan-500/50 transition-colors">
            <Video size={32} />
          </div>

          {/* Targeting Corners */}
          <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-white/30"></div>
          <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-white/30"></div>
          <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-white/30"></div>
          <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-white/30"></div>

          {/* Scanning Line (Subtle) */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-white/10 animate-scan opacity-30"></div>
        </div>
      ))}
    </div>
  );
};