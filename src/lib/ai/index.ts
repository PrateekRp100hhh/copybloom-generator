
// Export all functions from the AI utility files
export { evaluateContentQuality, improveContentQuality } from './content-quality';
export { generateCopy } from './marketing-copy';
export { chatWithAI } from './chat';
export { generateStoryElements } from './story-elements';
export { generateScript } from './script-generation';
export { generateGeminiContent } from './gemini-content';

// Also export any shared types or configuration if needed
export { API_KEY, genAI, safetySettings, chatHistory, updateChatHistory } from './config';
