import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
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

  const handleStartGame = async () => {
    if (!locationId || !laneNumber) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user?.id) {
      toast({
        title: "Error",
        description: "Please sign in to start a game",
        variant: "destructive",
      });
      return;
    }

    const secondLaneNumber = laneConfig === 'cross' ? getSecondLaneNumber(Number(laneNumber)) : null;

    const gameData = {
      user_id: userData.user.id,
      game_type: gameType,
      location_id: locationId,
      lane_number: laneNumber,
      second_lane_number: secondLaneNumber,
      lane_config: laneConfig,
      league_id: gameType === 'league' && leagueId ? leagueId : null,
      game_start_time: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('games')
      .insert([gameData])
      .select()
      .single();

    if (error) {
      console.error('Game creation error:', error);
      toast({
        title: "Error",
        description: "Failed to create game",
        variant: "destructive",
      });
      return;
    }

    navigate(`/new-game?gameId=${data.id}`);
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