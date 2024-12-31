import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { BowlingBallItem } from "./BowlingBallItem";
import { BowlingBallForm, BowlingBall } from "./BowlingBallForm";

interface BowlingBallListProps {
  bowlingBalls: BowlingBall[];
  onDelete: (id: string) => Promise<void>;
  onAdd: (ball: Omit<BowlingBall, 'id'>) => Promise<void>;
}

export const BowlingBallList = ({ bowlingBalls, onDelete, onAdd }: BowlingBallListProps) => {
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