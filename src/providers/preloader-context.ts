import { createContext } from 'react';

export interface PreloaderValue {
  /** 0–1, monotonically increasing. */
  progress: number;
  /**
   * True once the curtain has started to leave. Every measurement-heavy
   * animation waits for this: by then the webfonts have loaded and the
   * images have reserved their space, so SplitText measures final line
   * widths and ScrollTrigger measures a layout that has stopped moving.
   */
  isReady: boolean;
}

export const PreloaderContext = createContext<PreloaderValue>({
  progress: 0,
  isReady: false,
});
