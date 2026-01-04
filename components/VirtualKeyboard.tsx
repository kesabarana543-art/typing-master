import React from 'react';

interface VirtualKeyboardProps {
  activeKey: string | null;
  isCorrect?: boolean | null; // null = pending, true = correct, false = incorrect
}

const ROWS = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
  ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
  ['Caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter'],
  ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
  ['Space']
];

const KEY_WIDTHS: Record<string, string> = {
  Backspace: 'w-20',
  Tab: 'w-20',
  Caps: 'w-24',
  Enter: 'w-24',
  Shift: 'w-28',
  Space: 'w-64',
};

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({ activeKey, isCorrect }) => {
  const getKeyColor = (keyLabel: string) => {
    // Normalize active key check
    const pressed = activeKey?.toLowerCase() === keyLabel.toLowerCase() || 
                   (activeKey === ' ' && keyLabel === 'Space');
    
    if (pressed) {
        if (isCorrect === true) return 'bg-green-500 border-green-600 text-white transform translate-y-1 shadow-inner';
        if (isCorrect === false) return 'bg-red-500 border-red-600 text-white transform translate-y-1 shadow-inner';
        return 'bg-blue-500 border-blue-600 text-white transform translate-y-1 shadow-inner';
    }
    return 'bg-slate-700 border-slate-900 text-slate-300 shadow-[0_4px_0_0_rgba(15,23,42,1)]';
  };

  return (
    <div className="flex flex-col gap-2 p-6 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 select-none hidden xl:flex">
      {ROWS.map((row, rIdx) => (
        <div key={rIdx} className="flex justify-center gap-2">
          {row.map((keyLabel, kIdx) => (
            <div
              key={`${rIdx}-${kIdx}`}
              className={`
                ${KEY_WIDTHS[keyLabel] || 'w-12'} 
                h-12 flex items-center justify-center rounded-lg font-mono text-sm font-bold border-b-4 transition-all duration-75
                ${getKeyColor(keyLabel)}
              `}
            >
              {keyLabel === 'Space' ? '' : keyLabel}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
