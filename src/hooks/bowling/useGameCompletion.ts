import { useState } from "react";
import { Frame } from "@/types/game";
import { supabase } from "@/integrations/supabase/client";

export const useGameCompletion = (totalScore: number, onNewGame: () => void) => {
  const [notes, setNotes] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleSaveGame = async () => {
    setIsSaving(true);
    try {
      let photoUrl = null;
      
      if (photo) {
        const fileExt = photo.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('game-photos')
          .upload(fileName, photo);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('game-photos')
          .getPublicUrl(fileName);

        photoUrl = publicUrl;
      }

      // Update game with notes and photo
      const { error: updateError } = await supabase
        .from('games')
        .update({
          notes,
          photo_url: photoUrl,
          total_score: totalScore,
          game_end_time: new Date().toISOString()
        })
        .eq('id', localStorage.getItem('currentGameId'));

      if (updateError) throw updateError;

      onNewGame();
    } catch (error) {
      console.error('Error saving game:', error);
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
    handleSaveGame,
  };
};