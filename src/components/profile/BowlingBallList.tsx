import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { BowlingBallItem } from "./BowlingBallItem";
import { BowlingBallForm } from "./BowlingBallForm";

type BowlingBall = {
  id: string;
  name: string;
  weight: number | null;
  notes: string | null;
  brand: string | null;
  hook_rating: number | null;
};

interface BowlingBallListProps {
  bowlingBalls: BowlingBall[];
  onDelete: (id: string) => Promise<void>;
  onAdd: (ball: Omit<BowlingBall, 'id'>) => Promise<void>;
}

export const BowlingBallList = ({ bowlingBalls, onDelete, onAdd }: BowlingBallListProps) => {
  const [brandSuggestions, setBrandSuggestions] = useState<string[]>([]);
  const [nameSuggestions, setNameSuggestions] = useState<string[]>([]);

  const fetchSuggestions = async (field: 'brand' | 'name', value: string) => {
    if (!value) return;
    
    const { data, error } = await supabase
      .from('bowling_balls')
      .select(field)
      .ilike(field, `${value}%`)
      .limit(5);

    if (error) {
      console.error(`Error fetching ${field} suggestions:`, error);
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
          onAdd={onAdd}
          brandSuggestions={brandSuggestions}
          nameSuggestions={nameSuggestions}
          onBrandSearch={(value) => fetchSuggestions('brand', value)}
          onNameSearch={(value) => fetchSuggestions('name', value)}
        />
      </CardContent>
    </Card>
  );
};