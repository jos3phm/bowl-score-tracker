import { cn } from "@/lib/utils";
import { Pin as PinType } from "@/types/game";

export interface PinProps {
  pinNumber: PinType;
  selected: boolean;
  hovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
  onDoubleClick: () => void;
  onMouseDown: () => void;
  onMouseUp: () => void;
  disabled: boolean;
  isStanding: boolean;
}

export const Pin = ({
  pinNumber,
  selected,
  hovered,
  onMouseEnter,
  onMouseLeave,
  onClick,
  onDoubleClick,
  onMouseDown,
  onMouseUp,
  disabled,
  isStanding,
}: PinProps) => {
  return (
    <button
      className={cn(
        "w-10 h-10 rounded-full border-2 transition-colors",
        "flex items-center justify-center text-sm font-medium",
        {
          "border-gray-300 bg-white text-gray-700": !selected && !disabled && isStanding,
          "border-blue-500 bg-blue-100 text-blue-700": selected && !disabled,
          "border-gray-200 bg-gray-100 text-gray-400": disabled || !isStanding,
          "border-blue-300 bg-blue-50": hovered && !disabled && isStanding,
        }
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      disabled={disabled}
    >
      {pinNumber}
    </button>
  );
};