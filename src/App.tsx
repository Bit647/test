import React, { useState, useMemo } from 'react';
import {
  Camera,
  Sparkles,
  Layers,
  ChefHat,
  Filter,
  Plus,
  AlertCircle,
  CheckCircle2,
  X,
  RefreshCw,
  Sun,
  Moon,
  Instagram,
  UtensilsCrossed,
  Info,
} from 'lucide-react';
import { Header } from './components/Header';
import { StyleSelector, FoodStyle } from './components/StyleSelector';
import { MenuImporter } from './components/MenuImporter';
import { DishCard } from './components/DishCard';
import { PhotoEditModal } from './components/PhotoEditModal';
import { LightboxModal } from './components/LightboxModal';
import { MenuLookbookModal } from './components/MenuLookbookModal';
import { SAMPLE_MENUS, DishItem } from './data/sampleMenus';

// Initial pre-loaded menu based on Osteria del Tartufo
const INITIAL_DISHES: DishItem[] = [
  {
    id: 'dish-burrata',
    name: 'Burrata Pugliese con Fichi Arrostiti',
    category: 'Antipasti',
    description: 'Creamy 250g pugliese burrata cheese, caramelized mission figs, 25-year aged Modena balsamic glaze, toasted pine nuts, crispy sage leaves.',
    price: '$24',
    keyIngredients: ['burrata cheese', 'caramelized figs', 'aged balsamic glaze', 'pine nuts', 'sage'],
    visualPlatingNotes: 'Lush white burrata cut open to show molten stracciatella cream interior, glistening syrupy figs, dark balsamic reduction zig-zag, flaked sea salt, warm rustic ceramic plate.',
    suggestedGarnish: 'Crisp fried sage leaf and coarse Maldon sea salt',
    suggestedDrinkPairing: 'Franciacorta Brut or Crisp Vermentino',
    photoStyle: 'rustic-dark',
    photoSize: '2K',
  },
  {
    id: 'dish-tartare',
    name: 'Battuta di Fassona al Tartufo Nero',
    category: 'Antipasti',
    description: 'Hand-cut Piedmontese beef tartare, shaved black winter truffle, cured egg yolk shavings, micro arugula, crispy caper berries, grilled sea salt focaccia.',
    price: '$28',
    keyIngredients: ['Fassona beef', 'black winter truffle', 'cured egg yolk', 'caper berries', 'grilled focaccia'],
    visualPlatingNotes: 'Sculpted beef tartare disc on dark basalt slate, microplane snowfall of golden cured egg yolk, delicate black truffle petals, grilled focaccia spear resting on rim.',
    suggestedGarnish: 'Gold-leaf flecks and micro arugula',
    suggestedDrinkPairing: 'Barbera d’Asti Superiore',
    photoStyle: 'rustic-dark',
    photoSize: '2K',
  },
  {
    id: 'dish-tagliolini',
    name: "Tagliolini al Tartufo Bianco d'Alba",
    category: 'Primi Piatti',
    description: "House-made egg tagliolini pasta spun in mountain butter and 36-month Parmigiano-Reggiano, crowned with generous tableside shaved white Alba truffle petals.",
    price: '$46',
    keyIngredients: ['egg tagliolini', 'white Alba truffle', 'mountain butter', 'Parmigiano-Reggiano 36-month'],
    visualPlatingNotes: 'Twirled golden pasta nest resting in wide-rim dark artisan bowl, velvety emulsified butter gloss, crowned with fragile shaved white truffle curls, subtle steam.',
    suggestedGarnish: 'Freshly cracked Tellicherry black pepper and shaved truffle',
    suggestedDrinkPairing: 'Barolo or aged Nebbiolo',
    photoStyle: 'rustic-dark',
    photoSize: '2K',
  },
  {
    id: 'dish-risotto',
    name: 'Risotto ai Funghi Porcini & Midollo',
    category: 'Primi Piatti',
    description: 'Acquerello aged carnaroli risotto, foraged woodland porcini mushrooms, roasted bone marrow glaze, crispy thyme, parmigiano crust.',
    price: '$34',
    keyIngredients: ['Acquerello carnaroli rice', 'porcini mushrooms', 'roasted bone marrow', 'thyme'],
    visualPlatingNotes: 'All’onda wave-rippled risotto in earthy stoneware shallow plate, pan-roasted porcini mushrooms glistening with herb butter, marrow glaze droplets, micro thyme.',
    suggestedGarnish: 'Crisp parmigiano wafer and thyme sprig',
    suggestedDrinkPairing: 'Chianti Classico Riserva',
    photoStyle: 'rustic-dark',
    photoSize: '2K',
  },
  {
    id: 'dish-fiorentina',
    name: 'Bistecca alla Fiorentina Tagliata',
    category: 'Secondi',
    description: 'Wood-fire charred Chianina dry-aged ribeye steak, flaked Maldon smoked sea salt, rosemary-infused Tuscan olive oil drizzle, blistered vine cherry tomatoes.',
    price: '$58',
    keyIngredients: ['Chianina dry-aged beef', 'smoked Maldon salt', 'rosemary Tuscan olive oil', 'vine cherry tomatoes'],
    visualPlatingNotes: 'Thick sliced steak fan showing ruby-red rare center and sizzling caramelized crust, charred rosemary sprig still smoking faintly, blistered tomatoes on charred wood board.',
    suggestedGarnish: 'Smoked sea salt crystals and fresh rosemary sprig',
    suggestedDrinkPairing: 'Brunello di Montalcino',
    photoStyle: 'rustic-dark',
    photoSize: '2K',
  },
  {
    id: 'dish-tiramisu',
    name: 'Tiramisù Tradizionale al Mascarpone',
    category: 'Dolci',
    description: 'Espresso-soaked savoiardi biscuits, whipped mascarpone zabaione cream, Valrhona 70% dark cocoa dusting, bittersweet chocolate curls.',
    price: '$16',
    keyIngredients: ['espresso savoiardi', 'mascarpone cream', 'Valrhona dark cocoa', 'chocolate curls'],
    visualPlatingNotes: 'Piped pillowy mascarpone peaks dusted with velvety dark cocoa powder, delicate bittersweet chocolate shavings, vintage silver dessert spoon with espresso bean alongside.',
    suggestedGarnish: 'Valrhona cocoa snowfall and espresso bean',
    suggestedDrinkPairing: 'Vin Santo del Chianti or Espresso Ristretto',
    photoStyle: 'rustic-dark',
    photoSize: '2K',
  },
];

