import { useGameCompletion } from "@/hooks/bowling/useGameCompletion";
import { GameCompleteForm } from "./GameCompleteForm";
import { GameSummary } from "./GameSummary";
import { Frame } from "@/types/game";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { GameCompleteButtons } from "./GameCompleteButtons";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

interface GameCompleteProps {
  totalScore: number;
  onNewGame: () => void;
  frames: Frame[];
  gameId: string;
}

interface SeriesGame {
  id: string;
  total_score: number;
}

export const GameComplete = ({ totalScore, onNewGame, frames, gameId }: GameCompleteProps) => {
  const [sessionGames, setSessionGames] = useState<SeriesGame[]>([]);
  const [isLastGameInSeries, setIsLastGameInSeries] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    notes,
    setNotes,
    photo,
    handlePhotoChange,
    isSaving,
    handleSaveGame
  } = useGameCompletion(frames, gameId); // Pass gameId to useGameCompletion

  useEffect(() => {
    const fetchSessionData = async () => {
      const { data: gameData } = await supabase
        .from('games')
        .select('session_id')
        .eq('id', gameId)
        .single();

      if (gameData?.session_id) {
        setSessionId(gameData.session_id);
        
        const { data: sessionGames } = await supabase
          .from('games')
          .select('id, total_score')
          .eq('session_id', gameData.session_id)
          .order('created_at', { ascending: true });

        if (sessionGames) {
          setSessionGames(sessionGames);
          
          const { data: sessionData } = await supabase
            .from('game_sessions')
            .select('leagues(games_per_series)')
            .eq('id', gameData.session_id)
            .single();

          const gamesPerSeries = sessionData?.leagues?.games_per_series || 3;
          setIsLastGameInSeries(sessionGames.length >= gamesPerSeries);
        }
      }
    };

    fetchSessionData();
  }, [gameId]);

  const handleEndSession = async () => {
    if (!sessionId) return;

    await handleSaveGame();
    await supabase
      .from('game_sessions')
      .update({ ended_at: new Date().toISOString() })
      .eq('id', sessionId);

    navigate('/');
  };

  const handleNextGame = async () => {
    try {
      // Save the current game first
      await handleSaveGame();

      // Create a new game in the same session
      if (sessionId) {
        const { data: newGame, error } = await supabase
          .from('games')
          .insert([{
            session_id: sessionId,
            game_type: 'practice',
            user_id: (await supabase.auth.getUser()).data.user?.id
          }])
          .select()
          .single();

        if (error) throw error;
        if (!newGame?.id) throw new Error('No game ID returned from creation');

        // Show success message
        toast({
          title: "Success",
          description: "Game saved successfully!",
        });

        // Navigate to the new game
        navigate(`/new-game?gameId=${newGame.id}`);
      }
    } catch (error) {
      console.error('Error starting next game:', error);
      toast({
        title: "Error",
        description: "Failed to start next game. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDiscardGame = async () => {
    if (!sessionId) {
      navigate('/');
      return;
    }

    const { data: sessionGames } = await supabase
      .from('games')
      .select('id')
      .eq('session_id', sessionId);

    // If this is the only game in the session, end the session
    if (sessionGames && sessionGames.length <= 1) {
      await supabase
        .from('game_sessions')
        .update({ ended_at: new Date().toISOString() })
        .eq('id', sessionId);
    }

    // Delete the current game
    await supabase
      .from('games')
      .delete()
      .eq('id', gameId);

    navigate('/');
  };

  const calculateSeriesAverage = () => {
    if (sessionGames.length === 0) return 0;
    const total = sessionGames.reduce((sum, game) => sum + (game.total_score || 0), 0);
    return Math.round(total / sessionGames.length);
  };

  return (
    <div className="space-y-6 p-4 bg-white rounded-lg shadow">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Game Complete!</h2>
        <p className="text-lg">Final Score: {totalScore}</p>
      </div>

      <GameSummary frames={frames} gameId={gameId} />

      {sessionGames.length > 1 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Series Summary</h3>
          <div className="space-y-2">
            {sessionGames.map((game, index) => (
              <div key={game.id} className="flex justify-between">
                <span>Game {index + 1}:</span>
                <span>{game.total_score}</span>
              </div>
            ))}
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-semibold">
                <span>Series Average:</span>
                <span>{calculateSeriesAverage()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <GameCompleteForm
        notes={notes}
        onNotesChange={setNotes}
        onPhotoChange={handlePhotoChange}
        onSave={handleSaveGame}
        onNewGame={onNewGame}
        isSaving={isSaving}
        photo={photo}
      />

      <GameCompleteButtons
        isLastGameInSeries={isLastGameInSeries}
        onNextGame={handleNextGame}
        onDiscardGame={() => setShowDiscardDialog(true)}
        onEndSession={handleEndSession}
      />

      <AlertDialog open={showDiscardDialog} onOpenChange={setShowDiscardDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your game and all its data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDiscardGame} className="bg-destructive text-destructive-foreground">
              Yes, discard game
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
