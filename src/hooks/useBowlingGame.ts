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
    
    if (currentFrame === 10) {
      if (currentShot === 1) {
        newFrames[9] = {
          ...newFrames[9],
          firstShot: allPins,
          isStrike: true,
        };
        setCurrentShot(2);
      } else if (currentShot === 2) {
        newFrames[9] = {
          ...newFrames[9],
          secondShot: allPins,
        };
        setCurrentShot(3);
      } else if (currentShot === 3) {
        newFrames[9] = {
          ...newFrames[9],
          thirdShot: allPins,
        };
        setCurrentFrame(11); // End game
      }
    } else {
      newFrames[currentFrame - 1] = {
        ...newFrames[currentFrame - 1],
        firstShot: allPins,
        secondShot: null,
        isStrike: true,
      };
      setCurrentFrame(currentFrame + 1);
      setCurrentShot(1);
    }

    // Recalculate scores for all frames
    for (let i = 0; i <= currentFrame - 1; i++) {
      newFrames[i].score = calculateFrameScore(newFrames, i);
    }

    setFrames(newFrames);
    setSelectedPins([]);
  };

  const handleSpare = () => {
    if (currentFrame > 10 || currentShot !== 2) return;

    const newFrames = [...frames];
    const allPins: Pin[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const remainingPins = allPins.filter(
      (pin) => !newFrames[currentFrame - 1].firstShot?.includes(pin)
    );

    if (currentFrame === 10) {
      newFrames[9] = {
        ...newFrames[9],
        secondShot: remainingPins,
        isSpare: true,
      };
      setCurrentShot(3);
    } else {
      newFrames[currentFrame - 1] = {
        ...newFrames[currentFrame - 1],
        secondShot: remainingPins,
        isSpare: true,
      };
      setCurrentFrame(currentFrame + 1);
      setCurrentShot(1);
    }

    // Recalculate scores for all frames
    for (let i = 0; i <= currentFrame - 1; i++) {
      newFrames[i].score = calculateFrameScore(newFrames, i);
    }

    setFrames(newFrames);
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
        
        if (currentFrame === 10) {
          if (currentShot === 1) {
            updatedFrame.firstShot = pinsForShot;
          } else if (currentShot === 2) {
            updatedFrame.secondShot = pinsForShot;
            const totalPins = (updatedFrame.firstShot?.length || 0) + pinsForShot.length;
            if (!updatedFrame.isStrike) {
              updatedFrame.isSpare = totalPins === 10;
            }
          } else if (currentShot === 3) {
            updatedFrame.thirdShot = pinsForShot;
          }
        } else {
          if (currentShot === 1) {
            updatedFrame.firstShot = pinsForShot;
            updatedFrame.isStrike = false;
            updatedFrame.isSpare = false;
          } else if (currentShot === 2) {
            updatedFrame.secondShot = pinsForShot;
            const totalPins = (updatedFrame.firstShot?.length || 0) + pinsForShot.length;
            updatedFrame.isSpare = totalPins === 10 && !updatedFrame.isStrike;
          }
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
    
    if (currentFrame === 10) {
      if (currentShot === 1) {
        setCurrentShot(2);
      } else if (currentShot === 2) {
        if (newFrames[9].isStrike || newFrames[9].isSpare) {
          setCurrentShot(3);
        } else {
          setCurrentFrame(11); // End game
        }
      } else if (currentShot === 3) {
        setCurrentFrame(11); // End game
      }
    } else {
      if (currentShot === 1) {
        setCurrentShot(2);
      } else {
        setCurrentFrame(currentFrame + 1);
        setCurrentShot(1);
      }
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