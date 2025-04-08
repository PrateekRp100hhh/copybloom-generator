
import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { generateScript } from '@/lib/ai';
import YoutubeScriptForm from './youtube/YoutubeScriptForm';
import ScriptResult from './youtube/ScriptResult';
import { ScriptFormData } from '@/types/youtube';

const YoutubeScriptGenerator: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [autoGenerating, setAutoGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ScriptFormData>({
    // Basic info
    topic: '',
    audience: '',
    tone: '',
    duration: '5-10',
    style: 'educational',
    
    // Hook elements
    hookQuestion: '',
    painPoint: '',
    curiosityHook: '',
    
    // Content elements
    keyPoints: '',
    backstory: '',
    challenge: '',
    twist: '',
    
    // Outro elements
    callToAction: '',
    transition: '',
  });
  const [generatedScript, setGeneratedScript] = useState<string | null>(null);

  const generateScriptHandler = async () => {
    // Validate form
    if (!formData.topic || !formData.audience || !formData.tone) {
      setError("Please fill in all required fields to generate a script.");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Call the AI service to generate script
      console.log("Calling generateScript with:", formData);
      const response = await generateScript(formData);
      console.log("Received response length:", response.length);
      
      setGeneratedScript(response);
    } catch (error: any) {
      console.error('Error generating script:', error);
      setError(error.message || "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      topic: '',
      audience: '',
      tone: '',
      duration: '5-10',
      style: 'educational',
      hookQuestion: '',
      painPoint: '',
      curiosityHook: '',
      keyPoints: '',
      backstory: '',
      challenge: '',
      twist: '',
      callToAction: '',
      transition: '',
    });
    setGeneratedScript(null);
    setError(null);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Generate YouTube Script</h2>
      {error && (
        <div className="bg-destructive/10 text-destructive p-3 rounded-md mb-4 flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
      
      <YoutubeScriptForm 
        formData={formData}
        setFormData={setFormData}
        loading={loading}
        autoGenerating={autoGenerating}
        generateScript={generateScriptHandler}
        resetForm={resetForm}
        error={error}
      />

      <ScriptResult 
        generatedScript={generatedScript}
        setGeneratedScript={setGeneratedScript}
        formData={formData}
        loading={loading}
        setLoading={setLoading}
      />
    </div>
  );
};

export default YoutubeScriptGenerator;
