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
  const remainingPins = getRemainingPins(frame, shot);

  if (frameIndex === 9) { // 10th frame
    if (shot === 2) {
      frame.secondShot = remainingPins;
      frame.isSpare = true;
    } else if (shot === 3) {
      frame.thirdShot = remainingPins;
    }
  } else {
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
  
  // Convert selected pins (standing) to knocked down pins
  const knockedDownPins = allPins.filter(pin => !selectedPins.includes(pin));
  console.log('Knocked down pins:', knockedDownPins);
  
  if (frameIndex === 9) { // 10th frame
    if (shot === 1) {
      frame.firstShot = knockedDownPins;
      frame.isStrike = knockedDownPins.length === 10;
      frame.isSplit = !frame.isStrike && knockedDownPins.length > 1 && isSplit(knockedDownPins);
    } else if (shot === 2) {
      // For second shot, we only consider the remaining pins
      const remainingPins = allPins.filter(pin => !frame.firstShot?.includes(pin));
      // If no pins are selected (all remaining pins knocked down), it's a spare
      if (selectedPins.length === 0) {
        frame.secondShot = remainingPins;
        frame.isSpare = true;
      } else {
        frame.secondShot = remainingPins.filter(pin => selectedPins.includes(pin));
        frame.isSpare = false;
      }
      
      // If not a strike or spare in 10th frame, complete the frame after second shot
      if (!frame.isStrike && !frame.isSpare) {
        frame.thirdShot = null; // Explicitly set third shot to null to indicate frame completion
      }
    } else if (shot === 3) {
      frame.thirdShot = knockedDownPins;
    }
  } else {
    if (shot === 1) {
      frame.firstShot = knockedDownPins;
      frame.isStrike = knockedDownPins.length === 10;
      frame.isSplit = !frame.isStrike && knockedDownPins.length > 1 && isSplit(knockedDownPins);
    } else {
      // For second shot, we only consider the remaining pins
      const remainingPins = allPins.filter(pin => !frame.firstShot?.includes(pin));
      // If no pins are selected (all remaining pins knocked down), it's a spare
      if (selectedPins.length === 0) {
        frame.secondShot = remainingPins;
        frame.isSpare = true;
      } else {
        frame.secondShot = remainingPins.filter(pin => selectedPins.includes(pin));
        frame.isSpare = false;
      }
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