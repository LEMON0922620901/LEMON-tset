import React from 'react';
import { 
  Globe, 
  Music, 
  Video, 
  MessageCircle, 
  Cpu, 
  Smartphone, 
  Mic, 
  Monitor, 
  Headphones, 
  Speaker,
  Clapperboard,
  Sliders
} from 'lucide-react';
import { AppSource, AudioDevice } from './types';

export const OUTPUT_DEVICES: AudioDevice[] = [
  { id: 'dev_default', name: '系統預設', type: 'output' },
  { id: 'dev_speakers', name: 'MacBook Pro 揚聲器', type: 'output' },
  { id: 'dev_external', name: 'MiniFuse 2', type: 'output' },
  { id: 'dev_bluetooth', name: 'EDIFIER QD35', type: 'output' },
  { id: 'dev_hdmi', name: 'LG HDR 4K', type: 'output' },
];

export const INPUT_DEVICES: AudioDevice[] = [
  { id: 'in_mac', name: 'MacBook Pro 麥克風', type: 'input' },
  { id: 'in_shure', name: 'Shure MV7', type: 'input' },
  { id: 'in_webcam', name: 'Logitech StreamCam', type: 'input' },
];

export const VST_PLUGINS = [
  { id: 'vst_eq', name: 'FabFilter Pro-Q 3', type: 'EQ' },
  { id: 'vst_comp', name: 'Universal Audio 1176', type: 'Dynamics' },
  { id: 'vst_verb', name: 'Valhalla VintageVerb', type: 'Reverb' },
  { id: 'vst_sat', name: 'Soundtoys Decapitator', type: 'Saturation' },
  { id: 'vst_limiter', name: 'Waves L2 Ultramaximizer', type: 'Limiter' },
  { id: 'vst_autotune', name: 'Antares Auto-Tune', type: 'Pitch' },
  { id: 'vst_ozone', name: 'iZotope Ozone 11', type: 'Mastering' },
];

export const INITIAL_APPS: AppSource[] = [
  { id: 'app_brave', name: 'Brave Browser', iconType: 'browser', volume: 100, isMuted: false, isFavorite: true, outputDeviceId: 'dev_default', boost: false, plugins: [] },
  { id: 'app_safari', name: 'Safari', iconType: 'browser', volume: 100, isMuted: false, isFavorite: true, outputDeviceId: 'dev_default', boost: false, plugins: [] },
  { id: 'app_premiere', name: 'Adobe Premiere Pro', iconType: 'pro', volume: 60, isMuted: false, isFavorite: true, outputDeviceId: 'dev_default', boost: false, plugins: [] },
  { id: 'app_davinci', name: 'DaVinci Resolve', iconType: 'pro', volume: 100, isMuted: false, isFavorite: true, outputDeviceId: 'dev_default', boost: false, plugins: [] },
  { id: 'app_music', name: 'Music', iconType: 'music', volume: 25, isMuted: false, isFavorite: true, outputDeviceId: 'dev_bluetooth', boost: true, plugins: ['vst_eq'] },
  { id: 'app_spotify', name: 'Spotify', iconType: 'music', volume: 68, isMuted: false, isFavorite: true, outputDeviceId: 'dev_default', boost: false, plugins: [] },
  { id: 'app_qt', name: 'QuickTime Player', iconType: 'video', volume: 100, isMuted: false, isFavorite: true, outputDeviceId: 'dev_default', boost: false, plugins: [] },
  { id: 'app_iina', name: 'IINA', iconType: 'video', volume: 100, isMuted: false, isFavorite: true, outputDeviceId: 'dev_default', boost: false, plugins: [] },
  { id: 'app_protools', name: 'Pro Tools', iconType: 'pro', volume: 100, isMuted: false, isFavorite: true, outputDeviceId: 'dev_default', boost: false, plugins: [] },
  { id: 'app_discord', name: 'Discord', iconType: 'chat', volume: 100, isMuted: false, isFavorite: true, outputDeviceId: 'dev_default', boost: false, plugins: [] },
  { id: 'app_line', name: 'LINE', iconType: 'chat', volume: 100, isMuted: false, isFavorite: true, outputDeviceId: 'dev_default', boost: false, plugins: [] },
  { id: 'app_phone', name: 'iPhone 鏡像輸出', iconType: 'phone', volume: 100, isMuted: false, isFavorite: true, outputDeviceId: 'dev_default', boost: false, plugins: [] },
];

export const getIcon = (type: string, className: string = "w-5 h-5") => {
  switch (type) {
    case 'browser': return <Globe className={`text-orange-500 ${className}`} />;
    case 'music': return <Music className={`text-pink-500 ${className}`} />;
    case 'video': return <Video className={`text-blue-400 ${className}`} />;
    case 'chat': return <MessageCircle className={`text-green-500 ${className}`} />;
    case 'pro': return <Clapperboard className={`text-purple-500 ${className}`} />;
    case 'phone': return <Smartphone className={`text-gray-300 ${className}`} />;
    case 'system': return <Cpu className={`text-gray-400 ${className}`} />;
    default: return <Cpu className={`text-gray-400 ${className}`} />;
  }
};