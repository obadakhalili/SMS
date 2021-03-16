import { defineConfig } from "vite"
import reactRefresh from "@vitejs/plugin-react-refresh"

export default defineConfig({
  plugins: [reactRefresh()],
  server: {
    port: 8080,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8081/api",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
})
