import { Pin } from "@/types/game";

export const usePinHandling = (
  handleShotWithBall: (
    shotHandler: () => void,
    shotType: 'strike' | 'spare' | 'regular'
  ) => void,
  handleRegularShot: (pins: Pin[]) => void,
  handleStrike: () => void,
  handleSpare: () => void,
  handleClear: () => void,
) => {
  // Handler for regular shots - these are the pins that were knocked down
  const handlePinShot = (knockedDownPins: Pin[]) => {
    console.log('Recording regular shot with knocked down pins:', knockedDownPins);
    handleShotWithBall(() => {
      handleRegularShot(knockedDownPins);
    }, 'regular');
  };

  // Handler for miss (no pins knocked down)
  const handleMiss = () => {
    handleShotWithBall(() => {
      handleRegularShot([]);
    }, 'regular');
  };

  const handleStrikeShot = () => {
    handleShotWithBall(handleStrike, 'strike');
  };

  const handleSpareShot = () => {
    handleShotWithBall(handleSpare, 'spare');
  };

  return {
    handlePinShot,
    handleMiss,
    handleStrikeShot,
    handleSpareShot,
    handleClear,
  };
};