
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.82a07da3f0f8439c8335cd87a446c373',
  appName: 'mindful-dim-sessions',
  webDir: 'dist',
  server: {
    url: 'https://82a07da3-f0f8-439c-8335-cd87a446c373.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    // This is where we would register our custom Screen plugin
    // which interfaces with Swift code for native brightness and color filter control
    Screen: {
      // Any plugin configuration would go here
    }
  }
};

export default config;
