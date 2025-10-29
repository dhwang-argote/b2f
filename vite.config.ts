import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";


export default defineConfig({
  plugins: [
    react(),


  ],
  
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "."),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "assets"),
    },
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        },
      },
    },
  },

});
