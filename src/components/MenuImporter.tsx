import React, { useState } from 'react';
import { FileText, Upload, Sparkles, X, Check, ChefHat, AlertCircle, RefreshCw } from 'lucide-react';
import { SAMPLE_MENUS, SampleMenu, DishItem } from '../data/sampleMenus';

interface MenuImporterProps {
  isOpen: boolean;
  onClose: () => void;
  onMenuLoaded: (restaurantName: string, cuisineType: string, dishes: DishItem[]) => void;
}

export const MenuImporter: React.FC<MenuImporterProps> = ({
  isOpen,
  onClose,
  onMenuLoaded,
}) => {
  const [activeTab, setActiveTab] = useState<'sample' | 'paste' | 'upload'>('sample');
  const [selectedSample, setSelectedSample] = useState<SampleMenu>(SAMPLE_MENUS[0]);
  const [rawText, setRawText] = useState<string>('');
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleParseText = async (textToParse: string) => {
    if (!textToParse.trim()) {
      setError('Please provide menu text or choose a sample restaurant.');
      return;
    }

    setIsParsing(true);
    setError(null);

    try {
      const res = await fetch('/api/menu/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ menuText: textToParse }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP error ${res.status}`);
      }

      const data = await res.json();
      if (!data.dishes || !Array.isArray(data.dishes) || data.dishes.length === 0) {
        throw new Error('No dishes could be extracted. Please check the menu text format.');
      }

      const formattedDishes: DishItem[] = data.dishes.map((d: any, index: number) => ({
        id: d.id || `dish-${Date.now()}-${index}`,
        name: d.name,
        category: d.category || 'Mains',
        description: d.description || '',
        price: d.price || '',
        keyIngredients: Array.isArray(d.keyIngredients) ? d.keyIngredients : [],
        visualPlatingNotes:
          d.visualPlatingNotes ||
          'Artisanal commercial food presentation with fresh garnishes and textured dinnerware',
        suggestedGarnish: d.suggestedGarnish || '',
        suggestedDrinkPairing: d.suggestedDrinkPairing || '',
      }));

      onMenuLoaded(
        data.restaurantName || 'Artisan Restaurant',
        data.cuisineType || 'Contemporary Fine Dining',
        formattedDishes
      );
      onClose();
    } catch (err: any) {
      console.error('Menu parse failed:', err);
      setError(err?.message || 'Failed to parse menu. Please try again.');
    } finally {
      setIsParsing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setRawText(content);
        setActiveTab('paste');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-serif tracking-tight">
                Upload or Select Restaurant Menu
              </h2>
              <p className="text-xs text-neutral-400">
                Gemini will extract all dishes, ingredients, and visual plating notes automatically
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

        {/* Navigation Tabs */}
        <div className="flex border-b border-neutral-800 bg-neutral-950/30 px-6 pt-2">
          <button
            onClick={() => setActiveTab('sample')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'sample'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Restaurant Menus (Instant)</span>
          </button>

          <button
            onClick={() => setActiveTab('paste')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'paste'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Paste Text Menu</span>
          </button>

          <button
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'upload'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload File (.txt, .md, .csv)</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {activeTab === 'sample' && (
            <div className="space-y-3">
              <p className="text-xs text-neutral-400">
                Select one of our meticulously crafted restaurant menus to test high-end food photography across different culinary traditions:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SAMPLE_MENUS.map((menu) => {
                  const isSelected = selectedSample.id === menu.id;
                  return (
                    <div
                      key={menu.id}
                      onClick={() => setSelectedSample(menu)}
                      className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                        isSelected
                          ? 'border-amber-500 bg-amber-500/10 ring-1 ring-amber-500/30'
                          : 'border-neutral-800 bg-neutral-950/40 hover:border-neutral-700 hover:bg-neutral-800/40'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-1.5">
                        <h4 className="text-sm font-bold text-white font-serif">{menu.name}</h4>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-neutral-800 text-amber-300 border border-neutral-700">
                          {menu.badge}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 font-sans mb-2">{menu.tagline}</p>
                      <span className="text-[11px] text-amber-400/90 font-mono">
                        {menu.cuisine}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Preview of chosen sample */}
              <div className="mt-4 pt-4 border-t border-neutral-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-neutral-300 font-mono">
                    Preview of "{selectedSample.name}":
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    6 distinct dishes ready for photoshoot
                  </span>
                </div>
                <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800/80 max-h-40 overflow-y-auto font-mono text-[11px] text-neutral-400 whitespace-pre-wrap leading-relaxed">
                  {selectedSample.rawText}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'paste' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-neutral-300">
                  Paste your raw restaurant menu text:
                </label>
                <span className="text-[11px] text-neutral-500">
                  Dish names, ingredients, prices, descriptions
                </span>
              </div>
              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder={`Example:\nOsteria Firenze\n\nPrimi:\nHandmade Tagliolini with White Truffle - $42\nFresh egg pasta tossed in cultured mountain butter and Parmigiano-Reggiano, finished with shaved fresh Alba white truffles.\n\nSecondi:\nPan-Seared Sea Bass - $36\nCrispy skin Mediterranean sea bass with charred artichoke hearts, salsa verde, and lemon emulsion.`}
                className="w-full h-64 bg-neutral-950 border border-neutral-800 rounded-xl p-3.5 text-xs text-neutral-200 font-mono placeholder:text-neutral-600 focus:border-amber-500 outline-none leading-relaxed"
              />
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="py-8 px-4 border-2 border-dashed border-neutral-800 hover:border-amber-500/60 rounded-2xl flex flex-col items-center justify-center text-center transition-colors">
              <Upload className="w-10 h-10 text-neutral-500 mb-3" />
              <h3 className="text-sm font-semibold text-white mb-1">
                Upload your menu file
              </h3>
              <p className="text-xs text-neutral-400 mb-4 max-w-sm">
                Supports standard plain text files (.txt, .md, .csv) exported from POS, Word, or website menus.
              </p>
              <label className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-amber-300 text-xs font-medium rounded-xl border border-neutral-700 cursor-pointer transition-colors">
                <span>Select File from Computer</span>
                <input
                  type="file"
                  accept=".txt,.md,.csv,.text"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-neutral-800 bg-neutral-950/60 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-neutral-400 hover:text-white transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              if (activeTab === 'sample') {
                handleParseText(selectedSample.rawText);
              } else {
                handleParseText(rawText);
              }
            }}
            disabled={isParsing}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-amber-950/40 transition-all disabled:opacity-50"
          >
            {isParsing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Gemini is Parsing Culinary Plating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {activeTab === 'sample'
                    ? `Load & Parse "${selectedSample.name}"`
                    : 'Analyze & Extract Dishes'}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
