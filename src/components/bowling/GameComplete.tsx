import { useGameCompletion } from "@/hooks/bowling/useGameCompletion";
import { GameCompleteForm } from "./GameCompleteForm";
import { GameSummary } from "./GameSummary";
import { Frame } from "@/types/game";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

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

  const {
    notes,
    setNotes,
    photo,
    handlePhotoChange,
    isSaving,
    handleSaveGame
  } = useGameCompletion([]);

  useEffect(() => {
    const fetchSessionData = async () => {
      // First get the session ID for this game
      const { data: gameData } = await supabase
        .from('games')
        .select('session_id')
        .eq('id', gameId)
        .single();

      if (gameData?.session_id) {
        setSessionId(gameData.session_id);
        
        // Then get all games in this session
        const { data: sessionGames } = await supabase
          .from('games')
          .select('id, total_score')
          .eq('session_id', gameData.session_id)
          .order('created_at', { ascending: true });

        if (sessionGames) {
          setSessionGames(sessionGames);
          
          // Get session details to check if we've reached the games limit
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

    await supabase
      .from('game_sessions')
      .update({ ended_at: new Date().toISOString() })
      .eq('id', sessionId);

    window.location.href = '/';
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

      <div className="flex justify-center gap-4">
        {!isLastGameInSeries && (
          <Button onClick={onNewGame} variant="default">
            Next Game
          </Button>
        )}
        {(isLastGameInSeries || sessionGames.length > 0) && (
          <Button onClick={handleEndSession} variant="secondary">
            End Session
          </Button>
        )}
      </div>
    </div>
  );
};