
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
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          Marketing Assistant
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] overflow-y-auto mb-4 space-y-4 p-4 border rounded-md">
          {chatHistory.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <p>Start a conversation with your marketing assistant.</p>
              <p className="text-sm">Ask questions about your campaign or get copy suggestions.</p>
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
            placeholder="Ask about your marketing campaign..." 
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
