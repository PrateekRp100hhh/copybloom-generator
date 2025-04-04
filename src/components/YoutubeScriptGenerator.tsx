
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Wand2, AlertCircle, ClipboardCopy, RefreshCw, Sparkles, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateScript, generateStoryElements } from '@/lib/ai';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const YoutubeScriptGenerator: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [autoGenerating, setAutoGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    // Basic info
    topic: '',
    audience: '',
    tone: '',
    duration: '5-10',
    style: 'educational',
    
    // Hook elements
    hookQuestion: '',
    painPoint: '',
    curiosityHook: '',
    
    // Content elements
    keyPoints: '',
    backstory: '',
    challenge: '',
    twist: '',
    
    // Outro elements
    callToAction: '',
    transition: '',
  });
  const [generatedScript, setGeneratedScript] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<string[]>(['hook', 'content', 'outro']);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError(null);
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

    setAutoGenerating(true);
    setError(null);
    
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
      setError(error.message || "Auto-generation failed");
      toast({
        title: "Auto-generation failed",
        description: error.message || "There was an error generating story elements. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAutoGenerating(false);
    }
  };

  const generateScriptHandler = async () => {
    // Validate form
    if (!formData.topic || !formData.audience || !formData.tone) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields to generate a script.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Call the AI service to generate script
      console.log("Calling generateScript with:", formData);
      const response = await generateScript(formData);
      console.log("Received response length:", response.length);
      
      setGeneratedScript(response);
      toast({
        title: "Script generated!",
        description: "Your YouTube script has been successfully created.",
      });
    } catch (error: any) {
      console.error('Error generating script:', error);
      setError(error.message || "Generation failed");
      toast({
        title: "Generation failed",
        description: error.message || "There was an error generating your script. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      topic: '',
      audience: '',
      tone: '',
      duration: '5-10',
      style: 'educational',
      hookQuestion: '',
      painPoint: '',
      curiosityHook: '',
      keyPoints: '',
      backstory: '',
      challenge: '',
      twist: '',
      callToAction: '',
      transition: '',
    });
    setGeneratedScript(null);
    setError(null);
  };

  const handleAccordionChange = (value: string) => {
    setExpandedSections(prev => {
      if (prev.includes(value)) {
        return prev.filter(item => item !== value);
      } else {
        return [...prev, value];
      }
    });
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Generate YouTube Script</h2>
      {error && (
        <div className="bg-destructive/10 text-destructive p-3 rounded-md mb-4 flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
      <div className="space-y-4">
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

        <Accordion 
          type="multiple" 
          value={expandedSections} 
          onValueChange={setExpandedSections}
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
            onClick={generateScriptHandler} 
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

      {generatedScript && (
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
      )}
    </div>
  );
};

export default YoutubeScriptGenerator;
