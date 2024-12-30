import { Frame, Pin } from "@/types/game";

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
  console.log('Selected pins:', selectedPins);
  
  const frame = { ...frames[frameIndex] };
  
  if (frameIndex === 9) { // 10th frame
    if (shot === 1) {
      frame.firstShot = selectedPins;
      frame.isStrike = selectedPins.length === 10;
    } else if (shot === 2) {
      frame.secondShot = selectedPins;
      if (!frame.isStrike && frame.firstShot) {
        frame.isSpare = frame.firstShot.length + selectedPins.length === 10;
      }
    } else if (shot === 3) {
      frame.thirdShot = selectedPins;
    }
  } else {
    if (shot === 1) {
      frame.firstShot = selectedPins;
      frame.isStrike = selectedPins.length === 10;
    } else {
      frame.secondShot = selectedPins;
      if (frame.firstShot) {
        frame.isSpare = frame.firstShot.length + selectedPins.length === 10;
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
    // If previous shot was a strike, all pins are available
    if (frame.secondShot?.length === 10) return allPins;
    return allPins.filter(pin => !frame.secondShot?.includes(pin));
  }
  
  return [];
};