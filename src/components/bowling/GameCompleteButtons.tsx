import { Button } from "@/components/ui/button";

interface GameCompleteButtonsProps {
  isLastGameInSeries: boolean;
  onNextGame: () => void;
  onDiscardGame: () => void;
  onEndSession: () => void;
}

export const GameCompleteButtons = ({
  isLastGameInSeries,
  onNextGame,
  onDiscardGame,
  onEndSession,
}: GameCompleteButtonsProps) => {
  return (
    <div className="flex gap-4 justify-center">
      {!isLastGameInSeries && (
        <Button onClick={onNextGame} variant="default">
          Next Game
        </Button>
      )}
      <Button onClick={onDiscardGame} variant="destructive">
        Discard Game
      </Button>
      <Button onClick={onEndSession} variant="secondary">
        End Session
      </Button>
    </div>
  );
};