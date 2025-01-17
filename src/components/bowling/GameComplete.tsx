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
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    notes,
    setNotes,
    photo,
    handlePhotoChange,
    isSaving,
    handleSaveGame
  } = useGameCompletion(frames, gameId);

  useEffect(() => {
    let isMounted = true;

    const fetchSessionData = async () => {
      try {
        const { data: gameData, error: gameError } = await supabase
          .from('games')
          .select('session_id, user_id')
          .eq('id', gameId)
          .maybeSingle();

        if (!isMounted) return;
        if (gameError) throw gameError;
        
        // If no session_id, create a new session
        if (!gameData?.session_id) {
          const { data: userData } = await supabase.auth.getUser();
          const userId = userData.user?.id;
          
          if (!userId) {
            toast({
              title: "Error",
              description: "User not authenticated",
              variant: "destructive",
            });
            return;
          }

          const { data: newSession, error: sessionError } = await supabase
            .from('game_sessions')
            .insert([{ user_id: userId }])
            .select()
            .single();

          if (sessionError) throw sessionError;

          // Update game with new session_id
          const { error: updateError } = await supabase
            .from('games')
            .update({ session_id: newSession.id })
            .eq('id', gameId);

          if (updateError) throw updateError;

          if (isMounted) {
            setCurrentSessionId(newSession.id);
          }
        } else if (isMounted) {
          setCurrentSessionId(gameData.session_id);
        }
      } catch (error) {
        console.error('Error fetching session data:', error);
        if (isMounted) {
          toast({
            title: "Error",
            description: "Failed to fetch session data. Please try again.",
            variant: "destructive",
          });
        }
      }
    };

    fetchSessionData();

    return () => {
      isMounted = false;
    };
  }, [gameId, toast]);

  // Fetch session games whenever currentSessionId changes
  useEffect(() => {
    let isMounted = true;

    const fetchSessionGames = async () => {
      if (!currentSessionId) return;

      try {
        const { data: sessionGames, error: sessionError } = await supabase
          .from('games')
          .select('id, total_score')
          .eq('session_id', currentSessionId)
          .order('created_at', { ascending: true });

        if (!isMounted) return;
        if (sessionError) throw sessionError;

        if (sessionGames) {
          setSessionGames(sessionGames);
          
          const { data: sessionData, error: sessionDataError } = await supabase
            .from('game_sessions')
            .select('leagues(games_per_series)')
            .eq('id', currentSessionId)
            .single();

          if (sessionDataError) throw sessionDataError;

          if (isMounted) {
            const gamesPerSeries = sessionData?.leagues?.games_per_series || 3;
            setIsLastGameInSeries(sessionGames.length >= gamesPerSeries);
          }
        }
      } catch (error) {
        console.error('Error fetching session games:', error);
        if (isMounted) {
          toast({
            title: "Error",
            description: "Failed to fetch session games. Please try again.",
            variant: "destructive",
          });
        }
      }
    };

    fetchSessionGames();

    return () => {
      isMounted = false;
    };
  }, [currentSessionId, toast]);

  const handleEndSession = async () => {
    if (!currentSessionId) {
      toast({
        title: "Error",
        description: "No session found for this game.",
        variant: "destructive",
      });
      return;
    }

    try {
      await handleSaveGame();

      // First, delete any incomplete games in the session
      const { error: deleteError } = await supabase
        .from('games')
        .delete()
        .eq('session_id', currentSessionId)
        .is('game_end_time', null);

      if (deleteError) throw deleteError;

      // Then end the session
      const { error: sessionError } = await supabase
        .from('game_sessions')
        .update({ ended_at: new Date().toISOString() })
        .eq('id', currentSessionId);

      if (sessionError) throw sessionError;

      toast({
        title: "Success",
        description: "Session ended successfully!",
      });

      // Force reload to ensure dashboard state is updated
      window.location.href = '/';
    } catch (error) {
      console.error('Error ending session:', error);
      toast({
        title: "Error",
        description: "Failed to end session. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleNextGame = async () => {
    if (!currentSessionId) {
      toast({
        title: "Error",
        description: "No session found for this game.",
        variant: "destructive",
      });
      return;
    }

    try {
      await handleSaveGame();

      const { data: newGame, error } = await supabase
        .from('games')
        .insert([{
          session_id: currentSessionId,
          game_type: 'practice',
          user_id: (await supabase.auth.getUser()).data.user?.id
        }])
        .select()
        .single();

      if (error) throw error;
      if (!newGame?.id) throw new Error('No game ID returned from creation');

      window.location.href = `/new-game?gameId=${newGame.id}`;
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
    if (!currentSessionId) {
      navigate('/');
      return;
    }

    try {
      const { data: sessionGames } = await supabase
        .from('games')
        .select('id')
        .eq('session_id', currentSessionId);

      // If this is the only game in the session, end the session
      if (sessionGames && sessionGames.length <= 1) {
        await supabase
          .from('game_sessions')
          .update({ ended_at: new Date().toISOString() })
          .eq('id', currentSessionId);
      }

      // Delete the current game
      await supabase
        .from('games')
        .delete()
        .eq('id', gameId);

      navigate('/');
    } catch (error) {
      console.error('Error discarding game:', error);
      toast({
        title: "Error",
        description: "Failed to discard game. Please try again.",
        variant: "destructive",
      });
    }
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