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
  const [laneConfig, setLaneConfig] = useState<LaneConfig>('single');
  const [leagueId, setLeagueId] = useState<string>('');

  const getSecondLaneNumber = (lane: number) => {
    // For odd numbers, add 1; for even numbers, subtract 1
    return lane % 2 === 1 ? lane + 1 : lane - 1;
  };

  // Fetch locations
  const { data: locations } = useQuery({
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
  const { data: leagues } = useQuery({
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

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user?.id) {
      toast({
        title: "Error",
        description: "Please sign in to create a league",
        variant: "destructive",
      });
      return;
    }

    const { data, error } = await supabase
      .from('leagues')
      .insert([{ 
        name,
        location_id: locationId,
        is_active: true,
        created_by: userData.user.id
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