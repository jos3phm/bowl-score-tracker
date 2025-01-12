import { Frame, Pin } from "@/types/game";
import { isSplit } from "./split-detection";

export const recordStrike = (
  frames: Frame[],
  frameIndex: number,
  shot: 1 | 2 | 3
): Frame => {
  const frame = { ...frames[frameIndex] };
  const allPins: Pin[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  if (frameIndex === 9) { // 10th frame
    if (shot === 1) {
      frame.firstShot = allPins;
      frame.isStrike = true;
    } else if (shot === 2) {
      frame.secondShot = allPins;
    } else if (shot === 3) {
      frame.thirdShot = allPins;
    }
  } else {
    frame.firstShot = allPins;
    frame.secondShot = null;
    frame.isStrike = true;
  }

  return frame;
};

export const recordSpare = (
  frames: Frame[],
  frameIndex: number,
  shot: 1 | 2 | 3
): Frame => {
  const frame = { ...frames[frameIndex] };
  const allPins: Pin[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  
  // For a spare, we need to knock down all remaining pins
  if (frameIndex === 9) { // 10th frame
    if (shot === 2) {
      // Get remaining pins after first shot
      const remainingPins = allPins.filter(pin => !frame.firstShot?.includes(pin));
      frame.secondShot = remainingPins;
      frame.isSpare = true;
    } else if (shot === 3) {
      frame.thirdShot = allPins;
    }
  } else {
    // For regular frames, second shot should knock down all remaining pins
    const remainingPins = allPins.filter(pin => !frame.firstShot?.includes(pin));
    frame.secondShot = remainingPins;
    frame.isSpare = true;
  }

  return frame;
};

export const recordRegularShot = (
  frames: Frame[],
  frameIndex: number,
  shot: 1 | 2 | 3,
  selectedPins: Pin[]
): Frame => {
  console.log(`Recording regular shot for frame ${frameIndex + 1}, shot ${shot}`);
  
  const frame = { ...frames[frameIndex] };
  const allPins: Pin[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  
  // For first shot, if no pins are knocked down (miss), record empty array
  // For second shot, selected pins are knocked down
  const knockedDownPins = selectedPins;
  
  console.log('Knocked down pins:', knockedDownPins);
  
  if (frameIndex === 9) { // 10th frame
    if (shot === 1) {
      frame.firstShot = knockedDownPins;
      frame.isStrike = knockedDownPins.length === 10;
      if (!frame.isStrike && knockedDownPins.length > 1) {
        frame.isSplit = isSplit({ firstShot: [], secondShot: knockedDownPins });
      }
    } else if (shot === 2) {
      frame.secondShot = knockedDownPins;
      // For second shot, we need to check if all remaining pins were knocked down
      const remainingPins = allPins.filter(pin => !frame.firstShot?.includes(pin));
      frame.isSpare = knockedDownPins.length === remainingPins.length && !frame.isStrike;
    } else if (shot === 3) {
      frame.thirdShot = knockedDownPins;
    }
  } else {
    if (shot === 1) {
      frame.firstShot = knockedDownPins;
      // Only mark as strike if explicitly using all pins
      frame.isStrike = knockedDownPins.length === 10 && knockedDownPins.every(pin => allPins.includes(pin));
      if (!frame.isStrike && knockedDownPins.length > 1) {
        frame.isSplit = isSplit({ firstShot: [], secondShot: knockedDownPins });
      }
    } else {
      frame.secondShot = knockedDownPins;
      // For second shot, we need to check if all remaining pins were knocked down
      const remainingPins = allPins.filter(pin => !frame.firstShot?.includes(pin));
      frame.isSpare = knockedDownPins.length === remainingPins.length && !frame.isStrike;
    }
  }

  return frame;
};

const getRemainingPins = (frame: Frame, shot: 1 | 2 | 3): Pin[] => {
  const allPins: Pin[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  
  if (shot === 1 || frame.isStrike) return allPins;
  
  if (shot === 2) {
    return allPins.filter(pin => !frame.firstShot?.includes(pin));
  }
  
  if (shot === 3) {
    if (frame.secondShot?.length === 10) return allPins;
    return allPins.filter(pin => !frame.secondShot?.includes(pin));
  }
  
  return [];
};