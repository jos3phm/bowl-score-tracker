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
const commonSplits: [Pin, Pin][] = [
  [3, 10], // 3-10 split
  [2, 7],  // 2-7 split
  [4, 6],  // 4-6 split (baby split)
  [4, 7],  // 4-7 split
  [4, 10], // 4-10 split
  [6, 7],  // 6-7 split
  [7, 10], // 7-10 split (bedposts)
  [8, 10], // 8-10 split
  [4, 9],  // 4-9 split
  [3, 7],  // 3-7 split
  [2, 10], // 2-10 split
  [5, 7],  // 5-7 split
];

export const isSplit = ({ firstShot, secondShot }: SplitParams): boolean => {
  // If there aren't exactly 2 pins remaining, it's not a split
  if (secondShot.length !== 2) return false;
  
  const [pin1, pin2] = secondShot.sort((a, b) => a - b);
  
  // First, check if this is a common split pattern
  for (const [splitPin1, splitPin2] of commonSplits) {
    if (pin1 === splitPin1 && pin2 === splitPin2) {
      return true;
    }
  }
  
  // If not a common split, check if the pins are non-adjacent
  // and there's no path between them through knocked down pins
  if (!pinNeighbors[pin1].includes(pin2)) {
    // For two non-adjacent pins, we consider it a split if they're
    // separated by at least one pin position
    return Math.abs(pin1 - pin2) > 2;
  }
  
  return false;
};

// Helper function to check if there's a path of standing pins between two pins
const hasConnectingPath = (start: Pin, end: Pin, standingPins: Pin[]): boolean => {
  const visited = new Set<Pin>();
  const queue: Pin[] = [start];
  
  while (queue.length > 0) {
    const current = queue.shift()!;
    if (current === end) return true;
    
    if (!visited.has(current)) {
      visited.add(current);
      
      // Add all standing neighbors to queue
      const neighbors = pinNeighbors[current].filter(pin => standingPins.includes(pin));
      queue.push(...neighbors);
    }
  }
  
  return false;
};