import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'aula-global',
  webDir: 'www',
  plugins: {
    Keyboard: {
      resize: 'native'
    }
  },
  server: {
    androidScheme: 'https'
  }
};

export default config;
