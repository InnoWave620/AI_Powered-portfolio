import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/AI_Powered-portfolio",
  server: {
    host: true,
    allowedHosts: ['0438-41-116-75-31.ngrok-free.app'],
    port: 5173, // Default Vite port
    proxy: {
      "/api": {
        target: "http://localhost:5000", // Your Express backend URL
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
