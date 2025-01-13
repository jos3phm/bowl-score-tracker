import { Pin } from "@/types/game";

// Define pin neighbors for each pin
const pinNeighbors: Record<Pin, Pin[]> = {
  1: [2, 3],
  2: [1, 3, 4, 5],
  3: [1, 2, 5, 6],
  4: [2, 5, 7, 8],
  5: [2, 3, 4, 6, 8, 9],
  6: [3, 5, 9, 10],
  7: [4, 8],
  8: [4, 5, 7, 9],
  9: [5, 6, 8, 10],
  10: [6, 9]
};

interface SplitParams {
  firstShot: Pin[];
  secondShot: Pin[];
}

// Define common split patterns
const commonSplits: Pin[][] = [
  [3, 10],    // 3-10 split
  [2, 7],     // 2-7 split
  [4, 6],     // 4-6 split (baby split)
  [4, 7],     // 4-7 split
  [4, 10],    // 4-10 split
  [6, 7],     // 6-7 split
  [7, 10],    // 7-10 split (bedposts)
  [8, 10],    // 8-10 split
  [4, 9],     // 4-9 split
  [3, 7],     // 3-7 split
  [2, 10],    // 2-10 split
  [5, 7],     // 5-7 split
  [3, 6, 7],  // 3-6-7 split
];

export const isSplit = ({ firstShot, secondShot }: SplitParams): boolean => {
  // Get the pins that are still standing
  const standingPins = secondShot.sort((a, b) => a - b);
  
  // Check if this matches any common split pattern
  return commonSplits.some(splitPattern => {
    if (splitPattern.length !== standingPins.length) return false;
    return splitPattern.every((pin, index) => pin === standingPins[index]);
  });
};