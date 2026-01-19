"use client";

import { useEffect, useState } from "react";
import { fetcher } from "@/lib/api";
import { DashboardData } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowDownIcon, ArrowUpIcon, WalletIcon, Plus, TrendingUp, TrendingDown, Sparkles } from "lucide-react";
import { OverviewCharts, OverviewChartsProps } from "@/components/dashboard/OverviewCharts";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";
import { format } from "date-fns";
import { th } from "date-fns/locale";

// Thai month abbreviations
const THAI_MONTHS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

interface Transaction {
  id: number;
  title: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  date: string;
  userId: number;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [pieData, setPieData] = useState<OverviewChartsProps['pieData']>([]);
  console.log("pieData >>" ,pieData)
  const [barData, setBarData] = useState<OverviewChartsProps['barData']>([]);
  console.log("barData >>" ,barData)
  const [chartsLoading, setChartsLoading] = useState(true);
  const user = useAuthStore((state) => state.user);

  // Helper function to get date range for current month
  const getCurrentMonthRange = () => {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    };
  };

  // Helper function to get date range for last 6 months
  const getLast6MonthsRange = () => {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    };
  };

  // Process pie chart data (expense by category for current month)
  const processPieData = (transactions: Transaction[]) => {
    const expensesByCategory: { [key: string]: number } = {};
    
    transactions
      .filter(t => t.type === 'EXPENSE')
      .forEach(t => {
        if (expensesByCategory[t.category]) {
          expensesByCategory[t.category] += t.amount;
        } else {
          expensesByCategory[t.category] = t.amount;
        }
      });

    return Object.entries(expensesByCategory).map(([name, value]) => ({
      name,
      value
    }));
  };

  // Process bar chart data (income vs expense for last 6 months)
  const processBarData = (transactions: Transaction[]) => {
    const monthlyData: { [key: string]: { income: number; expense: number } } = {};
    
    transactions.forEach(t => {
      const date = new Date(t.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth()).padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { income: 0, expense: 0 };
      }
      
      if (t.type === 'INCOME') {
        monthlyData[monthKey].income += t.amount;
      } else {
        monthlyData[monthKey].expense += t.amount;
      }
    });

    // Get last 6 months in order
    const now = new Date();
    const result = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth()).padStart(2, '0')}`;
      const monthName = THAI_MONTHS[date.getMonth()];
      
      result.push({
        name: monthName,
        income: monthlyData[monthKey]?.income || 0,
        expense: monthlyData[monthKey]?.expense || 0
      });
    }
    
    return result;
  };

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

  useEffect(() => {
    async function loadChartData() {
      try {
        setChartsLoading(true);
        
        // Fetch current month data for pie chart
        const currentMonth = getCurrentMonthRange();
        const currentMonthTransactions = await fetcher<Transaction[]>(
          `/transactions/filter?startDate=${currentMonth.startDate}&endDate=${currentMonth.endDate}`
        );
        
        // Fetch last 6 months data for bar chart
        const last6Months = getLast6MonthsRange();
        const last6MonthsTransactions = await fetcher<Transaction[]>(
          `/transactions/filter?startDate=${last6Months.startDate}&endDate=${last6Months.endDate}`
        );
        
        if (currentMonthTransactions) {
          setPieData(processPieData(currentMonthTransactions));
        }
        
        if (last6MonthsTransactions) {
          setBarData(processBarData(last6MonthsTransactions));
        }
      } catch (error) {
        console.error("Failed to load chart data", error);
      } finally {
        setChartsLoading(false);
      }
    }
    
    loadChartData();
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
    transactionCount: 0,
    previousMonthIncome: 0,
    previousMonthExpense: 0,
    incomeChange: 0,
    incomeChangePercent: 0,
    expenseChange: 0,
    expenseChangePercent: 0
  };

  // Helper function to format percentage change
  const formatPercentChange = (percent: number) => {
    // Handle NaN, Infinity, null, or undefined
    if (!isFinite(percent) || percent === null || percent === undefined) {
      return "0.00%";
    }
    const absPercent = Math.abs(percent);
    return `${absPercent.toFixed(2)}%`;
  };

  const currentDate = format(new Date(), "EEEE, d MMMM yyyy", { locale: th });

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            สวัสดี, {user?.name || "User"}
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
            <div className="mt-4 flex items-center gap-1 text-sm">
              {displayData.incomeChangePercent >= 0 ? (
                <>
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                  <span className="text-emerald-600">
                    เพิ่มขึ้น {formatPercentChange(displayData.incomeChangePercent)} จากเดือนก่อน
                  </span>
                </>
              ) : (
                <>
                  <TrendingDown className="h-4 w-4 text-rose-600" />
                  <span className="text-rose-600">
                    ลดลง {formatPercentChange(displayData.incomeChangePercent)} จากเดือนก่อน
                  </span>
                </>
              )}
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
            <div className="mt-4 flex items-center gap-1 text-sm">
              {displayData.expenseChangePercent >= 0 ? (
                <>
                  <TrendingUp className="h-4 w-4 text-rose-600" />
                  <span className="text-rose-600">
                    เพิ่มขึ้น {formatPercentChange(displayData.expenseChangePercent)} จากเดือนก่อน
                  </span>
                </>
              ) : (
                <>
                  <TrendingDown className="h-4 w-4 text-emerald-600" />
                  <span className="text-emerald-600">
                    ลดลง {formatPercentChange(displayData.expenseChangePercent)} จากเดือนก่อน
                  </span>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      {chartsLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <Skeleton className="col-span-4 h-[400px] rounded-2xl" />
          <Skeleton className="col-span-3 h-[400px] rounded-2xl" />
        </div>
      ) : (
        <OverviewCharts pieData={pieData} barData={barData} />
      )}

      {/* Floating Action Button with Pulse */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-indigo-500 animate-ping opacity-25" />
          <Button
            size="icon"
            className="relative text-white h-14 w-14 rounded-full shadow-lg shadow-indigo-500/30 bg-gradient-to-br from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 transition-all duration-300 hover:scale-105"
            onClick={() => window.location.href = '/transactions'}
            aria-label="เพิ่มรายการใหม่"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
}
