'use client';

import React, { useState, useEffect } from 'react';
import { Users, Mail, Phone, Calendar, Trash2, CheckCircle, Circle, Eye, X, Globe, DollarSign, Archive } from 'lucide-react';

interface Lead {
  id: string;
  tipo: string;
  productos: string | null;
  mercado: string | null;
  volumen: string | null;
  nombre: string;
  empresa: string | null;
  email: string;
  whatsapp: string | null;
  comentarios: string | null;
  createdAt: string;
  leido: boolean;
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/leads');
      const data = await res.json();
      setLeads(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleToggleLeido = async (lead: Lead) => {
    try {
      const res = await fetch(`/api/admin/leads/${lead.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leido: !lead.leido }),
      });

      if (res.ok) {
        // Update local list
        setLeads(leads.map(l => l.id === lead.id ? { ...l, leido: !lead.leido } : l));
        // Update selected if open
        if (selectedLead && selectedLead.id === lead.id) {
          setSelectedLead({ ...selectedLead, leido: !lead.leido });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este lead del pipeline?')) return;

    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setLeads(leads.filter(l => l.id !== id));
        if (selectedLead && selectedLead.id === id) {
          setSelectedLead(null);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Helper to parse JSON arrays safely
  const parseJsonArray = (str: string | null) => {
    if (!str) return [];
    try {
      // If it looks like a JSON array, parse it
      if (str.startsWith('[')) {
        return JSON.parse(str);
      }
      return [str];
    } catch {
      return [str];
    }
  };

  return (
    <div className="p-6 max-w-6xl w-full mx-auto flex flex-col md:flex-row gap-6">
      
      {/* Leads List (Left Pane) */}
      <div className="flex-1">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Users className="w-8 h-8 text-[#4DB26B]" />
            Bandeja de Leads
          </h1>
          <p className="text-gray-500 text-sm mt-1">Monitorea y atiende las consultas comerciales recibidas desde el Lead Pipeline.</p>
        </div>

        {loading ? (
          <div className="py-12 text-center text-gray-400 text-sm">Cargando leads...</div>
        ) : leads.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-gray-200 rounded-lg p-16 text-center">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-gray-600 font-semibold text-lg mb-2">No hay leads registrados</h3>
            <p className="text-gray-400 text-sm">Las solicitudes del Lead Pipeline aparecerán aquí.</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Leído</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Contacto / Empresa</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Fecha</th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Detalle</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leads.map((lead) => (
                  <tr key={lead.id} className={lead.leido ? 'opacity-70' : 'font-semibold bg-gray-50/20'}>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggleLeido(lead)}
                        className="focus:outline-none"
                      >
                        {lead.leido ? (
                          <CheckCircle className="w-5 h-5 text-gray-400" />
                        ) : (
                          <Circle className="w-5 h-5 text-brand-green fill-brand-green/20" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="text-gray-800 block">{lead.nombre}</span>
                      <span className="text-gray-400 text-xs block">{lead.empresa || 'Individual'}</span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-green/10 text-brand-green">
                        {lead.tipo}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="text-brand-green hover:text-brand-green/80 hover:bg-brand-green/5 p-1.5 rounded transition-colors inline-flex items-center gap-1 text-xs"
                      >
                        <Eye className="w-4 h-4" />
                        Ver
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Side Panel / Drawer */}
      {selectedLead && (
        <div className="w-full md:w-[350px] bg-white border border-gray-200 rounded-lg p-6 shadow-lg shrink-0 h-fit sticky top-6">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-800">Detalles del Lead</h2>
            <button onClick={() => setSelectedLead(null)} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-5 text-sm font-body">
            
            {/* Action buttons */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => handleToggleLeido(selectedLead)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded text-xs font-semibold border transition-all ${
                  selectedLead.leido
                    ? 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                    : 'border-brand-green bg-brand-green text-white hover:bg-brand-green/95'
                }`}
              >
                {selectedLead.leido ? 'Marcar como pendiente' : 'Marcar como leído'}
              </button>
              <button
                onClick={() => handleDelete(selectedLead.id)}
                className="p-2 border border-red-200 text-red-500 hover:bg-red-50 rounded"
                title="Eliminar"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div>
              <span className="text-xs text-gray-400 uppercase font-bold block mb-1">Nombre</span>
              <span className="font-semibold text-gray-800 text-base">{selectedLead.nombre}</span>
            </div>

            <div>
              <span className="text-xs text-gray-400 uppercase font-bold block mb-1">Empresa</span>
              <span className="text-gray-700">{selectedLead.empresa || 'N/A'}</span>
            </div>

            <div>
              <span className="text-xs text-gray-400 uppercase font-bold block mb-1">Correo Electrónico</span>
              <a href={`mailto:${selectedLead.email}`} className="text-brand-green font-medium hover:underline flex items-center gap-1.5 mt-0.5">
                <Mail className="w-4 h-4" />
                {selectedLead.email}
              </a>
            </div>

            {selectedLead.whatsapp && (
              <div>
                <span className="text-xs text-gray-400 uppercase font-bold block mb-1">WhatsApp / Teléfono</span>
                <a href={`tel:${selectedLead.whatsapp}`} className="text-brand-green font-medium hover:underline flex items-center gap-1.5 mt-0.5">
                  <Phone className="w-4 h-4" />
                  {selectedLead.whatsapp}
                </a>
              </div>
            )}

            <div>
              <span className="text-xs text-gray-400 uppercase font-bold block mb-1">Tipo de Solicitud</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-green/10 text-brand-green inline-block mt-0.5">
                {selectedLead.tipo}
              </span>
            </div>

            {/* Conditional products view */}
            {selectedLead.productos && parseJsonArray(selectedLead.productos).length > 0 && (
              <div>
                <span className="text-xs text-gray-400 uppercase font-bold block mb-1.5">Productos / Servicios</span>
                <div className="flex flex-wrap gap-1.5">
                  {parseJsonArray(selectedLead.productos).map((p: string, idx: number) => (
                    <span key={idx} className="bg-gray-100 border border-gray-200 text-gray-600 px-2 py-0.5 rounded text-xs font-medium">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Conditional markets view */}
            {selectedLead.mercado && parseJsonArray(selectedLead.mercado).length > 0 && (
              <div>
                <span className="text-xs text-gray-400 uppercase font-bold block mb-1.5">Mercado / Canal</span>
                <div className="flex flex-wrap gap-1.5">
                  {parseJsonArray(selectedLead.mercado).map((m: string, idx: number) => (
                    <span key={idx} className="bg-blue-50 border border-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Conditional volume view */}
            {selectedLead.volumen && (
              <div>
                <span className="text-xs text-gray-400 uppercase font-bold block mb-1">Volumen Requerido</span>
                <span className="text-gray-700 bg-emerald-50 border border-emerald-100 text-emerald-700 px-2.5 py-1 rounded text-xs font-bold inline-flex items-center gap-1 mt-0.5">
                  <DollarSign className="w-3.5 h-3.5" />
                  {selectedLead.volumen}
                </span>
              </div>
            )}

            {selectedLead.comentarios && (
              <div className="pt-4 border-t border-gray-100">
                <span className="text-xs text-gray-400 uppercase font-bold block mb-1.5">Comentarios adicionales</span>
                <p className="p-3 bg-gray-50 border border-gray-200 rounded text-xs text-gray-600 leading-relaxed max-h-[150px] overflow-y-auto">
                  {selectedLead.comentarios}
                </p>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
