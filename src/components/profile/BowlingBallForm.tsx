import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { BrandInput } from "./bowling-form/BrandInput";
import { BallNameInput } from "./bowling-form/BallNameInput";
import { validateBowlingBall } from "./bowling-form/formValidation";

type BowlingBall = {
  id: string;
  name: string;
  weight: number | null;
  notes: string | null;
  brand: string | null;
  hook_rating: number | null;
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
  });

  const handleAddBall = async () => {
    const errors = validateBowlingBall(newBall);
    
    if (Object.keys(errors).length > 0) {
      const firstError = Object.values(errors)[0];
      toast({
        title: "Validation Error",
        description: firstError,
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