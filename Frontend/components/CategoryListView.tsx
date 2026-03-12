import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { ChevronDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";

interface CategoryListViewProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategoryListView = ({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryListViewProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`w-auto justify-between rounded-none rounded-tl-md rounded-bl-md text-black/80 capitalize border-r-2 hover:border-amazonOrangeDark hoverEffect`}
        >
          {selectedCategory}
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Command className="bg-amazonBlue backdrop-blur-md text-white">
          <CommandInput placeholder="Search Category" className="h-9" />
          <CommandList>
            <CommandEmpty>No category found.</CommandEmpty>
            <CommandGroup className="text-white" heading="Categories">
              <CommandItem
                value="All"
                onSelect={() => {
                  onSelectCategory("All");
                  setOpen(false);
                }}
                className="cursor-pointer text-white data-[selected=true]:bg-white/10 data-[selected=true]:text-white"
              >
                All
              </CommandItem>
              {categories.map((category) => (
                <CommandItem
                  key={category}
                  value={category}
                  onSelect={() => {
                    onSelectCategory(category);
                    setOpen(false);
                  }}
                  className="cursor-pointer capitalize text-white data-[selected=true]:bg-white/10 data-[selected=true]:text-white"
                >
                  {category}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CategoryListView;
