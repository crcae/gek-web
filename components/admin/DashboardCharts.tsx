'use client';

import { useState } from 'react';
import { 
  Users, 
  ArrowUpRight, 
  BarChart3, 
  PieChart as PieIcon,
  CheckCircle2,
  Clock
} from 'lucide-react';

export interface MonthlyPoint {
  mes: string;
  leads: number;
}

export interface CategoryPoint {
  label: string;
  count: number;
  porcentaje: number;
}

interface DashboardChartsProps {
  monthlyData: MonthlyPoint[];
  categories: CategoryPoint[];
  totalInteracciones: number;
  totalLeidos: number;
  totalNoLeidos: number;
}

export function DashboardCharts({ 
  monthlyData, 
  categories, 
  totalInteracciones, 
  totalLeidos, 
  totalNoLeidos 
}: DashboardChartsProps) {
  const [rango, setRango] = useState<'6m' | '12m'>('12m');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const displayData = rango === '6m' ? monthlyData.slice(6) : monthlyData;
  const maxLeads = Math.max(...displayData.map((d) => d.leads), 1);

  const tasaAtencion = totalInteracciones > 0 
    ? Math.round((totalLeidos / totalInteracciones) * 100) 
    : 100;

  const colores = [
    'bg-brand-green',
    'bg-brand-navy',
    'bg-[#1a5c3a]',
    'bg-amber-500',
    'bg-purple-500',
    'bg-blue-500',
  ];

  return (
    <div className="space-y-8">
      
      {/* Top Real Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Total Solicitudes Reales */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Solicitudes</span>
            <div className="w-8 h-8 rounded-lg bg-brand-navy/10 text-brand-navy flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-brand-navy font-display">{totalInteracciones}</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> En BD
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-2 font-medium">Leads y formularios de contacto</p>
        </div>

        {/* Card 2: Leads Atendidos */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Atendidos / Leídos</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-brand-green font-display">{totalLeidos}</span>
            <span className="text-xs font-semibold text-gray-500">contactados</span>
          </div>
          <p className="text-xs text-gray-500 mt-2 font-medium">{tasaAtencion}% tasa de revisión</p>
        </div>

        {/* Card 3: Pendientes por Atender */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Pendientes</span>
            <div className={`w-8 h-8 rounded-lg ${totalNoLeidos > 0 ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-400'} flex items-center justify-center`}>
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-black font-display ${totalNoLeidos > 0 ? 'text-red-500' : 'text-gray-700'}`}>
              {totalNoLeidos}
            </span>
            <span className="text-xs font-semibold text-gray-400">por revisar</span>
          </div>
          <p className="text-xs text-gray-500 mt-2 font-medium">Requieren atención en bandeja</p>
        </div>

        {/* Card 4: Categorías Activas */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Categorías de Interés</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <PieIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-brand-navy font-display">{categories.length}</span>
            <span className="text-xs font-semibold text-gray-500">tipos registrados</span>
          </div>
          <p className="text-xs text-gray-500 mt-2 font-medium">Segmentación de clientes en web</p>
        </div>

      </div>

      {/* Main Real Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Monthly Leads Graph (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <BarChart3 className="w-5 h-5 text-brand-green" />
                  <h3 className="font-display text-lg font-bold text-brand-navy">
                    Solicitudes y Leads Recibidos por Mes
                  </h3>
                </div>
                <p className="text-xs text-gray-500 font-medium">
                  Registro cronológico de mensajes y cotizaciones en el año en curso
                </p>
              </div>

              {/* Range Toggle */}
              <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg self-start sm:self-auto">
                <button
                  onClick={() => setRango('6m')}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                    rango === '6m'
                      ? 'bg-white text-brand-navy shadow-sm'
                      : 'text-gray-500 hover:text-brand-navy'
                  }`}
                >
                  6 Meses
                </button>
                <button
                  onClick={() => setRango('12m')}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                    rango === '12m'
                      ? 'bg-white text-brand-navy shadow-sm'
                      : 'text-gray-500 hover:text-brand-navy'
                  }`}
                >
                  Año Completo
                </button>
              </div>
            </div>

            {/* Real Interactive Bar Chart */}
            <div className="h-64 flex items-end gap-2 sm:gap-4 pt-6 pb-2 border-b border-gray-100 relative">
              {displayData.map((d, i) => {
                const heightPercent = d.leads > 0 
                  ? Math.max(Math.round((d.leads / maxLeads) * 100), 12) 
                  : 4;
                const isHovered = hoveredIdx === i;

                return (
                  <div
                    key={d.mes}
                    className="flex-1 flex flex-col items-center h-full justify-end group relative cursor-pointer"
                    onMouseEnter={() => setHoveredIdx(i)}
                    onMouseLeave={() => setHoveredIdx(null)}
                  >
                    {/* Tooltip */}
                    {isHovered && (
                      <div className="absolute -top-10 z-30 bg-brand-navy text-white text-[11px] font-bold py-1 px-2.5 rounded-lg shadow-xl whitespace-nowrap pointer-events-none animate-in fade-in zoom-in-95 duration-150">
                        <span className="text-brand-green">{d.mes}:</span> {d.leads} {d.leads === 1 ? 'solicitud' : 'solicitudes'}
                      </div>
                    )}

                    {/* Bar */}
                    <div className="w-full max-w-[36px] bg-gray-50 rounded-t-lg h-full flex items-end justify-center overflow-hidden p-0.5">
                      <div
                        className={`w-full rounded-t-md transition-all duration-500 ${
                          d.leads > 0
                            ? isHovered
                              ? 'bg-brand-navy'
                              : 'bg-gradient-to-t from-brand-green to-emerald-400 group-hover:bg-brand-green'
                            : 'bg-gray-200'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <span className={`text-[11px] font-bold mt-2 transition-colors ${
                      isHovered ? 'text-brand-green' : 'text-gray-400'
                    }`}>
                      {d.mes}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500 pt-4 mt-2">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-green" /> Solicitudes registradas
            </span>
            <span className="font-semibold text-brand-navy">Total en año: {displayData.reduce((acc, c) => acc + c.leads, 0)}</span>
          </div>
        </div>

        {/* Right: Real Category Breakdown (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <PieIcon className="w-5 h-5 text-brand-navy" />
              <h3 className="font-display text-lg font-bold text-brand-navy">
                Distribución de Consultas
              </h3>
            </div>
            <p className="text-xs text-gray-500 font-medium mb-6">
              Desglose real según los tipos de solicitudes recibidas
            </p>

            {/* Channels Bars */}
            {categories.length === 0 ? (
              <div className="py-12 text-center text-gray-400 text-xs">
                Aún no hay categorías registradas en la base de datos.
              </div>
            ) : (
              <div className="space-y-4">
                {categories.map((c, i) => (
                  <div key={c.label} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-gray-700 truncate max-w-[200px]" title={c.label}>
                        {c.label}
                      </span>
                      <span className="font-bold text-brand-navy font-mono">
                        {c.count} ({c.porcentaje}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${colores[i % colores.length]} transition-all duration-700 rounded-full`}
                        style={{ width: `${c.porcentaje}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-gray-100 mt-6 text-center">
            <p className="text-xs text-gray-400 font-medium">
              Datos 100% sincronizados con Supabase / PostgreSQL
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
