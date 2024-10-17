import React, { useEffect, useRef, useState } from 'react';

const CameraCapture: React.FC = () => {
  const [cameraAccess, setCameraAccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Solicitar acceso a la cámara cuando el componente se monta
    const requestCameraAccess = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' }, // 'user' para la cámara frontal, 'environment' para la trasera
        });
        setCameraAccess(true);
        // Asignar el stream al elemento <video>
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setError('No se pudo acceder a la cámara. Asegúrate de otorgar permisos.');
        setCameraAccess(false);
      }
    };

    requestCameraAccess();
  }, []);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        // Ajustar el tamaño del canvas para coincidir con el video
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;

        // Dibujar el frame del video en el canvas
        context.drawImage(videoRef.current, 0, 0, videoRef.current.videoWidth, videoRef.current.videoHeight);

        // Convertir el contenido del canvas en una imagen base64
        const image = canvasRef.current.toDataURL('image/png');
        setCapturedImage(image);
      }
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      {cameraAccess ? (
        <div>
          <video
            ref={videoRef}
            autoPlay
            style={{
              width: '100%', // Para que ocupe todo el ancho disponible
              maxWidth: '640px', // Ajustar el tamaño máximo
              height: 'auto', // Para mantener la proporción del video
            }}
          />
          <button onClick={handleCapture} style={{ marginTop: '10px' }}>
            Tomar Foto
          </button>

          <canvas ref={canvasRef} style={{ display: 'none' }} />

          {capturedImage && (
            <div>
              <h3>Imagen capturada:</h3>
              <img
                src={capturedImage}
                alt="captured"
                style={{
                  width: '100%',
                  maxWidth: '640px',
                  height: 'auto',
                  marginTop: '10px',
                }}
              />
            </div>
          )}
        </div>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <p>Solicitando acceso a la cámara...</p>
      )}
    </div>
  );
};

export default CameraCapture;
