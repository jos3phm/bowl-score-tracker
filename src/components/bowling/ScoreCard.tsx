import { Frame, Pin } from "@/types/game";
import { cn } from "@/lib/utils";
import { isSplit } from "@/utils/bowling/split-detection";
import { FrameHistory } from "./FrameHistory";

interface ScoreCardProps {
  frames: Frame[];
  currentFrame: number;
  isInteractive?: boolean;
  onFrameClick?: (frameNumber: number) => void;
  selectedFrame?: number | null;
}

export const ScoreCard = ({
  frames,
  currentFrame,
  isInteractive = true,
  onFrameClick,
  selectedFrame = null,
}: ScoreCardProps) => {
  const renderShot = (shot: Pin[] | null, isStrike: boolean, isSpare: boolean, frameIndex: number) => {
    if (!shot) return "";
    
    // Handle strikes
    if (isStrike && frameIndex < 9 && shot === frames[frameIndex].firstShot) {
      return (
        <div className="flex flex-col items-center">
          <span>X</span>
          <FrameHistory frame={frames[frameIndex]} />
        </div>
      );
    }
    
    // Handle spares
    if (isSpare && shot === frames[frameIndex].secondShot) {
      return (
        <div className="flex flex-col items-center">
          <span>/</span>
          <FrameHistory frame={frames[frameIndex]} />
        </div>
      );
    }

    // Handle 10th frame special cases
    if (frameIndex === 9) {
      if (shot.length === 10) {
        return (
          <div className="flex flex-col items-center">
            <span>X</span>
            <FrameHistory frame={frames[frameIndex]} />
          </div>
        );
      }
      if (isSpare && shot === frames[frameIndex].secondShot) {
        return (
          <div className="flex flex-col items-center">
            <span>/</span>
            <FrameHistory frame={frames[frameIndex]} />
          </div>
        );
      }
      if (frames[9].thirdShot === shot) {
        return (
          <div className="flex flex-col items-center">
            <span>{shot.length === 10 ? "X" : shot.length.toString()}</span>
            <FrameHistory frame={frames[frameIndex]} />
          </div>
        );
      }
    }
    
    // Regular shot
    const shotValue = shot.length.toString();
    
    return (
      <div className="flex flex-col items-center">
        <span>{shotValue}</span>
        <FrameHistory frame={frames[frameIndex]} />
      </div>
    );
  };

  const renderFrame = (frame: Frame, index: number) => {
    const isActive = currentFrame === index + 1;
    const isSelected = selectedFrame === index + 1;
    const frameScore = frame.score?.toString() || "";

    return (
      <div
        key={index}
        className={cn(
          "border-r border-gray-300 relative",
          isActive && "bg-blue-50",
          isSelected && "bg-blue-100",
          isInteractive && "cursor-pointer hover:bg-gray-50",
          index === 9 && "col-span-2 border-r-0"
        )}
        onClick={() => isInteractive && onFrameClick?.(index + 1)}
      >
        {/* Frame Number */}
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-sm font-medium text-gray-600">
          {index + 1}
        </div>
        
        {/* Shots Container */}
        <div className={cn(
          "grid border-b border-gray-300 min-h-[2.5rem]",
          index === 9 ? "grid-cols-3" : "grid-cols-2"
        )}>
          <div className="p-2 text-center border-r border-gray-300 min-h-[2.5rem] flex items-center justify-center">
            {renderShot(frame.firstShot, frame.isStrike, false, index)}
          </div>
          <div className="p-2 text-center min-h-[2.5rem] flex items-center justify-center">
            {renderShot(frame.secondShot, frame.isStrike, frame.isSpare, index)}
          </div>
          {index === 9 && (
            <div className="p-2 text-center border-l border-gray-300 min-h-[2.5rem] flex items-center justify-center">
              {renderShot(frame.thirdShot, frame.isStrike, frame.isSpare, index)}
            </div>
          )}
        </div>
        
        {/* Frame Score */}
        <div className="p-2 text-center min-h-[2.5rem] flex items-center justify-center">
          {frameScore}
        </div>
      </div>
    );
  };

  return (
    <div className="relative pt-8 border border-gray-300 rounded-lg overflow-hidden">
      <div className="grid grid-cols-11 text-sm">
        {frames.map((frame, index) => renderFrame(frame, index))}
      </div>
    </div>
  );
};
