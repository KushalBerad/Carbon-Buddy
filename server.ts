import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

// Load environmental parameters
dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Gemini API client
const aiParams: { apiKey?: string; httpOptions: { headers: { 'User-Agent': string } } } = {
  httpOptions: {
    headers: {
      'User-Agent': 'carbon-buddy-app',
    },
  },
};

if (process.env.GEMINI_API_KEY) {
  aiParams.apiKey = process.env.GEMINI_API_KEY;
}

const ai = new GoogleGenAI(aiParams);

// API Route: AI Coach Chat Session Proxy
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message payload is required' });
    }

    // Server-side robust heuristic to detect gibberish or low-confidence queries
    const isGibberish = (str: string): boolean => {
      const cleaned = str.trim().toLowerCase();
      if (!cleaned) return true;
      if (!/[a-z]/i.test(cleaned)) return true;

      const words = cleaned.replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean);
      if (words.length === 0) return true;

      for (const word of words) {
        if (word.length >= 6 && !/^[0-9]+$/.test(word)) {
          const vowels = word.match(/[aeiouy]/g);
          const vowelCount = vowels ? vowels.length : 0;
          if (vowelCount === 0 || vowelCount / word.length < 0.20 || /[bcdfghjklmnpqrstvwxyz]{5,}/i.test(word)) {
            const safeWords = ['transport', 'transit', 'through', 'lifestyle', 'strength'];
            if (!safeWords.includes(word)) {
              return true;
            }
          }
        }
      }

      const mashProfiles = ['asdf', 'qwerty', 'zxcv', 'jkl;', 'xyz', 'qwe', 'asd', 'zxc'];
      if (words.some(w => mashProfiles.some(p => w.includes(p)))) {
        return true;
      }

      return false;
    };

    if (isGibberish(message)) {
      return res.json({
        text: `I could not fully understand your question.

Try asking things like:

• How can I reduce my carbon footprint?
• What food choices lower emissions?
• Eco-friendly commuting alternatives?
• How can I save energy at home?`
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ 
        error: 'No GEMINI_API_KEY found in the environment. Please configure it in your Secrets menu.' 
      });
    }

// System prompt for sustainability assistant
    const systemPrompt = `You are Carbon Buddy's friendly staff sustainability coach. 
Your objective is to help the user reduce their carbon footprint through small, incremental, realistic lifestyle choices.
Do not prescribe dramatic, clinical or stressful changes. Instead, provide encouraging, affordable, and practical guidance.
The user's current profile may include transport, diet, or energy baselines; tailor your answers keeping these in mind.

CRITICALLY IMPORTANT FOR USER TRUST:
If the user's input/query is gibberish, clear keyboard mashing (such as "akjsdhasjdh"), random letters/symbols, off-topic or completely nonsensical/low-confidence queries, you MUST NOT try to answer/hallucinate or provide a forced sustainability tip.
Instead, you MUST respond EXACTLY with the following message:
"I could not fully understand your question.

Try asking things like:

• How can I reduce my carbon footprint?
• What food choices lower emissions?
• Eco-friendly commuting alternatives?
• How can I save energy at home?"
Do not add any other pleasantries, apologies, or feedback. Respond exactly with that message if the input is low-confidence or gibberish.`;

    // Map history to the required format for chat
    const chat = ai.chats.create({
      model: 'gemini-3.5-flash',
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    // Send single or context-rich message
    let response;
    if (history && history.length > 0) {
      // Re-query or seed the conversation if needed, or simply send the message in context.
      // For simple stateless chat proxy, you can pass previous contents as text references
      const promptContext = `Recent conversation references:\n${history.map((h: any) => `${h.role === 'model' ? 'AI' : 'User'}: ${h.content}`).join('\n')}\n\nLatest User query: ${message}`;
      response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: promptContext,
        config: {
          systemInstruction: systemPrompt,
        }
      });
    } else {
      response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: message,
        config: {
          systemInstruction: systemPrompt,
        }
      });
    }

    res.json({ text: response.text });
  } catch (error: any) {
    console.error('Gemini Chat Error:', error);
    res.status(500).json({ error: error.message || 'Failed to complete coaching response' });
  }
});

