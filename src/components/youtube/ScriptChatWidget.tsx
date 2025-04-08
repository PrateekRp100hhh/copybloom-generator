
import React, { useState, useRef, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { generateGeminiContent } from '@/lib/ai';

interface ScriptChatWidgetProps {
  originalScript: string;
  onScriptUpdate: (updatedScript: string) => void;
}

const ScriptChatWidget: React.FC<ScriptChatWidgetProps> = ({ 
  originalScript, 
  onScriptUpdate 
}) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  // Auto-resize textarea as user types
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast({
        title: "Empty message",
        description: "Please enter your refinement request",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const prompt = `
      You are a specialized YouTube script refiner. I have a YouTube script that I'd like you to refine based on the following user request:
      
      USER REQUEST: "${message}"
      
      ORIGINAL SCRIPT:
      """
      ${originalScript}
      """
      
      Please refine this script according to the user's request. Keep the structure and key points of the original script, but adapt it to match the requested style or changes.
      
      Respond with ONLY the refined script, no introduction or notes.
      `;
      
      const refinedScript = await generateGeminiContent(prompt);
      
      // Update the parent component with the refined script
      onScriptUpdate(refinedScript);
      
      // Success toast
      toast({
        title: "Script refined",
        description: "Your script has been updated based on your preferences",
      });
      
      // Reset input
      setMessage('');
    } catch (error) {
      console.error('Error refining script:', error);
      toast({
        title: "Refinement failed",
        description: "There was an error while refining your script. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 animate-fade-in">
      <Card className="bg-gradient-to-r from-brand-purple-light to-accent border-brand-purple/20">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-8 w-8 rounded-full bg-brand-purple flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <h3 className="font-medium text-lg">Refine Your Script</h3>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-3">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us your style tweaks or extra details (e.g., add more humor, a casual tone, extra examples…)"
              className="min-h-[60px] max-h-[200px] resize-none bg-white/80 border-brand-purple/30 focus-visible:ring-brand-purple"
            />
            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={isLoading || !message.trim()}
                className="bg-brand-purple hover:bg-brand-purple-dark text-white"
              >
                {isLoading ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Refining...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Refine Script
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default ScriptChatWidget;
