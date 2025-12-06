import { GoogleGenAI, Type } from "@google/genai";
import { GameMode, Question, Difficulty } from '../types';

// Initialize the API client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are a fun, energetic geography teacher for kids aged 7-12. 
Generate engaging multiple-choice questions. 
Ensure the language is simple, concise, and easy to read.

IMPORTANT FORMATTING RULES:
1. **Bold the Subject**: You MUST wrap the name of the Country, City, Continent, or Geographic Feature in double asterisks (e.g., **FRANCE**, **NILE RIVER**) so it stands out clearly.
2. **Add Context**: Add a short, fun 3-5 word clue naturally into the question to help them guess (e.g., "famous for Pyramids", "situated by the Nile", "home of kangaroos").
   - Example: "What is the capital of **EGYPT** (famous for Pyramids)?"
   - Example: "Which continent is **BRAZIL** (home of the Amazon) in?"

For 'Flags' mode, you MUST provide the ISO 2-letter 'countryCode'.
`;

export const generateQuestions = async (mode: GameMode, difficulty: Difficulty, count: number = 5): Promise<Question[]> => {
  const model = "gemini-2.5-flash";

  let difficultyInstruction = "";
  switch (difficulty) {
    case 'Easy':
      difficultyInstruction = "Target audience: 7-8 year olds. Strictly use ONLY very famous, well-known countries (e.g., USA, France, Japan, Brazil, UK, China, Australia) and major global cities. Keep context clues very obvious.";
      break;
    case 'Medium':
      difficultyInstruction = "Target audience: 9-10 year olds. Use a mix of famous and slightly less common countries. Context clues can be about rivers, mountains, or food.";
      break;
    case 'Hard':
      difficultyInstruction = "Target audience: 11-12 year olds. Include obscure countries, tricky capitals, and challenging flags. Context clues can be historical or physical geography.";
      break;
  }

  let prompt = "";
  switch (mode) {
    case GameMode.CAPITALS:
      prompt = `Generate ${count} questions asking about the capital of a country. Format: "What is the capital of **COUNTRY_NAME** (context_clue)?". ${difficultyInstruction}`;
      break;
    case GameMode.FLAGS:
      prompt = `Generate ${count} questions showing a flag. Set 'questionText' to "Which country does this flag belong to?". You MUST provide the 2-letter ISO country code (e.g. 'us', 'jp', 'fr') in the 'countryCode' field. ${difficultyInstruction}`;
      break;
    case GameMode.CONTINENTS:
      prompt = `Generate ${count} questions asking which continent a country is in. Format: "Where is **COUNTRY_NAME** (context_clue) located?". ${difficultyInstruction}`;
      break;
    case GameMode.CITIES:
      prompt = `Generate ${count} questions asking which country a city belongs to. Format: "Which country is the city of **CITY_NAME** (context_clue) in?". ${difficultyInstruction}`;
      break;
    case GameMode.FEATURES:
      prompt = `Generate ${count} questions asking about the location of famous natural features like Rivers, Lakes, Volcanoes, Waterfalls, Deserts, Forests, or Ports. Format: "Which country is the **FEATURE_NAME** (context_clue) located in?" or "Where can you find the **FEATURE_NAME**?". ${difficultyInstruction}`;
      break;
  }

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              questionText: { type: Type.STRING, description: "The question to ask the kid, with **Subject** bolded and a short clue included." },
              options: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "4 possible answers"
              },
              correctAnswer: { type: Type.STRING },
              emoji: { type: Type.STRING, description: "Relevant emoji (generic decoration for most modes)" },
              countryCode: { type: Type.STRING, description: "2-letter ISO country code (e.g. 'us', 'fr') specifically for FLAGS mode to load the image." },
              explanation: { type: Type.STRING, description: "A short, fun fact explaining the answer" }
            },
            required: ["id", "questionText", "options", "correctAnswer", "explanation"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    
    const questions = JSON.parse(text) as Question[];
    return questions;
  } catch (error) {
    console.error("Failed to generate questions:", error);
    // Fallback or empty array handled by UI
    return [];
  }
};