'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

type OrgNode = {
  id: string;
  name: string;
  type: 'unit' | 'sub' | 'group';
  percentage?: string;
  location?: string;
  children?: OrgNode[];
};

const orgData: OrgNode[] = [
  {
    id: 'cedis',
    name: 'CEDIS',
    type: 'unit',
    percentage: '100%',
    location: 'Parque STIVA MTY',
    children: [
      { id: 'frescos', name: 'Frescos La Regia', type: 'sub', location: 'Parque STIVA MTY' },
      { id: 'agricola-cedis', name: 'Agrícola Vive', type: 'sub', location: 'Aguascalientes' },
    ]
  },
  {
    id: 'ranchos',
    name: 'Ranchos Producción',
    type: 'unit',
    percentage: '100%',
    location: 'Loreto, Zacatecas',
    children: [
      { id: 'valdivias', name: "Valdivia's Secos", type: 'sub', location: 'Mercado de Abastos Estrella MTY' },
    ]
  },
  {
    id: 'planta',
    name: 'Planta Preenfriamiento',
    type: 'unit',
    percentage: '100%',
    location: 'Loreto, Zacatecas',
    children: [
      { id: 'agricola-planta', name: 'Agrícola Vive', type: 'sub', location: 'Aguascalientes' },
    ]
  },
  {
    id: 'vive',
    name: 'Vive Produce LLC',
    type: 'unit',
    percentage: '100%',
    location: 'McAllen, Texas',
  },
  {
    id: 'pdv',
    name: 'Puntos de Venta',
    type: 'group',
    children: [
      { id: 'bodega-124', name: 'Bodega 124', type: 'unit', percentage: '100%', location: 'Mercado de Abastos Estrella, MTY' },
      { id: 'bodega-90', name: 'Bodega 90', type: 'unit', percentage: '100%', location: 'Mercado de Abastos GDL' },
    ]
  }
];

export function OrganigramaChart() {
  return (
    <div className="w-full">
      {/* Desktop View */}
      <div className="hidden lg:block overflow-x-auto w-full pb-8 scrollbar-hide">
        <div style={{ width: '1200px', height: '600px', position: 'relative', margin: '0 auto' }}>
          <svg width="1200" height="600" className="absolute top-0 left-0">
            {/* Connections */}
            <g stroke="#9CA3AF" strokeWidth="1.5" fill="none">
              {/* Root down */}
              <line x1="600" y1="100" x2="600" y2="130" />
              {/* Horizontal line */}
              <line x1="120" y1="130" x2="1080" y2="130" />
              {/* Verticals to Level 1 */}
              <line x1="120" y1="130" x2="120" y2="160" />
              <line x1="360" y1="130" x2="360" y2="160" />
              <line x1="600" y1="130" x2="600" y2="160" />
              <line x1="840" y1="130" x2="840" y2="160" />
              <line x1="1080" y1="130" x2="1080" y2="160" />

              {/* Dotted lines to subsidiaries */}
              <g strokeDasharray="6,4">
                {/* CEDIS */}
                <line x1="120" y1="280" x2="120" y2="330" />
                <line x1="120" y1="430" x2="120" y2="470" />
                {/* Ranchos */}
                <line x1="360" y1="280" x2="360" y2="330" />
                {/* Planta */}
                <line x1="600" y1="280" x2="600" y2="330" />
              </g>

              {/* Solid lines for PDV children */}
              <line x1="1080" y1="200" x2="1080" y2="220" />
              <line x1="1080" y1="340" x2="1080" y2="380" />
            </g>
          </svg>

          {/* Root Node */}
          <div className="absolute flex flex-col items-center justify-center bg-white" style={{ left: 450, top: 20, width: 300, height: 80 }}>
            <div className="flex items-center gap-4">
              <div className="flex flex-col text-center">
                <span className="font-display font-bold text-brand-navy text-xl leading-none mb-1">Grupo Exportador</span>
                <span className="font-body text-brand-navy/60 text-sm leading-none">del Campo</span>
              </div>
            </div>
            <div className="w-[180px] h-[3px] bg-brand-green mt-3"></div>
          </div>

          {/* Level 1 - Units */}
          <UnitNode x={30} y={160} name="CEDIS" location="Parque STIVA MTY" />
          <SubNode x={30} y={330} name="Frescos La Regia" location="Parque STIVA MTY" />
          <SubNode x={30} y={470} name="Agrícola Vive" location="Aguascalientes" />

          <UnitNode x={270} y={160} name="Ranchos Producción" location="Loreto, Zacatecas" />
          <SubNode x={270} y={330} name="Valdivia's Secos" location="Mercado de Abastos Estrella MTY" />

          <UnitNode x={510} y={160} name="Planta Preenfriamiento" location="Loreto, Zacatecas" />
          <SubNode x={510} y={330} name="Agrícola Vive" location="Aguascalientes" />

          <UnitNode x={750} y={160} name="Vive Produce LLC" location="McAllen, Texas" />

          {/* PDV Group Label */}
          <div className="absolute text-center flex items-center justify-center" style={{ left: 990, top: 160, width: 180, height: 40 }}>
            <span className="font-display font-bold text-brand-navy text-lg">Puntos de Venta</span>
          </div>
          {/* PDV Children */}
          <UnitNode x={990} y={220} name="Bodega 124" location="Mercado de Abastos Estrella, MTY" />
          <UnitNode x={990} y={380} name="Bodega 90" location="Mercado de Abastos GDL" />

        </div>
      </div>

      {/* Mobile View */}
      <div className="block lg:hidden w-full max-w-md mx-auto space-y-4">
        {orgData.map((node) => (
          <MobileAccordion key={node.id} node={node} />
        ))}
      </div>
    </div>
  );
}

