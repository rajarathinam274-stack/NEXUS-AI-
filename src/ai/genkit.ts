import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

/**
 * Genkit instance configured with Google AI.
 * Note: OpenAI and Anthropic plugins are temporarily disabled due to registry resolution issues.
 */
export const ai = genkit({
  plugins: [
    googleAI(),
  ],
  model: 'googleai/gemini-2.5-flash',
});
