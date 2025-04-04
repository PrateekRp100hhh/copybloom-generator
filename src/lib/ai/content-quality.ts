
import { genAI } from './config';

// Function to evaluate the quality score of content (1-10)
export const evaluateContentQuality = async (content: string): Promise<number> => {
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
export const improveContentQuality = async (content: string, currentScore: number): Promise<string> => {
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
