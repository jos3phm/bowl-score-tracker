import { Frame, Pin } from "@/types/game";
import { isSplit } from "./split-detection";
import { getAllPins, getKnockedDownPins } from "./pin-calculations";

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
      frame.thirdShot = allPins;
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
      const knockedDownPins = getKnockedDownPins(selectedPins, 1);
      frame.firstShot = knockedDownPins;
      frame.isStrike = knockedDownPins.length === 10;
      if (!frame.isStrike && knockedDownPins.length > 1) {
        frame.isSplit = isSplit({ firstShot: [], secondShot: knockedDownPins });
      }
    } else if (shot === 2) {
      if (frame.isStrike) {
        // After a strike in 10th frame, selected pins are the ones that remain standing
        const knockedDownPins = allPins.filter(pin => !selectedPins.includes(pin));
        frame.secondShot = knockedDownPins;
        frame.isSpare = false;
        console.log('10th frame second shot after strike, knocked down:', knockedDownPins.length);
      } else {
        // Regular second shot logic
        const knockedDownPins = getKnockedDownPins(selectedPins, 2);
        frame.secondShot = knockedDownPins;
        const remainingPins = allPins.filter(pin => !frame.firstShot?.includes(pin));
        frame.isSpare = knockedDownPins.length === remainingPins.length;
      }
    } else if (shot === 3) {
      if (frame.isStrike || frame.isSpare) {
        // For the third shot, selected pins are the ones knocked down
        const knockedDownPins = getKnockedDownPins(selectedPins, 3);
        frame.thirdShot = knockedDownPins;
      }
    }
  } else {
    if (shot === 1) {
      const knockedDownPins = getKnockedDownPins(selectedPins, 1);
      frame.firstShot = knockedDownPins;
      frame.isStrike = knockedDownPins.length === 10;
      if (!frame.isStrike && knockedDownPins.length > 1) {
        frame.isSplit = isSplit({ firstShot: [], secondShot: knockedDownPins });
      }
    } else {
      const knockedDownPins = getKnockedDownPins(selectedPins, 2);
      frame.secondShot = knockedDownPins;
      const remainingPins = allPins.filter(pin => !frame.firstShot?.includes(pin));
      frame.isSpare = knockedDownPins.length === remainingPins.length && !frame.isStrike;
    }
  }

  console.log('Updated frame:', frame);
  return frame;
};