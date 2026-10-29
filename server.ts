import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Body parser with 50mb limit for base64 image payloads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Server-side Google GenAI initialization
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Menu parsing endpoint using gemini-3.8-flash with JSON schema
app.post('/api/menu/parse', async (req, res) => {
  try {
    const { menuText } = req.body;
    if (!menuText || typeof menuText !== 'string' || !menuText.trim()) {
      return res.status(400).json({ error: 'Please provide raw menu text to parse.' });
    }

    const prompt = `You are a world-class restaurant culinary consultant and food stylist.
Analyze the following restaurant menu text and extract all dishes into structured data.
For every dish, provide accurate culinary visual details that can be used for commercial food photography styling.

Menu Text:
"""
${menuText.slice(0, 15000)}
"""`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            restaurantName: { type: Type.STRING, description: 'Inferred or stated restaurant name' },
            cuisineType: { type: Type.STRING, description: 'Cuisine style (e.g., Italian Fine Dining, Japanese Omakase, Neo-Nordic, Modern Mexican)' },
            dishes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING, description: 'Unique slug or ID' },
                  name: { type: Type.STRING, description: 'Dish name' },
                  category: { type: Type.STRING, description: 'Category e.g. Starters & Crudo, Handmade Pasta, Mains, Wood-Fired, Desserts, Cocktails' },
                  description: { type: Type.STRING, description: 'Menu description' },
                  price: { type: Type.STRING, description: 'Price if present, e.g. $28 or €24' },
                  keyIngredients: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: '3-6 core ingredients visible or essential to the dish',
                  },
                  visualPlatingNotes: {
                    type: Type.STRING,
                    description: 'Detailed professional food styling description (plating style, vessel, garnishes, sauce drizzle, textures, steam, char marks, microgreens)',
                  },
                  suggestedGarnish: { type: Type.STRING, description: 'Artisanal garnish recommendation' },
                  suggestedDrinkPairing: { type: Type.STRING, description: 'Suggested wine, cocktail, or beverage pairing' },
                },
                required: ['id', 'name', 'category', 'description', 'keyIngredients', 'visualPlatingNotes'],
              },
            },
          },
          required: ['restaurantName', 'cuisineType', 'dishes'],
        },
      },
    });

    const parsedData = JSON.parse(response.text || '{}');
    return res.json(parsedData);
  } catch (error: any) {
    console.error('Menu parsing error:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to parse menu text with Gemini.',
    });
  }
});

// Helper to construct rich culinary photography prompts based on selected style & camera controls
function buildCulinaryPrompt(dish: any, style: string, customDetails?: string, cameraSettings?: any): string {
  const dishName = dish.name || 'Artisan Culinary Dish';
  const description = dish.description || '';
  const ingredients = Array.isArray(dish.keyIngredients) ? dish.keyIngredients.join(', ') : '';
  const plating = dish.visualPlatingNotes || 'elegantly plated on artisanal ceramic tableware';

  let styleDescriptor = '';
  if (style === 'rustic-dark') {
    styleDescriptor = `
- STYLE: Rustic/Dark (Moody Chiaroscuro & Earthy Atmosphere)
- LIGHTING: Low-key dramatic chiaroscuro side lighting from a single diffused softbox window, rich velvety deep shadows with warm golden rim accents catching texture and glistening oils.
- TABLE & ENVIRONMENT: Dark textured slate, charred reclaimed wood or weathered dark granite slab. Crumpled charcoal linen napkin, antique hand-forged brass or pewter silverware, delicate scattering of coarse sea salt crystals and cracked peppercorns.
- TONE & COLOR: Warm earthy tones, deep burnt umbers, moody shadows, rich contrast, tactile and cozy restaurant ambiance.
- COMPOSITION: 45-degree angle medium shot with shallow depth of field, creamy bokeh in the background with subtle ambient candle flicker.`;
  } else if (style === 'bright-modern') {
    styleDescriptor = `
- STYLE: Bright/Modern (Airy Fine-Dining & Scandinavian Minimalism)
- LIGHTING: Crisp, diffused natural high-key morning daylight, soft airy ambient illumination, clean minimal shadows.
- TABLE & ENVIRONMENT: Honed white Carrara marble or light terrazzo stone table, minimalist matte chalk-white or stoneware ceramic plates, sleek contemporary cutlery, subtle sprig of fresh herb or micro-droplets of virgin olive oil.
- TONE & COLOR: Clean, luminous, fresh, vibrant organic colors with pristine highlights, modern luxury Michelin-star aesthetic.
- COMPOSITION: Sophisticated 45-degree angled shot, refined negative space, razor-sharp focus on the dish surface with smooth gentle focus roll-off.`;
  } else if (style === 'social-media') {
    styleDescriptor = `
- STYLE: Social Media Flat-Lay (Direct Top-Down 90-Degree Overhead View)
- LIGHTING: Bright, even, vibrant food-styling studio lighting with soft diffused shadows and sparkling appetizing highlights.
- TABLE & ENVIRONMENT: 90-degree bird's-eye overhead perspective. Centered hero plate surrounded by an appetizing lifestyle table spread: a small ramekin of artisan dip or sauce, rustic sliced sourdough with visible airy crumb, a matching beverage or cocktail with citrus/herb garnish, linen napkin draped casually, angled cutlery.
- TONE & COLOR: High energy, punchy saturated colors, crisp appetizing textures, Instagram/TikTok viral editorial food photography.
- COMPOSITION: Perfect flat lay composition, balanced geometry, modern editorial foodie magazine spread.`;
  } else {
    styleDescriptor = `
- STYLE: Commercial Gourmet Culinary Photography
- LIGHTING: Balanced professional three-point food studio lighting highlighting gloss, steam, and vibrant colors.
- TABLE & ENVIRONMENT: Premium restaurant table setting, clean artisan dinnerware, complementary styling accessories.`;
  }

  // Camera settings addition
  let cameraNotes = '';
  if (cameraSettings) {
    if (cameraSettings.angle) {
      cameraNotes += `\n- CAMERA ANGLE: ${cameraSettings.angle}`;
    }
    if (cameraSettings.depthOfField) {
      cameraNotes += `\n- DEPTH OF FIELD: ${cameraSettings.depthOfField}`;
    }
    if (cameraSettings.surface) {
      cameraNotes += `\n- SURFACE MATERIAL: ${cameraSettings.surface}`;
    }
    if (cameraSettings.extras && cameraSettings.extras.length > 0) {
      cameraNotes += `\n- ATMOSPHERE & PROPS: ${cameraSettings.extras.join(', ')}`;
    }
  }

  const customText = customDetails && customDetails.trim() ? `\n- CHEF STYLING INSTRUCTION: ${customDetails.trim()}` : '';

  return `Commercial Michelin-grade culinary food photography of "${dishName}".
Dish Description: ${description}
Core Ingredients: ${ingredients}
Plating and Textures: ${plating}
${styleDescriptor}
${cameraNotes}
${customText}

TECHNICAL QUALITY: Masterpiece commercial food photography shot on Hasselblad H6D-100c medium format camera with 80mm f/2.8 lens. Incredible textural detail: glistening juices, moisture condensation, crisp edges, velvety sauce emulsions, vibrant natural ingredients, mouthwatering and photorealistic. No cartoonish elements, no artificial plastic look. Realistic gourmet dining food presentation.`;
}

