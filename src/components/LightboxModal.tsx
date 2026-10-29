import React from 'react';
import { X, Download, Wand2, Camera, Sparkles, Sliders, Info, Check } from 'lucide-react';
import { DishItem } from '../data/sampleMenus';

interface LightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  dish: DishItem | null;
  onOpenEdit: (dish: DishItem) => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  isOpen,
  onClose,
  dish,
  onOpenEdit,
}) => {
  if (!isOpen || !dish || !dish.photoUrl) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = dish.photoUrl!;
    link.download = `${dish.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-pro-${dish.photoSize || '1K'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        {/* Header */}
        <div className="px-6 py-3.5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/80">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono uppercase text-amber-500 font-semibold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
              {dish.category}
            </span>
            <h2 className="text-lg font-bold text-white font-serif tracking-tight truncate max-w-md">
              {dish.name}
            </h2>
            {dish.price && (
              <span className="text-sm font-semibold text-neutral-300 font-mono">
                {dish.price}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenEdit(dish);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600/90 hover:bg-purple-500 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Edit with AI</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold rounded-lg border border-neutral-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col md:flex-row gap-6 items-center justify-center">
          {/* Main Photo */}
          <div className="relative max-w-2xl w-full aspect-square rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800 shadow-2xl flex items-center justify-center">
            <img
              src={dish.photoUrl}
              alt={dish.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details / Camera specs sidebar */}
          <div className="w-full md:w-80 flex flex-col justify-between space-y-4 text-xs">
            <div className="space-y-4">
              <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-mono flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-amber-500" />
                  Shot Calibration
                </h4>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-neutral-500 block">Style</span>
                    <span className="text-neutral-200 font-semibold capitalize">
                      {dish.photoStyle ? dish.photoStyle.replace('-', ' ') : 'Rustic Dark'}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">Resolution</span>
                    <span className="text-amber-400 font-mono font-bold">
                      {dish.photoSize || '1K'} UHD
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">Image Model</span>
                    <span className="text-neutral-300 font-mono text-[10px]">
                      {dish.photoModel || 'gemini-3-pro-image-preview'}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">Aperture / Lens</span>
                    <span className="text-neutral-300 font-mono">
                      80mm f/2.8
                    </span>
                  </div>
                </div>
              </div>

              {/* Menu Details */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-mono">
                  Menu Description
                </h4>
                <p className="text-neutral-300 leading-relaxed font-sans">
                  {dish.description}
                </p>
              </div>

              {/* Key Ingredients */}
              {dish.keyIngredients.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-mono">
                    Culinary Ingredients
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {dish.keyIngredients.map((ing, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-neutral-950 text-neutral-300 border border-neutral-800 text-[11px]"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Plating Notes */}
              {dish.visualPlatingNotes && (
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-mono">
                    Styling & Plating
                  </h4>
                  <p className="text-[11px] text-neutral-400 font-mono bg-neutral-950/60 p-3 rounded-lg border border-neutral-800/80 leading-relaxed">
                    {dish.visualPlatingNotes}
                  </p>
                </div>
              )}
            </div>

            {/* Drink pairing */}
            {dish.suggestedDrinkPairing && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs">
                🍷 <span className="font-semibold">Sommelier Pairing:</span> {dish.suggestedDrinkPairing}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
