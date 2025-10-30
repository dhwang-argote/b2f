import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const projectRoot = process.cwd();

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      "@": path.resolve(projectRoot, "."),
      "@shared": path.resolve(projectRoot, "shared"),
      "@assets": path.resolve(projectRoot, "assets"),
    },
  },
  build: {
    outDir: path.resolve(projectRoot, "dist/public"),
    emptyOutDir: true,
  },
});
