import { Frame } from "@/types/game";

export const calculateFrameScore = (frames: Frame[], frameIndex: number): number => {
  let score = 0;
  
  // Calculate running total of all frames up to this one
  for (let i = 0; i <= frameIndex; i++) {
    const frame = frames[i];
    const nextFrame = i < 9 ? frames[i + 1] : null;
    const followingFrame = i < 8 ? frames[i + 2] : null;

    console.log(`\nCalculating frame ${i + 1}:`);
    
    // Base score for the current frame
    if (frame.firstShot === null) return 0;

    // For the current frame being calculated
    if (i === frameIndex) {
      // If it's a strike, we need two more shots to display the score
      if (frame.isStrike && i < 9) {
        if (!nextFrame?.firstShot || (nextFrame.isStrike && !followingFrame?.firstShot)) {
          return null; // Don't display score yet
        }
      }
      // If it's a spare, we need one more shot to display the score
      else if (frame.isSpare && i < 9) {
        if (!nextFrame?.firstShot) {
          return null; // Don't display score yet
        }
      }
      // For open frames, we need both shots
      else if (!frame.secondShot && !frame.isStrike) {
        return null; // Don't display score yet
      }
    }

    if (frame.isStrike) {
      score += 10;
      console.log('Strike detected, added 10');
      
      // Calculate strike bonus
      if (i === 9) {
        // 10th frame
        if (frame.secondShot) {
          score += frame.secondShot.length;
          console.log(`10th frame second shot: ${frame.secondShot.length}`);
          if (frame.thirdShot) {
            score += frame.thirdShot.length;
            console.log(`10th frame third shot: ${frame.thirdShot.length}`);
          }
        }
      } else {
        // Regular frames (1-9)
        if (nextFrame?.firstShot) {
          if (nextFrame.isStrike) {
            score += 10;
            console.log('First bonus: strike (10)');
            
            // Second bonus ball
            if (i === 8) {
              // 9th frame looking at 10th frame second shot
              if (nextFrame.secondShot) {
                score += nextFrame.secondShot.length;
                console.log(`Second bonus from 10th frame second shot: ${nextFrame.secondShot.length}`);
              }
            } else if (followingFrame?.firstShot) {
              score += followingFrame.isStrike ? 10 : followingFrame.firstShot.length;
              console.log(`Second bonus: ${followingFrame.isStrike ? 'strike (10)' : followingFrame.firstShot.length}`);
            }
          } else {
            // Next frame is not a strike
            score += nextFrame.firstShot.length;
            console.log(`First bonus: ${nextFrame.firstShot.length}`);
            if (nextFrame.secondShot) {
              score += nextFrame.secondShot.length;
              console.log(`Second bonus: ${nextFrame.secondShot.length}`);
            }
          }
        }
      }
    } else if (frame.isSpare) {
      score += 10;
      console.log('Spare detected, added 10');
      
      if (i === 9) {
        if (frame.thirdShot) {
          score += frame.thirdShot.length;
          console.log(`10th frame spare bonus: ${frame.thirdShot.length}`);
        }
      } else if (nextFrame?.firstShot) {
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