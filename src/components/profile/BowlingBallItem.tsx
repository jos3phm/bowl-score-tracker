import { Button } from "@/components/ui/button";
import { Trash2, Star } from "lucide-react";

type BowlingBall = {
  id: string;
  name: string;
  weight: number | null;
  notes: string | null;
  brand: string | null;
  hook_rating: number | null;
  is_spare_ball: boolean;
};

interface BowlingBallItemProps {
  ball: BowlingBall;
  onDelete: (id: string) => Promise<void>;
  onToggleSpare: (id: string, isSpare: boolean) => Promise<void>;
}

export const BowlingBallItem = ({ ball, onDelete, onToggleSpare }: BowlingBallItemProps) => {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h4 className="font-medium">{ball.name}</h4>
          {ball.is_spare_ball && (
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              Spare Ball
            </span>
          )}
        </div>
        <div className="text-sm text-gray-500 space-y-1">
          {ball.brand && <p>Brand: {ball.brand}</p>}
          {ball.weight && <p>Weight: {ball.weight} lbs</p>}
          {ball.hook_rating !== null && <p>Hook Rating: {ball.hook_rating}/10</p>}
          {ball.notes && <p>Notes: {ball.notes}</p>}
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onToggleSpare(ball.id, !ball.is_spare_ball)}
          title={ball.is_spare_ball ? "Unset as spare ball" : "Set as spare ball"}
        >
          <Star className={`h-4 w-4 ${ball.is_spare_ball ? "fill-yellow-400" : ""}`} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(ball.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};