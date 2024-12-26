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
      secondShot: frame.secondShot?.length,
      thirdShot: frame.thirdShot?.length
    });
    
    if (frame.isStrike) {
      score += 10;
      console.log('Strike detected, base score:', score);
      
      if (i === 9) {
        // 10th frame special case
        if (frame.secondShot) {
          score += frame.secondShot.length;
          if (frame.thirdShot) {
            score += frame.thirdShot.length;
          }
          console.log(`10th frame complete, score: ${score}`);
        }
      } else if (nextFrame) {
        // Regular frames (1-9)
        if (nextFrame.isStrike) {
          score += 10;
          if (i === 8) {
            // 9th frame needs second shot of 10th frame
            if (nextFrame.secondShot) {
              score += nextFrame.secondShot.length;
            }
          } else if (followingFrame?.firstShot) {
            score += followingFrame.firstShot.length;
          }
        } else if (nextFrame.firstShot && nextFrame.secondShot) {
          score += nextFrame.firstShot.length + nextFrame.secondShot.length;
        }
      }
    } else if (frame.isSpare) {
      score += 10;
      console.log('Spare detected, base score:', score);
      if (i === 9) {
        // 10th frame
        if (frame.thirdShot) {
          score += frame.thirdShot.length;
        }
      } else if (nextFrame?.firstShot) {
        score += nextFrame.firstShot.length;
      }
    } else {
      // Open frame
      if (frame.firstShot && frame.secondShot) {
        score += frame.firstShot.length + frame.secondShot.length;
        console.log(`Open frame, added shots (${frame.firstShot.length} + ${frame.secondShot.length}). Score:`, score);
      }
    }
  }
  
  console.log(`Final score for frame ${frameIndex + 1}:`, score);
  return score;
};