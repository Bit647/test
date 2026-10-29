import React, { useState } from 'react';
import { X, Printer, Download, BookOpen, Sparkles, ChefHat } from 'lucide-react';
import { DishItem } from '../data/sampleMenus';

interface MenuLookbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurantName: string;
  cuisineType: string;
  dishes: DishItem[];
}

export const MenuLookbookModal: React.FC<MenuLookbookModalProps> = ({
  isOpen,
  onClose,
  restaurantName,
  cuisineType,
  dishes,
}) => {
  if (!isOpen) return null;

  const photographedDishes = dishes.filter((d) => d.photoUrl);
  const categories = Array.from(new Set(photographedDishes.map((d) => d.category)));

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadAll = () => {
    photographedDishes.forEach((dish, idx) => {
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = dish.photoUrl!;
        link.download = `${restaurantName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${dish.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, idx * 300);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200 print:p-0 print:bg-white">
      <div className="relative w-full max-w-5xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] print:max-h-none print:border-none print:shadow-none print:bg-white print:text-black">
        {/* Header - Hidden during print */}
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/80 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-serif tracking-tight">
                Menu Lookbook & Digital Dining Card
              </h2>
              <p className="text-xs text-neutral-400">
                {photographedDishes.length} commercial food photos ready for web, social feeds, and print
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold rounded-lg border border-neutral-700 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={handleDownloadAll}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download All Photos</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Lookbook Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-10 bg-neutral-950/50 print:bg-white print:p-0">
          {/* Cover Header */}
          <div className="text-center max-w-2xl mx-auto space-y-2 border-b border-neutral-800 pb-8 print:border-neutral-300">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-500 font-bold print:text-amber-800">
              {cuisineType}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-serif tracking-tight print:text-black">
              {restaurantName}
            </h1>
            <p className="text-xs text-neutral-400 italic font-serif print:text-neutral-600">
              Photographed by Virtual Food Photographer Studio
            </p>
          </div>

          {/* Dishes Grouped by Category */}
          {categories.map((cat) => {
            const categoryDishes = photographedDishes.filter((d) => d.category === cat);
            return (
              <div key={cat} className="space-y-6">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-amber-400 font-serif tracking-tight uppercase tracking-wider print:text-amber-900">
                    {cat}
                  </h3>
                  <div className="flex-1 h-px bg-neutral-800 print:bg-neutral-300" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {categoryDishes.map((dish) => (
                    <div
                      key={dish.id}
                      className="bg-neutral-900/60 border border-neutral-800 rounded-xl overflow-hidden flex flex-col print:bg-white print:border-neutral-300 print:break-inside-avoid"
                    >
                      <div className="aspect-[4/3] w-full overflow-hidden bg-neutral-950">
                        <img
                          src={dish.photoUrl}
                          alt={dish.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-baseline justify-between mb-1">
                            <h4 className="text-base font-bold text-white font-serif print:text-black">
                              {dish.name}
                            </h4>
                            {dish.price && (
                              <span className="text-sm font-semibold text-amber-400 font-mono print:text-amber-900">
                                {dish.price}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-neutral-400 leading-relaxed print:text-neutral-700">
                            {dish.description}
                          </p>
                        </div>
                        {dish.keyIngredients.length > 0 && (
                          <div className="mt-3 pt-2 border-t border-neutral-800/80 flex flex-wrap gap-1 print:border-neutral-200">
                            {dish.keyIngredients.map((ing, i) => (
                              <span
                                key={i}
                                className="px-1.5 py-0.5 rounded text-[10px] bg-neutral-950 text-neutral-400 border border-neutral-800 print:bg-neutral-100 print:text-neutral-800 print:border-neutral-300"
                              >
                                {ing}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
