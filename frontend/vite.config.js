import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  build: {
    chunkSizeWarningLimit: 1000,

    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (
              id.includes("react") ||
              id.includes("react-dom") ||
              id.includes("react-router-dom")
            ) {
              return "react-vendor";
            }

            if (id.includes("lucide-react")) {
              return "icons";
            }

            if (id.includes("@react-oauth/google")) {
              return "google-oauth";
            }

            if (id.includes("react-hot-toast")) {
              return "toast";
            }

            return "vendor";
          }
        },
      },
    },
  },
});