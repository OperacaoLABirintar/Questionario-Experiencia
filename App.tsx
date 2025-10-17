import React, { useState, useCallback } from 'react';
import { Status } from './types.ts';
import { submitToGoogleSheet } from './services/googleSheetsService.ts';
import { Button } from './components/Button.tsx';
import { NpsScoreSelector } from './components/NpsScoreSelector.tsx';
import { TextAreaInput } from './components/TextAreaInput.tsx';

const App: React.FC = () => {
  const [score, setScore] = useState<number | null>(null);
  const [reason, setReason] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');
  const [status, setStatus] = useState<Status>(Status.Idle);
  const [error, setError] = useState<string | null>(null);

  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwy7jjg4AxL4Qjnfx5tnCjVO99DORSyDD387BefAQYa5ZCQ2NUuGcTy4Fbfs6hnIBz3/exec';

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
        <fieldset>
          <legend className="block text-lg font-bold text-gray-800 mb-4 text-center">
            De 0 a 10, quanto você recomendaria a experiência vivenciada?
          </legend>
          <NpsScoreSelector selectedScore={score} onSelectScore={setScore} />
        </fieldset>

        {isReasonRequired && (
          <TextAreaInput
            id="reason-input"
            label="Porque não 10?"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Sua opinião é muito importante para melhorarmos..."
            required={true}
          />
        )}
        
        <TextAreaInput
          id="feedback-input"
          label="Impressões, percepções e vivências (Opcional)"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="O que você viu, sentiu ou aprendeu com as crianças?"
          required={false}
        />

        {error && <p role="alert" className="text-red-600 text-sm text-center">{error}</p>}
        
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
      <div className="h-40 md:h-40 lg:h-44 flex-shrink-0"></div>

      <div className="flex-grow overflow-y-auto flex flex-col items-center p-4">
        <div className="w-full max-w-2xl mx-auto">
          <header className="text-center mb-8">
              <h1 
                className="text-3xl font-bold text-black"
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
