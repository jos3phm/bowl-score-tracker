import { useState, useEffect, useCallback } from "react";
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

  const handlePinClick = useCallback((pin: Pin) => {
    if (disabled || isLongPress || isHistoricalView) return;
    if (remainingPins !== undefined && !remainingPins.includes(pin)) return;
    
    // Toggle pin selection
    const isSelected = selectedPins.includes(pin);
    const newSelectedPins = isSelected
      ? selectedPins.filter(p => p !== pin)
      : [...selectedPins, pin].sort((a, b) => a - b);
    
    onPinSelect(newSelectedPins);
  }, [disabled, isLongPress, isHistoricalView, remainingPins, selectedPins, onPinSelect]);

  const handleDoubleTapPin = useCallback((pin: Pin) => {
    if (disabled || isHistoricalView) return;
    if (remainingPins !== undefined && !remainingPins.includes(pin)) return;
    
    // Select all pins except the tapped one
    const knockedDownPins = availablePins
      .filter(p => p !== pin)
      .sort((a, b) => a - b);
    
    onPinSelect(knockedDownPins);
    onRegularShot();
  }, [disabled, isHistoricalView, remainingPins, availablePins, onPinSelect, onRegularShot]);

  const handlePinMouseDown = useCallback((pin: Pin) => {
    if (disabled || isHistoricalView) return;
    if (remainingPins !== undefined && !remainingPins.includes(pin)) return;
    
    setIsLongPress(false);
    
    const timer = setTimeout(() => {
      setIsLongPress(true);
      // Select all pins except the long-pressed one
      const pinsToSelect = availablePins
        .filter(p => p !== pin)
        .sort((a, b) => a - b);
      onPinSelect(pinsToSelect);
    }, 500);

    setLongPressTimer(timer);
  }, [disabled, isHistoricalView, remainingPins, availablePins, onPinSelect]);

  const handlePinMouseUp = useCallback(() => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
    setTimeout(() => {
      setIsLongPress(false);
    }, 50);
  }, [longPressTimer]);

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