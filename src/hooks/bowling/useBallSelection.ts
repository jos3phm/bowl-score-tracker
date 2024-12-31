import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useBallSelection = (gameId: string) => {
  const { toast } = useToast();
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
      // First verify ball ownership
      const { data: ball, error: ballError } = await supabase
        .from('bowling_balls')
        .select('user_id, is_spare_ball')
        .eq('id', selectedBallId)
        .single();

      if (ballError || !ball) {
        toast({
          title: "Error",
          description: "Invalid ball selection",
          variant: "destructive",
        });
        return false;
      }

      // Then record the ball usage
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
        toast({
          title: "Error",
          description: "Failed to record ball usage",
          variant: "destructive",
        });
        return false;
      }

      // Handle ball switching logic
      if (ball.is_spare_ball) {
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