import { Frame, Pin } from "@/types/game";

export const canMakeSpare = (frame: Frame, currentShot: 1 | 2 | 3): boolean => {
  if (currentShot !== 2 && currentShot !== 3) return false;
  
  // For 10th frame third shot
  if (currentShot === 3) {
    return frame.secondShot !== null && 
           frame.secondShot.length < 10;
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
  
  // Special handling for 10th frame
  if (frame.isStrike && currentShot === 2) {
    return allPins; // All pins for second shot after strike
  }
  
  if (frame.isStrike && currentShot === 3) {
    // If second shot was also a strike, show all pins
    if (frame.secondShot?.length === 10) {
      return allPins;
    }
    // Otherwise only show remaining pins from second shot
    return frame.secondShot ? allPins.filter(pin => !frame.secondShot?.includes(pin)) : [];
  }
  
  // For regular second shots or spare attempts
  if (currentShot === 2) {
    return allPins.filter(pin => !frame.firstShot?.includes(pin));
  }
  
  // For third shot in 10th frame after a spare
  if (currentShot === 3 && frame.isSpare) {
    return allPins;
  }
  
  return [];
};
