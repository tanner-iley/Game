import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.gacha',
  appName: 'Gacha Game',
  webDir: 'dist',
  server: {
    androidScheme: 'http',
  },
};

export default config;