// Generate food photography using gemini-3-pro-image-preview (with 1K, 2K, 4K affordance)
app.post('/api/photos/generate', async (req, res) => {
  try {
    const {
      dish,
      style = 'rustic-dark',
      imageSize = '1K',
      aspectRatio = '1:1',
      customDetails = '',
      cameraSettings = {},
      requestedModel = 'gemini-3-pro-image-preview',
    } = req.body;

    if (!dish || !dish.name) {
      return res.status(400).json({ error: 'Missing dish details.' });
    }

    // Validate image size (1K, 2K, 4K)
    const validSizes = ['1K', '2K', '4K'];
    const chosenSize = validSizes.includes(imageSize) ? imageSize : '1K';

    // Validate aspect ratio
    const validRatios = ['1:1', '4:3', '3:4', '16:9', '9:16'];
    const chosenRatio = validRatios.includes(aspectRatio) ? aspectRatio : '1:1';

    const fullPrompt = buildCulinaryPrompt(dish, style, customDetails, cameraSettings);

    // Primary attempt using requested model (gemini-3-pro-image-preview)
    let modelToUse = requestedModel || 'gemini-3-pro-image-preview';
    let imageBuffer: string | null = null;
    let mimeType = 'image/png';
    let usedModel = modelToUse;
    let fallbackNotice = '';

    try {
      console.log(`[Photo Gen] Calling ${modelToUse} with size: ${chosenSize}, ratio: ${chosenRatio}...`);
      const response = await ai.models.generateContent({
        model: modelToUse,
        contents: {
          parts: [{ text: fullPrompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: chosenRatio as any,
            imageSize: chosenSize as any,
          },
        },
      });

      const parts = response.candidates?.[0]?.content?.parts || [];
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          imageBuffer = part.inlineData.data;
          if (part.inlineData.mimeType) mimeType = part.inlineData.mimeType;
          break;
        }
      }
    } catch (primaryErr: any) {
      console.warn(`[Photo Gen] Primary model ${modelToUse} error:`, primaryErr?.message || primaryErr);
      fallbackNotice = `Primary model ${modelToUse} was unavailable (${primaryErr?.message?.slice(0, 80) || 'quota/access'}). Attempting fallback...`;

      // Fallback 1: Try gemini-nano-banana-2.1
      try {
        usedModel = 'gemini-nano-banana-2.1';
        console.log(`[Photo Gen] Attempting fallback with ${usedModel}...`);
        const fallbackRes = await ai.models.generateContent({
          model: usedModel,
          contents: {
            parts: [{ text: fullPrompt }],
          },
          config: {
            imageConfig: {
              aspectRatio: chosenRatio as any,
              imageSize: chosenSize as any,
            },
          },
        });
        const parts = fallbackRes.candidates?.[0]?.content?.parts || [];
        for (const part of parts) {
          if (part.inlineData && part.inlineData.data) {
            imageBuffer = part.inlineData.data;
            if (part.inlineData.mimeType) mimeType = part.inlineData.mimeType;
            break;
          }
        }
      } catch (nanoErr: any) {
        // Fallback 2: Try gemini-3.1-flash-lite-image
        console.warn(`[Photo Gen] Nano fallback error:`, nanoErr?.message || nanoErr);
        usedModel = 'gemini-3.1-flash-lite-image';
        console.log(`[Photo Gen] Attempting fallback with ${usedModel}...`);
        const liteRes = await ai.models.generateContent({
          model: usedModel,
          contents: {
            parts: [{ text: fullPrompt }],
          },
          config: {
            imageConfig: {
              aspectRatio: chosenRatio as any,
            },
          },
        });
        const parts = liteRes.candidates?.[0]?.content?.parts || [];
        for (const part of parts) {
          if (part.inlineData && part.inlineData.data) {
            imageBuffer = part.inlineData.data;
            if (part.inlineData.mimeType) mimeType = part.inlineData.mimeType;
            break;
          }
        }
      }
    }

    if (!imageBuffer) {
      return res.status(502).json({
        error: 'No image data returned from Gemini photography models. Please verify your API key.',
      });
    }

    const dataUrl = `data:${mimeType};base64,${imageBuffer}`;
    return res.json({
      imageUrl: dataUrl,
      mimeType,
      promptUsed: fullPrompt,
      modelUsed: usedModel,
      imageSize: chosenSize,
      aspectRatio: chosenRatio,
      fallbackNotice,
    });
  } catch (err: any) {
    console.error('Photo generation endpoint failed:', err);
    return res.status(500).json({
      error: err?.message || 'Food photo generation failed.',
    });
  }
});

