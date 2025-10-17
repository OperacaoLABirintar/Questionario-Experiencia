
import React, { useState } from 'react';

const scriptCode = `
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Respostas');
    if (!sheet) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('Respostas');
      sheet.appendRow(['Timestamp', 'Score', 'Reason', 'Feedback']);
    }
    
    var data = JSON.parse(e.postData.contents);
    
    var score = data.score;
    var reason = data.reason || '';
    var feedback = data.feedback || '';
    
    sheet.appendRow([new Date(), score, reason, feedback]);
    
    return ContentService.createTextOutput(JSON.stringify({
      'result': 'success'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      'result': 'error',
      'error': error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
`;

export const Instructions: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => setIsOpen(!isOpen);

    return (
        <div className="bg-gray-800 text-white rounded-2xl shadow-lg overflow-hidden">
            <button
                onClick={toggleOpen}
                className="w-full p-4 flex justify-between items-center bg-gray-700 hover:bg-gray-600 focus:outline-none"
            >
                <h3 className="text-lg font-bold">Instruções de Implementação do Google Sheet</h3>
                <svg
                    className={`w-6 h-6 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </button>
            {isOpen && (
                <div className="p-6">
                    <p className="mb-4">Siga estes passos para conectar este formulário a uma Planilha Google:</p>
                    <ol className="list-decimal list-inside space-y-4">
                        <li>Crie uma nova Planilha em <a href="https://sheets.new" target="_blank" rel="noopener noreferrer" className="text-[#ffa400] underline">sheets.new</a>.</li>
                        <li>No menu, vá para <span className="font-mono bg-gray-700 px-1 rounded">Extensões &gt; Apps Script</span>.</li>
                        <li>Apague todo o código existente e cole o código abaixo:
                            <pre className="bg-gray-900 text-sm p-4 rounded-md mt-2 overflow-x-auto">
                                <code>{scriptCode}</code>
                            </pre>
                        </li>
                        <li>Salve o projeto (ícone de disquete).</li>
                        <li>Clique em <span className="font-mono bg-gray-700 px-1 rounded">Implantar &gt; Nova implantação</span>.</li>
                        <li>
                            Clique no ícone de engrenagem ('Selecionar tipo') e escolha <span className="font-mono bg-gray-700 px-1 rounded">App da Web</span>.
                        </li>
                        <li>
                            Em 'Quem pode acessar', selecione <span className="font-mono bg-gray-700 px-1 rounded">Qualquer pessoa</span>.
                        </li>
                        <li>Clique em <span className="font-mono bg-gray-700 px-1 rounded">Implantar</span>. Conceda as permissões necessárias quando solicitado.</li>
                        <li>Copie a <span className="font-bold text-[#ffa400]">URL do app da Web</span> e cole no campo acima neste formulário.</li>
                    </ol>
                </div>
            )}
        </div>
    );
};
