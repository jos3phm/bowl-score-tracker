import { Frame } from "@/types/game";
import { cn } from "@/lib/utils";

interface ScoreCardProps {
  frames: Frame[];
  currentFrame: number;
}

export const ScoreCard = ({ frames, currentFrame }: ScoreCardProps) => {
  const renderFrame = (frame: Frame, index: number) => {
    const isActive = index === currentFrame - 1;
    const isTenth = index === 9;

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
            {frame.firstShot !== null ? (
              frame.isStrike ? (
                <span className="text-primary font-bold">X</span>
              ) : (
                frame.firstShot?.length || "0"
              )
            ) : (
              "-"
            )}
          </div>
          
          {/* Second shot */}
          <div className="text-center">
            {frame.secondShot !== null ? (
              frame.isSpare ? (
                <span className="text-secondary font-bold">/</span>
              ) : (
                frame.secondShot?.length || "0"
              )
            ) : (
              "-"
            )}
          </div>
          
          {/* Third shot (10th frame only) */}
          {isTenth && (
            <div className="text-center col-span-2">
              {frame.thirdShot !== null ? (
                frame.thirdShot?.length || "0"
              ) : (
                "-"
              )}
            </div>
          )}
        </div>
        
        {/* Running score */}
        <div className="text-center font-semibold">
          {frame.score || "-"}
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