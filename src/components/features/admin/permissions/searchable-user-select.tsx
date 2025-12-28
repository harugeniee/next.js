"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import { useI18n } from "@/components/providers/i18n-provider";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/core/avatar";
import { Input } from "@/components/ui/core/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUsers } from "@/hooks/admin/useUsers";
import type { User } from "@/lib/interface/user.interface";

interface SearchableUserSelectProps {
  value?: string;
  onValueChange: (userId: string | undefined) => void;
  disabled?: boolean;
  placeholder?: string;
}

const DISPLAY_LIMIT = 5;

/**
 * SearchableUserSelect Component
 * Select component with search functionality inside dropdown
 * Displays 5 users at a time with client-side filtering
 */
export function SearchableUserSelect({
  value,
  onValueChange,
  disabled = false,
  placeholder,
}: SearchableUserSelectProps) {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);

  // Fetch users (limit to reasonable number for client-side filtering)
  const {
    data: usersData,
    isLoading,
    error,
  } = useUsers({
    limit: 100,
    page: 1,
    sortBy: "createdAt",
    order: "DESC",
  });

  // Find selected user for display in trigger
  const selectedUser = useMemo(() => {
    if (!value || !usersData?.result) return undefined;
    return usersData.result.find((user) => user.id === value);
  }, [value, usersData]);

  // Filter users based on search query
  const filteredUsers = useMemo(() => {
    if (!usersData?.result) return [];

    if (!searchQuery.trim()) {
      // No search query, return first 5 users
      return usersData.result.slice(0, DISPLAY_LIMIT);
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = usersData.result.filter((user: User) => {
      const name = (user.name || "").toLowerCase();
      const username = (user.username || "").toLowerCase();
      const email = (user.email || "").toLowerCase();

      return (
        name.includes(query) ||
        username.includes(query) ||
        email.includes(query)
      );
    });

    // Limit to 5 results
    return filtered.slice(0, DISPLAY_LIMIT);
  }, [usersData, searchQuery]);

  // Clear search when dropdown closes
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setSearchQuery("");
    }
  };

  return (
    <Select
      value={value}
      onValueChange={onValueChange}
      disabled={disabled || isLoading}
      open={open}
      onOpenChange={handleOpenChange}
    >
      <SelectTrigger className="w-full">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {selectedUser && (
            <Avatar className="h-5 w-5 shrink-0">
              <AvatarImage
                src={selectedUser.avatar?.url || selectedUser.photoUrl}
                alt={selectedUser.username}
              />
              <AvatarFallback className="text-xs">
                {selectedUser.username.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          )}
          <SelectValue
            placeholder={
              isLoading
                ? t("actions.loading", "common")
                : placeholder || t("assignRole.form.selectUser", "permissions")
            }
          />
        </div>
      </SelectTrigger>
      <SelectContent className="w-[var(--radix-select-trigger-width)]">
        {/* Search Input */}
        <div className="p-2 border-b sticky top-0 bg-popover z-10">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder={t("assignRole.form.searchUser", "permissions")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                e.stopPropagation();
                // Prevent Enter from closing the dropdown
                if (e.key === "Enter") {
                  e.preventDefault();
                }
              }}
              autoFocus
            />
          </div>
        </div>

        {/* Users List */}
        <div className="max-h-[200px] overflow-y-auto">
          {isLoading ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              {t("actions.loading", "common")}
            </div>
          ) : error ? (
            <div className="py-6 text-center text-sm text-destructive px-2">
              {error.message || "Failed to load users"}
            </div>
          ) : filteredUsers.length > 0 ? (
            filteredUsers.map((user: User) => (
              <SelectItem key={user.id} value={user.id}>
                <div className="flex items-center gap-2 min-w-0">
                  <Avatar className="h-5 w-5 shrink-0">
                    <AvatarImage
                      src={user.avatar?.url || user.photoUrl}
                      alt={user.username}
                    />
                    <AvatarFallback className="text-xs">
                      {user.username.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="font-medium truncate">
                      {user.name || user.username}
                    </span>
                    {user.email && (
                      <span className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </span>
                    )}
                  </div>
                </div>
              </SelectItem>
            ))
          ) : (
            <div className="py-6 text-center text-sm text-muted-foreground px-2">
              {searchQuery
                ? t("noResults", "common") || "No users found"
                : "No users available"}
            </div>
          )}
        </div>
      </SelectContent>
    </Select>
  );
}
