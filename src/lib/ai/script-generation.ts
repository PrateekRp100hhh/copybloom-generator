import { genAI } from './config';
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
      prompt += `\n- Cover these key points, with each one following a storytelling framework:`;
      
      // Extract the key points and apply storytelling structure to each
      const points = keyPoints.split(/\d+\.\s+/).filter(Boolean);
      points.forEach((point, index) => {
        prompt += `\n  Point ${index + 1}: ${point.trim()}`;
        prompt += `\n    - Backstory: Introduce the origins or background related to this point.`;
        prompt += `\n    - Details: Elaborate on key features and important information.`;
        prompt += `\n    - Challenge: Present a common problem or obstacle related to this point.`;
        prompt += `\n    - Plot Twist: Reveal an unexpected insight or innovative solution.`;
        prompt += `\n    - Engagement: Include a mini-engagement element specific to this point.`;
      });
    }

    if (backstory) prompt += `\n- Include this overall backstory for context: "${backstory}"`;
    if (challenge) prompt += `\n- Address this overall challenge or obstacle: "${challenge}"`;
    if (twist) prompt += `\n- Incorporate this unexpected insight or twist: "${twist}"`;
    
    // Add Outro section based on provided inputs
    prompt += `\n\n3. OUTRO (Closing):`;
    if (callToAction) prompt += `\n- End with this call to action: "${callToAction}"`;
    if (transition) prompt += `\n- Include this transition to other content: "${transition}"`;
    
    // Additional instructions
    prompt += `\n\nFormat the script with clear sections for HOOK, MAIN CONTENT (with each key point following the storytelling framework), and OUTRO.
    Each key point should follow the structure: Backstory → Details → Challenge → Plot Twist → Engagement.
    Include timestamps, engaging questions for viewers, and a memorable closing.
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
