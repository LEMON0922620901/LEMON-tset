export interface AudioDevice {
  id: string;
  name: string;
  type: 'output' | 'input';
}

export interface AppSource {
  id: string;
  name: string;
  iconType: 'browser' | 'music' | 'video' | 'chat' | 'system' | 'pro' | 'phone';
  volume: number; // 0-100
  isMuted: boolean;
  isFavorite: boolean;
  outputDeviceId: string;
  boost: boolean;
  plugins: string[]; // List of active VST plugin IDs
}

export interface SystemState {
  outputVolume: number;
  outputMuted: boolean;
  outputDeviceId: string;
  outputPlugins: string[];
  outputBoost: boolean;
  
  inputVolume: number;
  inputMuted: boolean;
  inputDeviceId: string;
  inputPlugins: string[];
  inputBoost: boolean;
  
  sfxVolume: number;
  sfxMuted: boolean;
  sfxDeviceId: string;
  sfxBoost: boolean;
}