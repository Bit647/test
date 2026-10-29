import React from 'react';
import { Camera, Sparkles, Sliders, Layers, Download, Plus, Check } from 'lucide-react';

interface HeaderProps {
  imageSize: '1K' | '2K' | '4K';
  setImageSize: (size: '1K' | '2K' | '4K') => void;
  onOpenMenuImport: () => void;
  onOpenLookbook: () => void;
  hasPhotos: boolean;
  restaurantName: string;
  totalDishes: number;
  photographedCount: number;
  onBatchPhotographAll: () => void;
  isBatchGenerating: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  imageSize,
  setImageSize,
  onOpenMenuImport,
  onOpenLookbook,
  hasPhotos,
  restaurantName,
  totalDishes,
  photographedCount,
  onBatchPhotographAll,
  isBatchGenerating,
}) => {
  return (
    <header className="border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-orange-600 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-900/30 ring-1 ring-amber-400/40">
            <Camera className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white font-serif">
                Aperture & Appetite
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                PRO STUDIO
              </span>
            </div>
            <p className="text-xs text-neutral-400 flex items-center gap-1.5">
              <span>Virtual Food Photographer</span>
              {restaurantName && (
                <>
                  <span className="text-neutral-600">•</span>
                  <span className="text-amber-400 font-medium truncate max-w-[200px]">
                    {restaurantName}
                  </span>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Controls: Resolution Affordance (1K, 2K, 4K) & Action Buttons */}
        <div className="flex items-center flex-wrap gap-2.5 justify-end w-full md:w-auto">
          {/* Resolution Selector Affordance */}
          <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-lg p-1">
            <span className="text-[11px] font-medium text-neutral-400 px-2 flex items-center gap-1">
              <Sliders className="w-3 h-3 text-neutral-500" />
              Size:
            </span>
            {(['1K', '2K', '4K'] as const).map((size) => (
              <button
                key={size}
                onClick={() => setImageSize(size)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  imageSize === size
                    ? 'bg-amber-500 text-neutral-950 shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
                title={`Generate images at ${size} resolution using gemini-3-pro-image-preview`}
              >
                {size}
              </button>
            ))}
          </div>

          {/* Model info pill */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-neutral-900/90 border border-neutral-800 text-[11px] text-neutral-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>gemini-3-pro-image-preview</span>
          </div>

          {/* Import Menu Button */}
          <button
            onClick={onOpenMenuImport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700/80 rounded-lg transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span>Load Menu</span>
          </button>

          {/* Batch Shoot All Button */}
          {totalDishes > 0 && (
            <button
              onClick={onBatchPhotographAll}
              disabled={isBatchGenerating}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shadow-sm ${
                isBatchGenerating
                  ? 'bg-amber-600/50 text-white cursor-wait'
                  : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-amber-950/40'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>
                {isBatchGenerating
                  ? 'Shooting All Dishes...'
                  : photographedCount > 0
                  ? `Shoot Remaining (${totalDishes - photographedCount})`
                  : `Photograph All (${totalDishes})`}
              </span>
            </button>
          )}

          {/* Lookbook / Export button */}
          {hasPhotos && (
            <button
              onClick={onOpenLookbook}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-amber-300 border border-amber-500/30 rounded-lg transition-colors"
            >
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>Menu Lookbook</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
