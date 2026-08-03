import { useEffect, type ReactNode } from "react"; // <-- useEffect import kiya hay
import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type NavLink = {
  to: string;
  label: string;
};

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  links: readonly NavLink[];
  extraLinks?: readonly NavLink[];
  languageSlot?: ReactNode;
  authSlot?: ReactNode;
}

export function MobileNav({ isOpen, onClose, links, extraLinks = [], languageSlot, authSlot }: MobileNavProps) {
  
  // Body scroll lock logic
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"; // Background scroll disable
    } else {
      document.body.style.overflow = "unset";  // Background scroll enable
    }

    // Cleanup function jab component unmount ho
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <nav
      className={cn(
        // Yahan 'overscroll-none' add kiya hay taake bounce effect (opar/nechay move hona) band ho jaye
        "fixed inset-0 z-50 h-[100dvh] w-full bg-void overflow-y-auto overscroll-none transition-transform duration-300 ease-in-out md:hidden",
        isOpen ? "translate-x-0" : "-translate-x-full",
      )}
    >
      {/* Full-Screen Drawer Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b hairline">
        <Link to="/" onClick={onClose} className="flex items-baseline gap-2 group">
          <span className="font-display text-xl tracking-tight text-bone group-hover:text-gold transition-colors">
            Osman Visuals
          </span>
        </Link>
        <button
          onClick={onClose}
          className="p-2 -mr-2 text-bone hover:text-gold transition-colors"
          aria-label="Close menu"
        >
          <X size={24} />
        </button>
      </div>

      {/* Drawer Links */}
      <div className="flex flex-col gap-1 p-6">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            onClick={onClose}
            className="px-3 py-3 text-sm text-bone/70 hover:text-bone hover:bg-surface/50 rounded transition-all"
            activeProps={{
              className: "text-gold bg-surface/50",
            }}
          >
            {link.label}
          </Link>
        ))}

        {extraLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            onClick={onClose}
            className="px-3 py-3 text-sm text-bone/70 hover:text-bone hover:bg-surface/50 rounded transition-all"
            activeProps={{
              className: "text-gold bg-surface/50",
            }}
          >
            {link.label}
          </Link>
        ))}

      </div>
    </nav>
  );
}