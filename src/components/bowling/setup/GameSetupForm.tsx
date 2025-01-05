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
import { MapPin, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

type GameType = 'practice' | 'league' | 'tournament';
type LaneConfig = 'single' | 'cross';

interface Location {
  id: string;
  name: string;
}

interface League {
  id: string;
  name: string;
  location_id: string;
}

interface Tournament {
  id: string;
  name: string;
  location_id: string;
}

export const GameSetupForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [gameType, setGameType] = useState<GameType>('practice');
  const [locationId, setLocationId] = useState<string>('');
  const [newLocationName, setNewLocationName] = useState('');
  const [showNewLocation, setShowNewLocation] = useState(false);
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
      return data as Location[];
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
      return data as League[];
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
      return data as Tournament[];
    },
    enabled: gameType === 'tournament',
  });

  const handleAddLocation = async () => {
    if (!newLocationName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a location name",
        variant: "destructive",
      });
      return;
    }

    const { data, error } = await supabase
      .from('bowling_locations')
      .insert([{ name: newLocationName }])
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
    setShowNewLocation(false);
    setNewLocationName('');
    toast({
      title: "Success",
      description: "Location added successfully",
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

    if (laneConfig === 'cross' && !secondLaneNumber) {
      toast({
        title: "Error",
        description: "Please enter both lane numbers for cross-lane bowling",
        variant: "destructive",
      });
      return;
    }

    const gameData = {
      game_type: gameType,
      location_id: locationId,
      lane_number: laneNumber,
      second_lane_number: laneConfig === 'cross' ? secondLaneNumber : null,
      lane_config: laneConfig,
      league_id: gameType === 'league' ? leagueId : null,
      tournament_id: gameType === 'tournament' ? tournamentId : null,
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
          <Select value={gameType} onValueChange={(value: GameType) => {
            setGameType(value);
            setLaneConfig(value === 'practice' ? 'single' : 'cross');
          }}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="practice">Practice</SelectItem>
              <SelectItem value="league">League</SelectItem>
              <SelectItem value="tournament">Tournament</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {!showNewLocation ? (
          <div className="space-y-2">
            <Label>Location</Label>
            <div className="flex gap-2">
              <Select value={locationId} onValueChange={setLocationId}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select a location" />
                </SelectTrigger>
                <SelectContent>
                  {locations?.map((location) => (
                    <SelectItem key={location.id} value={location.id}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowNewLocation(true)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <Label>New Location Name</Label>
            <div className="flex gap-2">
              <Input
                value={newLocationName}
                onChange={(e) => setNewLocationName(e.target.value)}
                placeholder="Enter location name"
              />
              <Button onClick={handleAddLocation}>
                Add
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowNewLocation(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {gameType === 'league' && (
          <div className="space-y-2">
            <Label>League</Label>
            <Select value={leagueId} onValueChange={setLeagueId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a league" />
              </SelectTrigger>
              <SelectContent>
                {leagues?.map((league) => (
                  <SelectItem key={league.id} value={league.id}>
                    {league.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {gameType === 'tournament' && (
          <div className="space-y-2">
            <Label>Tournament</Label>
            <Select value={tournamentId} onValueChange={setTournamentId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a tournament" />
              </SelectTrigger>
              <SelectContent>
                {tournaments?.map((tournament) => (
                  <SelectItem key={tournament.id} value={tournament.id}>
                    {tournament.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-2">
          <Label>Lane Configuration</Label>
          <Select value={laneConfig} onValueChange={(value: LaneConfig) => setLaneConfig(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
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
              value={laneNumber}
              onChange={(e) => setLaneNumber(parseInt(e.target.value) || '')}
              placeholder="Enter lane number"
            />
          </div>

          {laneConfig === 'cross' && (
            <div className="space-y-2">
              <Label>Second Lane Number</Label>
              <Input
                type="number"
                value={secondLaneNumber}
                onChange={(e) => setSecondLaneNumber(parseInt(e.target.value) || '')}
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