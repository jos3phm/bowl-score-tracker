import { Frame } from "@/types/game";
import { calculateFrameScore } from "@/utils/bowling-score";

export const useFrameAdvancement = (
  frames: Frame[],
  currentFrame: number,
  currentShot: 1 | 2 | 3,
  setFrames: (frames: Frame[]) => void,
  setCurrentFrame: (frame: number) => void,
  setCurrentShot: (shot: 1 | 2 | 3) => void,
  setSelectedPins: (pins: []) => void,
) => {
  const updateFrameAndAdvance = (newFrame: Frame) => {
    const newFrames = [...frames];
    newFrames[currentFrame - 1] = newFrame;

    // Recalculate scores
    for (let i = 0; i <= currentFrame - 1; i++) {
      const score = calculateFrameScore(newFrames, i);
      newFrames[i] = { ...newFrames[i], score };
    }

    setFrames(newFrames);
    setSelectedPins([]);

    // Immediate frame advancement for strikes in frames 1-9
    if (newFrame.isStrike && currentFrame < 10) {
      setCurrentFrame(currentFrame + 1);
      setCurrentShot(1);
      return;
    }

    // Special handling for 10th frame
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
      // Regular frames (1-9)
      if (currentShot === 2 || newFrame.isStrike) {
        setCurrentFrame(currentFrame + 1);
        setCurrentShot(1);
      } else {
        setCurrentShot(2);
      }
    }
  };

  return { updateFrameAndAdvance };
};