import React, { useState, useMemo } from 'react';
import { Settings, Pin, ChevronDown, ChevronRight, LayoutGrid, Plus } from 'lucide-react';
import { OUTPUT_DEVICES, INPUT_DEVICES, INITIAL_APPS } from './constants';
import { AppSource, SystemState } from './types';
import { SystemRow } from './components/SystemRow';
import { AppRow } from './components/AppRow';

const App: React.FC = () => {
  // System State
  const [systemState, setSystemState] = useState<SystemState>({
    outputVolume: 50,
    outputMuted: false,
    outputDeviceId: OUTPUT_DEVICES[2].id, // Default to MiniFuse
    outputPlugins: [],
    outputBoost: false,
    
    inputVolume: 92,
    inputMuted: true,
    inputDeviceId: INPUT_DEVICES[1].id, // Default to Shure
    inputPlugins: [],
    inputBoost: false,

    sfxVolume: 100,
    sfxMuted: false,
    sfxDeviceId: OUTPUT_DEVICES[1].id, // Mac Speakers
    sfxBoost: false,
  });

  // Apps State
  const [apps, setApps] = useState<AppSource[]>(INITIAL_APPS);
  const [showApps, setShowApps] = useState(true);
  const [showExcluded, setShowExcluded] = useState(false);

  // Derived Lists
  const outputDevices = useMemo(() => OUTPUT_DEVICES, []);
  const inputDevices = useMemo(() => INPUT_DEVICES, []);

  // Handlers
  const handleAppUpdate = (id: string, updates: Partial<AppSource>) => {
    setApps(prev => prev.map(app => app.id === id ? { ...app, ...updates } : app));
  };

  const handleSystemUpdate = (updates: Partial<SystemState>) => {
    setSystemState(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 sm:p-8">
      
      {/* Main Glass Window */}
      <div className="w-[920px] backdrop-blur-3xl bg-black/70 rounded-[32px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] border border-white/10 overflow-hidden text-gray-200 font-sans flex flex-col max-h-[92vh] ring-1 ring-white/5 relative">
        
        {/* Decorative Glow inside window */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-48 bg-indigo-500/10 blur-[120px] pointer-events-none rounded-full"></div>

        {/* Header */}
        <div className="h-16 flex items-center justify-between px-8 shrink-0 z-10 select-none bg-gradient-to-b from-white/5 to-transparent border-b border-white/5">
            <div className="flex space-x-3">
                <button className="text-white/40 hover:text-white transition-colors bg-white/5 p-2 rounded-full hover:bg-white/10"><Pin size={16} className="rotate-45" /></button>
                <button className="text-white/40 hover:text-white transition-colors bg-white/5 p-2 rounded-full hover:bg-white/10"><LayoutGrid size={16} /></button>
            </div>
            
            <div className="flex flex-col items-center">
                <div className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-blue-200 tracking-wider text-xl drop-shadow-md">SoundWave</div>
                <div className="text-[9px] text-blue-200/50 font-bold tracking-[0.3em] uppercase mt-0.5">Liquid Audio Engine</div>
            </div>
            
            <div className="flex items-center space-x-2 cursor-pointer text-white/60 hover:text-white transition-colors bg-white/5 px-4 py-1.5 rounded-full hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.05)] border border-white/5">
                <Settings size={14} className="animate-spin-slow" />
                <ChevronDown size={12} />
            </div>
        </div>

        {/* System Section */}
        <div className="flex flex-col shrink-0 px-2 pt-4 pb-2 z-10">
             <div className="flex items-center justify-between px-8 py-2 mb-1">
                <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">System Routing</span>
             </div>

             <SystemRow 
                label="系統總輸出" 
                type="output"
                volume={systemState.outputVolume}
                isMuted={systemState.outputMuted}
                deviceId={systemState.outputDeviceId}
                activePlugins={systemState.outputPlugins}
                boost={systemState.outputBoost}
                devices={outputDevices}
                onVolumeChange={(v) => handleSystemUpdate({ outputVolume: v })}
                onMuteToggle={() => handleSystemUpdate({ outputMuted: !systemState.outputMuted })}
                onDeviceChange={(id) => handleSystemUpdate({ outputDeviceId: id })}
                onPluginsChange={(p) => handleSystemUpdate({ outputPlugins: p })}
                onBoostToggle={() => handleSystemUpdate({ outputBoost: !systemState.outputBoost })}
             />
             
             <SystemRow 
                label="麥克風輸入" 
                type="input"
                volume={systemState.inputVolume}
                isMuted={systemState.inputMuted}
                deviceId={systemState.inputDeviceId}
                activePlugins={systemState.inputPlugins}
                boost={systemState.inputBoost}
                devices={inputDevices}
                onVolumeChange={(v) => handleSystemUpdate({ inputVolume: v })}
                onMuteToggle={() => handleSystemUpdate({ inputMuted: !systemState.inputMuted })}
                onDeviceChange={(id) => handleSystemUpdate({ inputDeviceId: id })}
                onPluginsChange={(p) => handleSystemUpdate({ inputPlugins: p })}
                onBoostToggle={() => handleSystemUpdate({ inputBoost: !systemState.inputBoost })}
             />

             <SystemRow 
                label="系統音效" 
                type="sfx"
                volume={systemState.sfxVolume}
                isMuted={systemState.sfxMuted}
                deviceId={systemState.sfxDeviceId}
                activePlugins={[]}
                boost={systemState.sfxBoost}
                devices={outputDevices}
                onVolumeChange={(v) => handleSystemUpdate({ sfxVolume: v })}
                onMuteToggle={() => handleSystemUpdate({ sfxMuted: !systemState.sfxMuted })}
                onDeviceChange={(id) => handleSystemUpdate({ sfxDeviceId: id })}
                onPluginsChange={() => {}} 
                onBoostToggle={() => handleSystemUpdate({ sfxBoost: !systemState.sfxBoost })}
             />
        </div>

        {/* Applications Section */}
        <div className="flex flex-col flex-1 min-h-0 relative z-10 bg-black/20 backdrop-blur-md mx-4 mb-6 rounded-[24px] border border-white/5 overflow-hidden shadow-inner">
             
             {/* Section Header */}
             <div 
                className="flex items-center justify-between px-6 py-4 bg-white/[0.02] border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors group"
                onClick={() => setShowApps(!showApps)}
             >
                <div className="flex items-center space-x-3 text-white/80 group-hover:text-white transition-colors">
                    <div className="bg-white/5 rounded-full p-1.5 text-white/50 group-hover:text-white transition-colors">
                         {showApps ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
                    </div>
                    <span className="text-xs font-bold tracking-widest uppercase text-white/40 group-hover:text-white/60">Applications</span>
                </div>
                
                {/* Column Headers for Alignment */}
                {showApps && (
                  <div className="flex items-center text-[9px] font-bold text-white/20 uppercase tracking-wider mr-6">
                      <div className="w-32 text-center">Vol</div>
                      <div className="w-10 text-center">Boost</div>
                      <div className="w-40 pl-2">Device</div>
                      <div className="w-8 text-center ml-2">FX</div>
                  </div>
                )}
             </div>

             {/* App List */}
             {showApps && (
                <div className="overflow-y-auto overflow-x-hidden flex-1 p-2 space-y-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    {apps.map(app => (
                        <AppRow 
                            key={app.id} 
                            app={app} 
                            devices={outputDevices} 
                            onUpdate={handleAppUpdate}
                        />
                    ))}
                    
                    {/* Add Application Button */}
                    <button className="w-full h-12 mt-2 rounded-xl border border-dashed border-white/10 hover:border-white/30 hover:bg-white/5 flex items-center justify-center space-x-2 text-white/40 hover:text-white transition-all group">
                        <Plus size={16} className="group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-medium tracking-wide">加入應用程式 (Add Application)</span>
                    </button>
                </div>
             )}

             {/* Excluded Section Toggle */}
             <div 
                className="flex items-center justify-between px-6 py-3 bg-white/[0.02] border-t border-white/5 cursor-pointer hover:bg-white/5 transition-colors group mt-auto"
                onClick={() => setShowExcluded(!showExcluded)}
             >
                 <div className="flex items-center space-x-3">
                    <div className="bg-white/5 rounded-full p-1.5 text-white/50 group-hover:text-white">
                        {showExcluded ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
                    </div>
                    <span className="text-xs font-bold text-white/40 tracking-widest uppercase group-hover:text-white/60">Excluded</span>
                 </div>
             </div>
             
             {showExcluded && (
                 <div className="bg-black/40 p-6 text-xs text-gray-400">
                     <p className="mb-4 text-white/30">Applications bypass audio processing engine.</p>
                     <div className="grid grid-cols-2 gap-3 opacity-60">
                         <div className="flex items-center space-x-2 bg-white/5 p-3 rounded-xl border border-white/5">
                            <Settings size={14} /> <span>Soundly</span>
                         </div>
                         <div className="flex items-center space-x-2 bg-white/5 p-3 rounded-xl border border-white/5">
                            <Settings size={14} /> <span>Logic Pro</span>
                         </div>
                     </div>
                 </div>
             )}
        </div>

      </div>
    </div>
  );
};

export default App;