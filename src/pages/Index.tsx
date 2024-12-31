import { BowlingGame } from "@/components/bowling/BowlingGame";
import { Button } from "@/components/ui/button";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { supabase } from "@/integrations/supabase/client";
import { LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [session, setSession] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Index component mounted");
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Auth session check:", session ? "Session exists" : "No session");
      setSession(session);
    }).catch(error => {
      console.error("Error checking session:", error);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", _event);
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    console.log("Session state updated:", session ? "Logged in" : "Not logged in");
    if (!session) {
      console.log("Redirecting to auth page");
      navigate("/auth");
    }
  }, [session, navigate]);

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-end mb-8">
          <Button 
            variant="outline" 
            onClick={async () => {
              console.log("Logout clicked");
              await supabase.auth.signOut();
              navigate("/auth");
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
        <Dashboard />
      </div>
    </div>
  );
};

export default Index;