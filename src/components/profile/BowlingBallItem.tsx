import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

type BowlingBall = {
  id: string;
  name: string;
  weight: number | null;
  notes: string | null;
  brand: string | null;
  hook_rating: number | null;
};

interface BowlingBallItemProps {
  ball: BowlingBall;
  onDelete: (id: string) => Promise<void>;
}

export const BowlingBallItem = ({ ball, onDelete }: BowlingBallItemProps) => {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
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
  );
};