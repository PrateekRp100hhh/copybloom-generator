
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wand2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Mock campaign types
const campaignTypes = [
  { value: 'landing', label: 'Landing Page' },
  { value: 'email', label: 'Email Campaign' },
  { value: 'social', label: 'Social Media' },
  { value: 'ad', label: 'Advertisement' },
];

// Mock tones
const tones = [
  { value: 'professional', label: 'Professional' },
  { value: 'friendly', label: 'Friendly' },
  { value: 'persuasive', label: 'Persuasive' },
  { value: 'urgent', label: 'Urgent' },
  { value: 'humorous', label: 'Humorous' },
];

const CopyGenerator: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    campaignType: '',
    audience: '',
    message: '',
    tone: '',
    cta: '',
  });
  const [generatedCopy, setGeneratedCopy] = useState<string | null>(null);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const generateCopy = () => {
    // Validate form
    if (!formData.campaignType || !formData.audience || !formData.message || !formData.tone || !formData.cta) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields to generate copy.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Mock response based on inputs
      const response = mockAIResponse(formData);
      setGeneratedCopy(response);
      setLoading(false);
      toast({
        title: "Copy generated!",
        description: "Your marketing copy has been successfully created.",
      });
    }, 1500);
  };

  // Function to generate mock AI response
  const mockAIResponse = (data: typeof formData) => {
    // Simple templating based on input
    const { campaignType, audience, message, tone, cta } = data;
    
    let copy = '';
    
    // Different templates based on campaign type and tone
    if (campaignType === 'landing') {
      if (tone === 'professional') {
        copy = `Introducing the perfect solution for ${audience}. ${message} Our industry-leading approach ensures you get the results you need. ${cta}`;
      } else if (tone === 'friendly') {
        copy = `Hey there! If you're ${audience}, we have something special for you. ${message} It's that simple! ${cta}`;
      } else if (tone === 'persuasive') {
        copy = `Don't miss this opportunity. As a ${audience}, you deserve better. ${message} The results speak for themselves. ${cta} before this offer expires.`;
      } else if (tone === 'urgent') {
        copy = `URGENT: ${audience} need to act now! ${message} Time is running out! ${cta} today!`;
      } else if (tone === 'humorous') {
        copy = `Well, well, well... look who needs ${message}. If you're ${audience} and tired of the same old solutions, we've got you covered. ${cta} (we promise it won't hurt).`;
      } else {
        copy = `For ${audience}: ${message}. ${cta}`;
      }
    } else if (campaignType === 'email') {
      copy = `Subject: ${message}\n\nDear ${audience},\n\nWe understand your needs and have the perfect solution. ${message} designed specifically for people like you.\n\n${cta}\n\nBest regards,\nThe CopyBloom Team`;
    } else if (campaignType === 'social') {
      copy = `📣 Attention ${audience}! ${message} #GameChanger #Innovation\n\n${cta}`;
    } else if (campaignType === 'ad') {
      copy = `[${message}]\nPerfect for ${audience}.\n${cta}`;
    } else {
      copy = `${message} - For ${audience}. ${cta}`;
    }
    
    return copy;
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Generate Marketing Copy</h2>
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="campaignType">Campaign Type</Label>
            <Select onValueChange={(value) => handleChange('campaignType', value)} value={formData.campaignType}>
              <SelectTrigger>
                <SelectValue placeholder="Select campaign type" />
              </SelectTrigger>
              <SelectContent>
                {campaignTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="audience">Target Audience</Label>
            <Input 
              id="audience" 
              placeholder="e.g. small business owners" 
              value={formData.audience}
              onChange={(e) => handleChange('audience', e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Key Message</Label>
          <Textarea 
            id="message" 
            placeholder="What's the main message you want to convey?"
            value={formData.message}
            onChange={(e) => handleChange('message', e.target.value)}
            rows={3}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="tone">Tone/Style</Label>
            <Select onValueChange={(value) => handleChange('tone', value)} value={formData.tone}>
              <SelectTrigger>
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent>
                {tones.map(tone => (
                  <SelectItem key={tone.value} value={tone.value}>
                    {tone.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cta">Call-to-Action</Label>
            <Input 
              id="cta" 
              placeholder="e.g. Sign up today" 
              value={formData.cta}
              onChange={(e) => handleChange('cta', e.target.value)}
            />
          </div>
        </div>

        <Button 
          onClick={generateCopy} 
          className="w-full"
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
              <Wand2 className="mr-2 h-5 w-5" /> Generate Copy
            </span>
          )}
        </Button>
      </div>

      {generatedCopy && (
        <div className="mt-6 animate-fade-in">
          <h3 className="font-medium mb-2">Generated Copy:</h3>
          <Card>
            <CardContent className="p-4">
              <div className="whitespace-pre-wrap bg-accent/50 p-3 rounded-md">
                {generatedCopy}
              </div>
            </CardContent>
          </Card>
          <div className="mt-4 flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={() => setGeneratedCopy(null)}>
              Reset
            </Button>
            <Button size="sm" onClick={() => {
              navigator.clipboard.writeText(generatedCopy);
              toast({
                title: "Copied to clipboard",
                description: "Your marketing copy has been copied to your clipboard.",
              });
            }}>
              Copy to Clipboard
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CopyGenerator;
