import { useContext } from 'react';
import { PreloaderContext, type PreloaderValue } from '@/providers/preloader-context';

/** Reads loading progress and the hand-off flag. */
export function usePreloader(): PreloaderValue {
  return useContext(PreloaderContext);
}
