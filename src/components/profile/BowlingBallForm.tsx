import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { BrandInput } from "./bowling-form/BrandInput";
import { BallNameInput } from "./bowling-form/BallNameInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type BowlingBall = {
  id: string;
  name: string;
  weight: number | null;
  notes: string | null;
  brand: string | null;
  hook_rating: number | null;
  is_spare_ball: boolean; // Added this line
};

interface BowlingBallFormProps {
  onAdd: (ball: Omit<BowlingBall, 'id'>) => Promise<void>;
  brandSuggestions: string[];
  nameSuggestions: string[];
  onBrandSearch: (value: string) => void;
  onNameSearch: (value: string) => void;
}

export const BowlingBallForm = ({ 
  onAdd, 
  brandSuggestions, 
  nameSuggestions, 
  onBrandSearch,
  onNameSearch 
}: BowlingBallFormProps) => {
  const { toast } = useToast();
  const [addingBall, setAddingBall] = useState(false);
  const [newBall, setNewBall] = useState({
    brand: "",
    name: "",
    weight: "",
    hook_rating: "",
    notes: "",
    is_spare_ball: false, // Added this line
  });

  const handleAddBall = async () => {
    if (!newBall.brand) {
      toast({
        title: "Validation Error",
        description: "Brand is required",
        variant: "destructive",
      });
      return;
    }

    if (!newBall.name) {
      toast({
        title: "Validation Error",
        description: "Ball name is required",
        variant: "destructive",
      });
      return;
    }

    if (!newBall.weight) {
      toast({
        title: "Validation Error",
        description: "Weight is required",
        variant: "destructive",
      });
      return;
    }

    if (newBall.hook_rating && (parseInt(newBall.hook_rating) < 0 || parseInt(newBall.hook_rating) > 10)) {
      toast({
        title: "Validation Error",
        description: "Hook rating must be between 0 and 10",
        variant: "destructive",
      });
      return;
    }

    setAddingBall(true);
    try {
      await onAdd({
        brand: newBall.brand,
        name: newBall.name,
        weight: newBall.weight ? parseFloat(newBall.weight) : null,
        notes: newBall.notes || null,
        hook_rating: newBall.hook_rating ? parseInt(newBall.hook_rating) : null,
        is_spare_ball: false, // Default to false when adding a new ball
      });
      setNewBall({ brand: "", name: "", weight: "", notes: "", hook_rating: "", is_spare_ball: false });
      toast({
        title: "Bowling ball added",
        description: "Your bowling ball has been added successfully.",
      });
    } finally {
      setAddingBall(false);
    }
  };

  const weights = Array.from({ length: 9 }, (_, i) => (i + 8).toString());

  return (
    <div className="space-y-4 pt-4 border-t">
      <h4 className="font-medium">Add New Ball</h4>
      <div className="space-y-2">
        <BrandInput
          value={newBall.brand}
          onChange={(value) => setNewBall(prev => ({ ...prev, brand: value }))}
          onSearch={onBrandSearch}
          suggestions={brandSuggestions}
        />

        <BallNameInput
          value={newBall.name}
          onChange={(value) => setNewBall(prev => ({ ...prev, name: value }))}
          onSearch={onNameSearch}
          suggestions={nameSuggestions}
        />

        <Select
          value={newBall.weight}
          onValueChange={(value) => setNewBall(prev => ({ ...prev, weight: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select weight (lbs)" />
          </SelectTrigger>
          <SelectContent>
            {weights.map((weight) => (
              <SelectItem key={weight} value={weight}>
                {weight} lbs
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          type="number"
          placeholder="Hook Rating (0-10)"
          value={newBall.hook_rating}
          onChange={(e) => setNewBall(prev => ({ ...prev, hook_rating: e.target.value }))}
        />

        <Input
          placeholder="Additional notes (optional)"
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
  );
};