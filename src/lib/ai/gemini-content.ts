
import { genAI, safetySettings } from "./config";
import { supabase } from "@/integrations/supabase/client";

/**
 * Generate content using the Gemini AI, first trying the Supabase Edge Function,
 * then falling back to direct API call if that fails
 */
export async function generateGeminiContent(userInput: string): Promise<string> {
  try {
    // First try using the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('generate-content', {
      body: { userInput },
    });

    if (error) {
      console.error('Error calling edge function:', error);
      // If edge function fails, fall back to direct API call
      return await generateContentDirectly(userInput);
    }

    return data?.output || 'Sorry, I was unable to generate content. Please try again.';
  } catch (error) {
    console.error('Error calling generate-content function:', error);
    // If there's any other error, fall back to direct API call
    return await generateContentDirectly(userInput);
  }
}

/**
 * Fallback function that calls Gemini API directly if the edge function fails
 */
async function generateContentDirectly(userInput: string): Promise<string> {
  try {
    console.log("Falling back to direct Gemini API call");
    
    // Use the Gemini API directly
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      safetySettings,
      generationConfig: {
        maxOutputTokens: 1000,
      }
    });
    
    const result = await model.generateContent(userInput);
    return result.response.text();
  } catch (error) {
    console.error('Error in direct Gemini API call:', error);
    throw new Error('Failed to generate content using both methods. Please check your API configuration.');
  }
}
