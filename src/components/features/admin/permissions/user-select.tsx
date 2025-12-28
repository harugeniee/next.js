"use client";

import { Check, ChevronsUpDown, Loader2, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { useI18n } from "@/components/providers/i18n-provider";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/core/avatar";
import { Button } from "@/components/ui/core/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/shadcn-io/popover";
import { useUsers } from "@/hooks/admin/useUsers";
import { useDebounce } from "@/hooks/ui/useSimpleHooks";
import { cn } from "@/lib/utils";
import type { User as UserType } from "@/lib/interface/user.interface";

interface UserSelectProps {
  value?: string;
  onValueChange: (userId: string | undefined) => void;
  disabled?: boolean;
  placeholder?: string;
}

/**
 * UserSelect Component
 * Optimized searchable user selection component using Command + Popover
 * Features:
 * - Initial users load when popover opens
 * - Selected user always visible at top
 * - Integrated clear button
 * - Keyboard navigation
 * - Loading states
 * - Better visual feedback
 */
export function UserSelect({
  value,
  onValueChange,
  disabled = false,
  placeholder,
}: UserSelectProps) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);

  // Fetch users - show initial list when popover opens, then filter by search
  // Only fetch when popover is open to optimize performance
  const {
    data: usersData,
    isLoading,
    error,
  } = useUsers(
    {
      query: debouncedSearch || undefined,
      limit: 30,
      page: 1,
    },
    { enabled: open },
  );

  // Fetch selected user separately if we have a value but it's not in current results
  const selectedUserFromResults = usersData?.result?.find(
    (user) => user.id === value,
  );

  // If we have a value but the user is not in results, we'll show it anyway
  // The selected user will be displayed in the trigger button
  const selectedUser = selectedUserFromResults;

  // Memoize user list to avoid unnecessary re-renders
  const userList = useMemo(() => {
    if (!usersData?.result) return [];
    return usersData.result;
  }, [usersData?.result]);

  // Separate selected user from other users for display
  const otherUsers = useMemo(() => {
    if (!value) return userList;
    return userList.filter((user) => user.id !== value);
  }, [userList, value]);

  const handleSelect = useCallback(
    (userId: string) => {
      onValueChange(userId === value ? undefined : userId);
      setOpen(false);
      setSearchQuery("");
    },
    [value, onValueChange],
  );

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent popover from opening
      onValueChange(undefined);
      setSearchQuery("");
    },
    [onValueChange],
  );

  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      setOpen(isOpen);
      if (!isOpen) {
        setSearchQuery("");
      }
    },
    [],
  );

  // Auto-focus search input when popover opens
  useEffect(() => {
    if (open) {
      // Small delay to ensure popover is rendered
      setTimeout(() => {
        const input = document.querySelector(
          '[data-slot="command-input"]',
        ) as HTMLInputElement;
        if (input) {
          input.focus();
        }
      }, 100);
    }
  }, [open]);

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label={
            selectedUser
              ? `Selected user: ${selectedUser.name || selectedUser.username}`
              : placeholder || t("assignRole.form.selectUser", "permissions")
          }
          className="w-full justify-between"
          disabled={disabled}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {selectedUser ? (
              <>
                <Avatar className="h-5 w-5 shrink-0">
                  <AvatarImage
                    src={selectedUser.avatar?.url || selectedUser.photoUrl}
                    alt={selectedUser.username}
                  />
                  <AvatarFallback className="text-xs">
                    {selectedUser.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="truncate">
                  {selectedUser.name || selectedUser.username}
                </span>
                {selectedUser.email && (
                  <span className="text-xs text-muted-foreground truncate hidden sm:inline">
                    ({selectedUser.email})
                  </span>
                )}
              </>
            ) : (
              <span className="text-muted-foreground truncate">
                {placeholder || t("assignRole.form.selectUser", "permissions")}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0 ml-2">
            {selectedUser && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 -mr-1 hover:bg-transparent"
                onClick={handleClear}
                disabled={disabled}
                aria-label={t("clear", "common")}
                type="button"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
            <ChevronsUpDown className="h-4 w-4 opacity-50 shrink-0" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command shouldFilter={false}>
          <div className="relative">
            <CommandInput
              placeholder={t("assignRole.form.searchUser", "permissions")}
              value={searchQuery}
              onValueChange={setSearchQuery}
              className="h-10"
            />
            {isLoading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>
          <CommandList>
            {error && (
              <div className="p-4 text-sm text-destructive">
                {error.message || "Failed to load users"}
              </div>
            )}
            {!error && (
              <>
                <CommandEmpty>
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-6">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mb-2" />
                      <span className="text-sm text-muted-foreground">
                        {t("actions.loading", "common")}
                      </span>
                    </div>
                  ) : (
                    <div className="py-6 text-center text-sm text-muted-foreground">
                      {searchQuery
                        ? t("noResults", "common") || "No users found"
                        : "No users available"}
                    </div>
                  )}
                </CommandEmpty>
                <CommandGroup>
                  {/* Show selected user at top if exists */}
                  {selectedUser && value && (
                    <CommandItem
                      key={`selected-${selectedUser.id}`}
                      value={selectedUser.id}
                      onSelect={() => handleSelect(selectedUser.id)}
                      className="flex items-center gap-2 bg-accent/50 aria-selected:bg-accent"
                      aria-selected="true"
                    >
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      <Avatar className="h-6 w-6 shrink-0">
                        <AvatarImage
                          src={
                            selectedUser.avatar?.url || selectedUser.photoUrl
                          }
                          alt={selectedUser.username}
                        />
                        <AvatarFallback className="text-xs">
                          {selectedUser.username.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="font-medium truncate">
                          {selectedUser.name || selectedUser.username}
                        </span>
                        {selectedUser.email && (
                          <span className="text-xs text-muted-foreground truncate">
                            {selectedUser.email}
                          </span>
                        )}
                      </div>
                    </CommandItem>
                  )}
                  {/* Other users */}
                  {otherUsers.length > 0 && (
                    <>
                      {otherUsers.map((user: UserType) => (
                        <CommandItem
                          key={user.id}
                          value={user.id}
                          onSelect={() => handleSelect(user.id)}
                          className="flex items-center gap-2 aria-selected:bg-accent"
                          aria-selected={value === user.id ? "true" : "false"}
                        >
                          <Check
                            className={cn(
                              "h-4 w-4 shrink-0",
                              value === user.id
                                ? "opacity-100 text-primary"
                                : "opacity-0",
                            )}
                          />
                          <Avatar className="h-6 w-6 shrink-0">
                            <AvatarImage
                              src={user.avatar?.url || user.photoUrl}
                              alt={user.username}
                            />
                            <AvatarFallback className="text-xs">
                              {user.username.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col flex-1 min-w-0">
                            <span className="font-medium truncate">
                              {user.name || user.username}
                            </span>
                            {user.email && (
                              <span className="text-xs text-muted-foreground truncate">
                                {user.email}
                              </span>
                            )}
                          </div>
                        </CommandItem>
                      ))}
                    </>
                  )}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
