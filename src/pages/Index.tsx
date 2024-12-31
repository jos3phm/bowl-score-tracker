import { BowlingGame } from "@/components/bowling/BowlingGame";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { LogOut } from "lucide-react";

const Index = () => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
        <BowlingGame />
      </div>
    </div>
  );
};

export default Index;