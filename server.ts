import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set in environment.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// POST /api/bust-jargon
app.post('/api/bust-jargon', async (req, res) => {
  try {
    const { text, tone } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ error: 'Please provide technical text, code, or documentation to explain.' });
    }

    if (text.length > 25000) {
      return res.status(400).json({ error: 'Text exceeds maximum length of 25,000 characters.' });
    }

    const ai = getGeminiClient();

    const systemPrompt = `You are an elite technical translator and AI Jargon Buster.
Your mission is to take complex technical documentation, code snippets, architectural RFCs, machine learning papers, or cryptic DevOps error messages, and translate them into crystal-clear explanations.

You must provide 3 distinct personas for the explanation:
1. "ELI5" (Explain Like I'm 5):
   - Use vivid, intuitive everyday analogies (like kitchen recipes, traffic lights, postal mail, toy blocks).
   - Zero condescension, warm and engaging tone.
   - Strip out obscure jargon or explain it with immediate metaphors.
2. "Executive Summary":
   - Tailored for CTOs, VPs of Engineering, and business leaders.
   - Focus on business value, architectural trade-offs, scalability, risk reduction, cost, operational complexity, and ROI.
   - Concise, bottom-line upfront (BLUF).
3. "Deep Technical Breakdown":
   - Tailored for Principal Engineers and systems architects.
   - Explain exact inner workings, protocols, memory/CPU behavior, concurrency models, guarantees, edge cases, failure states, and underlying algorithms.
   - Crisp, rigorous, and technically precise.

For each persona:
- Extract key jargon terms found in the input with their category (acronym, protocol, concept, architecture, buzzword), a plain-language definition, and a 1-sentence memorable analogy.
- Provide 3 punchy, high-impact key takeaways.
- Provide an estimated reading time.`;

    const userPrompt = `Analyze and de-jargonize the following technical text:

"""
${text}
"""

Extract the detected technical domain and an accurate 1-2 sentence original summary.
Provide full explanations for all 3 tones (eli5, executive, technical) according to the schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.3,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detectedDomain: {
              type: Type.STRING,
              description: 'e.g. Cloud Infrastructure, Machine Learning, Operating Systems, Database Internals',
            },
            originalSummary: {
              type: Type.STRING,
              description: 'A 1-2 sentence neutral summary of what the original text covers.',
            },
            explanations: {
              type: Type.OBJECT,
              properties: {
                eli5: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    coreExplanation: { type: Type.STRING, description: 'Plain English explanation using everyday analogies' },
                    analogy: { type: Type.STRING, description: 'The overarching memorable analogy used' },
                    keyTakeaways: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    readingTime: { type: Type.STRING, description: 'e.g., 2 min read' },
                    jargonTerms: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          term: { type: Type.STRING },
                          category: { type: Type.STRING, description: 'acronym | protocol | concept | architecture | buzzword' },
                          simpleDefinition: { type: Type.STRING },
                          analogy: { type: Type.STRING },
                        },
                        required: ['term', 'category', 'simpleDefinition', 'analogy'],
                      },
                    },
                  },
                  required: ['title', 'coreExplanation', 'analogy', 'keyTakeaways', 'readingTime', 'jargonTerms'],
                },
                executive: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    coreExplanation: { type: Type.STRING, description: 'Strategic overview focusing on architecture and value' },
                    businessImpact: { type: Type.STRING, description: 'Impact on cost, risk, velocity, or reliability' },
                    keyTakeaways: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    readingTime: { type: Type.STRING },
                    jargonTerms: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          term: { type: Type.STRING },
                          category: { type: Type.STRING },
                          simpleDefinition: { type: Type.STRING },
                          analogy: { type: Type.STRING },
                        },
                        required: ['term', 'category', 'simpleDefinition', 'analogy'],
                      },
                    },
                  },
                  required: ['title', 'coreExplanation', 'businessImpact', 'keyTakeaways', 'readingTime', 'jargonTerms'],
                },
                technical: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    coreExplanation: { type: Type.STRING, description: 'Deep technical explanation with mechanics and trade-offs' },
                    architectureMechanics: { type: Type.STRING, description: 'Low-level protocols, state flow, and execution model' },
                    keyTakeaways: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    readingTime: { type: Type.STRING },
                    jargonTerms: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          term: { type: Type.STRING },
                          category: { type: Type.STRING },
                          simpleDefinition: { type: Type.STRING },
                          analogy: { type: Type.STRING },
                        },
                        required: ['term', 'category', 'simpleDefinition', 'analogy'],
                      },
                    },
                  },
                  required: ['title', 'coreExplanation', 'architectureMechanics', 'keyTakeaways', 'readingTime', 'jargonTerms'],
                },
              },
              required: ['eli5', 'executive', 'technical'],
            },
          },
          required: ['detectedDomain', 'originalSummary', 'explanations'],
        },
      },
    });

    const rawText = response.text;
    if (!rawText) {
      return res.status(502).json({ error: 'Empty response returned by Gemini model.' });
    }

    const parsedData = JSON.parse(rawText);
    return res.json(parsedData);
  } catch (err: any) {
    console.error('Error in /api/bust-jargon:', err);
    return res.status(500).json({
      error: err.message || 'An error occurred while generating the explanation.',
    });
  }
});

// POST /api/synthesize-speech
app.post('/api/synthesize-speech', async (req, res) => {
  try {
    const { text, voiceName } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text is required for speech synthesis.' });
    }

    const ai = getGeminiClient();

    // Clean text: strip markdown symbols, keep readable sentences, cap length
    const cleanedText = text
      .replace(/[#*_`~>\[\]\(\)]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 1500);

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: cleanedText,
              speechMetadata: {
                style: 'Clear, natural, professional explainer with helpful cadence',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: voiceName || 'Kore',
            },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      return res.status(502).json({ error: 'No audio returned from speech synthesis model.' });
    }

    res.json({
      audioBase64: base64Audio,
      mimeType: 'audio/wav',
    });
  } catch (err: any) {
    console.error('Error in /api/synthesize-speech:', err);
    res.status(500).json({
      error: err.message || 'Failed to synthesize speech audio.',
    });
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
