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
    laneNumber?: number;
    secondLaneNumber?: number;
    laneConfig?: 'single' | 'cross';
  }>({});

  useEffect(() => {
    const fetchGameInfo = async () => {
      if (!gameId) return;

      try {
        const { data: gameData, error: gameError } = await supabase
          .from('games')
          .select(`
            game_type,
            session_id,
            league_id,
            tournament_id,
            lane_number,
            second_lane_number,
            lane_config,
            leagues (name),
            tournaments (name)
          `)
          .eq('id', gameId)
          .single();

        if (gameError) throw gameError;

        if (gameData) {
          // If we have a session ID, get the game number within the session
          let gameNumber;
          if (gameData.session_id) {
            const { data: sessionGames, error: sessionError } = await supabase
              .from('games')
              .select('id, created_at')
              .eq('session_id', gameData.session_id)
              .order('created_at', { ascending: true });

            if (sessionError) throw sessionError;

            if (sessionGames) {
              gameNumber = sessionGames.findIndex(game => game.id === gameId) + 1;
              console.log('Game number in session:', gameNumber);
            }
          }

          setGameInfo({
            gameNumber,
            gameType: gameData.game_type,
            leagueName: gameData.leagues?.name,
            tournamentName: gameData.tournaments?.name,
            sessionId: gameData.session_id,
            laneNumber: gameData.lane_number,
            secondLaneNumber: gameData.second_lane_number,
            laneConfig: gameData.lane_config,
          });
        }
      } catch (error) {
        console.error('Error fetching game info:', error);
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

  const getCurrentLane = () => {
    if (!gameInfo.laneNumber) return null;
    if (gameInfo.laneConfig !== 'cross') return gameInfo.laneNumber;
    
    // Don't alternate lanes in 10th frame
    if (currentFrame === 10) return gameInfo.laneNumber;
    
    // For cross lane bowling, alternate between lanes based on frame number
    return currentFrame % 2 === 1 ? gameInfo.laneNumber : gameInfo.secondLaneNumber;
  };

  const laneNumber = getCurrentLane();

  return (
    <div className="text-center space-y-1 text-gray-600">
      {gameInfo.gameNumber && gameInfo.sessionId && (
        <p className="text-sm font-medium">Game {gameInfo.gameNumber} of Session</p>
      )}
      <p className="font-medium">Frame {displayFrame}</p>
      <p className="text-sm">{getShotText(currentShot)}</p>
      <p className="text-sm italic">{getSessionText()}</p>
      {laneNumber && (
        <p className="text-sm font-medium">Lane {laneNumber}</p>
      )}
    </div>
  );
};