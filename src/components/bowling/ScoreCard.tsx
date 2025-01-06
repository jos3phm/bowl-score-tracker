import { Frame } from "@/types/game";
import { cn } from "@/lib/utils";
import { isSplit } from "@/utils/bowling/split-detection";

interface ScoreCardProps {
  frames: Frame[];
  currentFrame: number;
  isInteractive?: boolean;
  onFrameClick?: (frameNumber: number) => void;
}

export const ScoreCard = ({
  frames,
  currentFrame,
  isInteractive = true,
  onFrameClick,
}: ScoreCardProps) => {
  const renderShot = (shot: number[], isSpare: boolean, frameIndex: number, shotIndex: number) => {
    if (!shot) return "";
    if (isSpare) return "/";
    
    const shotValue = shot.length.toString();
    const isSplitShot = shotIndex === 1 && isSplit(frames[frameIndex].firstShot || [], shot);
    
    return isSplitShot ? (
      <div className="relative inline-block">
        <span className="relative z-10">{shotValue}</span>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-7 h-7 border-2 border-gray-800 rounded-full" />
      </div>
    ) : shotValue;
  };

  const renderFrame = (frame: Frame, index: number) => {
    const isActive = currentFrame === index + 1;
    const frameScore = frame.score?.toString() || "";

    return (
      <div
        key={index}
        className={cn(
          "border-r border-gray-300 text-center",
          isActive && "bg-blue-50",
          isInteractive && "cursor-pointer hover:bg-gray-50",
          index === 9 && "col-span-2"
        )}
        onClick={() => isInteractive && onFrameClick?.(index + 1)}
      >
        <div className="grid grid-cols-2 gap-1 p-2 border-b border-gray-300">
          {renderShot(frame.firstShot || [], false, index, 1)}
          {renderShot(frame.secondShot || [], frame.isSpare, index, 2)}
          {index === 9 && frame.thirdShot && (
            <div className="col-span-1">
              {renderShot(frame.thirdShot, false, index, 3)}
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