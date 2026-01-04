import React, { useState } from 'react';
import { GameConfig, Language, Difficulty, Topic } from '../types';
import { Keyboard, BookOpen, Globe, Zap } from 'lucide-react';

interface ConfigPanelProps {
  onStart: (config: GameConfig) => void;
  loading: boolean;
}

interface OptionButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
  icon?: any;
}

const OptionButton: React.FC<OptionButtonProps> = ({ 
  active, 
  onClick, 
  label, 
  icon: Icon 
}) => (
  <button
    onClick={onClick}
    className={`
      relative overflow-hidden group flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200
      ${active 
        ? 'border-primary-500 bg-primary-500/10 text-white shadow-[0_0_20px_-5px_rgba(14,165,233,0.3)]' 
        : 'border-slate-700 bg-surface text-slate-400 hover:border-slate-500 hover:bg-slate-800'
      }
    `}
  >
    {Icon && <Icon className={`mb-2 ${active ? 'text-primary-400' : 'text-slate-500'}`} size={24} />}
    <span className="font-medium">{label}</span>
    {active && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary-500"></div>}
  </button>
);

export const ConfigPanel: React.FC<ConfigPanelProps> = ({ onStart, loading }) => {
  const [config, setConfig] = useState<GameConfig>({
    language: 'english',
    difficulty: 'intermediate',
    topic: 'facts'
  });

  const handleSubmit = () => {
    onStart(config);
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-black text-white mb-4 tracking-tight">
          TypeFlow <span className="text-primary-500">AI</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-md mx-auto">
          Master typing with personalized, AI-generated lessons tailored to your skill level.
        </p>
      </div>

      <div className="bg-surface/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 shadow-xl">
        <div className="space-y-8">
          
          {/* Language Selection */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">
              <Globe size={16} /> Language
            </label>
            <div className="grid grid-cols-3 gap-4">
              {(['english', 'spanish', 'code'] as Language[]).map(lang => (
                <OptionButton
                  key={lang}
                  active={config.language === lang}
                  onClick={() => setConfig({ ...config, language: lang })}
                  label={lang === 'english' ? 'English' : lang === 'spanish' ? 'Español' : 'Code'}
                  icon={lang === 'code' ? Zap : undefined}
                />
              ))}
            </div>
          </div>

          {/* Topic Selection */}
          {config.language !== 'code' && (
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">
                <BookOpen size={16} /> Topic
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(['story', 'facts', 'business', 'nature'] as Topic[]).map(topic => (
                  <button
                    key={topic}
                    onClick={() => setConfig({ ...config, topic })}
                    className={`
                      px-3 py-2 rounded-lg text-sm font-medium transition-all
                      ${config.topic === topic 
                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20' 
                        : 'bg-canvas border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500'
                      }
                    `}
                  >
                    {topic.charAt(0).toUpperCase() + topic.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Difficulty Selection */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">
              <Keyboard size={16} /> Difficulty
            </label>
            <div className="grid grid-cols-3 gap-4">
              {(['beginner', 'intermediate', 'expert'] as Difficulty[]).map(diff => (
                <OptionButton
                  key={diff}
                  active={config.difficulty === diff}
                  onClick={() => setConfig({ ...config, difficulty: diff })}
                  label={diff.charAt(0).toUpperCase() + diff.slice(1)}
                  icon={undefined}
                />
              ))}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`
              w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform
              ${loading 
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white hover:scale-[1.02] shadow-primary-500/25'
              }
            `}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating Lesson...
              </span>
            ) : (
              "Start Typing"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};