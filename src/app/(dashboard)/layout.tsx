"use client";

import Link from "next/link";
import { useAuthStore } from "@/stores/auth-store";
import { useRouter, usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Receipt, 
  LogOut, 
  Menu, 
  Wallet,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  {
    title: "ภาพรวม",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "รายการธุรกรรม",
    href: "/transactions",
    icon: Receipt,
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

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
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/20">
            <Wallet className="h-5 w-5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            ExpenseTracker
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
                  "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-gradient-to-r from-indigo-50 to-violet-50 text-indigo-600 shadow-sm" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <div className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200",
                  isActive 
                    ? "bg-gradient-to-br from-indigo-500 to-violet-600 shadow-md shadow-indigo-500/20" 
                    : "bg-gray-100 group-hover:bg-gray-200"
                )}>
                  <item.icon className={cn(
                    "h-5 w-5 transition-colors",
                    isActive ? "text-white" : "text-gray-500 group-hover:text-gray-700"
                  )} />
                </div>
                <span className="flex-1">{item.title}</span>
                {isActive && (
                  <ChevronRight className="h-4 w-4 text-indigo-400" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Section */}
      <div className="mt-auto border-t border-gray-100 p-4">
        <div className="mb-3 flex items-center gap-3 rounded-xl bg-gray-50 p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-semibold text-white shadow-md shadow-indigo-500/20">
            {getInitials(user?.name)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.name || "User"}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email || "user@email.com"}</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 text-gray-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl h-11 transition-all duration-200"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          ออกจากระบบ
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/80">
      {/* Desktop Sidebar */}
      <div className="hidden border-r border-gray-100 bg-white/80 backdrop-blur-xl lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col shadow-xl shadow-gray-200/50">
          <NavContent />
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:pl-72">
        {/* Mobile/Desktop Header */}
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-gray-100 bg-white/80 backdrop-blur-xl px-6 shadow-sm">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden hover:bg-gray-100 rounded-xl">
                <Menu className="h-6 w-6 text-gray-600" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0 border-0">
               <NavContent />
            </SheetContent>
          </Sheet>
          
          {/* Mobile Logo */}
          <div className="flex-1 lg:hidden">
            <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600">
                <Wallet className="h-4 w-4 text-white" />
              </div>
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                ExpenseTracker
              </span>
            </Link>
          </div>
          
          {/* Desktop Header Right */}
          <div className="hidden lg:flex flex-1 items-center justify-end gap-4">
            {/* Could add notifications, search, etc. here */}
          </div>

          {/* User Menu (Mobile) */}
          <div className="flex items-center gap-3 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-medium text-white shadow-md shadow-indigo-500/20">
              {getInitials(user?.name)}
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
