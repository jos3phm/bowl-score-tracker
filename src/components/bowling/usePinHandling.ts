import { useState, useCallback, useEffect } from "react";
import { Pin } from "@/types/game";

export const usePinHandling = (
  onPinSelect: (pins: Pin[] | ((currentPins: Pin[]) => Pin[])) => void,
  onRegularShot: () => void,
  disabled: boolean,
  isHistoricalView: boolean,
  remainingPins?: Pin[],
  allPins: Pin[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
) => {
  const [hoveredPin, setHoveredPin] = useState<Pin | null>(null);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [isLongPress, setIsLongPress] = useState(false);
  
  const availablePins = remainingPins === undefined ? allPins : remainingPins;

  const handlePinClick = useCallback((pin: Pin) => {
    if (disabled || isLongPress || isHistoricalView) return;
    if (remainingPins !== undefined && !remainingPins.includes(pin)) return;

    onPinSelect((currentPins) => {
      const isSelected = currentPins.includes(pin);
      if (isSelected) {
        return currentPins.filter(p => p !== pin);
      } else {
        return [...currentPins, pin];
      }
    });
  }, [disabled, isLongPress, isHistoricalView, remainingPins, onPinSelect]);

  const handleDoubleTapPin = useCallback((pin: Pin) => {
    if (disabled || isHistoricalView) return;
    if (remainingPins !== undefined && !remainingPins.includes(pin)) return;
    
    const knockedDownPins = availablePins.filter(p => p !== pin);
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