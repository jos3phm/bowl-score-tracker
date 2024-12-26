import { useState, useEffect } from "react";
import { Pin } from "@/types/game";
import { cn } from "@/lib/utils";

interface PinDiagramProps {
  onPinSelect: (pins: Pin[]) => void;
  disabled?: boolean;
  selectedPins?: Pin[];
}

export const PinDiagram = ({ onPinSelect, disabled, selectedPins = [] }: PinDiagramProps) => {
  const [hoveredPin, setHoveredPin] = useState<Pin | null>(null);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const allPins: Pin[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const handlePinClick = (pin: Pin) => {
    if (disabled) return;
    
    if (selectedPins.includes(pin)) {
      onPinSelect(selectedPins.filter((p) => p !== pin));
    } else {
      onPinSelect([...selectedPins, pin]);
    }
  };

  const handlePinMouseDown = (pin: Pin) => {
    if (disabled) return;

    const timer = setTimeout(() => {
      // On long press, select all pins except the pressed one
      const invertedSelection = allPins.filter(p => p !== pin);
      onPinSelect(invertedSelection);
    }, 500); // 500ms for long press

    setLongPressTimer(timer);
  };

  const handlePinMouseUp = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  useEffect(() => {
    return () => {
      if (longPressTimer) {
        clearTimeout(longPressTimer);
      }
    };
  }, [longPressTimer]);

  const renderPin = (pin: Pin, position: string) => {
    const isSelected = selectedPins.includes(pin);
    const isHovered = hoveredPin === pin;

    return (
      <button
        key={pin}
        className={cn(
          "w-10 h-10 rounded-full transition-all duration-300",
          "flex items-center justify-center text-sm font-semibold",
          "hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary",
          position,
          isSelected
            ? "bg-primary text-white animate-pin-selected"
            : "bg-white text-gray-800 border-2 border-gray-200",
          isHovered && !disabled && "shadow-lg",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onClick={() => handlePinClick(pin)}
        onMouseDown={() => handlePinMouseDown(pin)}
        onMouseUp={handlePinMouseUp}
        onMouseLeave={() => {
          setHoveredPin(null);
          handlePinMouseUp();
        }}
        onMouseEnter={() => setHoveredPin(pin)}
        disabled={disabled}
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