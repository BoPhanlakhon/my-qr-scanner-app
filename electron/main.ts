import { app, BrowserWindow } from "electron";
import path from "path";

// ประกาศตัวแปรสำหรับ BrowserWindow
let win: BrowserWindow | null;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // โหลด preload.js (ต้องคอมไพล์จาก preload.ts)
      preload: path.join(__dirname, "../dist-electron/preload.js"), // ใช้ไฟล์ที่คอมไพล์แล้ว
      nodeIntegration: false, // หลีกเลี่ยงการเปิดใช้งาน Node.js ใน Renderer process
      contextIsolation: true, // ป้องกันการเข้าถึง global variables ใน Renderer process
    },
  });

  if (process.env.NODE_ENV === "development") {
    // ถ้าในโหมด development, โหลดจาก Vite Dev Server
    win.loadURL("http://localhost:3000");
  } else {
    // ถ้าในโหมด production, โหลดไฟล์ HTML ที่ build มาแล้ว
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  }

  // เปิด DevTools ในโหมด development
  win.webContents.openDevTools();

  // เมื่อปิดหน้าต่าง, จะทำให้ win เป็น null
  win.on("closed", () => {
    win = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  // ใน macOS, เมื่อคลิกที่ไอคอนใน Dock และไม่มีหน้าต่างเปิด, จะเปิดหน้าต่างใหม่
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// เมื่อปิดหน้าต่างทั้งหมด, จะปิดแอป (ยกเว้นใน macOS)
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
