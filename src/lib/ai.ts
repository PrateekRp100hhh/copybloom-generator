
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// Initialize the API with your key
const API_KEY = "AIzaSyCP8W0eAaHVguMskYtEE_KI9-2pjinb-XM";
const genAI = new GoogleGenerativeAI(API_KEY);

interface GenerateCopyParams {
  campaignType: string;
  audience: string;
  message: string;
  tone: string;
  cta: string;
}

interface ChatMessageParams {
  message: string;
}

// Safety settings - make sure content is appropriate for marketing
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

// Create a chat session
let chatHistory: any[] = [];

export const generateCopy = async (params: GenerateCopyParams): Promise<string> => {
  const { campaignType, audience, message, tone, cta } = params;
  
  try {
    // Format the prompt as requested in the requirements
    const prompt = `Generate a ${campaignType} copy for a ${audience} with the message: "${message}". 
    Tone: ${tone}. Include a CTA: "${cta}". 
    Keep it under 200 tokens.`;
    
    console.log('Sending prompt to Gemini:', prompt);
    
    // Use the gemini-pro model (correct model name without version)
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Received response from Gemini:', text);
    return text;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw new Error('Failed to generate copy. Please try again later.');
  }
};

export const chatWithAI = async (params: ChatMessageParams): Promise<string> => {
  const { message } = params;
  
  try {
    // Use the gemini-pro model for chat (correct model name without version)
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    // Create a chat instance
    const chat = model.startChat({
      history: chatHistory,
      safetySettings,
      generationConfig: {
        maxOutputTokens: 150,
      },
    });

    // Send the message to the chat
    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();
    
    // Update chat history for context
    chatHistory.push({ role: "user", parts: [{ text: message }] });
    chatHistory.push({ role: "model", parts: [{ text }] });
    
    // Limit history to last 10 messages to avoid token limits
    if (chatHistory.length > 20) {
      chatHistory = chatHistory.slice(chatHistory.length - 20);
    }
    
    return text;
  } catch (error) {
    console.error('Error in AI chat:', error);
    throw new Error('Failed to get a response. Please try again.');
  }
};
