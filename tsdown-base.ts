import * as path from 'node:path'
import * as url from 'node:url'
import { defineConfig } from 'tsdown'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

export default defineConfig({
  entry: [
    './src/index.ts',
  ],
  external: ['@grom.js/mini-app'],
  outDir: './dist',
  unbundle: true,
  platform: 'browser',
  format: 'esm',
  target: false,
  exports: true,
  sourcemap: true,
  treeshake: false,
  clean: true,
  dts: {
    enabled: true,
    dtsInput: false,
    eager: true,
    tsconfig: path.join(__dirname, 'tsconfig.lib.json'),
    build: true,
    sourcemap: true,
  },
})
