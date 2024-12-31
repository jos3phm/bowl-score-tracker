import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

type Profile = {
  bowling_hand: string | null;
  bowling_style: string | null;
  birthday: string | null;
  gender: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
};

interface ProfileInformationProps {
  profile: Profile | null;
  updateProfile: (field: string, value: string) => Promise<void>;
}

export const ProfileInformation = ({ profile, updateProfile }: ProfileInformationProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState<Profile>(profile || {
    bowling_hand: null,
    bowling_style: null,
    birthday: null,
    gender: null,
    city: null,
    state: null,
    country: null,
  });

  const handleChange = (field: keyof Profile, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Update each changed field
      const updates = Object.entries(formData).filter(([key, value]) => 
        value !== profile?.[key as keyof Profile]
      );

      for (const [field, value] of updates) {
        await updateProfile(field, value as string);
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Update your bowling preferences and personal information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Bowling Hand</Label>
          <Select
            value={formData.bowling_hand || ""}
            onValueChange={(value) => handleChange("bowling_hand", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your bowling hand" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="Right">Right</SelectItem>
              <SelectItem value="Left">Left</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Bowling Style</Label>
          <Select
            value={formData.bowling_style || ""}
            onValueChange={(value) => handleChange("bowling_style", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your bowling style" />
            </SelectTrigger>
            <SelectContent className="bg-white">
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
            value={formData.birthday || ""}
            onChange={(e) => handleChange("birthday", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Gender</Label>
          <Select
            value={formData.gender || ""}
            onValueChange={(value) => handleChange("gender", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your gender" />
            </SelectTrigger>
            <SelectContent className="bg-white">
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
            value={formData.city || ""}
            onChange={(e) => handleChange("city", e.target.value)}
            placeholder="Enter your city"
          />
        </div>

        <div className="space-y-2">
          <Label>State</Label>
          <Input
            value={formData.state || ""}
            onChange={(e) => handleChange("state", e.target.value)}
            placeholder="Enter your state"
          />
        </div>

        <div className="space-y-2">
          <Label>Country</Label>
          <Input
            value={formData.country || ""}
            onChange={(e) => handleChange("country", e.target.value)}
            placeholder="Enter your country"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="w-full"
        >
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </CardFooter>
    </Card>
  );
};