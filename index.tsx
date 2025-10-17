import React, { useState, useCallback } from 'react';
import ReactDOM from 'react-dom/client';

// --- Types ---
enum Status {
  Idle = 'idle',
  Submitting = 'submitting',
  Success = 'success',
  Error = 'error',
}

interface FormData {
  score: number;
  reason: string;
  feedback: string;
}

// --- Google Sheets Service ---
const submitToGoogleSheet = async (scriptUrl: string, data: FormData): Promise<void> => {
  try {
    const response = await fetch(scriptUrl, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
        throw new Error(`Server responded with ${response.status}: ${errorData.error || 'Unknown error'}`);
    }

    const result = await response.json();
    if (result.result !== 'success') {
      throw new Error(result.error || 'An unknown error occurred during submission.');
    }
  } catch (error) {
    console.error('Error submitting to Google Sheet:', error);
    throw error;
  }
};

// --- Components ---

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, className, ...props }) => {
  return (
    <button
      className={`px-6 py-3 text-white font-bold rounded-lg shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#f4f0e8] ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

interface NpsScoreSelectorProps {
  selectedScore: number | null;
  onSelectScore: (score: number) => void;
}

const NpsScoreSelector: React.FC<NpsScoreSelectorProps> = ({ selectedScore, onSelectScore }) => {
  const scoreValue = selectedScore ?? 5; // Default to middle for initial render if null

  const getColorClasses = (score: number | null): { accent: string, bg: string, text: string } => {
    if (score === null) {
      return { accent: 'accent-gray-400', bg: 'bg-gray-400', text: 'text-white' };
    }
    if (score <= 6) {
      return { accent: 'accent-red-500', bg: 'bg-red-500', text: 'text-white' };
    }
    if (score <= 8) {
      return { accent: 'accent-yellow-500', bg: 'bg-yellow-500', text: 'text-white' };
    }
    return { accent: 'accent-green-500', bg: 'bg-green-500', text: 'text-white' };
  };

  const colorClasses = getColorClasses(selectedScore);
  
  const handleScoreChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSelectScore(parseInt(event.target.value, 10));
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full px-2">
       <div 
        className={`flex items-center justify-center w-16 h-16 rounded-full font-bold text-2xl shadow-lg transition-colors duration-300 ${colorClasses.bg} ${colorClasses.text}`}
      >
        {selectedScore ?? '-'}
      </div>
      <input
        type="range"
        min="0"
        max="10"
        step="1"
        value={scoreValue}
        onChange={handleScoreChange}
        className={`w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer ${colorClasses.accent}`}
      />
      <div className="flex justify-between w-full text-sm text-gray-500 px-1 mt-1">
        <span>0</span>
        <span>10</span>
      </div>
    </div>
  );
};

interface TextAreaInputProps {
  label: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  required: boolean;
}

const TextAreaInput: React.FC<TextAreaInputProps> = ({ id, label, value, onChange, placeholder, required }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-md font-bold text-gray-800 mb-2">
        {label}
        {required && <span className="text-[#ff595a] ml-1">*</span>}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={4}
        className="w-full px-4 py-3 text-gray-700 bg-white/80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffa400] transition-shadow"
      />
    </div>
  );
};

// --- Main App Component ---
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
      <div className="h-24 md:h-32 flex-shrink-0"></div>

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

// --- Render App to DOM ---
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);