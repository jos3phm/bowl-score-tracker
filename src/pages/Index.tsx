import { useState } from "react";
import { PinDiagram } from "@/components/bowling/PinDiagram";
import { ScoreCard } from "@/components/bowling/ScoreCard";
import { GameControls } from "@/components/bowling/GameControls";
import { GameStatus } from "@/components/bowling/GameStatus";
import { calculateFrameScore } from "@/utils/bowling-score";
import type { Frame, Pin } from "@/types/game";

const Index = () => {
  const [currentFrame, setCurrentFrame] = useState(1);
  const [currentShot, setCurrentShot] = useState<1 | 2 | 3>(1);
  const [selectedPins, setSelectedPins] = useState<Pin[]>([]);
  const [frames, setFrames] = useState<Frame[]>(
    Array(10).fill({}).map(() => ({
      firstShot: null,
      secondShot: null,
      thirdShot: null,
      score: null,
      isStrike: false,
      isSpare: false,
    }))
  );

  const isGameComplete = () => {
    const tenthFrame = frames[9];
    if (!tenthFrame.firstShot) return false;
    
    if (tenthFrame.isStrike) {
      return tenthFrame.secondShot !== null && tenthFrame.thirdShot !== null;
    } else if (tenthFrame.isSpare) {
      return tenthFrame.thirdShot !== null;
    } else {
      return tenthFrame.secondShot !== null;
    }
  };

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
    };

    // Recalculate scores for all frames
    for (let i = 0; i <= currentFrame - 1; i++) {
      newFrames[i].score = calculateFrameScore(newFrames, i);
    }

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
    const allPins: Pin[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const remainingPins = allPins.filter(
      (pin) => !newFrames[currentFrame - 1].firstShot?.includes(pin)
    );

    newFrames[currentFrame - 1] = {
      ...newFrames[currentFrame - 1],
      secondShot: remainingPins,
      isSpare: true,
    };

    // Recalculate scores for all frames
    for (let i = 0; i <= currentFrame - 1; i++) {
      newFrames[i].score = calculateFrameScore(newFrames, i);
    }

    setFrames(newFrames);
    if (currentFrame < 10) {
      setCurrentFrame(currentFrame + 1);
      setCurrentShot(1);
    } else {
      setCurrentShot(3);
    }
    setSelectedPins([]);
  };

  const handleRegularShot = () => {
    if (currentFrame > 10 || selectedPins.length === 0 || isGameComplete()) return;

    const isStrike = currentShot === 1 && selectedPins.length === 10;

    if (isStrike) {
      handleStrike();
      return;
    }

    const newFrames = [...frames].map((frame, index) => {
      if (index === currentFrame - 1) {
        const updatedFrame = { ...frame };
        
        if (currentShot === 1) {
          updatedFrame.firstShot = selectedPins;
          updatedFrame.isStrike = false;
          updatedFrame.isSpare = false;
        } else if (currentShot === 2) {
          updatedFrame.secondShot = selectedPins;
          const totalPins = (updatedFrame.firstShot?.length || 0) + selectedPins.length;
          updatedFrame.isSpare = totalPins === 10 && !updatedFrame.isStrike;
        } else if (currentFrame === 10 && currentShot === 3) {
          updatedFrame.thirdShot = selectedPins;
        }
        
        return updatedFrame;
      }
      return frame;
    });

    // Recalculate scores for all frames
    for (let i = 0; i <= currentFrame - 1; i++) {
      newFrames[i].score = calculateFrameScore(newFrames, i);
    }

    setFrames(newFrames);
    
    if (currentShot === 1) {
      setCurrentShot(2);
    } else if (currentShot === 2) {
      if (currentFrame < 10) {
        setCurrentFrame(currentFrame + 1);
        setCurrentShot(1);
      } else if (currentFrame === 10) {
        const frame = newFrames[9];
        if (frame.isStrike || frame.isSpare) {
          setCurrentShot(3);
        } else {
          setCurrentFrame(11); // End game
        }
      }
    } else if (currentFrame === 10 && currentShot === 3) {
      setCurrentFrame(11); // End game
    }
    
    setSelectedPins([]);
  };

  const handleClear = () => {
    setSelectedPins([]);
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
              disabled={currentFrame > 10 || isGameComplete()}
            />
            
            <GameControls
              onStrike={handleStrike}
              onSpare={handleSpare}
              onRegularShot={handleRegularShot}
              onClear={handleClear}
              disabled={currentFrame > 10 || isGameComplete()}
            />
          </div>
          
          <GameStatus
            currentFrame={currentFrame}
            currentShot={currentShot}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
