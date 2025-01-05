import { Pin } from "@/types/game";
import { PinDiagram } from "./PinDiagram";
import { GameControls } from "./GameControls";
import { GameStatus } from "./GameStatus";
import { ScoreCard } from "./ScoreCard";
import { Frame } from "@/types/game";

interface GameContentProps {
  frames: Frame[];
  currentFrame: number;
  currentShot: 1 | 2 | 3;
  handleStrike: () => void;
  handleSpare: () => void;
  handlePinClick: (pins: Pin[]) => void;
  handleClear: () => void;
  isStrike: boolean;
  calculateTotalScore: () => number;
  handleNewGame: () => void;
  handleSaveGame: () => Promise<void>;
  isSaving: boolean;
  selectedBallId: string | null;
  handleBallSelect: (ballId: string | null) => void;
}

export const GameContent = ({
  frames,
  currentFrame,
  currentShot,
  handleStrike,
  handleSpare,
  handlePinClick,
  handleClear,
  isStrike,
  calculateTotalScore,
  handleNewGame,
  handleSaveGame,
  isSaving,
  selectedBallId,
  handleBallSelect,
}: GameContentProps) => {
  const [selectedPins, setSelectedPins] = useState<Pin[]>([]);

  const handleRegularShot = () => {
    if (selectedPins.length > 0) {
      handlePinClick(selectedPins);
      setSelectedPins([]);
    }
  };

  return (
    <div className="space-y-6">
      <ScoreCard
        frames={frames}
        currentFrame={currentFrame}
        onFrameClick={() => {}}
        selectedFrame={null}
      />
      
      <PinDiagram
        onPinSelect={setSelectedPins}
        selectedPins={selectedPins}
        disabled={currentFrame > 10}
        onRegularShot={handleRegularShot}
      />
      
      <GameControls
        onStrike={handleStrike}
        onSpare={handleSpare}
        onRegularShot={handleRegularShot}
        onMiss={() => handlePinClick([])}
        onClear={handleClear}
        disabled={currentFrame > 10}
        currentFrame={currentFrame}
        currentShot={currentShot}
        isFirstShotStrike={isStrike}
        selectedPins={selectedPins}
        onBallSelect={handleBallSelect}
        selectedBallId={selectedBallId}
      />
      
      <GameStatus
        currentFrame={currentFrame}
        currentShot={currentShot}
      />
    </div>
  );
};