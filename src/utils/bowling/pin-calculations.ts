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
  
  return shot === 1
    ? allPins.filter(pin => !selectedPins.includes(pin)) // First shot - unselected pins are knocked down
    : selectedPins; // Second shot - selected pins are knocked down
};