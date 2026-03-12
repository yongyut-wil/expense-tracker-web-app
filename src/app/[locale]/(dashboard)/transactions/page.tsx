"use client";

import React, { useEffect, useState } from "react";
import { fetcher } from "@/lib/api";
import { Transaction, ApiResponse } from "@/types";
import { Button } from "@/components/ui/button";
import { PlusIcon, Receipt, Calendar, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { getCategoryConfig, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/lib/categories";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuRadioGroup, 
  DropdownMenuRadioItem 
} from "@/components/ui/dropdown-menu";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TransactionInput, transactionSchema } from "@/lib/validations/transaction";
import api from "@/lib/api";
import { toast } from "sonner";
import { format } from "date-fns";
import { th, enUS } from "date-fns/locale";
import { useTranslations, useLocale } from "next-intl";

export default function TransactionsPage() {
  const t = useTranslations("Transactions");
  const tCommon = useTranslations("Common");
  const tCat = useTranslations("Categories");
  const locale = useLocale() as 'en' | 'th';
  const dfLocale = locale === 'th' ? th : enUS;
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadTransactions() {
    try {
        const data = await fetcher<Transaction[]>("/transactions");
        if (data) setTransactions(data);
    } catch (error) {
        console.error(error);
    } finally {
        setLoading(false);
    }
  }

  useEffect(() => {
    loadTransactions();
  }, []);

  const form = useForm<TransactionInput>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: 0,
      title: "",
      type: "EXPENSE",
      category: "Food & Dining",
      date: new Date().toISOString(),
    }
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [sortOrder, setSortOrder] = useState("newest");
  const [selectedType, setSelectedType] = useState<"EXPENSE" | "INCOME">("EXPENSE");

  const filteredTransactions = transactions
    .filter(tx => {
      const matchesSearch = tx.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            tx.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === "ALL" || tx.type === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (sortOrder === "newest") return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortOrder === "oldest") return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortOrder === "highest") return b.amount - a.amount;
      if (sortOrder === "lowest") return a.amount - b.amount;
      return 0;
    });

  async function onSubmit(data: TransactionInput) {
      try {
        const payload = {
          ...data,
          type: selectedType,
        };
        // console.log("Submitting transaction:", payload);
        
        const response = await api.post<ApiResponse<Transaction>>("/transactions", payload);
        if (response.data.success) {
           toast.success(tCommon("save"));
           setTransactions([response.data.data!, ...transactions]);
           setIsDialogOpen(false);
           form.reset();
        } else {
           console.error("API Error:", response.data.error);
           toast.error(response.data.error?.message || "Failed to create transaction");
        }
      } catch (error: any) {
        console.error("Request failed:", error.response?.data || error.message);
        const errorMessage = error.response?.data?.error?.message 
          || error.response?.data?.message 
          || tCommon("error");
        toast.error(errorMessage);
      }
  }

  const categories = selectedType === "EXPENSE" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            {t("title")}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">{t("subtitle")}</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 w-full sm:w-auto text-white shadow-lg shadow-indigo-500/20 bg-linear-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 transition-all duration-300">
                <PlusIcon className="h-4 w-4" /> {t("addTransaction")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">{t("form.newTransaction")}</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 pt-4">
              {/* Type Toggle */}
              <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setSelectedType("EXPENSE")}
                  className={cn(
                    "flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                    selectedType === "EXPENSE"
                      ? "bg-white shadow-sm text-rose-600"
                      : "text-gray-500 hover:text-gray-700"
                  )}
                >
                  {t("form.type.expense")}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedType("INCOME")}
                  className={cn(
                    "flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                    selectedType === "INCOME"
                      ? "bg-white shadow-sm text-emerald-600"
                      : "text-gray-500 hover:text-gray-700"
                  )}
                >
                  {t("form.type.income")}
                </button>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-gray-700">{t("form.description")}</Label>
                <Input 
                  id="title" 
                  placeholder={ selectedType === "EXPENSE" ? t("form.descriptionPlaceholder.expense") : t("form.descriptionPlaceholder.income")} 
                  className="h-11"
                  {...form.register("title")} 
                />
                {form.formState.errors.title && (
                  <p className="text-xs text-red-500">{t(`form.${form.formState.errors.title.message}` as any)}</p>
                )}
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-gray-700">{t("form.amount")}</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500 text-lg">{tCommon("thailandBaht")}</span>
                  <Controller
                    control={form.control}
                    name="amount"
                    render={({ field: { onChange, value, ...field } }) => (
                      <Input 
                        {...field}
                        type="text" 
                        id="amount" 
                        placeholder="0.00" 
                        className="pl-8 h-11 text-lg font-semibold"
                        value={value === 0 ? "" : value.toLocaleString()}
                        onChange={(e) => {
                          const val = e.target.value.replace(/,/g, "");
                          if (val === "" || !isNaN(Number(val))) {
                            onChange(val === "" ? 0 : Number(val));
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "ArrowUp") {
                            e.preventDefault();
                            onChange(value + 1);
                          } else if (e.key === "ArrowDown") {
                            e.preventDefault();
                            if (value > 0) {
                              onChange(Math.max(0, value - 1));
                            }
                          }
                        }}
                      />
                    )}
                  />
                </div>
                {form.formState.errors.amount && (
                  <p className="text-xs text-red-500">{t(`form.${form.formState.errors.amount.message}` as any)}</p>
                )}
              </div>

              {/* Date Picker */}
              <div className="space-y-2">
                 <Label className="text-gray-700">{t("form.date")}</Label>
                 <Controller
                    control={form.control}
                    name="date"
                    render={({ field }) => {
                      const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);
                      return (
                      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full h-11 pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), "dd MMM yyyy", { locale: dfLocale })
                            ) : (
                              <span>{t("form.selectDate")}</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={field.value ? new Date(field.value) : undefined}
                            onSelect={(date) => {
                              field.onChange(date?.toISOString());
                              setIsCalendarOpen(false);
                            }}
                            disabled={(date: Date) => date > new Date() || date < new Date("1900-01-01")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    );}}
                  />
                 {form.formState.errors.date && (
                    <p className="text-xs text-red-500">{t(`form.${form.formState.errors.date.message}` as any)}</p>
                 )}
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label className="text-gray-700">{t("form.category")}</Label>
                <Select 
                  onValueChange={(val) => form.setValue("category", val)} 
                  defaultValue={form.getValues("category")}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder={t("form.selectCategory")} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat: any) => {
                      const Icon = cat.icon;
                      return (
                        <SelectItem key={cat.id} value={cat.label} className="py-2.5">
                          <div className="flex items-center gap-2">
                            <div className={cn("p-1.5 rounded-lg", cat.bg)}>
                              <Icon className={cn("h-4 w-4", cat.color)} />
                            </div>
                            <span>{tCat(cat.id)}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-base text-white font-semibold bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-lg shadow-indigo-500/25"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? tCommon("saving") : tCommon("save")}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <Input 
            placeholder={t("searchPlaceholder")} 
            className="pl-10 h-11 bg-gray-50 border-gray-200 rounded-xl focus:ring-indigo-500/20" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
           <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 flex-1 sm:flex-none h-11 rounded-xl border-gray-200 hover:bg-gray-50">
                  <Filter className="h-4 w-4" />
                  {t("filter")}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-xl">
                <DropdownMenuLabel>{t("filter")}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={filterType} onValueChange={setFilterType}>
                  <DropdownMenuRadioItem value="ALL">{t("all")}</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="INCOME">{t("income")}</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="EXPENSE">{t("expense")}</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
           </DropdownMenu>

           <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 flex-1 sm:flex-none h-11 rounded-xl border-gray-200 hover:bg-gray-50">
                  <SlidersHorizontal className="h-4 w-4" />
                  {t("sort")}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-xl">
                <DropdownMenuLabel>{t("sort")}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={sortOrder} onValueChange={setSortOrder}>
                  <DropdownMenuRadioItem value="newest">{t("sortBy.newest")}</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="oldest">{t("sortBy.oldest")}</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="highest">{t("sortBy.highest")}</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="lowest">{t("sortBy.lowest")}</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
           </DropdownMenu>
        </div>
      </div>

      {/* Transaction List */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden min-h-[400px]">
        {loading ? (
             <div className="flex flex-col items-center justify-center py-20">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
                <p className="mt-4 text-muted-foreground">{tCommon("loading")}</p>
             </div>
        ) : transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                <div className="rounded-full bg-linear-to-br from-indigo-100 to-violet-100 p-8 mb-6">
                    <Receipt className="h-12 w-12 text-indigo-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{tCommon("noData")}</h3>
                <p className="text-muted-foreground max-w-sm mt-2 mb-6">
                  {t("startFirst")}
                </p>
                <Button 
                  onClick={() => setIsDialogOpen(true)}
                  className="gap-2 bg-linear-to-r text-white from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 border-0 shadow-[0_4px_14px_0_rgb(99,102,241,0.39)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.23)] hover:-translate-y-0.5 transition-all duration-200"
                >
                  <PlusIcon className="h-4 w-4" />
                  {t("addTransaction")}
                </Button>
            </div>
        ) : (
            <div className="divide-y divide-gray-100">
                {filteredTransactions.map((tx, index) => {
                    const categoryConfig = getCategoryConfig(tx.category, tx.type);
                    const Icon = categoryConfig.icon;
                    return (
                    <div 
                      key={tx.id} 
                      className="group flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 gap-3 sm:gap-4 transition-all duration-200 hover:bg-gray-50/80"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                            <div className={cn(
                                "flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl transition-all duration-200 group-hover:scale-105",
                                categoryConfig.bg,
                                categoryConfig.color
                            )}>
                                <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 truncate">{tx.title}</p>
                                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm text-gray-500 mt-0.5">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                    <span>{format(new Date(tx.date), "dd MMM yy", { locale: dfLocale })}</span>
                                  </div>
                                  <span className="text-gray-300 hidden sm:inline">•</span>
                                  <div className="flex items-center gap-1">
                                    <Tag className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                    <span className="truncate max-w-[100px] sm:max-w-none">
                                      {tCat(getCategoryConfig(tx.category, tx.type).id)}
                                    </span>
                                  </div>
                                </div>
                            </div>
                        </div>
                        <div className={cn(
                          "text-base sm:text-lg font-bold transition-transform duration-200 group-hover:scale-105 shrink-0 text-right sm:text-left",
                          tx.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'
                        )}>
                            {tx.type === 'INCOME' ? '+' : '-'}{tx.amount.toLocaleString()} {tCommon("thailandBaht")}
                        </div>
                    </div>
                );})}
                {filteredTransactions.length === 0 && (
                  <div className="p-12 text-center text-muted-foreground">
                    <Search className="h-8 w-8 mx-auto mb-3 text-gray-300" />
                    <p>{t("noResults")}</p>
                  </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
}
