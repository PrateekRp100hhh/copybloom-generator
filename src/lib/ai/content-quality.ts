
import { generateGeminiContent } from './gemini-content';

// Function to evaluate the quality score of content (1-10)
export const evaluateContentQuality = async (content: string): Promise<number> => {
  try {
    const evaluationPrompt = `
    Evaluate the quality of the following YouTube script content on a scale of 1-10.
    Consider these factors: clarity, storytelling flow, engagement, relevance, and call-to-action effectiveness.
    
    Content to evaluate:
    "${content}"
    
    Respond with ONLY a number between 1-10, nothing else.`;
    
    const response = await generateGeminiContent(evaluationPrompt);
    
    // Extract number from response
    const scoreMatch = response.match(/\d+/);
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
    const improvementPrompt = `
    The following YouTube script content scored ${currentScore}/10 in quality.
    Please improve it to achieve a score of 8 or higher while maintaining the same message, structure and key points:
    
    ORIGINAL CONTENT:
    """
    ${content}
    """
    
    Return ONLY the improved content, nothing else.`;
    
    return await generateGeminiContent(improvementPrompt);
  } catch (error) {
    console.error('Error improving content quality:', error);
    return content; // Return original content if improvement fails
  }
};

// Function to refine content based on specific user requests
export const refineContent = async (content: string, refinementRequest: string): Promise<string> => {
  try {
    const refinementPrompt = `
    You are a specialized YouTube script refiner. I have a YouTube script that I'd like you to refine based on the following user request:
    
    USER REQUEST: "${refinementRequest}"
    
    ORIGINAL SCRIPT:
    """
    ${content}
    """
    
    Please refine this script according to the user's request. Keep the structure and key points of the original script, but adapt it to match the requested style or changes.
    
    Respond with ONLY the refined script, no introduction or notes.`;
    
    return await generateGeminiContent(refinementPrompt);
  } catch (error) {
    console.error('Error refining content:', error);
    return content; // Return original content if refinement fails
  }
};
