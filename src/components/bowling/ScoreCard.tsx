import { Frame, Pin } from "@/types/game";
import { cn } from "@/lib/utils";

interface ScoreCardProps {
  frames: Frame[];
  currentFrame: number;
  onFrameClick?: (frameIndex: number) => void;
  selectedFrame?: number | null;
  isInteractive?: boolean;
}

export const ScoreCard = ({ 
  frames, 
  currentFrame, 
  onFrameClick, 
  selectedFrame,
  isInteractive = true 
}: ScoreCardProps) => {
  const renderShot = (shot: Pin[] | null, isSpare: boolean, isLastShot: boolean = false) => {
    if (shot === null) return "";
    if (shot.length === 10 && !isSpare) return "X";
    if (isSpare) return "/";
    return shot.length.toString();
  };

  const renderFrame = (frame: Frame, index: number) => {
    const isActive = index === currentFrame - 1;
    const isSelected = index === selectedFrame;
    const isTenth = index === 9;

    return (
      <div
        key={index}
        className={cn(
          "relative border-r border-gray-300 last:border-r-0",
          isTenth ? "min-w-[100px]" : "min-w-[80px]",
          "h-[80px]",
          isInteractive && "cursor-pointer hover:bg-gray-50",
          isActive && "bg-primary/5",
          isSelected && "bg-secondary/5"
        )}
        onClick={() => isInteractive && index < currentFrame - 1 && onFrameClick?.(index)}
      >
        {/* Frame Number */}
        <div className="absolute top-0 left-0 w-full text-center text-xs text-gray-500 border-b border-gray-300 py-1">
          {index + 1}
        </div>
        
        {/* Shots Container */}
        <div className="absolute top-[24px] left-0 w-full px-1">
          <div className={cn(
            "flex justify-end",
            isTenth && "space-x-0.5"
          )}>
            {/* First Shot */}
            <div className="w-8 h-8 border-b border-r border-gray-300 flex items-center justify-center">
              {!isTenth && frame.isStrike ? "X" : renderShot(frame.firstShot, false)}
            </div>
            {/* Second Shot */}
            <div className={cn(
              "w-8 h-8 border-b border-gray-300 flex items-center justify-center",
              !isTenth && "border-l-0"
            )}>
              {renderShot(frame.secondShot, frame.isSpare)}
            </div>
            {/* Third Shot (10th frame only) */}
            {isTenth && (frame.isStrike || frame.isSpare) && (
              <div className="w-8 h-8 border-b border-l border-gray-300 flex items-center justify-center">
                {renderShot(frame.thirdShot, false, true)}
              </div>
            )}
          </div>
        </div>

        {/* Frame Score */}
        <div className="absolute bottom-0 left-0 w-full text-center py-2.5 font-semibold">
          {frame.score !== null ? frame.score : ""}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
        <div className="flex min-w-fit">
          {frames.map((frame, index) => renderFrame(frame, index))}
        </div>
      </div>
    </div>
  );
};