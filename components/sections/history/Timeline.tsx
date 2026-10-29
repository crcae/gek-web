'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { createPortal } from 'react-dom';
import {
  Settings,
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  Calendar,
  Sparkles,
  Layers,
} from 'lucide-react';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { VisualEditable } from '@/components/admin/VisualEditable';
import { ImageSelectorField } from '@/components/admin/ImageSelectorField';
import { cleanImageUrl } from '@/lib/cleanImageUrl';

export interface Hito {
  id: string;
  anio: string;
  titulo: string;
  desc: string;
  imagen: string;
  generacion: string;
}

interface TimelineProps {
  hitos: Hito[];
  titulo: string;
}

export function Timeline({ hitos, titulo }: TimelineProps) {
  const { data: session } = useSession();
  const isAdmin = !!session;
  const router = useRouter();

  const [items, setItems] = useState<Hito[]>(hitos);
  const [activeGen, setActiveGen] = useState<string>('1');
  const [mounted, setMounted] = useState(false);

  // Modal State for adding/editing a block
  const [modalOpen, setModalOpen] = useState(false);
  const [editingHito, setEditingHito] = useState<Hito | null>(null);
  const [saving, setSaving] = useState(false);
  const [activeLangTab, setActiveLangTab] = useState<'es' | 'en' | 'de'>('es');
  const [deleteConfirmHito, setDeleteConfirmHito] = useState<Hito | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State
  const [form, setForm] = useState({
    generacion: '1',
    anio: '',
    titulo_es: '',
    titulo_en: '',
    titulo_de: '',
    desc_es: '',
    desc_en: '',
    desc_de: '',
    imagen: '',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setItems(hitos);
  }, [hitos]);

  // Filter hitos by generation
  const hitosGen1 = items.filter((h) => h.generacion === '1');
  const hitosGen2 = items.filter((h) => h.generacion === '2');
  const hitosGen3 = items.filter((h) => h.generacion === '3' || h.generacion === 'futuro');

  // Handle scroll tracking to highlight active generation and vertical text
  useEffect(() => {
    const handleScroll = () => {
      const b1 = document.getElementById('gen-block-1');
      const b2 = document.getElementById('gen-block-2');
      const b3 = document.getElementById('gen-block-3');
      if (!b1 || !b2 || !b3) return;

      const rect1 = b1.getBoundingClientRect();
      const rect2 = b2.getBoundingClientRect();
      const rect3 = b3.getBoundingClientRect();

      const midpoint = window.innerHeight * 0.45;

      if (rect3.top <= midpoint) {
        setActiveGen('3');
      } else if (rect2.top <= midpoint) {
        setActiveGen('2');
      } else {
        setActiveGen('1');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const openAddModal = (defaultGen: string = '1') => {
    setEditingHito(null);
    setForm({
      generacion: defaultGen,
      anio: '',
      titulo_es: '',
      titulo_en: '',
      titulo_de: '',
      desc_es: '',
      desc_en: '',
      desc_de: '',
      imagen: '',
    });
    setActiveLangTab('es');
    setModalOpen(true);
  };

  const openEditModal = (hito: Hito) => {
    setEditingHito(hito);
    setForm({
      generacion: hito.generacion || '1',
      anio: hito.anio || '',
      titulo_es: hito.titulo || '',
      titulo_en: '',
      titulo_de: '',
      desc_es: hito.desc || '',
      desc_en: '',
      desc_de: '',
      imagen: hito.imagen || '',
    });
    setActiveLangTab('es');
    setModalOpen(true);
  };

  const handleSaveHito = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.anio.trim() || !form.titulo_es.trim()) {
      alert('Por favor completa al menos el Año y el Título en Español.');
      return;
    }

    setSaving(true);
    try {
      const url = editingHito
        ? `/api/admin/timeline/${editingHito.id}`
        : '/api/admin/timeline';
      const method = editingHito ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          imagen: cleanImageUrl(form.imagen),
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Error al guardar el hito');
      }

      if (editingHito) {
        setItems((prev) =>
          prev.map((h) =>
            h.id === editingHito.id
              ? {
                  ...h,
                  generacion: form.generacion,
                  anio: form.anio,
                  titulo: form.titulo_es,
                  desc: form.desc_es,
                  imagen: cleanImageUrl(form.imagen),
                }
              : h
          )
        );
      } else {
        const data = await res.json();
        if (data.hito) {
          setItems((prev) => [...prev, data.hito]);
        }
      }

      setModalOpen(false);
      setEditingHito(null);
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Error al guardar el hito');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteHito = async () => {
    if (!deleteConfirmHito) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/timeline/${deleteConfirmHito.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Error al eliminar');
      }

      setItems((prev) => prev.filter((item) => item.id !== deleteConfirmHito.id));
      setDeleteConfirmHito(null);
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Error al eliminar');
    } finally {
      setIsDeleting(false);
    }
  };

  const renderHitoCard = (hito: Hito, index: number) => {
    const animation = 'slide-left';
    const isFuture = hito.generacion === 'futuro';

    return (
      <div key={hito.id} className="relative flex flex-col md:flex-row items-center mb-16 md:mb-24 last:mb-0 group/card">
        {/* Left Side (Content) */}
        <div className="w-full md:w-[90%] md:pr-12 order-2 md:order-1 text-left">
          <AnimatedSection animation={animation}>
            <div className="relative bg-white/95 backdrop-blur p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100 hover:border-brand-green/30 transition-all duration-300 group hover:-translate-y-1 text-left flex flex-col items-start">
              
              {/* Admin Actions (Edit & Delete) */}
              {isAdmin && (
                <div className="absolute top-4 right-4 z-20 flex items-center gap-1 opacity-80 group-hover/card:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => openEditModal(hito)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-brand-navy hover:bg-gray-100 border border-transparent hover:border-gray-200 transition-all cursor-pointer"
                    title="Editar hito completo"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmHito(hito)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all cursor-pointer"
                    title="Eliminar este hito de la línea del tiempo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}

              <VisualEditable id={`timeline.${hito.id}.anio`} label={`Hito ${hito.id.replace('hito', '')} - Año`}>
                <span className="inline-block bg-brand-green/10 text-brand-green font-bold text-xs px-2.5 py-1 rounded-full mb-3 uppercase tracking-wider">
                  {hito.anio}
                </span>
              </VisualEditable>
              <VisualEditable id={`timeline.${hito.id}.titulo`} label={`Hito ${hito.id.replace('hito', '')} - Título`}>
                <h4 className="font-display text-lg md:text-xl font-bold text-brand-navy mb-3 group-hover:text-brand-green transition-colors pr-8">
                  {hito.titulo}
                </h4>
              </VisualEditable>
              {hito.desc && (
                <VisualEditable id={`timeline.${hito.id}.desc`} label={`Hito ${hito.id.replace('hito', '')} - Descripción`}>
                  <p className="font-body text-brand-navy/70 text-sm leading-relaxed mb-4">
                    {hito.desc}
                  </p>
                </VisualEditable>
              )}
              {hito.imagen ? (
                <div className="relative w-full aspect-[16/10] max-w-sm rounded-lg overflow-hidden border border-gray-100 mt-2 shadow-sm">
                  <Image
                    src={hito.imagen}
                    alt={hito.titulo}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 300px"
                  />
                  {isAdmin && (
                    <div className="absolute top-2 right-2 z-35">
                      <VisualEditable id={`timeline.${hito.id}.imagen`} label={`Hito ${hito.id.replace('hito', '')} - Imagen`} type="image">
                        <button
                          type="button"
                          className="bg-brand-navy/90 hover:bg-brand-green text-white text-[9px] p-1.5 rounded-full shadow border border-brand-green/30 flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Settings className="w-3.5 h-3.5" />
                        </button>
                      </VisualEditable>
                    </div>
                  )}
                </div>
              ) : (
                isAdmin && (
                  <div className="mt-2">
                    <VisualEditable id={`timeline.${hito.id}.imagen`} label={`Hito ${hito.id.replace('hito', '')} - Imagen`} type="image">
                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 text-xs text-brand-navy/70 hover:text-brand-green font-medium px-3 py-1.5 rounded-lg border border-dashed border-gray-300 hover:border-brand-green bg-gray-50/50 hover:bg-brand-green/5 transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" /> Agregar foto a este hito
                      </button>
                    </VisualEditable>
                  </div>
                )
              )}
            </div>
          </AnimatedSection>
        </div>

        {/* Right Side Timeline marker */}
        <div className="absolute right-4 md:left-[90%] md:-translate-x-1/2 top-0 bottom-0 flex flex-col items-center z-10">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-4 border-white shadow-lg transition-all duration-300 ${
            isFuture ? 'bg-brand-green animate-bounce' : 'bg-brand-navy hover:scale-110'
          }`}>
            <div className="w-2.5 h-2.5 rounded-full bg-white" />
          </div>
          {/* Internal decade/year tag */}
          <span className="mt-2 text-[10px] font-bold text-gray-400 bg-white px-2 py-0.5 rounded shadow-sm border border-gray-100 uppercase tracking-widest md:hidden">
            {hito.anio}
          </span>
        </div>
      </div>
    );
  };

  return (
    <section id="linea-tiempo" className="relative w-full bg-gradient-to-b from-white via-[#0E202C]/65 to-[#0D1B24] py-24 px-4 sm:px-6 overflow-x-clip min-h-screen">
      
      {/* Decorative Spheres in Background */}
      <div className="absolute top-[10%] left-[5%] w-72 h-72 rounded-full bg-brand-green/5 blur-3xl pointer-events-none" />
      <div className="absolute top-[25%] right-[8%] w-96 h-96 rounded-full bg-brand-navy/5 blur-3xl pointer-events-none" />
      <div className="absolute top-[50%] left-[10%] w-80 h-80 rounded-full bg-blue-400/5 blur-3xl pointer-events-none" />
      <div className="absolute top-[70%] right-[5%] w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[15%] left-[8%] w-80 h-80 rounded-full bg-brand-green/10 blur-3xl pointer-events-none" />

      {/* Modern Background Dot Grid Pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#8da294_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_100%)]"
      />

      <div className="absolute top-[18%] left-[-150px] w-[500px] h-[500px] rounded-full border border-brand-navy/5 pointer-events-none z-0" />
      <div className="absolute top-[42%] right-[-200px] w-[600px] h-[600px] rounded-full border border-brand-green/10 pointer-events-none z-0" />
      <div className="absolute bottom-[28%] left-[-100px] w-[450px] h-[450px] rounded-full border border-white/5 pointer-events-none z-0 animate-pulse duration-[10000ms]" />
      <div className="absolute bottom-[8%] right-[-50px] w-[350px] h-[350px] rounded-full border border-white/5 pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Column 1 (Left): Sticky Generation Title on Desktop - Horizontal */}
        <div className={`hidden lg:flex lg:col-span-2 lg:sticky lg:top-28 flex-col items-start select-none transition-colors duration-500 ${activeGen === '1' ? 'text-brand-navy' : 'text-white'}`}>
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes numSlideIn {
              0% { opacity: 0; transform: translateY(-10px); }
              100% { opacity: 1; transform: translateY(0); }
            }
            .animate-num-slide {
              animation: numSlideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
          `}} />
          {/* Horizontal Text "1ª Generación" */}
          <div className="flex flex-col items-start font-display font-black tracking-wider transition-colors duration-500">
            <span key={activeGen} className="text-6xl animate-num-slide leading-none mb-2">
              {activeGen}ª
            </span>
            <span className="text-xl uppercase tracking-widest">Generación</span>
          </div>
        </div>

        {/* Column 2 (Center): Timeline Track Column */}
        <div className="w-full lg:col-span-7 order-2 lg:order-none">
          
          <div className="text-center lg:text-left mb-16">
            <AnimatedSection animation="fade-up">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <VisualEditable id="timeline.titulo" label="Título de Línea de Tiempo">
                  <h2 className="font-display text-3xl md:text-5xl font-bold text-[#2C3E4B] mb-4">
                    {titulo}
                  </h2>
                </VisualEditable>

                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => openAddModal('1')}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-brand-green hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold shadow-lg hover:shadow-xl transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Agregar hito</span>
                  </button>
                )}
              </div>
            </AnimatedSection>
            <div className="w-[60px] h-[3px] bg-brand-green mx-auto lg:mx-0" />
          </div>

          <div className="relative pl-4 md:pl-0">
            {/* The vertical timeline track line */}
            <div className="absolute right-4 md:left-[90%] top-4 bottom-12 w-[3px] -translate-x-[1.5px] bg-gradient-to-b from-brand-green via-brand-navy/40 to-brand-green rounded-full pointer-events-none" />

            {/* BLOCK 1: Primera Generación */}
            <div id="gen-block-1" data-gen="1" className="mb-20 scroll-mt-24">
              <div className="flex items-center gap-3 mb-10 justify-start md:justify-center">
                <span className="px-4 py-1.5 rounded-full bg-brand-navy text-white text-xs font-bold uppercase tracking-widest shadow-md">
                  Primera Generación
                </span>
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => openAddModal('1')}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/90 hover:bg-brand-green text-brand-navy hover:text-white rounded-full text-xs font-semibold shadow border border-gray-200 hover:border-brand-green transition-all"
                    title="Agregar hito a la 1ª Generación"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agregar hito</span>
                  </button>
                )}
              </div>
              <div className="space-y-4">
                {hitosGen1.map((hito, idx) => renderHitoCard(hito, idx))}
              </div>
            </div>

            {/* BLOCK 2: Segunda Generación */}
            <div id="gen-block-2" data-gen="2" className="mb-20 scroll-mt-24">
              <div className="flex items-center gap-3 mb-10 justify-start md:justify-center">
                <span className="px-4 py-1.5 rounded-full bg-brand-navy text-white text-xs font-bold uppercase tracking-widest shadow-md">
                  Segunda Generación
                </span>
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => openAddModal('2')}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/90 hover:bg-brand-green text-brand-navy hover:text-white rounded-full text-xs font-semibold shadow border border-gray-200 hover:border-brand-green transition-all"
                    title="Agregar hito a la 2ª Generación"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agregar hito</span>
                  </button>
                )}
              </div>
              <div className="space-y-4">
                {hitosGen2.map((hito, idx) => renderHitoCard(hito, idx))}
              </div>
            </div>

            {/* BLOCK 3: Tercera Generación */}
            <div id="gen-block-3" data-gen="3" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-10 justify-start md:justify-center">
                <span className="px-4 py-1.5 rounded-full bg-brand-navy text-white text-xs font-bold uppercase tracking-widest shadow-md">
                  Tercera Generación
                </span>
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => openAddModal('3')}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/90 hover:bg-brand-green text-brand-navy hover:text-white rounded-full text-xs font-semibold shadow border border-gray-200 hover:border-brand-green transition-all"
                    title="Agregar hito a la 3ª Generación"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agregar hito</span>
                  </button>
                )}
              </div>
              <div className="space-y-4">
                {hitosGen3.map((hito, idx) => renderHitoCard(hito, idx))}
              </div>
            </div>

          </div>

        </div>

        {/* Column 3 (Right): Sticky Navigation Navigator on Desktop */}
        <div className="w-full lg:col-span-3 lg:sticky lg:top-28 self-start z-20 mb-8 lg:mb-0 flex flex-col gap-6 order-1 lg:order-none">
          <div className="bg-white/80 backdrop-blur p-4 rounded-xl shadow-lg border border-gray-100 flex flex-row lg:flex-col justify-around lg:justify-start gap-2">
            <h3 className="hidden lg:block font-display text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
              Navegación
            </h3>
            
            <button
              onClick={() => scrollToSection('gen-block-1')}
              className={`flex items-center gap-3 text-xs md:text-sm font-bold uppercase transition-all tracking-wider cursor-pointer ${
                activeGen === '1' ? 'text-brand-green border-b-2 lg:border-b-0 lg:border-l-2 border-brand-green pl-0 lg:pl-3 font-extrabold' : 'text-brand-navy/60 hover:text-brand-navy'
              }`}
            >
              <span>1ª Generación</span>
            </button>
            
            <button
              onClick={() => scrollToSection('gen-block-2')}
              className={`flex items-center gap-3 text-xs md:text-sm font-bold uppercase transition-all tracking-wider cursor-pointer ${
                activeGen === '2' ? 'text-brand-green border-b-2 lg:border-b-0 lg:border-l-2 border-brand-green pl-0 lg:pl-3 font-extrabold' : 'text-brand-navy/60 hover:text-brand-navy'
              }`}
            >
              <span>2ª Generación</span>
            </button>
            
            <button
              onClick={() => scrollToSection('gen-block-3')}
              className={`flex items-center gap-3 text-xs md:text-sm font-bold uppercase transition-all tracking-wider cursor-pointer ${
                activeGen === '3' ? 'text-brand-green border-b-2 lg:border-b-0 lg:border-l-2 border-brand-green pl-0 lg:pl-3 font-extrabold' : 'text-brand-navy/60 hover:text-brand-navy'
              }`}
            >
              <span>3ª Generación</span>
            </button>

            {isAdmin && (
              <div className="pt-3 border-t border-gray-100 hidden lg:block">
                <button
                  type="button"
                  onClick={() => openAddModal('1')}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-brand-navy text-white hover:bg-brand-green rounded-lg text-xs font-semibold transition-all shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Nuevo Hito</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Huge Corner Watermark at the bottom right */}
      <div className="absolute right-[-220px] bottom-[-220px] w-[650px] h-[650px] opacity-[0.06] pointer-events-none select-none z-0">
        <Image
          src="/images/iconos/icono.png"
          alt="GEC Isotipo Huge Watermark"
          fill
          className="object-contain"
        />
      </div>

      {/* MODAL: Agregar Hito a la Línea de Tiempo */}
      {mounted && modalOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/60">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-brand-green/10 text-brand-green rounded-lg">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    {editingHito ? 'Editar hito de la línea del tiempo' : 'Agregar hito a la línea del tiempo'}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {editingHito ? 'Modifica el año, contenidos o fotografía de este logro histórico' : 'Crea un nuevo bloque histórico en la generación correspondiente'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveHito} className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Generación */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Generación
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: '1', label: '1ª Generación' },
                    { id: '2', label: '2ª Generación' },
                    { id: '3', label: '3ª Generación' },
                    { id: 'futuro', label: 'Futuro' },
                  ].map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setForm({ ...form, generacion: g.id })}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                        form.generacion === g.id
                          ? 'bg-brand-navy text-white border-brand-navy shadow-sm'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-brand-navy/30'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Año */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Año o Periodo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. 1972, 1980 - 1985, 2024"
                  value={form.anio}
                  onChange={(e) => setForm({ ...form, anio: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green"
                />
              </div>

              {/* Idiomas Tabs */}
              <div>
                <div className="flex items-center justify-between border-b border-gray-200 pb-1 mb-3">
                  <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Contenido por Idioma
                  </label>
                  <div className="flex gap-1">
                    {(['es', 'en', 'de'] as const).map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => setActiveLangTab(lang)}
                        className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase transition-all ${
                          activeLangTab === lang
                            ? 'bg-brand-green text-white'
                            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                {activeLangTab === 'es' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Título (Español) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ej. Fundación de las primeras hectáreas"
                        value={form.titulo_es}
                        onChange={(e) => setForm({ ...form, titulo_es: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Descripción (Español)
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Descripción histórica de este logro..."
                        value={form.desc_es}
                        onChange={(e) => setForm({ ...form, desc_es: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green"
                      />
                    </div>
                  </div>
                )}

                {activeLangTab === 'en' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Title (English)
                      </label>
                      <input
                        type="text"
                        placeholder="Ej. Foundation of the first acres"
                        value={form.titulo_en}
                        onChange={(e) => setForm({ ...form, titulo_en: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Description (English)
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Historical milestone description..."
                        value={form.desc_en}
                        onChange={(e) => setForm({ ...form, desc_en: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green"
                      />
                    </div>
                  </div>
                )}

                {activeLangTab === 'de' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Titel (Deutsch)
                      </label>
                      <input
                        type="text"
                        placeholder="Ej. Gründung der ersten Hektar"
                        value={form.titulo_de}
                        onChange={(e) => setForm({ ...form, titulo_de: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Beschreibung (Deutsch)
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Historischer Meilenstein Beschreibung..."
                        value={form.desc_de}
                        onChange={(e) => setForm({ ...form, desc_de: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Imagen Selector */}
              <div>
                <ImageSelectorField
                  label="Fotografía del Hito (Opcional)"
                  valorActual={form.imagen}
                  onChange={(url) => setForm({ ...form, imagen: url })}
                />
              </div>

              {/* Footer Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-800 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-brand-green hover:bg-emerald-600 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <>
                      {editingHito ? (
                        <span>Guardar Cambios</span>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          <span>Agregar Hito</span>
                        </>
                      )}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* CONFIRM DELETE MODAL */}
      {mounted && deleteConfirmHito && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <div className="p-2 bg-red-100 rounded-xl">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-gray-900">
                Eliminar Hito
              </h3>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              ¿Estás seguro de que deseas eliminar el hito{' '}
              <strong className="text-gray-900 font-semibold">
                "{deleteConfirmHito.anio} - {deleteConfirmHito.titulo}"
              </strong>
              ? Esta acción no se puede deshacer.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmHito(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-800 rounded-xl hover:bg-gray-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDeleteHito}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 px-5 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Eliminando...</span>
                  </>
                ) : (
                  <span>Eliminar</span>
                )}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

    </section>
  );
}
