import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import NewGame from "@/pages/NewGame";
import Index from "@/pages/Index";
import Profile from "@/pages/Profile";
import History from "@/pages/History";
import Stats from "@/pages/Stats";
import Auth from "@/pages/Auth";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

function App() {
  // Listen for auth changes to handle initial load properly
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/"
            element={
              <AuthGuard>
                <Index />
              </AuthGuard>
            }
          />
          <Route
            path="/new-game"
            element={
              <AuthGuard>
                <NewGame />
              </AuthGuard>
            }
          />
          <Route
            path="/profile"
            element={
              <AuthGuard>
                <Profile />
              </AuthGuard>
            }
          />
          <Route
            path="/history"
            element={
              <AuthGuard>
                <History />
              </AuthGuard>
            }
          />
          <Route
            path="/stats"
            element={
              <AuthGuard>
                <Stats />
              </AuthGuard>
            }
          />
          {/* Catch all route - redirect to auth if not found */}
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      </Router>
      <Toaster />
    </>
  );
}

export default App;