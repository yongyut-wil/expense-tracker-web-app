"use client";

import { useEffect, useState } from "react";
import { fetcher } from "@/lib/api";
import { DashboardData } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowDownIcon, ArrowUpIcon, WalletIcon, Plus, TrendingUp, TrendingDown } from "lucide-react";
import { OverviewCharts, OverviewChartsProps } from "@/components/dashboard/OverviewCharts";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";
import { format } from "date-fns";
import { th, enUS } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { useTranslations, useLocale } from "next-intl";


interface Transaction {
  id: number;
  title: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  date: string;
  userId: number;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

export default function DashboardPage() {
  const t = useTranslations("Dashboard");
  const tCommon = useTranslations("Common");
  const locale = useLocale() as 'en' | 'th';
  const months = t.raw("months") as string[];
  
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [pieData, setPieData] = useState<OverviewChartsProps['pieData']>([]);
  const [barData, setBarData] = useState<OverviewChartsProps['barData']>([]);
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
      const monthName = months[date.getMonth()];
      
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

  const formatPercentChange = (percent: number) => {
    if (!isFinite(percent) || percent === null || percent === undefined) {
      return "0.00%";
    }
    const absPercent = Math.abs(percent);
    return `${absPercent.toFixed(2)}%`;
  };

  const currentDate = format(new Date(), "EEEE, d MMMM yyyy", { 
    locale: locale === 'th' ? th : enUS 
  });

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-1"
      >
        <h2 className="text-3xl font-bold tracking-tight text-foreground">
          {t("welcome")}, {user?.name || "User"}
        </h2>
        <p className="text-muted-foreground">{currentDate}</p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-4 md:grid-cols-3"
      >
        {/* Balance Card */}
        <motion.div variants={itemVariants}>
          <Card className="relative overflow-hidden rounded-lg border border-border bg-background shadow-none transition-all duration-200 hover:border-primary/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{t("balance")}</p>
                  <div className="text-3xl font-bold">
                    <AnimatedNumber value={displayData.balance} suffix={` ${tCommon("thailandBaht")}`} />
                  </div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <WalletIcon className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4 text-emerald-500" />
                <span>{t("itemsThisMonth", { count: displayData.transactionCount || 0 })}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Income Card */}
        <motion.div variants={itemVariants}>
          <Card className="relative overflow-hidden rounded-lg border border-border bg-background shadow-none transition-all duration-200 hover:border-emerald-500/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{t("income")}</p>
                  <div className="text-3xl font-bold text-emerald-600">
                    <AnimatedNumber value={displayData.totalIncome} prefix="+" suffix={` ${tCommon("thailandBaht")}`} />
                  </div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100/50">
                  <ArrowUpIcon className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-sm">
                {displayData.incomeChangePercent >= 0 ? (
                  <>
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                    <span className="text-emerald-600">
                      {t("increaseFromLastMonth", { percent: formatPercentChange(displayData.incomeChangePercent) })}
                    </span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-4 w-4 text-rose-600" />
                    <span className="text-rose-600">
                      {t("decreaseFromLastMonth", { percent: formatPercentChange(displayData.incomeChangePercent) })}
                    </span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Expense Card */}
        <motion.div variants={itemVariants}>
          <Card className="relative overflow-hidden rounded-lg border border-border bg-background shadow-none transition-all duration-200 hover:border-rose-500/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{t("expense")}</p>
                  <div className="text-3xl font-bold text-rose-600">
                    <AnimatedNumber value={displayData.totalExpense} prefix="-" suffix={` ${tCommon("thailandBaht")}`} />
                  </div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-rose-100/50">
                  <ArrowDownIcon className="h-6 w-6 text-rose-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-sm">
                {displayData.expenseChangePercent >= 0 ? (
                  <>
                    <TrendingUp className="h-4 w-4 text-rose-600" />
                    <span className="text-rose-600">
                      {t("increaseFromLastMonth", { percent: formatPercentChange(displayData.expenseChangePercent) })}
                    </span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-4 w-4 text-emerald-600" />
                    <span className="text-emerald-600">
                      {t("decreaseFromLastMonth", { percent: formatPercentChange(displayData.expenseChangePercent) })}
                    </span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Charts Section */}
      <AnimatePresence>
        {!chartsLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <OverviewCharts pieData={pieData} barData={barData} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button with Pulse */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Button
            size="icon"
            className="h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 transition-all duration-200 hover:scale-110 active:scale-95 shadow-primary/20"
            onClick={() => window.location.href = `/${locale}/transactions`}
            aria-label={t("addTransaction")}
          >
            <Plus className="h-6 w-6" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
