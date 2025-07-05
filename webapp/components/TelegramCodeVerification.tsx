'use client';

import { useState } from 'react';

interface TelegramCodeVerificationProps {
  onSuccess?: () => void;
}

export default function TelegramCodeVerification({ onSuccess }: TelegramCodeVerificationProps) {
  const [step, setStep] = useState<'generate' | 'verify'>('generate');
  const [code, setCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [botUsername, setBotUsername] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userCode, setUserCode] = useState('');

  const generateCode = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/telegram/generate-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error generando código');
      }

      const data = await response.json();
      setGeneratedCode(data.code);
      setBotUsername(data.botUsername);
      setExpiresAt(data.expiresAt);
      setStep('verify');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/telegram/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: userCode }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error verificando código');
      }

      const data = await response.json();
      if (data.success) {
        onSuccess?.();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString();
  };

  if (step === 'generate') {
    return (
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-center">Vincular con Telegram</h2>
        
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            <p>Para vincular tu cuenta con Telegram:</p>
            <ol className="list-decimal list-inside mt-2 space-y-1">
              <li>Genera un código de verificación</li>
              <li>Abre Telegram y busca nuestro bot</li>
              <li>Envía el código al bot</li>
              <li>Vuelve aquí para confirmar</li>
            </ol>
          </div>

          <button
            onClick={generateCode}
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Generando...' : 'Generar Código de Verificación'}
          </button>

          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-center">Verificar Código</h2>
      
      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded">
          <h3 className="font-semibold text-blue-800">Tu código de verificación:</h3>
          <div className="text-2xl font-mono font-bold text-blue-600 text-center my-2">
            {generatedCode}
          </div>
          <p className="text-sm text-blue-600">
            Expira a las: {formatTime(expiresAt)}
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded">
          <h3 className="font-semibold mb-2">Instrucciones:</h3>
          <ol className="list-decimal list-inside text-sm space-y-1">
            <li>Abre Telegram</li>
            <li>Busca: <code className="bg-gray-200 px-1 rounded">@{botUsername}</code></li>
            <li>Envía el código: <code className="bg-gray-200 px-1 rounded">/verify {generatedCode}</code></li>
            <li>Vuelve aquí para verificar</li>
          </ol>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            ¿Ya enviaste el código? Verifica la vinculación:
          </label>
          <input
            type="text"
            value={userCode}
            onChange={(e) => setUserCode(e.target.value)}
            placeholder="Ingresa el código que enviaste"
            className="w-full border border-gray-300 rounded px-3 py-2 text-center font-mono"
            maxLength={6}
          />
        </div>

        <button
          onClick={verifyCode}
          disabled={loading || userCode.length !== 6}
          className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? 'Verificando...' : 'Verificar Vinculación'}
        </button>

        <button
          onClick={() => setStep('generate')}
          className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
        >
          Generar Nuevo Código
        </button>

        {error && (
          <div className="text-red-500 text-sm text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
