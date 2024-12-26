import { useState } from "react";
import { PinDiagram } from "@/components/bowling/PinDiagram";
import { ScoreCard } from "@/components/bowling/ScoreCard";
import { GameControls } from "@/components/bowling/GameControls";
import type { Frame, Pin } from "@/types/game";

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
    const allPins: Pin[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const remainingPins = allPins.filter(
      (pin) => !newFrames[currentFrame - 1].firstShot?.includes(pin)
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

  const handleRegularShot = () => {
    if (currentFrame > 10 || selectedPins.length === 0) return;

    // Check if it's a strike on the first shot (all pins selected)
    const allPins: Pin[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const isStrike = currentShot === 1 && selectedPins.length === 10;

    if (isStrike) {
      handleStrike();
      return;
    }

    // First create the new frame data without the score
    const newFrames = frames.map((frame, index) => {
      if (index === currentFrame - 1) {
        const updatedFrame = { ...frame };
        
        if (currentShot === 1) {
          updatedFrame.firstShot = selectedPins;
          updatedFrame.isStrike = false;
          updatedFrame.isSpare = false;
        } else if (currentShot === 2) {
          updatedFrame.secondShot = selectedPins;
          updatedFrame.isSpare = false;
        } else if (currentFrame === 10 && currentShot === 3) {
          updatedFrame.thirdShot = selectedPins;
        }
        
        return updatedFrame;
      }
      return frame;
    });

    // Now calculate and update the score
    newFrames[currentFrame - 1].score = calculateScore(newFrames, currentFrame - 1);

    setFrames(newFrames);
    
    if (currentShot === 1) {
      setCurrentShot(2);
    } else if (currentShot === 2) {
      if (currentFrame < 10) {
        setCurrentFrame(currentFrame + 1);
        setCurrentShot(1);
      } else {
        setCurrentShot(3);
      }
    } else if (currentFrame === 10 && currentShot === 3) {
      setCurrentFrame(11); // End game
    }
    
    setSelectedPins([]);
  };

  const handleClear = () => {
    setSelectedPins([]);
  };

  const calculateScore = (frames: Frame[], frameIndex: number): number => {
    let score = 0;
    
    for (let i = 0; i <= frameIndex; i++) {
      const frame = frames[i];
      const nextFrame = i < 9 ? frames[i + 1] : null;
      const followingFrame = i < 8 ? frames[i + 2] : null;

      if (frame.isStrike) {
        score += 10;
        
        // For a strike, we need the next two shots
        if (nextFrame?.isStrike) {
          // Next frame is also a strike
          score += 10;
          
          if (i < 8 && followingFrame?.isStrike) {
            // Third consecutive strike
            score += 10;
          } else if (i < 8 && followingFrame?.firstShot) {
            // Following frame's first shot
            score += followingFrame.firstShot.length;
          } else if (i === 8 && nextFrame.secondShot) {
            // Special case for 9th frame
            score += nextFrame.secondShot.length;
          } else {
            // Not enough information yet
            return 0;
          }
        } else if (nextFrame?.firstShot && nextFrame?.secondShot) {
          // Next frame is complete
          score += nextFrame.firstShot.length + nextFrame.secondShot.length;
        } else {
          // Not enough information yet
          return 0;
        }
      } else if (frame.isSpare) {
        score += 10;
        if (nextFrame?.firstShot) {
          score += nextFrame.firstShot.length;
        } else {
          return 0;
        }
      } else {
        // Open frame
        if (frame.firstShot && frame.secondShot) {
          score += frame.firstShot.length + frame.secondShot.length;
        } else {
          return 0;
        }
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
              onRegularShot={handleRegularShot}
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
