import { Check, Languages } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supportedLanguages, setPreferredLanguage } from "@/lib/i18n";

const LANGUAGE_OPTIONS = supportedLanguages;

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.resolvedLanguage ?? "en";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={t("nav.language")}
          className={`group inline-flex h-9 w-9 items-center justify-center rounded-full border border-gold-hairline bg-surface text-bone/80 transition-all duration-200 hover:border-gold/70 hover:bg-gold/5 hover:text-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${className}`.trim()}
        >
          <Languages className="h-4 w-4 transition-transform duration-200 group-hover:scale-105" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="z-50 min-w-[9rem] rounded-xl border border-gold/20 bg-surface p-1 text-bone shadow-[0_12px_30px_rgba(0,0,0,0.24)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2"
      >
        {LANGUAGE_OPTIONS.map((language) => {
          const isCurrent = currentLanguage === language;
          return (
            <DropdownMenuItem
              key={language}
              onSelect={() => setPreferredLanguage(language)}
              className={`flex cursor-pointer items-center justify-between rounded-md px-3 py-2 text-xs uppercase tracking-[0.18em] transition-colors ${
                isCurrent ? "bg-gold/10 text-gold" : "text-bone/75 hover:bg-gold/5 hover:text-bone"
              }`}
            >
              <span>{t(`languages.${language}`)}</span>
              {isCurrent ? <Check className="h-3.5 w-3.5" /> : null}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
