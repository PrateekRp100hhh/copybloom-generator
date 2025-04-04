
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScriptFormData } from '@/types/youtube';

interface ScriptBasicInfoProps {
  formData: ScriptFormData;
  handleChange: (field: string, value: string) => void;
}

const ScriptBasicInfo: React.FC<ScriptBasicInfoProps> = ({ formData, handleChange }) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="topic">Video Topic/Title <span className="text-red-500">*</span></Label>
        <Input 
          id="topic" 
          placeholder="e.g., 10 AI Tools That Will Replace Your Job" 
          value={formData.topic}
          onChange={(e) => handleChange('topic', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="audience">Target Audience <span className="text-red-500">*</span></Label>
        <Input 
          id="audience" 
          placeholder="e.g., Tech enthusiasts, beginners, professionals" 
          value={formData.audience}
          onChange={(e) => handleChange('audience', e.target.value)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="tone">Tone/Style <span className="text-red-500">*</span></Label>
          <Select onValueChange={(value) => handleChange('tone', value)} value={formData.tone}>
            <SelectTrigger>
              <SelectValue placeholder="Select tone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="informative">Informative</SelectItem>
              <SelectItem value="entertaining">Entertaining</SelectItem>
              <SelectItem value="motivational">Motivational</SelectItem>
              <SelectItem value="casual">Casual</SelectItem>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="humorous">Humorous</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="duration">Video Duration</Label>
          <Select onValueChange={(value) => handleChange('duration', value)} value={formData.duration}>
            <SelectTrigger>
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-3">Short (1-3 minutes)</SelectItem>
              <SelectItem value="5-10">Medium (5-10 minutes)</SelectItem>
              <SelectItem value="15-20">Long (15-20 minutes)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="style">Video Style</Label>
          <Select onValueChange={(value) => handleChange('style', value)} value={formData.style}>
            <SelectTrigger>
              <SelectValue placeholder="Select style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="educational">Educational</SelectItem>
              <SelectItem value="tutorial">Tutorial</SelectItem>
              <SelectItem value="vlog">Vlog</SelectItem>
              <SelectItem value="review">Review</SelectItem>
              <SelectItem value="commentary">Commentary</SelectItem>
              <SelectItem value="storytelling">Storytelling</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
};

export default ScriptBasicInfo;
