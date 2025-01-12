import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useLocations } from "./useLocations";
import { useLeagues } from "./useLeagues";
import { GameType, LaneConfig } from "@/types/game";
import { supabase } from "@/integrations/supabase/client";

export const useGameSetup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [gameType, setGameType] = useState<GameType>('practice');
  const [locationId, setLocationId] = useState<string>('');
  const [showNewLocation, setShowNewLocation] = useState(false);
  const [showNewLeague, setShowNewLeague] = useState(false);
  const [laneNumber, setLaneNumber] = useState<number | ''>('');
  const [laneConfig, setLaneConfig] = useState<LaneConfig>('single');
  const [leagueId, setLeagueId] = useState<string>('');

  const { locations, handleAddLocation } = useLocations();
  const { leagues, handleAddLeague: addLeague } = useLeagues(locationId);

  const getSecondLaneNumber = (lane: number) => {
    return lane % 2 === 1 ? lane + 1 : lane - 1;
  };

  const handleAddLeague = async (name: string) => {
    const league = await addLeague(name);
    if (league) {
      setLeagueId(league.id);
    }
  };

  const handleStartGame = async (selectedBallId: string | null) => {
    if (!locationId && gameType !== 'practice') {
      toast({
        title: "Error",
        description: "Please select a location",
        variant: "destructive",
      });
      return;
    }

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user?.id) {
      toast({
        title: "Error",
        description: "Please sign in to start a game",
        variant: "destructive",
      });
      return;
    }

    const secondLaneNumber = laneNumber && laneConfig === 'cross' ? getSecondLaneNumber(Number(laneNumber)) : null;

    try {
      // Create a new session first
      const { data: newSession, error: sessionError } = await supabase
        .from('game_sessions')
        .insert([{
          user_id: userData.user.id,
          location_id: locationId || null,
          league_id: gameType === 'league' ? leagueId : null
        }])
        .select()
        .single();

      if (sessionError) throw sessionError;

      // Then create the game
      const gameData = {
        user_id: userData.user.id,
        game_type: gameType,
        location_id: locationId || null,
        lane_number: laneNumber || null,
        second_lane_number: secondLaneNumber,
        lane_config: laneConfig,
        league_id: gameType === 'league' ? leagueId : null,
        game_start_time: new Date().toISOString(),
        session_id: newSession.id
      };

      const { data: newGame, error: gameError } = await supabase
        .from('games')
        .insert([gameData])
        .select()
        .single();

      if (gameError) throw gameError;

      // If a ball was selected, create the initial ball usage record
      if (selectedBallId && newGame) {
        const { error: ballUsageError } = await supabase
          .from('ball_usage')
          .insert([{
            game_id: newGame.id,
            ball_id: selectedBallId,
            frame_number: 1,
            shot_number: 1,
            remaining_pins: [1,2,3,4,5,6,7,8,9,10]
          }]);

        if (ballUsageError) {
          console.error('Error creating initial ball usage:', ballUsageError);
        }
      }

      navigate(`/new-game?gameId=${newGame.id}`);
    } catch (error) {
      console.error('Error starting game:', error);
      toast({
        title: "Error",
        description: "Failed to start game",
        variant: "destructive",
      });
    }
  };

  return {
    gameType,
    setGameType,
    locationId,
    setLocationId,
    showNewLocation,
    setShowNewLocation,
    showNewLeague,
    setShowNewLeague,
    laneNumber,
    setLaneNumber,
    laneConfig,
    setLaneConfig,
    leagueId,
    setLeagueId,
    locations,
    leagues,
    handleAddLocation,
    handleAddLeague,
    handleStartGame,
    getSecondLaneNumber,
  };
};
