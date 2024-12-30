import { useState, useEffect } from "react";
import { Pin } from "@/types/game";

export const usePinHandling = (
  onPinSelect: (pins: Pin[]) => void,
  onRegularShot: () => void,
  disabled: boolean,
  isHistoricalView: boolean,
  remainingPins?: Pin[],
  allPins: Pin[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  selectedPins: Pin[] = []
) => {
  const [hoveredPin, setHoveredPin] = useState<Pin | null>(null);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [isLongPress, setIsLongPress] = useState(false);
  
  const availablePins = remainingPins === undefined ? allPins : remainingPins;

  const handlePinClick = (pin: Pin) => {
    if (disabled || isLongPress || isHistoricalView) return;
    
    if (remainingPins !== undefined && !remainingPins.includes(pin)) return;
    
    const newSelectedPins = selectedPins.includes(pin)
      ? selectedPins.filter((p) => p !== pin)
      : [...selectedPins, pin];
    
    onPinSelect(newSelectedPins);
  };

  const handleDoubleTapPin = (pin: Pin) => {
    if (disabled || isHistoricalView) return;
    if (remainingPins !== undefined && !remainingPins.includes(pin)) return;
    
    // On double tap, select all pins EXCEPT the tapped one
    const knockedDownPins = availablePins.filter(p => p === pin);
    onPinSelect(knockedDownPins);
    onRegularShot();
  };

  const handlePinMouseDown = (pin: Pin) => {
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

  return {
    hoveredPin,
    setHoveredPin,
    handlePinClick,
    handleDoubleTapPin,
    handlePinMouseDown,
    handlePinMouseUp,
    isLongPress
  };
};