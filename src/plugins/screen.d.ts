
declare module '@capacitor/core' {
  interface PluginRegistry {
    Screen: ScreenPlugin;
  }

  interface ScreenPlugin {
    setBrightness(options: { level: number }): Promise<void>;
    setGreyscale(options: { enabled: boolean }): Promise<void>;
    restoreSettings(): Promise<void>;
    getBrightness(): Promise<{ brightness: number }>;
  }
}
