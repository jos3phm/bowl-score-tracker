import { useState } from "react";
import { Frame, Pin } from "@/types/game";
import { calculateFrameScore } from "@/utils/bowling-score";

export const useBowlingGame = () => {
  const [currentFrame, setCurrentFrame] = useState(1);
  const [currentShot, setCurrentShot] = useState<1 | 2 | 3>(1);
  const [selectedPins, setSelectedPins] = useState<Pin[]>([]);
  const [frames, setFrames] = useState<Frame[]>(
    Array(10).fill({}).map(() => ({
      firstShot: null,
      secondShot: null,
      thirdShot: null,
      score: null,
      isStrike: false,
      isSpare: false,
    }))
  );

  const isGameComplete = () => {
    const tenthFrame = frames[9];
    if (!tenthFrame.firstShot) return false;
    
    if (tenthFrame.isStrike) {
      return tenthFrame.secondShot !== null && tenthFrame.thirdShot !== null;
    } else if (tenthFrame.isSpare) {
      return tenthFrame.thirdShot !== null;
    } else {
      return tenthFrame.secondShot !== null;
    }
  };

  const handlePinSelect = (pins: Pin[]) => {
    setSelectedPins(pins);
  };

  const handleStrike = () => {
    if (currentFrame > 10) return;

    const newFrames = [...frames];
    const allPins: Pin[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    
    newFrames[currentFrame - 1] = {
      ...newFrames[currentFrame - 1],
      firstShot: allPins,
      secondShot: null,
      isStrike: true,
    };

    // Recalculate scores for all frames
    for (let i = 0; i <= currentFrame - 1; i++) {
      newFrames[i].score = calculateFrameScore(newFrames, i);
    }

    setFrames(newFrames);
    if (currentFrame < 10) {
      setCurrentFrame(currentFrame + 1);
      setCurrentShot(1);
    } else if (currentFrame === 10) {
      setCurrentShot(2);
    }
    setSelectedPins([]);
  };

  const handleSpare = () => {
    if (currentFrame > 10 || currentShot !== 2) return;

    const newFrames = [...frames];
    const allPins: Pin[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const remainingPins = allPins.filter(
      (pin) => !newFrames[currentFrame - 1].firstShot?.includes(pin)
    );

    newFrames[currentFrame - 1] = {
      ...newFrames[currentFrame - 1],
      secondShot: remainingPins,
      isSpare: true,
    };

    // Recalculate scores for all frames
    for (let i = 0; i <= currentFrame - 1; i++) {
      newFrames[i].score = calculateFrameScore(newFrames, i);
    }

    setFrames(newFrames);
    if (currentFrame < 10) {
      setCurrentFrame(currentFrame + 1);
      setCurrentShot(1);
    } else {
      setCurrentShot(3);
    }
    setSelectedPins([]);
  };

  const handleRegularShot = () => {
    if (currentFrame > 10 || isGameComplete()) return;

    // Even if no pins are selected, we should record it as a shot with 0 pins
    const pinsForShot = selectedPins.length === 0 ? [] : selectedPins;
    const isStrike = currentShot === 1 && pinsForShot.length === 10;

    if (isStrike) {
      handleStrike();
      return;
    }

    const newFrames = [...frames].map((frame, index) => {
      if (index === currentFrame - 1) {
        const updatedFrame = { ...frame };
        
        if (currentShot === 1) {
          updatedFrame.firstShot = pinsForShot;
          updatedFrame.isStrike = false;
          updatedFrame.isSpare = false;
        } else if (currentShot === 2) {
          updatedFrame.secondShot = pinsForShot;
          const totalPins = (updatedFrame.firstShot?.length || 0) + pinsForShot.length;
          updatedFrame.isSpare = totalPins === 10 && !updatedFrame.isStrike;
        } else if (currentFrame === 10 && currentShot === 3) {
          updatedFrame.thirdShot = pinsForShot;
        }
        
        return updatedFrame;
      }
      return frame;
    });

    // Recalculate scores for all frames
    for (let i = 0; i <= currentFrame - 1; i++) {
      newFrames[i].score = calculateFrameScore(newFrames, i);
    }

    setFrames(newFrames);
    
    if (currentShot === 1) {
      setCurrentShot(2);
    } else if (currentShot === 2) {
      if (currentFrame < 10) {
        setCurrentFrame(currentFrame + 1);
        setCurrentShot(1);
      } else if (currentFrame === 10) {
        const frame = newFrames[9];
        if (frame.isStrike || frame.isSpare) {
          setCurrentShot(3);
        } else {
          setCurrentFrame(11); // End game
        }
      }
    } else if (currentFrame === 10 && currentShot === 3) {
      setCurrentFrame(11); // End game
    }
    
    setSelectedPins([]);
  };

  const handleClear = () => {
    setSelectedPins([]);
  };

  return {
    currentFrame,
    currentShot,
    selectedPins,
    frames,
    isGameComplete: isGameComplete(),
    handlePinSelect,
    handleStrike,
    handleSpare,
    handleRegularShot,
    handleClear,
  };
};