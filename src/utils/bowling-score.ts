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

    if (frame.isStrike) {
      // Base score for strike
      score += 10;
      console.log('Strike detected, base score:', score);

      if (i === 9) {
        // 10th frame special handling
        if (frame.secondShot) {
          score += frame.secondShot.length;
          console.log('10th frame second shot added:', frame.secondShot.length);
          if (frame.thirdShot) {
            score += frame.thirdShot.length;
            console.log('10th frame third shot added:', frame.thirdShot.length);
          }
        }
      } else if (nextFrame) {
        // Add bonus for first ball after strike
        if (nextFrame.firstShot) {
          if (nextFrame.isStrike) {
            score += 10;
            console.log('Next frame is strike, added 10');
            
            // Need second ball after strike
            if (i === 8) {
              // 9th frame looking at 10th frame second shot
              if (nextFrame.secondShot) {
                score += nextFrame.secondShot.length;
                console.log('Added 10th frame second shot:', nextFrame.secondShot.length);
              }
            } else if (followingFrame?.firstShot) {
              score += followingFrame.firstShot.length;
              console.log('Added following frame first shot:', followingFrame.firstShot.length);
            }
          } else {
            score += nextFrame.firstShot.length;
            console.log('Added next frame first shot:', nextFrame.firstShot.length);
            if (nextFrame.secondShot) {
              score += nextFrame.secondShot.length;
              console.log('Added next frame second shot:', nextFrame.secondShot.length);
            }
          }
        }
      }
    } else if (frame.isSpare) {
      // Base score for spare
      score += 10;
      console.log('Spare detected, base score:', score);
      
      if (i === 9) {
        // 10th frame
        if (frame.thirdShot) {
          score += frame.thirdShot.length;
          console.log('10th frame third shot added:', frame.thirdShot.length);
        }
      } else if (nextFrame?.firstShot) {
        score += nextFrame.firstShot.length;
        console.log('Added next frame first shot:', nextFrame.firstShot.length);
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