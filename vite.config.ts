import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

export default defineConfig({
  root: 'webview',             
  base: './',              
  build: {
    outDir: '../dist/webview',
    emptyOutDir: true,
    modulePreload: false,
    sourcemap: true,
  },
  resolve: {
    alias: [
      { find: /^#app\/shared\//, replacement: fileURLToPath(new URL('./src/shared/', import.meta.url)) },
    ],
  },
});