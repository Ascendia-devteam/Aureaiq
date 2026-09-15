import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        // GSAP and its plugins are the heaviest dependency and almost never
        // change — keeping them in their own chunk means a copy edit does not
        // invalidate the animation bundle in the visitor's cache.
        manualChunks: {
          gsap: ['gsap', 'gsap/ScrollTrigger', 'gsap/ScrollSmoother', 'gsap/SplitText'],
        },
      },
    },
  },
});
