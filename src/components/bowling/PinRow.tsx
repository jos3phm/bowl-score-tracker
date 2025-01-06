import { Pin as PinType } from "@/types/game";
import { Pin } from "./Pin";

interface PinRowProps {
  pins: PinType[];
  selectedPins: PinType[];
  disabled: boolean;
  remainingPins?: PinType[];
  onPinClick: (pin: PinType) => void;
  onPinMouseEnter: (pin: PinType) => void;
  onPinMouseLeave: () => void;
  onPinMouseDown: (pin: PinType) => void;
  onPinMouseUp: () => void;
  onDoubleTapPin: (pin: PinType) => void;
  hoveredPin: PinType | null;
  className?: string;
}

export const PinRow = ({
  pins,
  selectedPins,
  disabled,
  remainingPins,
  onPinClick,
  onPinMouseEnter,
  onPinMouseLeave,
  onPinMouseDown,
  onPinMouseUp,
  onDoubleTapPin,
  hoveredPin,
  className,
}: PinRowProps) => {
  const isStandingPin = (pin: PinType) => {
    if (remainingPins === undefined) return true;
    return remainingPins.includes(pin);
  };

  return (
    <div className={className}>
      {pins.map((pin) => (
        <Pin
          key={pin}
          pinNumber={pin}
          selected={selectedPins.includes(pin)}
          hovered={hoveredPin === pin}
          onMouseEnter={() => onPinMouseEnter(pin)}
          onMouseLeave={onPinMouseLeave}
          onClick={() => onPinClick(pin)}
          onDoubleClick={() => onDoubleTapPin(pin)}
          onMouseDown={() => onPinMouseDown(pin)}
          onMouseUp={onPinMouseUp}
          disabled={disabled || !isStandingPin(pin)}
          isStanding={isStandingPin(pin)}
        />
      ))}
    </div>
  );
};