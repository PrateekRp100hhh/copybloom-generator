
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClipboardCopy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ScriptResultProps {
  generatedScript: string | null;
  setGeneratedScript: React.Dispatch<React.SetStateAction<string | null>>;
}

const ScriptResult: React.FC<ScriptResultProps> = ({ 
  generatedScript, 
  setGeneratedScript 
}) => {
  const { toast } = useToast();

  if (!generatedScript) return null;

  return (
    <div className="mt-6 animate-fade-in">
      <h3 className="font-medium mb-2">Generated Script:</h3>
      <Card>
        <CardContent className="p-4">
          <div className="whitespace-pre-wrap bg-accent/50 p-3 rounded-md max-h-[500px] overflow-y-auto">
            {generatedScript}
          </div>
        </CardContent>
      </Card>
      <div className="mt-4 flex gap-2 justify-end">
        <Button variant="outline" size="sm" onClick={() => setGeneratedScript(null)}>
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
    </div>
  );
};

export default ScriptResult;
