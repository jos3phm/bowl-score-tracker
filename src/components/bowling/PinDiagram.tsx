import { Pin } from "./Pin";
import { Pin as PinType } from "@/types/game";
import { usePinHandling } from "@/hooks/bowling/usePinHandling";

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
  const {
    hoveredPin,
    setHoveredPin,
    handlePinClick,
    handleDoubleTapPin,
    handlePinMouseDown,
    handlePinMouseUp,
    isLongPress,
  } = usePinHandling(
    onPinSelect,
    onRegularShot,
    disabled,
    isHistoricalView,
    remainingPins
  );

  const isStandingPin = (pin: PinType) => {
    if (remainingPins === undefined) return true;
    return remainingPins.includes(pin);
  };

  return (
    <div className="relative w-full max-w-[300px] mx-auto">
      <div className="flex justify-center mb-4">
        <Pin
          number={7}
          selected={selectedPins.includes(7)}
          hovered={hoveredPin === 7}
          onMouseEnter={() => setHoveredPin(7)}
          onMouseLeave={() => setHoveredPin(null)}
          onClick={() => handlePinClick(7)}
          onDoubleClick={() => handleDoubleTapPin(7)}
          onMouseDown={() => handlePinMouseDown(7)}
          onMouseUp={handlePinMouseUp}
          disabled={disabled || !isStandingPin(7)}
          isStanding={isStandingPin(7)}
        />
      </div>
      <div className="flex justify-center gap-8 mb-4">
        <Pin
          number={4}
          selected={selectedPins.includes(4)}
          hovered={hoveredPin === 4}
          onMouseEnter={() => setHoveredPin(4)}
          onMouseLeave={() => setHoveredPin(null)}
          onClick={() => handlePinClick(4)}
          onDoubleClick={() => handleDoubleTapPin(4)}
          onMouseDown={() => handlePinMouseDown(4)}
          onMouseUp={handlePinMouseUp}
          disabled={disabled || !isStandingPin(4)}
          isStanding={isStandingPin(4)}
        />
        <Pin
          number={8}
          selected={selectedPins.includes(8)}
          hovered={hoveredPin === 8}
          onMouseEnter={() => setHoveredPin(8)}
          onMouseLeave={() => setHoveredPin(null)}
          onClick={() => handlePinClick(8)}
          onDoubleClick={() => handleDoubleTapPin(8)}
          onMouseDown={() => handlePinMouseDown(8)}
          onMouseUp={handlePinMouseUp}
          disabled={disabled || !isStandingPin(8)}
          isStanding={isStandingPin(8)}
        />
      </div>
      <div className="flex justify-center gap-8 mb-4">
        <Pin
          number={2}
          selected={selectedPins.includes(2)}
          hovered={hoveredPin === 2}
          onMouseEnter={() => setHoveredPin(2)}
          onMouseLeave={() => setHoveredPin(null)}
          onClick={() => handlePinClick(2)}
          onDoubleClick={() => handleDoubleTapPin(2)}
          onMouseDown={() => handlePinMouseDown(2)}
          onMouseUp={handlePinMouseUp}
          disabled={disabled || !isStandingPin(2)}
          isStanding={isStandingPin(2)}
        />
        <Pin
          number={5}
          selected={selectedPins.includes(5)}
          hovered={hoveredPin === 5}
          onMouseEnter={() => setHoveredPin(5)}
          onMouseLeave={() => setHoveredPin(null)}
          onClick={() => handlePinClick(5)}
          onDoubleClick={() => handleDoubleTapPin(5)}
          onMouseDown={() => handlePinMouseDown(5)}
          onMouseUp={handlePinMouseUp}
          disabled={disabled || !isStandingPin(5)}
          isStanding={isStandingPin(5)}
        />
        <Pin
          number={9}
          selected={selectedPins.includes(9)}
          hovered={hoveredPin === 9}
          onMouseEnter={() => setHoveredPin(9)}
          onMouseLeave={() => setHoveredPin(null)}
          onClick={() => handlePinClick(9)}
          onDoubleClick={() => handleDoubleTapPin(9)}
          onMouseDown={() => handlePinMouseDown(9)}
          onMouseUp={handlePinMouseUp}
          disabled={disabled || !isStandingPin(9)}
          isStanding={isStandingPin(9)}
        />
      </div>
      <div className="flex justify-center gap-8">
        <Pin
          number={1}
          selected={selectedPins.includes(1)}
          hovered={hoveredPin === 1}
          onMouseEnter={() => setHoveredPin(1)}
          onMouseLeave={() => setHoveredPin(null)}
          onClick={() => handlePinClick(1)}
          onDoubleClick={() => handleDoubleTapPin(1)}
          onMouseDown={() => handlePinMouseDown(1)}
          onMouseUp={handlePinMouseUp}
          disabled={disabled || !isStandingPin(1)}
          isStanding={isStandingPin(1)}
        />
        <Pin
          number={3}
          selected={selectedPins.includes(3)}
          hovered={hoveredPin === 3}
          onMouseEnter={() => setHoveredPin(3)}
          onMouseLeave={() => setHoveredPin(null)}
          onClick={() => handlePinClick(3)}
          onDoubleClick={() => handleDoubleTapPin(3)}
          onMouseDown={() => handlePinMouseDown(3)}
          onMouseUp={handlePinMouseUp}
          disabled={disabled || !isStandingPin(3)}
          isStanding={isStandingPin(3)}
        />
        <Pin
          number={6}
          selected={selectedPins.includes(6)}
          hovered={hoveredPin === 6}
          onMouseEnter={() => setHoveredPin(6)}
          onMouseLeave={() => setHoveredPin(null)}
          onClick={() => handlePinClick(6)}
          onDoubleClick={() => handleDoubleTapPin(6)}
          onMouseDown={() => handlePinMouseDown(6)}
          onMouseUp={handlePinMouseUp}
          disabled={disabled || !isStandingPin(6)}
          isStanding={isStandingPin(6)}
        />
        <Pin
          number={10}
          selected={selectedPins.includes(10)}
          hovered={hoveredPin === 10}
          onMouseEnter={() => setHoveredPin(10)}
          onMouseLeave={() => setHoveredPin(null)}
          onClick={() => handlePinClick(10)}
          onDoubleClick={() => handleDoubleTapPin(10)}
          onMouseDown={() => handlePinMouseDown(10)}
          onMouseUp={handlePinMouseUp}
          disabled={disabled || !isStandingPin(10)}
          isStanding={isStandingPin(10)}
        />
      </div>
    </div>
  );
};