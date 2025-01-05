import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";

interface LeagueFormProps {
  leagues: Array<{ id: string; name: string }>;
  leagueId: string;
  setLeagueId: (id: string) => void;
  showNewLeague: boolean;
  setShowNewLeague: (show: boolean) => void;
  onAddLeague: (name: string) => Promise<void>;
  locationId: string;
}

export const LeagueForm = ({
  leagues,
  leagueId,
  setLeagueId,
  showNewLeague,
  setShowNewLeague,
  onAddLeague,
  locationId,
}: LeagueFormProps) => {
  const [newLeagueName, setNewLeagueName] = useState("");

  const handleAddLeague = async () => {
    if (!newLeagueName.trim() || !locationId) return;
    await onAddLeague(newLeagueName);
    setNewLeagueName("");
    setShowNewLeague(false);
  };

  if (!locationId) {
    return (
      <div className="space-y-2">
        <Label>League</Label>
        <div className="text-sm text-muted-foreground">
          Please select a location first
        </div>
      </div>
    );
  }

  if (showNewLeague) {
    return (
      <div className="space-y-4">
        <Label>New League Name</Label>
        <div className="flex gap-2">
          <Input
            value={newLeagueName}
            onChange={(e) => setNewLeagueName(e.target.value)}
            placeholder="Enter league name"
          />
          <Button onClick={handleAddLeague}>Add</Button>
          <Button
            variant="outline"
            onClick={() => setShowNewLeague(false)}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label>League</Label>
      <div className="flex gap-2">
        <Select value={leagueId} onValueChange={setLeagueId}>
          <SelectTrigger className="flex-1 bg-white">
            <SelectValue placeholder="Select a league" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {leagues?.map((league) => (
              <SelectItem key={league.id} value={league.id}>
                {league.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowNewLeague(true)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};