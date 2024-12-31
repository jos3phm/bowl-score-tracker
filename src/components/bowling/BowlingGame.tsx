import { useState } from "react";
import { useBowlingGame } from "@/hooks/useBowlingGame";
import { Pin } from "@/types/game";
import { ScoreCard } from "./ScoreCard";
import { GameContainer } from "./GameContainer";
import { GameContent } from "./GameContent";
import { GameComplete } from "./GameComplete";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const BowlingGame = () => {
  const { toast } = useToast();
  const {
    currentFrame,
    currentShot,
    selectedPins,
    frames,
    isGameComplete,
    handlePinSelect,
    handleStrike,
    handleSpare,
    handleRegularShot,
    handleClear,
    gameId,
  } = useBowlingGame();

  const [selectedHistoricalFrame, setSelectedHistoricalFrame] = useState<number | null>(null);
  const [selectedBallId, setSelectedBallId] = useState<string | null>(null);
  const [defaultBallId, setDefaultBallId] = useState<string | null>(null);
  const [previousBallId, setPreviousBallId] = useState<string | null>(null);

  const isFirstShotStrike = currentFrame === 10 
    ? frames[9]?.isStrike 
    : frames[currentFrame - 1]?.isStrike;

  const handleBallSelect = (ballId: string | null) => {
    setSelectedBallId(ballId);
    if (!defaultBallId && ballId) {
      setDefaultBallId(ballId);
    }
  };

  const recordBallUsage = async (shotType: 'strike' | 'spare' | 'regular') => {
    if (!gameId || !selectedBallId) {
      toast({
        title: "Error",
        description: "Please select a ball before making a shot",
        variant: "destructive",
      });
      return false;
    }

    try {
      const { error: insertError } = await supabase
        .from('ball_usage')
        .insert({
          game_id: gameId,
          ball_id: selectedBallId,
          frame_number: currentFrame,
          shot_number: currentShot,
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
      const { data: ball, error: ballError } = await supabase
        .from('bowling_balls')
        .select('is_spare_ball')
        .eq('id', selectedBallId)
        .single();

      if (ballError) {
        console.error('Error fetching ball details:', ballError);
        return true; // Continue with the shot even if ball details fetch fails
      }

      if (ball?.is_spare_ball) {
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

  const handleShotWithBall = async (
    shotHandler: () => void,
    shotType: 'strike' | 'spare' | 'regular'
  ) => {
    const success = await recordBallUsage(shotType);
    if (success) {
      shotHandler();
    }
  };

  const getRemainingPins = (): Pin[] | undefined => {
    if (currentShot !== 2) return undefined;
    
    const frame = frames[currentFrame - 1];
    if (!frame?.firstShot) return undefined;

    if (currentFrame === 10 && frame.isStrike) {
      return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as Pin[];
    }

    const knockedDownPins = frame.firstShot;
    return ([1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as Pin[]).filter(pin => !knockedDownPins.includes(pin));
  };

  const getHistoricalFrameData = () => {
    if (selectedHistoricalFrame === null) return null;
    
    const frame = frames[selectedHistoricalFrame];
    if (!frame) return null;

    return {
      firstShot: frame.firstShot || [],
      secondShot: frame.secondShot || [],
      isSpare: frame.isSpare,
      isStrike: frame.isStrike
    };
  };

  const calculateTotalScore = () => {
    const lastFrame = frames[9];
    return lastFrame?.score || 0;
  };

  const handleNewGame = () => {
    window.location.reload();
  };

  return (
    <GameContainer>
      {isGameComplete ? (
        <GameComplete
          totalScore={calculateTotalScore()}
          onNewGame={handleNewGame}
        />
      ) : (
        <>
          <ScoreCard
            frames={frames}
            currentFrame={currentFrame}
            onFrameClick={(frameIndex) => setSelectedHistoricalFrame(frameIndex)}
            selectedFrame={selectedHistoricalFrame}
          />
          
          <GameContent
            currentFrame={currentFrame}
            currentShot={currentShot}
            selectedPins={selectedPins}
            isGameComplete={isGameComplete}
            isFirstShotStrike={isFirstShotStrike}
            remainingPins={getRemainingPins()}
            historicalFrame={getHistoricalFrameData()}
            isHistoricalView={selectedHistoricalFrame !== null}
            onPinSelect={handlePinSelect}
            onStrike={() => handleShotWithBall(handleStrike, 'strike')}
            onSpare={() => handleShotWithBall(handleSpare, 'spare')}
            onRegularShot={() => handleShotWithBall(handleRegularShot, 'regular')}
            onClear={handleClear}
            onBallSelect={handleBallSelect}
            selectedBallId={selectedBallId}
          />
        </>
      )}
    </GameContainer>
  );
};