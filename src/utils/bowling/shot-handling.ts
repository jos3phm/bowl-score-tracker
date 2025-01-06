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
  console.log('Selected pins (standing):', selectedPins);
  
  const frame = { ...frames[frameIndex] };
  const allPins: Pin[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  
  // For a miss (empty selectedPins array), we record no pins knocked down
  const knockedDownPins = selectedPins.length === 0 ? [] : allPins.filter(pin => !selectedPins.includes(pin));
  console.log('Knocked down pins:', knockedDownPins);
  
  if (frameIndex === 9) { // 10th frame
    if (shot === 1) {
      frame.firstShot = knockedDownPins;
      frame.isStrike = knockedDownPins.length === 10;
      frame.isSplit = !frame.isStrike && knockedDownPins.length > 1 && isSplit(knockedDownPins);
    } else if (shot === 2) {
      frame.secondShot = knockedDownPins;
      // Check if this completes a spare
      const totalPinsDown = (frame.firstShot?.length || 0) + knockedDownPins.length;
      frame.isSpare = !frame.isStrike && totalPinsDown === 10;
    } else if (shot === 3) {
      frame.thirdShot = knockedDownPins;
    }
  } else {
    if (shot === 1) {
      frame.firstShot = knockedDownPins;
      frame.isStrike = knockedDownPins.length === 10;
      frame.isSplit = !frame.isStrike && knockedDownPins.length > 1 && isSplit(knockedDownPins);
    } else {
      frame.secondShot = knockedDownPins;
      // Check if this completes a spare
      const totalPinsDown = (frame.firstShot?.length || 0) + knockedDownPins.length;
      frame.isSpare = !frame.isStrike && totalPinsDown === 10;
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