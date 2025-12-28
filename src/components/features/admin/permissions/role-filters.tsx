"use client";

import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";

import { useI18n } from "@/components/providers/i18n-provider";
import { useDebounce } from "@/hooks/ui/useSimpleHooks";
import { Button } from "@/components/ui/core/button";
import { Input } from "@/components/ui/core/input";

interface RoleFiltersProps {
  onSearch: (query: string) => void;
  className?: string;
}

export function RoleFilters({
  onSearch,
  className,
}: RoleFiltersProps) {
  const { t } = useI18n();
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearchValue = useDebounce(searchValue, 500);

  // Trigger search when debounced value changes
  useEffect(() => {
    onSearch(debouncedSearchValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchValue]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const clearFilters = () => {
    setSearchValue("");
    onSearch("");
  };

  const hasActiveFilters = searchValue;

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t("filters.searchPlaceholder", "permissions")}
          className="pl-9"
          value={searchValue}
          onChange={handleSearchChange}
        />
      </div>
      {hasActiveFilters && (
        <div className="flex items-end">
          <Button
            variant="ghost"
            size="icon"
            onClick={clearFilters}
            title={t("clearFilters", "common")}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

