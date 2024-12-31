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

export const isSplit = (remainingPins: Pin[]): boolean => {
  if (remainingPins.length < 2) return false;
  
  // Check if any pair of remaining pins are not neighbors
  for (let i = 0; i < remainingPins.length; i++) {
    for (let j = i + 1; j < remainingPins.length; j++) {
      const pin1 = remainingPins[i];
      const pin2 = remainingPins[j];
      
      // If these pins aren't neighbors and there's a pin between them that was knocked down,
      // it's a split
      if (!pinNeighbors[pin1].includes(pin2)) {
        // Check if there's a path of standing pins connecting these two
        const hasPathOfStandingPins = hasConnectingPath(pin1, pin2, remainingPins);
        if (!hasPathOfStandingPins) {
          return true;
        }
      }
    }
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