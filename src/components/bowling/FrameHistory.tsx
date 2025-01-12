import { Pin, Frame } from "@/types/game";
import { cn } from "@/lib/utils";

interface FrameHistoryProps {
  frame: Frame;
  size?: "sm" | "md";
  frameNumber: number;
}

const PinDisplay = ({ 
  pin, 
  hitOnFirstShot,
  hitOnSecondShot,
  size = "sm" 
}: { 
  pin: Pin; 
  hitOnFirstShot: boolean;
  hitOnSecondShot: boolean;
  size?: "sm" | "md";
}) => {
  const sizeClasses = size === "sm" ? "w-2 h-2" : "w-3 h-3";
  
  return (
    <div
      className={cn(
        "rounded-full",
        sizeClasses,
        {
          "bg-black": hitOnFirstShot,
          "bg-primary": hitOnSecondShot && !hitOnFirstShot,
          "bg-white border border-black": !hitOnFirstShot && !hitOnSecondShot
        }
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
  const isHitOnFirstShot = (pin: Pin) => firstShot.includes(pin);
  const isHitOnSecondShot = (pin: Pin) => secondShot?.includes(pin) || false;

  const rowClassName = size === "sm" ? "gap-1" : "gap-1.5";

  return (
    <div className="flex flex-col items-center scale-90">
      <div className={cn("flex justify-center", rowClassName)}>
        {[7, 8, 9, 10].map(pin => (
          <PinDisplay 
            key={pin} 
            pin={pin as Pin} 
            hitOnFirstShot={isHitOnFirstShot(pin as Pin)}
            hitOnSecondShot={isHitOnSecondShot(pin as Pin)}
            size={size}
          />
        ))}
      </div>
      <div className={cn("flex justify-center", rowClassName)}>
        {[4, 5, 6].map(pin => (
          <PinDisplay 
            key={pin} 
            pin={pin as Pin} 
            hitOnFirstShot={isHitOnFirstShot(pin as Pin)}
            hitOnSecondShot={isHitOnSecondShot(pin as Pin)}
            size={size}
          />
        ))}
      </div>
      <div className={cn("flex justify-center", rowClassName)}>
        {[2, 3].map(pin => (
          <PinDisplay 
            key={pin} 
            pin={pin as Pin} 
            hitOnFirstShot={isHitOnFirstShot(pin as Pin)}
            hitOnSecondShot={isHitOnSecondShot(pin as Pin)}
            size={size}
          />
        ))}
      </div>
      <div className={cn("flex justify-center", rowClassName)}>
        <PinDisplay 
          pin={1} 
          hitOnFirstShot={isHitOnFirstShot(1)}
          hitOnSecondShot={isHitOnSecondShot(1)}
          size={size}
        />
      </div>
    </div>
  );
};

export const FrameHistory = ({ frame, size = "sm", frameNumber }: FrameHistoryProps) => {
  // Only show history if frame has shots
  if (!frame.firstShot) return null;

  // For frame 10, we need to handle multiple pin sets
  if (frameNumber === 10) {
    return (
      <div className="h-12 flex items-center justify-center gap-2">
        {/* First shot pins */}
        <PinLayout 
          firstShot={frame.firstShot} 
          secondShot={null}
          size={size}
        />
        
        {/* Show second set if there was a strike or second shot */}
        {(frame.isStrike || frame.secondShot) && (
          <PinLayout 
            firstShot={frame.secondShot || []} 
            secondShot={null}
            size={size}
          />
        )}
        
        {/* Show third set only if first two were strikes */}
        {frame.isStrike && frame.secondShot?.length === 10 && frame.thirdShot && (
          <PinLayout 
            firstShot={frame.thirdShot} 
            secondShot={null}
            size={size}
          />
        )}
      </div>
    );
  }

  // For frames 1-9, show a single set with both shots
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