import { useState } from "react";
import { PinDiagram } from "@/components/bowling/PinDiagram";
import { ScoreCard } from "@/components/bowling/ScoreCard";
import { GameControls } from "@/components/bowling/GameControls";
import type { Frame, Pin, Game } from "@/types/game";

const Index = () => {
  const [currentFrame, setCurrentFrame] = useState(1);
  const [currentShot, setCurrentShot] = useState<1 | 2 | 3>(1);
  const [selectedPins, setSelectedPins] = useState<Pin[]>([]);
  const [frames, setFrames] = useState<Frame[]>(
    Array(10).fill({
      firstShot: null,
      secondShot: null,
      thirdShot: null,
      score: 0,
      isStrike: false,
      isSpare: false,
    })
  );

  const handlePinSelect = (pins: Pin[]) => {
    setSelectedPins(pins);
  };

  const handleStrike = () => {
    if (currentFrame > 10) return;

    const newFrames = [...frames];
    const allPins: Pin[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    
    newFrames[currentFrame - 1] = {
      ...newFrames[currentFrame - 1],
      firstShot: allPins,
      secondShot: null,
      isStrike: true,
      score: calculateScore(newFrames, currentFrame - 1),
    };

    setFrames(newFrames);
    if (currentFrame < 10) {
      setCurrentFrame(currentFrame + 1);
      setCurrentShot(1);
    } else if (currentFrame === 10) {
      setCurrentShot(2);
    }
    setSelectedPins([]);
  };

  const handleSpare = () => {
    if (currentFrame > 10 || currentShot !== 2) return;

    const newFrames = [...frames];
    const remainingPins: Pin[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter(
      pin => !newFrames[currentFrame - 1].firstShot?.includes(pin)
    );

    newFrames[currentFrame - 1] = {
      ...newFrames[currentFrame - 1],
      secondShot: remainingPins,
      isSpare: true,
      score: calculateScore(newFrames, currentFrame - 1),
    };

    setFrames(newFrames);
    if (currentFrame < 10) {
      setCurrentFrame(currentFrame + 1);
      setCurrentShot(1);
    } else {
      setCurrentShot(3);
    }
    setSelectedPins([]);
  };

  const handleClear = () => {
    setSelectedPins([]);
  };

  const calculateScore = (frames: Frame[], frameIndex: number): number => {
    // This is a simplified scoring calculation
    // You'll need to implement the full bowling scoring rules
    let score = 0;
    for (let i = 0; i <= frameIndex; i++) {
      const frame = frames[i];
      if (frame.isStrike) {
        score += 10;
      } else if (frame.isSpare) {
        score += 10;
      } else {
        score += (frame.firstShot?.length || 0) + (frame.secondShot?.length || 0);
      }
    }
    return score;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-8">
          <h1 className="text-3xl font-bold text-center text-gray-800">
            Bowling Scorecard
          </h1>
          
          <ScoreCard
            frames={frames}
            currentFrame={currentFrame}
          />
          
          <div className="space-y-6">
            <PinDiagram
              onPinSelect={handlePinSelect}
              selectedPins={selectedPins}
              disabled={currentFrame > 10}
            />
            
            <GameControls
              onStrike={handleStrike}
              onSpare={handleSpare}
              onClear={handleClear}
              disabled={currentFrame > 10}
            />
          </div>
          
          <div className="text-center text-gray-600">
            Frame {currentFrame} • Shot {currentShot}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;