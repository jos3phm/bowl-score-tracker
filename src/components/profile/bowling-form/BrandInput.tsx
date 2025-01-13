import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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

const primaryBrands = [
  "900 Global",
  "Brunswick",
  "Columbia 300",
  "DV8",
  "Ebonite",
  "Hammer",
  "Motiv",
  "Radical",
  "Roto Grip",
  "Storm",
];

const secondaryBrands = [
  "AMF",
  "Dyno-Thane",
  "Elite",
  "Lane #1",
  "Lane Masters",
  "Lord Field",
  "OnTheBallBowling",
  "Pyramid",
  "Track",
  "Swag",
];

interface BrandInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function BrandInput({ value, onChange }: BrandInputProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-white dark:bg-gray-800"
        >
          {value || "Select brand..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search brand..." />
          <CommandEmpty>No brand found.</CommandEmpty>
          <CommandGroup heading="Major Brands">
            {primaryBrands.map((brand) => (
              <CommandItem
                key={brand}
                value={brand}
                onSelect={(currentValue) => {
                  onChange(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === brand ? "opacity-100" : "opacity-0"
                  )}
                />
                {brand}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Other Brands">
            {secondaryBrands.map((brand) => (
              <CommandItem
                key={brand}
                value={brand}
                onSelect={(currentValue) => {
                  onChange(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === brand ? "opacity-100" : "opacity-0"
                  )}
                />
                {brand}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}