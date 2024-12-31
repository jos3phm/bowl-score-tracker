import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

interface BallNameInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (value: string) => void;
  suggestions: string[];
}

export const BallNameInput = ({ value, onChange, onSearch, suggestions }: BallNameInputProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
          <Input
            placeholder="Enter ball model (e.g., Phaze II, Quantum)"
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              onSearch(e.target.value);
            }}
            className="w-full"
          />
        </div>
      </PopoverTrigger>
      {suggestions.length > 0 && (
        <PopoverContent className="p-0" align="start">
          <Command>
            <CommandInput placeholder="Search ball names..." />
            <CommandEmpty>No ball name found.</CommandEmpty>
            <CommandGroup>
              {suggestions.map((name) => (
                <CommandItem
                  key={name}
                  onSelect={() => {
                    onChange(name);
                    setOpen(false);
                  }}
                >
                  {name}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      )}
    </Popover>
  );
};