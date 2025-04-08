
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClipboardCopy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ScriptChatWidget from './ScriptChatWidget';

interface ScriptResultProps {
  generatedScript: string | null;
  setGeneratedScript: React.Dispatch<React.SetStateAction<string | null>>;
}

const ScriptResult: React.FC<ScriptResultProps> = ({ 
  generatedScript, 
  setGeneratedScript 
}) => {
  const { toast } = useToast();
  const [isRefined, setIsRefined] = useState(false);

  if (!generatedScript) return null;

  const handleScriptUpdate = (updatedScript: string) => {
    setGeneratedScript(updatedScript);
    setIsRefined(true);
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
            {generatedScript}
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
