'use client';

import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';

type Fase = 'mexico' | 'zacatecas' | 'loreto';

/*
  Proyección equirectangular real.
  ViewBox="0 0 600 500"
  x = (117.5 - lon_abs) * 19.35
  y = (33 - lat) * 26.32

  Loreto, Zacatecas: 22.27°N, 101.97°W → x≈300, y≈282
  Zacatecas state roughly: x 258–325, y 207–295
*/

/* ── Contorno real de México (continental) ── */
const MEXICO_PATH =
  'M 10,13 L 17,8 L 39,8 L 52,13 ' +
  'L 89,29 L 128,45 L 155,45 L 180,57 L 212,71 L 248,90 ' +
  'L 280,95 L 310,100 L 321,97 L 328,113 L 340,132 L 348,145 ' +
  'L 360,168 L 372,184 L 387,187 ' +
  /* Gulf coast south */
  'L 385,210 L 381,240 L 381,284 ' +
  'L 385,302 L 389,318 L 396,335 L 408,355 L 414,363 ' +
  'L 425,378 L 435,388 L 445,392 ' +
  /* Campeche/Yucatan */
  'L 462,388 L 478,382 L 497,383 L 512,368 L 522,347 ' +
  'L 530,333 L 538,320 L 540,316 L 562,305 L 581,300 ' +
  'L 594,306 L 592,320 L 583,337 L 577,358 ' +
  'L 565,380 L 555,396 L 540,406 ' +
  /* Belize/Guatemala border going west */
  'L 518,418 L 505,440 L 505,449 ' +
  /* Pacific coast Chiapas–Oaxaca–Guerrero */
  'L 488,476 L 470,468 L 450,460 L 430,458 L 414,455 ' +
  'L 395,450 L 375,442 L 360,435 L 341,426 ' +
  'L 320,416 L 308,405 L 292,396 L 276,384 ' +
  'L 256,366 L 248,355 L 238,340 L 238,327 ' +
  /* Jalisco-Nayarit-Sinaloa-Sonora coast */
  'L 228,312 L 218,292 L 215,258 L 212,242 ' +
  'L 200,224 L 187,208 L 175,196 L 166,189 ' +
  'L 152,172 L 143,155 L 135,140 L 128,134 ' +
  'L 118,120 L 108,110 ' +
  /* Sonora coast NW back to border */
  'L 92,88 L 77,65 L 68,50 L 52,30 L 39,18 ' +
  'L 17,8 L 10,13 Z';

/* ── Baja California (peninsula) ── */
const BAJA_PATH =
  'M 10,13 L 5,20 L 6,35 L 10,52 L 12,72 ' +
  'L 14,90 L 16,110 L 18,128 L 20,148 ' +
  'L 22,165 L 24,182 L 26,198 L 28,215 ' +
  'L 29,230 L 30,245 L 33,258 L 38,268 ' +
  /* tip of peninsula, Cabo San Lucas */
  'L 43,272 L 48,270 ' +
  /* east coast (Sea of Cortez) going north */
  'L 55,262 L 64,248 L 72,232 L 82,215 ' +
  'L 90,198 L 96,182 L 100,165 L 100,148 ' +
  'L 96,130 L 90,112 L 84,94 L 76,76 ' +
  'L 65,58 L 55,40 L 48,28 L 39,18 ' +
  'L 39,8 L 17,8 L 10,13 Z';

/* ── Zacatecas state (real boundaries, simplified) ── */
const ZACATECAS_PATH =
  'M 263,208 L 278,204 L 292,205 L 303,210 ' +
  'L 314,218 L 322,228 L 325,242 L 324,255 ' +
  'L 318,268 L 314,282 L 308,290 L 298,295 ' +
  'L 287,296 L 276,293 L 268,286 L 260,276 ' +
  'L 256,265 L 255,252 L 258,240 L 260,228 ' +
  'L 263,218 L 263,208 Z';

/* Loreto, Zacatecas: 22.27°N, 101.97°W → x=300, y=282 */
const LORETO_X = 300;
const LORETO_Y = 282;

/* ViewBox phases */
const VIEWBOXES: Record<Fase, string> = {
  mexico:    '0 0 600 500',
  zacatecas: '200 160 180 180',
  loreto:    '248 240 100 100',
};

