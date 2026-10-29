export interface DishItem {
  id: string;
  name: string;
  category: string;
  description: string;
  price?: string;
  keyIngredients: string[];
  visualPlatingNotes: string;
  suggestedGarnish?: string;
  suggestedDrinkPairing?: string;
  photoUrl?: string;
  photoStyle?: 'rustic-dark' | 'bright-modern' | 'social-media' | 'custom';
  photoModel?: string;
  photoSize?: '1K' | '2K' | '4K';
  editHistory?: { prompt: string; photoUrl: string; timestamp: number }[];
  isGenerating?: boolean;
}

export interface SampleMenu {
  id: string;
  name: string;
  tagline: string;
  cuisine: string;
  badge: string;
  rawText: string;
}

export const SAMPLE_MENUS: SampleMenu[] = [
  {
    id: 'osteria-tartufo',
    name: 'Osteria del Tartufo',
    tagline: 'Artisanal Tuscan Cellar & Truffle House',
    cuisine: 'Tuscan Fine Dining',
    badge: 'Artisan Italian',
    rawText: `OSTERIA DEL TARTUFO — FIRENZE
AUTUMN HARVEST TASTING MENU

ANTIPASTI
Burrata Pugliese con Fichi Arrostiti - $24
Creamy 250g pugliese burrata cheese, caramelized mission figs, 25-year aged Modena balsamic glaze, toasted pine nuts, crispy sage leaves.

Battuta di Fassona al Tartufo Nero - $28
Hand-cut Piedmontese beef tartare, shaved black winter truffle, cured egg yolk shavings, micro arugula, crispy caper berries, grilled sea salt focaccia.

PRIMI PIATTI
Tagliolini al Tartufo Bianco d'Alba - $46
House-made egg tagliolini pasta spun in mountain butter and 36-month Parmigiano-Reggiano, crowned with generous tableside shaved white Alba truffle petals.

Risotto ai Funghi Porcini & Midollo - $34
Acquerello aged carnaroli risotto, foraged woodland porcini mushrooms, roasted bone marrow glaze, crispy thyme, parmigiano crust.

SECONDI
Bistecca alla Fiorentina Tagliata - $58
Wood-fire charred Chianina dry-aged ribeye steak, flaked Maldon smoked sea salt, rosemary-infused Tuscan olive oil drizzle, blistered vine cherry tomatoes.

DOLCI
Tiramisù Tradizionale al Mascarpone - $16
Espresso-soaked savoiardi biscuits, whipped mascarpone zabaione cream, Valrhona 70% dark cocoa dusting, bittersweet chocolate curls.`,
  },
  {
    id: 'aura-omakase',
    name: 'AURA Omakase',
    tagline: 'Contemporary Tokyo Kaiseki & Edomae Craft',
    cuisine: 'Modern Japanese Omakase',
    badge: 'Tokyo Minimalist',
    rawText: `AURA OMAKASE TOKYO
NIGHT CHEF SELECTION

ZENSAI (APPETIZERS)
Hokkaido Scallop Crudo with Yuzu Kosho - $26
Thinly sliced diver scallop, fresh white yuzu pearls, micro shiso leaves, house dashi jelly, edible purple borage blossoms.

Toro Caviar Tartare - $38
Fatty bluefin tuna belly minced with scallion oil, topped with Royal Osetra caviar and 24k edible gold leaf flakes, served with crispy nori crisps.

EDOMAE SUSHI & ROBATA
A5 Miyazaki Wagyu Nigiri - $42
Lightly torched A5 Wagyu striploin, nikiri soy reduction, fresh grated Shizuoka wasabi root, smoked sea salt crystals on warm seasoned sushi rice.

King Salmon Belly Aburi - $32
Seared New Zealand Ora King salmon belly with truffle ponzu emulsion, micro chives, and toasted white sesame seeds.

DESSERT
Matcha Opera Cake with Black Sesame Gelato - $18
Multi-layered Uji ceremonial grade matcha sponge, dark chocolate ganache, kinako dust, paired with velvety roasted black sesame gelato.`,
  },
  {
    id: 'cantina-fuego',
    name: 'Cantina Fuego & Mezcal Bar',
    tagline: 'Ancestral Oaxacan Flame & Coastal Antojitos',
    cuisine: 'Contemporary Mexican',
    badge: 'Vibrant Latin',
    rawText: `CANTINA FUEGO — OAXACA & BAJA
DINNER SELECTION

ENTRADAS
Charred Pulpo Tostada - $22
Wood-grilled octopus tentacle glazed in pasilla chile, avocado-serrano crema, pickled red onions, cilantro sprouts, crisp blue corn heirloom tostada.

Guacamole Rustico con Granada - $16
Molcajete-smashed Hass avocados, charred jalapeño, lime juice, sweet pomegranate jewels, queso fresco crumble, house heirloom corn totopos.

PLATOS FUERTES
Short Rib Birria con Consomé - $32
Slow-braised beef short rib in 3-chile adobo, melted Oaxaca cheese, crispy griddled corn tortillas, piping hot savory consomé dipping broth with lime & cilantro.

Wood-Fired Pescado a la Talla - $36
Butterflied local red snapper split with dual marinades: red guajillo chile rub and green herb mojo, grilled over red oak with warm handmade corn tortillas.

POSTRES
Churros Rellenos con Dulce de Leche - $14
Crispy cinnamon-sugar dusted golden churros filled with warm goat milk cajeta, paired with spiced Mexican dark chocolate dipping ganache.`,
  },
  {
    id: 'botanica-hearth',
    name: 'Botanica & Hearth',
    tagline: 'Plant-Forward Farmstead & Wild Foraged Kitchen',
    cuisine: 'Nordic Plant-Based Fine Dining',
    badge: 'Clean Gourmet',
    rawText: `BOTANICA & HEARTH
AUTUMN CELLAR & FIELD MENU

STARTERS
Smoked Golden Beet Tartare - $20
Slow-roasted and applewood smoked golden beets, caper relish, fermented mustard seed caviar, dill oil pool, served with seeded sourdough crackers.

Charred Maitake with Hazelnut Velouté - $22
Wood-fired wild maitake mushroom clusters, toasted Oregon hazelnut velouté, pickled mountain blackberries, fresh thyme blossoms.

MAINS
Wild Morel & Spelt Berry Risotto - $30
Creamy sprouted spelt berries simmered in woodland mushroom broth, glazed morels, roasted sunchoke chips, shaved black winter truffle.

Roasted Cauliflower Steak with Chimichurri Verde - $26
Cast-iron seared Romanesco cauliflower steak over velvety parsnip puree, charred lemon emulsion, vibrant herb chimichurri drizzle.

DESSERT
Sea Buckthorn Tart with Oat Sorbet - $16
Crisp almond flour pastry shell, tart golden sea buckthorn curd, torched Swiss meringue peaks, wildflower honey oat milk sorbet.`,
  },
];
