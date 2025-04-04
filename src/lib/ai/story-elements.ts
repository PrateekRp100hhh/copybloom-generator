import { genAI } from './config';
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

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        maxOutputTokens: 1000,
      } 
    });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generatedText = response.text();
    
    // Parse the response as JSON
    try {
      const elements = JSON.parse(generatedText);
      return elements;
    } catch (parseError) {
      console.error('Error parsing JSON response:', parseError);
      // Try to extract JSON from text if not properly formatted
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[0]);
        } catch (e) {
          throw new Error('Failed to parse story elements from AI response');
        }
      } else {
        throw new Error('Failed to parse story elements from AI response');
      }
    }
  } catch (error) {
    console.error('Error generating story elements:', error);
    throw new Error('Failed to generate story elements. Please try again.');
  }
};
