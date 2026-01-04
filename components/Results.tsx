import React from 'react';
import { GameStats } from '../types';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { ArrowRight, RotateCcw, Share2, Award } from 'lucide-react';

interface ResultsProps {
  stats: GameStats;
  onRestart: () => void;
  onNewGame: () => void;
}

export const Results: React.FC<ResultsProps> = ({ stats, onRestart, onNewGame }) => {
  return (
    <div className="w-full max-w-4xl mx-auto animate-in fade-in zoom-in duration-300">
      <div className="bg-surface border border-slate-700 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-green-500/10 text-green-500 rounded-full mb-4">
            <Award size={32} />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Session Complete!</h2>
          <p className="text-slate-400">Great job improving your typing skills.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-canvas p-6 rounded-xl border border-slate-800 flex flex-col items-center">
             <span className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">WPM</span>
             <span className="text-5xl font-mono font-bold text-primary-500">{stats.wpm}</span>
          </div>
          <div className="bg-canvas p-6 rounded-xl border border-slate-800 flex flex-col items-center">
             <span className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">Accuracy</span>
             <span className={`text-5xl font-mono font-bold ${stats.accuracy >= 95 ? 'text-green-500' : 'text-yellow-500'}`}>
                {stats.accuracy}%
             </span>
          </div>
          <div className="bg-canvas p-6 rounded-xl border border-slate-800 flex flex-col items-center">
             <span className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">Missed</span>
             <span className="text-5xl font-mono font-bold text-red-500">{stats.errors}</span>
          </div>
        </div>

        <div className="h-64 w-full mb-10 bg-canvas/50 rounded-xl p-4 border border-slate-800">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.wpmHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#475569" label={{ value: 'Time (s)', position: 'insideBottom', offset: -5 }} />
              <YAxis stroke="#475569" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#e2e8f0' }}
                itemStyle={{ color: '#0ea5e9' }}
              />
              <Line type="monotone" dataKey="wpm" stroke="#0ea5e9" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={onRestart}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-all hover:scale-105"
          >
            <RotateCcw size={20} /> Retry Lesson
          </button>
          <button 
            onClick={onNewGame}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-lg font-semibold shadow-lg shadow-primary-500/25 transition-all hover:scale-105"
          >
            Next Lesson <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
