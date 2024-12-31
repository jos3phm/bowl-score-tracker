import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface GameCompleteProps {
  totalScore: number;
  onNewGame: () => void;
}

export const GameComplete = ({ totalScore, onNewGame }: GameCompleteProps) => {
  const [notes, setNotes] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleSaveGame = async () => {
    try {
      setIsSaving(true);
      let photoUrl = null;

      if (photo) {
        const fileExt = photo.name.split('.').pop();
        const filePath = `${crypto.randomUUID()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('game-photos')
          .upload(filePath, photo);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('game-photos')
          .getPublicUrl(filePath);
          
        photoUrl = publicUrl;
      }

      const { error: saveError } = await supabase
        .from('games')
        .insert({
          total_score: totalScore,
          notes,
          photo_url: photoUrl,
        });

      if (saveError) throw saveError;

      toast({
        title: "Game saved successfully!",
        description: "Starting a new game...",
      });

      onNewGame();
    } catch (error) {
      console.error('Error saving game:', error);
      toast({
        title: "Error saving game",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 p-4 bg-white rounded-lg shadow">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Game Complete!</h2>
        <p className="text-lg">Final Score: {totalScore}</p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="notes" className="block text-sm font-medium mb-2">
            Game Notes
          </label>
          <Textarea
            id="notes"
            placeholder="Add any notes about your game..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[100px]"
          />
        </div>

        <div>
          <label htmlFor="photo" className="block text-sm font-medium mb-2">
            Attach Photo
          </label>
          <Input
            id="photo"
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
          />
          {photo && (
            <p className="text-sm text-gray-500 mt-1">
              Selected: {photo.name}
            </p>
          )}
        </div>

        <div className="flex gap-4 justify-center">
          <Button
            onClick={handleSaveGame}
            disabled={isSaving}
            className="bg-primary"
          >
            {isSaving ? "Saving..." : "Save Game"}
          </Button>
          <Button
            onClick={onNewGame}
            variant="outline"
          >
            Start New Game
          </Button>
        </div>
      </div>
    </div>
  );
};