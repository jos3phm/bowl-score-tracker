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
  const renderShot = (shot: Pin[] | null, isStrike: boolean, isSpare: boolean, frameIndex: number, shotNumber: 1 | 2 | 3) => {
    if (!shot) return "";
    
    // Handle strikes
    if (isStrike && frameIndex < 9 && shot === frames[frameIndex].firstShot) {
      return "X";
    }
    
    // Handle spares
    if (isSpare && shot === frames[frameIndex].secondShot) {
      return "/";
    }

    // Handle 10th frame special cases
    if (frameIndex === 9) {
      if (shot.length === 10) return "X";
      if (isSpare && shot === frames[frameIndex].secondShot) return "/";
      if (frames[9].thirdShot === shot) {
        return shot.length === 10 ? "X" : shot.length.toString();
      }
    }
    
    // Regular shot
    const score = shot.length.toString();
    
    // Check for split condition on first shot
    const frame = frames[frameIndex];
    const isSplitShot = shotNumber === 1 && 
      frame.firstShot && 
      !frame.isStrike && 
      isSplit({ 
        firstShot: frame.firstShot,
        secondShot: [1,2,3,4,5,6,7,8,9,10].filter(p => !frame.firstShot?.includes(p as Pin)) as Pin[]
      });

    if (isSplitShot) {
      return (
        <span className="inline-block rounded-full border-2 border-black px-2">
          {score}
        </span>
      );
    }

    return score;
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
        {/* Frame History */}
        <div className="h-12 flex items-center justify-center">
          <FrameHistory frame={frame} size="sm" frameNumber={index + 1} />
        </div>
        
        {/* Frame Number */}
        <div className="text-sm font-medium text-gray-600 border-t border-b border-gray-300 py-1 text-center">
          {index + 1}
        </div>
        
        {/* Shots Container */}
        <div className={cn(
          "grid border-b border-gray-300",
          index === 9 ? "grid-cols-3" : "grid-cols-2"
        )}>
          <div className="p-2 text-center border-r border-gray-300">
            {renderShot(frame.firstShot, frame.isStrike, false, index, 1)}
          </div>
          <div className="p-2 text-center">
            {renderShot(frame.secondShot, frame.isStrike, frame.isSpare, index, 2)}
          </div>
          {index === 9 && (
            <div className="p-2 text-center border-l border-gray-300">
              {renderShot(frame.thirdShot, frame.isStrike, frame.isSpare, index, 3)}
            </div>
          )}
        </div>
        
        {/* Frame Score */}
        <div className="p-2 text-center">
          <span>{frameScore}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="relative border border-gray-300 rounded-lg overflow-hidden">
      <div className="grid grid-cols-11 text-sm">
        {frames.map((frame, index) => renderFrame(frame, index))}
      </div>
    </div>
  );
};