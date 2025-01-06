import { Frame } from "@/types/game";
import { cn } from "@/lib/utils";
import { isSplit } from "@/utils/bowling/split-detection";

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
  const renderShot = (shot: number[], isSpare: boolean, frameIndex: number) => {
    if (!shot) return "";
    if (isSpare) return "/";
    
    const shotValue = shot.length.toString();
    // Only check for splits on the second shot of a frame
    const isSplitShot = frameIndex > 0 && shot.length > 0 && frames[frameIndex].firstShot 
      ? isSplit({
          firstShot: frames[frameIndex].firstShot || [],
          secondShot: shot
        })
      : false;
    
    return isSplitShot ? (
      <div className="relative inline-block w-6 h-6">
        <span className="relative z-10 text-gray-900">{shotValue}</span>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full border-2.5 border-gray-800 rounded-full scale-110" />
      </div>
    ) : shotValue;
  };

  const renderFrame = (frame: Frame, index: number) => {
    const isActive = currentFrame === index + 1;
    const isSelected = selectedFrame === index + 1;
    const frameScore = frame.score?.toString() || "";

    return (
      <div
        key={index}
        className={cn(
          "border-r border-gray-300 text-center",
          isActive && "bg-blue-50",
          isSelected && "bg-blue-100",
          isInteractive && "cursor-pointer hover:bg-gray-50",
          index === 9 && "col-span-2"
        )}
        onClick={() => isInteractive && onFrameClick?.(index + 1)}
      >
        <div className="grid grid-cols-2 gap-1 p-2 border-b border-gray-300">
          {renderShot(frame.firstShot || [], false, index)}
          {renderShot(frame.secondShot || [], frame.isSpare, index)}
          {index === 9 && frame.thirdShot && (
            <div className="col-span-1">
              {renderShot(frame.thirdShot, false, index)}
            </div>
          )}
        </div>
        <div className="p-2">{frameScore}</div>
      </div>
    );
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <div className="grid grid-cols-10 text-sm">
        {frames.map((frame, index) => renderFrame(frame, index))}
      </div>
    </div>
  );
};