import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useBallSelection = (gameId: string) => {
  const [selectedBallId, setSelectedBallId] = useState<string | null>(null);
  const [defaultBallId, setDefaultBallId] = useState<string | null>(null);
  const [previousBallId, setPreviousBallId] = useState<string | null>(null);

  const handleBallSelect = (ballId: string | null) => {
    setSelectedBallId(ballId);
    if (!defaultBallId && ballId) {
      setDefaultBallId(ballId);
    }
  };

  const recordBallUsage = async (
    frameNumber: number,
    shotNumber: 1 | 2 | 3,
    shotType: 'strike' | 'spare' | 'regular'
  ) => {
    if (!gameId || !selectedBallId) {
      toast({
        title: "Error",
        description: "Please select a ball before making a shot",
        variant: "destructive",
      });
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('ball_usage')
        .insert({
          game_id: gameId,
          ball_id: selectedBallId,
          frame_number: frameNumber,
          shot_number: shotNumber,
        })
        .select('bowling_balls(is_spare_ball)')
        .single();

      if (error) {
        console.error('Error recording ball usage:', error);
        toast({
          title: "Error",
          description: "Failed to record ball usage. Make sure you own this ball.",
          variant: "destructive",
        });
        return false;
      }

      // Handle ball switching logic
      const isSpare = data?.bowling_balls?.is_spare_ball;
      if (isSpare) {
        setPreviousBallId(defaultBallId);
        setSelectedBallId(defaultBallId);
      } else {
        setDefaultBallId(selectedBallId);
      }

      return true;
    } catch (error) {
      console.error('Error recording ball usage:', error);
      toast({
        title: "Error",
        description: "Failed to record ball usage",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    selectedBallId,
    handleBallSelect,
    recordBallUsage,
  };
};