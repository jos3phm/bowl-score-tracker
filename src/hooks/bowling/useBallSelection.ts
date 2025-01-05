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
      toast.error("Please select a ball before making a shot");
      return false;
    }

    try {
      // First, check if a record already exists for this frame and shot
      const { data: existingUsage, error: checkError } = await supabase
        .from('ball_usage')
        .select('id')
        .eq('game_id', gameId)
        .eq('frame_number', frameNumber)
        .eq('shot_number', shotNumber)
        .maybeSingle();

      if (checkError) {
        console.error('Error checking existing ball usage:', checkError);
        toast.error("Failed to verify ball usage");
        return false;
      }

      // If a record exists, update it instead of creating a new one
      if (existingUsage) {
        const { error: updateError } = await supabase
          .from('ball_usage')
          .update({ ball_id: selectedBallId })
          .eq('id', existingUsage.id);

        if (updateError) {
          console.error('Error updating ball usage:', updateError);
          toast.error("Failed to update ball usage");
          return false;
        }
      } else {
        // If no record exists, create a new one
        const { error: insertError } = await supabase
          .from('ball_usage')
          .insert({
            game_id: gameId,
            ball_id: selectedBallId,
            frame_number: frameNumber,
            shot_number: shotNumber,
          });

        if (insertError) {
          console.error('Error recording ball usage:', insertError);
          toast.error("Failed to record ball usage");
          return false;
        }
      }

      // Handle ball switching logic
      const { data: ballData, error: ballError } = await supabase
        .from('bowling_balls')
        .select('is_spare_ball')
        .eq('id', selectedBallId)
        .single();

      if (ballError) {
        console.error('Error verifying ball details:', ballError);
      } else if (ballData?.is_spare_ball) {
        setPreviousBallId(defaultBallId);
        setSelectedBallId(defaultBallId);
      } else {
        setDefaultBallId(selectedBallId);
      }

      return true;
    } catch (error) {
      console.error('Error recording ball usage:', error);
      toast.error("Failed to record ball usage");
      return false;
    }
  };

  return {
    selectedBallId,
    handleBallSelect,
    recordBallUsage,
  };
};