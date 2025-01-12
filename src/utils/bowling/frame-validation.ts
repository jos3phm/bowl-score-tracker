import { Frame, Pin } from "@/types/game";

export const canMakeSpare = (frame: Frame, currentShot: 1 | 2 | 3): boolean => {
  if (currentShot !== 2 && currentShot !== 3) return false;
  
  // For 10th frame third shot
  if (currentShot === 3) {
    return frame.secondShot !== null && 
           frame.secondShot.length < 10 &&
           (frame.isStrike || frame.isSpare);
  }
  
  // Regular frame or 10th frame second shot
  return frame.firstShot !== null && 
         frame.firstShot.length < 10;
};

export const isGameComplete = (frames: Frame[]): boolean => {
  const tenthFrame = frames[9];
  if (!tenthFrame.firstShot) return false;
  
  if (tenthFrame.isStrike) {
    return tenthFrame.secondShot !== null && tenthFrame.thirdShot !== null;
  } else if (tenthFrame.isSpare) {
    return tenthFrame.thirdShot !== null;
  } else {
    return tenthFrame.secondShot !== null;
  }
};

export const getRemainingPins = (frame: Frame, currentShot: 1 | 2 | 3): Pin[] => {
  const allPins: Pin[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  
  // First shot always has all pins
  if (currentShot === 1) return allPins;
  
  // For second shot in 10th frame after a strike
  if (currentShot === 2 && frame.isStrike) {
    return allPins;
  }
  
  // For second shot (regular frames or 10th frame without strike)
  if (currentShot === 2) {
    return allPins.filter(pin => !frame.firstShot?.includes(pin));
  }
  
  // For third shot in 10th frame
  if (currentShot === 3) {
    // After a strike + strike
    if (frame.secondShot?.length === 10) {
      return allPins;
    }
    
    // After a strike + partial hit
    if (frame.isStrike && frame.secondShot) {
      return allPins.filter(pin => !frame.secondShot?.includes(pin));
    }
    
    // After a spare
    if (frame.isSpare) {
      return allPins;
    }
    
    return allPins.filter(pin => !frame.secondShot?.includes(pin));
  }
  
  return [];
};