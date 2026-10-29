import React, { useState } from 'react';
import { Sparkles, Sun, Moon, Instagram, Sliders, ChevronDown, ChevronUp, Wine, Flame, Eye } from 'lucide-react';

export type FoodStyle = 'rustic-dark' | 'bright-modern' | 'social-media';

interface StyleSelectorProps {
  currentStyle: FoodStyle;
  onSelectStyle: (style: FoodStyle) => void;
  aspectRatio: string;
  setAspectRatio: (ratio: string) => void;
  cameraSettings: {
    angle: string;
    depthOfField: string;
    surface: string;
    extras: string[];
  };
  setCameraSettings: React.Dispatch<React.SetStateAction<{
    angle: string;
    depthOfField: string;
    surface: string;
    extras: string[];
  }>>;
}

export const STYLES: {
  id: FoodStyle;
  label: string;
  subtitle: string;
  badge: string;
  icon: React.ElementType;
  accentColor: string;
  lighting: string;
  surface: string;
  vibe: string;
}[] = [
  {
    id: 'rustic-dark',
    label: 'Rustic / Dark',
    subtitle: 'Chiaroscuro & Earthy Cellar',
    badge: 'Moody & Warm',
    icon: Moon,
    accentColor: 'from-amber-950 via-neutral-900 to-amber-900/60',
    lighting: 'Low-key side lighting with softbox, deep velvety shadows, warm golden rim lights',
    surface: 'Charred reclaimed wood, dark textured slate or slate slab',
    vibe: 'Artisan trattoria, rich cozy textures, atmospheric candlelit dining',
  },
  {
    id: 'bright-modern',
    label: 'Bright / Modern',
    subtitle: 'Nordic Clean & Fine Dining',
    badge: 'Luminous & Crisp',
    icon: Sun,
    accentColor: 'from-sky-950 via-neutral-900 to-amber-900/30',
    lighting: 'High-key natural morning daylight, soft diffuse fill, clean crisp highlights',
    surface: 'Honed white Carrara marble or matte speckled stoneware',
    vibe: 'Michelin star, modern minimalism, vibrant colors, airy negative space',
  },
  {
    id: 'social-media',
    label: 'Social Media (Top-Down)',
    subtitle: 'Flat Lay 90° Overhead Spread',
    badge: 'Viral & Editorial',
    icon: Instagram,
    accentColor: 'from-rose-950 via-neutral-900 to-purple-900/40',
    lighting: 'Bright, even studio illumination highlighting textures and glossy garnishes',
    surface: '90° bird’s-eye overhead table with side ramekins, artisan bread & cocktail',
    vibe: 'Instagram & TikTok foodie spread, dynamic geometry, editorial lifestyle',
  },
];

const ASPECT_RATIOS = [
  { id: '1:1', label: '1:1 Square', desc: 'Feed & Dish Thumbnail' },
  { id: '4:3', label: '4:3 Classic', desc: 'Editorial & Menu Card' },
  { id: '3:4', label: '3:4 Portrait', desc: 'Vertical Mobile Menu' },
  { id: '16:9', label: '16:9 Banner', desc: 'Website & App Header' },
  { id: '9:16', label: '9:16 Story', desc: 'Instagram / Reels' },
];

const SURFACES = [
  'Dark Textured Slate Slab',
  'Charred Reclaimed Oak',
  'White Honed Carrara Marble',
  'Rustic Terracotta Stone',
  'Parisian Bistro Paper & Brass',
];

const PROPS_LIST = [
  'Gourmet Steam Rising',
  'Matching Wine / Beverage Glass',
  'Flaked Maldon Sea Salt Dusting',
  'Fresh Cut Microgreens & Herbs',
  'Artisan Olive Oil Drizzle Drops',
  'Warm Candlelight Flicker',
];

