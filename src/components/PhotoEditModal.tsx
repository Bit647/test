import React, { useState } from 'react';
import { Sparkles, Wand2, RefreshCw, X, Check, Undo2, ArrowRight, Eye, Flame, Wine, Leaf } from 'lucide-react';
import { DishItem } from '../data/sampleMenus';

interface PhotoEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  dish: DishItem | null;
  onSaveEditedPhoto: (dishId: string, newPhotoUrl: string, promptUsed: string) => void;
}

const CULINARY_EDIT_IDEAS = [
  { label: 'Savory Steam', prompt: 'Add delicate wisps of appetizing steam rising naturally from the hot freshly served dish' },
  { label: 'Wine Glass Pairing', prompt: 'Add an elegant stemware glass of vintage red wine in the soft-focus background' },
  { label: 'Herbs & Sea Salt', prompt: 'Garnish with freshly picked micro-basil, cracked black peppercorns, and glistening Maldon sea salt crystals' },
  { label: 'Truffle Shavings', prompt: 'Sprinkle delicate razor-thin shavings of fresh black winter truffle across the top of the dish' },
  { label: 'Candlelight Dinner', prompt: 'Add a cozy amber candle flickering gently in the background with romantic bistro mood' },
  { label: 'Olive Oil Drizzle', prompt: 'Add glistening droplets and a delicate golden ribbon drizzle of cold-pressed extra virgin olive oil' },
];