function UnitNode({ x, y, name, location }: { x: number; y: number; name: string; location: string }) {
  return (
    <div 
      className="absolute bg-brand-navy rounded-[4px] p-4 text-white flex flex-col justify-center items-center text-center shadow-md z-10"
      style={{ left: x, top: y, width: 180, height: 120 }}
    >
      <span className="font-display text-[28px] font-bold mb-2 leading-none">100%</span>
      <span className="font-display text-[15px] font-bold leading-tight mb-2">{name}</span>
      <span className="font-body text-xs opacity-70 leading-tight">{location}</span>
    </div>
  );
}

function SubNode({ x, y, name, location }: { x: number; y: number; name: string; location: string }) {
  return (
    <div 
      className="absolute bg-white border-[1.5px] border-brand-navy rounded-[4px] p-4 text-brand-navy flex flex-col justify-center items-center text-center shadow-sm z-10"
      style={{ left: x, top: y, width: 180, height: 100 }}
    >
      <span className="font-display text-[15px] font-bold leading-tight mb-2">{name}</span>
      <span className="font-body text-xs opacity-80 leading-tight">{location}</span>
    </div>
  );
}

function MobileAccordion({ node }: { node: OrgNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = node.children && node.children.length > 0;

  if (node.type === 'group') {
    return (
      <div className="border border-brand-gray/30 rounded-md bg-brand-white overflow-hidden">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-4 flex items-center justify-between bg-white"
        >
          <span className="font-display font-bold text-brand-navy text-lg">{node.name}</span>
          {isOpen ? <ChevronUp className="w-5 h-5 text-brand-navy" /> : <ChevronDown className="w-5 h-5 text-brand-navy" />}
        </button>
        
        {isOpen && hasChildren && (
          <div className="p-4 space-y-4 bg-brand-white/50 border-t border-brand-gray/20">
            {node.children!.map((child) => (
              <div key={child.id} className="bg-brand-navy rounded-md p-4 flex flex-col shadow-sm">
                <span className="font-display text-2xl text-white font-bold mb-1">100%</span>
                <span className="font-display font-bold text-white text-lg">{child.name}</span>
                <span className="font-body text-white/70 text-sm mt-1">{child.location}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="border border-brand-gray/30 rounded-md overflow-hidden bg-white shadow-sm">
      <button 
        onClick={() => hasChildren ? setIsOpen(!isOpen) : undefined}
        className={`w-full p-5 flex items-start justify-between text-left ${hasChildren ? 'cursor-pointer' : 'cursor-default'} bg-brand-navy`}
      >
        <div className="flex flex-col">
          <span className="font-display text-3xl text-white font-bold mb-1">100%</span>
          <span className="font-display font-bold text-white text-[19px]">{node.name}</span>
          <span className="font-body text-white/70 text-sm mt-1">{node.location}</span>
        </div>
        {hasChildren && (
          <div className="mt-2 bg-white/10 p-1.5 rounded-full">
            {isOpen ? <ChevronUp className="w-5 h-5 text-white" /> : <ChevronDown className="w-5 h-5 text-white" />}
          </div>
        )}
      </button>
      
      {isOpen && hasChildren && (
        <div className="py-5 pr-5 pl-6 space-y-4 bg-brand-white relative">
          <div className="absolute left-[30px] top-0 bottom-8 w-0 border-l-[1.5px] border-dashed border-brand-navy/30"></div>
          
          {node.children!.map((child) => (
            <div key={child.id} className="relative pl-6">
              <div className="absolute left-[-16px] top-1/2 w-6 border-t-[1.5px] border-dashed border-brand-navy/30"></div>
              <div className="bg-white border-[1.5px] border-brand-navy rounded-md p-4 flex flex-col shadow-sm">
                <span className="font-display font-bold text-brand-navy text-[17px] mb-1">{child.name}</span>
                <span className="font-body text-brand-navy/80 text-xs">{child.location}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
