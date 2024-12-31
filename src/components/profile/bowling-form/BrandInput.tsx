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

interface BrandInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (value: string) => void;
  suggestions: string[];
}

export const BrandInput = ({ value, onChange, onSearch, suggestions }: BrandInputProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Input
          placeholder="Enter brand name (e.g., Storm, Brunswick)"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            onSearch(e.target.value);
          }}
        />
      </PopoverTrigger>
      {suggestions.length > 0 && (
        <PopoverContent className="p-0" align="start">
          <Command>
            <CommandInput placeholder="Search brands..." />
            <CommandEmpty>No brand found.</CommandEmpty>
            <CommandGroup>
              {suggestions.map((brand) => (
                <CommandItem
                  key={brand}
                  onSelect={() => {
                    onChange(brand);
                    setOpen(false);
                  }}
                >
                  {brand}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      )}
    </Popover>
  );
};