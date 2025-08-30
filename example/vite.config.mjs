import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      papicons: path.resolve(process.cwd(), '../dist/index.mjs'),
    },
  },
})


