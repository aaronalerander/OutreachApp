import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Builds the extension into dist/. Files in public/ (manifest.json) are copied as-is.
export default defineConfig({
  plugins: [react()],
  base: "./",
  /**
   * We want to use direct imports rather than relative imports.
   * This lets imports using "@/..." instead of src/, thus making it easier to import from other files.
   */
  resolve: { tsconfigPaths: true },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: { popup: "popup.html" },
    },
  },
});
