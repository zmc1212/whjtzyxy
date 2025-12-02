import React, { ReactNode } from 'react';

interface SciFiCardProps {
  title: string;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
  alertLevel?: 'none' | 'warning' | 'critical';
}

export const SciFiCard: React.FC<SciFiCardProps> = ({ title, children, className = '', icon, alertLevel = 'none' }) => {
  const getBorderColor = () => {
    switch(alertLevel) {
      case 'critical': return '#ef4444';
      case 'warning': return '#eab308';
      default: return '#06b6d4';
    }
  };

  const borderColor = getBorderColor();
  const glowColor = alertLevel === 'none' ? 'rgba(6,182,212,0.1)' : alertLevel === 'warning' ? 'rgba(234,179,8,0.2)' : 'rgba(239,68,68,0.2)';

  return (
    <div className={`relative flex flex-col group ${className}`}>
      {/* Background Frame with Cut Corners */}
      <div 
        className="absolute inset-0 bg-sci-panel/80 backdrop-blur-md transition-all duration-300"
        style={{
          clipPath: 'polygon(0 12px, 12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px))',
          boxShadow: `0 0 20px ${glowColor}`,
          border: `1px solid ${borderColor}40` // Fallback
        }}
      ></div>

      {/* SVG Border Overlay for Crisp Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ filter: `drop-shadow(0 0 2px ${borderColor})` }}>
         <defs>
            <linearGradient id={`grad-${title}`} x1="0%" y1="0%" x2="100%" y2="0%">
               <stop offset="0%" stopColor={borderColor} stopOpacity="0.1" />
               <stop offset="50%" stopColor={borderColor} stopOpacity="1" />
               <stop offset="100%" stopColor={borderColor} stopOpacity="0.1" />
            </linearGradient>
         </defs>
         <path 
           d={`M 12 1 L calc(100% - 12) 1 L 100% 13 L 100% calc(100% - 13) L calc(100% - 12) calc(100% - 1) L 12 calc(100% - 1) L 0 calc(100% - 13) L 0 13 Z`} 
           fill="none" 
           stroke={borderColor} 
           strokeWidth="1" 
           strokeOpacity="0.3"
         />
         {/* Animated Highlight Line */}
         <path 
           d={`M 12 1 L calc(100% - 12) 1 L 100% 13`} 
           fill="none" 
           stroke={`url(#grad-${title})`} 
           strokeWidth="2"
           className="opacity-0 group-hover:opacity-100 transition-opacity duration-500"
         />
      </svg>

      {/* Corner Accents */}
      <div className="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2" style={{ borderColor: borderColor }}></div>
      <div className="absolute top-0 right-0 w-2 h-2 border-r-2 border-t-2" style={{ borderColor: borderColor }}></div>
      <div className="absolute bottom-0 left-0 w-2 h-2 border-l-2 border-b-2" style={{ borderColor: borderColor }}></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2" style={{ borderColor: borderColor }}></div>

      {/* Header */}
      <div className="relative z-10 flex items-center gap-2 px-5 py-3 border-b border-white/5 mx-1">
        <div className={`p-1 rounded bg-${alertLevel === 'critical' ? 'red' : 'cyan'}-500/10`}>
           {icon && React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { size: 14, className: alertLevel === 'critical' ? 'text-red-400' : 'text-neon-cyan' }) : icon}
        </div>
        <h3 className={`font-sci text-sm tracking-wider uppercase font-semibold flex-1 ${alertLevel === 'critical' ? 'text-red-100' : 'text-cyan-50'}`}>
          {title}
        </h3>
        {/* Decorative dots */}
        <div className="flex gap-1">
           <div className={`w-1 h-1 rounded-full ${borderColor === '#06b6d4' ? 'bg-cyan-500' : 'bg-red-500'}`}></div>
           <div className={`w-1 h-1 rounded-full ${borderColor === '#06b6d4' ? 'bg-cyan-500' : 'bg-red-500'} opacity-50`}></div>
           <div className={`w-1 h-1 rounded-full ${borderColor === '#06b6d4' ? 'bg-cyan-500' : 'bg-red-500'} opacity-25`}></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 p-4 overflow-hidden">
         {/* Tech Grid Background inside card */}
         <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none"></div>
         
         <div className="relative h-full">
           {children}
         </div>
      </div>
    </div>
  );
};