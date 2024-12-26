import { useState } from "react";
import { Pin } from "@/types/game";
import { cn } from "@/lib/utils";

interface PinDiagramProps {
  onPinSelect: (pins: Pin[]) => void;
  disabled?: boolean;
  selectedPins?: Pin[];
}

export const PinDiagram = ({ onPinSelect, disabled, selectedPins = [] }: PinDiagramProps) => {
  const [hoveredPin, setHoveredPin] = useState<Pin | null>(null);

  const handlePinClick = (pin: Pin) => {
    if (disabled) return;
    
    if (selectedPins.includes(pin)) {
      onPinSelect(selectedPins.filter((p) => p !== pin));
    } else {
      onPinSelect([...selectedPins, pin]);
    }
  };

  const renderPin = (pin: Pin, position: string) => {
    const isSelected = selectedPins.includes(pin);
    const isHovered = hoveredPin === pin;

    return (
      <button
        key={pin}
        className={cn(
          "w-8 h-8 rounded-full transition-all duration-300",
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
        onMouseEnter={() => setHoveredPin(pin)}
        onMouseLeave={() => setHoveredPin(null)}
        disabled={disabled}
      >
        {pin}
      </button>
    );
  };

  return (
    <div className="relative w-64 h-48 mx-auto">
      {/* Back row */}
      {renderPin(7, "absolute left-0 top-0")}
      {renderPin(8, "absolute left-1/3 top-0")}
      {renderPin(9, "absolute right-1/3 top-0")}
      {renderPin(10, "absolute right-0 top-0")}
      
      {/* Middle row */}
      {renderPin(4, "absolute left-[12.5%] top-1/3")}
      {renderPin(5, "absolute left-1/2 top-1/3 -translate-x-1/2")}
      {renderPin(6, "absolute right-[12.5%] top-1/3")}
      
      {/* Front row */}
      {renderPin(2, "absolute left-1/4 top-2/3")}
      {renderPin(3, "absolute right-1/4 top-2/3")}
      
      {/* Head pin */}
      {renderPin(1, "absolute left-1/2 bottom-0 -translate-x-1/2")}
    </div>
  );
};