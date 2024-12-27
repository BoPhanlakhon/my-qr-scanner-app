import { defineConfig } from "vite";
import path from "node:path";
import electron from "vite-plugin-electron/simple";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    electron({
      main: {
        entry: "electron/main.ts", // ชี้ไปยัง main.ts ของ Electron
        vite: {
          build: {
            outDir: "dist-electron", // เก็บผลลัพธ์จากการ build ของ Vite
          },
        },
      },
      preload: {
        input: path.join(__dirname, "electron/preload.ts"),
      },
      renderer: process.env.NODE_ENV === "development" ? undefined : {},
    }),
  ],
  server: {
    port: 3000, // พอร์ตที่ Vite จะรัน
    open: true, // เปิดเบราว์เซอร์เมื่อรัน
  },
});
