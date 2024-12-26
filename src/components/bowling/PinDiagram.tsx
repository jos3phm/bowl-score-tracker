import { useState, useEffect } from "react";
import { Pin } from "@/types/game";
import { cn } from "@/lib/utils";

interface PinDiagramProps {
  onPinSelect: (pins: Pin[]) => void;
  disabled?: boolean;
  selectedPins?: Pin[];
  remainingPins?: Pin[];
  historicalFrame?: {
    firstShot: Pin[];
    secondShot: Pin[];
    isSpare: boolean;
    isStrike: boolean;
  } | null;
  isHistoricalView?: boolean;
}

export const PinDiagram = ({ 
  onPinSelect, 
  disabled, 
  selectedPins = [],
  remainingPins,
  historicalFrame,
  isHistoricalView = false
}: PinDiagramProps) => {
  const [hoveredPin, setHoveredPin] = useState<Pin | null>(null);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [isLongPress, setIsLongPress] = useState(false);
  const allPins: Pin[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  
  // Use remainingPins if provided (for second shot), otherwise use all pins
  const availablePins = remainingPins || allPins;

  const handlePinClick = (pin: Pin) => {
    if (disabled || isLongPress || isHistoricalView) return;
    
    if (selectedPins.includes(pin)) {
      onPinSelect(selectedPins.filter((p) => p !== pin));
    } else {
      onPinSelect([...selectedPins, pin]);
    }
  };

  const handlePinMouseDown = (pin: Pin) => {
    if (disabled || isHistoricalView) return;
    setIsLongPress(false);

    const timer = setTimeout(() => {
      setIsLongPress(true);
      const pinsToSelect = availablePins.filter(p => p !== pin);
      onPinSelect(pinsToSelect);
    }, 500);

    setLongPressTimer(timer);
  };

  const handlePinMouseUp = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
    setTimeout(() => {
      setIsLongPress(false);
    }, 50);
  };

  useEffect(() => {
    return () => {
      if (longPressTimer) {
        clearTimeout(longPressTimer);
      }
    };
  }, [longPressTimer]);

  const getPinStyle = (pin: Pin) => {
    if (!isHistoricalView) {
      const isSelected = selectedPins.includes(pin);
      const isPinAvailable = availablePins.includes(pin);
      
      if (!isPinAvailable) {
        return "bg-gray-200 text-gray-400";
      }
      
      return isSelected
        ? "bg-primary text-white animate-pin-selected"
        : "bg-white text-gray-800 border-2 border-gray-200";
    }

    if (historicalFrame) {
      const isFirstShot = historicalFrame.firstShot.includes(pin);
      const isSecondShot = historicalFrame.secondShot.includes(pin);
      
      if (historicalFrame.isStrike) {
        return "bg-primary text-white";
      }
      
      if (historicalFrame.isSpare) {
        if (isFirstShot) {
          return "bg-gray-200 text-gray-600";
        }
        return "bg-secondary text-white";
      }
      
      if (isFirstShot) {
        return "bg-primary text-white";
      }
      
      if (isSecondShot) {
        return "bg-secondary text-white";
      }
      
      // Pin was missed in both shots
      if (historicalFrame.firstShot.length > 0 || historicalFrame.secondShot.length > 0) {
        return "bg-white text-gray-400 border-2 border-dashed border-gray-300";
      }
    }
    
    return "bg-white text-gray-800 border-2 border-gray-200";
  };

  const renderPin = (pin: Pin, position: string) => {
    const isHovered = hoveredPin === pin;

    return (
      <button
        key={pin}
        className={cn(
          "w-10 h-10 rounded-full transition-all duration-300",
          "flex items-center justify-center text-sm font-semibold",
          "hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary",
          position,
          getPinStyle(pin),
          isHovered && !disabled && !isHistoricalView && "shadow-lg",
          (disabled || isHistoricalView) && "cursor-default"
        )}
        onClick={() => handlePinClick(pin)}
        onMouseDown={() => handlePinMouseDown(pin)}
        onMouseUp={handlePinMouseUp}
        onMouseLeave={() => {
          setHoveredPin(null);
          handlePinMouseUp();
        }}
        onMouseEnter={() => setHoveredPin(pin)}
        onTouchStart={(e) => {
          e.preventDefault();
          handlePinMouseDown(pin);
        }}
        onTouchEnd={(e) => {
          e.preventDefault();
          handlePinMouseUp();
        }}
        disabled={disabled || isHistoricalView}
      >
        {pin}
      </button>
    );
  };

  return (
    <div className="relative w-48 h-64 mx-auto">
      {/* Back row (pins 7,8,9,10) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full flex justify-between">
        {renderPin(7, "")}
        {renderPin(8, "")}
        {renderPin(9, "")}
        {renderPin(10, "")}
      </div>
      
      {/* Middle row (pins 4,5,6) */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 w-3/4 flex justify-between">
        {renderPin(4, "")}
        {renderPin(5, "")}
        {renderPin(6, "")}
      </div>
      
      {/* Second to last row (pins 2,3) */}
      <div className="absolute top-32 left-1/2 -translate-x-1/2 w-1/2 flex justify-between">
        {renderPin(2, "")}
        {renderPin(3, "")}
      </div>
      
      {/* Front pin (pin 1) */}
      <div className="absolute top-48 left-1/2 -translate-x-1/2">
        {renderPin(1, "")}
      </div>
    </div>
  );
};