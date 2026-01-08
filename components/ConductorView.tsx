
import React, { useState, useEffect } from 'react';
import { ROUTES, VEHICLES, TURNS } from '../constants';
import { Session, PassengerLog } from '../types';
import { Plus, Minus, CheckCircle, Truck, MapPin, Clock, AlertTriangle } from 'lucide-react';

interface Props {
  onSaveSession: (session: Session) => void;
}

const ConductorView: React.FC<Props> = ({ onSaveSession }) => {
  const [step, setStep] = useState<'config' | 'oper' | 'closing'>('config');
  const [session, setSession] = useState<Partial<Session>>({
    id: Math.random().toString(36).substr(2, 9),
    vehicleId: '',
    routeId: '',
    turn: '',
    logs: [],
    startTime: Date.now(),
    totalCollected: 0,
    isClosed: false
  });

  const [currentPassengers, setCurrentPassengers] = useState(0);
  const [offlineStatus, setOfflineStatus] = useState(false);

  useEffect(() => {
    const handleOnline = () => setOfflineStatus(false);
    const handleOffline = () => setOfflineStatus(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleStart = () => {
    if (session.vehicleId && session.routeId && session.turn) {
      setStep('oper');
    } else {
      alert('Por favor complete todos los campos de configuración.');
    }
  };

  const logAction = (type: 'SUBE' | 'BAJA') => {
    if (type === 'BAJA' && currentPassengers === 0) return;

    const newCount = type === 'SUBE' ? currentPassengers + 1 : currentPassengers - 1;
    setCurrentPassengers(newCount);

    const newLog: PassengerLog = {
      timestamp: Date.now(),
      type,
      passengersCount: newCount,
      location: { lat: 4.53, lng: -75.68 } // Mocked GPS
    };

    setSession(prev => ({
      ...prev,
      logs: [...(prev.logs || []), newLog]
    }));
  };

  const handleFinish = () => {
    setStep('closing');
  };

  const handleConfirmClose = () => {
    const route = ROUTES.find(r => r.id === session.routeId);
    const totalSube = session.logs?.filter(l => l.type === 'SUBE').length || 0;
    const finalSession: Session = {
      ...(session as Session),
      endTime: Date.now(),
      totalCollected: totalSube * (route?.basePrice || 0),
      isClosed: true
    };
    onSaveSession(finalSession);
    alert('Caja cerrada con éxito. Los datos se sincronizarán al detectar red 4G.');
    setStep('config');
    setSession({
        id: Math.random().toString(36).substr(2, 9),
        vehicleId: '',
        routeId: '',
        turn: '',
        logs: [],
        startTime: Date.now(),
        totalCollected: 0,
        isClosed: false
    });
    setCurrentPassengers(0);
  };

  if (step === 'config') {
    return (
      <div className="max-w-md mx-auto p-4 flex flex-col min-h-screen bg-white shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-blue-800 flex items-center gap-2">
            <Truck size={24} /> COOMOQUIN
          </h1>
          <div className={`px-2 py-1 rounded text-xs font-bold ${offlineStatus ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
            {offlineStatus ? 'OFFLINE' : 'ONLINE 4G'}
          </div>
        </div>

        <div className="space-y-6 flex-grow">
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-2">Vehículo (Placa)</label>
            <select 
              className="w-full p-4 border-2 border-slate-200 rounded-xl bg-slate-50 focus:border-blue-500 outline-none text-lg"
              value={session.vehicleId}
              onChange={e => setSession({...session, vehicleId: e.target.value})}
            >
              <option value="">Seleccione placa...</option>
              {VEHICLES.map(v => <option key={v.id} value={v.id}>{v.plate} - {v.model}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-2">Ruta de Viaje</label>
            <select 
              className="w-full p-4 border-2 border-slate-200 rounded-xl bg-slate-50 focus:border-blue-500 outline-none text-lg"
              value={session.routeId}
              onChange={e => setSession({...session, routeId: e.target.value})}
            >
              <option value="">Seleccione ruta...</option>
              {ROUTES.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-2">Turno Actual</label>
            <select 
              className="w-full p-4 border-2 border-slate-200 rounded-xl bg-slate-50 focus:border-blue-500 outline-none text-lg"
              value={session.turn}
              onChange={e => setSession({...session, turn: e.target.value})}
            >
              <option value="">Seleccione turno...</option>
              {TURNS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <button 
          onClick={handleStart}
          className="w-full py-5 bg-blue-600 text-white font-bold text-xl rounded-2xl shadow-lg active:scale-95 transition-transform"
        >
          INICIAR TURNO
        </button>
      </div>
    );
  }

  if (step === 'oper') {
    const currentRoute = ROUTES.find(r => r.id === session.routeId);
    return (
      <div className="max-w-md mx-auto h-screen flex flex-col bg-slate-900 text-white overflow-hidden">
        <div className="p-4 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
            <div>
                <p className="text-xs text-blue-400 font-bold uppercase tracking-widest">{currentRoute?.name}</p>
                <p className="text-sm opacity-70 flex items-center gap-1"><MapPin size={12}/> Armenia Central</p>
            </div>
            <button onClick={handleFinish} className="px-3 py-1 bg-red-600 rounded-lg text-xs font-bold">CERRAR</button>
        </div>

        <div className="flex-grow flex flex-col items-center justify-center py-10">
          <p className="text-slate-400 uppercase font-bold tracking-[0.2em] mb-2">Pasajeros a Bordo</p>
          <div className="text-9xl font-impact tracking-tighter text-blue-500 animate-pulse">
            {currentPassengers}
          </div>
          <div className="mt-8 flex gap-2 items-center text-slate-500">
            <Clock size={16}/> {new Date().toLocaleTimeString()}
          </div>
        </div>

        <div className="p-4 grid grid-cols-2 gap-4 pb-12">
          <button 
            onClick={() => logAction('SUBE')}
            className="h-48 bg-green-500 rounded-3xl flex flex-col items-center justify-center gap-2 active:bg-green-600 shadow-xl shadow-green-900/20 active:scale-95 transition-all"
          >
            <Plus size={48} strokeWidth={3}/>
            <span className="font-bold text-xl">SUBE</span>
          </button>
          <button 
            onClick={() => logAction('BAJA')}
            className="h-48 bg-red-500 rounded-3xl flex flex-col items-center justify-center gap-2 active:bg-red-600 shadow-xl shadow-red-900/20 active:scale-95 transition-all"
          >
            <Minus size={48} strokeWidth={3}/>
            <span className="font-bold text-xl">BAJA</span>
          </button>
        </div>
      </div>
    );
  }

  const route = ROUTES.find(r => r.id === session.routeId);
  const totalSube = session.logs?.filter(l => l.type === 'SUBE').length || 0;
  const estimatedCollection = totalSube * (route?.basePrice || 0);

  return (
    <div className="max-w-md mx-auto p-6 bg-white min-h-screen flex flex-col">
      <h2 className="text-2xl font-bold mb-6 text-center text-slate-800">Resumen de Cierre</h2>
      
      <div className="bg-slate-50 rounded-2xl p-6 space-y-4 mb-8">
        <div className="flex justify-between items-center border-b pb-2">
          <span className="text-slate-500 font-medium">Pasajeros totales</span>
          <span className="text-xl font-bold text-slate-800">{totalSube}</span>
        </div>
        <div className="flex justify-between items-center border-b pb-2">
          <span className="text-slate-500 font-medium">Recaudo Estimado</span>
          <span className="text-xl font-bold text-green-600">${estimatedCollection.toLocaleString()} COP</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-500 font-medium">Duración Ruta</span>
          <span className="text-slate-800 font-bold">
            {Math.floor((Date.now() - (session.startTime || 0)) / 60000)} min
          </span>
        </div>
      </div>

      <div className="flex-grow">
          <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 flex gap-3 text-sm text-yellow-800">
            <AlertTriangle className="flex-shrink-0" size={20}/>
            <p>Al confirmar, se enviará la geolocalización del punto de cierre a la central de despacho.</p>
          </div>
      </div>

      <button 
        onClick={handleConfirmClose}
        className="w-full py-5 bg-green-600 text-white font-bold text-xl rounded-2xl flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-transform"
      >
        <CheckCircle size={24}/> CONFIRMAR CIERRE
      </button>
    </div>
  );
};

export default ConductorView;
