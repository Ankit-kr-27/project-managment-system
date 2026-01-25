import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProjectDetails from "./pages/ProjectDetails";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./pages/Register";

import { AuthProvider } from "./context/AuthContext";

import OrganizationList from "./pages/OrganizationList";
import CreateOrganization from "./pages/CreateOrganization";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/organizations"
          element={
            <ProtectedRoute>
              <OrganizationList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-organization"
          element={
            <ProtectedRoute>
              <CreateOrganization />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/project/:projectId"
          element={
            <ProtectedRoute>
              <ProjectDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route path="/register" element={<Register />} />
      </Routes>
    </AuthProvider>
  );
}




export default App;
