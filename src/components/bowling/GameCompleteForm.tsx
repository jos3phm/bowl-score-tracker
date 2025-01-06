import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface GameCompleteFormProps {
  notes: string;
  onNotesChange: (value: string) => void;
  onPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  onNewGame: () => void;
  isSaving: boolean;
  photo: File | null;
}

export const GameCompleteForm = ({
  notes,
  onNotesChange,
  onPhotoChange,
  photo
}: GameCompleteFormProps) => {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="notes" className="block text-sm font-medium mb-2">
          Game Notes
        </label>
        <Textarea
          id="notes"
          placeholder="Add any notes about your game..."
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          className="min-h-[100px]"
        />
      </div>

      <div>
        <label htmlFor="photo" className="block text-sm font-medium mb-2">
          Attach Photo
        </label>
        <Input
          id="photo"
          type="file"
          accept="image/*"
          onChange={onPhotoChange}
        />
        {photo && (
          <p className="text-sm text-gray-500 mt-1">
            Selected: {photo.name}
          </p>
        )}
      </div>
    </div>
  );
};