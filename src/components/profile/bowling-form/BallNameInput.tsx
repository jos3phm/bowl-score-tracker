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
  suggestions?: string[];
}

export const BallNameInput = ({ 
  value, 
  onChange, 
  onSearch, 
  suggestions = [] 
}: BallNameInputProps) => {
  const [open, setOpen] = useState(false);

  const handleInputChange = (newValue: string) => {
    onChange(newValue);
    onSearch(newValue);
    setOpen(newValue.length > 0 && suggestions.length > 0);
  };

  return (
    <Popover 
      open={open} 
      onOpenChange={setOpen}
    >
      <PopoverTrigger asChild>
        <div className="relative">
          <Input
            placeholder="Enter ball model (e.g., Phaze II, Quantum)"
            value={value}
            onChange={(e) => handleInputChange(e.target.value)}
            className="w-full"
          />
        </div>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[var(--radix-popover-trigger-width)] p-0" 
        align="start"
        side="bottom"
      >
        <Command shouldFilter={false}>
          <CommandList>
            <CommandGroup heading="Suggestions">
              {suggestions.length === 0 ? (
                <CommandEmpty>No results found.</CommandEmpty>
              ) : (
                suggestions.map((suggestion) => (
                  <CommandItem
                    key={suggestion}
                    onSelect={() => {
                      onChange(suggestion);
                      setOpen(false);
                    }}
                  >
                    {suggestion}
                  </CommandItem>
                ))
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};