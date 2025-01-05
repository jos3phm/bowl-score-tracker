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
    secondLaneNumber,
    setSecondLaneNumber,
    laneConfig,
    setLaneConfig,
    leagueId,
    setLeagueId,
    locations,
    leagues,
    handleAddLocation,
    handleAddLeague,
    handleStartGame,
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
          <Select value={laneConfig} onValueChange={(value: any) => setLaneConfig(value)}>
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