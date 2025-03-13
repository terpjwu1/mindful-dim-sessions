
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Library from "./pages/Library";
import Session from "./pages/Session";
import NotFound from "./pages/NotFound";
import { MeditationProvider } from "./context/MeditationContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <MeditationProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/library" element={<Library />} />
            <Route path="/session" element={<Session />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </MeditationProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
