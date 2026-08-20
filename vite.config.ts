import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        // 把第三方依賴拆成獨立 chunk：改自己的程式碼時，這些不變的
        // vendor chunk 仍能命中瀏覽器快取，不必重新下載。
        // SSR build 把 react 等視為 external，不能用 manualChunks，故僅 client 套用。
        manualChunks: isSsrBuild
          ? undefined
          : {
              "react-vendor": ["react", "react-dom", "react-router-dom"],
              i18n: [
                "i18next",
                "react-i18next",
                "i18next-browser-languagedetector",
              ],
              // 只有 /surf 會動態 import，這裡分組是為了固定 chunk 檔名，
              // 讓它在改動其他程式碼時仍能命中瀏覽器快取
              gsap: ["gsap", "gsap/ScrollTrigger", "lenis"],
            },
      },
    },
  },
}));
