interface GameStatusProps {
  currentFrame: number;
  currentShot: 1 | 2 | 3;
}

export const GameStatus = ({ currentFrame, currentShot }: GameStatusProps) => {
  const displayFrame = currentFrame > 10 ? 10 : currentFrame;
  const displayShot = currentFrame > 10 
    ? `Shot ${currentShot} (Bonus)`
    : `Shot ${currentShot}`;

  return (
    <div className="text-center text-gray-600">
      <p>Frame {displayFrame} - {displayShot}</p>
    </div>
  );
};