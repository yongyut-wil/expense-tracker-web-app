"use client";

import { useEffect, useState } from "react";
import { fetcher } from "@/lib/api";
import { DashboardData } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowDownIcon, ArrowUpIcon, WalletIcon, Plus, TrendingUp, TrendingDown, Sparkles } from "lucide-react";
import { OverviewCharts } from "@/components/dashboard/OverviewCharts";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";
import { format } from "date-fns";
import { th } from "date-fns/locale";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    async function loadDashboard() {
        try {
            const dashboardData = await fetcher<DashboardData>("/transactions/dashboard");
            if (dashboardData) {
                setData(dashboardData);
            }
        } catch (error) {
            console.error("Failed to load dashboard data", error);
        } finally {
            setLoading(false);
        }
    }
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
      </div>
    );
  }

  const displayData = data || {
      balance: 0,
      totalIncome: 0,
      totalExpense: 0,
      transactionCount: 0
  };

  const currentDate = format(new Date(), "EEEE, d MMMM yyyy", { locale: th });

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            สวัสดี, {user?.name || "User"} 👋
          </h2>
          <Sparkles className="h-6 w-6 text-amber-400" />
        </div>
        <p className="text-muted-foreground">{currentDate}</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Balance Card */}
        <Card className="group relative overflow-hidden rounded-2xl border-0 bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-xl shadow-indigo-500/20 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/30 hover:-translate-y-1">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent" />
          <CardContent className="relative p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-indigo-100">ยอดเงินคงเหลือ</p>
                <div className="text-3xl font-bold">{displayData.balance.toLocaleString()} ฿</div>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                <WalletIcon className="h-7 w-7 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1 text-sm text-indigo-100">
              <TrendingUp className="h-4 w-4" />
              <span>{displayData.transactionCount || 0} รายการในเดือนนี้</span>
            </div>
          </CardContent>
        </Card>

        {/* Income Card */}
        <Card className="group relative overflow-hidden rounded-2xl border-0 bg-white shadow-lg shadow-gray-200/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
          <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-emerald-500/10 blur-2xl" />
          <CardContent className="relative p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">รายรับทั้งหมด</p>
                <div className="text-3xl font-bold text-emerald-600">+{displayData.totalIncome.toLocaleString()} ฿</div>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 transition-colors group-hover:bg-emerald-200">
                <ArrowUpIcon className="h-7 w-7 text-emerald-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1 text-sm text-emerald-600">
              <TrendingUp className="h-4 w-4" />
              <span>เพิ่มขึ้นจากเดือนก่อน</span>
            </div>
          </CardContent>
        </Card>

        {/* Expense Card */}
        <Card className="group relative overflow-hidden rounded-2xl border-0 bg-white shadow-lg shadow-gray-200/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
          <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-rose-500/10 blur-2xl" />
          <CardContent className="relative p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">รายจ่ายทั้งหมด</p>
                <div className="text-3xl font-bold text-rose-600">-{displayData.totalExpense.toLocaleString()} ฿</div>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 transition-colors group-hover:bg-rose-200">
                <ArrowDownIcon className="h-7 w-7 text-rose-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1 text-sm text-rose-600">
              <TrendingDown className="h-4 w-4" />
              <span>ลดลงจากเดือนก่อน</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <OverviewCharts />

      {/* Floating Action Button with Pulse */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-indigo-500 animate-ping opacity-25" />
          <Button 
            size="icon" 
            className="relative h-14 w-14 rounded-full shadow-lg shadow-indigo-500/30 bg-gradient-to-br from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 transition-all duration-300 hover:scale-105"
            onClick={() => window.location.href = '/transactions'}
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
}
