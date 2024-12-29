import { Pin as PinType } from "@/types/game";
import { cn } from "@/lib/utils";
import { useRef } from "react";

interface PinProps {
  pin: PinType;
  position: string;
  isSelected: boolean;
  isPinAvailable: boolean;
  isHistoricalView: boolean;
  historicalStyle: string;
  onPinClick: (pin: PinType) => void;
  onPinMouseDown: (pin: PinType) => void;
  onPinMouseUp: () => void;
  onPinMouseLeave: () => void;
  onPinMouseEnter: (pin: PinType) => void;
  onRegularShot: () => void;
  onDoubleTapPin: (pin: PinType) => void;
  isHovered: boolean;
  disabled: boolean;
}

export const Pin = ({
  pin,
  position,
  isSelected,
  isPinAvailable,
  isHistoricalView,
  historicalStyle,
  onPinClick,
  onPinMouseDown,
  onPinMouseUp,
  onPinMouseLeave,
  onPinMouseEnter,
  onRegularShot,
  onDoubleTapPin,
  isHovered,
  disabled,
}: PinProps) => {
  const getPinStyle = () => {
    if (!isHistoricalView) {
      if (!isPinAvailable) {
        return "bg-gray-200 text-gray-400";
      }
      return isSelected
        ? "bg-primary text-white animate-pin-selected"
        : "bg-white text-gray-800 border-2 border-gray-200";
    }
    return historicalStyle;
  };

  const lastTap = useRef<number>(0);
  const DOUBLE_TAP_DELAY = 300; // milliseconds

  const handleTap = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap.current;
    
    if (tapLength < DOUBLE_TAP_DELAY && tapLength > 0) {
      // Double tap detected
      if (!disabled && !isHistoricalView) {
        onDoubleTapPin(pin);
      }
    } else {
      // Single tap
      if (!disabled && !isHistoricalView) {
        onPinClick(pin);
      }
    }
    
    lastTap.current = currentTime;
  };

  return (
    <button
      className={cn(
        "w-10 h-10 rounded-full transition-all duration-300",
        "flex items-center justify-center text-sm font-semibold",
        "hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary",
        position,
        getPinStyle(),
        isHovered && !disabled && !isHistoricalView && "shadow-lg",
        (disabled || isHistoricalView) && "cursor-default"
      )}
      onClick={handleTap}
      onMouseDown={() => onPinMouseDown(pin)}
      onMouseUp={onPinMouseUp}
      onMouseLeave={onPinMouseLeave}
      onMouseEnter={() => onPinMouseEnter(pin)}
      onTouchStart={(e) => {
        e.preventDefault();
        onPinMouseDown(pin);
      }}
      onTouchEnd={(e) => {
        e.preventDefault();
        handleTap(e);
        onPinMouseUp();
      }}
      disabled={disabled || isHistoricalView}
    >
      {pin}
    </button>
  );
};