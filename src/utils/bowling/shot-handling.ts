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
  remainingPins: Pin[]
): Frame => {
  const frame = { ...frames[frameIndex] };
  
  if (frameIndex === 9) { // 10th frame
    if (shot === 1) {
      frame.firstShot = remainingPins;
      frame.isStrike = remainingPins.length === 10;
    } else if (shot === 2) {
      frame.secondShot = remainingPins;
      if (!frame.isStrike && frame.firstShot) {
        frame.isSpare = frame.firstShot.length + remainingPins.length === 10;
      }
    } else if (shot === 3) {
      frame.thirdShot = remainingPins;
    }
  } else {
    if (shot === 1) {
      frame.firstShot = remainingPins;
      // Remove the incorrect strike marking for first shot
      frame.isStrike = false;
    } else {
      frame.secondShot = remainingPins;
      if (frame.firstShot) {
        frame.isSpare = frame.firstShot.length + remainingPins.length === 10;
      }
    }
  }

  return frame;
};