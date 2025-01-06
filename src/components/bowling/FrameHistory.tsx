import { Pin, Frame } from "@/types/game";
import { cn } from "@/lib/utils";

interface FrameHistoryProps {
  frame: Frame;
  size?: "sm" | "md";
}

const PinDisplay = ({ 
  pin, 
  isKnockedDown,
  size = "sm" 
}: { 
  pin: Pin; 
  isKnockedDown: boolean;
  size?: "sm" | "md";
}) => {
  const sizeClasses = size === "sm" ? "w-2 h-2" : "w-3 h-3";
  
  return (
    <div
      className={cn(
        "rounded-full",
        sizeClasses,
        isKnockedDown ? "bg-gray-400" : "bg-white border border-gray-300"
      )}
    />
  );
};

const PinLayout = ({ 
  firstShot,
  secondShot,
  size = "sm"
}: { 
  firstShot: Pin[];
  secondShot: Pin[] | null;
  size?: "sm" | "md";
}) => {
  const isKnockedDown = (pin: Pin) => {
    if (secondShot) {
      // If we have a second shot, show final state after both shots
      return firstShot.includes(pin) || secondShot.includes(pin);
    }
    // Otherwise just show first shot state
    return firstShot.includes(pin);
  };

  const rowClassName = size === "sm" ? "gap-1" : "gap-1.5";

  return (
    <div className="flex flex-col items-center scale-90">
      <div className={cn("flex justify-center", rowClassName)}>
        {[7, 8, 9, 10].map(pin => (
          <PinDisplay 
            key={pin} 
            pin={pin as Pin} 
            isKnockedDown={isKnockedDown(pin as Pin)}
            size={size}
          />
        ))}
      </div>
      <div className={cn("flex justify-center", rowClassName)}>
        {[4, 5, 6].map(pin => (
          <PinDisplay 
            key={pin} 
            pin={pin as Pin} 
            isKnockedDown={isKnockedDown(pin as Pin)}
            size={size}
          />
        ))}
      </div>
      <div className={cn("flex justify-center", rowClassName)}>
        {[2, 3].map(pin => (
          <PinDisplay 
            key={pin} 
            pin={pin as Pin} 
            isKnockedDown={isKnockedDown(pin as Pin)}
            size={size}
          />
        ))}
      </div>
      <div className={cn("flex justify-center", rowClassName)}>
        <PinDisplay 
          pin={1} 
          isKnockedDown={isKnockedDown(1)}
          size={size}
        />
      </div>
    </div>
  );
};

export const FrameHistory = ({ frame, size = "sm" }: FrameHistoryProps) => {
  // Only show history if frame is complete (has strike or second shot)
  if (!frame.firstShot || (!frame.isStrike && !frame.secondShot)) return null;

  return (
    <div className="h-12 flex items-center justify-center">
      <PinLayout 
        firstShot={frame.firstShot} 
        secondShot={frame.secondShot}
        size={size}
      />
    </div>
  );
};
