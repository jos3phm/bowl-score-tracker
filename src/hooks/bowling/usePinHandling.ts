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
  const handlePinShot = (knockedDownPins: Pin[]) => {
    console.log('Recording regular shot with knocked down pins:', knockedDownPins);
    handleShotWithBall(() => {
      handleRegularShot(knockedDownPins);
    }, 'regular');
  };

  const handleMiss = () => {
    console.log('Recording miss (no pins knocked down)');
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