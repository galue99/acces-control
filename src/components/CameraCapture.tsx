import React, { useRef, useCallback, useState } from 'react';
import Webcam from 'react-webcam';

const isMobile = /Mobi|Android/i.test(window.navigator.userAgent);

const videoConstraints = {
  width: 640,
  height: 480,
  facingMode: isMobile ? { exact: "environment" } : "user"
};

const CameraCapture: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const [image, setImage] = useState<string | null>(null);

  const capture = useCallback(() => {

    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImage(imageSrc);
    }
  }, []);

  return (
    <div>
      <h1>Toma una fotografía</h1>

      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
      />

      <button onClick={capture}>Capturar Foto</button>

      {image && (
        <div>
          <h2>Imagen capturada:</h2>
          <img src={image} alt="captured" />
        </div>
      )}
    </div>
  );
};

export default CameraCapture;
