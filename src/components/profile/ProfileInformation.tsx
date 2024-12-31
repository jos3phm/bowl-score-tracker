import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
            value={profile?.bowling_hand || ""}
            onValueChange={(value) => updateProfile("bowling_hand", value)}
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
            value={profile?.bowling_style || ""}
            onValueChange={(value) => updateProfile("bowling_style", value)}
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
  );
};