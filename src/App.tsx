import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import ResetPassword from "@/pages/ResetPassword";
import { GuestRoute, ProtectedRoute } from "@/components/auth/RouteGuards";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardOverview from "@/pages/dashboard/DashboardOverview";
import SupportChat from "@/pages/dashboard/SupportChat";
import GeneratedBriefs from "@/pages/dashboard/GeneratedBriefs";
import QuantumOptimization from "@/pages/dashboard/QuantumOptimization";
import DeploymentTracker from "@/pages/dashboard/DeploymentTracker";
import PhotoStudio from "@/pages/dashboard/PhotoStudio";
import AIRecommendation from "@/pages/dashboard/AIRecommendation";
import FlashAppsGenerator from "@/pages/dashboard/FlashAppsGenerator";
import DashboardSettings from "@/pages/dashboard/DashboardSettings";
import FlashApps from "@/pages/FlashApps";
import Projects from "@/pages/Projects";

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

        {/* Protected Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardOverview />} />
          <Route path="support-chat" element={<SupportChat />} />
          <Route path="briefs" element={<GeneratedBriefs />} />
          <Route path="quantum-optimization" element={<QuantumOptimization />} />
          <Route path="deployment-tracker" element={<DeploymentTracker />} />
          <Route path="photo-studio" element={<PhotoStudio />} />
          <Route path="ai-recommendation" element={<AIRecommendation />} />
          <Route path="flash-apps" element={<FlashAppsGenerator />} />
          <Route path="settings" element={<DashboardSettings />} />
        </Route>

        {/* Public pages */}
        <Route
          path="/flash-apps"
          element={
            <FlashApps />
          }
        />
        <Route
          path="/projects"
          element={
            <Projects />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
