import { useState, useEffect } from "react";

const App = () => {
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);

  // ฟังก์ชันจัดการเมื่อมีการสแกน QR Code
  const handleQRCodeScan = (event: Event) => {
    const target = event.target as HTMLInputElement; // แปลง event.target ให้เป็น HTMLInputElement
    const scannedData = target.value.trim();
    if (scannedData) {
      setQrCodeData(scannedData);
      target.value = ""; // ล้างค่าใน input เพื่อพร้อมรับข้อมูลใหม่
    }
  };

  useEffect(() => {
    const inputField = document.getElementById("scanner-input") as HTMLInputElement;

    if (inputField) {
      // เพิ่ม Event Listener
      inputField.addEventListener("input", handleQRCodeScan);
    }

    // ลบ Event Listener เมื่อ Component ถูก Unmount
    return () => {
      if (inputField) {
        inputField.removeEventListener("input", handleQRCodeScan);
      }
    };
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <h1>QR Code Scanner</h1>

      {/* Hidden Input สำหรับรับข้อมูลจากเครื่องสแกน */}
      <input id="scanner-input" type="text" style={{ position: "absolute", opacity: 0, pointerEvents: "none" }} autoFocus />

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

// import { useRef, useEffect, useState } from "react";
// import jsQR from "jsqr";

// const App = () => {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const [qrCodeData, setQrCodeData] = useState<string | null>(null);

//   useEffect(() => {
//     const startCamera = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//         if (videoRef.current) {
//           videoRef.current.srcObject = stream;
//           videoRef.current.play();
//         }
//       } catch (error) {
//         console.error("ไม่สามารถเข้าถึงกล้องได้: ", error);
//       }
//     };

//     startCamera();

//     const interval = setInterval(() => {
//       scanQRCode();
//     }, 500); // สแกนทุก 500 มิลลิวินาที

//     return () => clearInterval(interval);
//   }, []);

//   const scanQRCode = () => {
//     if (videoRef.current) {
//       const canvas = document.createElement("canvas");
//       const context = canvas.getContext("2d");
//       const video = videoRef.current;

//       if (context) {
//         canvas.width = video.videoWidth;
//         canvas.height = video.videoHeight;
//         context.drawImage(video, 0, 0, canvas.width, canvas.height);

//         const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
//         const qrCode = jsQR(imageData.data, imageData.width, imageData.height);

//         if (qrCode) {
//           if (qrCode.data !== qrCodeData) {
//             setQrCodeData(qrCode.data);
//           }
//         }
//       }
//     }
//   };

//   return (
//     <div style={{ textAlign: "center" }}>
//       <h1>QR Code Scanner</h1>
//       <video ref={videoRef} style={{ width: "100%", maxWidth: "500px", border: "1px solid black" }}></video>
//       {qrCodeData ? (
//         <div>
//           <h2>QR Code Data:</h2>
//           <p>{qrCodeData}</p>
//         </div>
//       ) : (
//         <p>กรุณานำ QR Code มาใกล้กล้อง...</p>
//       )}
//     </div>
//   );
// };

// export default App;
