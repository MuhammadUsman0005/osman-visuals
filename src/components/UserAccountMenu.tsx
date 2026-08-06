import { Link } from "@tanstack/react-router";
import {
  User,
  Library,
  Heart,
  Download,
  Settings,
  Palette,
  BellRing,
  LifeBuoy,
  LogOut,
  Monitor,
  Sun,
  Moon,
} from "lucide-react";
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

// Two initials (e.g. "Muhammad Usman" -> "MU") when we have a name, else
// falls back to the first letter of the email.
function getInitials(fullName: string | undefined, email: string | undefined): string {
  if (fullName?.trim()) {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return (email?.charAt(0) ?? "?").toUpperCase();
}

const itemClass =
  "cursor-pointer gap-2.5 rounded-xl px-2.5 py-2.5 text-sm text-bone/85 transition-colors duration-150 focus:bg-gold/10 focus:text-gold data-[highlighted]:bg-gold/10 data-[highlighted]:text-gold";

export function UserAccountMenu({ variant = "desktop" }: { variant?: "desktop" | "mobile" }) {
  const { user } = useAuth();
  const { mode, setMode } = useThemeMode();

  if (!user) return null;

  const avatarUrl =
    (user.user_metadata?.avatar_url as string | undefined) ||
    (user.user_metadata?.picture as string | undefined);
  const fullName = user.user_metadata?.full_name as string | undefined;
  const initials = getInitials(fullName, user.email);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Account menu"
          className={`inline-flex items-center justify-center rounded-full border border-gold-hairline overflow-hidden transition-all duration-200 hover:border-gold/70 hover:shadow-[0_0_0_3px_rgba(184,150,90,0.12)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
            variant === "mobile" ? "h-10 w-10" : "h-9 w-9"
          }`}
        >
          <Avatar className="h-full w-full">
            {avatarUrl && <AvatarImage src={avatarUrl} alt={fullName ?? user.email ?? "Account"} />}
            <AvatarFallback className="bg-gold/10 text-gold text-[11px] font-medium tracking-wide">
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="w-64 rounded-2xl border-gold-hairline bg-surface/95 backdrop-blur p-2 shadow-[0_20px_50px_rgba(0,0,0,0.35)]"
      >
        <DropdownMenuLabel className="px-2.5 pt-1.5 pb-3">
          <p className="truncate text-sm text-bone font-medium">{user.email}</p>
          <p className="mt-0.5 text-[10px] uppercase tracking-[0.18em] text-gold/70">
            Archive Member
          </p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gold-hairline" />

        <div className="py-1">
          <DropdownMenuItem asChild className={itemClass}>
            <Link to="/profile">
              <User className="h-4 w-4 text-gold/80" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className={itemClass}>
            <Link to="/my-library">
              <Library className="h-4 w-4 text-gold/80" />
              My Library
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className={itemClass}>
            <Link to="/favorites">
              <Heart className="h-4 w-4 text-gold/80" />
              Favorites
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className={itemClass}>
            <Link to="/downloads">
              <Download className="h-4 w-4 text-gold/80" />
              Downloads
            </Link>
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator className="bg-gold-hairline" />

        <div className="py-1">
          <DropdownMenuItem asChild className={itemClass}>
            <Link to="/account/settings">
              <Settings className="h-4 w-4 text-gold/80" />
              Account Settings
            </Link>
          </DropdownMenuItem>
<DropdownMenuSub>
  {/* 1. Appearance Main Trigger */}
  <DropdownMenuSubTrigger 
    className={`${itemClass} group hover:bg-gold hover:text-black data-[state=open]:bg-gold data-[state=open]:text-black transition-colors cursor-pointer`}
  >
    <Palette className="h-4 w-4 text-gold/80 group-hover:text-black group-data-[state=open]:text-black transition-colors" />
    <span>Appearance</span>
  </DropdownMenuSubTrigger>

  <DropdownMenuPortal>
    <DropdownMenuSubContent
      sideOffset={8}
      className="w-44 rounded-2xl border-gold-hairline bg-surface/95 backdrop-blur p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.35)]"
    >
      <DropdownMenuRadioGroup value={mode} onValueChange={(v) => setMode(v as ThemeMode)}>
        
        {/* 2. Dark Option */}
        <DropdownMenuRadioItem 
          value="dark" 
          className={`${itemClass} group hover:bg-gold hover:text-black data-[highlighted]:bg-gold data-[highlighted]:text-black transition-colors cursor-pointer`}
        >
          <Moon className="h-4 w-4 text-gold/80 group-hover:text-black group-data-[highlighted]:text-black transition-colors" />
          Dark
        </DropdownMenuRadioItem>

        {/* 3. Light Option */}
        <DropdownMenuRadioItem 
          value="light" 
          className={`${itemClass} group hover:bg-gold hover:text-black data-[highlighted]:bg-gold data-[highlighted]:text-black transition-colors cursor-pointer`}
        >
          <Sun className="h-4 w-4 text-gold/80 group-hover:text-black group-data-[highlighted]:text-black transition-colors" />
          Light
        </DropdownMenuRadioItem>

        {/* 4. System Option */}
        <DropdownMenuRadioItem 
          value="system" 
          className={`${itemClass} group hover:bg-gold hover:text-black data-[highlighted]:bg-gold data-[highlighted]:text-black transition-colors cursor-pointer`}
        >
          <Monitor className="h-4 w-4 text-gold/80 group-hover:text-black group-data-[highlighted]:text-black transition-colors" />
          System
        </DropdownMenuRadioItem>

      </DropdownMenuRadioGroup>
    </DropdownMenuSubContent>
  </DropdownMenuPortal>
</DropdownMenuSub>

          <DropdownMenuItem asChild className={itemClass}>
            <Link to="/notifications">
              <BellRing className="h-4 w-4 text-gold/80" />
              Notifications
            </Link>
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator className="bg-gold-hairline" />

        <div className="py-1">
          <DropdownMenuItem asChild className={itemClass}>
            <Link to="/help">
              <LifeBuoy className="h-4 w-4 text-gold/80" />
              Help &amp; Support
            </Link>
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator className="bg-gold-hairline" />

        <div className="py-1">
          <DropdownMenuItem
            onClick={() => signOut()}
            className="cursor-pointer gap-2.5 rounded-xl px-2.5 py-2.5 text-sm text-rose-400/90 transition-colors duration-150 focus:bg-rose-500/10 focus:text-rose-300 data-[highlighted]:bg-rose-500/10 data-[highlighted]:text-rose-300"
          >
            <LogOut className="h-4 w-4" />
            Log Out
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}