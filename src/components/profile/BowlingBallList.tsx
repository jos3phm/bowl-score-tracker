import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { BowlingBallItem } from "./BowlingBallItem";
import { BowlingBallForm, BowlingBall } from "./BowlingBallForm";
import { useToast } from "@/components/ui/use-toast";

interface BowlingBallListProps {
  bowlingBalls: BowlingBall[];
  onDelete: (id: string) => Promise<void>;
  onAdd: (ball: Omit<BowlingBall, 'id'>) => Promise<void>;
}

export const BowlingBallList = ({ bowlingBalls, onDelete, onAdd }: BowlingBallListProps) => {
  const { toast } = useToast();
  const [brandSuggestions, setBrandSuggestions] = useState<string[]>([]);
  const [nameSuggestions, setNameSuggestions] = useState<string[]>([]);

  const fetchSuggestions = async (field: 'brand' | 'name', value: string) => {
    if (!value) {
      if (field === 'brand') {
        setBrandSuggestions([]);
      } else {
        setNameSuggestions([]);
      }
      return;
    }
    
    const { data, error } = await supabase
      .from('bowling_balls')
      .select(field)
      .ilike(field, `${value}%`)
      .limit(5);

    if (error) {
      console.error(`Error fetching ${field} suggestions:`, error);
      if (field === 'brand') {
        setBrandSuggestions([]);
      } else {
        setNameSuggestions([]);
      }
      return;
    }

    const uniqueValues = Array.from(new Set(data.map(item => item[field])))
      .filter((item): item is string => item !== null);

    if (field === 'brand') {
      setBrandSuggestions(uniqueValues);
    } else {
      setNameSuggestions(uniqueValues);
    }
  };

  const handleAdd = async (ball: Omit<BowlingBall, 'id'>) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('No session found');
    }
    
    const ballWithUserId = {
      ...ball,
      user_id: session.user.id
    };
    
    await onAdd(ballWithUserId);
  };

  const handleToggleSpare = async (id: string, isSpare: boolean) => {
    try {
      // First, if we're setting a new spare ball, unset any existing spare ball
      if (isSpare) {
        const { error: unsetError } = await supabase
          .from('bowling_balls')
          .update({ is_spare_ball: false })
          .eq('is_spare_ball', true);

        if (unsetError) {
          console.error('Error unsetting previous spare ball:', unsetError);
          toast({
            title: "Error updating ball",
            description: unsetError.message,
            variant: "destructive",
          });
          return;
        }
      }

      // Then update the selected ball
      const { error } = await supabase
        .from('bowling_balls')
        .update({ is_spare_ball: isSpare })
        .eq('id', id);

      if (error) {
        toast({
          title: "Error updating ball",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      // Refresh the list by refetching the data
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: updatedBalls } = await supabase
        .from('bowling_balls')
        .select('*')
        .eq('user_id', session.user.id);

      if (updatedBalls) {
        toast({
          title: isSpare ? "Spare ball set" : "Spare ball unset",
          description: isSpare ? "This ball has been set as your spare ball" : "This ball is no longer your spare ball",
        });
      }
    } catch (error) {
      console.error('Error in handleToggleSpare:', error);
      toast({
        title: "Error",
        description: "An error occurred while updating the spare ball status",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Bowling Balls</CardTitle>
        <CardDescription>Manage your bowling ball collection</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          {bowlingBalls.map((ball) => (
            <BowlingBallItem 
              key={ball.id} 
              ball={ball} 
              onDelete={onDelete}
              onToggleSpare={handleToggleSpare}
            />
          ))}
        </div>

        <BowlingBallForm
          onAdd={handleAdd}
          brandSuggestions={brandSuggestions}
          nameSuggestions={nameSuggestions}
          onBrandSearch={(value) => fetchSuggestions('brand', value)}
          onNameSearch={(value) => fetchSuggestions('name', value)}
        />
      </CardContent>
    </Card>
  );
};