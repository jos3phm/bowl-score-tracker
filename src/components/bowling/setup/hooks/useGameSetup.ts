import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export type GameType = 'practice' | 'league' | 'tournament';
export type LaneConfig = 'single' | 'cross';

export const useGameSetup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [gameType, setGameType] = useState<GameType>('practice');
  const [locationId, setLocationId] = useState<string>('');
  const [showNewLocation, setShowNewLocation] = useState(false);
  const [showNewLeague, setShowNewLeague] = useState(false);
  const [laneNumber, setLaneNumber] = useState<number | ''>('');
  const [secondLaneNumber, setSecondLaneNumber] = useState<number | ''>('');
  const [laneConfig, setLaneConfig] = useState<LaneConfig>('single');
  const [leagueId, setLeagueId] = useState<string>('');

  // Fetch locations
  const { data: locations, isLoading: isLoadingLocations } = useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bowling_locations')
        .select('id, name, address, city, state')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch leagues
  const { data: leagues, isLoading: isLoadingLeagues } = useQuery({
    queryKey: ['leagues'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leagues')
        .select('id, name, location_id')
        .eq('is_active', true);
      
      if (error) throw error;
      return data;
    },
    enabled: gameType === 'league',
  });

  const handleAddLocation = async (locationData: {
    name: string;
    address?: string;
    city?: string;
    state?: string;
  }) => {
    const { data, error } = await supabase
      .from('bowling_locations')
      .insert([locationData])
      .select()
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add location",
        variant: "destructive",
      });
      return;
    }

    setLocationId(data.id);
    await queryClient.invalidateQueries({ queryKey: ['locations'] });
    toast({
      title: "Success",
      description: "Location added successfully",
    });
  };

  const handleAddLeague = async (name: string) => {
    if (!locationId) {
      toast({
        title: "Error",
        description: "Please select a location first",
        variant: "destructive",
      });
      return;
    }

    const { data, error } = await supabase
      .from('leagues')
      .insert([{ 
        name,
        location_id: locationId,
        is_active: true
      }])
      .select()
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add league",
        variant: "destructive",
      });
      return;
    }

    setLeagueId(data.id);
    await queryClient.invalidateQueries({ queryKey: ['leagues'] });
    toast({
      title: "Success",
      description: "League added successfully",
    });
  };

  const handleStartGame = async () => {
    if (!locationId || !laneNumber || (laneConfig === 'cross' && !secondLaneNumber)) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      toast({
        title: "Error",
        description: "Please sign in to start a game",
        variant: "destructive",
      });
      return;
    }

    const gameData = {
      user_id: userData.user.id,
      game_type: gameType,
      location_id: locationId,
      lane_number: laneNumber,
      second_lane_number: laneConfig === 'cross' ? Number(secondLaneNumber) : null,
      lane_config: laneConfig,
      league_id: gameType === 'league' ? leagueId : null,
      game_start_time: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('games')
      .insert([gameData])
      .select()
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create game",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem('currentGameId', data.id);
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
    secondLaneNumber,
    setSecondLaneNumber,
    laneConfig,
    setLaneConfig,
    leagueId,
    setLeagueId,
    locations,
    leagues,
    isLoadingLocations,
    isLoadingLeagues,
    handleAddLocation,
    handleAddLeague,
    handleStartGame,
  };
};