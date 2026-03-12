"use client";

import { Link } from "@/i18n/routing";
import { useAuthStore } from "@/stores/auth-store";
import { useRouter, usePathname } from "@/i18n/routing";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Receipt, 
  LogOut, 
  Menu, 
  TrendingUp,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/language-switcher";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

const getNavItems = (t: any): NavItem[] => [
  {
    title: t("overview"),
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: t("transactions"),
    href: "/transactions",
    icon: Receipt,
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const tNav = useTranslations("Navigation");
  const tCommon = useTranslations("Common");
  const navItems = getNavItems(tNav);
  
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const fetchUser = useAuthStore((state) => state.fetchUser);
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Fetch user info on mount
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // Get user initials for avatar
  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const NavContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-gray-100 px-6">
        <Link href="/" className="flex items-center gap-3 font-bold text-xl" onClick={() => setOpen(false)}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-indigo-500 to-violet-600 shadow-md shadow-indigo-500/20">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <span className="text-foreground">
            {tCommon("appName")}
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-auto py-6 px-4">
        <nav className="space-y-1">
          {navItems.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={index}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "group relative flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 focus:outline-none",
                  isActive 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavNavContent"
                    className="absolute inset-0 rounded-lg bg-secondary z-0"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <div className={cn(
                  "relative z-10 flex h-9 w-9 items-center justify-center rounded-md transition-all duration-200",
                  isActive 
                    ? "bg-primary text-white" 
                    : "bg-transparent group-hover:bg-muted"
                )}>
                  <item.icon className={cn(
                    "h-5 w-5 transition-colors",
                    isActive ? "text-white" : "text-muted-foreground group-hover:text-foreground"
                  )} />
                </div>
                <span className="relative z-10 flex-1">{item.title}</span>
                {isActive && (
                  <motion.div 
                    layoutId="activeDotNavContent"
                    className="relative z-10 h-1.5 w-1.5 rounded-full bg-primary" 
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Section */}
      <div className="mt-auto border-t border-gray-100 p-4">
        <div className="mb-3 flex items-center gap-3 rounded-lg border border-border p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
            {getInitials(user?.name ?? undefined)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.name || tCommon("guestUser")}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email || "user@email.com"}</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-lg h-11 transition-all duration-200"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          {tCommon("logout")}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/80">
      {/* Desktop Sidebar */}
      <div className="hidden border-r border-border bg-background lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b border-border px-6">
            <Link href="/" className="flex items-center gap-3 font-bold text-xl">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-indigo-500 to-violet-600 shadow-md shadow-indigo-500/20">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <span className="text-foreground">
                {tCommon("appName")}
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-auto py-6 px-4">
            <nav className="space-y-1">
              {navItems.map((item, index) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={index}
                    href={item.href}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50",
                      isActive 
                        ? "text-indigo-600 shadow-sm" 
                        : "text-gray-600 hover:text-indigo-700"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeNavDesktop"
                        className="absolute inset-0 rounded-xl bg-linear-to-r from-indigo-50 to-violet-50 z-0"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <div className={cn(
                      "relative z-10 flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200",
                      isActive 
                        ? "bg-linear-to-br from-indigo-500 to-violet-600 shadow-md shadow-indigo-500/20" 
                        : "bg-gray-100 group-hover:bg-indigo-200"
                    )}>
                      <item.icon className={cn(
                        "h-5 w-5 transition-colors",
                        isActive ? "text-white" : "text-gray-500 group-hover:text-indigo-700"
                      )} />
                    </div>
                    <span className="relative z-10 flex-1">{item.title}</span>
                    {isActive && (
                      <motion.div layoutId="activeChevronDesktop" className="relative z-10">
                        <ChevronRight className="h-4 w-4 text-indigo-400" />
                      </motion.div>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User Section */}
          <div className="mt-auto border-t border-gray-100 p-4">
            <div className="mb-3 flex items-center gap-3 rounded-lg border border-border p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
                {getInitials(user?.name ?? undefined)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{user?.name || tCommon("guestUser")}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email || "user@email.com"}</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3 text-gray-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl h-11 transition-all duration-200"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              {tCommon("logout")}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:pl-72">
        {/* Mobile/Desktop Header */}
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border bg-background/80 backdrop-blur-md px-6">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden hover:bg-gray-100 rounded-xl">
                <Menu className="h-6 w-6 text-gray-600" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
                      <SheetContent side="left" className="w-72 p-0 border-0">
            {/* Accessibility: Hidden title for screen readers */}
            <SheetTitle className="sr-only">{tNav("menu")}</SheetTitle>
            <SheetDescription className="sr-only">{tNav("menu")}</SheetDescription>
            <div className="flex h-full flex-col">
              {/* Logo */}
              <div className="flex h-16 items-center border-b border-border px-6">
                <Link href="/" className="flex items-center gap-3 font-bold text-xl" onClick={() => setOpen(false)}>
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-indigo-500 to-violet-600 shadow-md shadow-indigo-500/20">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-foreground">
                    {tCommon("appName")}
                  </span>
                </Link>
              </div>

              {/* Navigation */}
              <div className="flex-1 overflow-auto py-6 px-4">
                <nav className="space-y-1">
                  {navItems.map((item, index) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={index}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50",
                          isActive 
                            ? "text-indigo-600 shadow-sm" 
                            : "text-gray-600 hover:text-indigo-700"
                        )}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activeNavMobileSheet"
                            className="absolute inset-0 rounded-xl bg-linear-to-r from-indigo-50 to-violet-50 z-0"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        )}
                        <div className={cn(
                          "relative z-10 flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200",
                          isActive 
                            ? "bg-linear-to-br from-indigo-500 to-violet-600 shadow-md shadow-indigo-500/20" 
                            : "bg-gray-100 group-hover:bg-indigo-200"
                        )}>
                          <item.icon className={cn(
                            "h-5 w-5 transition-colors",
                            isActive ? "text-white" : "text-gray-500 group-hover:text-indigo-700"
                          )} />
                        </div>
                        <span className="relative z-10 flex-1">{item.title}</span>
                        {isActive && (
                          <motion.div layoutId="activeChevronMobileSheet" className="relative z-10">
                            <ChevronRight className="h-4 w-4 text-indigo-400" />
                          </motion.div>
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* User Section */}
              <div className="mt-auto border-t border-gray-100 p-4">
                <div className="mb-3 flex items-center gap-3 rounded-xl bg-gray-50 p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-violet-600 text-sm font-semibold text-white shadow-md shadow-indigo-500/20">
                    {getInitials(user?.name ?? undefined)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{user?.name || tCommon("guestUser")}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email || "user@email.com"}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start gap-3 text-gray-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl h-11 transition-all duration-200"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5" />
                  {tCommon("logout")}
                </Button>
              </div>
            </div>
          </SheetContent>
          </Sheet>
          
          {/* Mobile Logo */}
          <div className="flex-1 lg:hidden">
            <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-linear-to-br from-indigo-500 to-violet-600 shadow-sm">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              <span className="text-foreground">
                {tCommon("appName")}
              </span>
            </Link>
          </div>
          
          {/* Desktop Header Right */}
          <div className="hidden lg:flex flex-1 items-center justify-end gap-4">
            <LanguageSwitcher />
          </div>

          {/* User Menu (Mobile) & Lang Switcher */}
          <div className="flex items-center gap-2 lg:hidden">
            <LanguageSwitcher />
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-violet-600 text-sm font-medium text-white shadow-md shadow-indigo-500/20">
              {getInitials(user?.name ?? undefined)}
            </div>
          </div>
        </header>
        
        <main className="flex-1 p-4 lg:p-8">
            <div className="mx-auto max-w-6xl">
                {children}
            </div>
        </main>
      </div>
    </div>
  );
}
