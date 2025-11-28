import React from 'react';
import { AudioDevice } from '../types';
import { LiquidVolumeSlider, DeviceSelector, BoostButton, PluginSelector } from './Controls';
import { Volume2, VolumeX, Mic, MicOff, Zap } from 'lucide-react';

interface SystemRowProps {
  label: string;
  type: 'output' | 'input' | 'sfx';
  volume: number;
  isMuted: boolean;
  deviceId: string;
  activePlugins: string[];
  boost: boolean;
  devices: AudioDevice[];
  onVolumeChange: (val: number) => void;
  onMuteToggle: () => void;
  onDeviceChange: (id: string) => void;
  onPluginsChange: (plugins: string[]) => void;
  onBoostToggle: () => void;
}

export const SystemRow: React.FC<SystemRowProps> = ({
  label, type, volume, isMuted, deviceId, activePlugins = [], boost, devices,
  onVolumeChange, onMuteToggle, onDeviceChange, onPluginsChange, onBoostToggle
}) => {
  
  const Icon = type === 'input' 
    ? (isMuted ? MicOff : Mic) 
    : (isMuted ? VolumeX : Volume2);

  const handlePluginToggle = (pluginId: string) => {
    const newPlugins = activePlugins.includes(pluginId) 
      ? activePlugins.filter(id => id !== pluginId)
      : [...activePlugins, pluginId];
    onPluginsChange(newPlugins);
  };

  return (
    <div className="flex items-center h-[88px] px-6 mx-2 my-1 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors shadow-lg backdrop-blur-md">
      
      {/* 1. Icon & Label & Mute (Flex Grow) */}
      <div className="flex items-center flex-grow min-w-0 pr-4">
        <button 
            onClick={onMuteToggle}
            className={`p-3 rounded-2xl bg-gradient-to-br shadow-lg shadow-black/20 mr-4 transition-transform active:scale-95 ${type === 'sfx' ? 'from-yellow-500/20 to-orange-500/20 text-yellow-400' : 'from-blue-500/20 to-purple-500/20 text-blue-300'} ${isMuted ? 'grayscale opacity-70' : ''}`}
        >
           {type === 'sfx' ? <Zap size={24} fill="currentColor"/> : <Icon size={24} />}
        </button>
        <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-100 tracking-wide">{label}</span>
            <span className="text-[10px] text-white/30 uppercase tracking-wider font-bold mt-0.5">{type.toUpperCase()}</span>
        </div>
      </div>

      {/* 2. Volume Slider (Fixed Width: w-32) */}
      <div className="w-32 flex justify-center shrink-0">
        <LiquidVolumeSlider 
            value={volume} 
            onChange={onVolumeChange} 
            disabled={isMuted}
            isMuted={isMuted}
        />
      </div>

      {/* 3. Boost (Fixed Width: w-10) */}
      <div className="w-10 flex justify-center shrink-0">
         <BoostButton active={boost} onToggle={onBoostToggle} />
      </div>

      {/* 4. Device Selector (Fixed Width: w-40) */}
      <div className="w-40 px-2 shrink-0">
        <DeviceSelector 
            devices={devices} 
            selectedId={deviceId} 
            onSelect={onDeviceChange} 
        />
      </div>

       {/* Separator */}
       <div className="w-[1px] h-10 bg-white/10 mx-2 shrink-0"></div>

       {/* 5. Plugin Selector (Fixed Width: w-8) */}
       <div className="w-8 flex justify-center shrink-0">
            <PluginSelector 
                activePlugins={activePlugins}
                onTogglePlugin={handlePluginToggle}
            />
       </div>
    </div>
  );
};