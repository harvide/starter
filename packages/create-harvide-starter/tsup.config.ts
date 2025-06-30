import { defineConfig } from 'tsup';

export default defineConfig({
  clean: true,
  dts: true,
  entry: ['src/index.ts'],
  format: ['esm'],
  minify: true,
  sourcemap: true,
  target: 'esnext',
  outDir: 'dist',
  // onSuccess: "node dist/index.js",
});
