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

    if (i === 9) {
      // 10th frame special handling
      score += frame.firstShot.length;
      console.log(`10th frame first shot: ${frame.firstShot.length}`);
      
      if (frame.secondShot !== null) {
        score += frame.secondShot.length;
        console.log(`10th frame second shot: ${frame.secondShot.length}`);
      } else if (frame.firstShot.length === 10 || frame.isSpare) {
        return null; // Waiting for second shot after strike/spare
      }
      
      if (frame.thirdShot !== null) {
        score += frame.thirdShot.length;
        console.log(`10th frame third shot: ${frame.thirdShot.length}`);
      } else if ((frame.firstShot.length === 10 || frame.isSpare) && frame.secondShot !== null) {
        return null; // Waiting for third shot after strike/spare
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
          } else {
            return null;
          }
        } else {
          score += nextFrame.firstShot.length;
          console.log(`First bonus: ${nextFrame.firstShot.length}`);
          if (nextFrame.secondShot) {
            score += nextFrame.secondShot.length;
            console.log(`Second bonus: ${nextFrame.secondShot.length}`);
          } else {
            return null;
          }
        }
      } else {
        return null;
      }
    } else if (frame.isSpare) {
      score += 10;
      console.log('Spare detected, added 10');
      
      if (nextFrame?.firstShot) {
        score += nextFrame.isStrike ? 10 : nextFrame.firstShot.length;
        console.log(`Spare bonus: ${nextFrame.isStrike ? 'strike (10)' : nextFrame.firstShot.length}`);
      } else {
        return null;
      }
    } else if (frame.firstShot && frame.secondShot) {
      // Open frame
      score += frame.firstShot.length + frame.secondShot.length;
      console.log(`Open frame: ${frame.firstShot.length} + ${frame.secondShot.length}`);
    } else {
      return null;
    }

    console.log(`Running total after frame ${i + 1}: ${score}`);
  }
  
  return score;
};