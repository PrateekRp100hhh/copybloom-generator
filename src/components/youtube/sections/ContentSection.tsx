
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';
import { ScriptFormData } from '@/types/youtube';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ContentSectionProps {
  formData: ScriptFormData;
  handleChange: (field: string, value: string) => void;
  expandedSections: string[];
  handleAccordionChange: (value: string) => void;
}

const ContentSection: React.FC<ContentSectionProps> = ({ 
  formData, 
  handleChange, 
  expandedSections, 
  handleAccordionChange 
}) => {
  return (
    <Accordion 
      type="multiple" 
      value={expandedSections} 
      onValueChange={handleAccordionChange}
      className="w-full border rounded-md"
    >
      <AccordionItem value="content">
        <AccordionTrigger className="px-4">Content Elements (Storytelling)</AccordionTrigger>
        <AccordionContent className="px-4 pt-2 pb-4 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="keyPoints">Key points (Each will follow the storytelling framework)</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p className="max-w-xs">Each point will automatically follow the 5-step storytelling framework. Format as a numbered list.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Textarea 
              id="keyPoints" 
              placeholder="e.g., 1. Introduction to AI tools&#10;2. Top tools comparison&#10;3. Implementation tips" 
              value={formData.keyPoints}
              onChange={(e) => handleChange('keyPoints', e.target.value)}
              className="min-h-[100px]"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Format as a numbered list (1., 2., 3.). Each point will be structured with Backstory → Details → Challenge → Plot Twist → Engagement.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="backstory">Overall backstory or context (optional)</Label>
            <Textarea 
              id="backstory" 
              placeholder="e.g., When I first started using AI tools, I was skeptical but then..." 
              value={formData.backstory}
              onChange={(e) => handleChange('backstory', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="challenge">Overall challenge or obstacle (optional)</Label>
            <Input 
              id="challenge" 
              placeholder="e.g., The learning curve for these tools can be steep" 
              value={formData.challenge}
              onChange={(e) => handleChange('challenge', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="twist">Overall unexpected insight or twist (optional)</Label>
            <Input 
              id="twist" 
              placeholder="e.g., The most effective AI tool is actually the simplest one" 
              value={formData.twist}
              onChange={(e) => handleChange('twist', e.target.value)}
            />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ContentSection;
