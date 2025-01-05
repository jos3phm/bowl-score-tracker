import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { LocationForm } from "./LocationForm";
import { LeagueForm } from "./LeagueForm";

type GameType = 'practice' | 'league' | 'tournament';
type LaneConfig = 'single' | 'cross';

export const GameSetupForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [gameType, setGameType] = useState<GameType>('practice');
  const [locationId, setLocationId] = useState<string>('');
  const [showNewLocation, setShowNewLocation] = useState(false);
  const [showNewLeague, setShowNewLeague] = useState(false);
  const [laneNumber, setLaneNumber] = useState<number | ''>('');
  const [secondLaneNumber, setSecondLaneNumber] = useState<number | ''>('');
  const [laneConfig, setLaneConfig] = useState<LaneConfig>('single');
  const [leagueId, setLeagueId] = useState<string>('');
  const [tournamentId, setTournamentId] = useState<string>('');

  // Fetch locations
  const { data: locations } = useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bowling_locations')
        .select('id, name')
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

  // Fetch tournaments
  const { data: tournaments } = useQuery({
    queryKey: ['tournaments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tournaments')
        .select('id, name, location_id');
      
      if (error) throw error;
      return data;
    },
    enabled: gameType === 'tournament',
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
      tournament_id: gameType === 'tournament' ? tournamentId : null,
      game_start_time: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('games')
      .insert(gameData)
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

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>New Game Setup</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Game Type</Label>
          <Select 
            value={gameType} 
            onValueChange={(value: GameType) => {
              setGameType(value);
              setLaneConfig(value === 'practice' ? 'single' : 'cross');
            }}
          >
            <SelectTrigger className="bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="practice">Practice</SelectItem>
              <SelectItem value="league">League</SelectItem>
              <SelectItem value="tournament">Tournament</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {gameType === 'league' && (
          <LeagueForm
            leagues={leagues || []}
            leagueId={leagueId}
            setLeagueId={setLeagueId}
            showNewLeague={showNewLeague}
            setShowNewLeague={setShowNewLeague}
            onAddLeague={handleAddLeague}
          />
        )}

        <LocationForm
          locations={locations || []}
          locationId={locationId}
          setLocationId={setLocationId}
          showNewLocation={showNewLocation}
          setShowNewLocation={setShowNewLocation}
          onAddLocation={handleAddLocation}
        />

        <div className="space-y-2">
          <Label>Lane Configuration</Label>
          <Select value={laneConfig} onValueChange={(value: LaneConfig) => setLaneConfig(value)}>
            <SelectTrigger className="bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="single">Single Lane</SelectItem>
              <SelectItem value="cross">Cross Lane</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Lane Number</Label>
            <Input
              type="number"
              min="1"
              step="1"
              value={laneNumber}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                setLaneNumber(isNaN(value) ? '' : value);
              }}
              placeholder="Enter lane number"
            />
          </div>

          {laneConfig === 'cross' && (
            <div className="space-y-2">
              <Label>Second Lane Number</Label>
              <Input
                type="number"
                min="1"
                step="1"
                value={secondLaneNumber}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  setSecondLaneNumber(isNaN(value) ? '' : value);
                }}
                placeholder="Enter second lane number"
              />
            </div>
          )}
        </div>

        <Button className="w-full" onClick={handleStartGame}>
          Start Game
        </Button>
      </CardContent>
    </Card>
  );
};