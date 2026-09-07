'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Check,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Loader2,
  Maximize2,
  Minimize2,
  Crop as CropIcon,
  Move,
} from 'lucide-react';

export type AspectRatioOption = '16:9' | '4:3' | '1:1' | '3:4' | '21:9' | 'libre';

interface ImageCropModalProps {
  isOpen: boolean;
  imageUrl: string;
  initialAspectRatio?: AspectRatioOption | number;
  label?: string;
  onClose: () => void;
  onConfirmCrop: (blob: Blob, previewUrl: string) => Promise<void> | void;
  onUseOriginal?: () => void;
  isSaving?: boolean;
}

const RATIO_MAP: Record<string, number | null> = {
  '16:9': 16 / 9,
  '4:3': 4 / 3,
  '1:1': 1,
  '3:4': 3 / 4,
  '21:9': 21 / 9,
  libre: null,
};

export function ImageCropModal({
  isOpen,
  imageUrl,
  initialAspectRatio = '16:9',
  label = 'Ajustar Imagen',
  onClose,
  onConfirmCrop,
  onUseOriginal,
  isSaving = false,
}: ImageCropModalProps) {
  const [mounted, setMounted] = useState(false);

  // Aspect ratio state
  const getInitialRatio = (): AspectRatioOption => {
    if (typeof initialAspectRatio === 'string' && RATIO_MAP[initialAspectRatio] !== undefined) {
      return initialAspectRatio as AspectRatioOption;
    }
    return '16:9';
  };

  const [selectedRatio, setSelectedRatio] = useState<AspectRatioOption>(getInitialRatio);
  const [fitMode, setFitMode] = useState<'cover' | 'contain'>('cover');

  // Transform states
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 }); // offset in px relative to center
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; panX: number; panY: number }>({ x: 0, y: 0, panX: 0, panY: 0 });

  // Natural image dimensions
  const [naturalSize, setNaturalSize] = useState<{ width: number; height: number } | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  // Container viewport reference
  const containerRef = useRef<HTMLDivElement>(null);
  const [frameDimensions, setFrameDimensions] = useState({ width: 480, height: 270 });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset transforms when image or modal opens
  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setPan({ x: 0, y: 0 });
      setFitMode('cover');
      setImageLoaded(false);
      setLoadError(false);
      setSelectedRatio(getInitialRatio());
    }
  }, [isOpen, imageUrl]);

  // Load natural dimensions of image
  useEffect(() => {
    if (!imageUrl || !isOpen) return;

    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;
    img.onload = () => {
      setNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
      setImageLoaded(true);
      setLoadError(false);
    };
    img.onerror = () => {
      // Retry without anonymous crossOrigin if local/restricted
      const fallbackImg = new window.Image();
      fallbackImg.src = imageUrl;
      fallbackImg.onload = () => {
        setNaturalSize({ width: fallbackImg.naturalWidth, height: fallbackImg.naturalHeight });
        setImageLoaded(true);
        setLoadError(false);
      };
      fallbackImg.onerror = () => {
        setLoadError(true);
      };
    };
  }, [imageUrl, isOpen]);

  // Calculate crop frame dimensions inside the available viewport
  useEffect(() => {
    if (!isOpen) return;

    const updateFrameSize = () => {
      const maxWidth = Math.min(window.innerWidth * 0.85, 640);
      const maxHeight = Math.min(window.innerHeight * 0.55, 420);

      let targetRatio = RATIO_MAP[selectedRatio];

      if (targetRatio === null) {
        // 'libre' mode matches image's natural aspect ratio or default 16:9
        targetRatio = naturalSize ? naturalSize.width / naturalSize.height : 16 / 9;
      }

      let width = maxWidth;
      let height = width / targetRatio;

      if (height > maxHeight) {
        height = maxHeight;
        width = height * targetRatio;
      }

      setFrameDimensions({ width: Math.round(width), height: Math.round(height) });
    };

    updateFrameSize();
    window.addEventListener('resize', updateFrameSize);
    return () => window.removeEventListener('resize', updateFrameSize);
  }, [isOpen, selectedRatio, naturalSize]);

  // Handle pointer / mouse drag (Pan)
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!imageLoaded) return;
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX: pan.x,
      panY: pan.y,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;

    setPan({
      x: dragStartRef.current.panX + deltaX,
      y: dragStartRef.current.panY + deltaY,
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = -e.deltaY * 0.0015;
    setZoom((prev) => Math.min(Math.max(prev + delta, 1), 3.5));
  };

  // Reset to center
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setFitMode('cover');
  };

  // Toggle Fit / Fill (Instagram Style)
  const toggleFitMode = () => {
    setFitMode((prev) => (prev === 'cover' ? 'contain' : 'cover'));
    setPan({ x: 0, y: 0 });
    setZoom(1);
  };

  // Export cropped image via Canvas
  const handleExportCrop = async () => {
    if (!naturalSize) return;

    try {
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.src = imageUrl;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      // Target canvas resolution (high definition, matching frame proportion)
      const targetRatio = frameDimensions.width / frameDimensions.height;
      const canvasWidth = Math.min(Math.max(frameDimensions.width * 2, 1200), 2400);
      const canvasHeight = Math.round(canvasWidth / targetRatio);

      const canvas = document.createElement('canvas');
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) throw new Error('No se pudo inicializar el Canvas 2D');

      // Clear / fill background
      ctx.fillStyle = fitMode === 'contain' ? '#0b1319' : '#000000';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // Base display dimensions of image inside frame at 1x zoom
      let baseDispW = 0;
      let baseDispH = 0;

      const imgAspect = naturalSize.width / naturalSize.height;
      const frameAspect = frameDimensions.width / frameDimensions.height;

      if (fitMode === 'cover') {
        if (imgAspect > frameAspect) {
          baseDispH = frameDimensions.height;
          baseDispW = baseDispH * imgAspect;
        } else {
          baseDispW = frameDimensions.width;
          baseDispH = baseDispW / imgAspect;
        }
      } else {
        // contain mode
        if (imgAspect > frameAspect) {
          baseDispW = frameDimensions.width;
          baseDispH = baseDispW / imgAspect;
        } else {
          baseDispH = frameDimensions.height;
          baseDispW = baseDispH * imgAspect;
        }
      }

      // With zoom
      const dispW = baseDispW * zoom;
      const dispH = baseDispH * zoom;

      // Center offset + user pan in frame coordinates
      const frameCenterX = frameDimensions.width / 2;
      const frameCenterY = frameDimensions.height / 2;

      const imgLeftInFrame = frameCenterX - dispW / 2 + pan.x;
      const imgTopInFrame = frameCenterY - dispH / 2 + pan.y;

      // Map from frame coordinates to canvas coordinates
      const canvasDrawX = (imgLeftInFrame / frameDimensions.width) * canvasWidth;
      const canvasDrawY = (imgTopInFrame / frameDimensions.height) * canvasHeight;
      const canvasDrawW = (dispW / frameDimensions.width) * canvasWidth;
      const canvasDrawH = (dispH / frameDimensions.height) * canvasHeight;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, canvasDrawX, canvasDrawY, canvasDrawW, canvasDrawH);

      // Convert to blob
      canvas.toBlob(
        async (blob) => {
          if (!blob) throw new Error('Error al generar imagen');
          const previewUrl = URL.createObjectURL(blob);
          await onConfirmCrop(blob, previewUrl);
        },
        'image/webp',
        0.92
      );
    } catch (err: any) {
      console.error('Error cropping image:', err);
      // Fallback: use JPEG if webp fails
      try {
        const fallbackImg = new window.Image();
        fallbackImg.src = imageUrl;
        await new Promise((resolve) => (fallbackImg.onload = resolve));
        const canvas = document.createElement('canvas');
        canvas.width = frameDimensions.width * 2;
        canvas.height = frameDimensions.height * 2;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(fallbackImg, 0, 0, canvas.width, canvas.height);
          canvas.toBlob(
            async (blob) => {
              if (blob) {
                const previewUrl = URL.createObjectURL(blob);
                await onConfirmCrop(blob, previewUrl);
              }
            },
            'image/jpeg',
            0.9
          );
        }
      } catch (fallbackErr) {
        alert('No se pudo procesar el recorte de la imagen. Intenta con otra imagen.');
      }
    }
  };

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/85 z-[10000] flex items-center justify-center p-3 sm:p-5 backdrop-blur-md select-none">
      <div className="bg-[#0f172a] text-white rounded-2xl shadow-2xl border border-slate-700/60 w-full max-w-3xl overflow-hidden flex flex-col max-h-[95vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-5 py-3.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-green/20 text-brand-green flex items-center justify-center">
              <CropIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-display uppercase tracking-wider text-white flex items-center gap-2">
                Acomodar y Encuadrar Imagen
                <span className="text-[10px] bg-brand-green/20 text-brand-green px-2 py-0.5 rounded-full font-sans lowercase font-normal">
                  estilo instagram
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-body">{label}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSaving}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            title="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Aspect Ratio Toolbar */}
        <div className="px-5 py-2.5 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between gap-2 overflow-x-auto text-xs shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1 shrink-0">
              Proporción:
            </span>
            {(['16:9', '4:3', '1:1', '3:4', '21:9', 'libre'] as AspectRatioOption[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => {
                  setSelectedRatio(r);
                  setPan({ x: 0, y: 0 });
                }}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  selectedRatio === r
                    ? 'bg-brand-green text-brand-navy font-bold shadow-sm'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {r === '16:9' ? '16:9 (Hero/Blog)' : r === '4:3' ? '4:3 (Tarjeta)' : r === '1:1' ? '1:1 (Cuadrada)' : r === '3:4' ? '3:4 (Retrato)' : r === '21:9' ? '21:9 (Panorámica)' : 'Libre'}
              </button>
            ))}
          </div>

          {/* Fit / Fill Instagram Button */}
          <button
            type="button"
            onClick={toggleFitMode}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all shrink-0 ${
              fitMode === 'contain'
                ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
            title={fitMode === 'cover' ? 'Ajustar para que quepa completa' : 'Llenar marco'}
          >
            {fitMode === 'cover' ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span>{fitMode === 'cover' ? 'Llenar Marco' : 'Ajustar Completa'}</span>
          </button>
        </div>

        {/* Interactive Viewport Canvas Area */}
        <div
          ref={containerRef}
          className="flex-1 min-h-[300px] sm:min-h-[380px] bg-[#070d14] relative flex items-center justify-center p-4 overflow-hidden select-none"
          onWheel={handleWheel}
        >
          {loadError ? (
            <div className="text-center p-6 text-red-400">
              <p className="text-sm font-semibold">No se pudo cargar la imagen para previsualización.</p>
              <p className="text-xs text-slate-500 mt-1">Verifica la ruta o sube una imagen directamente.</p>
            </div>
          ) : !imageLoaded ? (
            <div className="flex flex-col items-center gap-2 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-brand-green" />
              <span className="text-xs">Cargando imagen...</span>
            </div>
          ) : (
            <div
              className="relative overflow-hidden shadow-2xl rounded-lg border-2 border-brand-green/60 cursor-grab active:cursor-grabbing group"
              style={{
                width: `${frameDimensions.width}px`,
                height: `${frameDimensions.height}px`,
                boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.75)',
              }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
            >
              {/* Image rendered inside frame */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt="Crop preview"
                draggable={false}
                className="absolute max-w-none pointer-events-none transition-transform duration-75 ease-out"
                style={{
                  width:
                    fitMode === 'cover'
                      ? naturalSize && naturalSize.width / naturalSize.height > frameDimensions.width / frameDimensions.height
                        ? 'auto'
                        : '100%'
                      : naturalSize && naturalSize.width / naturalSize.height > frameDimensions.width / frameDimensions.height
                      ? '100%'
                      : 'auto',
                  height:
                    fitMode === 'cover'
                      ? naturalSize && naturalSize.width / naturalSize.height > frameDimensions.width / frameDimensions.height
                        ? '100%'
                        : 'auto'
                      : naturalSize && naturalSize.width / naturalSize.height > frameDimensions.width / frameDimensions.height
                      ? 'auto'
                      : '100%',
                  transform: `translate(-50%, -50%) translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                  left: '50%',
                  top: '50%',
                }}
              />

              {/* Instagram Rule-of-Thirds Grid (visible while dragging or hovering) */}
              <div
                className={`absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 transition-opacity duration-200 ${
                  isDragging ? 'opacity-90' : 'opacity-20 group-hover:opacity-60'
                }`}
              >
                <div className="border-r border-b border-white/40" />
                <div className="border-r border-b border-white/40" />
                <div className="border-b border-white/40" />
                <div className="border-r border-b border-white/40" />
                <div className="border-r border-b border-white/40" />
                <div className="border-b border-white/40" />
                <div className="border-r border-b border-white/40" />
                <div className="border-r border-b border-white/40" />
                <div />
              </div>

              {/* Central crosshair / focal indicator */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-3 h-3 rounded-full border border-white/50 bg-brand-green/30 shadow-sm" />
              </div>

              {/* Drag Hint overlay on top left */}
              <div className="absolute top-2 left-2 pointer-events-none bg-black/60 backdrop-blur-sm text-white/80 text-[10px] px-2 py-0.5 rounded flex items-center gap-1">
                <Move className="w-3 h-3 text-brand-green" />
                <span>Arrastra para acomodar</span>
              </div>
            </div>
          )}
        </div>

        {/* Zoom & Adjustment Controls */}
        <div className="px-5 py-3 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3 flex-1 min-w-[200px]">
            <button
              type="button"
              onClick={() => setZoom((prev) => Math.max(prev - 0.2, 1))}
              disabled={zoom <= 1}
              className="text-slate-400 hover:text-white disabled:opacity-40 p-1"
              title="Alejar"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <input
              type="range"
              min="1"
              max="3"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="flex-1 accent-[#4DB26B] h-1.5 bg-slate-700 rounded-lg cursor-pointer"
            />
            <button
              type="button"
              onClick={() => setZoom((prev) => Math.min(prev + 0.2, 3))}
              disabled={zoom >= 3}
              className="text-slate-400 hover:text-white disabled:opacity-40 p-1"
              title="Acercar"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono text-slate-300 w-10 text-right">
              {Math.round(zoom * 100)}%
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Centrar y reajustar al 100%"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Centrar</span>
            </button>

            {onUseOriginal && (
              <button
                type="button"
                onClick={onUseOriginal}
                disabled={isSaving}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
                title="Subir sin recortar"
              >
                Usar Original
              </button>
            )}
          </div>
        </div>

        {/* Footer Action Buttons */}
        <div className="px-5 py-3.5 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between shrink-0">
          <p className="text-[11px] text-slate-400 hidden sm:block">
            {naturalSize ? `Resolución original: ${naturalSize.width} × ${naturalSize.height}px` : ''}
          </p>

          <div className="flex items-center gap-3 ml-auto">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleExportCrop}
              disabled={isSaving || !imageLoaded}
              className="flex items-center gap-2 bg-[#4DB26B] hover:bg-[#43a060] text-slate-950 font-bold px-5 py-2 rounded-lg text-xs shadow-lg disabled:opacity-50 transition-all hover:scale-[1.02]"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
              ) : (
                <Check className="w-4 h-4 text-slate-950 stroke-[3]" />
              )}
              <span>{isSaving ? 'Guardando Enfoque...' : 'Aplicar y Guardar'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>,
    document.body
  );
}
