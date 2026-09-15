import { useContext } from 'react';
import { MotionContext, type MotionValue } from '@/providers/motion-context';

/** Reads the current performance tier. Throws outside MotionProvider. */
export function useMotion(): MotionValue {
  const value = useContext(MotionContext);
  if (!value) throw new Error('useMotion must be used inside <MotionProvider>');
  return value;
}
