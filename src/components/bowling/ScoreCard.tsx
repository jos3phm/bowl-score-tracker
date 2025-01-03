import { Frame, Pin } from "@/types/game";
import { cn } from "@/lib/utils";

interface ScoreCardProps {
  frames: Frame[];
  currentFrame: number;
  onFrameClick: (frameIndex: number) => void;
  selectedFrame: number | null;
}

export const ScoreCard = ({ frames, currentFrame, onFrameClick, selectedFrame }: ScoreCardProps) => {
  const renderFrame = (frame: Frame, index: number) => {
    const isActive = index === currentFrame - 1;
    const isSelected = index === selectedFrame;
    const isTenth = index === 9;

    const renderShot = (shot: Pin[] | null, isSpare: boolean, isLastShot: boolean = false, isSplit: boolean = false) => {
      if (shot === null) return "";
      if (shot.length === 10 && !isSpare) return <span className="text-primary font-bold">X</span>;
      if (isSpare && !isLastShot) return <span className="text-secondary font-bold">/</span>;
      const score = shot.length;
      return isSplit ? (
        <span className="inline-block rounded-full border-2 border-gray-400 w-6 h-6 text-center">
          {score}
        </span>
      ) : score;
    };

    return (
      <div
        key={index}
        className={cn(
          "border rounded-lg p-2 w-[90px] flex-shrink-0 cursor-pointer hover:border-primary/50",
          "transition-all duration-300",
          isActive && "border-primary shadow-lg",
          isSelected && "border-secondary shadow-lg",
          !isActive && !isSelected && "border-gray-200"
        )}
        onClick={() => index < currentFrame - 1 ? onFrameClick(index) : null}
      >
        <div className="text-xs text-gray-500 mb-1">Frame {index + 1}</div>
        {isTenth ? (
          <div className="mb-1">
            <div className="flex justify-center gap-1">
              {renderShot(frame.firstShot, false, false, frame.isSplit)}
              {frame.isSpare ? (
                <span className="text-secondary font-bold">/</span>
              ) : (
                renderShot(frame.secondShot, false)
              )}
              {(frame.isStrike || frame.isSpare) && renderShot(frame.thirdShot, false, true)}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-1 mb-1">
            <div className="text-center">
              {renderShot(frame.firstShot, false, false, frame.isSplit)}
            </div>
            <div className="text-center">
              {frame.isSpare ? (
                <span className="text-secondary font-bold">/</span>
              ) : (
                frame.isStrike ? "" : renderShot(frame.secondShot, false)
              )}
            </div>
          </div>
        )}
        
        <div className="text-center font-semibold border-t pt-1">
          {frame.score !== null ? frame.score : ""}
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-full">
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-3 px-4" style={{ width: "max-content" }}>
          {frames.map((frame, index) => renderFrame(frame, index))}
        </div>
      </div>
    </div>
  );
};