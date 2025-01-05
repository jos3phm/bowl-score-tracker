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
      // First, verify game ownership
      const { data: gameData, error: gameError } = await supabase
        .from('games')
        .select('id')
        .eq('id', gameId)
        .single();

      if (gameError || !gameData) {
        console.error('Error verifying game ownership:', gameError);
        toast.error("Failed to verify game ownership");
        return false;
      }

      // Then, verify ball ownership and get ball details
      const { data: ballData, error: ballError } = await supabase
        .from('bowling_balls')
        .select('is_spare_ball')
        .eq('id', selectedBallId)
        .single();

      if (ballError || !ballData) {
        console.error('Error verifying ball ownership:', ballError);
        toast.error("Failed to verify ball ownership");
        return false;
      }

      // Finally, record the ball usage
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

      // Handle ball switching logic
      if (ballData.is_spare_ball) {
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