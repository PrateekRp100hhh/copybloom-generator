
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

interface ScriptGenerationParams {
  topic: string;
  audience: string;
  tone: string;
  duration: string;
  style: string;
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

// Function to evaluate the quality score of content (1-10)
const evaluateContentQuality = async (content: string): Promise<number> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const evaluationPrompt = `
    Evaluate the quality of the following marketing content on a scale of 1-10.
    Consider these factors: clarity, persuasiveness, engagement, relevance, and call-to-action effectiveness.
    Content to evaluate:
    "${content}"
    
    Respond with ONLY a number between 1-10, nothing else.`;
    
    const result = await model.generateContent(evaluationPrompt);
    const response = await result.response;
    const scoreText = response.text().trim();
    
    // Extract number from response
    const scoreMatch = scoreText.match(/\d+/);
    const score = scoreMatch ? parseInt(scoreMatch[0], 10) : 5;
    
    return Math.min(Math.max(score, 1), 10); // Ensure score is between 1 and 10
  } catch (error) {
    console.error('Error evaluating content quality:', error);
    return 8; // Default to 8 if evaluation fails
  }
};

// Function to improve content quality if score is below threshold
const improveContentQuality = async (content: string, currentScore: number): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const improvementPrompt = `
    The following marketing content scored ${currentScore}/10 in quality.
    Please improve it to achieve a score of 8 or higher while maintaining the same message and intent:
    "${content}"
    
    Return ONLY the improved content, nothing else.`;
    
    const result = await model.generateContent(improvementPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error improving content quality:', error);
    return content; // Return original content if improvement fails
  }
};

export const generateCopy = async (params: GenerateCopyParams): Promise<string> => {
  const { campaignType, audience, message, tone, cta } = params;
  
  try {
    // Format the prompt as requested in the requirements
    const prompt = `Generate a ${campaignType} copy for a ${audience} with the message: "${message}". 
    Tone: ${tone}. Include a CTA: "${cta}". 
    Make it comprehensive and persuasive within 1000 words maximum.`;
    
    console.log('Sending prompt to Gemini:', prompt);
    
    // Use the correct model name (gemini-1.5-flash)
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        maxOutputTokens: 1000,
      } 
    });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let generatedText = response.text();
    
    // Evaluate content quality
    let contentScore = await evaluateContentQuality(generatedText);
    console.log(`Initial content quality score: ${contentScore}/10`);
    
    // If score is below threshold, improve content
    let attemptCount = 0;
    const maxAttempts = 2;
    
    while (contentScore < 8 && attemptCount < maxAttempts) {
      console.log(`Content score ${contentScore} below threshold. Improving content...`);
      generatedText = await improveContentQuality(generatedText, contentScore);
      contentScore = await evaluateContentQuality(generatedText);
      console.log(`Improved content quality score: ${contentScore}/10`);
      attemptCount++;
    }
    
    console.log('Final content quality score:', contentScore);
    return generatedText;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw new Error('Failed to generate copy. Please try again later.');
  }
};

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
    
    // Update chat history for context
    chatHistory.push({ role: "user", parts: [{ text: message }] });
    chatHistory.push({ role: "model", parts: [{ text: generatedText }] });
    
    // Limit history to last 10 messages to avoid token limits
    if (chatHistory.length > 20) {
      chatHistory = chatHistory.slice(chatHistory.length - 20);
    }
    
    return generatedText;
  } catch (error) {
    console.error('Error in AI chat:', error);
    throw new Error('Failed to get a response. Please try again.');
  }
};

export const generateScript = async (params: ScriptGenerationParams): Promise<string> => {
  const { topic, audience, tone, duration, style } = params;
  
  try {
    // Create a prompt for the YouTube script
    const prompt = `Generate a viral YouTube script for a ${duration} minute ${style} video about "${topic}". 
    Target audience: ${audience}. 
    Tone: ${tone}.
    Include: an attention-grabbing hook, clear sections with timestamps, engaging questions for viewers, call to action, and memorable closing.
    Format the script with sections for INTRO, MAIN CONTENT (with 3-5 key points), and OUTRO.
    Make it comprehensive and engaging within 1000 words maximum.`;
    
    console.log("Calling AI with prompt:", prompt);
    
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        maxOutputTokens: 1000,
      } 
    });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let generatedText = response.text();
    
    // Evaluate content quality
    let contentScore = await evaluateContentQuality(generatedText);
    console.log(`Initial script quality score: ${contentScore}/10`);
    
    // If score is below threshold, improve content
    let attemptCount = 0;
    const maxAttempts = 2;
    
    while (contentScore < 8 && attemptCount < maxAttempts) {
      console.log(`Script score ${contentScore} below threshold. Improving content...`);
      generatedText = await improveContentQuality(generatedText, contentScore);
      contentScore = await evaluateContentQuality(generatedText);
      console.log(`Improved script quality score: ${contentScore}/10`);
      attemptCount++;
    }
    
    console.log("Received final response with quality score:", contentScore);
    return generatedText;
  } catch (error) {
    console.error('Error generating script:', error);
    throw new Error('Failed to generate script. Please try again later.');
  }
};
