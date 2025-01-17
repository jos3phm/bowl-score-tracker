import { useEffect, useState } from "react";
import { Frame } from "@/types/game";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ScoreCard } from "./ScoreCard";

interface GameSummary {
  strikes: number;
  spares: number;
  openFrames: number;
  maxConsecutiveStrikes: number;
  currentStrikes: number;
}

interface BallUsage {
  name: string;
  shots: number;
}

interface GameSummaryProps {
  frames: Frame[];
  gameId: string;
}

export const GameSummary = ({ frames, gameId }: GameSummaryProps) => {
  const [ballUsage, setBallUsage] = useState<BallUsage[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBallUsage = async () => {
      if (!gameId) {
        console.error('No gameId provided to GameSummary');
        toast({
          title: "Error",
          description: "Could not load game summary: Invalid game ID",
          variant: "destructive",
        });
        return;
      }

      try {
        console.log('Fetching ball usage for game:', gameId);
        const { data, error } = await supabase
          .from('ball_usage')
          .select(`
            ball_id,
            bowling_balls (
              name
            )
          `)
          .eq('game_id', gameId)
          .not('ball_id', 'is', null)
          .not('bowling_balls.name', 'is', null);

        if (error) throw error;

        // Process the ball usage data
        const usageMap = new Map<string, number>();
        
        // Only count balls that were actually used (have valid records)
        data.forEach((usage) => {
          if (usage.bowling_balls?.name) {
            const currentCount = usageMap.get(usage.bowling_balls.name) || 0;
            usageMap.set(usage.bowling_balls.name, currentCount + 1);
          }
        });

        // Convert to array and filter out any balls with 0 shots
        const processedUsage = Array.from(usageMap.entries())
          .map(([name, shots]) => ({
            name,
            shots,
          }))
          .filter(ball => ball.shots > 0);

        setBallUsage(processedUsage);
      } catch (error) {
        console.error('Error fetching ball usage:', error);
        toast({
          title: "Error",
          description: "Failed to load ball usage data",
          variant: "destructive",
        });
      }
    };

    fetchBallUsage();
  }, [gameId, toast]);

  const summary = frames.reduce<GameSummary>((acc, frame, index) => {
    if (frame.isStrike) {
      acc.strikes++;
      acc.currentStrikes++;
      acc.maxConsecutiveStrikes = Math.max(acc.maxConsecutiveStrikes, acc.currentStrikes);
      
      if (index === 9) {
        if (frame.secondShot?.length === 10) {
          acc.strikes++;
          acc.currentStrikes++;
          acc.maxConsecutiveStrikes = Math.max(acc.maxConsecutiveStrikes, acc.currentStrikes);
        }
        if (frame.thirdShot?.length === 10) {
          acc.strikes++;
          acc.currentStrikes++;
          acc.maxConsecutiveStrikes = Math.max(acc.maxConsecutiveStrikes, acc.currentStrikes);
        }
      }
    } else {
      acc.currentStrikes = 0;
    }

    if (frame.isSpare) {
      acc.spares++;
    }

    if (!frame.isStrike && !frame.isSpare) {
      acc.openFrames++;
    }

    return acc;
  }, {
    strikes: 0,
    spares: 0,
    openFrames: 0,
    maxConsecutiveStrikes: 0,
    currentStrikes: 0,
  });

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <ScoreCard 
          frames={frames} 
          currentFrame={11} 
          isInteractive={false}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Game Summary</h3>
        <div className="grid grid-cols-2 gap-2">
          <div>Number of Strikes:</div>
          <div>{summary.strikes}</div>
          {summary.spares > 0 && (
            <>
              <div>Number of Spares:</div>
              <div>{summary.spares}</div>
            </>
          )}
          {summary.openFrames > 0 && (
            <>
              <div>Open Frames:</div>
              <div>{summary.openFrames}</div>
            </>
          )}
          <div>Most Consecutive Strikes:</div>
          <div>{summary.maxConsecutiveStrikes}</div>
        </div>
      </div>

      {ballUsage.length > 0 && (
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Balls Used:</h4>
          <ul className="space-y-1">
            {ballUsage.map((ball) => (
              <li key={ball.name} className="flex justify-between">
                <span>{ball.name}</span>
                <span>{ball.shots} shots</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};