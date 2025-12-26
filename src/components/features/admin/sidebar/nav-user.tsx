"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import {
  ChevronsUpDown,
  LogOut,
  Settings,
  User as UserIcon,
} from "lucide-react";
import { toast } from "sonner";
import { useAtom } from "jotai";

import { useI18n } from "@/components/providers/i18n-provider";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/core/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/layout/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { clearUserState, currentUserAtom, logoutAction } from "@/lib/auth";
import type { User } from "@/lib/interface";
import {
  getUserAvatarUrl,
  getUserDisplayName,
  getUserInitials,
} from "@/lib/utils";

interface NavUserProps {
  user: User & { id: string }; // Ensure id is required for profile link
}

export function NavUser({ user }: NavUserProps) {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const { t } = useI18n();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [, setUser] = useAtom(currentUserAtom);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logoutAction();
      // Clear user state after successful logout
      setUser(null);
      clearUserState(); // Ensure all tokens are cleared
      toast.success(t("toastLogoutSuccess", "toast"));
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error(t("toastLogoutError", "toast"));
      // Even if logout fails, clear local state
      setUser(null);
      clearUserState();
      router.push("/auth/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const displayName = getUserDisplayName(user);
  const userAvatar = getUserAvatarUrl(user);
  const userInitials = getUserInitials(user);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={userAvatar} alt={displayName} />
                <AvatarFallback className="rounded-lg">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{displayName}</span>
                <span className="truncate text-xs">{user.email || ""}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={userAvatar} alt={displayName} />
                  <AvatarFallback className="rounded-lg">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{displayName}</span>
                  <span className="truncate text-xs">{user.email || ""}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/user/${user.id}`} className="cursor-pointer">
                <UserIcon className="mr-2 h-4 w-4" />
                <span>{t("userDropdownProfile", "user")}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>{t("userDropdownSettings", "user")}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="cursor-pointer text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>
                {isLoggingOut
                  ? t("userDropdownLoggingOut", "user")
                  : t("userDropdownLogout", "user")}
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
