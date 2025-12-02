import React, { useEffect, useState } from 'react';
import { TwinMode } from '../types';

interface CentralSceneProps {
  mode: TwinMode;
}

export const CentralScene: React.FC<CentralSceneProps> = ({ mode }) => {
  const [rotation, setRotation] = useState(0);

  // Auto-rotate effect
  useEffect(() => {
    let r = 0;
    const interval = setInterval(() => {
      r += 0.1;
      setRotation(r);
    }, 20);
    return () => clearInterval(interval);
  }, []);

  // Holographic Building
  const renderBuilding = (h: number, x: number, z: number, w: number, d: number, colorBase: string, label?: string) => {
    const isSecurity = mode === TwinMode.SECURITY;
    const color = isSecurity ? 'red-500' : colorBase;
    const glowColor = isSecurity ? 'rgba(239,68,68,0.5)' : 'rgba(6,182,212,0.5)';
    
    return (
      <div 
        className="absolute preserve-3d transition-all duration-1000 group"
        style={{
          transform: `translateX(${x}px) translateZ(${z}px) translateY(${-h/2}px)`,
          width: `${w}px`,
          height: `${h}px`,
        }}
      >
        {/* Internal Glow Core */}
        <div className="absolute inset-0 blur-xl opacity-30 animate-pulse-fast" style={{ background: glowColor, transform: 'translateY(20px)' }}></div>

        {/* Walls */}
        <div className={`absolute border border-${color}/40 bg-${color}/10 backdrop-blur-[1px] shadow-[0_0_15px_rgba(0,0,0,0.5)_inset]`} style={{ width: w, height: h, transform: `rotateY(0deg) translateZ(${d/2}px)` }}>
           {/* Tech lines on building */}
           <div className={`w-full h-[1px] bg-${color}/50 mt-4`}></div>
           <div className={`w-full h-[1px] bg-${color}/50 mt-8`}></div>
        </div>
        <div className={`absolute border border-${color}/40 bg-${color}/10 backdrop-blur-[1px] shadow-[0_0_15px_rgba(0,0,0,0.5)_inset]`} style={{ width: w, height: h, transform: `rotateY(180deg) translateZ(${d/2}px)` }} />
        <div className={`absolute border border-${color}/40 bg-${color}/10 backdrop-blur-[1px] shadow-[0_0_15px_rgba(0,0,0,0.5)_inset]`} style={{ width: d, height: h, transform: `rotateY(90deg) translateZ(${w/2}px)` }}>
           <div className={`w-full h-[1px] bg-${color}/50 mt-6`}></div>
        </div>
        <div className={`absolute border border-${color}/40 bg-${color}/10 backdrop-blur-[1px] shadow-[0_0_15px_rgba(0,0,0,0.5)_inset]`} style={{ width: d, height: h, transform: `rotateY(-90deg) translateZ(${w/2}px)` }} />
        
        {/* Roof */}
        <div className={`absolute border border-${color}/60 bg-${color}/30 overflow-hidden`} style={{ width: w, height: d, transform: `rotateX(90deg) translateZ(${h/2}px)` }}>
           <div className="w-full h-full bg-grid-pattern opacity-50"></div>
           {/* Roof Logo/Marker */}
           <div className={`absolute top-1/2 left-1/2 w-4 h-4 -translate-x-1/2 -translate-y-1/2 border-2 border-${color} rounded-full`}></div>
        </div>

        {/* Floating Label (Always facing somewhat towards viewer logic simplified) */}
        {label && (
          <div 
             className="absolute -top-12 left-1/2 -translate-x-1/2 text-[10px] text-white whitespace-nowrap bg-black/60 px-2 py-1 border border-white/20 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
             style={{ transform: `rotateY(${-rotation}deg)` }} // Counter-rotate to face camera
          >
             {label}
          </div>
        )}
      </div>
    );
  };

  const themeColor = mode === TwinMode.SECURITY ? 'text-red-400' : 'text-neon-cyan';

  return (
    <div className="relative w-full h-full overflow-hidden flex items-center justify-center perspective-container">
      
      {/* 3D Scene Container */}
      <div 
        className="preserve-3d relative w-full h-full flex items-center justify-center transition-transform duration-1000 ease-out"
        style={{ 
          transform: `rotateX(60deg) rotateZ(${rotation}deg) scale3d(0.8, 0.8, 0.8)` 
        }}
      >
        {/* Dynamic Floor Grid */}
        <div 
          className="absolute w-[2000px] h-[2000px] rounded-full opacity-40 animate-spin-slow"
          style={{
            background: `
              radial-gradient(circle at center, rgba(0,0,0,0) 0%, rgba(3,7,18,0.8) 70%),
              repeating-radial-gradient(circle at center, rgba(6,182,212,0.15) 0, transparent 1px, transparent 40px),
              linear-gradient(rgba(6,182,212,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(6,182,212,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '100% 100%, 100% 100%, 80px 80px, 80px 80px',
            transform: 'translateZ(-40px)',
            animationDuration: '120s'
          }}
        />

        {/* Holographic Rings */}
        <div className="absolute w-[800px] h-[800px] border border-dashed border-cyan-500/20 rounded-full animate-spin-reverse-slow" style={{ transform: 'translateZ(-30px)' }}></div>
        <div className="absolute w-[600px] h-[600px] border border-cyan-500/10 rounded-full" style={{ transform: 'translateZ(-30px)' }}></div>
        
        {/* Rotating Data Ring with Particles */}
        <div className="absolute w-[1200px] h-[1200px] rounded-full animate-spin-slow border border-white/5" style={{ transform: 'translateZ(-20px)' }}>
            <div className="absolute top-0 left-1/2 w-2 h-2 bg-cyan-400 rounded-full blur-[2px]"></div>
            <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-purple-400 rounded-full blur-[2px]"></div>
            <div className="absolute left-0 top-1/2 w-2 h-2 bg-blue-400 rounded-full blur-[2px]"></div>
        </div>

        {/* Central Hub - Teaching Building */}
        {renderBuilding(200, 0, 0, 80, 80, 'cyan-500', '行政中心')}
        
        {/* Ring 1 Buildings - Library & Admin */}
        {renderBuilding(100, 120, 0, 40, 40, 'blue-500', '图书馆')}
        {renderBuilding(110, -120, 0, 40, 40, 'blue-500', '科技馆')}
        {renderBuilding(90, 0, 120, 40, 40, 'blue-500', '艺术楼')}
        {renderBuilding(130, 0, -120, 40, 40, 'blue-500', '信息中心')}

        {/* Ring 2 Buildings - Dorms & Gym */}
        {renderBuilding(60, 180, 60, 30, 30, 'indigo-500')}
        {renderBuilding(50, -180, -70, 30, 30, 'indigo-500')}
        {renderBuilding(75, 80, 180, 30, 30, 'indigo-500')}
        {renderBuilding(65, -70, 190, 30, 30, 'indigo-500')}

        {/* Vertical Scanning Laser */}
        <div className="absolute w-[1000px] h-[1000px] bg-gradient-to-t from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 animate-scan pointer-events-none" 
             style={{ transform: 'rotateX(-90deg) translateZ(100px)', opacity: 0.3 }}></div>
      </div>

      {/* --- HUD OVERLAYS (2D Layer on top of 3D) --- */}
      
      {/* Central Target Reticle */}
      <div className="absolute pointer-events-none opacity-40">
        <div className="w-[400px] h-[400px] border border-white/10 rounded-full flex items-center justify-center">
           <div className="w-[380px] h-[380px] border border-dashed border-cyan-500/20 rounded-full animate-spin-slow"></div>
           {/* Crosshair */}
           <div className="absolute w-4 h-4 border-l border-t border-cyan-400 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
           <div className="absolute w-4 h-4 border-r border-b border-cyan-400 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
        </div>
      </div>

      {/* Floating Info Panels */}
      <div className="absolute top-32 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/40 backdrop-blur-md px-6 py-2 rounded-full border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></div>
        <div className="flex flex-col items-start">
           <span className="text-[10px] text-gray-400 uppercase tracking-widest leading-none mb-1">目标区域</span>
           <span className={`font-sci font-bold text-lg leading-none ${themeColor}`}>教学主楼 A-7</span>
        </div>
        <div className="h-6 w-px bg-white/10 mx-2"></div>
        <div className="font-mono text-xs text-cyan-200">
           LAT: 34.2104° N<br/>LON: 108.9321° E
        </div>
      </div>

      <div className="absolute bottom-24 flex gap-20 pointer-events-none opacity-80">
        <div className="text-center group">
          <p className="text-[10px] uppercase text-gray-500 group-hover:text-cyan-400 transition-colors">总用电负荷</p>
          <div className="flex items-baseline justify-center gap-1">
             <p className="font-sci text-2xl text-white tracking-wider">85</p>
             <span className="text-xs text-cyan-500">%</span>
          </div>
          <div className="w-24 h-1 bg-gray-800 mt-1 rounded-full overflow-hidden">
             <div className="h-full bg-cyan-500 w-[85%] animate-pulse"></div>
          </div>
        </div>
        <div className="text-center group">
          <p className="text-[10px] uppercase text-gray-500 group-hover:text-purple-400 transition-colors">电网稳定性</p>
          <div className="flex items-baseline justify-center gap-1">
             <p className="font-sci text-2xl text-white tracking-wider">99.9</p>
             <span className="text-xs text-purple-500">%</span>
          </div>
          <div className="w-24 h-1 bg-gray-800 mt-1 rounded-full overflow-hidden">
             <div className="h-full bg-purple-500 w-[99%]"></div>
          </div>
        </div>
      </div>
    </div>
  );
};