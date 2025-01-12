import { Pin } from "@/types/game";

export const getAllPins = (): Pin[] => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export const getKnockedDownPins = (
  selectedPins: Pin[],
  shot: 1 | 2 | 3
): Pin[] => {
  const allPins = getAllPins();
  
  if (selectedPins.length === 0) {
    return []; // Miss - no pins knocked down
  }
  
  if (shot === 1) {
    // First shot - selected pins are standing, so unselected pins are knocked down
    return allPins.filter(pin => !selectedPins.includes(pin));
  } else {
    // Second or third shot - selected pins are the ones knocked down
    return selectedPins;
  }
};