import { Frame } from "@/types/game";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface GameSummaryProps {
  frames: Frame[];
  gameId: string;
}

interface BallUsage {
  ball_name: string;
  shot_count: number;
}

export const GameSummary = ({ frames, gameId }: GameSummaryProps) => {
  const { data: ballUsage } = useQuery({
    queryKey: ['ballUsage', gameId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ball_usage')
        .select(`
          ball_id,
          bowling_balls (
            name
          )
        `)
        .eq('game_id', gameId)
        .not('ball_id', 'is', null); // Only include shots where a ball was actually used

      if (error) throw error;

      // Count shots per ball
      const ballCounts = data.reduce((acc: { [key: string]: BallUsage }, curr) => {
        const ballName = curr.bowling_balls.name;
        if (!acc[ballName]) {
          acc[ballName] = { ball_name: ballName, shot_count: 0 };
        }
        acc[ballName].shot_count++;
        return acc;
      }, {});

      return Object.values(ballCounts);
    },
    enabled: !!gameId
  });

  const stats = frames.reduce((acc, frame, index) => {
    // Count strikes
    if (frame.isStrike) {
      acc.strikes++;
      acc.currentStrikes++;
      acc.maxConsecutiveStrikes = Math.max(acc.maxConsecutiveStrikes, acc.currentStrikes);
      
      // For 10th frame, count additional strikes
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

    // Count spares
    if (frame.isSpare) {
      acc.spares++;
    }

    // Count open frames (no strike or spare)
    if (!frame.isStrike && !frame.isSpare && frame.secondShot !== null) {
      acc.openFrames++;
    }

    // Count splits
    if (frame.isSplit) {
      acc.splits++;
      if (frame.isSpare) {
        acc.splitsPicked++;
      }
    }

    return acc;
  }, {
    strikes: 0,
    spares: 0,
    openFrames: 0,
    splits: 0,
    splitsPicked: 0,
    currentStrikes: 0,
    maxConsecutiveStrikes: 0
  });

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4">Game Summary</h3>
        <div className="space-y-2">
          {stats.strikes > 0 && (
            <p>Number of Strikes: {stats.strikes}</p>
          )}
          {stats.maxConsecutiveStrikes > 0 && (
            <p>Most Consecutive Strikes: {stats.maxConsecutiveStrikes}</p>
          )}
          {stats.spares > 0 && (
            <p>Number of Spares Made: {stats.spares}</p>
          )}
          {stats.openFrames > 0 && (
            <p>Number of Open Frames: {stats.openFrames}</p>
          )}
          {stats.splits > 0 && (
            <p>Number of Splits Left: {stats.splits}</p>
          )}
          {stats.splitsPicked > 0 && (
            <p>Number of Splits Made: {stats.splitsPicked}</p>
          )}

          {ballUsage && ballUsage.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Balls Used:</h4>
              {ballUsage.map((ball) => (
                <p key={ball.ball_name}>
                  {ball.ball_name} - {ball.shot_count} shots
                </p>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};