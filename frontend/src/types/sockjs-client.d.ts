declare module 'sockjs-client' {
  interface SockJSOptions {
    transports?: string[];
    timeout?: number;
  }

  class SockJS {
    constructor(url: string, options?: SockJSOptions);
    send(data: string): void;
    close(): void;
    onopen: ((event: Event) => void) | null;
    onmessage: ((event: MessageEvent) => void) | null;
    onclose: ((event: CloseEvent) => void) | null;
    onerror: ((event: Event) => void) | null;
    readyState: number;
  }

  export = SockJS;
}
