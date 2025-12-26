"use client";

import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";

import { useI18n } from "@/components/providers/i18n-provider";
import { useDebounce } from "@/hooks/ui/useSimpleHooks";
import { Button } from "@/components/ui/core/button";
import { Input } from "@/components/ui/core/input";
import { Label } from "@/components/ui/core/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { USER_CONSTANTS } from "@/lib/constants/user.constants";

interface UserFiltersProps {
  onSearch: (query: string) => void;
  onRoleChange: (role: string) => void;
  onStatusChange: (status: string) => void;
  role?: string;
  status?: string;
  className?: string;
}

export function UserFilters({
  onSearch,
  onRoleChange,
  onStatusChange,
  role,
  status,
  className,
}: UserFiltersProps) {
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
    onRoleChange("all");
    onStatusChange("all");
  };

  const hasActiveFilters = searchValue || (role && role !== "all") || (status && status !== "all");

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t("users.filters.searchPlaceholder", "admin")}
          className="pl-9"
          value={searchValue}
          onChange={handleSearchChange}
        />
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="role-filter" className="text-sm font-medium">
            {t("users.filters.role", "admin")}
          </Label>
          <Select value={role || "all"} onValueChange={onRoleChange}>
            <SelectTrigger id="role-filter" className="w-full sm:w-[150px]">
              <SelectValue placeholder={t("users.filters.role", "admin")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("all", "common")}</SelectItem>
              {Object.values(USER_CONSTANTS.ROLES).map((roleValue) => (
                <SelectItem key={roleValue} value={roleValue}>
                  {t(`users.roles.${roleValue}`, "admin")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="status-filter" className="text-sm font-medium">
            {t("users.filters.status", "admin")}
          </Label>
          <Select value={status || "all"} onValueChange={onStatusChange}>
            <SelectTrigger id="status-filter" className="w-full sm:w-[150px]">
              <SelectValue placeholder={t("users.filters.status", "admin")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("all", "common")}</SelectItem>
              {Object.values(USER_CONSTANTS.STATUS).map((statusValue) => (
                <SelectItem key={statusValue} value={statusValue}>
                  {t(`users.status.${statusValue}`, "admin")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {hasActiveFilters && (
          <div className="flex items-end">
            <Button variant="ghost" size="icon" onClick={clearFilters} title={t("clearFilters", "common")}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

