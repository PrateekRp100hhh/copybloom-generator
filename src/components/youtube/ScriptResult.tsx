
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClipboardCopy, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ScriptChatWidget from './ScriptChatWidget';
import { generateScript, generateStoryElements } from '@/lib/ai';
import { ScriptFormData } from '@/types/youtube';

interface ScriptResultProps {
  generatedScript: string | null;
  setGeneratedScript: React.Dispatch<React.SetStateAction<string | null>>;
  formData?: ScriptFormData; // Adding formData for regeneration
  loading?: boolean;
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
}

const ScriptResult: React.FC<ScriptResultProps> = ({ 
  generatedScript, 
  setGeneratedScript,
  formData,
  loading,
  setLoading
}) => {
  const { toast } = useToast();
  const [isRefined, setIsRefined] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  if (!generatedScript) return null;

  const handleScriptUpdate = (updatedScript: string) => {
    setGeneratedScript(updatedScript);
    setIsRefined(true);
  };

  const handleRegenerateScript = async () => {
    if (!formData) {
      toast({
        title: "Cannot regenerate",
        description: "Missing form data needed to regenerate the script.",
        variant: "destructive",
      });
      return;
    }

    try {
      setRegenerating(true);
      if (setLoading) setLoading(true);
      
      const newScript = await generateScript(formData);
      setGeneratedScript(newScript);
      setIsRefined(false);
      
      toast({
        title: "Script regenerated",
        description: "Your YouTube script has been regenerated with the same parameters.",
      });
    } catch (error: any) {
      console.error('Error regenerating script:', error);
      toast({
        title: "Regeneration failed",
        description: error.message || "Failed to regenerate script. Please try again.",
        variant: "destructive",
      });
    } finally {
      setRegenerating(false);
      if (setLoading) setLoading(false);
    }
  };

  return (
    <div className="mt-6 animate-fade-in">
      <h3 className="font-medium mb-2 flex items-center">
        Generated Script:
        {isRefined && (
          <span className="ml-2 text-xs bg-brand-purple text-white px-2 py-0.5 rounded-full">
            Refined
          </span>
        )}
      </h3>
      <Card>
        <CardContent className="p-4">
          <div className="whitespace-pre-wrap bg-accent/50 p-3 rounded-md max-h-[500px] overflow-y-auto">
            {regenerating ? (
              <div className="flex flex-col items-center justify-center p-8 text-muted-foreground">
                <svg className="animate-spin h-8 w-8 mb-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p>Regenerating your script...</p>
              </div>
            ) : (
              generatedScript
            )}
          </div>
        </CardContent>
      </Card>
      <div className="mt-4 flex gap-2 justify-end">
        <Button variant="outline" size="sm" onClick={() => {
          setGeneratedScript(null);
          setIsRefined(false);
        }}>
          Reset
        </Button>
        {formData && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRegenerateScript}
            disabled={regenerating || (loading || false)}
          >
            <RefreshCw className="h-4 w-4 mr-2" /> 
            {regenerating ? 'Regenerating...' : 'Regenerate'}
          </Button>
        )}
        <Button size="sm" onClick={() => {
          navigator.clipboard.writeText(generatedScript);
          toast({
            title: "Copied to clipboard",
            description: "Your script has been copied to your clipboard.",
          });
        }}>
          <ClipboardCopy className="h-4 w-4 mr-2" /> Copy to Clipboard
        </Button>
      </div>
      
      {/* Add the Script Chat Widget */}
      <ScriptChatWidget 
        originalScript={generatedScript} 
        onScriptUpdate={handleScriptUpdate} 
      />
    </div>
  );
};

export default ScriptResult;
