interface GameStatusProps {
  currentFrame: number;
  currentShot: 1 | 2 | 3;
}

export const GameStatus = ({ currentFrame, currentShot }: GameStatusProps) => {
  return (
    <div className="text-center text-gray-600">
      <p>Frame {currentFrame} - Shot {currentShot}</p>
    </div>
  );
};