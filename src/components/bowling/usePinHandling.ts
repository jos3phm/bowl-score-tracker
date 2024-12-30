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
  const [localSelectedPins, setLocalSelectedPins] = useState<Pin[]>([]);
  
  const availablePins = remainingPins === undefined ? allPins : remainingPins;

  // Only update local state when selectedPins prop changes and is different
  useEffect(() => {
    if (JSON.stringify(localSelectedPins) !== JSON.stringify(selectedPins)) {
      setLocalSelectedPins(selectedPins);
    }
  }, [selectedPins]);

  const handlePinClick = useCallback((pin: Pin) => {
    if (disabled || isLongPress || isHistoricalView) return;
    if (remainingPins !== undefined && !remainingPins.includes(pin)) return;
    
    const newSelectedPins = localSelectedPins.includes(pin)
      ? localSelectedPins.filter(p => p !== pin)
      : [...localSelectedPins, pin];
    
    setLocalSelectedPins(newSelectedPins);
    onPinSelect(newSelectedPins);
  }, [disabled, isLongPress, isHistoricalView, remainingPins, localSelectedPins, onPinSelect]);

  const handleDoubleTapPin = useCallback((pin: Pin) => {
    if (disabled || isHistoricalView) return;
    if (remainingPins !== undefined && !remainingPins.includes(pin)) return;
    
    const knockedDownPins = availablePins.filter(p => p !== pin);
    setLocalSelectedPins(knockedDownPins);
    onPinSelect(knockedDownPins);
    onRegularShot();
  }, [disabled, isHistoricalView, remainingPins, availablePins, onPinSelect, onRegularShot]);

  const handlePinMouseDown = useCallback((pin: Pin) => {
    if (disabled || isHistoricalView) return;
    if (remainingPins !== undefined && !remainingPins.includes(pin)) return;
    
    setIsLongPress(false);
    
    const timer = setTimeout(() => {
      setIsLongPress(true);
      const pinsToSelect = availablePins.filter(p => p !== pin);
      setLocalSelectedPins(pinsToSelect);
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