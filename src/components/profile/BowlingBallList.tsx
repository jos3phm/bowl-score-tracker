import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

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
  const { toast } = useToast();
  const [addingBall, setAddingBall] = useState(false);
  const [newBall, setNewBall] = useState({
    brand: "",
    name: "",
    weight: "",
    hook_rating: "",
    notes: "",
  });
  const [brandSuggestions, setBrandSuggestions] = useState<string[]>([]);
  const [nameSuggestions, setNameSuggestions] = useState<string[]>([]);
  const [brandOpen, setBrandOpen] = useState(false);
  const [nameOpen, setNameOpen] = useState(false);

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

  const handleAddBall = async () => {
    if (!newBall.brand) {
      toast({
        title: "Brand required",
        description: "Please enter a brand for your bowling ball.",
        variant: "destructive",
      });
      return;
    }

    if (!newBall.name) {
      toast({
        title: "Name required",
        description: "Please enter a name for your bowling ball.",
        variant: "destructive",
      });
      return;
    }

    if (!newBall.weight) {
      toast({
        title: "Weight required",
        description: "Please enter a weight for your bowling ball.",
        variant: "destructive",
      });
      return;
    }

    const weight = newBall.weight ? parseFloat(newBall.weight) : null;
    const hook_rating = newBall.hook_rating ? parseInt(newBall.hook_rating) : null;

    if (weight && (weight < 8 || weight > 16)) {
      toast({
        title: "Invalid weight",
        description: "Weight must be between 8 and 16 pounds.",
        variant: "destructive",
      });
      return;
    }

    if (hook_rating && (hook_rating < 0 || hook_rating > 10)) {
      toast({
        title: "Invalid hook rating",
        description: "Hook rating must be between 0 and 10.",
        variant: "destructive",
      });
      return;
    }

    setAddingBall(true);
    try {
      await onAdd({
        brand: newBall.brand,
        name: newBall.name,
        weight,
        notes: newBall.notes || null,
        hook_rating,
      });
      setNewBall({ brand: "", name: "", weight: "", notes: "", hook_rating: "" });
      toast({
        title: "Bowling ball added",
        description: "Your bowling ball has been added successfully.",
      });
    } finally {
      setAddingBall(false);
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
            <div key={ball.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <h4 className="font-medium">{ball.name}</h4>
                <div className="text-sm text-gray-500 space-y-1">
                  {ball.brand && <p>Brand: {ball.brand}</p>}
                  {ball.weight && <p>Weight: {ball.weight} lbs</p>}
                  {ball.hook_rating !== null && <p>Hook Rating: {ball.hook_rating}/10</p>}
                  {ball.notes && <p>Notes: {ball.notes}</p>}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(ball.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="space-y-4 pt-4 border-t">
          <h4 className="font-medium">Add New Ball</h4>
          <div className="space-y-2">
            <Popover open={brandOpen} onOpenChange={setBrandOpen}>
              <PopoverTrigger asChild>
                <Input
                  placeholder="Brand *"
                  value={newBall.brand}
                  onChange={(e) => {
                    setNewBall(prev => ({ ...prev, brand: e.target.value }));
                    fetchSuggestions('brand', e.target.value);
                  }}
                />
              </PopoverTrigger>
              {brandSuggestions.length > 0 && (
                <PopoverContent className="p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search brands..." />
                    <CommandEmpty>No brand found.</CommandEmpty>
                    <CommandGroup>
                      {brandSuggestions.map((brand) => (
                        <CommandItem
                          key={brand}
                          onSelect={() => {
                            setNewBall(prev => ({ ...prev, brand }));
                            setBrandOpen(false);
                          }}
                        >
                          {brand}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              )}
            </Popover>

            <Popover open={nameOpen} onOpenChange={setNameOpen}>
              <PopoverTrigger asChild>
                <Input
                  placeholder="Ball Name *"
                  value={newBall.name}
                  onChange={(e) => {
                    setNewBall(prev => ({ ...prev, name: e.target.value }));
                    fetchSuggestions('name', e.target.value);
                  }}
                />
              </PopoverTrigger>
              {nameSuggestions.length > 0 && (
                <PopoverContent className="p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search ball names..." />
                    <CommandEmpty>No ball name found.</CommandEmpty>
                    <CommandGroup>
                      {nameSuggestions.map((name) => (
                        <CommandItem
                          key={name}
                          onSelect={() => {
                            setNewBall(prev => ({ ...prev, name }));
                            setNameOpen(false);
                          }}
                        >
                          {name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              )}
            </Popover>

            <Input
              type="number"
              step="0.1"
              placeholder="Weight (8-16 lbs) *"
              value={newBall.weight}
              onChange={(e) => setNewBall(prev => ({ ...prev, weight: e.target.value }))}
            />
            <Input
              type="number"
              placeholder="Hook Rating (0-10)"
              value={newBall.hook_rating}
              onChange={(e) => setNewBall(prev => ({ ...prev, hook_rating: e.target.value }))}
            />
            <Input
              placeholder="Notes (optional)"
              value={newBall.notes}
              onChange={(e) => setNewBall(prev => ({ ...prev, notes: e.target.value }))}
            />
            <Button 
              className="w-full" 
              onClick={handleAddBall}
              disabled={addingBall}
            >
              {addingBall ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Ball
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};