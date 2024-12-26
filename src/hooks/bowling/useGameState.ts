import { useState } from "react";
import { Frame, Pin } from "@/types/game";

const createInitialFrames = (): Frame[] => 
  Array(10).fill({}).map(() => ({
    firstShot: null,
    secondShot: null,
    thirdShot: null,
    score: null,
    isStrike: false,
    isSpare: false,
  }));

export const useGameState = () => {
  const [currentFrame, setCurrentFrame] = useState(1);
  const [currentShot, setCurrentShot] = useState<1 | 2 | 3>(1);
  const [selectedPins, setSelectedPins] = useState<Pin[]>([]);
  const [frames, setFrames] = useState<Frame[]>(createInitialFrames());

  return {
    currentFrame,
    setCurrentFrame,
    currentShot,
    setCurrentShot,
    selectedPins,
    setSelectedPins,
    frames,
    setFrames,
  };
};