// API Route: Weekly AI Analytical Reflection
app.post('/api/gemini/reflection', async (req, res) => {
  try {
    const { name, dietPreference, commuteMode, totalSavedCarbon } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ 
        error: 'No GEMINI_API_KEY configured. Please install one in the application Secrets pane.' 
      });
    }

    const systemPrompt = `You are Carbon Buddy's AI analytical scoring engine.
Given the user's weekly metrics, generate a concise coaching report as well as sector performance ratings (0 to 100).
Prepare the response in serialized clean JSON conforming exactly to the following properties:
- scoreDiet: integer (score 10 to 100 on vegetarian/vegan alignment)
- scoreCommute: integer (score 10 to 100 public transport transit/biking alignment)
- scoreEnergy: integer (score 10 to 100 appliance optimization)
- aiFeedback: a friendly, highly-specific summary paragraph directing the user toward small improvements next week.`;

    const userStatsContext = `User Profile Context:
- Name: ${name || 'Eco Partner'}
- Diet Choice: ${dietPreference || 'Standard'}
- Transits Commute: ${commuteMode || 'Standard'}
- Estimated metric Carbon Saved this cycle: ${totalSavedCarbon || 0}g CO₂`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: userStatsContext,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            scoreDiet: { type: Type.INTEGER, description: 'Evaluation score of the diet sector' },
            scoreCommute: { type: Type.INTEGER, description: 'Evaluation score of travel sector' },
            scoreEnergy: { type: Type.INTEGER, description: 'Evaluation score of power savings' },
            aiFeedback: { type: Type.STRING, description: 'Sincere coaching recommendation text under 80 words' },
          },
          required: ['scoreDiet', 'scoreCommute', 'scoreEnergy', 'aiFeedback'],
        },
      },
    });

    res.json(JSON.parse(response.text || '{}'));
  } catch (err: any) {
    console.error('Reflection Generation Error:', err);
    res.status(500).json({ error: err.message || 'Failed to retrieve reflection report' });
  }
});

// AI meal recommendation endpoint
app.post('/api/gemini/meal', async (req, res) => {
  try {
    const { ingredient } = req.body;
    if (!ingredient) {
      return res.status(400).json({ error: 'Base ingredient is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ 
        error: 'No GEMINI_API_KEY configured. Please register one in Settings secrets.' 
      });
    }

    const systemPrompt = `You are Carbon Buddy's eco-culinary guide.
Suggest a healthy, vegan, or highly eco-friendly replacement option for the requested ingredient.
Format your answer in clean JSON strictly with these fields:
- alternativeName: name of the green culinary ingredient
- shortImpactDescription: explain briefly why it is better, carbon-wise, in under 30 words
- carbonOffsetGrams: approximate grams of carbon saved of this swapping (e.g. integer between 200 and 1500)
- priceSavedUSD: financial dollars saved in a single swap session (float between 1.00 and 6.00)`;

    const query = `Propose an alternative for: "${ingredient}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: query,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            alternativeName: { type: Type.STRING, description: 'The plant ingredient alternative' },
            shortImpactDescription: { type: Type.STRING, description: 'Brief carbon footprint advantage text' },
            carbonOffsetGrams: { type: Type.INTEGER, description: 'Grams of CO2 offset' },
            priceSavedUSD: { type: Type.NUMBER, description: 'USD dollars saved' },
          },
          required: ['alternativeName', 'shortImpactDescription', 'carbonOffsetGrams', 'priceSavedUSD'],
        },
      },
    });

    res.json(JSON.parse(response.text || '{}'));
  } catch (error: any) {
    console.error('Formulation Error:', error);
    res.status(500).json({ error: error.message || 'Failed to suggest culinary replacement' });
  }
});

// Integrate Vite Middleware for Client serving
async function setupViteMiddleware() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Vite middleware is mounted in development environment');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Serving production static files from dist/');
  }

  app.listen(PORT, () => {
    console.log(`Carbon Buddy Server running on port ${PORT}`);
  });
}

setupViteMiddleware().catch((err) => {
  console.error('Fatal dev server launch error:', err);
});