export function MapaZacatecas() {
  const [fase, setFase] = useState<Fase>('mexico');

  useEffect(() => {
    const t1 = setTimeout(() => setFase('zacatecas'), 1400);
    const t2 = setTimeout(() => setFase('loreto'), 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className="relative w-full select-none">
      {/* Label de fase */}
      <div className="absolute top-3 left-3 z-10 flex gap-2">
        {(['mexico', 'zacatecas', 'loreto'] as Fase[]).map((f) => (
          <button
            key={f}
            onClick={() => setFase(f)}
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${
              fase === f
                ? 'bg-brand-green text-white shadow-md'
                : 'bg-white/70 text-brand-navy/50 hover:bg-white'
            }`}
          >
            {f === 'mexico' ? 'México' : f === 'zacatecas' ? 'Zacatecas' : 'Loreto'}
          </button>
        ))}
      </div>

      {/* Mapa SVG con zoom real por viewBox animado */}
      <div className="w-full h-80 md:h-96 bg-[#ddeef5] rounded-xl overflow-hidden border border-brand-green/20 shadow-inner">
        <svg
          viewBox={VIEWBOXES[fase]}
          className="w-full h-full"
          style={{ transition: 'viewBox 1s ease' }}
        >
          {/* Fondo oceánico */}
          <rect x="-100" y="-100" width="900" height="800" fill="#c8e0ef" />

          {/* Mainland México */}
          <path d={MEXICO_PATH} fill="#b5cba2" stroke="#6d9b6e" strokeWidth="1.5" />

          {/* Baja California */}
          <path d={BAJA_PATH} fill="#b5cba2" stroke="#6d9b6e" strokeWidth="1.5" />

          {/* Zacatecas destacado */}
          <path
            d={ZACATECAS_PATH}
            fill="#4DB26B"
            fillOpacity={fase === 'mexico' ? 0.8 : 1}
            stroke="#fff"
            strokeWidth={fase === 'mexico' ? 0.8 : 1.5}
          />

          {/* Label Zacatecas visible en fase 1 */}
          {fase === 'mexico' && (
            <text
              x="287"
              y="262"
              textAnchor="middle"
              fontSize="8"
              fontFamily="Georgia, serif"
              fontWeight="bold"
              fill="#fff"
              pointerEvents="none"
            >
              ZAC
            </text>
          )}

          {/* Label Zacatecas en fase 2 */}
          {fase === 'zacatecas' && (
            <text
              x="290"
              y="260"
              textAnchor="middle"
              fontSize="14"
              fontFamily="Georgia, serif"
              fontWeight="bold"
              fill="#fff"
              stroke="#2C3E4B"
              strokeWidth="0.5"
              pointerEvents="none"
            >
              Zacatecas
            </text>
          )}

          {/* Pin Loreto fase 3 */}
          {fase === 'loreto' && (
            <g>
              {/* Pulse ring */}
              <circle cx={LORETO_X} cy={LORETO_Y} r="8" fill="#4DB26B" fillOpacity="0.3">
                <animate attributeName="r" values="6;14;6" dur="2s" repeatCount="indefinite" />
                <animate attributeName="fill-opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" />
              </circle>
              {/* Pin dot */}
              <circle cx={LORETO_X} cy={LORETO_Y} r="4" fill="#4DB26B" stroke="#fff" strokeWidth="1.5" />
              {/* Label */}
              <rect
                x={LORETO_X - 28}
                y={LORETO_Y - 24}
                width="56"
                height="16"
                rx="3"
                fill="#2C3E4B"
                fillOpacity="0.9"
              />
              <text
                x={LORETO_X}
                y={LORETO_Y - 12}
                textAnchor="middle"
                fontSize="8"
                fontFamily="Georgia, serif"
                fontWeight="bold"
                fill="#fff"
              >
                Loreto, Zac.
              </text>
            </g>
          )}

          {/* Label Loreto in fase 2 (smaller dot, no popup) */}
          {fase === 'zacatecas' && (
            <circle cx={LORETO_X} cy={LORETO_Y} r="3" fill="#2C3E4B" stroke="#fff" strokeWidth="1" />
          )}

          {/* Estado label in fase 1 */}
          {fase === 'mexico' && (
            <>
              {/* Some state border lines to make it feel like a real map */}
              <path
                d="M 155,45 L 248,90 M 321,97 L 387,187 M 381,284 L 445,392"
                stroke="#6d9b6e"
                strokeWidth="0.4"
                strokeDasharray="4,3"
                fill="none"
                opacity="0.5"
              />
            </>
          )}
        </svg>
      </div>

      {/* Leyenda inferior */}
      <div className="flex items-center justify-between mt-3 px-1">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-[#4DB26B]" />
          <span className="text-[11px] text-brand-navy/60 font-body">Zacatecas</span>
        </div>
        {fase === 'loreto' && (
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-brand-green" />
            <span className="text-[11px] text-brand-navy font-bold font-body">Loreto, Zac. — Origen GEC (1965)</span>
          </div>
        )}
      </div>
    </div>
  );
}
