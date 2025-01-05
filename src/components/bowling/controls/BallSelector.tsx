import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface BallSelectorProps {
  onBallSelect: (ballId: string | null) => void;
  selectedBallId: string | null;
}

export const BallSelector = ({
  onBallSelect,
  selectedBallId,
}: BallSelectorProps) => {
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

  return (
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
  );
};