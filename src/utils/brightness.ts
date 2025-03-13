// This utility file interfaces with native iOS functionality through Capacitor
// For screen brightness and color filter functions

// We'll use Capacitor's plugin pattern for native iOS integration
import { registerPlugin } from '@capacitor/core';

// Define a plugin interface for our native brightness control
interface ScreenPlugin {
  setBrightness(options: { level: number }): Promise<void>;
  setGreyscale(options: { enabled: boolean }): Promise<void>;
  restoreSettings(): Promise<void>;
}

// Register our custom plugin (in a real app, this would be implemented in Swift)
const Screen = registerPlugin<ScreenPlugin>('Screen');

// Store original brightness to restore later
let originalBrightness = 100;

export const setScreenBrightness = async (level: number) => {
  console.log(`Setting screen brightness to ${level}%`);
  
  try {
    // In a real iOS app with Capacitor, this would call the native Swift code
    // For now in development, we'll simulate with CSS
    document.documentElement.style.setProperty('--dimmed-opacity', `${level / 100}`);
    
    // In actual implementation with Capacitor, we would call:
    // await Screen.setBrightness({ level });
  } catch (error) {
    console.error('Error setting brightness:', error);
  }
};

export const setGreyscale = async (enabled: boolean) => {
  console.log(`Setting greyscale filter: ${enabled}`);
  
  try {
    // In development, simulate with CSS
    const body = document.body;
    if (enabled) {
      body.classList.add('greyscale');
    } else {
      body.classList.remove('greyscale');
    }
    
    // In actual implementation with Capacitor, we would call:
    // await Screen.setGreyscale({ enabled });
  } catch (error) {
    console.error('Error setting greyscale:', error);
  }
};

export const saveOriginalSettings = async () => {
  // In a real iOS app, we would save the current brightness here
  // For now, just log it
  console.log('Saving original settings');
  
  // In actual implementation, we would save the real device brightness:
  // const { brightness } = await Screen.getBrightness();
  // originalBrightness = brightness;
};

export const restoreOriginalSettings = async () => {
  console.log('Restoring original settings');
  
  // Remove CSS simulation
  document.documentElement.style.removeProperty('--dimmed-opacity');
  document.body.classList.remove('greyscale');
  
  // In actual implementation with Capacitor, we would call:
  // await Screen.restoreSettings();
};

// Keep existing utility functions
export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const formatSecondsToMinutes = (seconds: number): string => {
  return `${Math.floor(seconds / 60)} min`;
};
