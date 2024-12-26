import { Frame } from "@/types/game";

export const calculateFrameScore = (frames: Frame[], frameIndex: number): number => {
  let score = 0;
  console.log(`Calculating score for frame ${frameIndex + 1}`);
  
  for (let i = 0; i <= frameIndex; i++) {
    const frame = frames[i];
    const nextFrame = i < 9 ? frames[i + 1] : null;
    const followingFrame = i < 8 ? frames[i + 2] : null;

    console.log(`\nFrame ${i + 1}:`);
    console.log('Current frame:', {
      isStrike: frame.isStrike,
      isSpare: frame.isSpare,
      firstShot: frame.firstShot?.length,
      secondShot: frame.secondShot?.length
    });
    
    if (nextFrame) {
      console.log('Next frame:', {
        isStrike: nextFrame.isStrike,
        isSpare: nextFrame.isSpare,
        firstShot: nextFrame.firstShot?.length,
        secondShot: nextFrame.secondShot?.length
      });
    }
    
    if (followingFrame) {
      console.log('Following frame:', {
        isStrike: followingFrame.isStrike,
        isSpare: followingFrame.isSpare,
        firstShot: followingFrame.firstShot?.length,
        secondShot: followingFrame.secondShot?.length
      });
    }

    if (frame.isStrike) {
      score += 10;
      console.log('Strike detected, base score:', score);
      
      // For a strike, we need the next two shots
      if (nextFrame?.isStrike) {
        // Next frame is also a strike
        score += 10;
        console.log('Next frame is strike, added 10. Current score:', score);
        
        if (i < 8 && followingFrame?.isStrike) {
          // Third consecutive strike
          score += 10;
          console.log('Third consecutive strike, added 10. Final score:', score);
        } else if (i < 8 && followingFrame?.firstShot) {
          // Following frame's first shot
          score += followingFrame.firstShot.length;
          console.log(`Added following frame's first shot (${followingFrame.firstShot.length}). Final score:`, score);
        } else if (i === 8 && nextFrame.secondShot) {
          // Special case for 9th frame
          score += nextFrame.secondShot.length;
          console.log(`Special case: 9th frame, added second shot (${nextFrame.secondShot.length}). Final score:`, score);
        } else {
          // Not enough information yet
          console.log('Not enough information to calculate full strike bonus. Returning 0');
          return 0;
        }
      } else if (nextFrame?.firstShot && nextFrame?.secondShot) {
        // Next frame is complete
        score += nextFrame.firstShot.length + nextFrame.secondShot.length;
        console.log(`Added next frame's shots (${nextFrame.firstShot.length} + ${nextFrame.secondShot.length}). Final score:`, score);
      } else {
        // Not enough information yet
        console.log('Not enough information to calculate strike bonus. Returning 0');
        return 0;
      }
    } else if (frame.isSpare) {
      score += 10;
      console.log('Spare detected, base score:', score);
      if (nextFrame?.firstShot) {
        score += nextFrame.firstShot.length;
        console.log(`Added next frame's first shot (${nextFrame.firstShot.length}). Final score:`, score);
      } else {
        console.log('Not enough information to calculate spare bonus. Returning 0');
        return 0;
      }
    } else {
      // Open frame
      if (frame.firstShot && frame.secondShot) {
        score += frame.firstShot.length + frame.secondShot.length;
        console.log(`Open frame, added shots (${frame.firstShot.length} + ${frame.secondShot.length}). Final score:`, score);
      } else {
        console.log('Incomplete open frame. Returning 0');
        return 0;
      }
    }
  }
  
  console.log(`Final score for frame ${frameIndex + 1}:`, score);
  return score;
};