
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
import YoutubeScriptGeneratorPage from "./pages/YoutubeScriptGenerator";
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
            
            {/* Protected routes with individual protection */}
            <Route path="/dashboard" element={<ProtectedComponent><Dashboard /></ProtectedComponent>} />
            <Route path="/generator" element={<ProtectedComponent><Generator /></ProtectedComponent>} />
            <Route path="/templates" element={<ProtectedComponent><Templates /></ProtectedComponent>} />
            <Route path="/chat" element={<ProtectedComponent><ChatAssistant /></ProtectedComponent>} />
            <Route path="/youtube-script" element={<ProtectedComponent><YoutubeScriptGeneratorPage /></ProtectedComponent>} />
            <Route path="/content-creation" element={<ProtectedComponent><ContentCreation /></ProtectedComponent>} />
            <Route path="/gemini" element={<ProtectedComponent><GeminiGenerator /></ProtectedComponent>} />
            
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

// Protected component that checks authentication
import { useAuth } from "./contexts/AuthContext";

const ProtectedComponent = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }
  
  return <>{children}</>;
};

export default App;
