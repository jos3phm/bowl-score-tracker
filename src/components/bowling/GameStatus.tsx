import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface GameStatusProps {
  currentFrame: number;
  currentShot: 1 | 2 | 3;
  gameId: string;
}

export const GameStatus = ({ currentFrame, currentShot, gameId }: GameStatusProps) => {
  const [gameInfo, setGameInfo] = useState<{
    gameNumber?: number;
    gameType?: string;
    leagueName?: string;
    tournamentName?: string;
    sessionId?: string;
  }>({});

  useEffect(() => {
    const fetchGameInfo = async () => {
      if (!gameId) return;

      const { data: gameData } = await supabase
        .from('games')
        .select(`
          game_type,
          session_id,
          league_id,
          tournament_id,
          leagues (name),
          tournaments (name)
        `)
        .eq('id', gameId)
        .single();

      if (gameData) {
        // If we have a session ID, get the game number within the session
        let gameNumber;
        if (gameData.session_id) {
          const { data: sessionGames } = await supabase
            .from('games')
            .select('id')
            .eq('session_id', gameData.session_id)
            .order('created_at', { ascending: true });

          if (sessionGames) {
            gameNumber = sessionGames.findIndex(game => game.id === gameId) + 1;
          }
        }

        setGameInfo({
          gameNumber,
          gameType: gameData.game_type,
          leagueName: gameData.leagues?.name,
          tournamentName: gameData.tournaments?.name,
          sessionId: gameData.session_id,
        });
      }
    };

    fetchGameInfo();
  }, [gameId]);

  const displayFrame = currentFrame > 10 ? 10 : currentFrame;
  
  const getShotText = (shot: 1 | 2 | 3) => {
    switch (shot) {
      case 1: return "First Shot";
      case 2: return "Second Shot";
      case 3: return "Third Shot";
      default: return `Shot ${shot}`;
    }
  };

  const getSessionText = () => {
    if (gameInfo.leagueName) return gameInfo.leagueName;
    if (gameInfo.tournamentName) return gameInfo.tournamentName;
    return "Practice Session";
  };

  return (
    <div className="text-center space-y-1 text-gray-600">
      {gameInfo.gameNumber && gameInfo.sessionId && (
        <p className="text-sm">Game {gameInfo.gameNumber}</p>
      )}
      <p className="font-medium">Frame {displayFrame}</p>
      <p className="text-sm">{getShotText(currentShot)}</p>
      <p className="text-sm italic">{getSessionText()}</p>
    </div>
  );
};