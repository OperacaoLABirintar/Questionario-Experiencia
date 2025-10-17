
import React from 'react';

interface TextAreaInputProps {
  label: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  required: boolean;
}

export const TextAreaInput: React.FC<TextAreaInputProps> = ({ id, label, value, onChange, placeholder, required }) => {
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