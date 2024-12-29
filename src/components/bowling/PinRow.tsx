import { Pin as PinType } from "@/types/game";
import { Pin } from "./Pin";

interface PinRowProps {
  pins: PinType[];
  position: string;
  selectedPins: PinType[];
  availablePins: PinType[];
  isHistoricalView: boolean;
  historicalFrame?: {
    firstShot: PinType[];
    secondShot: PinType[];
    isSpare: boolean;
    isStrike: boolean;
  } | null;
  disabled: boolean;
  onPinClick: (pin: PinType) => void;
  onPinMouseDown: (pin: PinType) => void;
  onPinMouseUp: () => void;
  onPinMouseLeave: () => void;
  onPinMouseEnter: (pin: PinType) => void;
  onDoubleTapPin: (pin: PinType) => void;
  onRegularShot: () => void;
  hoveredPin: PinType | null;
}

export const PinRow = ({
  pins,
  position,
  selectedPins,
  availablePins,
  isHistoricalView,
  historicalFrame,
  disabled,
  onPinClick,
  onPinMouseDown,
  onPinMouseUp,
  onPinMouseLeave,
  onPinMouseEnter,
  onDoubleTapPin,
  onRegularShot,
  hoveredPin,
}: PinRowProps) => {
  return (
    <div className={`absolute ${position} flex justify-between`}>
      {pins.map((pin) => (
        <Pin
          key={pin}
          pin={pin}
          position=""
          isSelected={selectedPins.includes(pin)}
          isPinAvailable={availablePins.includes(pin)}
          isHistoricalView={isHistoricalView}
          historicalStyle={historicalFrame ? getHistoricalPinStyle(pin, historicalFrame) : ""}
          onPinClick={onPinClick}
          onPinMouseDown={onPinMouseDown}
          onPinMouseUp={onPinMouseUp}
          onPinMouseLeave={onPinMouseLeave}
          onPinMouseEnter={onPinMouseEnter}
          onRegularShot={onRegularShot}
          onDoubleTapPin={onDoubleTapPin}
          isHovered={hoveredPin === pin}
          disabled={disabled || !availablePins.includes(pin)}
        />
      ))}
    </div>
  );
};