import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
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

export const BallNameInput = ({ 
  value, 
  onChange, 
  onSearch, 
  suggestions = [] 
}: BallNameInputProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open && suggestions.length > 0} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
          <Input
            placeholder="Enter ball model (e.g., Phaze II, Quantum)"
            value={value}
            onChange={(e) => {
              const newValue = e.target.value;
              onChange(newValue);
              onSearch(newValue);
            }}
            className="w-full"
          />
        </div>
      </PopoverTrigger>
      {suggestions.length > 0 && (
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <Command>
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {suggestions.map((suggestion) => (
                  <CommandItem
                    key={suggestion}
                    onSelect={(currentValue) => {
                      onChange(currentValue);
                      setOpen(false);
                    }}
                    value={suggestion}
                  >
                    {suggestion}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      )}
    </Popover>
  );
};