import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Builds the extension into dist/. Files in public/ (manifest.json) are copied as-is.
export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: { popup: "popup.html" },
    },
  },
});
