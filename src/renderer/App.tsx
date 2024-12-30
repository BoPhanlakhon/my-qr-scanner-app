import { useState, useEffect } from "react";

// สร้าง interface สำหรับข้อมูลที่คุณต้องการเก็บ
interface QRCodeData {
  user_id: string;
  ticket_code: string;
  [key: string]: string; // ฟิลด์อื่นๆ ที่อาจจะมีใน QR Code
}

const App = () => {
  const [qrCodeData, setQrCodeData] = useState<QRCodeData | null>(null); // ใช้ interface QRCodeData
  const [loading, setLoading] = useState(false); // สถานะการโหลด
  const [scanned, setScanned] = useState(false); // สถานะการสแกนว่าเสร็จหรือยัง

  // ฟังก์ชันจัดการเมื่อมีการสแกน QR Code
  const handleQRCodeScan = (event: KeyboardEvent) => {
    // ถ้ามีข้อมูลแล้วไม่ให้สแกนซ้ำ
    if (scanned) return;

    const target = event.target as HTMLInputElement | null;
    console.log("Input target:", target); // Log ข้อมูลที่พิมพ์ใน input
    if (target && target.value.trim()) {
      // เพิ่ม log เพื่อดูค่าของ target.value

      const newValue = target.value.trim();
      console.log("Scanned data:", newValue); // Log ข้อมูลที่สแกนเข้าม

      // สมมุติว่า QR Code มีข้อมูลในรูปแบบ "user_id:<user_id>,ticket_code:<ticket_code>,...other_fields"
      const parsedData: QRCodeData = {} as QRCodeData;
      newValue.split(",").forEach((item) => {
        const [key, value] = item.split(":");
        if (key && value) {
          parsedData[key] = value;
        }
      });

      // เช็คว่าเราสามารถแยกข้อมูลออกมาได้ไหม
      console.log("Parsed data:", parsedData);

      // เก็บข้อมูลที่แยกแล้วลงใน state
      setQrCodeData(parsedData);

      // ตั้งค่าสถานะการสแกนว่าเสร็จแล้ว
      setScanned(true);

      target.value = ""; // ล้างค่าภายใน input หลังจากสแกนแล้ว
      console.log("Input field cleared"); // Log หลังจากล้างข้อมูลใน input
    }
  };

  // ฟังก์ชันสำหรับการคลิกปุ่มปริ้น
  const handlePrint = () => {
    setLoading(true); // เริ่มโหลดเมื่อกดปุ่ม
    console.log("Printing...");

    // จำลองการโหลด 2 วินาที
    setTimeout(() => {
      setLoading(false); // โหลดเสร็จแล้วรีเซ็ตการโหลด
      setQrCodeData(null); // รีเซ็ตข้อมูล QR Code และแสดงข้อความ "กรุณาสแกน QR Code..."
      setScanned(false); // รีเซ็ตสถานะการสแกน
      console.log("Printing done");
    }, 2000); // 2 วินาที
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
  }, [scanned]); // เพิ่ม dependancy เพื่อให้ useEffect อัปเดตเมื่อ `scanned` เปลี่ยนแปลง

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
          <hr />
          <p>User ID: {qrCodeData.user_id}</p> {/* แสดงแค่ user_id */}
          <p>Ticket Code: {qrCodeData.ticket_code}</p> {/* แสดงแค่ ticket_code */}
          {/* ปุ่มปริ้นจะปรากฏขึ้นเมื่อมี qrCodeData */}
          <button onClick={handlePrint} disabled={loading}>
            {loading ? "กำลังปริ้น..." : "ปริ้น QR Code"}
          </button>
        </div>
      ) : loading ? (
        <p>กำลังโหลด... กรุณารอสักครู่</p> // แสดงข้อความโหลดระหว่างรอ
      ) : (
        <p>กรุณาสแกน QR Code...</p>
      )}
    </div>
  );
};

export default App;
