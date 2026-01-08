
import React, { useState, useEffect } from 'react';
import { Session, GeoFenceAlert } from '../types';
import { ROUTES, VEHICLES } from '../constants';
import { getInsights } from '../services/geminiService';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area 
} from 'recharts';
import { MapPin, AlertCircle, TrendingUp, Users, DollarSign, BrainCircuit, Loader2 } from 'lucide-react';

interface Props {
  sessions: Session[];
}

const ALERTS_MOCK: GeoFenceAlert[] = [
  { id: '1', vehiclePlate: 'SQK-456', type: 'DESVIO', severity: 'high', timestamp: Date.now() - 1000 * 60 * 15, location: 'Vereda El Agrado, Pijao' },
  { id: '2', vehiclePlate: 'UVM-123', type: 'PARADA_NO_AUTORIZADA', severity: 'medium', timestamp: Date.now() - 1000 * 60 * 45, location: 'Sector La Línea' },
];

const AdminView: React.FC<Props> = ({ sessions }) => {
  const [insight, setInsight] = useState<string>('');
  const [loadingInsight, setLoadingInsight] = useState(false);

  const fetchAIInsights = async () => {
    setLoadingInsight(true);
    const result = await getInsights(sessions);
    setInsight(result || '');
    setLoadingInsight(false);
  };

  // Data formatting for charts
  const routeData = ROUTES.map(r => {
    const routeSessions = sessions.filter(s => s.routeId === r.id);
    const totalPas = routeSessions.reduce((acc, s) => acc + (s.logs?.filter(l => l.type === 'SUBE').length || 0), 0);
    return { name: r.name.split('↔')[1].trim(), pasajeros: totalPas };
  });

  const totalRecaudo = sessions.reduce((acc, s) => acc + s.totalCollected, 0);
  const totalPasajeros = sessions.reduce((acc, s) => acc + (s.logs?.filter(l => l.type === 'SUBE').length || 0), 0);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Torre de Control COOMOQUIN</h1>
          <p className="text-slate-500">Monitoreo en tiempo real - Armenia, Quindío</p>
        </div>
        <button 
          onClick={fetchAIInsights}
          disabled={loadingInsight}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all"
        >
          {loadingInsight ? <Loader2 className="animate-spin" size={20}/> : <BrainCircuit size={20}/>}
          GENERAR INSIGHTS AI
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><Users size={24}/></div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Pasajeros Hoy</p>
            <p className="text-2xl font-bold text-slate-900">{totalPasajeros}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-xl"><DollarSign size={24}/></div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Recaudo Estimado</p>
            <p className="text-2xl font-bold text-slate-900">${totalRecaudo.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-xl"><TrendingUp size={24}/></div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Ocupación Prom.</p>
            <p className="text-2xl font-bold text-slate-900">78%</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-orange-100 text-orange-600 rounded-xl"><MapPin size={24}/></div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Rutas Activas</p>
            <p className="text-2xl font-bold text-slate-900">{sessions.filter(s => !s.isClosed).length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Charts Section */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold mb-6 text-slate-800">Flujo de Pasajeros por Ruta</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={routeData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="pasajeros" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
             <h3 className="text-lg font-bold mb-6 text-slate-800">Distribución Horaria (Picos)</h3>
             <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[
                  {h: '05:00', v: 40}, {h: '07:00', v: 120}, {h: '09:00', v: 80},
                  {h: '11:00', v: 60}, {h: '13:00', v: 110}, {h: '15:00', v: 90},
                  {h: '17:00', v: 150}, {h: '19:00', v: 70}
                ]}>
                  <defs>
                    <linearGradient id="colorV" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#818cf8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip />
                  <Area type="monotone" dataKey="v" stroke="#4f46e5" fillOpacity={1} fill="url(#colorV)" />
                </AreaChart>
              </ResponsiveContainer>
             </div>
          </div>
        </div>

        {/* Side Panel: Alerts & AI */}
        <div className="space-y-8">
          {/* AI Insights Display */}
          {insight && (
            <div className="bg-indigo-900 text-white p-6 rounded-2xl shadow-xl overflow-y-auto max-h-[300px]">
              <div className="flex items-center gap-2 mb-4">
                <BrainCircuit className="text-indigo-300"/>
                <h3 className="font-bold">Análisis Gemini AI</h3>
              </div>
              <div className="prose prose-invert prose-sm text-indigo-100">
                 {insight.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                 ))}
              </div>
            </div>
          )}

          {/* Real-time Alerts */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <AlertCircle className="text-red-500" size={20}/> Alertas de Geocerca
            </h3>
            <div className="space-y-4">
              {ALERTS_MOCK.map(alert => (
                <div key={alert.id} className="p-4 rounded-xl bg-slate-50 border-l-4 border-red-500">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-sm text-slate-800">{alert.vehiclePlate}</span>
                    <span className="text-[10px] uppercase font-bold text-red-500">{alert.type}</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-2">{alert.location}</p>
                  <p className="text-[10px] text-slate-400 font-medium">{new Date(alert.timestamp).toLocaleTimeString()}</p>
                </div>
              ))}
              {sessions.filter(s => !s.isClosed).length > 0 && (
                 <div className="p-4 rounded-xl bg-green-50 border-l-4 border-green-500">
                    <p className="text-xs text-green-700 font-bold">Flota operativa sin incidentes críticos en curso.</p>
                 </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminView;
