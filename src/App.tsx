import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index.tsx";
import Auth from "./pages/Auth.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import ArticleDetail from "./pages/ArticleDetail.tsx";
import CategoryPage from "./pages/CategoryPage.tsx";
import DocumentExplainer from "./pages/DocumentExplainer.tsx";
import QuizzesIndex from "./pages/QuizzesIndex.tsx";
import QuizPlayer from "./pages/QuizPlayer.tsx";
import Helplines from "./pages/Helplines.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/article/:slug" element={<ArticleDetail />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/document-explainer" element={<DocumentExplainer />} />
            <Route path="/quizzes" element={<QuizzesIndex />} />
            <Route path="/quizzes/:slug" element={<QuizPlayer />} />
            <Route path="/helplines" element={<Helplines />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
