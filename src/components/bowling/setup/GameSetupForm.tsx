import { useEffect, useState } from "react";
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
import { Button } from "@/components/ui/button";
import { LocationForm } from "./LocationForm";
import { LeagueForm } from "./LeagueForm";
import { useGameSetup } from "./hooks/useGameSetup";
import { LaneConfig } from "@/types/game";
import { BallSelector } from "../controls/BallSelector";

export const GameSetupForm = () => {
  const {
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
  } = useGameSetup();

  const [selectedBallId, setSelectedBallId] = useState<string | null>(null);

  // Set lane config to cross when game type changes to league
  useEffect(() => {
    if (gameType === 'league') {
      setLaneConfig('cross');
    }
  }, [gameType, setLaneConfig]);

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
            onValueChange={(value: any) => {
              setGameType(value);
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

        {(gameType !== 'practice' || locationId) && (
          <LocationForm
            locations={locations || []}
            locationId={locationId}
            setLocationId={setLocationId}
            showNewLocation={showNewLocation}
            setShowNewLocation={setShowNewLocation}
            onAddLocation={handleAddLocation}
            isOptional={gameType === 'practice'}
          />
        )}

        {gameType === 'league' && (
          <LeagueForm
            leagues={leagues?.filter(league => league.location_id === locationId) || []}
            leagueId={leagueId}
            setLeagueId={setLeagueId}
            showNewLeague={showNewLeague}
            setShowNewLeague={setShowNewLeague}
            onAddLeague={handleAddLeague}
            locationId={locationId}
          />
        )}

        <div className="space-y-2">
          <Label>Starting Ball</Label>
          <BallSelector
            onBallSelect={setSelectedBallId}
            selectedBallId={selectedBallId}
          />
        </div>

        <div className="space-y-2">
          <Label>Lane Configuration</Label>
          <Select value={laneConfig} onValueChange={(value: LaneConfig) => setLaneConfig(value)}>
            <SelectTrigger className="bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="single">Single Lane</SelectItem>
              <SelectItem value="cross">Cross Lane (alternating lanes)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>
            {laneConfig === 'single' ? 'Lane Number' : 'Starting Lane Number'}
          </Label>
          <Input
            type="number"
            min="1"
            max="120"
            step="1"
            value={laneNumber}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (isNaN(value) || value < 1) {
                setLaneNumber('');
              } else if (value > 120) {
                setLaneNumber(120);
              } else {
                setLaneNumber(value);
              }
            }}
            placeholder="Enter lane number"
          />
          {laneConfig === 'cross' && laneNumber && (
            <div className="text-sm text-muted-foreground">
              Paired with Lane {getSecondLaneNumber(laneNumber)}
            </div>
          )}
        </div>

        <Button 
          className="w-full" 
          onClick={() => handleStartGame(selectedBallId)}
          disabled={gameType !== 'practice' && !locationId}
        >
          Start Game
        </Button>
      </CardContent>
    </Card>
  );
};