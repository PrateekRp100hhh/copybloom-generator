
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Generator from "./pages/Generator";
import Templates from "./pages/Templates";
import About from "./pages/About";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import ChatAssistant from "./pages/ChatAssistant";
import ContentCreation from "./pages/ContentCreation";
import ContentGenerator from "./pages/ContentGenerator";
import GeminiGenerator from "./pages/GeminiGenerator";
import { AuthProvider } from "./contexts/AuthContext";
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient();

// Protected route component moved inside AuthProvider
const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Routes with authentication check disabled */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/generator" element={<Generator />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/chat" element={<ChatAssistant />} />
            <Route path="/content-generator" element={<ContentGenerator />} />
            <Route path="/content-creation" element={<ContentCreation />} />
            <Route path="/gemini" element={<GeminiGenerator />} />
            
            {/* Catch all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
          <Sonner />
        </AuthProvider>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

// Protected component (now bypassed, but kept for future reference)
import { useAuth } from "./contexts/AuthContext";

const ProtectedComponent = ({ children }: { children: React.ReactNode }) => {
  // This function is kept but not used in routes anymore
  const { isAuthenticated, isLoading } = useAuth();
  
  // Always allow access by returning children directly
  return <>{children}</>;
};

export default App;
