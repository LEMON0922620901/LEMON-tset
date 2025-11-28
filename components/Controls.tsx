import React, { useRef, useState, useEffect } from 'react';
import { AudioDevice } from '../types';
import { ChevronDown, Sliders, Check, Search, Zap } from 'lucide-react';
import { VST_PLUGINS } from '../constants';

// --- Liquid Volume Slider (Horizontal Bar with Integrated Meter) ---

interface LiquidVolumeSliderProps {
  value: number;
  onChange: (val: number) => void;
  disabled?: boolean;
  isMuted?: boolean;
  width?: string;
}

export const LiquidVolumeSlider: React.FC<LiquidVolumeSliderProps> = ({ 
  value, 
  onChange, 
  disabled, 
  isMuted,
  width = "w-full"
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [meterLevel, setMeterLevel] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Audio simulation (Meter bounce)
  useEffect(() => {
    if (disabled || isMuted || value === 0) {
      setMeterLevel(0);
      return;
    }
    let frameId: number;
    const animate = () => {
      // Simulate signal bouncing slightly below the current set volume
      const noise = Math.random();
      const signal = value * (0.6 + noise * 0.4); 
      setMeterLevel(signal);
      frameId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frameId);
  }, [value, disabled, isMuted]);

  // Drag Logic
  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;
    setIsDragging(true);
    updateValue(e.clientX);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    updateValue(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const updateValue = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;
    onChange(percentage);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (disabled) return;
    e.stopPropagation();
    const delta = e.deltaY > 0 ? -5 : 5;
    const newValue = Math.min(100, Math.max(0, value + delta));
    onChange(newValue);
  };

  return (
    <div 
      className={`relative h-7 rounded-full bg-black/40 border border-white/5 overflow-hidden group cursor-ew-resize select-none shadow-inner ${width} ${disabled ? 'opacity-50 grayscale' : ''}`}
      onMouseDown={handleMouseDown}
      onWheel={handleWheel}
      ref={containerRef}
    >
      {/* 1. Meter Layer (Underneath/Behind) - Pale White */}
      <div 
        className="absolute top-0 left-0 h-full bg-white/20 blur-[2px] transition-all duration-75 ease-linear pointer-events-none"
        style={{ width: `${meterLevel}%` }}
      />

      {/* 2. Slider Fill Layer (Front) - Liquid Gradient */}
      <div 
        className={`absolute top-0 left-0 h-full bg-gradient-to-r from-white/10 via-white/40 to-white/60 backdrop-blur-[1px] border-r border-white/40 ${isDragging ? 'duration-0' : 'duration-300'} transition-[width] ease-out`}
        style={{ width: `${value}%`, opacity: isMuted ? 0.3 : 1 }}
      />

      {/* 3. Text Display */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
         <span className={`text-[10px] font-bold tracking-tight shadow-black drop-shadow-md ${isMuted ? 'text-red-300' : 'text-white'}`}>
            {isMuted ? 'MUTED' : `${Math.round(value)}%`}
         </span>
      </div>
    </div>
  );
};

// --- Device Selector ---

interface DeviceSelectorProps {
  devices: AudioDevice[];
  selectedId: string;
  onSelect: (id: string) => void;
  icon?: React.ReactNode;
}

export const DeviceSelector: React.FC<DeviceSelectorProps> = ({ devices, selectedId, onSelect, icon }) => {
  const selectedDevice = devices.find(d => d.id === selectedId) || devices[0];

  return (
    <div className="relative group w-full">
      <div className="flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/5 backdrop-blur-sm text-xs text-gray-200 px-3 py-1.5 rounded-full cursor-pointer transition-all shadow-sm group-hover:shadow-md group-hover:border-white/20 h-7">
        <div className="flex items-center space-x-2 truncate overflow-hidden">
          {icon && <span className="text-white/50">{icon}</span>}
          <span className="truncate font-medium">{selectedDevice?.name || '選擇裝置'}</span>
        </div>
        <ChevronDown size={12} className="text-white/30 shrink-0 ml-1 group-hover:text-white" />
      </div>
      
      <select 
        value={selectedId}
        onChange={(e) => onSelect(e.target.value)}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      >
        {devices.map(dev => (
          <option key={dev.id} value={dev.id} className="text-black bg-white">
            {dev.name}
          </option>
        ))}
      </select>
    </div>
  );
};

// --- Boost Button ---

interface BoostButtonProps {
  active: boolean;
  onToggle: () => void;
}

export const BoostButton: React.FC<BoostButtonProps> = ({ active, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={`relative w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 group
        ${active 
            ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.4)]' 
            : 'bg-white/5 text-gray-500 hover:bg-white/10 hover:text-white'}`}
      title="Volume Boost"
    >
      <Zap size={12} className={`transition-transform duration-300 ${active ? 'fill-black scale-110' : ''}`} />
    </button>
  );
};

// --- Plugin Selector ---

interface PluginSelectorProps {
  activePlugins: string[];
  onTogglePlugin: (pluginId: string) => void;
}

export const PluginSelector: React.FC<PluginSelectorProps> = ({ activePlugins, onTogglePlugin }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleOpen = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const menuWidth = 256;
      
      // Calculate optimized position to stay within viewport
      let left = rect.right - menuWidth;
      let top = rect.bottom + 8;

      if (left < 10) left = rect.left;
      if (top + 300 > window.innerHeight) top = rect.top - 310; 

      setPosition({ top, left });
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        menuRef.current && 
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      <button 
        ref={buttonRef}
        onClick={toggleOpen}
        className={`flex items-center justify-center w-7 h-7 rounded-full transition-all duration-300 cursor-pointer ${
            activePlugins.length > 0 
                ? 'bg-blue-500/20 text-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.3)]' 
                : 'text-gray-500 hover:text-white hover:bg-white/10'
        }`}
        title="VST Plugins"
      >
        <Sliders size={14} />
      </button>

      {isOpen && (
        <div 
          ref={menuRef}
          style={{ 
            position: 'fixed', 
            top: position.top, 
            left: position.left,
            zIndex: 99999 
          }}
          className="w-64 bg-[#1a1a1e] border border-white/20 rounded-xl shadow-[0_10px_50px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[300px] animate-in fade-in zoom-in-95 duration-150"
          onClick={(e) => e.stopPropagation()} 
        >
           {/* Header */}
           <div className="px-3 py-2 border-b border-white/10 bg-white/5 flex items-center justify-between shrink-0">
              <span className="text-xs font-bold text-white/80 uppercase tracking-wider">VST 插件庫</span>
              <span className="text-[10px] text-white/40">{VST_PLUGINS.length} Available</span>
           </div>

           {/* Search Placeholder */}
           <div className="px-3 py-2 border-b border-white/5 shrink-0">
              <div className="flex items-center bg-black/40 rounded-md px-2 py-1.5 border border-white/10">
                 <Search size={12} className="text-white/40 mr-2"/>
                 <input type="text" placeholder="Search VST..." className="bg-transparent w-full text-xs text-white/90 outline-none placeholder-white/30"/>
              </div>
           </div>

           {/* List */}
           <div className="overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-white/20 flex-1 overscroll-contain">
              {VST_PLUGINS.map(plugin => {
                const isActive = activePlugins.includes(plugin.id);
                return (
                  <div 
                    key={plugin.id}
                    onClick={() => onTogglePlugin(plugin.id)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors group mb-0.5 ${isActive ? 'bg-blue-600/30 border border-blue-500/30' : 'hover:bg-white/10 border border-transparent'}`}
                  >
                     <div className="flex flex-col">
                        <span className={`text-xs font-bold ${isActive ? 'text-blue-200' : 'text-gray-300 group-hover:text-white'}`}>
                            {plugin.name}
                        </span>
                        <span className="text-[10px] text-white/40">{plugin.type}</span>
                     </div>
                     {isActive && <Check size={14} className="text-blue-400 drop-shadow-[0_0_5px_rgba(59,130,246,0.8)]" />}
                  </div>
                );
              })}
           </div>
        </div>
      )}
    </>
  );
};