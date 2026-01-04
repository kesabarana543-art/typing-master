import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RefreshCw, Play, AlertCircle } from 'lucide-react';
import { LetterState, GameStats, GeneratedContent } from '../types';
import { VirtualKeyboard } from './VirtualKeyboard';

interface TypingAreaProps {
  content: GeneratedContent;
  onComplete: (stats: GameStats) => void;
  onRestart: () => void;
}

export const TypingArea: React.FC<TypingAreaProps> = ({ content, onComplete, onRestart }) => {
  const [inputText, setInputText] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [stats, setStats] = useState<GameStats>({
    wpm: 0,
    accuracy: 100,
    timeElapsed: 0,
    errors: 0,
    totalChars: 0,
    wpmHistory: []
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // Split text into lines for rendering logic is too complex for this simplified view, 
  // so we render as a continuous flow but handle scroll.
  const letters = content.text.split('');

  // Derived state for letters
  const getLetterStatus = (index: number): LetterState['status'] => {
    if (index >= inputText.length) return 'pending';
    return inputText[index] === letters[index] ? 'correct' : 'incorrect';
  };

  const calculateStats = useCallback(() => {
    if (!startTime) return;
    
    const now = Date.now();
    const durationMinutes = (now - startTime) / 60000;
    
    if (durationMinutes <= 0) return;

    // Calculate WPM: (All typed characters / 5) / Time (min)
    const wpm = Math.round((inputText.length / 5) / durationMinutes);
    
    // Calculate Accuracy
    let correct = 0;
    for (let i = 0; i < inputText.length; i++) {
        if (inputText[i] === content.text[i]) correct++;
    }
    const accuracy = inputText.length > 0 ? Math.round((correct / inputText.length) * 100) : 100;

    setStats(prev => ({
      ...prev,
      wpm,
      accuracy,
      timeElapsed: Math.floor((now - startTime) / 1000),
      totalChars: inputText.length,
      errors: inputText.length - correct,
      wpmHistory: [...prev.wpmHistory, { time: Math.floor((now - startTime) / 1000), wpm }]
    }));
  }, [inputText, startTime, content.text]);

  // Game Loop Timer
  useEffect(() => {
    let interval: number;
    if (startTime && inputText.length < content.text.length) {
      interval = window.setInterval(calculateStats, 1000);
    }
    return () => clearInterval(interval);
  }, [startTime, inputText.length, content.text.length, calculateStats]);

  // Auto-scroll active cursor into view
  useEffect(() => {
    const activeIndex = inputText.length;
    if (charRefs.current[activeIndex] && scrollRef.current) {
        const charEl = charRefs.current[activeIndex];
        const container = scrollRef.current;
        
        // Basic scroll logic
        const charTop = charEl?.offsetTop || 0;
        const containerHeight = container.clientHeight;
        const scrollTop = container.scrollTop;

        if (charTop > scrollTop + containerHeight - 60) {
            container.scrollTo({ top: charTop - 40, behavior: 'smooth' });
        }
    }
  }, [inputText]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    
    if (!startTime) {
      setStartTime(Date.now());
    }

    if (val.length <= content.text.length) {
        setInputText(val);
    }

    if (val.length === content.text.length) {
        // Game Over
        setTimeout(() => onComplete(stats), 100);
    }
  };

  // Focus management
  const handleFocus = () => {
    inputRef.current?.focus();
    setIsFocused(true);
  };

  const handleBlur = () => setIsFocused(false);

  // Determine active key for visual keyboard
  const activeChar = content.text[inputText.length] || '';
  const lastTypedCorrect = inputText.length > 0 ? inputText[inputText.length - 1] === content.text[inputText.length - 1] : null;

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6" onClick={handleFocus}>
      {/* HUD */}
      <div className="flex justify-between items-center bg-surface p-4 rounded-xl border border-slate-700 shadow-lg">
        <div className="flex gap-8">
            <div className="flex flex-col">
                <span className="text-slate-400 text-xs uppercase tracking-wider font-semibold">WPM</span>
                <span className="text-2xl font-mono font-bold text-primary-500">{stats.wpm}</span>
            </div>
            <div className="flex flex-col">
                <span className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Accuracy</span>
                <span className={`text-2xl font-mono font-bold ${stats.accuracy >= 95 ? 'text-green-500' : stats.accuracy >= 80 ? 'text-yellow-500' : 'text-red-500'}`}>
                    {stats.accuracy}%
                </span>
            </div>
            <div className="flex flex-col">
                <span className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Time</span>
                <span className="text-2xl font-mono font-bold text-slate-200">{stats.timeElapsed}s</span>
            </div>
        </div>
        
        <button 
            onClick={(e) => { e.stopPropagation(); onRestart(); }}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors font-medium text-sm"
        >
            <RefreshCw size={16} /> Restart
        </button>
      </div>

      {/* Typing Container */}
      <div className="relative group">
        {/* Focus Overlay */}
        {!isFocused && inputText.length < content.text.length && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-2xl cursor-pointer">
                <div className="flex flex-col items-center text-white animate-pulse">
                    <Play size={48} className="mb-2 text-primary-500" />
                    <span className="font-semibold text-lg">Click to type</span>
                </div>
            </div>
        )}

        <div 
            ref={scrollRef}
            className={`
                bg-surface border-2 rounded-2xl p-8 h-64 overflow-y-auto font-mono text-2xl leading-relaxed shadow-inner
                ${isFocused ? 'border-primary-500/50 shadow-[0_0_30px_-5px_rgba(14,165,233,0.15)]' : 'border-slate-700'}
                transition-all duration-300
            `}
        >
            {letters.map((char, idx) => {
                const status = getLetterStatus(idx);
                const isActive = idx === inputText.length;
                
                let className = "relative transition-colors duration-75 ";
                if (status === 'correct') className += "text-slate-500"; // Correct typed text fades out slightly to focus on next
                else if (status === 'incorrect') className += "text-red-500 bg-red-500/10 rounded";
                else className += "text-slate-200"; // Pending text

                if (isActive && isFocused) {
                    className += " after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-full after:h-1 after:bg-primary-500 after:animate-pulse";
                }

                return (
                    <span 
                        key={idx} 
                        ref={el => { charRefs.current[idx] = el }}
                        className={className}
                    >
                        {char}
                    </span>
                );
            })}
        </div>

        {/* Hidden Input for Mobile/IME compatibility and focus trapping */}
        <input
            ref={inputRef}
            type="text"
            className="absolute opacity-0 top-0 left-0 w-full h-full cursor-default z-10"
            value={inputText}
            onChange={handleInput}
            onFocus={handleFocus}
            onBlur={handleBlur}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
        />
      </div>

      <div className="flex justify-center mt-4">
        <VirtualKeyboard activeKey={activeChar} isCorrect={lastTypedCorrect} />
      </div>

      <div className="text-center text-slate-500 text-sm mt-4">
          <p>{content.title}</p>
      </div>
    </div>
  );
};
