import { useState, useCallback } from "react";
import { Pin as PinType } from "@/types/game";
import { PinRow } from "./PinRow";

interface PinDiagramProps {
  onPinSelect: (pins: PinType[]) => void;
  selectedPins: PinType[];
  disabled?: boolean;
  onRegularShot: () => void;
  remainingPins?: PinType[];
  isHistoricalView?: boolean;
}

export const PinDiagram = ({
  onPinSelect,
  selectedPins,
  disabled = false,
  onRegularShot,
  remainingPins,
  isHistoricalView = false,
}: PinDiagramProps) => {
  const [hoveredPin, setHoveredPin] = useState<PinType | null>(null);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [isLongPress, setIsLongPress] = useState(false);

  const handlePinClick = useCallback((pin: PinType) => {
    if (disabled || isLongPress || isHistoricalView) return;
    if (remainingPins !== undefined && !remainingPins.includes(pin)) return;

    const newSelectedPins = selectedPins.includes(pin)
      ? selectedPins.filter(p => p !== pin)
      : [...selectedPins, pin];
    
    onPinSelect(newSelectedPins);
  }, [disabled, isLongPress, isHistoricalView, remainingPins, selectedPins, onPinSelect]);

  const handleDoubleTapPin = useCallback((pin: PinType) => {
    if (disabled || isHistoricalView) return;
    if (remainingPins !== undefined && !remainingPins.includes(pin)) return;
    
    // Double tap now selects just this pin as knocked down
    onPinSelect([pin]);
    onRegularShot();
  }, [disabled, isHistoricalView, remainingPins, onPinSelect, onRegularShot]);

  const handlePinMouseDown = useCallback((pin: PinType) => {
    if (disabled || isHistoricalView) return;
    if (remainingPins !== undefined && !remainingPins.includes(pin)) return;
    
    setIsLongPress(false);
    
    const timer = setTimeout(() => {
      setIsLongPress(true);
      // Long press now selects just this pin as knocked down
      onPinSelect([pin]);
    }, 500);

    setLongPressTimer(timer);
  }, [disabled, isHistoricalView, remainingPins, onPinSelect]);

  const handlePinMouseUp = useCallback(() => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
    setTimeout(() => {
      setIsLongPress(false);
    }, 50);
  }, [longPressTimer]);

  const commonProps = {
    selectedPins,
    disabled: disabled || false,
    remainingPins,
    onPinClick: handlePinClick,
    onPinMouseEnter: setHoveredPin,
    onPinMouseLeave: () => setHoveredPin(null),
    onPinMouseDown: handlePinMouseDown,
    onPinMouseUp: handlePinMouseUp,
    onDoubleTapPin: handleDoubleTapPin,
    hoveredPin,
  };

  return (
    <div className="relative w-full max-w-[300px] mx-auto">
      <PinRow
        pins={[7, 8, 9, 10]}
        {...commonProps}
        className="flex justify-center gap-8 mb-4"
      />
      <PinRow
        pins={[4, 5, 6]}
        {...commonProps}
        className="flex justify-center gap-8 mb-4"
      />
      <PinRow
        pins={[2, 3]}
        {...commonProps}
        className="flex justify-center gap-8 mb-4"
      />
      <PinRow
        pins={[1]}
        {...commonProps}
        className="flex justify-center"
      />
    </div>
  );
};