export const StyleSelector: React.FC<StyleSelectorProps> = ({
  currentStyle,
  onSelectStyle,
  aspectRatio,
  setAspectRatio,
  cameraSettings,
  setCameraSettings,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const toggleProp = (prop: string) => {
    setCameraSettings((prev) => {
      const exists = prev.extras.includes(prop);
      return {
        ...prev,
        extras: exists ? prev.extras.filter((p) => p !== prop) : [...prev.extras, prop],
      };
    });
  };

  return (
    <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-5 mb-8 backdrop-blur-sm">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-mono tracking-wider text-amber-500 font-semibold">
              Studio Aesthetic Toggles
            </span>
            <span className="text-xs text-neutral-500">• Choose your restaurant's visual signature</span>
          </div>
          <h2 className="text-lg font-bold text-white font-serif tracking-tight mt-0.5">
            Culinary Photography Style
          </h2>
        </div>

        {/* Aspect Ratio quick selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs text-neutral-400 font-medium whitespace-nowrap mr-1">Aspect:</span>
          {ASPECT_RATIOS.map((ratio) => (
            <button
              key={ratio.id}
              onClick={() => setAspectRatio(ratio.id)}
              className={`px-2.5 py-1 text-xs rounded-lg border font-mono transition-all whitespace-nowrap ${
                aspectRatio === ratio.id
                  ? 'bg-neutral-800 text-amber-300 border-amber-500/50 shadow-sm'
                  : 'bg-neutral-950/60 text-neutral-400 border-neutral-800 hover:text-white hover:border-neutral-700'
              }`}
              title={ratio.desc}
            >
              {ratio.id}
            </button>
          ))}
        </div>
      </div>

      {/* 3 Main Style Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {STYLES.map((style) => {
          const Icon = style.icon;
          const isSelected = currentStyle === style.id;
          return (
            <button
              key={style.id}
              onClick={() => onSelectStyle(style.id)}
              className={`text-left relative p-4 rounded-xl border transition-all duration-200 overflow-hidden group ${
                isSelected
                  ? 'border-amber-500/80 bg-gradient-to-br ' +
                    style.accentColor +
                    ' ring-2 ring-amber-500/30 shadow-lg shadow-amber-950/20'
                  : 'border-neutral-800 bg-neutral-950/40 hover:border-neutral-700 hover:bg-neutral-900/60'
              }`}
            >
              {/* Top Row: Icon + Label + Badge */}
              <div className="flex items-start justify-between mb-2.5">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-amber-500 text-neutral-950 font-bold'
                        : 'bg-neutral-800 text-neutral-300 group-hover:text-amber-400'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3
                      className={`text-sm font-bold tracking-tight ${
                        isSelected ? 'text-white' : 'text-neutral-200'
                      }`}
                    >
                      {style.label}
                    </h3>
                    <p className="text-xs text-neutral-400">{style.subtitle}</p>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                    isSelected
                      ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                      : 'bg-neutral-800/80 text-neutral-400 border-neutral-700/60'
                  }`}
                >
                  {style.badge}
                </span>
              </div>

              {/* Characteristics breakdown */}
              <p className="text-xs text-neutral-300/90 leading-relaxed mb-2 font-sans line-clamp-2">
                {style.vibe}
              </p>

              <div className="pt-2 border-t border-neutral-800/60 flex items-center justify-between text-[11px] text-neutral-400">
                <span className="truncate max-w-[190px]">💡 {style.lighting.split(',')[0]}</span>
                <span
                  className={`text-[11px] font-medium transition-colors ${
                    isSelected ? 'text-amber-400' : 'text-neutral-500 group-hover:text-neutral-300'
                  }`}
                >
                  {isSelected ? '● Active Style' : 'Click to select'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Advanced Studio Lighting & Props Drawer Toggle */}
      <div className="mt-4 pt-3 border-t border-neutral-800/80">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center justify-between w-full text-xs text-neutral-400 hover:text-amber-300 transition-colors py-1"
        >
          <span className="flex items-center gap-1.5 font-medium">
            <Sliders className="w-3.5 h-3.5 text-amber-500" />
            <span>Studio Camera, Plating & Atmosphere Controls</span>
            {cameraSettings.extras.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-md bg-amber-500/20 text-amber-300 text-[10px] border border-amber-500/30">
                {cameraSettings.extras.length} props active
              </span>
            )}
          </span>
          {showAdvanced ? (
            <ChevronUp className="w-4 h-4 text-neutral-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-neutral-500" />
          )}
        </button>

        {showAdvanced && (
          <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-neutral-800/60 text-xs">
            {/* Camera Angle */}
            <div>
              <label className="block text-neutral-400 font-medium mb-1.5">
                Camera Angle:
              </label>
              <select
                value={cameraSettings.angle}
                onChange={(e) =>
                  setCameraSettings((prev) => ({ ...prev, angle: e.target.value }))
                }
                className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-lg p-2 text-xs focus:border-amber-500 outline-none"
              >
                <option value="45-degree angled hero culinary shot">45° Hero Angle (Standard commercial)</option>
                <option value="Direct 90-degree top-down bird's-eye flat lay">90° Top-Down Flat Lay</option>
                <option value="Low eye-level intimate tabletop shot">Low Eye-Level (Intimate drama)</option>
                <option value="105mm macro close-up focus on food texture">105mm Macro (Texture close-up)</option>
              </select>
            </div>

            {/* Surface Material */}
            <div>
              <label className="block text-neutral-400 font-medium mb-1.5">
                Table Surface Texture:
              </label>
              <select
                value={cameraSettings.surface}
                onChange={(e) =>
                  setCameraSettings((prev) => ({ ...prev, surface: e.target.value }))
                }
                className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-lg p-2 text-xs focus:border-amber-500 outline-none"
              >
                {SURFACES.map((surf) => (
                  <option key={surf} value={surf}>
                    {surf}
                  </option>
                ))}
              </select>
            </div>

            {/* Atmosphere & Prop Chips */}
            <div>
              <label className="block text-neutral-400 font-medium mb-1.5">
                Styling Props & Atmosphere:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {PROPS_LIST.map((prop) => {
                  const active = cameraSettings.extras.includes(prop);
                  return (
                    <button
                      key={prop}
                      onClick={() => toggleProp(prop)}
                      className={`px-2 py-1 text-[11px] rounded-md transition-all ${
                        active
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-medium'
                          : 'bg-neutral-950 text-neutral-400 border border-neutral-800 hover:border-neutral-700 hover:text-neutral-200'
                      }`}
                    >
                      {active ? '✓ ' : '+ '}
                      {prop}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
