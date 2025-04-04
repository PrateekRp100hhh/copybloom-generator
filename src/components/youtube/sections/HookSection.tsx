
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScriptFormData } from '@/types/youtube';

interface HookSectionProps {
  formData: ScriptFormData;
  handleChange: (field: string, value: string) => void;
  expandedSections: string[];
  handleAccordionChange: (value: string) => void;
}

const HookSection: React.FC<HookSectionProps> = ({ 
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
      <AccordionItem value="hook">
        <AccordionTrigger className="px-4">Hook Elements (Engagement)</AccordionTrigger>
        <AccordionContent className="px-4 pt-2 pb-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="hookQuestion">Surprising or thought-provoking question</Label>
            <Input 
              id="hookQuestion" 
              placeholder="e.g., What if AI could write better than humans?" 
              value={formData.hookQuestion}
              onChange={(e) => handleChange('hookQuestion', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="painPoint">Common problem or pain point</Label>
            <Input 
              id="painPoint" 
              placeholder="e.g., Many people struggle to create engaging content consistently" 
              value={formData.painPoint}
              onChange={(e) => handleChange('painPoint', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="curiosityHook">Curiosity element (shocking fact, bold statement)</Label>
            <Input 
              id="curiosityHook" 
              placeholder="e.g., 90% of YouTube videos fail to retain viewers past the first minute" 
              value={formData.curiosityHook}
              onChange={(e) => handleChange('curiosityHook', e.target.value)}
            />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default HookSection;
