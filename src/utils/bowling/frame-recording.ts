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
  console.log(`Recording regular shot for frame ${frameIndex + 1}, shot ${shot}`);
  
  const frame = { ...frames[frameIndex] };
  const allPins = getAllPins();
  
  console.log('Selected pins:', selectedPins);
  
  if (frameIndex === 9) { // 10th frame
    if (shot === 1) {
      frame.firstShot = selectedPins;
      frame.isStrike = selectedPins.length === 10;
      if (!frame.isStrike && selectedPins.length > 0) {
        const remainingPins = allPins.filter(pin => !selectedPins.includes(pin));
        frame.isSplit = isSplit({ firstShot: selectedPins, secondShot: remainingPins });
      }
    } else if (shot === 2) {
      // For second shot after strike, use regular pin selection
      frame.secondShot = frame.isStrike 
        ? selectedPins  // After strike, use selected pins directly
        : selectedPins;  // After non-strike, use selected pins
      // Check for spare only if not following a strike
      if (!frame.isStrike) {
        const remainingPins = allPins.filter(pin => !frame.firstShot?.includes(pin));
        frame.isSpare = selectedPins.length === remainingPins.length;
      }
    } else if (shot === 3) {
      frame.thirdShot = selectedPins;
    }
  } else {
    if (shot === 1) {
      frame.firstShot = selectedPins;
      frame.isStrike = selectedPins.length === 10;
      if (!frame.isStrike) {
        const remainingPins = allPins.filter(pin => !selectedPins.includes(pin));
        frame.isSplit = isSplit({ firstShot: selectedPins, secondShot: remainingPins });
      }
    } else {
      frame.secondShot = selectedPins;
      const remainingPins = allPins.filter(pin => !frame.firstShot?.includes(pin));
      frame.isSpare = selectedPins.length === remainingPins.length && !frame.isStrike;
    }
  }

  console.log('Updated frame:', frame);
  return frame;
};