export default function App() {
  const [restaurantName, setRestaurantName] = useState('Osteria del Tartufo');
  const [cuisineType, setCuisineType] = useState('Tuscan Fine Dining');
  const [dishes, setDishes] = useState<DishItem[]>(INITIAL_DISHES);

  // Style Toggles: 'rustic-dark' | 'bright-modern' | 'social-media'
  const [currentStyle, setCurrentStyle] = useState<FoodStyle>('rustic-dark');

  // Affordance for image size: '1K', '2K', '4K'
  const [imageSize, setImageSize] = useState<'1K' | '2K' | '4K'>('2K');

  // Aspect ratio
  const [aspectRatio, setAspectRatio] = useState<string>('1:1');

  // Advanced camera settings
  const [cameraSettings, setCameraSettings] = useState({
    angle: '45-degree angled hero culinary shot',
    depthOfField: 'Shallow depth of field with creamy bokeh and razor-sharp focus on hero dish textures',
    surface: 'Dark Textured Slate Slab',
    extras: ['Gourmet Steam Rising', 'Flaked Maldon Sea Salt Dusting'],
  });

  // Active category filter
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Modals state
  const [isMenuImportOpen, setIsMenuImportOpen] = useState(false);
  const [isLookbookOpen, setIsLookbookOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<DishItem | null>(null);
  const [lightboxDish, setLightboxDish] = useState<DishItem | null>(null);

  // Notification / Toast
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Batch generation state
  const [isBatchGenerating, setIsBatchGenerating] = useState(false);
  const [batchProgress, setBatchProgress] = useState<{ current: number; total: number } | null>(null);

  // Computed categories
  const categories = useMemo(() => {
    const set = new Set(dishes.map((d) => d.category));
    return ['All', ...Array.from(set)];
  }, [dishes]);

  // Filtered dishes
  const filteredDishes = useMemo(() => {
    if (selectedCategory === 'All') return dishes;
    return dishes.filter((d) => d.category === selectedCategory);
  }, [dishes, selectedCategory]);

  const photographedCount = useMemo(() => {
    return dishes.filter((d) => Boolean(d.photoUrl)).length;
  }, [dishes]);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 5000);
  };

  // Generate photography for a single dish
  const handlePhotographDish = async (dish: DishItem, customStyle?: FoodStyle) => {
    const styleToUse = customStyle || currentStyle;

    // Update dish generating status
    setDishes((prev) =>
      prev.map((d) => (d.id === dish.id ? { ...d, isGenerating: true } : d))
    );

    try {
      const response = await fetch('/api/photos/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dish,
          style: styleToUse,
          imageSize,
          aspectRatio,
          cameraSettings,
          requestedModel: 'gemini-3-pro-image-preview',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Generation failed (${response.status})`);
      }

      const data = await response.json();

      setDishes((prev) =>
        prev.map((d) =>
          d.id === dish.id
            ? {
                ...d,
                photoUrl: data.imageUrl,
                photoStyle: styleToUse,
                photoSize: data.imageSize || imageSize,
                photoModel: data.modelUsed,
                isGenerating: false,
              }
            : d
        )
      );

      if (data.fallbackNotice) {
        showToast(data.fallbackNotice, 'info');
      } else {
        showToast(`Photographed "${dish.name}" in ${imageSize} ${styleToUse.replace('-', ' ')} style!`, 'success');
      }
    } catch (err: any) {
      console.error('Photograph error:', err);
      setDishes((prev) =>
        prev.map((d) => (d.id === dish.id ? { ...d, isGenerating: false } : d))
      );
      showToast(err?.message || 'Failed to generate dish photograph.', 'error');
    }
  };

  // Batch photograph all or remaining dishes
  const handleBatchPhotographAll = async () => {
    const targetDishes = dishes.filter((d) => !d.photoUrl);
    const listToProcess = targetDishes.length > 0 ? targetDishes : dishes;

    if (listToProcess.length === 0) return;

    setIsBatchGenerating(true);
    setBatchProgress({ current: 0, total: listToProcess.length });
    showToast(`Starting batch photoshoot for ${listToProcess.length} dishes...`, 'info');

    for (let i = 0; i < listToProcess.length; i++) {
      const dish = listToProcess[i];
      setBatchProgress({ current: i + 1, total: listToProcess.length });
      await handlePhotographDish(dish);
    }

    setIsBatchGenerating(false);
    setBatchProgress(null);
    showToast(`Completed commercial photoshoot for all ${listToProcess.length} dishes!`, 'success');
  };

  // Handle saving an edited photo from PhotoEditModal (gemini-nano-banana-2.1)
  const handleSaveEditedPhoto = (dishId: string, newPhotoUrl: string, promptUsed: string) => {
    setDishes((prev) =>
      prev.map((d) => {
        if (d.id === dishId) {
          const prevHistory = d.editHistory || [];
          return {
            ...d,
            photoUrl: newPhotoUrl,
            editHistory: [...prevHistory, { prompt: promptUsed, photoUrl: newPhotoUrl, timestamp: Date.now() }],
          };
        }
        return d;
      })
    );
    showToast(`Updated "${dishes.find((d) => d.id === dishId)?.name}" with prompt styling!`, 'success');
  };

  // Handle menu loaded from parser or samples
  const handleMenuLoaded = (name: string, cuisine: string, newDishes: DishItem[]) => {
    setRestaurantName(name);
    setCuisineType(cuisine);
    setDishes(newDishes);
    setSelectedCategory('All');
    showToast(`Loaded ${newDishes.length} dishes from ${name}!`, 'success');
  };

  // Add a manual dish
  const handleAddManualDish = () => {
    const newDish: DishItem = {
      id: `custom-${Date.now()}`,
      name: "Chef's Tasting Special",
      category: 'Chef Specials',
      description: 'Pan-seared dry-aged diver scallops with cauliflower silk, crispy guanciale, and golden chanterelles.',
      price: '$38',
      keyIngredients: ['diver scallops', 'cauliflower silk', 'guanciale', 'chanterelle mushrooms'],
      visualPlatingNotes: 'Two golden seared scallops resting in velvety white cauliflower puree, crispy pork crumb, micro chervil, glossy olive oil pool.',
      suggestedGarnish: 'Micro chervil and edible gold leaf',
      suggestedDrinkPairing: 'Chablis Premier Cru',
    };
    setDishes((prev) => [newDish, ...prev]);
    showToast('Added new Chef Special to menu!', 'info');
  };

  return (
    <div className="min-h-screen bg-[#0c0d0e] text-neutral-100 font-sans selection:bg-amber-500 selection:text-neutral-950">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-700 shadow-2xl animate-in slide-in-from-bottom duration-200 max-w-md">
          {toastMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
          {toastMessage.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
          {toastMessage.type === 'info' && <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />}
          <span className="text-xs text-neutral-200 font-medium">{toastMessage.text}</span>
          <button onClick={() => setToastMessage(null)} className="ml-auto text-neutral-500 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header */}
      <Header
        imageSize={imageSize}
        setImageSize={setImageSize}
        onOpenMenuImport={() => setIsMenuImportOpen(true)}
        onOpenLookbook={() => setIsLookbookOpen(true)}
        hasPhotos={photographedCount > 0}
        restaurantName={restaurantName}
        totalDishes={dishes.length}
        photographedCount={photographedCount}
        onBatchPhotographAll={handleBatchPhotographAll}
        isBatchGenerating={isBatchGenerating}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Hero Banner / Restaurant Info */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 pb-6 border-b border-neutral-800/80">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30">
                {cuisineType}
              </span>
              <span className="text-xs text-neutral-500">•</span>
              <span className="text-xs text-neutral-400">
                {photographedCount} of {dishes.length} Dishes Photographed
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-serif tracking-tight">
              {restaurantName}
            </h1>
            <p className="text-xs text-neutral-400 mt-1 max-w-2xl leading-relaxed">
              Generate Michelin-grade commercial food photography directly from your menu text using{' '}
              <span className="text-amber-300 font-medium">gemini-3-pro-image-preview</span> (1K, 2K, 4K) and edit with{' '}
              <span className="text-purple-300 font-medium">gemini-nano-banana-2.1</span>.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => setIsMenuImportOpen(true)}
              className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-medium rounded-lg border border-neutral-800 transition-colors flex items-center gap-1.5"
            >
              <ChefHat className="w-3.5 h-3.5 text-amber-500" />
              <span>Switch Restaurant Menu</span>
            </button>
            <button
              onClick={handleAddManualDish}
              className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-medium rounded-lg border border-neutral-800 transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-neutral-400" />
              <span>Add Custom Dish</span>
            </button>
          </div>
        </div>

        {/* Style Selector Section (Core Requirement: Rustic/Dark, Bright/Modern, Social Media) */}
        <StyleSelector
          currentStyle={currentStyle}
          onSelectStyle={(s) => {
            setCurrentStyle(s);
            showToast(`Switched active studio aesthetic to ${s.replace('-', ' ').toUpperCase()}`, 'info');
          }}
          aspectRatio={aspectRatio}
          setAspectRatio={setAspectRatio}
          cameraSettings={cameraSettings}
          setCameraSettings={setCameraSettings}
        />

        {/* Batch Generation Progress Indicator */}
        {isBatchGenerating && batchProgress && (
          <div className="mb-6 p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 text-amber-300 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-5 h-5 text-amber-400 animate-spin" />
              <div>
                <p className="text-xs font-bold text-white font-serif">
                  Photographing Full Restaurant Menu: Dish {batchProgress.current} of {batchProgress.total}
                </p>
                <p className="text-[11px] text-amber-400/80">
                  Calibrating {currentStyle.replace('-', ' ')} lighting & camera framing...
                </p>
              </div>
            </div>
            <div className="w-48 bg-neutral-950 rounded-full h-2 overflow-hidden border border-amber-500/30">
              <div
                className="bg-amber-500 h-full transition-all duration-300"
                style={{ width: `${(batchProgress.current / batchProgress.total) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Dish Gallery Header & Category Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <Filter className="w-3.5 h-3.5 text-neutral-500 shrink-0 mr-1" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm'
                    : 'bg-neutral-900/80 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800'
                }`}
              >
                {cat}
                {cat !== 'All' && (
                  <span className="ml-1.5 opacity-60 text-[10px]">
                    ({dishes.filter((d) => d.category === cat).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="text-xs text-neutral-400 flex items-center gap-2 self-end sm:self-auto">
            <span>Showing {filteredDishes.length} dishes</span>
            {photographedCount > 0 && (
              <button
                onClick={() => setIsLookbookOpen(true)}
                className="text-amber-400 hover:underline font-medium flex items-center gap-1"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>View Lookbook</span>
              </button>
            )}
          </div>
        </div>

        {/* Dish Grid */}
        {filteredDishes.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-neutral-800 rounded-2xl bg-neutral-950/40">
            <UtensilsCrossed className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-neutral-300 mb-1">No dishes in this category</h3>
            <p className="text-xs text-neutral-500 mb-4">Choose another filter or import a new menu.</p>
            <button
              onClick={() => setSelectedCategory('All')}
              className="px-3.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium rounded-lg"
            >
              Show All Dishes
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDishes.map((dish) => (
              <DishCard
                key={dish.id}
                dish={dish}
                currentStyle={currentStyle}
                imageSize={imageSize}
                onPhotograph={handlePhotographDish}
                onOpenEdit={(d) => setEditingDish(d)}
                onOpenLightbox={(d) => setLightboxDish(d)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-neutral-800/80 py-8 bg-neutral-950/60 text-center text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-amber-500" />
            <span className="font-serif text-neutral-300 font-bold">Aperture & Appetite</span>
            <span>— Virtual Food Photographer Studio</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Model: gemini-3-pro-image-preview</span>
            <span>•</span>
            <span>Editor: gemini-nano-banana-2.1</span>
            <span>•</span>
            <span>Res: 1K / 2K / 4K</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <MenuImporter
        isOpen={isMenuImportOpen}
        onClose={() => setIsMenuImportOpen(false)}
        onMenuLoaded={handleMenuLoaded}
      />

      <PhotoEditModal
        isOpen={Boolean(editingDish)}
        onClose={() => setEditingDish(null)}
        dish={editingDish}
        onSaveEditedPhoto={handleSaveEditedPhoto}
      />

      <LightboxModal
        isOpen={Boolean(lightboxDish)}
        onClose={() => setLightboxDish(null)}
        dish={lightboxDish}
        onOpenEdit={(d) => {
          setLightboxDish(null);
          setEditingDish(d);
        }}
      />

      <MenuLookbookModal
        isOpen={isLookbookOpen}
        onClose={() => setIsLookbookOpen(false)}
        restaurantName={restaurantName}
        cuisineType={cuisineType}
        dishes={dishes}
      />
    </div>
  );
}
