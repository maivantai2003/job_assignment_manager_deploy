import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // optimizeDeps: {
  //   include: ["gantt-task-react"],
  // },
  build: {
    outDir: 'build',  // Chỉ định thư mục đầu ra là 'build' thay vì 'dist'
  },
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:8800",
        changeOrigin: true,
      },
    },
  },
});
