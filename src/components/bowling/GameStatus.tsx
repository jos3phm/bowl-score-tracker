interface GameStatusProps {
  currentFrame: number;
  currentShot: number;
}

export const GameStatus = ({ currentFrame, currentShot }: GameStatusProps) => {
  return (
    <div className="text-center text-gray-600">
      Frame {currentFrame} • Shot {currentShot}
    </div>
  );
};