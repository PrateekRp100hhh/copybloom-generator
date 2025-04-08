
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
    if (!scoreMatch) {
      console.warn('Could not extract score from response:', response);
      return 7; // Default to 7 if no number found
    }
    
    const score = parseInt(scoreMatch[0], 10);
    
    // Check if score is a valid number and within range
    if (isNaN(score) || score < 1 || score > 10) {
      console.warn('Invalid score extracted:', score, 'from response:', response);
      return 7; // Default to 7 for invalid scores
    }
    
    return score;
  } catch (error) {
    console.error('Error evaluating content quality:', error);
    return 7; // Default to 7 if evaluation fails
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
    
    const improvedContent = await generateGeminiContent(improvementPrompt);
    
    // Verify we got a non-empty response
    if (!improvedContent || improvedContent.trim().length < 50) {
      console.error('Improvement produced insufficient content:', improvedContent);
      return content; // Return original content if improvement is too short
    }
    
    return improvedContent;
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
    
    const refinedContent = await generateGeminiContent(refinementPrompt);
    
    // Verify we got a non-empty response
    if (!refinedContent || refinedContent.trim().length < 50) {
      console.error('Refinement produced insufficient content:', refinedContent);
      return content; // Return original content if refinement is too short
    }
    
    return refinedContent;
  } catch (error) {
    console.error('Error refining content:', error);
    return content; // Return original content if refinement fails
  }
};
