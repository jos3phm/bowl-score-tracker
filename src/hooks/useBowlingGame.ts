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

  const { updateFrameAndAdvance } = useFrameAdvancement(
    frames,
    currentFrame,
    currentShot,
    setFrames,
    setCurrentFrame,
    setCurrentShot,
    setSelectedPins,
  );

  const handlePinSelect = (pinsOrUpdater: Pin[] | ((currentPins: Pin[]) => Pin[])) => {
    if (typeof pinsOrUpdater === 'function') {
      setSelectedPins(pinsOrUpdater);
    } else {
      setSelectedPins(pinsOrUpdater);
    }
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

  const handleRegularShot = () => {
    if (currentFrame > 10 || isGameComplete(frames)) return;
    
    const newFrame = recordRegularShot(frames, currentFrame - 1, currentShot, selectedPins);
    updateFrameAndAdvance(newFrame);
  };

  const handleClear = () => {
    setSelectedPins([]);
  };

  return {
    currentFrame,
    currentShot,
    selectedPins,
    frames,
    isGameComplete: isGameComplete(frames),
    handlePinSelect,
    handleStrike,
    handleSpare,
    handleRegularShot,
    handleClear,
  };
};