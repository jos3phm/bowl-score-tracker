import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { ProfileInformation } from "@/components/profile/ProfileInformation";
import { BowlingBallList } from "@/components/profile/BowlingBallList";

type Profile = {
  bowling_hand: string | null;
  bowling_style: string | null;
  birthday: string | null;
  gender: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
};

type BowlingBall = {
  id: string;
  name: string;
  weight: number | null;
  notes: string | null;
  brand: string | null;
  hook_rating: number | null;
};

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [bowlingBalls, setBowlingBalls] = useState<BowlingBall[]>([]);

  useEffect(() => {
    fetchProfile();
    fetchBowlingBalls();
  }, []);

  const fetchProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select()
      .eq("id", session.user.id)
      .single();

    if (error) {
      toast({
        title: "Error fetching profile",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setProfile(data);
    setLoading(false);
  };

  const fetchBowlingBalls = async () => {
    const { data, error } = await supabase
      .from("bowling_balls")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error fetching bowling balls",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setBowlingBalls(data);
  };

  const updateProfile = async (field: string, value: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { error } = await supabase
      .from("profiles")
      .update({ [field]: value })
      .eq("id", session.user.id);

    if (error) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setProfile(prev => prev ? { ...prev, [field]: value } : null);
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    });
  };

  const addBowlingBall = async (ball: Omit<BowlingBall, 'id'>) => {
    const { error } = await supabase
      .from("bowling_balls")
      .insert(ball);

    if (error) {
      toast({
        title: "Error adding bowling ball",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }

    fetchBowlingBalls();
  };

  const deleteBowlingBall = async (id: string) => {
    const { error } = await supabase
      .from("bowling_balls")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Error deleting bowling ball",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    fetchBowlingBalls();
    toast({
      title: "Bowling ball deleted",
      description: "Your bowling ball has been deleted successfully.",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Button variant="outline" onClick={() => navigate("/")} className="mb-6">
        Back to Dashboard
      </Button>

      <div className="grid gap-8 md:grid-cols-2">
        <ProfileInformation 
          profile={profile}
          updateProfile={updateProfile}
        />
        <BowlingBallList
          bowlingBalls={bowlingBalls}
          onDelete={deleteBowlingBall}
          onAdd={addBowlingBall}
        />
      </div>
    </div>
  );
};

export default Profile;