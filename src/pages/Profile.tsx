import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Plus, Trash2 } from "lucide-react";

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
};

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [bowlingBalls, setBowlingBalls] = useState<BowlingBall[]>([]);
  const [newBall, setNewBall] = useState({ name: "", weight: "", notes: "" });
  const [addingBall, setAddingBall] = useState(false);

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

  const addBowlingBall = async () => {
    if (!newBall.name) {
      toast({
        title: "Name required",
        description: "Please enter a name for your bowling ball.",
        variant: "destructive",
      });
      return;
    }

    setAddingBall(true);
    const { error } = await supabase
      .from("bowling_balls")
      .insert({
        name: newBall.name,
        weight: newBall.weight ? parseFloat(newBall.weight) : null,
        notes: newBall.notes || null,
      });

    if (error) {
      toast({
        title: "Error adding bowling ball",
        description: error.message,
        variant: "destructive",
      });
      setAddingBall(false);
      return;
    }

    setNewBall({ name: "", weight: "", notes: "" });
    fetchBowlingBalls();
    setAddingBall(false);
    toast({
      title: "Bowling ball added",
      description: "Your bowling ball has been added successfully.",
    });
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
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your bowling preferences and personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Bowling Hand</Label>
              <Select
                value={profile?.bowling_hand || ""}
                onValueChange={(value) => updateProfile("bowling_hand", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your bowling hand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Right">Right</SelectItem>
                  <SelectItem value="Left">Left</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Bowling Style</Label>
              <Select
                value={profile?.bowling_style || ""}
                onValueChange={(value) => updateProfile("bowling_style", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your bowling style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Traditional">Traditional (Thumb in)</SelectItem>
                  <SelectItem value="Two Handed">Two Handed</SelectItem>
                  <SelectItem value="One Handed">One Handed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Birthday</Label>
              <Input
                type="date"
                value={profile?.birthday || ""}
                onChange={(e) => updateProfile("birthday", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Gender</Label>
              <Select
                value={profile?.gender || ""}
                onValueChange={(value) => updateProfile("gender", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Nonbinary">Nonbinary</SelectItem>
                  <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>City</Label>
              <Input
                value={profile?.city || ""}
                onChange={(e) => updateProfile("city", e.target.value)}
                placeholder="Enter your city"
              />
            </div>

            <div className="space-y-2">
              <Label>State</Label>
              <Input
                value={profile?.state || ""}
                onChange={(e) => updateProfile("state", e.target.value)}
                placeholder="Enter your state"
              />
            </div>

            <div className="space-y-2">
              <Label>Country</Label>
              <Input
                value={profile?.country || ""}
                onChange={(e) => updateProfile("country", e.target.value)}
                placeholder="Enter your country"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Bowling Balls</CardTitle>
            <CardDescription>Manage your bowling ball collection</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              {bowlingBalls.map((ball) => (
                <div key={ball.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{ball.name}</h4>
                    {ball.weight && <p className="text-sm text-gray-500">{ball.weight} lbs</p>}
                    {ball.notes && <p className="text-sm text-gray-500">{ball.notes}</p>}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteBowlingBall(ball.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-4 border-t">
              <h4 className="font-medium">Add New Ball</h4>
              <div className="space-y-2">
                <Input
                  placeholder="Ball Name"
                  value={newBall.name}
                  onChange={(e) => setNewBall(prev => ({ ...prev, name: e.target.value }))}
                />
                <Input
                  type="number"
                  step="0.1"
                  placeholder="Weight (lbs)"
                  value={newBall.weight}
                  onChange={(e) => setNewBall(prev => ({ ...prev, weight: e.target.value }))}
                />
                <Input
                  placeholder="Notes (optional)"
                  value={newBall.notes}
                  onChange={(e) => setNewBall(prev => ({ ...prev, notes: e.target.value }))}
                />
                <Button 
                  className="w-full" 
                  onClick={addBowlingBall}
                  disabled={addingBall}
                >
                  {addingBall ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Ball
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;