import { Frame, Pin } from "@/types/game";
import { recordStrike, recordSpare, recordRegularShot } from "./frame-recording";

export { recordStrike, recordSpare, recordRegularShot };

export const getRemainingPins = (frame: Frame, shot: 1 | 2 | 3): Pin[] => {
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