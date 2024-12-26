import { Pin } from "@/types/game";

export const getHistoricalPinStyle = (
  pin: Pin,
  historicalFrame: {
    firstShot: Pin[];
    secondShot: Pin[];
    isSpare: boolean;
    isStrike: boolean;
  }
) => {
  const isFirstShot = historicalFrame.firstShot.includes(pin);
  const isSecondShot = historicalFrame.secondShot.includes(pin);

  if (historicalFrame.isStrike) {
    return "bg-primary text-white";
  }

  if (historicalFrame.isSpare) {
    if (isFirstShot) {
      return "bg-gray-200 text-gray-600";
    }
    return "bg-secondary text-white";
  }

  if (isFirstShot) {
    return "bg-primary text-white";
  }

  if (isSecondShot) {
    return "bg-secondary text-white";
  }

  // Pin was missed in both shots
  if (historicalFrame.firstShot.length > 0 || historicalFrame.secondShot.length > 0) {
    return "bg-white text-gray-400 border-2 border-dashed border-gray-300";
  }

  return "bg-white text-gray-800 border-2 border-gray-200";
};