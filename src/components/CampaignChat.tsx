
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SendIcon, Bot, User, BotX } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface Message {
  id: string;
  type: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

// This will be replaced with actual Gemini API implementation when API key is provided
const mockAIResponse = async (message: string): Promise<string> => {
  // Sample responses based on keywords in the message
  if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
    return "Hello! I'm your AI campaign assistant. How can I help with your marketing today?";
  }
  
  if (message.toLowerCase().includes('template')) {
    return "We have various templates available for emails, landing pages, and social media posts. Which type are you interested in?";
  }
  
  if (message.toLowerCase().includes('copy') || message.toLowerCase().includes('text')) {
    return "I can help generate compelling marketing copy tailored to your audience and goals. Would you like me to help you with that?";
  }
  
  if (message.toLowerCase().includes('campaign')) {
    return "To create an effective campaign, consider your target audience, key message, and call-to-action. Would you like me to help you plan a specific campaign?";
  }

  return "I'm here to help with your marketing campaigns and copy generation. Feel free to ask about copy creation, templates, or campaign strategy!";
};

const CampaignChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      text: "Hi there! I'm your AI campaign assistant. Ask me about creating marketing copy, choosing templates, or campaign strategy.",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Replace with actual Gemini API call when key is provided
      const response = await mockAIResponse(input);
      
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          text: response,
          timestamp: new Date()
        }
      ]);
    } catch (error) {
      console.error('Error getting response:', error);
      toast({
        title: "Something went wrong",
        description: "Could not get a response from the assistant.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto pr-4 -mr-4 mb-4 space-y-4">
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`flex max-w-[80%] ${
                message.type === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted'
              } rounded-lg p-3`}
            >
              <div className="mr-2 mt-0.5">
                {message.type === 'user' ? (
                  <User className="h-5 w-5" />
                ) : (
                  <Bot className="h-5 w-5" />
                )}
              </div>
              <div className="space-y-1">
                <p>{message.text}</p>
                <p className="text-xs opacity-70 text-right">
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSendMessage} className="flex gap-2 mt-auto">
        <Input
          placeholder="Ask about campaigns, copy, or templates..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
          className="flex-1"
        />
        <Button type="submit" size="icon" disabled={isLoading}>
          <SendIcon className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default CampaignChat;
