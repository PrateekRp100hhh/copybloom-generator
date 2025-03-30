
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, SendIcon, RefreshCcw } from "lucide-react";
import { chatWithAI } from '@/lib/ai';
import { toast } from '@/hooks/use-toast';

const CampaignChat = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{type: 'user' | 'ai', content: string}>>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    // Add user message to chat
    setChatHistory(prev => [...prev, { type: 'user', content: message }]);
    const userMessage = message;
    setMessage('');
    setIsLoading(true);
    
    try {
      // Send message to AI
      const response = await chatWithAI({ message: userMessage });
      
      // Add AI response to chat
      setChatHistory(prev => [...prev, { type: 'ai', content: response }]);
    } catch (error) {
      console.error('Error chatting with AI:', error);
      toast({
        title: "Error",
        description: "Failed to get response from AI assistant",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const clearChat = () => {
    setChatHistory([]);
    toast({
      title: "Chat cleared",
      description: "Chat history has been cleared"
    });
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          Marketing Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="h-[400px] overflow-y-auto mb-4 space-y-4 p-4 border rounded-md">
          {chatHistory.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <p className="text-lg font-medium mb-2">How can I help with your marketing?</p>
              <div className="grid gap-2 max-w-md mx-auto mt-4">
                <div className="rounded-md bg-muted p-2 text-sm cursor-pointer hover:bg-muted/80" 
                  onClick={() => setMessage("Can you help me craft an email for product launch?")}>
                  💼 Help me craft an email for product launch
                </div>
                <div className="rounded-md bg-muted p-2 text-sm cursor-pointer hover:bg-muted/80"
                  onClick={() => setMessage("Write a social media post about our summer discount")}>
                  🏷️ Generate social post for summer discount
                </div>
                <div className="rounded-md bg-muted p-2 text-sm cursor-pointer hover:bg-muted/80"
                  onClick={() => setMessage("Give me ideas for improving conversion rate")}>
                  📈 Ideas for improving conversion rate
                </div>
              </div>
            </div>
          ) : (
            chatHistory.map((chat, index) => (
              <div 
                key={index} 
                className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    chat.type === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  }`}
                >
                  {chat.content}
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg px-4 py-2 bg-muted">
                <div className="flex items-center gap-2">
                  <div className="animate-pulse">Thinking</div>
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 rounded-full bg-current animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="h-2 w-2 rounded-full bg-current animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="h-2 w-2 rounded-full bg-current animate-bounce"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <div className="flex w-full items-center gap-2">
          <Textarea 
            placeholder="Ask me about marketing strategies, content ideas, or editing suggestions..." 
            className="flex-1"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button 
            size="icon" 
            onClick={handleSendMessage}
            disabled={isLoading || !message.trim()}
          >
            <SendIcon className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={clearChat}
        >
          <RefreshCcw className="h-4 w-4 mr-2" />
          Clear conversation
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CampaignChat;
