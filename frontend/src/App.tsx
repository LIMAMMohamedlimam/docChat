import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuthContext } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import DocumentsPage from "./pages/DocumentsPage";
import ChatPage from "./pages/ChatPage";
import Navbar from "./components/Navbar";
import { ReactNode } from "react";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuthContext();
  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { user, loading } = useAuthContext();
  if (loading) return null;

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/documents" replace /> : <LoginPage />} />
      <Route
        path="/documents"
        element={
          <ProtectedRoute>
            <>
              <Navbar />
              <DocumentsPage />
            </>
          </ProtectedRoute>
        }
      />
      <Route
        path="/chat/:documentId?"
        element={
          <ProtectedRoute>
            <>
              <Navbar />
              <ChatPage />
            </>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to={user ? "/documents" : "/login"} replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
