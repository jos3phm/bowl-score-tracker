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

interface LocationFormProps {
  locations: Array<{ id: string; name: string }>;
  locationId: string;
  setLocationId: (id: string) => void;
  showNewLocation: boolean;
  setShowNewLocation: (show: boolean) => void;
  onAddLocation: (locationData: {
    name: string;
    address?: string;
    city?: string;
    state?: string;
  }) => Promise<void>;
}

export const LocationForm = ({
  locations,
  locationId,
  setLocationId,
  showNewLocation,
  setShowNewLocation,
  onAddLocation,
}: LocationFormProps) => {
  const [newLocationName, setNewLocationName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  const handleAddLocation = async () => {
    if (!newLocationName.trim()) return;
    
    await onAddLocation({
      name: newLocationName,
      address: address.trim(),
      city: city.trim(),
      state: state.trim(),
    });
    
    setNewLocationName("");
    setAddress("");
    setCity("");
    setState("");
    setShowNewLocation(false);
  };

  if (showNewLocation) {
    return (
      <div className="space-y-4">
        <Label>New Location Details</Label>
        <Input
          value={newLocationName}
          onChange={(e) => setNewLocationName(e.target.value)}
          placeholder="Location Name *"
          required
        />
        <Input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Address (Optional)"
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City"
          />
          <Input
            value={state}
            onChange={(e) => setState(e.target.value)}
            placeholder="State"
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={handleAddLocation} className="flex-1">
            Add Location
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowNewLocation(false)}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label>Location</Label>
      <div className="flex gap-2">
        <Select value={locationId} onValueChange={setLocationId}>
          <SelectTrigger className="flex-1 bg-white">
            <SelectValue placeholder="Select a location" />
          </SelectTrigger>
          <SelectContent className="bg-white">
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
  );
};