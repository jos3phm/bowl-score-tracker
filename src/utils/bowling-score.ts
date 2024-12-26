import { Frame } from "@/types/game";

export const calculateFrameScore = (frames: Frame[], frameIndex: number): number | null => {
  let score = 0;
  
  // Calculate running total of all frames up to this one
  for (let i = 0; i <= frameIndex; i++) {
    const frame = frames[i];
    const nextFrame = i < 9 ? frames[i + 1] : null;
    const followingFrame = i < 8 ? frames[i + 2] : null;

    console.log(`\nCalculating frame ${i + 1}:`);
    
    // Base score for the current frame
    if (frame.firstShot === null) return null;

    // For the current frame being calculated
    if (i === frameIndex) {
      if (i === 9) {
        // 10th frame special handling
        if (frame.isStrike) {
          // Need second shot for strike
          if (frame.secondShot === null) return null;
          // Need third shot if second shot is strike or spare
          if (frame.secondShot.length === 10 && frame.thirdShot === null) return null;
        } else if (frame.isSpare) {
          // Need third shot for spare
          if (frame.thirdShot === null) return null;
        } else {
          // Open frame - need both shots
          if (frame.secondShot === null) return null;
        }
      } else {
        // Frames 1-9
        if (frame.isStrike && i < 9) {
          if (!nextFrame?.firstShot || (nextFrame.isStrike && !followingFrame?.firstShot)) {
            return null;
          }
        } else if (frame.isSpare && i < 9) {
          if (!nextFrame?.firstShot) {
            return null;
          }
        } else if (!frame.secondShot && !frame.isStrike) {
          return null;
        }
      }
    }

    if (i === 9) {
      // 10th frame scoring
      score += frame.firstShot.length;
      
      if (frame.secondShot) {
        score += frame.secondShot.length;
        
        // Add third shot if it exists (after strike or spare)
        if (frame.thirdShot) {
          score += frame.thirdShot.length;
        }
      }
    } else if (frame.isStrike) {
      score += 10;
      console.log('Strike detected, added 10');
      
      // Calculate strike bonus
      if (nextFrame?.firstShot) {
        if (nextFrame.isStrike) {
          score += 10;
          console.log('First bonus: strike (10)');
          
          if (followingFrame?.firstShot) {
            score += followingFrame.isStrike ? 10 : followingFrame.firstShot.length;
            console.log(`Second bonus: ${followingFrame.isStrike ? 'strike (10)' : followingFrame.firstShot.length}`);
          }
        } else {
          score += nextFrame.firstShot.length;
          console.log(`First bonus: ${nextFrame.firstShot.length}`);
          if (nextFrame.secondShot) {
            score += nextFrame.secondShot.length;
            console.log(`Second bonus: ${nextFrame.secondShot.length}`);
          }
        }
      }
    } else if (frame.isSpare) {
      score += 10;
      console.log('Spare detected, added 10');
      
      if (nextFrame?.firstShot) {
        score += nextFrame.isStrike ? 10 : nextFrame.firstShot.length;
        console.log(`Spare bonus: ${nextFrame.isStrike ? 'strike (10)' : nextFrame.firstShot.length}`);
      }
    } else if (frame.firstShot && frame.secondShot) {
      // Open frame
      score += frame.firstShot.length + frame.secondShot.length;
      console.log(`Open frame: ${frame.firstShot.length} + ${frame.secondShot.length}`);
    }

    console.log(`Running total after frame ${i + 1}: ${score}`);
  }
  
  return score;
};