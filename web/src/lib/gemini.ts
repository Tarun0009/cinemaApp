import { GoogleGenerativeAI, type GenerativeModel } from '@google/generative-ai';
import { GEMINI_API_KEY } from './constants';

const SYSTEM_PROMPT = `You are CineMate AI, a friendly and knowledgeable movie recommendation assistant.

When users describe their mood, preferences, or ask for movie suggestions:
1. Recommend 3-5 movies that match their request
2. Format each movie title in **bold** (e.g., **The Shawshank Redemption**)
3. Include the year in parentheses after the title: **The Shawshank Redemption** (1994)
4. Give a brief 1-2 sentence reason for each recommendation
5. Be conversational and enthusiastic about movies

Always use **bold** formatting for movie titles so they can be parsed and displayed as tappable cards.`;

class GeminiService {
  private model: GenerativeModel | null = null;

  private getModel(): GenerativeModel {
    if (this.model) return this.model;
    if (!GEMINI_API_KEY) {
      throw new Error('Gemini API key is not configured.');
    }
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    this.model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    return this.model;
  }

  async sendMessage(
    userMessage: string,
    history: { role: string; parts: { text: string }[] }[],
  ): Promise<string> {
    const model = this.getModel();
    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: 'You are CineMate AI.' }] },
        { role: 'model', parts: [{ text: SYSTEM_PROMPT }] },
        ...history,
      ],
    });

    const result = await chat.sendMessage(userMessage);
    return result.response.text();
  }

  parseMovieTitles(text: string): string[] {
    const regex = /\*\*(.+?)\*\*/g;
    const titles: string[] = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      const title = match[1].replace(/\s*\(\d{4}\)\s*$/, '').trim();
      if (title.length > 0 && !titles.includes(title)) {
        titles.push(title);
      }
    }
    return titles;
  }
}

const gemini = new GeminiService();
export default gemini;
