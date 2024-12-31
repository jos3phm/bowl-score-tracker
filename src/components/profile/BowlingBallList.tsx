import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

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
    name: "",
    weight: "",
    notes: "",
    brand: "",
    hook_rating: "",
  });

  const handleAddBall = async () => {
    if (!newBall.name) {
      toast({
        title: "Name required",
        description: "Please enter a name for your bowling ball.",
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
        name: newBall.name,
        weight,
        notes: newBall.notes || null,
        brand: newBall.brand || null,
        hook_rating,
      });
      setNewBall({ name: "", weight: "", notes: "", brand: "", hook_rating: "" });
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
            <Input
              placeholder="Ball Name"
              value={newBall.name}
              onChange={(e) => setNewBall(prev => ({ ...prev, name: e.target.value }))}
            />
            <Input
              placeholder="Brand"
              value={newBall.brand}
              onChange={(e) => setNewBall(prev => ({ ...prev, brand: e.target.value }))}
            />
            <Input
              type="number"
              step="0.1"
              placeholder="Weight (8-16 lbs)"
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