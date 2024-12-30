import { useState, useEffect } from "react";

const App = () => {
  const [qrCodeData, setQrCodeData] = useState<string>("");

  // ฟังก์ชันจัดการเมื่อมีการสแกน QR Code
  const handleQRCodeScan = (event: KeyboardEvent) => {
    const target = event.target as HTMLInputElement | null;
    if (target && target.value.trim()) {
      const newValue = target.value.trim();
      console.log("Scanned data:", newValue); // Log ข้อมูลที่สแกนเข้ามา
      // เพิ่มข้อมูลที่สแกนเข้ามาไปใน qrCodeData ที่สะสมข้อมูลอยู่แล้ว
      setQrCodeData((prevData) => {
        console.log("Previous data:", prevData); // Log ข้อมูลก่อนหน้านี้
        return prevData + newValue;
      });
      target.value = ""; // ล้างค่าภายใน input หลังจากสแกนแล้ว
      console.log("Input field cleared"); // Log หลังจากล้างข้อมูลใน input
    }
  };

  useEffect(() => {
    const inputField = document.getElementById("scanner-input") as HTMLInputElement;

    if (inputField) {
      // เพิ่ม Event Listener ให้กับ input field สำหรับการฟัง keydown event
      inputField.addEventListener("keydown", handleQRCodeScan);
      console.log("Event listener added to input field");

      // เพิ่มการติดตามว่า input มีโฟกัสหรือไม่
      inputField.onfocus = () => {
        console.log("Input focused");
      };

      // เพิ่มการทำให้ input คงโฟกัสอยู่
      inputField.onblur = (e) => {
        console.log("Input blurred, refocusing");
        // ใช้ TypeScript assertion ให้มั่นใจว่า e.target เป็น HTMLInputElement
        (e.target as HTMLInputElement).focus();
      };
    }

    // ลบ Event Listener เมื่อ Component ถูก Unmount
    return () => {
      if (inputField) {
        inputField.removeEventListener("keydown", handleQRCodeScan);
        console.log("Event listener removed from input field");
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
          <pre>{qrCodeData}</pre>
        </div>
      ) : (
        <p>กรุณาสแกน QR Code...</p>
      )}
    </div>
  );
};

export default App;
