import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Lightbulb, 
  Droplets, 
  Sun, 
  ShieldAlert, 
  Wifi, 
  Clock, 
  Globe,
  Wind,
  Video,
  FileText,
  Flame,
  Activity,
  BarChart3,
  Leaf,
  Layers,
  Hexagon
} from 'lucide-react';
import { SciFiCard } from './components/SciFiCard';
import { PowerChart, DeviceStatusChart, EfficiencyChart, VideoGrid } from './components/Charts';
import { CentralScene } from './components/CentralScene';
import { AIAssistant } from './components/AIAssistant';
import { TwinMode, MetricData, SystemAlert, ChartDataPoint, SecurityLog } from './types';

// --- Mock Data Generators ---
const generatePowerData = (): ChartDataPoint[] => {
  return Array.from({ length: 12 }, (_, i) => ({
    time: `${i * 2}:00`,
    value: 300 + Math.random() * 100,
    value2: 25 + Math.random() * 5
  }));
};

const generateACStatusData = () => [
  { name: '运行中', value: 85 },
  { name: '待机', value: 12 },
  { name: '维护中', value: 3 },
  { name: '故障', value: 0 },
];

const generateLightingData = () => [
  { name: '节能', value: 75 },
  { name: '全亮', value: 20 },
  { name: '关闭', value: 5 },
];

const generateEnergyComposition = () => [
  { name: '市电', value: 65 },
  { name: '光伏', value: 30 },
  { name: '其他', value: 5 },
];

const generatePVData = (): ChartDataPoint[] => {
  return Array.from({ length: 8 }, (_, i) => ({
    time: `${i + 8}:00`,
    value: Math.sin(i / 3) * 500 + Math.random() * 50,
  }));
};

const mockAlerts: SystemAlert[] = [
  { id: '1', level: 'warning', message: '图书馆区域空调负荷过高', timestamp: '14:32' },
  { id: '2', level: 'info', message: '节水灌溉系统启动', timestamp: '14:00' },
  { id: '3', level: 'critical', message: '配电室B温度异常', timestamp: '13:45' },
];

const mockSecurityLogs: SecurityLog[] = [
  { id: '1', location: '教学楼A正门', event: '门禁通过', time: '14:35:12', status: 'normal' },
  { id: '2', location: '实验楼B后门', event: '强行闯入', time: '14:32:05', status: 'alert' },
  { id: '3', location: '地下车库C区', event: '车辆违停', time: '14:28:33', status: 'normal' },
  { id: '4', location: '图书馆主入口', event: '人脸识别', time: '14:25:10', status: 'normal' },
];

const mockMetrics: MetricData[] = [
  { name: '总用电负荷', value: 3420, trend: 'up' },
  { name: '光伏发电量', value: 1240, trend: 'stable' },
  { name: '今日节水量', value: 78, trend: 'up' },
];

