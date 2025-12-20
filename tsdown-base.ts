import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: [
    './src/index.ts',
  ],
  outDir: './dist',
  platform: 'browser',
  format: 'esm',
  target: false,
  exports: true,
  sourcemap: true,
  treeshake: false,
  clean: true,
  dts: {
    build: true,
    sourcemap: true,
  },
})
