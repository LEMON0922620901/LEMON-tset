import React from 'react';
import { AppSource, AudioDevice } from '../types';
import { LiquidVolumeSlider, DeviceSelector, BoostButton, PluginSelector } from './Controls';
import { getIcon } from '../constants';
import { Star, Volume2, VolumeX } from 'lucide-react';

interface AppRowProps {
  app: AppSource;
  devices: AudioDevice[];
  onUpdate: (id: string, updates: Partial<AppSource>) => void;
}

export const AppRow: React.FC<AppRowProps> = ({ app, devices, onUpdate }) => {
  
  const handlePluginToggle = (pluginId: string) => {
      const currentPlugins = app.plugins || [];
      const newPlugins = currentPlugins.includes(pluginId) 
        ? currentPlugins.filter(id => id !== pluginId)
        : [...currentPlugins, pluginId];
      onUpdate(app.id, { plugins: newPlugins });
  };

  return (
    <div className="flex items-center h-[72px] px-4 mx-2 my-1 rounded-2xl hover:bg-white/5 transition-colors select-none group border border-transparent hover:border-white/5">
      {/* 1. Favorite & Icon & Name (Flex Grow) */}
      <div className="flex items-center flex-grow min-w-0 pr-4">
          {/* Favorite */}
          <button 
            onClick={() => onUpdate(app.id, { isFavorite: !app.isFavorite })}
            className={`mr-3 w-6 flex justify-center focus:outline-none transition-colors duration-300 ${app.isFavorite ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]' : 'text-gray-600 hover:text-gray-400'}`}
          >
            <Star size={16} fill={app.isFavorite ? "currentColor" : "none"} />
          </button>

          {/* Icon */}
          <div className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl shadow-inner backdrop-blur-sm border border-white/5 mr-3 shrink-0">
              {getIcon(app.iconType, "w-5 h-5")}
          </div>

          {/* Name & Mute */}
          <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium text-gray-200 truncate tracking-wide">{app.name}</span>
              <button 
                onClick={() => onUpdate(app.id, { isMuted: !app.isMuted })}
                className={`flex items-center text-[10px] mt-0.5 focus:outline-none transition-all ${app.isMuted ? 'text-red-400' : 'text-gray-500 hover:text-gray-300'}`}
              >
                {app.isMuted ? <><VolumeX size={10} className="mr-1"/> Muted</> : <><Volume2 size={10} className="mr-1"/> Active</>}
              </button>
          </div>
      </div>

      {/* 2. Volume Slider (Fixed Width: w-32 = 128px) */}
      <div className="w-32 flex justify-center shrink-0">
        <LiquidVolumeSlider 
            value={app.volume} 
            onChange={(val) => onUpdate(app.id, { volume: val })} 
            disabled={app.isMuted}
            isMuted={app.isMuted}
        />
      </div>

      {/* 3. Boost (Fixed Width: w-10) */}
      <div className="w-10 flex justify-center shrink-0">
         <BoostButton active={app.boost} onToggle={() => onUpdate(app.id, { boost: !app.boost })} />
      </div>

      {/* 4. Device Selector (Fixed Width: w-40 = 160px) */}
      <div className="w-40 px-2 shrink-0">
        <DeviceSelector 
          devices={devices} 
          selectedId={app.outputDeviceId} 
          onSelect={(id) => onUpdate(app.id, { outputDeviceId: id })} 
        />
      </div>

       {/* Separator */}
       <div className="w-[1px] h-6 bg-white/10 mx-2 shrink-0"></div>

      {/* 5. Plugin (Fixed Width: w-8) */}
      <div className="w-8 flex justify-center shrink-0">
        <PluginSelector 
            activePlugins={app.plugins || []}
            onTogglePlugin={handlePluginToggle}
        />
      </div>
    </div>
  );
};