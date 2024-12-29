import { Frame, Pin } from "@/types/game";
import { getRemainingPins } from "./frame-validation";

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
  knockedDownPins: Pin[]
): Frame => {
  const frame = { ...frames[frameIndex] };
  const allPins: Pin[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  
  if (frameIndex === 9) { // 10th frame
    if (shot === 1) {
      // For first shot, record the pins that remained standing
      frame.firstShot = allPins.filter(pin => !knockedDownPins.includes(pin));
      // If all pins are knocked down, it's a strike
      if (knockedDownPins.length === 10) {
        frame.isStrike = true;
        frame.secondShot = null;
      }
    } else if (shot === 2) {
      // For second shot, record the pins that remained standing from those available
      const availablePins = frame.firstShot || allPins;
      frame.secondShot = availablePins.filter(pin => !knockedDownPins.includes(pin));
      if (!frame.isStrike) {
        frame.isSpare = frame.firstShot!.length + knockedDownPins.length === 10;
      }
    } else if (shot === 3) {
      frame.thirdShot = knockedDownPins;
    }
  } else {
    if (shot === 1) {
      // For first shot, record the pins that remained standing
      frame.firstShot = allPins.filter(pin => !knockedDownPins.includes(pin));
      // If all pins are knocked down on first shot, it's a strike
      if (knockedDownPins.length === 10) {
        frame.isStrike = true;
        frame.secondShot = null;
        // No need to handle second shot for strikes
        return frame;
      }
    } else {
      // For second shot, record the pins that remained standing from those available
      frame.secondShot = frame.firstShot!.filter(pin => !knockedDownPins.includes(pin));
      frame.isSpare = frame.firstShot!.length === knockedDownPins.length;
    }
  }

  return frame;
};