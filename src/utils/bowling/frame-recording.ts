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
  const knockedDownPins = getKnockedDownPins(selectedPins, shot);
  
  console.log('Selected pins:', selectedPins);
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
      if (frame.isStrike) {
        // After a strike, this should be the actual number of pins knocked down
        frame.isSpare = false;
      } else {
        // Regular second shot logic
        const remainingPins = allPins.filter(pin => !frame.firstShot?.includes(pin));
        frame.isSpare = knockedDownPins.length === remainingPins.length;
      }
    } else if (shot === 3) {
      frame.thirdShot = knockedDownPins;
    }
  } else {
    if (shot === 1) {
      frame.firstShot = knockedDownPins;
      frame.isStrike = knockedDownPins.length === 10;
      if (!frame.isStrike && knockedDownPins.length > 1) {
        frame.isSplit = isSplit({ firstShot: [], secondShot: knockedDownPins });
      }
    } else {
      frame.secondShot = knockedDownPins;
      const remainingPins = allPins.filter(pin => !frame.firstShot?.includes(pin));
      frame.isSpare = knockedDownPins.length === remainingPins.length && !frame.isStrike;
    }
  }

  console.log('Updated frame:', frame);
  return frame;
};