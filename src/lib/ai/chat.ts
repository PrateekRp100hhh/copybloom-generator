
import { genAI, safetySettings, chatHistory, updateChatHistory } from './config';
import { evaluateContentQuality, improveContentQuality } from './content-quality';
import { ChatMessageParams } from './types';

export const chatWithAI = async (params: ChatMessageParams): Promise<string> => {
  const { message } = params;
  
  try {
    // Use the correct model name (gemini-1.5-flash)
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        maxOutputTokens: 1000,
      }
    });
    
    // Create a chat instance
    const chat = model.startChat({
      history: chatHistory,
      safetySettings,
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    // Send the message to the chat
    const result = await chat.sendMessage(message);
    const response = await result.response;
    let generatedText = response.text();
    
    // Evaluate content quality
    let contentScore = await evaluateContentQuality(generatedText);
    
    // If score is below threshold, improve content
    let attemptCount = 0;
    const maxAttempts = 2;
    
    while (contentScore < 8 && attemptCount < maxAttempts) {
      generatedText = await improveContentQuality(generatedText, contentScore);
      contentScore = await evaluateContentQuality(generatedText);
      attemptCount++;
    }
    
    // Create a new chat history array
    const newChatHistory = [...chatHistory];
    
    // Update chat history for context
    newChatHistory.push({ role: "user", parts: [{ text: message }] });
    newChatHistory.push({ role: "model", parts: [{ text: generatedText }] });
    
    // Limit history to last 10 messages to avoid token limits
    if (newChatHistory.length > 20) {
      // Use the update function to update the chat history
      updateChatHistory(newChatHistory.slice(newChatHistory.length - 20));
    } else {
      // Use the update function to update the chat history
      updateChatHistory(newChatHistory);
    }
    
    return generatedText;
  } catch (error) {
    console.error('Error in AI chat:', error);
    throw new Error('Failed to get a response. Please try again.');
  }
};
