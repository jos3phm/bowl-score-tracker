import { Pin as PinType } from "@/types/game";
import { PinRow } from "./PinRow";
import { usePinHandling } from "./usePinHandling";

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
  const allPins: PinType[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const availablePins = remainingPins === undefined ? allPins : remainingPins;

  const {
    hoveredPin,
    setHoveredPin,
    handlePinClick,
    handleDoubleTapPin,
    handlePinMouseDown,
    handlePinMouseUp
  } = usePinHandling(
    onPinSelect,
    onRegularShot,
    disabled,
    isHistoricalView,
    remainingPins,
    allPins
  );

  const pinRows = [
    { pins: [7, 8, 9, 10] as PinType[], position: "top-0 left-1/2 -translate-x-1/2 w-full" },
    { pins: [4, 5, 6] as PinType[], position: "top-16 left-1/2 -translate-x-1/2 w-3/4" },
    { pins: [2, 3] as PinType[], position: "top-32 left-1/2 -translate-x-1/2 w-1/2" },
    { pins: [1] as PinType[], position: "top-48 left-1/2 -translate-x-1/2" },
  ];

  return (
    <div className="relative w-48 h-64 mx-auto">
      {pinRows.map((row, index) => (
        <PinRow
          key={index}
          pins={row.pins}
          position={row.position}
          selectedPins={selectedPins}
          availablePins={availablePins}
          isHistoricalView={isHistoricalView}
          historicalFrame={historicalFrame}
          disabled={disabled}
          onPinClick={handlePinClick}
          onPinMouseDown={handlePinMouseDown}
          onPinMouseUp={handlePinMouseUp}
          onPinMouseLeave={() => setHoveredPin(null)}
          onPinMouseEnter={setHoveredPin}
          onDoubleTapPin={handleDoubleTapPin}
          onRegularShot={onRegularShot}
          hoveredPin={hoveredPin}
        />
      ))}
    </div>
  );
};