// Edit existing image using gemini-nano-banana-2.1 with text prompts
app.post('/api/photos/edit', async (req, res) => {
  try {
    const {
      base64Image,
      mimeType = 'image/png',
      editPrompt,
      dishName = 'dish',
      aspectRatio = '1:1',
      imageSize = '1K',
    } = req.body;

    if (!base64Image) {
      return res.status(400).json({ error: 'Base64 image is required for editing.' });
    }
    if (!editPrompt || !editPrompt.trim()) {
      return res.status(400).json({ error: 'Please enter instructions on how to edit the photo.' });
    }

    // Strip data URL header if present
    const cleanBase64 = base64Image.replace(/^data:image\/[a-z]+;base64,/, '');
    const cleanMime = mimeType || 'image/png';

    const fullEditInstruction = `Professional commercial culinary photography edit for ${dishName}:
Instructions: ${editPrompt.trim()}
Preserve the core gourmet dish presentation, realistic culinary textures, high-end commercial food styling, mouth-watering highlights, and crisp focus.`;

    let usedModel = 'gemini-nano-banana-2.1';
    let newImageData: string | null = null;
    let newMimeType = cleanMime;

    try {
      console.log(`[Photo Edit] Calling gemini-nano-banana-2.1 with edit prompt...`);
      const response = await ai.models.generateContent({
        model: 'gemini-nano-banana-2.1',
        contents: {
          parts: [
            {
              inlineData: {
                data: cleanBase64,
                mimeType: cleanMime,
              },
            },
            {
              text: fullEditInstruction,
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: (aspectRatio || '1:1') as any,
            imageSize: (imageSize || '1K') as any,
          },
        },
      });

      const parts = response.candidates?.[0]?.content?.parts || [];
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          newImageData = part.inlineData.data;
          if (part.inlineData.mimeType) newMimeType = part.inlineData.mimeType;
          break;
        }
      }
    } catch (nanoErr: any) {
      console.warn('[Photo Edit] Nano banana error, trying gemini-3.1-flash-lite-image edit fallback:', nanoErr?.message || nanoErr);
      usedModel = 'gemini-3.1-flash-lite-image';
      const fallbackRes = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: cleanBase64,
                mimeType: cleanMime,
              },
            },
            {
              text: fullEditInstruction,
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: (aspectRatio || '1:1') as any,
          },
        },
      });

      const parts = fallbackRes.candidates?.[0]?.content?.parts || [];
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          newImageData = part.inlineData.data;
          if (part.inlineData.mimeType) newMimeType = part.inlineData.mimeType;
          break;
        }
      }
    }

    if (!newImageData) {
      return res.status(502).json({
        error: 'Could not generate edited photo. Please try a different prompt or check permissions.',
      });
    }

    const dataUrl = `data:${newMimeType};base64,${newImageData}`;
    return res.json({
      imageUrl: dataUrl,
      mimeType: newMimeType,
      editPrompt,
      modelUsed: usedModel,
    });
  } catch (err: any) {
    console.error('Photo edit endpoint error:', err);
    return res.status(500).json({
      error: err?.message || 'Failed to edit photo.',
    });
  }
});

// Vite middleware integration for dev mode or static files for production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`📸 Virtual Food Photographer Server running on http://0.0.0.0:${PORT} (env: ${process.env.NODE_ENV || 'development'})`);
  });
}

startServer();
