"use client";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

function FilterButton() {
  const search = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  return (
    <div className="flex flex-row">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size={"pill"} className="flex flex-row items-center gap-2">
            <Filter size={18} />
            Filter
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Sort by</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              const params = new URLSearchParams(search);
              params.set("sort_comments", "oldest");
              replace(`${pathname}?${params.toString()}`, { scroll: false });
            }}
          >
            Oldest
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              const params = new URLSearchParams(search);
              params.set("sort_comments", "newest");
              replace(`${pathname}?${params.toString()}`, { scroll: false });
            }}
          >
            Newest
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default FilterButton;
