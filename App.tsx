
import React, { useState, useEffect } from 'react';
import { AppMode, Session } from './types';
import ConductorView from './components/ConductorView';
import AdminView from './components/AdminView';
import { Smartphone, LayoutDashboard, Truck } from 'lucide-react';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.CONDUCTOR);
  const [sessions, setSessions] = useState<Session[]>([]);

  // Simulate local database persistence
  useEffect(() => {
    const saved = localStorage.getItem('coomoquin_sessions');
    if (saved) {
      setSessions(JSON.parse(saved));
    }
  }, []);

  const handleSaveSession = (newSession: Session) => {
    const updated = [...sessions, newSession];
    setSessions(updated);
    localStorage.setItem('coomoquin_sessions', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Dynamic Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold">C</div>
             <span className="font-impact text-2xl tracking-tight text-blue-900 hidden sm:inline">COOMOQUIN</span>
          </div>

          <nav className="flex bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => setMode(AppMode.CONDUCTOR)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${mode === AppMode.CONDUCTOR ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Smartphone size={18}/> <span className="hidden md:inline">App Conductor</span>
            </button>
            <button 
              onClick={() => setMode(AppMode.ADMIN)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${mode === AppMode.ADMIN ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <LayoutDashboard size={18}/> <span className="hidden md:inline">Panel Admin</span>
            </button>
          </nav>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
             <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
             LIVE SYSTEM
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow bg-slate-50">
        {mode === AppMode.CONDUCTOR ? (
          <div className="py-4 sm:py-8">
             <ConductorView onSaveSession={handleSaveSession} />
          </div>
        ) : (
          <AdminView sessions={sessions} />
        )}
      </main>

      {/* Footer Branding */}
      <footer className="bg-slate-900 text-slate-400 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
             <Truck size={16}/>
             <span>© 2026 Pasajeros Coomoquin S.A.S - Armenia, Quindío</span>
          </div>
          <div className="flex gap-6 text-xs font-medium uppercase tracking-widest">
             <a href="#" className="hover:text-white transition-colors">Terminos de Uso</a>
             <a href="#" className="hover:text-white transition-colors">Politica BYOD</a>
             <a href="#" className="hover:text-white transition-colors">Soporte Tecnico</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
