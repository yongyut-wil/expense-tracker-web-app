"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import { useParams } from "next/navigation";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const toggleLanguage = (newLocale: "en" | "th") => {
    router.replace(
      // @ts-expect-error - Next.js router types are incompatible with i18n routing
      { pathname, params },
      { locale: newLocale }
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 h-9 rounded-xl border border-gray-200 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 px-3 transition-all duration-200">
          <Languages className="h-4 w-4" />
          <span className="text-xs font-semibold uppercase">{locale}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 rounded-xl p-1 shadow-lg border-gray-100">
        <DropdownMenuItem 
          onClick={() => toggleLanguage("th")}
          className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 cursor-pointer transition-all duration-200 ${
            locale === "th" 
              ? "bg-indigo-50 text-indigo-600 font-medium" 
              : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
          }`}
        >
          <span className="text-base">🇹🇭</span>
          <span className="flex-1">ภาษาไทย</span>
          {locale === "th" && <span className="text-indigo-500 text-xs">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => toggleLanguage("en")}
          className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 cursor-pointer transition-all duration-200 ${
            locale === "en" 
              ? "bg-indigo-50 text-indigo-600 font-medium" 
              : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
          }`}
        >
          <span className="text-base">🇺🇸</span>
          <span className="flex-1">English</span>
          {locale === "en" && <span className="text-indigo-500 text-xs">✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
