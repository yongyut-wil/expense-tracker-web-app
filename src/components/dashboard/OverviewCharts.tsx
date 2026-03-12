"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, PieChartIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { getCategoryConfig } from '@/lib/categories';



// Theme-consistent colors (Indigo/Violet palette)
const COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#c084fc'];

export interface OverviewChartsProps {
  pieData?: { name: string; value: number }[];
  barData?: { name: string; income: number; expense: number }[];
}

export function OverviewCharts({ pieData = [], barData = [] }: OverviewChartsProps) {
  const t = useTranslations("Dashboard");
  const tTrans = useTranslations("Transactions");
  const tCat = useTranslations("Categories");
  const tCommon = useTranslations("Common");

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-lg p-3">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => {
            // Determine if this is a pie chart entry (which has category IDs) or a bar chart entry
            const isPieChart = entry.payload && entry.payload.name && !('income' in entry.payload);
            const displayName = isPieChart ? tCat(entry.name as any) : entry.name;
            
            return (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-gray-600">{displayName}:</span>
                <span className="font-semibold text-gray-900">{tCommon("thailandBaht")}{entry.value.toLocaleString()}</span>
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
      {/* Bar Chart - Income vs Expense */}
      <Card className="col-span-4 rounded-2xl border-0 shadow-lg shadow-gray-200/50 overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-violet-600">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">{t("incomeVsExpense")}</CardTitle>
              <p className="text-sm text-muted-foreground">{t("last6Months")}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={barData} barGap={8}>
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                  <stop offset="100%" stopColor="#059669" stopOpacity={1} />
                </linearGradient>
                <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity={1} />
                  <stop offset="100%" stopColor="#e11d48" stopOpacity={1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickFormatter={(value) => `${tCommon("thailandBaht")}${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }} />
              <Legend
                wrapperStyle={{ paddingTop: 20 }}
                formatter={(value) => <span className="text-gray-600 text-sm">{value}</span>}
              />
              <Bar
                dataKey="income"
                name={tTrans("income")}
                fill="url(#incomeGradient)"
                radius={[8, 8, 0, 0]}
                maxBarSize={40}
              />
              <Bar
                dataKey="expense"
                name={tTrans("expense")}
                fill="url(#expenseGradient)"
                radius={[8, 8, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Pie Chart - Expense by Category */}
      <Card className="col-span-3 rounded-2xl border-0 shadow-lg shadow-gray-200/50 overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-violet-500 to-purple-600">
              <PieChartIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">{t("expenseByCategory")}</CardTitle>
              <p className="text-sm text-muted-foreground">{t("thisMonth")}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <defs>
                {COLORS.map((color, index) => (
                  <linearGradient key={`gradient-${index}`} id={`pieGradient${index}`} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={1} />
                    <stop offset="100%" stopColor={color} stopOpacity={0.8} />
                  </linearGradient>
                ))}
              </defs>
              <Pie
                data={pieData}
                cx="50%"
                cy="45%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={4}
                dataKey="value"
                nameKey="name"
                strokeWidth={0}
              >
                {pieData.map((entry: any, index: number) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`url(#pieGradient${index % COLORS.length})`}
                    className="transition-all duration-300 hover:opacity-80"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={50}
                formatter={(value) => {
                  try {
                    return <span className="text-gray-600 text-sm">{tCat(value as any)}</span>;
                  } catch (e) {
                    return <span className="text-gray-600 text-sm">{value}</span>;
                  }
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
