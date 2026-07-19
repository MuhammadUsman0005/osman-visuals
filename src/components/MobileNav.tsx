import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

type NavLink = {
  to: string;
  label: string;
};

interface MobileNavProps {
  links: readonly NavLink[];
}

export function MobileNav({ links }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Hamburger Menu Button - Only visible on mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-2 text-bone hover:text-gold transition-colors"
        aria-label="Toggle navigation menu"
        aria-expanded={isOpen}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay - Only visible when drawer is open */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Side Drawer - Slides in from left on mobile */}
      <nav
        className={cn(
          "fixed left-0 top-16 z-50 h-[calc(100vh-4rem)] w-64 bg-surface border-r hairline overflow-y-auto transition-transform duration-300 ease-in-out md:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col gap-1 p-6">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={handleLinkClick}
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

      {/* Desktop Navigation - Only visible on medium screens and up */}
      <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="text-bone/70 hover:text-bone transition-colors"
            activeProps={{ className: "text-gold" }}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
