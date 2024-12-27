import { useRef, useEffect, useState } from "react";
import jsQR from "jsqr";

const App = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);

  useEffect(() => {
    // ฟังก์ชันเริ่มต้นกล้อง
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          // ตั้งค่า srcObject ก่อน
          videoRef.current.srcObject = stream;

          // รอให้ video พร้อมแล้วจึงเล่น
          if (videoRef.current.readyState >= 2) {
            videoRef.current.play().catch((error) => {
              console.error("Error playing video: ", error);
            });
          } else {
            // ใช้ setTimeout เพื่อให้เวลาครบก่อน play
            setTimeout(() => {
              videoRef.current?.play().catch((error) => {
                console.error("Error playing video: ", error);
              });
            }, 500); // ล่าช้าเล็กน้อยเพื่อให้ video โหลดเสร็จ
          }
        }
      } catch (error) {
        console.error("Error accessing camera: ", error);
      }
    };

    startVideo();

    // ฟังก์ชันแสกน QR Code ทุกๆ 100 มิลลิวินาที
    const interval = setInterval(() => {
      scanQRCode();
    }, 100);

    // คอยล้าง interval เมื่อ unmount
    return () => clearInterval(interval);
  }, []);

  // ฟังก์ชันการแสกน QR Code
  const scanQRCode = async () => {
    if (videoRef.current && !isScanning) {
      setIsScanning(true);
      const canvas = document.createElement("canvas");
      const video = videoRef.current;

      // ตรวจสอบว่า video.width และ video.height ถูกต้อง
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        setIsScanning(false);
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const qrCode = jsQR(imageData.data, imageData.width, imageData.height);
        if (qrCode) {
          if (qrCode.data !== qrCodeData) {
            // ตรวจสอบว่า QR Code มีการเปลี่ยนแปลง
            setQrCodeData(qrCode.data);
          }
        }
      }
      setIsScanning(false); // หยุดการแสกนเมื่อทำงานเสร็จ
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>QR Code Scanner</h1>
      <video ref={videoRef} style={{ width: "100%", maxWidth: "500px" }}></video>
      {qrCodeData ? (
        <div>
          <h2>QR Code Data:</h2>
          <p>{qrCodeData}</p>
        </div>
      ) : (
        <p>กำลังแสกน QR Code...</p>
      )}
    </div>
  );
};

export default App;
