import { useState } from "react";
import { Frame, Pin } from "@/types/game";
import { calculateFrameScore } from "@/utils/bowling-score";
import { isGameComplete, canMakeSpare } from "@/utils/bowling/frame-validation";
import { 
  recordStrike,
  recordSpare,
  recordRegularShot
} from "@/utils/bowling/shot-handling";

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

  const updateFrameAndAdvance = (newFrame: Frame) => {
    const newFrames = [...frames];
    newFrames[currentFrame - 1] = newFrame;

    // Recalculate scores
    for (let i = 0; i <= currentFrame - 1; i++) {
      newFrames[i].score = calculateFrameScore(newFrames, i);
    }

    setFrames(newFrames);
    setSelectedPins([]);

    // Advance to next shot/frame
    if (currentFrame === 10) {
      if (currentShot === 1) {
        setCurrentShot(2);
      } else if (currentShot === 2) {
        if (newFrame.isStrike || newFrame.isSpare) {
          setCurrentShot(3);
        } else {
          setCurrentFrame(11); // End game
        }
      } else if (currentShot === 3) {
        setCurrentFrame(11); // End game
      }
    } else {
      if (newFrame.isStrike || currentShot === 2) {
        setCurrentFrame(currentFrame + 1);
        setCurrentShot(1);
      } else {
        setCurrentShot(2);
      }
    }
  };

  const handlePinSelect = (pins: Pin[]) => {
    setSelectedPins(pins);
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
    if (currentFrame > 10 || isGameComplete()) return;
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