interface GameStatusProps {
  currentFrame: number;
  currentShot: number;
}

export const GameStatus = ({ currentFrame, currentShot }: GameStatusProps) => {
  const displayShot = currentFrame === 10 && currentShot > 1 ? 
    `Shot ${currentShot} (Bonus)` : 
    `Shot ${currentShot}`;

  return (
    <div className="text-center text-gray-600">
      Frame {currentFrame} • {displayShot}
    </div>
  );
};