import { useState } from "react";
import { Pin } from "@/types/game";
import { isGameComplete, canMakeSpare } from "@/utils/bowling/frame-validation";
import { 
  recordStrike,
  recordSpare,
  recordRegularShot
} from "@/utils/bowling/shot-handling";
import { useGameState } from "./bowling/useGameState";
import { useFrameAdvancement } from "./bowling/useFrameAdvancement";
import { supabase } from "@/integrations/supabase/client";

export const useBowlingGame = () => {
  const {
    currentFrame,
    setCurrentFrame,
    currentShot,
    setCurrentShot,
    selectedPins,
    setSelectedPins,
    frames,
    setFrames,
  } = useGameState();

  const [gameId] = useState(() => crypto.randomUUID());

  const { updateFrameAndAdvance } = useFrameAdvancement(
    frames,
    currentFrame,
    currentShot,
    setFrames,
    setCurrentFrame,
    setCurrentShot,
    setSelectedPins,
  );

  const handlePinClick = (pin: Pin) => {
    setSelectedPins(currentPins => {
      if (currentPins.includes(pin)) {
        return currentPins.filter(p => p !== pin);
      }
      return [...currentPins, pin];
    });
  };

  const handleRegularShot = (knockedDownPins: Pin[]) => {
    if (currentFrame > 10 || isGameComplete(frames)) return;
    
    const newFrame = recordRegularShot(frames, currentFrame - 1, currentShot, knockedDownPins);
    updateFrameAndAdvance(newFrame);
  };

  const handleStrike = () => {
    if (currentFrame > 10) return;
    const newFrame = recordStrike(frames, currentFrame - 1, currentShot);
    updateFrameAndAdvance(newFrame);
  };

  const handleSpare = () => {
    if (currentFrame > 10) return;
    if (!canMakeSpare(frames[currentFrame - 1], currentShot)) return;
    
    const newFrame = recordSpare(frames, currentFrame - 1, currentShot);
    updateFrameAndAdvance(newFrame);
  };

  const handleClear = () => {
    setSelectedPins([]);
  };

  const getRemainingPins = (frame: number, shot: number): Pin[] => {
    if (shot !== 2) return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    
    const currentFrameData = frames[frame - 1];
    if (!currentFrameData?.firstShot) return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    if (frame === 10 && currentFrameData.isStrike) {
      return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    }

    return ([1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as Pin[]).filter(
      pin => !currentFrameData.firstShot?.includes(pin)
    );
  };

  return {
    currentFrame,
    currentShot,
    selectedPins,
    frames,
    isGameComplete: isGameComplete(frames),
    handlePinClick,
    handleStrike,
    handleSpare,
    handleRegularShot,
    handleClear,
    getRemainingPins,
    gameId,
  };
};