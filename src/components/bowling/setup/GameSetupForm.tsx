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

        <LocationForm
          locations={locations || []}
          locationId={locationId}
          setLocationId={setLocationId}
          showNewLocation={showNewLocation}
          setShowNewLocation={setShowNewLocation}
          onAddLocation={handleAddLocation}
        />

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
            step="1"
            value={laneNumber}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              setLaneNumber(isNaN(value) ? '' : value);
            }}
            placeholder="Enter lane number"
          />
          {laneConfig === 'cross' && laneNumber && (
            <div className="text-sm text-muted-foreground">
              Paired with Lane {getSecondLaneNumber(laneNumber)}
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