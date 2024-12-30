import { useState, useEffect } from "react";

// สร้าง interface สำหรับข้อมูล QR Code
interface QRCodeData {
  user_id: string;
  ticket_code: string;
  expired_time_stamp: string;
  secret_text: string;
  [key: string]: string; // ฟิลด์เพิ่มเติม
}

const App = () => {
  const [qrCodeData, setQrCodeData] = useState<QRCodeData | null>(null);
  const [loading, setLoading] = useState(false);
  const [scanned, setScanned] = useState(false);

  // ใช้ Enter เป็นตัวบอกจบข้อมูล
  const handleQRCodeScan = (event: KeyboardEvent) => {
    if (scanned) return; // ป้องกันการสแกนซ้ำ

    const target = event.target as HTMLInputElement | null;
    if (target && event.key === "Enter" && target.value.trim()) {
      console.log("target.value:", target.value);
      const newValue = target.value.trim();
      console.log("target.value.trim():", target.value.trim());
      try {
        const parsedData: QRCodeData = JSON.parse(newValue);
        console.log("parsedData:", parsedData);
        setQrCodeData(parsedData);
        setScanned(true);
        target.value = ""; // ล้างค่าหลังสแกน
      } catch (error) {
        console.error("Error parsing QR Code data:", error);
      }
    }
  };

  const handlePrint = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setQrCodeData(null);
      setScanned(false);
    }, 2000);
  };

  useEffect(() => {
    const inputField = document.getElementById("scanner-input") as HTMLInputElement;

    if (inputField) {
      inputField.addEventListener("keydown", handleQRCodeScan);

      const focusInput = () => inputField.focus();
      inputField.onfocus = focusInput;
      inputField.onblur = focusInput;

      if (!scanned) inputField.focus();
    }

    return () => {
      if (inputField) inputField.removeEventListener("keydown", handleQRCodeScan);
    };
  }, [scanned]);

  return (
    <div style={{ textAlign: "center" }}>
      <h1>QR Code Scanner</h1>
      <input id="scanner-input" type="text" style={{ position: "absolute", opacity: 0, pointerEvents: "none" }} autoFocus />
      {qrCodeData ? (
        <div>
          <h2>QR Code Data:</h2>
          <p>User ID: {qrCodeData.user_id || "ไม่พบข้อมูล user_id"}</p>
          <p>Ticket Code: {qrCodeData.ticket_code || "ไม่พบข้อมูล ticket_code"}</p>
          <button onClick={handlePrint} disabled={loading}>
            {loading ? "กำลังปริ้น..." : "ปริ้น QR Code"}
          </button>
        </div>
      ) : loading ? (
        <p>กำลังโหลด... กรุณารอสักครู่</p>
      ) : (
        <p>กรุณาสแกน QR Code...</p>
      )}
    </div>
  );
};

export default App;
