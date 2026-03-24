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
import FlashAppsGenerator from "@/pages/dashboard/FlashAppsGenerator";
import DashboardSettings from "@/pages/dashboard/DashboardSettings";
import IdeaToBlueprint from "@/pages/dashboard/IdeaToBlueprint";
import FlashApps from "@/pages/FlashApps";
import Projects from "@/pages/Projects";
import SubmitProject from "@/pages/SubmitProject";

import AdminLayout from "@/components/admin/AdminLayout";
import AdminBlueprints from "@/pages/admin/AdminBlueprints";
import AdminToolSpecs from "@/pages/admin/AdminToolSpecs";
import AdminClients from "@/pages/admin/AdminClients";
import AdminSubmissions from "@/pages/admin/AdminSubmissions";
import AdminProjects from "@/pages/admin/AdminProjects";
import AdminAnalytics from "@/pages/admin/AdminAnalytics";
import AdminFlashApps from "@/pages/admin/AdminFlashApps";
import AdminGeneratedReports from "@/pages/admin/AdminGeneratedReports";
import AdminQuantum from "@/pages/admin/AdminQuantum";
import AdminIdeaBlueprint from "@/pages/admin/AdminIdeaBlueprint";
import AdminAIRecommendations from "@/pages/admin/AdminAIRecommendations";
import AIRecommendationPublic from "@/pages/AIRecommendationPublic";
import IdeaToBlueprintPublic from "@/pages/IdeaToBlueprintPublic";

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
          <Route path="idea-to-blueprint" element={<IdeaToBlueprint />} />
          <Route path="flash-apps" element={<FlashAppsGenerator />} />
          <Route path="settings" element={<DashboardSettings />} />
        </Route>

        {/* Admin Panel (role-based) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminBlueprints />} />
          <Route path="tool-specs" element={<AdminToolSpecs />} />
          <Route path="clients" element={<AdminClients />} />
          <Route path="submissions" element={<AdminSubmissions />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="flash-apps" element={<AdminFlashApps />} />
          <Route path="reports" element={<AdminGeneratedReports />} />
          <Route path="quantum" element={<AdminQuantum />} />
          <Route path="idea-blueprint" element={<AdminIdeaBlueprint />} />
          <Route path="ai-recommendations" element={<AdminAIRecommendations />} />
        </Route>

        {/* Public pages */}
        <Route path="/quantum-generation" element={<FlashApps />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/submit-project" element={<SubmitProject />} />
        <Route path="/ai-recommendation" element={<AIRecommendationPublic />} />
        <Route path="/idea-to-blueprint" element={<IdeaToBlueprintPublic />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
