import { Frame } from "@/types/game";

export const calculateFrameScore = (frames: Frame[], frameIndex: number): number => {
  let score = 0;
  
  for (let i = 0; i <= frameIndex; i++) {
    const frame = frames[i];
    const nextFrame = i < 9 ? frames[i + 1] : null;
    const followingFrame = i < 8 ? frames[i + 2] : null;

    if (frame.isStrike) {
      score += 10;
      
      // For a strike, we need the next two shots
      if (nextFrame?.isStrike) {
        // Next frame is also a strike
        score += 10;
        
        if (i < 8 && followingFrame?.isStrike) {
          // Third consecutive strike
          score += 10;
        } else if (i < 8 && followingFrame?.firstShot) {
          // Following frame's first shot
          score += followingFrame.firstShot.length;
        } else if (i === 8 && nextFrame.secondShot) {
          // Special case for 9th frame
          score += nextFrame.secondShot.length;
        } else {
          // Not enough information yet
          return 0;
        }
      } else if (nextFrame?.firstShot && nextFrame?.secondShot) {
        // Next frame is complete
        score += nextFrame.firstShot.length + nextFrame.secondShot.length;
      } else {
        // Not enough information yet
        return 0;
      }
    } else if (frame.isSpare) {
      score += 10;
      if (nextFrame?.firstShot) {
        score += nextFrame.firstShot.length;
      } else {
        return 0;
      }
    } else {
      // Open frame
      if (frame.firstShot && frame.secondShot) {
        score += frame.firstShot.length + frame.secondShot.length;
      } else {
        return 0;
      }
    }
  }
  
  return score;
};