export const PhotoEditModal: React.FC<PhotoEditModalProps> = ({
  isOpen,
  onClose,
  dish,
  onSaveEditedPhoto,
}) => {
  if (!isOpen || !dish || !dish.photoUrl) return null;

  const [editPrompt, setEditPrompt] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPreviewUrl, setCurrentPreviewUrl] = useState<string>(dish.photoUrl);
  const [history, setHistory] = useState<{ url: string; prompt: string }[]>([
    { url: dish.photoUrl, prompt: 'Original Photo' },
  ]);
  const [activeView, setActiveView] = useState<'current' | 'split'>('current');

  const handleApplyEdit = async (promptToUse?: string) => {
    const finalPrompt = promptToUse || editPrompt;
    if (!finalPrompt.trim()) {
      setError('Please enter a styling edit prompt.');
      return;
    }

    setIsEditing(true);
    setError(null);

    try {
      const res = await fetch('/api/photos/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          base64Image: currentPreviewUrl,
          mimeType: 'image/png',
          editPrompt: finalPrompt,
          dishName: dish.name,
          aspectRatio: '1:1',
          imageSize: '1K',
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP error ${res.status}`);
      }

      const data = await res.json();
      if (!data.imageUrl) {
        throw new Error('No edited image received from Gemini.');
      }

      setCurrentPreviewUrl(data.imageUrl);
      setHistory((prev) => [...prev, { url: data.imageUrl, prompt: finalPrompt }]);
      setEditPrompt('');
    } catch (err: any) {
      console.error('Photo edit failed:', err);
      setError(err?.message || 'Failed to edit photo with gemini-nano-banana-2.1.');
    } finally {
      setIsEditing(false);
    }
  };

  const handleRevert = (index: number) => {
    if (history[index]) {
      setCurrentPreviewUrl(history[index].url);
    }
  };

  const handleSaveAndClose = () => {
    const lastEdit = history[history.length - 1];
    onSaveEditedPhoto(dish.id, currentPreviewUrl, lastEdit.prompt);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white font-serif tracking-tight">
                  AI Food Stylist & Photo Editor
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  gemini-nano-banana-2.1
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Styling: <span className="text-amber-400 font-medium">{dish.name}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Image Comparison & Preview */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-400 font-mono">
                Canvas Preview
              </span>
              <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-lg border border-neutral-800">
                <button
                  onClick={() => setActiveView('current')}
                  className={`px-2 py-0.5 text-[11px] rounded transition-colors ${
                    activeView === 'current'
                      ? 'bg-neutral-800 text-amber-300 font-medium'
                      : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  Current Shot
                </button>
                <button
                  onClick={() => setActiveView('split')}
                  className={`px-2 py-0.5 text-[11px] rounded transition-colors ${
                    activeView === 'split'
                      ? 'bg-neutral-800 text-amber-300 font-medium'
                      : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  Split Compare
                </button>
              </div>
            </div>

            {/* Main Preview Box */}
            <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800 flex items-center justify-center">
              {activeView === 'current' ? (
                <img
                  src={currentPreviewUrl}
                  alt={dish.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full grid grid-cols-2">
                  <div className="relative h-full border-r border-neutral-800 overflow-hidden">
                    <img
                      src={dish.photoUrl}
                      alt="Original"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/70 text-white text-[10px] rounded backdrop-blur-sm">
                      Original
                    </span>
                  </div>
                  <div className="relative h-full overflow-hidden">
                    <img
                      src={currentPreviewUrl}
                      alt="Edited"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-amber-500 text-neutral-950 text-[10px] font-semibold rounded backdrop-blur-sm">
                      Edited
                    </span>
                  </div>
                </div>
              )}

              {isEditing && (
                <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex flex-col items-center justify-center gap-2 text-white">
                  <RefreshCw className="w-8 h-8 text-amber-400 animate-spin" />
                  <p className="text-xs font-medium font-mono text-amber-300">
                    Applying AI Food Styling...
                  </p>
                  <p className="text-[11px] text-neutral-400">
                    Refining textures with gemini-nano-banana-2.1
                  </p>
                </div>
              )}
            </div>

            {/* Version timeline / history chips */}
            {history.length > 1 && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                <span className="text-[11px] text-neutral-500 whitespace-nowrap">Versions:</span>
                {history.map((ver, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleRevert(idx)}
                    className={`px-2 py-1 text-[11px] rounded-lg border whitespace-nowrap transition-colors ${
                      currentPreviewUrl === ver.url
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white'
                    }`}
                  >
                    v{idx + 1}: {ver.prompt.slice(0, 14)}...
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Text Prompt Form & Quick Styling Chips */}
          <div className="flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-200 mb-1">
                  Describe what you'd like to change or enhance:
                </label>
                <p className="text-[11px] text-neutral-400 mb-2">
                  Use natural language to tweak ingredients, lighting, garnishes, tabletop props, or plating details.
                </p>
                <textarea
                  value={editPrompt}
                  onChange={(e) => setEditPrompt(e.target.value)}
                  placeholder="e.g. Add a dusting of flaked sea salt, a glass of Chianti Classico in the background, and delicate rising steam..."
                  className="w-full h-28 bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-neutral-200 placeholder:text-neutral-600 focus:border-purple-500 outline-none leading-relaxed"
                />
              </div>

              {/* 1-Click Culinary Inspiration Chips */}
              <div>
                <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                  Chef & Stylist Suggestions (Click to Apply):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {CULINARY_EDIT_IDEAS.map((idea) => (
                    <button
                      key={idea.label}
                      onClick={() => {
                        setEditPrompt(idea.prompt);
                      }}
                      className="text-left p-2 rounded-lg border border-neutral-800 bg-neutral-950/60 hover:border-purple-500/50 hover:bg-purple-950/20 transition-all text-xs group"
                    >
                      <span className="font-semibold text-neutral-300 group-hover:text-purple-300 block mb-0.5">
                        + {idea.label}
                      </span>
                      <span className="text-[10px] text-neutral-500 line-clamp-1">
                        {idea.prompt}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-xs text-red-300">
                  {error}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-neutral-800 flex flex-col gap-2">
              <button
                onClick={() => handleApplyEdit()}
                disabled={isEditing || !editPrompt.trim()}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-purple-950/40 transition-all disabled:opacity-50"
              >
                {isEditing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Styling in Progress...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Apply Styling Edit (gemini-nano-banana-2.1)</span>
                  </>
                )}
              </button>

              <button
                onClick={handleSaveAndClose}
                disabled={currentPreviewUrl === dish.photoUrl}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold rounded-xl transition-all disabled:opacity-40"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save as Hero Dish Photo</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
