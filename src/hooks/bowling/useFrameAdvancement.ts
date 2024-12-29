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
      newFrames[i].score = calculateFrameScore(newFrames, i);
    }

    setFrames(newFrames);
    setSelectedPins([]);

    // Advance to next shot/frame
    if (currentFrame === 10) {
      // Special handling for 10th frame
      if (currentShot === 1) {
        setCurrentShot(2);
      } else if (currentShot === 2) {
        // Only advance to third shot if strike or spare
        if (newFrame.isStrike || newFrame.isSpare) {
          setCurrentShot(3);
        } else {
          setCurrentFrame(11); // End game
        }
      } else if (currentShot === 3) {
        setCurrentFrame(11); // End game
      }
    } else {
      // For frames 1-9
      // If it's a strike OR it's the second shot, advance to next frame
      if (newFrame.isStrike || currentShot === 2) {
        setCurrentFrame(currentFrame + 1);
        setCurrentShot(1);
      } else {
        // If it's not a strike and it's the first shot, advance to second shot
        setCurrentShot(2);
      }
    }
  };

  return { updateFrameAndAdvance };
};