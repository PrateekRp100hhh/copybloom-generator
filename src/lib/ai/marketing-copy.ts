import { genAI } from './config';
import { evaluateContentQuality, improveContentQuality } from './content-quality';
import { GenerateCopyParams } from './types';

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
