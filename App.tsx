import React, { useState, useCallback } from 'react';
import { NpsScoreSelector } from './components/NpsScoreSelector';
import { TextAreaInput } from './components/TextAreaInput';
import { Button } from './components/Button';
import { submitToGoogleSheet } from './services/googleSheetsService';
import { Status } from './types';

const App: React.FC = () => {
  const [score, setScore] = useState<number | null>(null);
  const [reason, setReason] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');
  const [status, setStatus] = useState<Status>(Status.Idle);
  const [error, setError] = useState<string | null>(null);

  // For developer: Replace this placeholder with your actual Google Apps Script URL.
  // The instructions for creating the script are in 'components/Instructions.tsx'.
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/REPLACE_WITH_YOUR_SCRIPT_ID/exec';

  const isReasonRequired = score !== null && score < 10;

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === Status.Submitting) return;

    if (GOOGLE_SCRIPT_URL.includes('REPLACE_WITH_YOUR_SCRIPT_ID')) {
      setError('A URL do Google Apps Script precisa ser configurada pelo desenvolvedor.');
      setStatus(Status.Error);
      return;
    }

    if (score === null) {
      setError('Por favor, selecione uma nota de 0 a 10.');
      return;
    }
    if (isReasonRequired && !reason.trim()) {
      setError('Por favor, preencha o motivo da sua nota.');
      return;
    }

    setError(null);
    setStatus(Status.Submitting);

    try {
      await submitToGoogleSheet(GOOGLE_SCRIPT_URL, {
        score,
        reason: isReasonRequired ? reason : '',
        feedback,
      });
      setStatus(Status.Success);
      setScore(null);
      setReason('');
      setFeedback('');
    } catch (err) {
      setStatus(Status.Error);
      setError('Ocorreu um erro ao enviar sua resposta. Tente novamente mais tarde.');
      console.error(err);
    }
  }, [score, reason, feedback, status, isReasonRequired]);

  const renderFormContent = () => {
    if (status === Status.Success) {
      return (
        <div className="text-center p-8 bg-green-50 border border-green-200 rounded-lg">
          <h2 className="text-2xl font-bold text-green-700">Obrigado!</h2>
          <p className="text-green-600 mt-2">Sua resposta foi enviada com sucesso.</p>
          <Button onClick={() => setStatus(Status.Idle)} className="mt-6 bg-[#ffa400] hover:bg-orange-500">
            Enviar outra resposta
          </Button>
        </div>
      );
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="block text-lg font-bold text-gray-800 mb-4 text-center">
            De 0 a 10, quanto você recomendaria a experiência vivenciada?
          </label>
          <NpsScoreSelector selectedScore={score} onSelectScore={setScore} />
        </div>

        {isReasonRequired && (
          <TextAreaInput
            label="Porque não 10?"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Sua opinião é muito importante para melhorarmos..."
            required={true}
          />
        )}
        
        <TextAreaInput
          label="Impressões, percepções e vivências (Opcional)"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="O que você viu, sentiu ou aprendeu com as crianças?"
          required={false}
        />

        {error && <p className="text-red-600 text-sm text-center">{error}</p>}
        
        <div className="pt-4">
          <Button
            type="submit"
            disabled={status === Status.Submitting}
            className="w-full bg-[#ff595a] hover:bg-red-700 disabled:bg-gray-400"
          >
            {status === Status.Submitting ? 'Enviando...' : 'Enviar Avaliação'}
          </Button>
        </div>
      </form>
    );
  };
  
  return (
    <div className="h-screen flex flex-col">
      {/* This div acts as a spacer, reserving space for the logo at the top.
          It is not scrollable and does not shrink.
          The height is set to ensure the logo is visible and not overlapped.
          Using responsive heights for better layout on different screens. */}
      <div className="h-40 md:h-48 lg:h-56 flex-shrink-0"></div>

      {/* This container holds the actual content and is scrollable. */}
      <div className="flex-grow overflow-y-auto flex flex-col items-center p-4">
        <div className="w-full max-w-2xl mx-auto">
          <header className="text-center mb-8">
              <h1 
                className="text-3xl font-bold text-white" 
                style={{ textShadow: '2px 2px 8px rgba(0, 0, 0, 0.7)' }}
              >
                Avaliação de Experiência
              </h1>
          </header>
          
          <main className="bg-white/70 p-8 rounded-2xl shadow-lg backdrop-blur-sm mb-8">
            {renderFormContent()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;