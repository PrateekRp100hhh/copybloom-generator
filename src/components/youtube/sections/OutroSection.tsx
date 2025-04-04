
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScriptFormData } from '@/types/youtube';

interface OutroSectionProps {
  formData: ScriptFormData;
  handleChange: (field: string, value: string) => void;
  expandedSections: string[];
  handleAccordionChange: (value: string) => void;
}

const OutroSection: React.FC<OutroSectionProps> = ({ 
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
      <AccordionItem value="outro">
        <AccordionTrigger className="px-4">Outro Elements (Call to Action)</AccordionTrigger>
        <AccordionContent className="px-4 pt-2 pb-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="callToAction">Call to action for viewers</Label>
            <Input 
              id="callToAction" 
              placeholder="e.g., Subscribe for more AI tutorials and leave a comment with your favorite tool" 
              value={formData.callToAction}
              onChange={(e) => handleChange('callToAction', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="transition">Transition to other content</Label>
            <Input 
              id="transition" 
              placeholder="e.g., Check out my video on AI prompt engineering linked in the description" 
              value={formData.transition}
              onChange={(e) => handleChange('transition', e.target.value)}
            />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default OutroSection;
