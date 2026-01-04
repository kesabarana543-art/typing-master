import React, { useState } from 'react';
import { GameConfig, GameStats, GeneratedContent } from './types';
import { generateTypingContent } from './services/geminiService';
import { ConfigPanel } from './components/ConfigPanel';
import { TypingArea } from './components/TypingArea';
import { Results } from './components/Results';

type ViewState = 'setup' | 'typing' | 'results';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('setup');
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<GameConfig | null>(null);
  const [content, setContent] = useState<GeneratedContent | null>(null);
  const [stats, setStats] = useState<GameStats | null>(null);

  const handleStart = async (newConfig: GameConfig) => {
    setLoading(true);
    setConfig(newConfig);
    
    try {
      const generated = await generateTypingContent(newConfig);
      setContent(generated);
      setView('typing');
    } catch (error) {
      console.error("Failed to load content", error);
      // Could show toast error here
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = (gameStats: GameStats) => {
    setStats(gameStats);
    setView('results');
  };

  const handleRestart = () => {
    // Reset stats but keep content
    setView('typing');
  };

  const handleNewGame = () => {
    setView('setup');
    setContent(null);
    setStats(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-canvas to-slate-900 text-slate-100 font-sans selection:bg-primary-500/30 selection:text-primary-200">
      {/* Header */}
      <header className="fixed top-0 w-full p-4 z-50 pointer-events-none">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2 pointer-events-auto cursor-pointer" onClick={() => setView('setup')}>
               <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center font-mono font-bold text-white shadow-lg shadow-primary-500/20">T</div>
               <span className="font-bold text-xl tracking-tight hidden sm:block">TypeFlow</span>
            </div>
            
            {view === 'typing' && (
                <div className="px-3 py-1 bg-surface/80 backdrop-blur rounded-full border border-slate-700 text-xs font-mono text-slate-400">
                    {config?.language === 'spanish' ? 'ES' : 'EN'} • {config?.difficulty} • {config?.topic}
                </div>
            )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="container mx-auto px-4 pt-24 pb-12 min-h-screen flex flex-col justify-center">
        {view === 'setup' && (
          <ConfigPanel onStart={handleStart} loading={loading} />
        )}

        {view === 'typing' && content && (
          <TypingArea 
            content={content}
            onComplete={handleComplete}
            onRestart={handleRestart}
          />
        )}

        {view === 'results' && stats && (
          <Results 
            stats={stats}
            onRestart={handleRestart}
            onNewGame={handleNewGame}
          />
        )}
      </main>
      
      {/* Footer */}
      <footer className="fixed bottom-4 w-full text-center pointer-events-none">
        <p className="text-slate-600 text-xs">Powered by Google Gemini</p>
      </footer>
    </div>
  );
};

export default App;
