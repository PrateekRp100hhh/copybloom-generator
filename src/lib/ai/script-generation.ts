
import { generateGeminiContent } from './gemini-content';
import { evaluateContentQuality, improveContentQuality } from './content-quality';
import { ScriptGenerationParams } from './types';

export const generateScript = async (params: ScriptGenerationParams): Promise<string> => {
  const { 
    topic, audience, tone, duration, style,
    hookQuestion, painPoint, curiosityHook,
    keyPoints, backstory, challenge, twist,
    callToAction, transition
  } = params;
  
  try {
    // Build a structured prompt incorporating storytelling elements
    let prompt = `Generate a viral YouTube script for a ${duration} minute ${style} video about "${topic}". 
    Target audience: ${audience}. 
    Tone: ${tone}.
    
    Script structure should follow the Hook-Content-Outro framework:`;
    
    // Add Hook section based on provided inputs
    prompt += `\n\n1. HOOK (Opening):`;
    if (hookQuestion) prompt += `\n- Include this thought-provoking question: "${hookQuestion}"`;
    if (painPoint) prompt += `\n- Address this audience pain point: "${painPoint}"`;
    if (curiosityHook) prompt += `\n- Use this curiosity element: "${curiosityHook}"`;
    
    // Add Content section based on provided inputs
    prompt += `\n\n2. CONTENT (Main body):`;

    // Apply storytelling framework to each key point
    if (keyPoints) {
      prompt += `\n- Cover these key points, with each one following a storytelling framework. IMPORTANT: Create a cohesive narrative where each point naturally flows into the next one with smooth transitions. Make sure the points build on each other and connect thematically:`;
      
      // Check if keyPoints is an array or a string and handle accordingly
      const keyPointsArray = Array.isArray(keyPoints) 
        ? keyPoints 
        : typeof keyPoints === 'string' 
          ? keyPoints.split(/\d+\.\s+/).filter(Boolean)
          : [];
      
      keyPointsArray.forEach((point, index) => {
        const pointText = typeof point === 'string' ? point.trim() : '';
        if (pointText) {
          prompt += `\n  Point ${index + 1}: ${pointText}`;
          prompt += `\n    - Backstory: Introduce the origins or background related to this point.`;
          prompt += `\n    - Details: Elaborate on key features and important information.`;
          prompt += `\n    - Challenge: Present a common problem or obstacle related to this point.`;
          prompt += `\n    - Plot Twist: Reveal an unexpected insight or innovative solution.`;
          
          // Add transition to next point if not the last point
          if (index < keyPointsArray.length - 1) {
            const nextPointText = typeof keyPointsArray[index + 1] === 'string' ? keyPointsArray[index + 1].trim() : '';
            if (nextPointText) {
              prompt += `\n    - Transition: Create a natural bridge from this point to the next point: "${nextPointText}".`;
            } else {
              prompt += `\n    - Transition: Create a natural bridge to the next key point.`;
            }
          } else {
            prompt += `\n    - Engagement: Include a mini-engagement element specific to this point.`;
          }
        }
      });
      
      // Add instruction for narrative continuity
      prompt += `\n\nEnsure that the script maintains a cohesive narrative thread throughout. Each point should build on the previous one and lead naturally to the next, creating a compelling and connected storyline rather than disjointed segments.`;
    }

    if (backstory) prompt += `\n- Include this overall backstory for context: "${backstory}"`;
    if (challenge) prompt += `\n- Address this overall challenge or obstacle: "${challenge}"`;
    if (twist) prompt += `\n- Incorporate this unexpected insight or twist: "${twist}"`;
    
    // Add Outro section based on provided inputs
    prompt += `\n\n3. OUTRO (Closing):`;
    if (callToAction) prompt += `\n- End with this call to action: "${callToAction}"`;
    if (transition) prompt += `\n- Include this transition to other content: "${transition}"`;
    
    // Additional instructions
    prompt += `\n\nFormat the script with clear sections for HOOK, MAIN CONTENT (with each key point flowing naturally into the next), and OUTRO.
    Include engaging transitions between points to create a cohesive narrative arc rather than isolated segments.
    Include timestamps, engaging questions for viewers, and a memorable closing.
    Make it comprehensive and engaging within 1000 words maximum.`;
    
    console.log("Calling Gemini Content generator with prompt for YouTube script");
    
    // Instead of directly using genAI, we now use the generateGeminiContent function
    // which calls our Edge Function that uses the training data for better response styling
    const generatedText = await generateGeminiContent(prompt);
    
    // Evaluate content quality
    let contentScore = await evaluateContentQuality(generatedText);
    console.log(`Initial script quality score: ${contentScore}/10`);
    
    // If score is below threshold, improve content
    let attemptCount = 0;
    const maxAttempts = 2;
    let improvedText = generatedText;
    
    while (contentScore < 8 && attemptCount < maxAttempts) {
      console.log(`Script score ${contentScore} below threshold. Improving content...`);
      improvedText = await improveContentQuality(improvedText, contentScore);
      contentScore = await evaluateContentQuality(improvedText);
      console.log(`Improved script quality score: ${contentScore}/10`);
      attemptCount++;
    }
    
    console.log("Received final response with quality score:", contentScore);
    return improvedText;
  } catch (error) {
    console.error('Error generating script:', error);
    throw new Error('Failed to generate script. Please try again later.');
  }
};
