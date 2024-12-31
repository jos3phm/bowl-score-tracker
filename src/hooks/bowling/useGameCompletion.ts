import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useGameCompletion = (totalScore: number, onNewGame: () => void) => {
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

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error saving game",
          description: "You must be logged in to save games",
          variant: "destructive",
        });
        return;
      }

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
          user_id: user.id,
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

  return {
    notes,
    setNotes,
    photo,
    handlePhotoChange,
    isSaving,
    handleSaveGame
  };
};