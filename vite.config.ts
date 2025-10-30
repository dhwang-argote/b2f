import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const rootDir = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  plugins: [
    react(),
  ],
  
  resolve: {
    alias: {
      "@": path.resolve(rootDir, "."),
      "@shared": path.resolve(rootDir, "shared"),
      "@assets": path.resolve(rootDir, "assets"),
    },
  },
  root: path.resolve(rootDir),
  build: {
    outDir: path.resolve(rootDir, "dist/public"),
    emptyOutDir: true,
  },

});
