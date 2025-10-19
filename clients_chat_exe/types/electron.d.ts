// Electron type definitions for VibeChat Desktop
declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        send: (channel: string, data?: any) => void;
        on: (channel: string, callback: (event: any, data: any) => void) => void;
        removeAllListeners: (channel: string) => void;
        invoke: (channel: string, data?: any) => Promise<any>;
      };
      platform: string;
      versions: {
        node: string;
        chrome: string;
        electron: string;
      };
    };
  }
}

export {};
