
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.24.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");

    if (!supabaseUrl || !supabaseServiceKey || !geminiApiKey) {
      throw new Error("Missing required environment variables");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const { userInput } = await req.json();
    if (!userInput) {
      throw new Error("Missing required field: userInput");
    }

    // Step 1: Load training data
    const { data: trainingData, error } = await supabase
      .from("gemini_training")
      .select("prompt, response");

    if (error) {
      console.error("Database error:", error);
      throw new Error("Failed to fetch training data");
    }

    // Step 2: Find matching prompt (basic contains logic)
    const match = trainingData.find(row =>
      userInput.toLowerCase().includes(row.prompt.toLowerCase())
    );

    const styleGuide = match
      ? `Prompt: "${match.prompt}"\nResponse Style:\n${match.response}`
      : "No similar prompt found. Use a general helpful, engaging tone.";

    // Step 3: Send to Gemini
    const geminiPrompt = `
You are a smart content creation assistant.

User Input: "${userInput}"
Use this style guide:
${styleGuide}

Now write a new response in a similar tone and format.
    `;

    console.log("Sending prompt to Gemini:", geminiPrompt.substring(0, 100) + "...");
    
    const result = await model.generateContent(geminiPrompt);
    const output = result.response.text();

    // Step 4: Return the generated content
    return new Response(JSON.stringify({ output }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    console.error("Error in generate-content function:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
