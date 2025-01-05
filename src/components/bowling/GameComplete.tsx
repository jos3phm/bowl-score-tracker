import { useGameCompletion } from "@/hooks/bowling/useGameCompletion";
import { GameCompleteForm } from "./GameCompleteForm";
import { Frame } from "@/types/game";

interface GameCompleteProps {
  totalScore: number;
  onNewGame: () => void;
}

export const GameComplete = ({ totalScore, onNewGame }: GameCompleteProps) => {
  const {
    notes,
    setNotes,
    photo,
    handlePhotoChange,
    isSaving,
    handleSaveGame
  } = useGameCompletion([]);  // Pass empty array as we already have the total score

  return (
    <div className="space-y-6 p-4 bg-white rounded-lg shadow">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Game Complete!</h2>
        <p className="text-lg">Final Score: {totalScore}</p>
      </div>

      <GameCompleteForm
        notes={notes}
        onNotesChange={setNotes}
        onPhotoChange={handlePhotoChange}
        onSave={handleSaveGame}
        onNewGame={onNewGame}
        isSaving={isSaving}
        photo={photo}
      />
    </div>
  );
};