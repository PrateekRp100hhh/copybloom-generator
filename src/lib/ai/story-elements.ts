
import { generateGeminiContent } from './gemini-content';
import { StoryElementsParams, StoryElements } from './types';

export const generateStoryElements = async (params: StoryElementsParams): Promise<StoryElements> => {
  const { topic, audience, tone, duration, style } = params;
  
  try {
    const prompt = `
      Based on the following YouTube video details, generate engaging storytelling elements in JSON format:
      
      Topic: "${topic}"
      Target audience: ${audience}
      Tone: ${tone}
      Duration: ${duration} minutes
      Style: ${style}
      
      Return ONLY a valid JSON object with the following structure:
      {
        "hook": {
          "hookQuestion": "A thought-provoking question related to the topic",
          "painPoint": "A common problem the audience faces related to this topic",
          "curiosityHook": "A surprising fact or statement to create curiosity"
        },
        "content": {
          "keyPoints": "3-5 key points as a numbered list, each point should be concise and focused on one aspect of the topic",
          "backstory": "A brief contextual backstory to make the topic relatable",
          "challenge": "A challenge or obstacle that makes this topic engaging",
          "twist": "An unexpected insight or twist that makes the content stand out"
        },
        "outro": {
          "callToAction": "A compelling call-to-action for viewers",
          "transition": "A smooth transition to other content"
        }
      }
      
      Ensure all elements are creative, engaging, and tailored to the specified audience and tone.
      For the keyPoints, make sure to format them as a numbered list (1., 2., 3., etc.) with each point being distinct and focused.
      Return ONLY the JSON object, nothing else.
    `;

    // Use the centralized generateGeminiContent function
    const generatedText = await generateGeminiContent(prompt);
    
    // Parse the response as JSON
    try {
      // Try to parse the response directly first
      let elements: StoryElements;
      try {
        elements = JSON.parse(generatedText);
      } catch (parseError) {
        // If direct parsing fails, try to extract JSON from the text
        console.error('Initial JSON parsing failed, attempting to extract JSON:', parseError);
        const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error('Failed to extract JSON from response');
        }
        elements = JSON.parse(jsonMatch[0]);
      }
      
      // Validate the extracted JSON structure
      if (!elements.hook || !elements.content || !elements.outro) {
        throw new Error('Generated elements missing required sections');
      }
      
      return elements;
    } catch (parseError) {
      console.error('Error parsing JSON response:', parseError, 'Raw response:', generatedText);
      throw new Error('Failed to generate valid story elements. Please try again.');
    }
  } catch (error) {
    console.error('Error generating story elements:', error);
    throw new Error('Failed to generate story elements. Please try again.');
  }
};

// Function to refine story elements based on user feedback
export const refineStoryElements = async (
  elements: StoryElements, 
  refinementRequest: string
): Promise<StoryElements> => {
  try {
    const elementsJson = JSON.stringify(elements, null, 2);
    
    const prompt = `
      I have the following storytelling elements for a YouTube video:
      
      ${elementsJson}
      
      Please refine these elements based on this user request: "${refinementRequest}"
      
      Return ONLY a valid JSON object with the same structure, refined according to the user's request.
    `;
    
    const generatedText = await generateGeminiContent(prompt);
    
    try {
      let refinedElements: StoryElements;
      try {
        refinedElements = JSON.parse(generatedText);
      } catch (parseError) {
        // Try to extract JSON from text if direct parsing fails
        console.error('Initial JSON parsing failed for refinement, attempting to extract JSON');
        const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error('Failed to extract JSON from refinement response');
        }
        refinedElements = JSON.parse(jsonMatch[0]);
      }
      
      // Validate structure
      if (!refinedElements.hook || !refinedElements.content || !refinedElements.outro) {
        throw new Error('Refined elements missing required sections');
      }
      
      return refinedElements;
    } catch (parseError) {
      console.error('Error parsing JSON from refinement:', parseError, 'Raw response:', generatedText);
      throw new Error('Failed to parse refined story elements');
    }
  } catch (error) {
    console.error('Error refining story elements:', error);
    throw new Error('Failed to refine story elements. Please try again.');
  }
};
