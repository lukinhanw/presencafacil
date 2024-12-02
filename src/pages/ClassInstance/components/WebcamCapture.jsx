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
					className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
				>
					<span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-gray-100 dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
						Cancelar
					</span>
				</button>
				<button
					onClick={capture}
					disabled={isLoading}
					className="btn-gradient font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
				>
					{isLoading ? 'Registrando...' : 'Capturar'}
				</button>
			</div>
		</div>
	);
}