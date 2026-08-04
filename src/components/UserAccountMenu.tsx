import { Link } from "@tanstack/react-router";
import { User, Bell, Settings, LogOut, Palette, Monitor, Sun, Moon } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { useAuth, signOut } from "@/lib/auth";
import { useThemeMode, type ThemeMode } from "@/lib/theme";

export function UserAccountMenu({ variant = "desktop" }: { variant?: "desktop" | "mobile" }) {
  const { user } = useAuth();
  const { mode, setMode } = useThemeMode();

  if (!user) return null;

  const avatarUrl =
    (user.user_metadata?.avatar_url as string | undefined) ||
    (user.user_metadata?.picture as string | undefined);
  const label = (user.user_metadata?.full_name as string | undefined) || user.email || "Account";
  const initial = label.charAt(0).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Account menu"
          className={`inline-flex items-center justify-center rounded-full border border-gold-hairline overflow-hidden transition-all duration-200 hover:border-gold/70 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
            variant === "mobile" ? "h-10 w-10" : "h-9 w-9"
          }`}
        >
          <Avatar className="h-full w-full">
            {avatarUrl && <AvatarImage src={avatarUrl} alt={label} />}
            <AvatarFallback className="bg-gold/10 text-gold text-xs font-medium">
              {initial}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 rounded-2xl border-gold-hairline p-1.5">
        <DropdownMenuLabel className="truncate px-2 py-1.5 text-xs font-normal text-bone/50">
          {user.email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild className="cursor-pointer gap-2 rounded-xl py-2">
          <Link to="/profile">
            <User className="h-4 w-4 text-gold" />
            Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild className="cursor-pointer gap-2 rounded-xl py-2">
          <Link to="/updates">
            <Bell className="h-4 w-4 text-gold" />
            Updates
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="cursor-pointer gap-2 rounded-xl py-2">
            <Palette className="h-4 w-4 text-gold" />
            Theme
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent className="rounded-2xl border-gold-hairline p-1.5">
              <DropdownMenuRadioGroup value={mode} onValueChange={(v) => setMode(v as ThemeMode)}>
                <DropdownMenuRadioItem value="light" className="cursor-pointer gap-2 rounded-xl py-2">
                  <Sun className="h-4 w-4" />
                  Light
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="dark" className="cursor-pointer gap-2 rounded-xl py-2">
                  <Moon className="h-4 w-4" />
                  Dark
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="system" className="cursor-pointer gap-2 rounded-xl py-2">
                  <Monitor className="h-4 w-4" />
                  System
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        <DropdownMenuItem asChild className="cursor-pointer gap-2 rounded-xl py-2">
          <Link to="/account/settings">
            <Settings className="h-4 w-4 text-gold" />
            Account Settings
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => signOut()}
          className="cursor-pointer gap-2 rounded-xl py-2 text-rose-400 focus:text-rose-400"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}