import React from 'react';

interface NpsScoreSelectorProps {
  selectedScore: number | null;
  onSelectScore: (score: number) => void;
}

export const NpsScoreSelector: React.FC<NpsScoreSelectorProps> = ({ selectedScore, onSelectScore }) => {
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
