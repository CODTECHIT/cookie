import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    cssCodeSplit: true,
    chunkSizeWarningLimit: 400,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;

          if (
            id.includes("/node_modules/react/") ||
            id.includes("/node_modules/react-dom/") ||
            id.includes("/node_modules/scheduler/")
          ) {
            return "react-core";
          }

          if (
            id.includes("/node_modules/react-router") ||
            id.includes("/node_modules/react-helmet-async")
          ) {
            return "router-seo";
          }

          if (id.includes("/node_modules/recharts/")) {
            return "charts";
          }

          if (id.includes("/node_modules/lucide-react/")) {
            return "icons";
          }

          if (id.includes("/node_modules/framer-motion/")) {
            return "motion";
          }

          if (id.includes("/node_modules/axios/")) {
            return "http";
          }

          return "vendor";
        },
      },
    },
  },
  server: {
    headers: {
      "Permissions-Policy":
        "accelerometer=*, camera=(), geolocation=(), gyroscope=*, magnetometer=(), microphone=(), payment=*, usb=()",
    },
  },
});
