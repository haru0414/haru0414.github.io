import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        // 把第三方依賴拆成獨立 chunk：改自己的程式碼時，這些不變的
        // vendor chunk 仍能命中瀏覽器快取，不必重新下載。
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          i18n: [
            "i18next",
            "react-i18next",
            "i18next-browser-languagedetector",
          ],
        },
      },
    },
  },
});
