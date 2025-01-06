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
  knockedPins,
  size = "sm"
}: { 
  knockedPins: Pin[];
  size?: "sm" | "md";
}) => {
  const isKnockedDown = (pin: Pin) => knockedPins.includes(pin);
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
  if (!frame.firstShot) return null;

  return (
    <div className="space-y-1">
      <PinLayout knockedPins={frame.firstShot} size={size} />
      {frame.secondShot && !frame.isStrike && (
        <PinLayout 
          knockedPins={[...frame.firstShot, ...frame.secondShot]} 
          size={size}
        />
      )}
    </div>
  );
};