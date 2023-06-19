import { defineConfig } from 'vite'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    electron([
      {
        // Main-Process entry file of the Electron App.
        entry: 'electron/main.ts',
      },
      {
        entry: 'electron/preload.ts',
        onstart(options) {
          // Notify the Renderer-Process to reload the page when the Preload-Scripts build is complete, 
          // instead of restarting the entire Electron App.
          options.reload()
        },
      },
    ]),
    renderer(),
  ],
  build: {
    rollupOptions: {
      plugins: [
        {
          name: 'vite-plugin-css',
          generateBundle(_, bundle) {
            for (const chunk of Object.values(bundle)) {
              if (chunk.type === 'chunk') {
                chunk.code = chunk.code.replace(
                  /\.css(?=["'])/g,
                  '.css.js'
                );
              }
            }
          }
        }
      ]
    }
  }
})
