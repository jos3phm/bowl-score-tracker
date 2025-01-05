import { useState } from "react";
import { Frame, Pin } from "@/types/game";

export const useHistoricalFrame = (frames: Frame[]) => {
  const [selectedHistoricalFrame, setSelectedHistoricalFrame] = useState<number | null>(null);

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

  const getRemainingPins = (currentFrame: number, currentShot: number): Pin[] | undefined => {
    if (currentShot !== 2) return undefined;
    
    const frame = frames[currentFrame - 1];
    if (!frame?.firstShot) return undefined;

    if (currentFrame === 10 && frame.isStrike) {
      return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as Pin[];
    }

    const knockedDownPins = frame.firstShot;
    return ([1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as Pin[]).filter(pin => !knockedDownPins.includes(pin));
  };

  return {
    selectedHistoricalFrame,
    setSelectedHistoricalFrame,
    getHistoricalFrameData,
    getRemainingPins,
  };
};