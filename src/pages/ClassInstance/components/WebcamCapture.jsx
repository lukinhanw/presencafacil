import { useCallback, useRef, useState } from 'react';
import Webcam from 'react-webcam';

export default function WebcamCapture({ onCapture, onCancel, isLoading }) {
  const webcamRef = useRef(null);
  const [error, setError] = useState(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      onCapture(imageSrc);
    }
  }, [onCapture]);

  const handleUserMediaError = useCallback(() => {
    setError('Não foi possível acessar a câmera. Verifique as permissões do navegador.');
  }, []);

  if (error) {
    return (
      <div className="text-center">
        <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
        <button
          onClick={onCancel}
          className="btn-gradient"
        >
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          onUserMediaError={handleUserMediaError}
          className="w-full rounded-lg"
        />
        <div className="absolute inset-0 pointer-events-none border-2 border-primary-500 rounded-lg"></div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="btn-gradient-outline"
        >
          <span>Cancelar</span>
        </button>
        <button
          onClick={capture}
          disabled={isLoading}
          className="btn-gradient"
        >
          {isLoading ? 'Registrando...' : 'Capturar'}
        </button>
      </div>
    </div>
  );
}