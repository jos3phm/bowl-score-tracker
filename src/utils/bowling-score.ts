import { Frame, Pin } from "@/types/game";

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
      const firstShotScore = frame.firstShot.length === 10 ? 10 : frame.firstShot.reduce((sum, pin) => sum + Number(pin), 0);
      console.log(`10th frame first shot: ${firstShotScore}`);
      score += firstShotScore;
      
      // Need second shot for all cases
      if (frame.secondShot === null) {
        console.log('Waiting for second shot');
        return null;
      }
      
      const secondShotScore = frame.secondShot.length === 10 ? 10 : frame.secondShot.reduce((sum, pin) => sum + Number(pin), 0);
      score += secondShotScore;
      console.log(`10th frame second shot: ${secondShotScore}`);
      
      // Need third shot only after strike or spare
      if (frame.isStrike || frame.isSpare) {
        if (frame.thirdShot === null) {
          console.log('Waiting for third shot after strike/spare');
          return null;
        }
        const thirdShotScore = frame.thirdShot.length === 10 ? 10 : frame.thirdShot.reduce((sum, pin) => sum + Number(pin), 0);
        score += thirdShotScore;
        console.log(`10th frame third shot: ${thirdShotScore}`);
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
          const followingFrameScore = followingFrame.isStrike ? 10 : followingFrame.firstShot.reduce((sum, pin) => sum + Number(pin), 0);
          score += followingFrameScore;
          console.log(`Second bonus: ${followingFrame.isStrike ? 'strike (10)' : followingFrameScore}`);
        } else {
          if (!nextFrame.secondShot) return null;
          const nextFrameSecondShot = nextFrame.secondShot.length === 10 ? 10 : nextFrame.secondShot.reduce((sum, pin) => sum + Number(pin), 0);
          score += nextFrameSecondShot;
          console.log(`Second bonus: ${nextFrameSecondShot}`);
        }
      } else {
        if (!nextFrame.secondShot) return null;
        const nextFrameScore = nextFrame.firstShot.reduce((sum, pin) => sum + Number(pin), 0) + 
                             nextFrame.secondShot.reduce((sum, pin) => sum + Number(pin), 0);
        score += nextFrameScore;
        console.log(`Strike bonus: ${nextFrameScore}`);
      }
    } else if (frame.isSpare) {
      score += 10;
      console.log('Spare detected, added 10');
      
      if (!nextFrame?.firstShot) return null;
      const nextFrameFirstShot = nextFrame.firstShot.length === 10 ? 10 : nextFrame.firstShot.reduce((sum, pin) => sum + Number(pin), 0);
      score += nextFrameFirstShot;
      console.log(`Spare bonus: ${nextFrameFirstShot}`);
    } else {
      if (!frame.secondShot) return null;
      const frameScore = frame.firstShot.reduce((sum, pin) => sum + Number(pin), 0) + 
                        frame.secondShot.reduce((sum, pin) => sum + Number(pin), 0);
      score += frameScore;
      console.log(`Open frame: ${frame.firstShot.reduce((sum, pin) => sum + Number(pin), 0)} + ${frame.secondShot.reduce((sum, pin) => sum + Number(pin), 0)}`);
    }

    console.log(`Running total after frame ${i + 1}: ${score}`);
  }
  
  return score;
};