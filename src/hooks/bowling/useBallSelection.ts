import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Pin } from "@/types/game";

export const useBallSelection = (gameId: string) => {
  const [selectedBallId, setSelectedBallId] = useState<string | null>(null);
  const [defaultBallId, setDefaultBallId] = useState<string | null>(null);
  const [previousBallId, setPreviousBallId] = useState<string | null>(null);

  // Fetch last used ball from previous game in session
  useEffect(() => {
    const fetchLastUsedBall = async () => {
      try {
        const { data: gameData } = await supabase
          .from('games')
          .select('session_id')
          .eq('id', gameId)
          .single();

        if (gameData?.session_id) {
          const { data: lastBallUsage } = await supabase
            .from('ball_usage')
            .select('ball_id, games!inner(session_id)')
            .eq('games.session_id', gameData.session_id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          if (lastBallUsage?.ball_id) {
            handleBallSelect(lastBallUsage.ball_id);
          }
        }
      } catch (error) {
        console.error('Error fetching last used ball:', error);
      }
    };

    fetchLastUsedBall();
  }, [gameId]);

  const handleBallSelect = (ballId: string | null) => {
    setSelectedBallId(ballId);
    if (!defaultBallId && ballId) {
      setDefaultBallId(ballId);
    }
  };

  const getPinConfigurationKey = (remainingPins: Pin[]) => {
    return remainingPins.sort((a, b) => a - b).join(',');
  };

  const checkSpareBallPreference = async (remainingPins: Pin[]) => {
    if (!remainingPins || remainingPins.length === 0) return null;

    const pinConfig = getPinConfigurationKey(remainingPins);
    
    try {
      const { data, error } = await supabase
        .from('ball_usage')
        .select(`
          ball_id,
          bowling_balls!inner(is_spare_ball)
        `)
        .eq('shot_number', 2)
        .contains('remaining_pins', remainingPins)
        .eq('bowling_balls.is_spare_ball', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error checking spare ball preference:', error);
        return null;
      }

      return data?.ball_id || null;
    } catch (error) {
      console.error('Error checking spare ball preference:', error);
      return null;
    }
  };

  const recordBallUsage = async (
    frameNumber: number,
    shotNumber: 1 | 2 | 3,
    shotType: 'strike' | 'spare' | 'regular',
    remainingPins?: Pin[]
  ) => {
    if (!gameId || !selectedBallId) {
      toast.error("Please select a ball before making a shot");
      return false;
    }

    try {
      // First, check if a record already exists
      const { data: existingRecord, error: fetchError } = await supabase
        .from('ball_usage')
        .select('id')
        .eq('game_id', gameId)
        .eq('frame_number', frameNumber)
        .eq('shot_number', shotNumber)
        .maybeSingle();

      if (fetchError) {
        console.error('Error checking existing ball usage:', fetchError);
        toast.error("Failed to check ball usage");
        return false;
      }

      if (existingRecord) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('ball_usage')
          .update({
            ball_id: selectedBallId,
            remaining_pins: remainingPins || [],
          })
          .eq('id', existingRecord.id);

        if (updateError) {
          console.error('Error updating ball usage:', updateError);
          toast.error("Failed to update ball usage");
          return false;
        }
      } else {
        // Insert new record
        const { error: insertError } = await supabase
          .from('ball_usage')
          .insert({
            game_id: gameId,
            ball_id: selectedBallId,
            frame_number: frameNumber,
            shot_number: shotNumber,
            remaining_pins: remainingPins || [],
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
    checkSpareBallPreference,
  };
};