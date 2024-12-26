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
  
  if (currentShot === 1 || frame.isStrike) return allPins;
  
  if (currentShot === 2) {
    return allPins.filter(pin => !frame.firstShot?.includes(pin));
  }
  
  if (currentShot === 3) {
    // If previous shot was a strike, all pins are available
    if (frame.secondShot?.length === 10) return allPins;
    return allPins.filter(pin => !frame.secondShot?.includes(pin));
  }
  
  return [];
};