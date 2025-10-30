const { defineConfig } = require("vite");
const react = require("@vitejs/plugin-react");
const path = require("path");

const projectRoot = process.cwd();

module.exports = defineConfig({
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
