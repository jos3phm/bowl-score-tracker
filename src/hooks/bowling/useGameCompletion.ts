import { useState } from "react";
import { Frame } from "@/types/game";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useGameCompletion = (frames: Frame[], gameId: string) => {
  const [notes, setNotes] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const calculateTotalScore = () => {
    const lastFrame = frames[9];
    return lastFrame?.score || 0;
  };

  const handleNewGame = () => {
    window.location.reload();
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleSaveGame = async () => {
    if (!gameId) {
      toast({
        title: "Error",
        description: "No game ID found. Unable to save game.",
        variant: "destructive",
      });
      return;
    }

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

      const totalScore = calculateTotalScore();
      console.log('Saving game with ID:', gameId);

      const { error: updateError } = await supabase
        .from('games')
        .update({
          notes,
          photo_url: photoUrl,
          total_score: totalScore,
          game_end_time: new Date().toISOString()
        })
        .eq('id', gameId);

      if (updateError) {
        console.error('Error updating game:', updateError);
        throw updateError;
      }

      toast({
        title: "Success",
        description: "Game saved successfully!",
      });

    } catch (error) {
      console.error('Error saving game:', error);
      toast({
        title: "Error",
        description: "Failed to save game. Please try again.",
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
    handleSaveGame,
    calculateTotalScore,
    handleNewGame,
  };
};