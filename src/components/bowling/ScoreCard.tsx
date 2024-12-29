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

    const renderShot = (shot: Pin[] | null, isSpare: boolean, isLastShot: boolean = false) => {
      if (shot === null) return "";
      if (isSpare && !isLastShot) return <span className="text-secondary font-bold">/</span>;
      if (shot.length === 10 && !isSpare) return <span className="text-primary font-bold">X</span>;
      return shot.length;
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
          // Special layout for 10th frame
          <div className="mb-1">
            <div className="flex justify-center gap-1">
              {renderShot(frame.firstShot, false)}
              {renderShot(frame.secondShot, false)}
              {(frame.isStrike || frame.isSpare) && renderShot(frame.thirdShot, false, true)}
            </div>
          </div>
        ) : (
          // Regular frame layout
          <div className="grid grid-cols-2 gap-1 mb-1">
            <div className="text-center">
              {renderShot(frame.firstShot, false)}
            </div>
            <div className="text-center">
              {frame.isStrike ? "" : renderShot(frame.secondShot, frame.isSpare)}
            </div>
          </div>
        )}
        
        {/* Running score */}
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