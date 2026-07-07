'use client';

import { useState } from 'react';
import Image from 'next/image';
import { premiumProducts, ProductSpec } from '@/data/holding/premiumProducts';
import { Ruler, Package, Truck, Globe, Calendar, Thermometer, ShieldAlert } from 'lucide-react';

interface ProductSpecsSelectorProps {
  locale: string;
}

export function ProductSpecsSelector({ locale }: ProductSpecsSelectorProps) {
  const [activeId, setActiveId] = useState<string>(premiumProducts[0].id);

  const activeProduct = premiumProducts.find((p) => p.id === activeId) || premiumProducts[0];

  const isEs = locale === 'es';
  const isDe = locale === 'de';

  const selectLabel = isEs 
    ? 'Selecciona un producto' 
    : isDe 
      ? 'Wählen Sie ein Produkt' 
      : 'Select a product';

  // Specification labels
  const labelTamano = isEs ? 'Tamaño / Calibre' : isDe ? 'Größe / Kaliber' : 'Size / Caliber';
  const labelEmpaque = isEs ? 'Empaque / Presentación' : isDe ? 'Verpackung' : 'Packaging';
  const labelPallet = isEs ? 'Configuración de Pallet' : isDe ? 'Palettenkonfiguration' : 'Pallet Layout';
  const labelOrigen = isEs ? 'Origen de Cosecha' : isDe ? 'Herkunft' : 'Origin';
  const labelVida = isEs ? 'Vida en Anaquel' : isDe ? 'Haltbarkeit' : 'Shelf Life';
  const labelTemp = isEs ? 'Temperatura de Conservación' : isDe ? 'Lagertemperatur' : 'Storage Temp';
  const labelPresentacion = isEs ? 'Presentaciones Disponibles' : isDe ? 'Verfügbare Formen' : 'Available Layouts';
  const labelDisponibilidad = isEs ? 'Disponibilidad Temporal' : isDe ? 'Verfügbarkeit' : 'Availability';

  return (
    <div className="w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      
      {/* Product tabs selector */}
      <div className="bg-brand-navy p-4 flex flex-wrap gap-2 justify-center border-b border-white/10">
        {premiumProducts.map((p) => {
          const isActive = p.id === activeId;
          const pName = locale === 'en' ? p.nombreEn : locale === 'de' ? p.nombreDe : p.nombre;
          return (
            <button
              key={p.id}
              onClick={() => setActiveId(p.id)}
              className={`px-6 py-2.5 rounded-full font-display text-xs md:text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                isActive
                  ? 'bg-brand-green text-brand-navy scale-105 shadow-md'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {pName}
            </button>
          );
        })}
      </div>

      {/* Spec details grid layout */}
      <div className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Product Image */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-md border border-gray-100 bg-gray-50">
            {activeProduct.imagen ? (
              <Image
                src={activeProduct.imagen}
                alt={activeProduct.nombre}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 400px"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-brand-navy/5">
                <ShieldAlert className="w-10 h-10 text-brand-navy/20 mb-2" />
                <span className="text-xs text-brand-navy/40 font-bold uppercase tracking-wider">
                  {isEs ? 'Imagen en actualización' : 'Image being updated'}
                </span>
              </div>
            )}
          </div>
          <span className="text-xs text-gray-400 font-body mt-3 italic">
            {isEs ? '*Imagen representativa para empaque y selección' : '*Representative image for packaging & sorting'}
          </span>
        </div>

        {/* Right Column: Spec list */}
        <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Spec Item 1: Tamaño */}
          <div className="flex gap-3 items-start p-4 bg-brand-white rounded-lg border border-brand-gray/10">
            <Ruler className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
            <div>
              <span className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                {labelTamano}
              </span>
              <span className="block font-body text-sm font-bold text-brand-navy mt-1">
                {locale === 'en' ? activeProduct.tamanoEn : locale === 'de' ? activeProduct.tamanoDe : activeProduct.tamano}
              </span>
            </div>
          </div>

          {/* Spec Item 2: Empaque */}
          <div className="flex gap-3 items-start p-4 bg-brand-white rounded-lg border border-brand-gray/10">
            <Package className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
            <div>
              <span className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                {labelEmpaque}
              </span>
              <span className="block font-body text-sm font-bold text-brand-navy mt-1">
                {locale === 'en' ? activeProduct.empaqueEn : locale === 'de' ? activeProduct.empaqueDe : activeProduct.empaque}
              </span>
            </div>
          </div>

          {/* Spec Item 3: Pallet */}
          <div className="flex gap-3 items-start p-4 bg-brand-white rounded-lg border border-brand-gray/10">
            <Truck className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
            <div>
              <span className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                {labelPallet}
              </span>
              <span className="block font-body text-sm font-bold text-brand-navy mt-1">
                {locale === 'en' ? activeProduct.palletEn : locale === 'de' ? activeProduct.palletDe : activeProduct.pallet}
              </span>
            </div>
          </div>

          {/* Spec Item 4: Origen */}
          <div className="flex gap-3 items-start p-4 bg-brand-white rounded-lg border border-brand-gray/10">
            <Globe className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
            <div>
              <span className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                {labelOrigen}
              </span>
              <span className="block font-body text-sm font-bold text-brand-navy mt-1">
                {locale === 'en' ? activeProduct.origenEn : locale === 'de' ? activeProduct.origenDe : activeProduct.origen}
              </span>
            </div>
          </div>

          {/* Spec Item 5: Vida */}
          <div className="flex gap-3 items-start p-4 bg-brand-white rounded-lg border border-brand-gray/10">
            <Calendar className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
            <div>
              <span className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                {labelVida}
              </span>
              <span className="block font-body text-sm font-bold text-brand-navy mt-1">
                {locale === 'en' ? activeProduct.vidaEn : locale === 'de' ? activeProduct.vidaDe : activeProduct.vida}
              </span>
            </div>
          </div>

          {/* Spec Item 6: Temperatura */}
          <div className="flex gap-3 items-start p-4 bg-brand-white rounded-lg border border-brand-gray/10">
            <Thermometer className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
            <div>
              <span className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                {labelTemp}
              </span>
              <span className="block font-body text-sm font-bold text-brand-navy mt-1">
                {locale === 'en' ? activeProduct.temperaturaEn : locale === 'de' ? activeProduct.temperaturaDe : activeProduct.temperatura}
              </span>
            </div>
          </div>

          {/* Spec Item 7: Presentacion */}
          <div className="flex gap-3 items-start p-4 bg-brand-white rounded-lg border border-brand-gray/10">
            <Package className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
            <div>
              <span className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                {labelPresentacion}
              </span>
              <span className="block font-body text-sm font-bold text-brand-navy mt-1">
                {locale === 'en' ? activeProduct.presentacionEn : locale === 'de' ? activeProduct.presentacionDe : activeProduct.presentacion}
              </span>
            </div>
          </div>

          {/* Spec Item 8: Disponibilidad */}
          <div className="flex gap-3 items-start p-4 bg-brand-white rounded-lg border border-brand-gray/10">
            <Calendar className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
            <div>
              <span className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                {labelDisponibilidad}
              </span>
              <span className="block font-body text-sm font-bold text-brand-navy mt-1">
                {locale === 'en' ? activeProduct.disponibilidadEn : locale === 'de' ? activeProduct.disponibilidadDe : activeProduct.disponibilidad}
              </span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
