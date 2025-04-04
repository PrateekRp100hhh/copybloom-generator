
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Wand2, RefreshCw, Sparkles, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateStoryElements } from '@/lib/ai';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScriptFormData } from '@/types/youtube';
import HookSection from './sections/HookSection';
import ContentSection from './sections/ContentSection';
import OutroSection from './sections/OutroSection';
import ScriptBasicInfo from './ScriptBasicInfo';

const YoutubeScriptForm: React.FC<{
  formData: ScriptFormData;
  setFormData: React.Dispatch<React.SetStateAction<ScriptFormData>>;
  loading: boolean;
  autoGenerating: boolean;
  generateScript: () => Promise<void>;
  resetForm: () => void;
  error: string | null;
}> = ({ 
  formData, 
  setFormData, 
  loading, 
  autoGenerating, 
  generateScript, 
  resetForm, 
  error 
}) => {
  const { toast } = useToast();
  const [expandedSections, setExpandedSections] = useState<string[]>(['hook', 'content', 'outro']);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const autoGenerateStoryElements = async () => {
    // Validate basic form requirements
    if (!formData.topic || !formData.audience || !formData.tone) {
      toast({
        title: "Missing information",
        description: "Please fill in the topic, audience and tone to auto-generate elements.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Call the AI service to generate story elements
      const elements = await generateStoryElements({
        topic: formData.topic,
        audience: formData.audience,
        tone: formData.tone,
        duration: formData.duration,
        style: formData.style
      });
      
      // Update the form with the generated elements
      setFormData(prev => ({
        ...prev,
        // Hook elements
        hookQuestion: elements.hook.hookQuestion || prev.hookQuestion,
        painPoint: elements.hook.painPoint || prev.painPoint,
        curiosityHook: elements.hook.curiosityHook || prev.curiosityHook,
        
        // Content elements
        keyPoints: elements.content.keyPoints || prev.keyPoints,
        backstory: elements.content.backstory || prev.backstory,
        challenge: elements.content.challenge || prev.challenge,
        twist: elements.content.twist || prev.twist,
        
        // Outro elements
        callToAction: elements.outro.callToAction || prev.callToAction,
        transition: elements.outro.transition || prev.transition,
      }));

      // Ensure all accordion sections are expanded
      setExpandedSections(['hook', 'content', 'outro']);
      
      toast({
        title: "Elements generated!",
        description: "Story elements have been auto-generated based on your topic.",
      });
    } catch (error: any) {
      console.error('Error auto-generating elements:', error);
      toast({
        title: "Auto-generation failed",
        description: error.message || "There was an error generating story elements. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAccordionChange = (value: string[]) => {
    setExpandedSections(value);
  };

  return (
    <div className="space-y-4">
      <ScriptBasicInfo 
        formData={formData} 
        handleChange={handleChange} 
      />

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center">
          <h3 className="text-lg font-medium">Storytelling Elements</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-1">
                  <Info className="h-4 w-4 text-muted-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-md p-4">
                <div className="space-y-2">
                  <p className="font-semibold">Storytelling Framework:</p>
                  <p>Each content point will follow this structure:</p>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li><span className="font-medium">Backstory:</span> Introduces the origins or background</li>
                    <li><span className="font-medium">Details:</span> Elaborates on key features and information</li>
                    <li><span className="font-medium">Challenge:</span> Presents a common problem or obstacle</li>
                    <li><span className="font-medium">Plot Twist:</span> Reveals an unexpected insight or solution</li>
                    <li><span className="font-medium">Engagement:</span> Includes a mini-engagement element</li>
                  </ol>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Button
          onClick={autoGenerateStoryElements}
          variant="secondary"
          size="sm"
          disabled={autoGenerating || !formData.topic || !formData.audience || !formData.tone}
        >
          {autoGenerating ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </span>
          ) : (
            <span className="flex items-center">
              <Sparkles className="mr-2 h-4 w-4" /> Auto-Generate Elements
            </span>
          )}
        </Button>
      </div>

      <HookSection 
        formData={formData} 
        handleChange={handleChange} 
        expandedSections={expandedSections} 
        handleAccordionChange={handleAccordionChange} 
      />
      
      <ContentSection 
        formData={formData} 
        handleChange={handleChange} 
        expandedSections={expandedSections} 
        handleAccordionChange={handleAccordionChange} 
      />
      
      <OutroSection 
        formData={formData} 
        handleChange={handleChange} 
        expandedSections={expandedSections} 
        handleAccordionChange={handleAccordionChange} 
      />

      <div className="mt-4 p-3 border rounded-md bg-accent/30">
        <h4 className="font-medium flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          Storytelling Framework
        </h4>
        <p className="text-sm text-muted-foreground mt-1">
          Each key point in your script will automatically follow our 5-step storytelling framework:
        </p>
        <ol className="mt-2 space-y-1 text-sm ml-5 list-decimal">
          <li><span className="font-medium">Backstory:</span> Origins related to the point</li>
          <li><span className="font-medium">Details:</span> Key features and information</li>
          <li><span className="font-medium">Challenge:</span> Problem or obstacle</li>
          <li><span className="font-medium">Plot Twist:</span> Unexpected insight or solution</li>
          <li><span className="font-medium">Engagement:</span> Call-to-action for each point</li>
        </ol>
      </div>

      <div className="flex gap-2">
        <Button 
          onClick={generateScript} 
          className="flex-1"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </span>
          ) : (
            <span className="flex items-center">
              <Wand2 className="mr-2 h-5 w-5" /> Generate Script
            </span>
          )}
        </Button>
        <Button variant="outline" onClick={resetForm} disabled={loading || autoGenerating}>
          <RefreshCw className="h-4 w-4 mr-2" /> Reset
        </Button>
      </div>
    </div>
  );
};

export default YoutubeScriptForm;
