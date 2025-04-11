
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
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient();

// Protected route component that redirects to auth if not authenticated
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
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

// App routes wrapped with auth provider
const AppRoutes = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/about" element={<About />} />
      <Route 
        path="/auth" 
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <Auth />} 
      />
      
      {/* Protected routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/generator" element={<ProtectedRoute><Generator /></ProtectedRoute>} />
      <Route path="/templates" element={<ProtectedRoute><Templates /></ProtectedRoute>} />
      <Route path="/chat" element={<ProtectedRoute><ChatAssistant /></ProtectedRoute>} />
      <Route path="/youtube-script" element={<ProtectedRoute><YoutubeScriptGeneratorPage /></ProtectedRoute>} />
      <Route path="/content-creation" element={<ProtectedRoute><ContentCreation /></ProtectedRoute>} />
      <Route path="/gemini" element={<ProtectedRoute><GeminiGenerator /></ProtectedRoute>} />
      
      {/* Catch all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <AppRoutes />
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
