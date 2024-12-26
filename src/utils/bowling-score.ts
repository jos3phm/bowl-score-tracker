import { Frame } from "@/types/game";

export const calculateFrameScore = (frames: Frame[], frameIndex: number): number => {
  let score = 0;
  
  // Calculate running total of all frames up to this one
  for (let i = 0; i <= frameIndex; i++) {
    const frame = frames[i];
    const nextFrame = i < 9 ? frames[i + 1] : null;
    const followingFrame = i < 8 ? frames[i + 2] : null;

    console.log(`\nCalculating frame ${i + 1}:`);
    console.log('Current frame:', {
      isStrike: frame.isStrike,
      isSpare: frame.isSpare,
      firstShot: frame.firstShot?.length,
      secondShot: frame.secondShot?.length,
      thirdShot: frame.thirdShot?.length
    });

    // Base score for the frame
    if (frame.firstShot) {
      score += frame.firstShot.length;
      console.log(`Added first shot: ${frame.firstShot.length}`);
    }
    
    if (frame.secondShot) {
      score += frame.secondShot.length;
      console.log(`Added second shot: ${frame.secondShot.length}`);
    }

    if (i === 9 && frame.thirdShot) {
      score += frame.thirdShot.length;
      console.log(`Added third shot: ${frame.thirdShot.length}`);
    }

    // Calculate strike bonus
    if (frame.isStrike) {
      console.log('Strike detected, calculating bonus');
      
      if (i === 9) {
        // 10th frame strikes are already counted in base score
        console.log('10th frame strike, bonus already counted');
      } else if (nextFrame) {
        // First bonus ball
        if (nextFrame.firstShot) {
          score += nextFrame.firstShot.length;
          console.log(`Strike bonus 1: ${nextFrame.firstShot.length}`);
          
          // Second bonus ball
          if (nextFrame.isStrike) {
            if (i === 8) {
              // For 9th frame, use 10th frame's second shot
              if (nextFrame.secondShot) {
                score += nextFrame.secondShot.length;
                console.log(`Strike bonus 2 (10th frame second shot): ${nextFrame.secondShot.length}`);
              }
            } else if (followingFrame?.firstShot) {
              score += followingFrame.firstShot.length;
              console.log(`Strike bonus 2 (following frame): ${followingFrame.firstShot.length}`);
            }
          } else if (nextFrame.secondShot) {
            score += nextFrame.secondShot.length;
            console.log(`Strike bonus 2 (next frame second): ${nextFrame.secondShot.length}`);
          }
        }
      }
    }
    // Calculate spare bonus
    else if (frame.isSpare) {
      console.log('Spare detected, calculating bonus');
      
      if (i === 9) {
        // 10th frame spares are already counted in base score
        console.log('10th frame spare, bonus already counted');
      } else if (nextFrame?.firstShot) {
        score += nextFrame.firstShot.length;
        console.log(`Spare bonus: ${nextFrame.firstShot.length}`);
      }
    }

    console.log(`Running total after frame ${i + 1}: ${score}`);
  }
  
  return score;
};