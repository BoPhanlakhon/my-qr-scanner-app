import { useState, useEffect } from "react";

const App = () => {
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);

  // ฟังก์ชันจัดการเมื่อมีการสแกน QR Code
  const handleQRCodeScan = (event: KeyboardEvent) => {
    const target = event.target as HTMLInputElement | null;
    if (target && target.value.trim()) {
      const scannedData = target.value.trim();
      setQrCodeData(scannedData);
      target.value = ""; // ล้างค่าใน input เพื่อพร้อมรับข้อมูลใหม่
    }
  };

  useEffect(() => {
    const inputField = document.getElementById("scanner-input") as HTMLInputElement;

    if (inputField) {
      // เพิ่ม Event Listener ให้กับ input field สำหรับการฟัง keydown event
      inputField.addEventListener("keydown", handleQRCodeScan);

      // เพิ่มการติดตามว่า input มีโฟกัสหรือไม่
      inputField.onfocus = () => console.log("Input focused");

      // เพิ่มการทำให้ input คงโฟกัสอยู่
      inputField.onblur = (e) => {
        // ใช้ TypeScript assertion ให้มั่นใจว่า e.target เป็น HTMLInputElement
        (e.target as HTMLInputElement).focus();
      };
    }

    // ลบ Event Listener เมื่อ Component ถูก Unmount
    return () => {
      if (inputField) {
        inputField.removeEventListener("keydown", handleQRCodeScan);
      }
    };
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <h1>QR Code Scanner</h1>

      {/* Hidden Input สำหรับรับข้อมูลจากเครื่องสแกน */}
      <input
        id="scanner-input"
        type="text"
        style={{
          position: "absolute",
          opacity: 0,
          pointerEvents: "none", // ป้องกันไม่ให้ผู้ใช้คลิกได้
        }}
        autoFocus
      />

      {qrCodeData ? (
        <div>
          <h2>QR Code Data:</h2>
          <p>{qrCodeData}</p>
        </div>
      ) : (
        <p>กรุณาสแกน QR Code...</p>
      )}
    </div>
  );
};

export default App;
