import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import ResetPassword from "@/pages/ResetPassword";
import AIGenerator from "@/pages/AIGenerator";
import FlashApps from "@/pages/FlashApps";
import Projects from "@/pages/Projects";
import { GuestRoute, ProtectedRoute } from "@/components/auth/RouteGuards";

function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route
          path="/auth"
          element={
            <GuestRoute>
              <Auth />
            </GuestRoute>
          }
        />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/ai-generator"
          element={
            <ProtectedRoute>
              <AIGenerator />
            </ProtectedRoute>
          }
        />
        <Route
          path="/flash-apps"
          element={
            <ProtectedRoute>
              <FlashApps />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <Projects />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
