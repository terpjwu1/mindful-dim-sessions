
import { registerPlugin } from '@capacitor/core';

export interface ScreenPlugin {
  setBrightness(options: { level: number }): Promise<void>;
  getBrightness(): Promise<{ level: number }>;
  setGreyscale(options: { enabled: boolean }): Promise<void>;
  restoreSettings(): Promise<void>;
}

const Screen = registerPlugin<ScreenPlugin>('Screen');

export default Screen;
