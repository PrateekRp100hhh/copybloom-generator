
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Copy, Download, RefreshCw, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { saveCampaign } from '@/lib/auth';
import { ScriptFormData } from '@/types/youtube';
import ScriptChatWidget from './ScriptChatWidget';

interface ScriptResultProps {
  generatedScript: string | null;
  setGeneratedScript: React.Dispatch<React.SetStateAction<string | null>>;
  formData: ScriptFormData;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  regenerateScript?: () => Promise<void>;
}

const ScriptResult: React.FC<ScriptResultProps> = ({
  generatedScript,
  setGeneratedScript,
  formData,
  loading,
  setLoading,
  regenerateScript
}) => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  if (!generatedScript) return null;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedScript);
    toast({
      title: "Copied to clipboard",
      description: "The script has been copied to your clipboard",
    });
  };

  const downloadAsText = () => {
    const element = document.createElement("a");
    const file = new Blob([generatedScript], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${formData.topic.replace(/\s+/g, '-').toLowerCase()}-script.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const saveScript = async () => {
    setSaving(true);
    try {
      await saveCampaign({
        name: `YouTube Script: ${formData.topic}`,
        content: generatedScript,
      });
      toast({
        title: "Script saved",
        description: "Your script has been saved to your campaigns",
      });
    } catch (error) {
      console.error('Error saving script:', error);
      toast({
        title: "Error saving script",
        description: "There was an error saving your script. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Function to format the script with syntax highlighting
  const formatScript = (script: string) => {
    return script
      .replace(/(HOOK|INTRO|MAIN CONTENT|OUTRO|SECTION \d+):/g, '<span class="text-primary font-semibold">$1:</span>')
      .replace(/\[([^\]]+)\]/g, '<span class="text-muted-foreground text-sm">[&nbsp;$1&nbsp;]</span>')
      .replace(/\*\*([^*]+)\*\*/g, '<span class="font-semibold">$1</span>')
      .replace(/\*([^*]+)\*/g, '<span class="italic">$1</span>')
      .replace(/\n/g, '<br />');
  };

  return (
    <div className="mt-8 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Your YouTube Script</h3>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={copyToClipboard}>
            <Copy className="mr-2 h-4 w-4" />
            Copy
          </Button>
          <Button variant="outline" size="sm" onClick={downloadAsText}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button variant="outline" size="sm" onClick={saveScript} disabled={saving}>
            <Share2 className="mr-2 h-4 w-4" />
            Save
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden bg-card">
        <CardContent className="p-6">
          <div 
            className="prose prose-sm max-w-none whitespace-pre-line"
            dangerouslySetInnerHTML={{ __html: formatScript(generatedScript) }}
          />
        </CardContent>
      </Card>

      <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
        {regenerateScript && (
          <Button 
            variant="secondary"
            onClick={regenerateScript}
            disabled={loading}
            className="flex items-center"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Regenerating...
              </span>
            ) : (
              <span className="flex items-center">
                <RefreshCw className="mr-2 h-5 w-5" />
                Regenerate Script
              </span>
            )}
          </Button>
        )}
      </div>
      
      <div className="mt-6 border-t pt-6">
        <ScriptChatWidget
          scriptContext={generatedScript}
          topic={formData.topic}
        />
      </div>
    </div>
  );
};

export default ScriptResult;
