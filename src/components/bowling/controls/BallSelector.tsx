import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { BowlingBallForm } from "@/components/profile/BowlingBallForm";
import { useToast } from "@/components/ui/use-toast";

interface BallSelectorProps {
  onBallSelect: (ballId: string | null) => void;
  selectedBallId: string | null;
  isOptional?: boolean;
}

export const BallSelector = ({
  onBallSelect,
  selectedBallId,
  isOptional = false,
}: BallSelectorProps) => {
  const { toast } = useToast();
  const [showNewBall, setShowNewBall] = useState(false);
  const [brandSuggestions, setBrandSuggestions] = useState<string[]>([]);
  const [nameSuggestions, setNameSuggestions] = useState<string[]>([]);

  const { data: bowlingBalls, isError, refetch } = useQuery({
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

  const handleAddBall = async (ball: any) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to add a bowling ball",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('bowling_balls')
        .insert([{ ...ball, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Bowling ball added successfully",
      });

      // Refetch the balls list and select the new ball
      await refetch();
      if (data) {
        onBallSelect(data.id);
      }
      setShowNewBall(false);
    } catch (error) {
      console.error('Error adding bowling ball:', error);
      toast({
        title: "Error",
        description: "Failed to add bowling ball",
        variant: "destructive",
      });
    }
  };

  const handleBrandSearch = async (value: string) => {
    const { data } = await supabase
      .from('bowling_balls')
      .select('brand')
      .ilike('brand', `%${value}%`)
      .limit(5);
    
    if (data) {
      const uniqueBrands = [...new Set(data.map(item => item.brand).filter(Boolean))];
      setBrandSuggestions(uniqueBrands);
    }
  };

  const handleNameSearch = async (value: string) => {
    const { data } = await supabase
      .from('bowling_balls')
      .select('name')
      .ilike('name', `%${value}%`)
      .limit(5);
    
    if (data) {
      const uniqueNames = [...new Set(data.map(item => item.name))];
      setNameSuggestions(uniqueNames);
    }
  };

  if (showNewBall) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="font-medium">Add New Ball</h4>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowNewBall(false)}
          >
            Cancel
          </Button>
        </div>
        <BowlingBallForm
          onAdd={handleAddBall}
          brandSuggestions={brandSuggestions}
          nameSuggestions={nameSuggestions}
          onBrandSearch={handleBrandSearch}
          onNameSearch={handleNameSearch}
        />
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Select
        value={selectedBallId || undefined}
        onValueChange={(value) => onBallSelect(value)}
      >
        <SelectTrigger className="flex-1 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <SelectValue placeholder={`Select ball${isOptional ? ' (optional)' : ''}`} />
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
      <Button
        variant="outline"
        size="icon"
        onClick={() => setShowNewBall(true)}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};