const App: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [activeMode, setActiveMode] = useState<TwinMode>(TwinMode.OVERVIEW);
  const [powerData, setPowerData] = useState<ChartDataPoint[]>(generatePowerData());
  const [pvData, setPvData] = useState<ChartDataPoint[]>(generatePVData());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPowerData(prev => {
        const newData = [...prev.slice(1)];
        const lastTimeParts = prev[prev.length - 1].time.split(':');
        let hour = parseInt(lastTimeParts[0]) + 2;
        if (hour >= 24) hour -= 24;
        newData.push({
          time: `${hour}:00`,
          value: 300 + Math.random() * 100,
          value2: 25 + Math.random() * 5
        });
        return newData;
      });
      setPvData(prev => prev.map(p => ({...p, value: p.value + (Math.random() - 0.5) * 10})));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // --- RENDER CONTENT BASED ON MODE ---
  const renderOverviewLeft = () => (
    <>
      <div className="pointer-events-auto flex-1 min-h-[200px]">
        <SciFiCard title="安全用电监测" icon={<Zap />} className="h-full">
          <div className="flex flex-col h-full">
            <div className="grid grid-cols-2 gap-3 mb-4">
               <div className="bg-cyan-900/10 p-2 rounded border-l border-cyan-500/50">
                  <div className="text-[10px] text-cyan-400/70">配电室温湿度</div>
                  <div className="text-xl font-sci text-white mt-1">24.5<span className="text-[10px] text-gray-500">°C</span></div>
               </div>
               <div className="bg-cyan-900/10 p-2 rounded border-l border-green-500/50">
                  <div className="text-[10px] text-cyan-400/70">网关状态</div>
                  <div className="text-xl font-sci text-green-400 mt-1">在线</div>
               </div>
            </div>
            <div className="flex-1 w-full relative -ml-2">
              <PowerChart data={powerData} />
            </div>
          </div>
        </SciFiCard>
      </div>

      <div className="pointer-events-auto flex-1 min-h-[200px]">
        <SciFiCard title="空调智控系统" icon={<Wind />} className="h-full">
          <div className="flex flex-col h-full gap-2">
            <div className="flex justify-between items-center text-[10px] text-gray-400 bg-white/5 px-2 py-1 rounded-sm border border-white/5">
               <span>当前策略: 自适应节能</span>
               <span className="text-green-400">运行中</span>
            </div>
            <div className="flex h-full items-center">
               <div className="w-1/2 h-full relative">
                 <DeviceStatusChart data={generateACStatusData()} />
               </div>
               <div className="w-1/2 pl-4 flex flex-col justify-center gap-4">
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase">平均室温</p>
                    <p className="text-2xl font-sci text-cyan-300">23.5°</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase">节能率</p>
                    <p className="text-2xl font-sci text-green-400">-12%</p>
                  </div>
               </div>
            </div>
          </div>
        </SciFiCard>
      </div>

      <div className="pointer-events-auto h-[200px]">
        <SciFiCard title="智慧照明管理" icon={<Lightbulb />} className="h-full">
           <div className="flex h-full items-center">
              <div className="w-1/2 h-full">
                 <EfficiencyChart data={generateLightingData()} />
              </div>
              <div className="w-1/2 space-y-3 text-xs font-data">
                 <div className="flex justify-between items-center border-b border-dashed border-white/10 pb-1">
                    <span className="text-gray-400">模式</span>
                    <span className="text-cyan-300">自动感应</span>
                 </div>
                 <div className="flex justify-between items-center border-b border-dashed border-white/10 pb-1">
                    <span className="text-gray-400">区域A</span>
                    <span className="text-green-400">关闭 (80%)</span>
                 </div>
              </div>
           </div>
        </SciFiCard>
      </div>
    </>
  );

  const renderOverviewRight = () => (
    <>
      <div className="pointer-events-auto h-[300px]">
         <SciFiCard title="智能中枢与告警" icon={<ShieldAlert />} alertLevel="warning" className="h-full flex flex-col">
            <div className="h-1/2 border-b border-dashed border-white/10 pb-2 mb-2">
               <AIAssistant metrics={mockMetrics} alerts={mockAlerts} />
            </div>
            <div className="h-1/2 overflow-hidden flex flex-col pt-1">
               <div className="text-[10px] text-gray-500 mb-2 uppercase tracking-widest flex items-center gap-2">
                 <span className="w-1 h-1 bg-red-500 animate-pulse rounded-full"></span>
                 实时告警流
               </div>
               <div className="overflow-y-auto custom-scrollbar space-y-2 pr-1 flex-1">
                  {mockAlerts.map((alert) => (
                     <div key={alert.id} className={`relative overflow-hidden flex items-start gap-2 p-2 bg-black/40 border border-white/5 ${
                        alert.level === 'critical' ? 'border-l-2 border-l-red-500' : 
                        alert.level === 'warning' ? 'border-l-2 border-l-yellow-500' : 'border-l-2 border-l-blue-500'
                     }`}>
                        <div className="relative z-10 w-full">
                           <div className="flex justify-between w-full gap-2 mb-1">
                              <span className={`text-[10px] px-1 rounded ${
                                alert.level === 'critical' ? 'bg-red-500/20 text-red-300' : 'bg-blue-500/20 text-blue-300'
                              }`}>{alert.level.toUpperCase()}</span>
                              <span className="text-[10px] text-gray-500 font-mono">{alert.timestamp}</span>
                           </div>
                           <p className="text-xs text-gray-300 leading-tight">{alert.message}</p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </SciFiCard>
      </div>

      <div className="pointer-events-auto flex-1 min-h-[180px]">
         <SciFiCard title="光伏发电系统" icon={<Sun />} className="h-full">
            <div className="flex flex-col h-full">
               <div className="flex justify-between mb-3 gap-2">
                  <div className="flex-1 bg-gradient-to-br from-yellow-500/10 to-transparent p-2 border border-yellow-500/20">
                     <p className="text-[9px] text-yellow-500/70 uppercase">实时功率</p>
                     <p className="text-lg font-sci text-white">452 <span className="text-[10px] text-gray-400">kW</span></p>
                  </div>
                  <div className="flex-1 bg-gradient-to-br from-cyan-500/10 to-transparent p-2 border border-cyan-500/20">
                     <p className="text-[9px] text-cyan-500/70 uppercase">今日发电</p>
                     <p className="text-lg font-sci text-white">2.4 <span className="text-[10px] text-gray-400">MWh</span></p>
                  </div>
               </div>
               <div className="flex-1 w-full -ml-2">
                  <PowerChart data={pvData} /> 
               </div>
            </div>
         </SciFiCard>
      </div>

      <div className="pointer-events-auto flex-1 min-h-[220px]">
         <SciFiCard title="智慧水务管理" icon={<Droplets />} className="h-full">
            <div className="flex flex-col h-full gap-3">
               <div className="grid grid-cols-3 gap-2 text-center bg-blue-500/5 p-2 border border-blue-500/10">
                  <div><p className="text-[9px] text-gray-500">水温</p><p className="font-sci text-sm text-blue-300">98°C</p></div>
                  <div><p className="text-[9px] text-gray-500">功率</p><p className="font-sci text-sm text-green-300">低</p></div>
                  <div><p className="text-[9px] text-gray-500">状态</p><p className="font-sci text-sm text-white">正常</p></div>
               </div>
               <div className="flex-1 flex flex-col justify-end">
                  <p className="text-[10px] text-cyan-200 mb-2 flex items-center gap-2 uppercase tracking-wider">
                     <span className="w-1 h-1 bg-cyan-400 rounded-full animate-ping"></span>
                     土壤湿度监测
                  </p>
                  <div className="space-y-3">
                     <div className="relative h-6 bg-gray-800/50 border border-white/10 rounded-sm overflow-hidden">
                        <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 to-cyan-400 w-[68%]">
                           <div className="absolute right-0 top-0 bottom-0 w-px bg-white/50 shadow-[0_0_10px_white]"></div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-between px-2 text-[10px] font-mono">
                           <span className="text-white drop-shadow-md">区域_01</span>
                           <span className="text-white drop-shadow-md">68%</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </SciFiCard>
      </div>
    </>
  );

  const renderEnergyLeft = () => (
    <>
      <div className="pointer-events-auto flex-[2]">
        <SciFiCard title="能耗深度分析" icon={<BarChart3 />} className="h-full">
           <div className="flex flex-col h-full gap-4">
              <div className="flex gap-2">
                 {['教学楼', '宿舍楼', '图书馆'].map((label, idx) => (
                   <div key={label} className="flex-1 bg-gradient-to-b from-white/5 to-transparent p-2 border-t border-white/10 text-center group hover:bg-white/10 transition-colors cursor-pointer">
                     <div className="text-[10px] text-gray-500 group-hover:text-cyan-400">{label}</div>
                     <div className="text-lg font-sci text-white">{1200 + idx * 350} <span className="text-[10px] text-gray-600">kWh</span></div>
                   </div>
                 ))}
              </div>
              <div className="flex-1 -ml-2">
                 <PowerChart data={powerData} />
              </div>
           </div>
        </SciFiCard>
      </div>
      <div className="pointer-events-auto flex-1">
         <SciFiCard title="碳排放追踪" icon={<Leaf />} className="h-full">
            <div className="flex h-full items-center gap-4">
               <div className="flex-1 h-full">
                  <DeviceStatusChart data={[
                    {name: '减排', value: 340},
                    {name: '排放', value: 890}
                  ]} />
               </div>
               <div className="w-24 text-center border-l border-dashed border-white/10 pl-4">
                  <div className="text-3xl font-sci text-green-400">12%</div>
                  <div className="text-[10px] text-gray-500 uppercase mt-1">同比下降</div>
               </div>
            </div>
         </SciFiCard>
      </div>
    </>
  );

  const renderEnergyRight = () => (
    <>
      <div className="pointer-events-auto flex-1">
         <SciFiCard title="能源结构占比" icon={<Layers />} className="h-full">
            <div className="flex h-full items-center">
               <EfficiencyChart data={generateEnergyComposition()} />
               <div className="space-y-2 text-[10px] font-mono uppercase text-gray-400">
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-sm bg-cyan-500"></div>市电 65%</div>
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-sm bg-blue-500"></div>光伏 30%</div>
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-sm bg-indigo-500"></div>其他 5%</div>
               </div>
            </div>
         </SciFiCard>
      </div>
      <div className="pointer-events-auto flex-[2]">
         <SciFiCard title="设备能效排行" icon={<Zap />} className="h-full">
            <div className="space-y-3 p-1">
               {[1,2,3,4,5].map((i) => (
                  <div key={i} className="flex items-center gap-3 group">
                     <span className={`w-5 h-5 flex items-center justify-center text-[10px] font-bold border ${i < 4 ? 'border-cyan-500 text-cyan-400' : 'border-gray-700 text-gray-600'}`}>0{i}</span>
                     <div className="flex-1">
                        <div className="flex justify-between text-[10px] mb-1">
                           <span className="text-gray-300">空调机组_#{i+10}</span>
                           <span className="font-mono text-cyan-400">{95 - i*4}% 能效</span>
                        </div>
                        <div className="w-full h-1 bg-gray-800">
                           <div className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 group-hover:shadow-[0_0_10px_#06b6d4] transition-shadow duration-300" style={{ width: `${95 - i*4}%`}}></div>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </SciFiCard>
      </div>
    </>
  );

  const renderSecurityLeft = () => (
    <>
      <div className="pointer-events-auto flex-[2]">
         <SciFiCard title="AI 视频监控" icon={<Video />} className="h-full">
             <VideoGrid />
         </SciFiCard>
      </div>
      <div className="pointer-events-auto flex-1">
         <SciFiCard title="门禁通行日志" icon={<FileText />} className="h-full">
             <div className="overflow-y-auto h-full pr-1 space-y-1">
                {mockSecurityLogs.map(log => (
                   <div key={log.id} className="flex justify-between items-center text-[10px] p-2 bg-white/5 border-l-2 border-transparent hover:border-cyan-500 transition-colors">
                      <div>
                         <div className="text-cyan-100 font-mono">{log.location}</div>
                         <div className="text-gray-500">{log.time}</div>
                      </div>
                      <div className={`px-2 py-0.5 rounded-sm ${log.status === 'alert' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                         {log.event}
                      </div>
                   </div>
                ))}
             </div>
         </SciFiCard>
      </div>
    </>
  );

  const renderSecurityRight = () => (
     <>
      <div className="pointer-events-auto flex-1">
         <SciFiCard title="消防告警系统" icon={<Flame />} alertLevel={mockAlerts.some(a => a.level === 'critical') ? 'critical' : 'none'} className="h-full">
             <div className="grid grid-cols-2 gap-3 h-full items-center text-center">
                <div className="bg-gradient-to-br from-red-900/20 to-transparent p-3 border border-red-500/20 h-full flex flex-col justify-center relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-red-500/30"></div>
                   <div className="text-[10px] text-red-400 uppercase tracking-wider">烟感探测器</div>
                   <div className="text-2xl font-sci text-white mt-2">1,240</div>
                   <div className="text-[9px] text-green-500 bg-green-900/20 py-0.5 mt-2 rounded">系统正常</div>
                </div>
                <div className="bg-gradient-to-br from-orange-900/20 to-transparent p-3 border border-orange-500/20 h-full flex flex-col justify-center relative overflow-hidden">
                   <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-orange-500/30"></div>
                   <div className="text-[10px] text-orange-400 uppercase tracking-wider">手动报警</div>
                   <div className="text-2xl font-sci text-white mt-2">0</div>
                   <div className="text-[9px] text-gray-500 py-0.5 mt-2">无触发</div>
                </div>
             </div>
         </SciFiCard>
      </div>
      <div className="pointer-events-auto flex-[2]">
         <SciFiCard title="安防设备健康度" icon={<Activity />} className="h-full">
            <div className="flex flex-col h-full gap-2">
               <div className="flex-1 relative">
                  <DeviceStatusChart data={[
                     {name: '监控', value: 98},
                     {name: '门禁', value: 95},
                     {name: '报警', value: 100},
                     {name: '广播', value: 97},
                  ]} />
               </div>
               <div className="h-1/3 bg-white/5 border-t border-white/10 p-3 text-xs flex justify-between items-center">
                  <span className="text-gray-400 uppercase tracking-widest">待维护设备</span>
                  <div className="flex items-center gap-2">
                     <span className="font-sci text-2xl text-yellow-400">03</span>
                     <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                  </div>
               </div>
            </div>
         </SciFiCard>
      </div>
     </>
  );

  return (
    <div className="relative w-screen h-screen bg-sci-base text-cyan-50 overflow-hidden selection:bg-cyan-500/30 font-sans">
      
      {/* --- GLOBAL OVERLAYS --- */}
      {/* CRT Scanlines */}
      <div className="absolute inset-0 z-50 pointer-events-none crt-overlay opacity-30"></div>
      {/* Vignette */}
      <div className="absolute inset-0 z-40 pointer-events-none vignette"></div>
      
      {/* --- DECORATIVE HUD ELEMENTS (EDGES) --- */}
      {/* Top Left Decoration */}
      <div className="absolute top-8 left-8 z-30 pointer-events-none hidden lg:block">
         <div className="flex flex-col gap-1">
            <div className="w-32 h-1 bg-cyan-500/20"></div>
            <div className="flex gap-1">
               <div className="w-2 h-1 bg-cyan-500/40"></div>
               <div className="w-20 h-1 bg-cyan-500/10"></div>
            </div>
         </div>
      </div>
      {/* Vertical Data Stream Right */}
      <div className="absolute top-1/2 right-4 -translate-y-1/2 z-30 flex flex-col gap-2 items-center pointer-events-none opacity-50 hidden lg:flex">
         <div className="text-[9px] font-mono text-cyan-500 rotate-90 origin-center whitespace-nowrap mb-8">SYSTEM DIAGNOSTICS</div>
         {[...Array(10)].map((_, i) => (
            <div key={i} className={`w-1 h-1 bg-cyan-500 ${i % 3 === 0 ? 'opacity-100' : 'opacity-20'}`}></div>
         ))}
         <div className="w-px h-32 bg-gradient-to-b from-cyan-500/0 via-cyan-500/50 to-cyan-500/0"></div>
      </div>

      {/* --- BACKGROUND SCENE (Full Screen) --- */}
      <div className="absolute inset-0 z-0">
         <CentralScene mode={activeMode} />
         <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-sci-base/90 via-transparent to-sci-base/90"></div>
      </div>

      {/* --- HEADER --- */}
      <header className="absolute top-0 left-0 w-full z-40 h-24 flex items-center justify-between px-10 pt-4 bg-gradient-to-b from-sci-base via-sci-base/90 to-transparent">
        <div className="flex items-center gap-5">
          <div className="relative">
             <div className="absolute inset-0 bg-cyan-500 blur-xl opacity-20"></div>
             <Hexagon className="text-neon-cyan animate-pulse-fast relative z-10" size={32} strokeWidth={1.5} />
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
             </div>
          </div>
          <div>
            <h1 className="font-sci text-2xl lg:text-3xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-cyan-500 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
              武汉交通职业学院<span className="text-cyan-600">智慧后勤及能源平台</span>
            </h1>
            <div className="flex items-center gap-3 mt-1">
               <div className="flex gap-0.5">
                  <div className="w-1 h-2 bg-cyan-500"></div>
                  <div className="w-1 h-2 bg-cyan-500/50"></div>
                  <div className="w-1 h-2 bg-cyan-500/20"></div>
               </div>
               <p className="font-data text-[10px] text-cyan-400 uppercase tracking-[0.3em]">智慧校园数字孪生系统 v4.5.2</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="hidden lg:flex items-center gap-1 bg-sci-panel/80 backdrop-blur-md p-1 rounded border border-white/10 shadow-lg transform translate-y-2 clip-tech-border">
          {[
            { id: TwinMode.OVERVIEW, label: '综合态势' },
            { id: TwinMode.ENERGY, label: '能源管理' },
            { id: TwinMode.SECURITY, label: '安防监控' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveMode(item.id)}
              className={`
                px-8 py-2 text-xs font-bold transition-all duration-300 tracking-widest relative overflow-hidden group
                ${activeMode === item.id 
                  ? 'text-black' 
                  : 'text-cyan-400/60 hover:text-cyan-200 hover:bg-white/5'}
              `}
            >
              {activeMode === item.id && (
                <div className="absolute inset-0 bg-cyan-400 clip-tech-border"></div>
              )}
              {/* Button Corners */}
              {activeMode !== item.id && (
                 <>
                   <div className="absolute top-0 left-0 w-1 h-1 border-t border-l border-cyan-500/30 group-hover:border-cyan-400"></div>
                   <div className="absolute bottom-0 right-0 w-1 h-1 border-b border-r border-cyan-500/30 group-hover:border-cyan-400"></div>
                 </>
              )}
              <span className="relative z-10">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-8">
           <div className="hidden xl:block">
              <div className="text-[9px] text-gray-500 uppercase tracking-widest mb-1 text-right">服务器负载</div>
              <div className="flex gap-1">
                 {[...Array(8)].map((_, i) => (
                    <div key={i} className={`w-1 h-3 ${i < 5 ? 'bg-green-500' : 'bg-gray-800'}`}></div>
                 ))}
              </div>
           </div>
           
           <div className="flex items-center gap-6 font-data pl-6 border-l border-white/10">
              <div className="text-right">
                <div className="text-[10px] text-cyan-400">网络延迟</div>
                <div className="text-white font-mono">12<span className="text-[9px] text-gray-500">ms</span></div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-cyan-400">本地时间</div>
                <div className="text-xl tracking-wider font-semibold font-mono text-white">
                  {time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute:'2-digit' })}
                  <span className="animate-pulse text-cyan-500">:</span>
                  <span className="text-sm text-gray-400">{time.getSeconds().toString().padStart(2, '0')}</span>
                </div>
              </div>
           </div>
        </div>
      </header>

      {/* --- SIDEBARS --- */}
      <aside className="absolute left-6 top-28 bottom-8 w-[24vw] min-w-[340px] z-30 flex flex-col gap-4 pointer-events-none transition-all duration-500">
        {activeMode === TwinMode.OVERVIEW && renderOverviewLeft()}
        {activeMode === TwinMode.ENERGY && renderEnergyLeft()}
        {activeMode === TwinMode.SECURITY && renderSecurityLeft()}
      </aside>

      <aside className="absolute right-6 top-28 bottom-8 w-[24vw] min-w-[340px] z-30 flex flex-col gap-4 pointer-events-none transition-all duration-500">
        {activeMode === TwinMode.OVERVIEW && renderOverviewRight()}
        {activeMode === TwinMode.ENERGY && renderEnergyRight()}
        {activeMode === TwinMode.SECURITY && renderSecurityRight()}
      </aside>

      {/* --- BOTTOM DECORATION --- */}
      <div className="absolute bottom-0 left-0 w-full h-12 z-30 pointer-events-none flex items-end justify-center pb-4">
         <div className="flex items-center gap-2 px-8 py-1 bg-black/60 border border-white/5 rounded-t-xl backdrop-blur">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] text-gray-400 font-mono tracking-widest">系统在线 // 运行正常</span>
         </div>
      </div>

    </div>
  );
};

export default App;