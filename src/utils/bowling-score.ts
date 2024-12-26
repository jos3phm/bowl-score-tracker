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
      
      // Need second shot for all cases
      if (frame.secondShot === null) {
        console.log('Waiting for second shot');
        return null;
      }
      
      score += frame.secondShot.length;
      console.log(`10th frame second shot: ${frame.secondShot.length}`);
      
      // Need third shot only after strike or spare
      if (frame.isStrike || frame.isSpare) {
        if (frame.thirdShot === null) {
          console.log('Waiting for third shot after strike/spare');
          return null;
        }
        score += frame.thirdShot.length;
        console.log(`10th frame third shot: ${frame.thirdShot.length}`);
      }
    } else if (frame.isStrike) {
      score += 10;
      console.log('Strike detected, added 10');
      
      if (!nextFrame?.firstShot) return null;
      
      if (nextFrame.isStrike) {
        score += 10;
        console.log('First bonus: strike (10)');
        
        if (i < 8) {
          if (!followingFrame?.firstShot) return null;
          score += followingFrame.isStrike ? 10 : followingFrame.firstShot.length;
          console.log(`Second bonus: ${followingFrame.isStrike ? 'strike (10)' : followingFrame.firstShot.length}`);
        } else {
          if (!nextFrame.secondShot) return null;
          score += nextFrame.secondShot.length;
          console.log(`Second bonus: ${nextFrame.secondShot.length}`);
        }
      } else {
        if (!nextFrame.secondShot) return null;
        score += nextFrame.firstShot.length + nextFrame.secondShot.length;
        console.log(`Strike bonus: ${nextFrame.firstShot.length} + ${nextFrame.secondShot.length}`);
      }
    } else if (frame.isSpare) {
      score += 10;
      console.log('Spare detected, added 10');
      
      if (!nextFrame?.firstShot) return null;
      score += nextFrame.firstShot.length;
      console.log(`Spare bonus: ${nextFrame.firstShot.length}`);
    } else {
      if (!frame.secondShot) return null;
      score += frame.firstShot.length + frame.secondShot.length;
      console.log(`Open frame: ${frame.firstShot.length} + ${frame.secondShot.length}`);
    }

    console.log(`Running total after frame ${i + 1}: ${score}`);
  }
  
  return score;
};