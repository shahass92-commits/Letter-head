import React, { useRef, useState, useEffect } from 'react';
import { Trash2, CheckCircle2, Feather } from 'lucide-react';

interface SignaturePadProps {
  onSave: (base64: string) => void;
  onClear: () => void;
  placeholderText: string;
  savedImageUrl?: string;
}

export default function SignaturePad({ onSave, onClear, placeholderText, savedImageUrl }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    // Fit canvas resolution to displayed container sizing
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * 2; // high-dpi backing store
      canvas.height = rect.height * 2;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(2, 2);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 2.5;
        // Deep elegant midnight blue color for the custom pen signature
        ctx.strokeStyle = '#0f294a'; 
      }
    }
  }, []);

  const getCoordinates = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setPointerCapture(e.pointerId);
    
    setIsDrawing(true);
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoordinates(e);
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoordinates(e);
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();
      setHasDrawn(true);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.releasePointerCapture(e.pointerId);
    setIsDrawing(false);
    
    // Save drawing to state as base64
    saveSignature();
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasDrawn) return;
    // Compress and generate standard image url
    const dataUrl = canvas.toDataURL('image/png');
    onSave(dataUrl);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setHasDrawn(false);
    onClear();
  };

  return (
    <div className="flex flex-col bg-slate-50 border border-slate-200 rounded-lg p-3">
      <div className="flex justify-between items-center mb-2">
        <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
          <Feather className="w-3.5 h-3.5 text-amber-600" />
          {placeholderText}
        </label>
        { (hasDrawn || savedImageUrl) && (
          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-rose-600 hover:text-rose-800 transition-colors flex items-center gap-1 bg-white hover:bg-rose-50 px-2 py-1 rounded border border-rose-100"
            id={`btn-clear-${placeholderText.replace(/\s+/g, '-').toLowerCase()}`}
          >
            <Trash2 className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>

      <div className="relative bg-white border border-dashed border-slate-300 rounded-md overflow-hidden h-28 touch-none">
        
        {/* Draw Canvas */}
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="absolute inset-0 w-full h-full cursor-crosshair z-10"
        />

        {/* Existing / Saved preview overlay */}
        {!hasDrawn && savedImageUrl ? (
          <div className="absolute inset-0 flex items-center justify-center p-3 bg-white pointer-events-none z-20">
            <img src={savedImageUrl} alt="Saved signature" className="max-h-20 object-contain" />
          </div>
        ) : null}

        {/* Floating guidance helper */}
        {!hasDrawn && !savedImageUrl && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-slate-400 gap-1 select-none">
            <span className="text-xs">Draw signature here with mouse or touch</span>
            <span className="text-[10px] uppercase font-mono tracking-widest text-slate-300">Ink Color: Navy</span>
          </div>
        )}

        {/* Indicator Badge for Success */}
        {hasDrawn && (
          <div className="absolute bottom-2 right-2 bg-emerald-50 text-emerald-700 text-[10px] px-1.5 py-0.5 rounded border border-emerald-100 font-medium flex items-center gap-1 pointer-events-none z-30">
            <CheckCircle2 className="w-2.5 h-2.5" />
            Active
          </div>
        )}
      </div>
    </div>
  );
}
