import { Frame, Pin } from "@/types/game";
import { getRemainingPins } from "./frame-validation";

export const recordStrike = (
  frames: Frame[],
  frameIndex: number,
  shot: 1 | 2 | 3
): Frame => {
  const frame = { ...frames[frameIndex] };

  if (frameIndex === 9) { // 10th frame
    if (shot === 1) {
      frame.firstShot = [];
      frame.isStrike = true;
    } else if (shot === 2) {
      frame.secondShot = [];
    } else if (shot === 3) {
      frame.thirdShot = [];
    }
  } else {
    frame.firstShot = [];
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
      frame.secondShot = [];
      frame.isSpare = true;
    } else if (shot === 3) {
      frame.thirdShot = [];
    }
  } else {
    frame.secondShot = [];
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
  // If no pins are remaining on first shot (except in 10th frame),
  // treat it as a strike
  if (shot === 1 && frameIndex !== 9 && remainingPins.length === 0) {
    return recordStrike(frames, frameIndex, shot);
  }

  const frame = { ...frames[frameIndex] };
  const allPins: Pin[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  
  if (frameIndex === 9) { // 10th frame
    if (shot === 1) {
      frame.firstShot = remainingPins;
      if (remainingPins.length === 0) {
        frame.isStrike = true;
      }
    } else if (shot === 2) {
      frame.secondShot = remainingPins;
      if (!frame.isStrike) {
        frame.isSpare = frame.firstShot!.length === remainingPins.length;
      }
    } else if (shot === 3) {
      frame.thirdShot = remainingPins;
    }
  } else {
    if (shot === 1) {
      // For first shot, store the remaining pins (selected pins)
      frame.firstShot = remainingPins;
    } else {
      // For second shot, store the remaining pins
      frame.secondShot = remainingPins;
      // It's a spare if no pins remain after second shot
      frame.isSpare = remainingPins.length === 0;
    }
  }

  return frame;
};