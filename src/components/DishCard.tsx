import React, { useState } from 'react';
import { Camera, Sparkles, Wand2, Download, Eye, RefreshCw, Sun, Moon, Instagram, Check, Utensils } from 'lucide-react';
import { DishItem } from '../data/sampleMenus';
import { FoodStyle } from './StyleSelector';

interface DishCardProps {
  dish: DishItem;
  currentStyle: FoodStyle;
  imageSize: '1K' | '2K' | '4K';
  onPhotograph: (dish: DishItem, customStyle?: FoodStyle) => void;
  onOpenEdit: (dish: DishItem) => void;
  onOpenLightbox: (dish: DishItem) => void;
}

export const DishCard: React.FC<DishCardProps> = ({
  dish,
  currentStyle,
  imageSize,
  onPhotograph,
  onOpenEdit,
  onOpenLightbox,
}) => {
  const [showNotes, setShowNotes] = useState(false);

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!dish.photoUrl) return;

    const link = document.createElement('a');
    link.href = dish.photoUrl;
    link.download = `${dish.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${dish.photoStyle || currentStyle}-${dish.photoSize || imageSize}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStyleBadge = (style?: string) => {
    switch (style) {
      case 'rustic-dark':
        return { label: 'Rustic / Dark', icon: Moon, color: 'bg-amber-950/80 text-amber-300 border-amber-600/40' };
      case 'bright-modern':
        return { label: 'Bright / Modern', icon: Sun, color: 'bg-sky-950/80 text-sky-300 border-sky-600/40' };
      case 'social-media':
        return { label: 'Social Media', icon: Instagram, color: 'bg-rose-950/80 text-rose-300 border-rose-600/40' };
      default:
        return { label: 'Artisan', icon: Sparkles, color: 'bg-neutral-800 text-neutral-300 border-neutral-700' };
    }
  };

  const badge = getStyleBadge(dish.photoStyle);
  const StyleIcon = badge.icon;

  return (
    <div className="bg-neutral-900/70 border border-neutral-800 hover:border-neutral-700 rounded-2xl overflow-hidden transition-all duration-200 flex flex-col group shadow-lg shadow-black/40">
      {/* Photo Frame Container */}
      <div className="relative aspect-square w-full bg-neutral-950 overflow-hidden flex items-center justify-center">
        {dish.isGenerating ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-neutral-950/90 backdrop-blur-xs p-6 text-center z-20">
            <div className="relative w-14 h-14">
              <div className="absolute inset-0 rounded-full border-2 border-amber-500/20 border-t-amber-500 animate-spin" />
              <Camera className="w-6 h-6 text-amber-400 absolute inset-0 m-auto animate-pulse" />
            </div>
            <div>
              <p className="text-xs font-bold text-white font-serif">
                Photographing {dish.name}...
              </p>
              <p className="text-[11px] text-amber-400/90 font-mono mt-0.5">
                Rendering {imageSize} resolution
              </p>
              <p className="text-[10px] text-neutral-500 mt-1">
                Calibrating lighting & culinary styling
              </p>
            </div>
          </div>
        ) : dish.photoUrl ? (
          <>
            <img
              src={dish.photoUrl}
              alt={dish.name}
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 cursor-pointer"
              onClick={() => onOpenLightbox(dish)}
            />

            {/* Overlay Badges */}
            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 border backdrop-blur-md ${badge.color}`}
              >
                <StyleIcon className="w-3 h-3" />
                <span>{badge.label}</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-neutral-900/80 text-amber-300 border border-neutral-700 backdrop-blur-md">
                {dish.photoSize || imageSize}
              </span>
            </div>

            {/* Quick Action Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3 z-10 pointer-events-none">
              <div className="flex items-center gap-1.5 pointer-events-auto">
                <button
                  onClick={() => onOpenLightbox(dish)}
                  className="p-1.5 bg-neutral-900/90 hover:bg-neutral-800 text-white rounded-lg border border-neutral-700 backdrop-blur-md transition-colors"
                  title="View Fullscreen"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDownload}
                  className="p-1.5 bg-neutral-900/90 hover:bg-neutral-800 text-white rounded-lg border border-neutral-700 backdrop-blur-md transition-colors"
                  title="Download Image"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => onOpenEdit(dish)}
                className="pointer-events-auto px-2.5 py-1 bg-purple-600/90 hover:bg-purple-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 backdrop-blur-md shadow-md transition-colors"
                title="Edit with gemini-nano-banana-2.1"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>Edit Photo</span>
              </button>
            </div>
          </>
        ) : (
          /* Empty / Not yet photographed state */
          <div className="flex flex-col items-center justify-center p-6 text-center text-neutral-500">
            <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 mb-3 group-hover:border-amber-500/40 group-hover:text-amber-400 transition-colors">
              <Camera className="w-6 h-6" />
            </div>
            <p className="text-xs font-semibold text-neutral-300 font-serif mb-1">
              Ready for Photoshoot
            </p>
            <p className="text-[11px] text-neutral-500 max-w-[190px] mb-3">
              Generate commercial photo in {currentStyle.replace('-', ' ')} aesthetic
            </p>
            <button
              onClick={() => onPhotograph(dish)}
              className="px-3.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Photograph Dish</span>
            </button>
          </div>
        )}
      </div>

      {/* Dish Information Section */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Price */}
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-500/90 font-semibold">
              {dish.category}
            </span>
            {dish.price && (
              <span className="text-xs font-semibold text-neutral-300 font-mono">
                {dish.price}
              </span>
            )}
          </div>

          {/* Dish Name */}
          <h3 className="text-base font-bold text-white font-serif tracking-tight leading-snug mb-1.5">
            {dish.name}
          </h3>

          {/* Menu description */}
          <p className="text-xs text-neutral-400 font-sans leading-relaxed line-clamp-2 mb-2.5">
            {dish.description}
          </p>

          {/* Key ingredients pills */}
          {dish.keyIngredients.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2.5">
              {dish.keyIngredients.slice(0, 4).map((ing, i) => (
                <span
                  key={i}
                  className="px-1.5 py-0.5 rounded text-[10px] bg-neutral-950 text-neutral-400 border border-neutral-800/80"
                >
                  {ing}
                </span>
              ))}
              {dish.keyIngredients.length > 4 && (
                <span className="px-1 text-[10px] text-neutral-500 self-center">
                  +{dish.keyIngredients.length - 4}
                </span>
              )}
            </div>
          )}

          {/* Plating visual notes toggle */}
          {dish.visualPlatingNotes && (
            <div className="mb-3">
              <button
                onClick={() => setShowNotes(!showNotes)}
                className="text-[11px] text-neutral-500 hover:text-amber-400/90 transition-colors flex items-center gap-1"
              >
                <span>{showNotes ? 'Hide Plating Notes ▲' : 'View Food Stylist Plating Notes ▼'}</span>
              </button>
              {showNotes && (
                <div className="mt-1.5 p-2 rounded-lg bg-neutral-950/80 border border-neutral-800/80 text-[11px] text-neutral-400 font-mono leading-relaxed">
                  {dish.visualPlatingNotes}
                  {dish.suggestedDrinkPairing && (
                    <div className="mt-1 pt-1 border-t border-neutral-800/60 text-amber-400/80">
                      🍷 Pairing: {dish.suggestedDrinkPairing}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Controls Footer */}
        <div className="pt-3 border-t border-neutral-800/80 space-y-2">
          {/* Quick Style Switchers */}
          <div className="flex items-center justify-between text-[11px] text-neutral-400">
            <span className="text-[10px] uppercase font-mono text-neutral-500">Style Switch:</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onPhotograph(dish, 'rustic-dark')}
                className={`p-1 rounded border transition-colors ${
                  dish.photoStyle === 'rustic-dark'
                    ? 'bg-amber-950 text-amber-300 border-amber-600'
                    : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white'
                }`}
                title="Shoot in Rustic/Dark Style"
              >
                <Moon className="w-3 h-3" />
              </button>
              <button
                onClick={() => onPhotograph(dish, 'bright-modern')}
                className={`p-1 rounded border transition-colors ${
                  dish.photoStyle === 'bright-modern'
                    ? 'bg-sky-950 text-sky-300 border-sky-600'
                    : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white'
                }`}
                title="Shoot in Bright/Modern Style"
              >
                <Sun className="w-3 h-3" />
              </button>
              <button
                onClick={() => onPhotograph(dish, 'social-media')}
                className={`p-1 rounded border transition-colors ${
                  dish.photoStyle === 'social-media'
                    ? 'bg-rose-950 text-rose-300 border-rose-600'
                    : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white'
                }`}
                title="Shoot in Social Media Flat-Lay Style"
              >
                <Instagram className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onPhotograph(dish)}
              disabled={dish.isGenerating}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white text-xs font-semibold rounded-xl border border-neutral-700/80 transition-colors shadow-sm"
            >
              <Camera className="w-3.5 h-3.5 text-amber-400" />
              <span>{dish.photoUrl ? 'Reshoot Photo' : 'Photograph Dish'}</span>
            </button>

            {dish.photoUrl && (
              <button
                onClick={() => onOpenEdit(dish)}
                className="py-1.5 px-2.5 bg-purple-950/60 hover:bg-purple-900/60 text-purple-300 border border-purple-500/40 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1"
                title="Edit with gemini-nano-banana-2.1 prompt"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Edit</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
