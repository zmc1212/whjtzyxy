import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { TwinMode } from '../types';
import { Zap, Video, Droplets, Shield, Radio } from 'lucide-react';

// --- Types ---

interface MarkerConfig {
  id: string;
  position: [number, number, number];
  type: 'power' | 'security' | 'water';
  label: string;
  visibleModes: TwinMode[];
}

const MARKERS: MarkerConfig[] = [
  // Power
  { id: 'p1', position: [0, 25, 0], type: 'power', label: '主变电站', visibleModes: [TwinMode.OVERVIEW, TwinMode.ENERGY] },
  { id: 'p2', position: [25, 30, -25], type: 'power', label: '光伏阵列 A', visibleModes: [TwinMode.ENERGY] },
  { id: 'p3', position: [-25, 30, -25], type: 'power', label: '光伏阵列 B', visibleModes: [TwinMode.ENERGY] },
  // Water
  { id: 'w1', position: [30, 20, 30], type: 'water', label: '智能灌溉点', visibleModes: [TwinMode.OVERVIEW] },
  { id: 'w2', position: [0, 15, 50], type: 'water', label: '开水房', visibleModes: [TwinMode.OVERVIEW] },
  // Security
  { id: 's1', position: [20, 5, 20], type: 'security', label: '监控 #01', visibleModes: [TwinMode.SECURITY] },
  { id: 's2', position: [-20, 5, 20], type: 'security', label: '监控 #02', visibleModes: [TwinMode.SECURITY] },
  { id: 's3', position: [20, 5, -20], type: 'security', label: '监控 #03', visibleModes: [TwinMode.SECURITY] },
  { id: 's4', position: [-20, 5, -20], type: 'security', label: '监控 #04', visibleModes: [TwinMode.SECURITY] },
  { id: 's5', position: [0, 5, 60], type: 'security', label: '门禁系统', visibleModes: [TwinMode.SECURITY] },
];

// --- Sub-components ---

// Native Building with Edges
const Building = ({ position, args, color, label }: { position: [number, number, number], args: [number, number, number], color: string, label?: string }) => {
  const geometry = useMemo(() => new THREE.BoxGeometry(...args), [args]);
  const edgesGeometry = useMemo(() => new THREE.EdgesGeometry(geometry), [geometry]);

  return (
    <group position={position}>
      {/* Main Body */}
      <mesh geometry={geometry}>
        <meshStandardMaterial 
          color={color} 
          transparent 
          opacity={0.9} 
          metalness={0.6} 
          roughness={0.2} 
        />
      </mesh>
      {/* Glowing Edges */}
      <lineSegments geometry={edgesGeometry}>
        <lineBasicMaterial color="#00f3ff" transparent opacity={0.4} />
      </lineSegments>
      
      {/* Simple Roof Detail */}
      <mesh position={[0, args[1]/2 + 0.1, 0]} rotation={[-Math.PI/2, 0, 0]}>
         <planeGeometry args={[args[0] * 0.8, args[2] * 0.8]} />
         <meshBasicMaterial color="#00f3ff" wireframe opacity={0.2} transparent />
      </mesh>
    </group>
  );
};

