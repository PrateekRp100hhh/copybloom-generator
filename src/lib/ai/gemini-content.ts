
import { supabase } from "@/integrations/supabase/client";

/**
 * Generate content using the Gemini AI through our Supabase Edge Function
 */
export async function generateGeminiContent(userInput: string): Promise<string> {
  try {
    const { data, error } = await supabase.functions.invoke('generate-content', {
      body: { userInput },
    });

    if (error) {
      console.error('Error generating content:', error);
      throw new Error(error.message || 'Failed to generate content');
    }

    return data?.output || 'Sorry, I was unable to generate content. Please try again.';
  } catch (error) {
    console.error('Error calling generate-content function:', error);
    throw new Error('Failed to connect to AI service. Please try again later.');
  }
}
