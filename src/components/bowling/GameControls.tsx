import { Button } from "@/components/ui/button";
import { Pin } from "@/types/game";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface GameControlsProps {
  onStrike: () => void;
  onSpare: () => void;
  onClear: () => void;
  onRegularShot: () => void;
  onMiss: () => void;
  disabled?: boolean;
  currentFrame: number;
  currentShot: 1 | 2 | 3;
  isFirstShotStrike?: boolean;
  selectedPins?: Pin[];
  onBallSelect: (ballId: string | null) => void;
  selectedBallId: string | null;
}

export const GameControls = ({
  onStrike,
  onSpare,
  onClear,
  onRegularShot,
  onMiss,
  disabled,
  currentFrame,
  currentShot,
  isFirstShotStrike = false,
  selectedPins = [],
  onBallSelect,
  selectedBallId,
}: GameControlsProps) => {
  const { data: bowlingBalls, isError } = useQuery({
    queryKey: ['bowlingBalls'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bowling_balls')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching bowling balls:', error);
        throw error;
      }
      return data;
    },
  });

  // Disable strike button on second shot unless it's the 10th frame with a first strike
  const isStrikeDisabled = disabled || 
    (currentShot === 2 && (currentFrame !== 10 || !isFirstShotStrike));

  // Disable spare button on first shot, and in 10th frame third shot if first two shots were strikes
  const isSpareDisabled = disabled || 
    currentShot === 1 || 
    (currentFrame === 10 && currentShot === 3 && isFirstShotStrike);

  // Disable regular shot button when all pins are selected on first shot
  const isRegularShotDisabled = disabled || 
    (currentShot === 1 && selectedPins.length === 10);

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <Select
          value={selectedBallId || undefined}
          onValueChange={(value) => onBallSelect(value)}
        >
          <SelectTrigger className="w-[200px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <SelectValue placeholder="Select ball" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
            {bowlingBalls?.map((ball) => (
              <SelectItem 
                key={ball.id} 
                value={ball.id}
                className="hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {ball.name} {ball.is_spare_ball ? "(Spare)" : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2 justify-center flex-wrap">
        <Button
          onClick={onStrike}
          disabled={isStrikeDisabled}
          className="bg-primary hover:bg-primary/90"
        >
          Strike
        </Button>
        <Button
          onClick={onSpare}
          disabled={isSpareDisabled}
          className="bg-secondary hover:bg-secondary/90"
        >
          Spare
        </Button>
        <Button
          onClick={onMiss}
          disabled={disabled}
          variant="destructive"
        >
          Miss
        </Button>
        <Button
          onClick={onRegularShot}
          disabled={isRegularShotDisabled}
          variant="default"
        >
          Record Shot
        </Button>
        <Button
          onClick={onClear}
          disabled={disabled}
          variant="outline"
        >
          Clear
        </Button>
      </div>
    </div>
  );
};