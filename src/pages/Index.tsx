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
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (!session) {
    navigate("/auth");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-end mb-8">
          <Button variant="outline" onClick={handleLogout}>
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