// Component to track 3D positions and update DOM elements
const MarkerTracker = ({ markers, markerRefs, mode }: { markers: MarkerConfig[], markerRefs: React.MutableRefObject<(HTMLDivElement | null)[]>, mode: TwinMode }) => {
  const { camera, size } = useThree();
  const vec = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    markers.forEach((marker, index) => {
      const el = markerRefs.current[index];
      if (!el) return;

      // Visibility Check
      if (!marker.visibleModes.includes(mode)) {
        el.style.opacity = '0';
        el.style.pointerEvents = 'none';
        return;
      }

      // Projection
      vec.set(...marker.position);
      vec.project(camera);

      // Check if behind camera or out of view bounds (loose check)
      if (vec.z > 1 || Math.abs(vec.x) > 1.2 || Math.abs(vec.y) > 1.2) {
        el.style.opacity = '0';
        return;
      }

      // Convert to screen coords
      const x = (vec.x * 0.5 + 0.5) * size.width;
      const y = (-(vec.y * 0.5) + 0.5) * size.height;

      // Update DOM
      el.style.opacity = '1';
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -100%)`;
      el.style.zIndex = Math.floor((1 - vec.z) * 1000).toString();
    });
  });

  return null;
};

// Scene Content with Auto-Rotation
const SceneContent = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1; // Slow rotation
    }
  });

  return (
    <group ref={groupRef}>
       {/* Floor */}
      <gridHelper args={[200, 40, 0x06b6d4, 0x112244]} position={[0, -0.1, 0]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]}>
        <planeGeometry args={[200, 200]} />
        <meshBasicMaterial color="#030712" transparent opacity={0.8} />
      </mesh>

       {/* Buildings */}
      <Building position={[0, 10, 0]} args={[20, 20, 20]} color="#0b1628" label="行政楼" />
      <Building position={[30, 8, 30]} args={[15, 16, 15]} color="#0b1628" label="图书馆" />
      <Building position={[-30, 6, 30]} args={[15, 12, 15]} color="#0b1628" label="实验楼" />
      <Building position={[-25, 12, -25]} args={[18, 24, 18]} color="#0b1628" label="教学楼A" />
      <Building position={[25, 12, -25]} args={[18, 24, 18]} color="#0b1628" label="教学楼B" />
      <Building position={[0, 5, 50]} args={[40, 10, 10]} color="#0b1628" label="体育馆" />
    </group>
  );
};

// --- Main Component ---

interface CentralSceneProps {
  mode: TwinMode;
}

export const CentralScene: React.FC<CentralSceneProps> = ({ mode }) => {
  const markerRefs = useRef<(HTMLDivElement | null)[]>([]);

  return (
    <div className="relative w-full h-full">
      <Canvas 
        shadows 
        dpr={[1, 2]} 
        camera={{ position: [60, 50, 60], fov: 45 }}
      >
        <color attach="background" args={['#030712']} />
        
        {/* Lights */}
        <ambientLight intensity={0.5} color="#06b6d4" />
        <pointLight position={[100, 100, 100]} intensity={1} color="#ffffff" />
        
        {/* Simple Stars manually */}
        <points>
           <bufferGeometry>
              <bufferAttribute 
                attach="attributes-position"
                count={1000}
                array={useMemo(() => {
                   const pos = new Float32Array(1000 * 3);
                   for(let i=0;i<3000;i++) pos[i] = (Math.random() - 0.5) * 300;
                   return pos;
                }, [])}
                itemSize={3}
              />
           </bufferGeometry>
           <pointsMaterial size={1} color="white" transparent opacity={0.6} sizeAttenuation={false} />
        </points>

        <SceneContent />
        <MarkerTracker markers={MARKERS} markerRefs={markerRefs} mode={mode} />
      </Canvas>

      {/* HTML Overlay for Markers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {MARKERS.map((marker, index) => {
          let Icon = Zap;
          let colorClass = 'text-yellow-400 border-yellow-500 bg-yellow-900/50';
          
          if (marker.type === 'security') {
            Icon = Video;
            colorClass = 'text-red-400 border-red-500 bg-red-900/50';
          } else if (marker.type === 'water') {
            Icon = Droplets;
            colorClass = 'text-blue-400 border-blue-500 bg-blue-900/50';
          }

          return (
            <div 
              key={marker.id}
              ref={(el) => { markerRefs.current[index] = el; }}
              className="absolute top-0 left-0 flex flex-col items-center transition-opacity duration-300 group pointer-events-auto cursor-pointer"
              style={{ opacity: 0, willChange: 'transform' }}
            >
               {/* Icon Marker */}
              <div className={`p-1.5 rounded-full border shadow-[0_0_15px_currentColor] backdrop-blur-sm ${colorClass} animate-pulse-fast`}>
                <Icon size={16} />
              </div>
              
              {/* Stem */}
              <div className={`h-8 w-px ${colorClass.split(' ')[2]}`}></div>
              
              {/* Label (Shows on Hover) */}
              <div className={`
                absolute bottom-12 opacity-0 group-hover:opacity-100 transition-all duration-300
                px-2 py-1 rounded bg-black/80 border ${colorClass.split(' ')[1]} backdrop-blur text-[10px] text-white whitespace-nowrap
              `}>
                {marker.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* HUD Overlay - Static */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none w-[500px] h-[500px]">
        <div className="absolute inset-0 border border-white/5 rounded-full animate-[spin_60s_linear_infinite]"></div>
        <div className="absolute inset-4 border border-dashed border-cyan-500/20 rounded-full animate-[spin_40s_linear_infinite_reverse]"></div>
        
        {/* Center Label */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-center">
            <div className="text-[10px] text-cyan-500 uppercase tracking-[0.2em] mb-1">目标区域</div>
            <div className="text-xl font-sci text-white drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]">综合教学区</div>
        </div>
      </div>
      
      {/* Stats HUD */}
      <div className="absolute bottom-32 left-10 pointer-events-none">
          <div className="flex gap-4">
              <div className="text-center">
                  <div className="text-[9px] text-gray-500 mb-1">总负荷</div>
                  <div className="text-2xl font-sci text-cyan-400">85<span className="text-xs">%</span></div>
              </div>
              <div className="w-px h-8 bg-white/10"></div>
               <div className="text-center">
                  <div className="text-[9px] text-gray-500 mb-1">电网稳定性</div>
                  <div className="text-2xl font-sci text-purple-400">99<span className="text-xs">%</span></div>
              </div>
          </div>
      </div>
    </div>
  );
};