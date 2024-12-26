import { Frame, Pin } from "@/types/game";
import { cn } from "@/lib/utils";

interface ScoreCardProps {
  frames: Frame[];
  currentFrame: number;
}

export const ScoreCard = ({ frames, currentFrame }: ScoreCardProps) => {
  const renderFrame = (frame: Frame, index: number) => {
    const isActive = index === currentFrame - 1;
    const isTenth = index === 9;

    const renderShot = (shot: Pin[] | null, isSpare: boolean, isLastShot: boolean = false) => {
      if (shot === null) return "-";
      if (shot.length === 10) return <span className="text-primary font-bold">X</span>;
      if (isSpare && !isLastShot) return <span className="text-secondary font-bold">/</span>;
      return shot.length;
    };

    return (
      <div
        key={index}
        className={cn(
          "border rounded-lg p-2 min-w-[80px]",
          "transition-all duration-300",
          isActive && "border-primary shadow-lg",
          !isActive && "border-gray-200"
        )}
      >
        <div className="text-xs text-gray-500 mb-1">Frame {index + 1}</div>
        <div className="grid grid-cols-2 gap-1 mb-1">
          {/* First shot */}
          <div className="text-center">
            {renderShot(frame.firstShot, false)}
          </div>
          
          {/* Second shot */}
          <div className="text-center">
            {renderShot(frame.secondShot, frame.isSpare)}
          </div>
          
          {/* Third shot (10th frame only) */}
          {isTenth && (
            <div className="text-center col-span-2 border-t pt-1">
              {frame.isStrike || frame.isSpare ? 
                renderShot(frame.thirdShot, false, true) : 
                null
              }
            </div>
          )}
        </div>
        
        {/* Running score */}
        <div className="text-center font-semibold border-t pt-1">
          {frame.score !== null ? frame.score : "-"}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex gap-2 p-2 min-w-max">
        {frames.map((frame, index) => renderFrame(frame, index))}
      </div>
    </div>
  );
};