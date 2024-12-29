import { useState, useEffect } from "react";
import { Pin as PinType } from "@/types/game";
import { Pin } from "./Pin";
import { getHistoricalPinStyle } from "@/utils/bowling/pin-styles";

interface PinDiagramProps {
  onPinSelect: (pins: PinType[]) => void;
  onRegularShot: () => void;
  disabled?: boolean;
  selectedPins?: PinType[];
  remainingPins?: PinType[];
  historicalFrame?: {
    firstShot: PinType[];
    secondShot: PinType[];
    isSpare: boolean;
    isStrike: boolean;
  } | null;
  isHistoricalView?: boolean;
}

export const PinDiagram = ({
  onPinSelect,
  onRegularShot,
  disabled = false,
  selectedPins = [],
  remainingPins,
  historicalFrame,
  isHistoricalView = false,
}: PinDiagramProps) => {
  const [hoveredPin, setHoveredPin] = useState<PinType | null>(null);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [isLongPress, setIsLongPress] = useState(false);
  const allPins: PinType[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  
  const availablePins = remainingPins === undefined ? allPins : remainingPins;

  const handlePinClick = (pin: PinType) => {
    if (disabled || isLongPress || isHistoricalView) return;
    
    if (remainingPins !== undefined && !remainingPins.includes(pin)) return;
    
    // For first shot, selectedPins represents knocked down pins
    // For second shot, we use remainingPins logic
    if (remainingPins === undefined) {
      // First shot - toggle the knocked down state
      if (selectedPins.includes(pin)) {
        // Pin was knocked down, now it's standing
        onPinSelect(selectedPins.filter((p) => p !== pin));
      } else {
        // Pin was standing, now it's knocked down
        onPinSelect([...selectedPins, pin]);
      }
    } else {
      // Second shot - use remaining pins logic
      if (selectedPins.includes(pin)) {
        onPinSelect(selectedPins.filter((p) => p !== pin));
      } else {
        onPinSelect([...selectedPins, pin]);
      }
    }
  };

  const handleDoubleTapPin = (pin: PinType) => {
    if (disabled || isHistoricalView) return;
    if (remainingPins !== undefined && !remainingPins.includes(pin)) return;
    
    // Select all pins except the double-tapped one
    const knockedDownPins = availablePins.filter(p => p !== pin);
    onPinSelect(knockedDownPins);
    onRegularShot();
  };

  const handlePinMouseDown = (pin: PinType) => {
    if (disabled || isHistoricalView) return;
    if (remainingPins !== undefined && !remainingPins.includes(pin)) return;
    
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

  const renderPin = (pin: PinType, position: string) => {
    const isSelected = selectedPins.includes(pin);
    const isPinAvailable = availablePins.includes(pin);
    const historicalStyle = historicalFrame 
      ? getHistoricalPinStyle(pin, historicalFrame)
      : "";

    return (
      <Pin
        key={pin}
        pin={pin}
        position={position}
        isSelected={isSelected}
        isPinAvailable={isPinAvailable}
        isHistoricalView={isHistoricalView}
        historicalStyle={historicalStyle}
        onPinClick={handlePinClick}
        onPinMouseDown={handlePinMouseDown}
        onPinMouseUp={handlePinMouseUp}
        onPinMouseLeave={() => {
          setHoveredPin(null);
          handlePinMouseUp();
        }}
        onPinMouseEnter={(pin) => setHoveredPin(pin)}
        onRegularShot={onRegularShot}
        onDoubleTapPin={handleDoubleTapPin}
        isHovered={hoveredPin === pin}
        disabled={disabled || (remainingPins !== undefined && !remainingPins.includes(pin))}
      />
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