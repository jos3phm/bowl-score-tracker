import { Frame, Pin } from "@/types/game";
import { isSplit } from "./split-detection";
import { getAllPins } from "./pin-calculations";

export const recordStrike = (
  frames: Frame[],
  frameIndex: number,
  shot: 1 | 2 | 3
): Frame => {
  const frame = { ...frames[frameIndex] };
  const allPins = getAllPins();

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
  const allPins = getAllPins();
  
  if (frameIndex === 9) { // 10th frame
    if (shot === 2) {
      const remainingPins = allPins.filter(pin => !frame.firstShot?.includes(pin));
      frame.secondShot = remainingPins;
      frame.isSpare = true;
    } else if (shot === 3) {
      // For third shot, only allow spare if previous shot wasn't a strike
      if (frame.secondShot && frame.secondShot.length < 10) {
        const remainingPins = allPins.filter(pin => !frame.secondShot?.includes(pin));
        frame.thirdShot = remainingPins;
      }
    }
  } else {
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
  const frame = { ...frames[frameIndex] };
  const allPins = getAllPins();
  
  if (frameIndex === 9) { // 10th frame
    if (shot === 1) {
      // For first shot, pins knocked down are the inverse of selected pins
      frame.firstShot = selectedPins.length === 0 ? [] : 
        allPins.filter(pin => !selectedPins.includes(pin));
      frame.isStrike = frame.firstShot.length === 10;
      if (!frame.isStrike && frame.firstShot.length > 0) {
        frame.isSplit = isSplit({ 
          firstShot: selectedPins,
          secondShot: frame.firstShot
        });
      }
    } else if (shot === 2) {
      // For second shot after strike, use regular pin selection
      if (frame.isStrike) {
        frame.secondShot = selectedPins.length === 0 ? [] : 
          allPins.filter(pin => !selectedPins.includes(pin));
      } else {
        frame.secondShot = selectedPins;
        // Check for spare only if not following a strike
        const remainingPins = allPins.filter(pin => !frame.firstShot?.includes(pin));
        frame.isSpare = selectedPins.length === remainingPins.length;
      }
    } else if (shot === 3) {
      // For third shot
      if (frame.secondShot?.length === 10) {
        // After a strike in second shot
        frame.thirdShot = selectedPins.length === 0 ? [] : 
          allPins.filter(pin => !selectedPins.includes(pin));
      } else {
        // After a non-strike in second shot
        frame.thirdShot = selectedPins;
      }
    }
  } else {
    if (shot === 1) {
      frame.firstShot = selectedPins.length === 0 ? [] : selectedPins;
      frame.isStrike = false;
      if (frame.firstShot.length > 0) {
        const remainingPins = allPins.filter(pin => !frame.firstShot?.includes(pin));
        frame.isSplit = isSplit({ 
          firstShot: frame.firstShot,
          secondShot: remainingPins
        });
      }
    } else {
      frame.secondShot = selectedPins;
      const remainingPins = allPins.filter(pin => !frame.firstShot?.includes(pin));
      frame.isSpare = selectedPins.length === remainingPins.length && !frame.isStrike;
    }
  }

  return frame;
};