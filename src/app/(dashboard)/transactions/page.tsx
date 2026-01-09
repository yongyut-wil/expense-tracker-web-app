"use client";

import { useEffect, useState } from "react";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TransactionInput, transactionSchema } from "@/lib/validations/transaction";
import api from "@/lib/api";
import { toast } from "sonner";
import { format } from "date-fns";
import { th } from "date-fns/locale";

export default function TransactionsPage() {
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
      date: "",
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
        const response = await api.post<ApiResponse<Transaction>>("/transactions", {
          ...data,
          type: selectedType,
        });
        if (response.data.success) {
           toast.success("บันทึกรายการสำเร็จ");
           setTransactions([response.data.data!, ...transactions]);
           setIsDialogOpen(false);
           form.reset();
        } else {
           toast.error(response.data.error?.message || "Failed to create transaction");
        }
      } catch (error) {
        toast.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      }
  }

  const categories = selectedType === "EXPENSE" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            รายการธุรกรรม
          </h2>
          <p className="text-muted-foreground mt-1">จัดการรายรับ-รายจ่ายของคุณ</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 shadow-lg shadow-indigo-500/20 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 transition-all duration-300">
                <PlusIcon className="h-4 w-4" /> เพิ่มรายการ
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">เพิ่มรายการใหม่</DialogTitle>
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
                  รายจ่าย
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
                  รายรับ
                </button>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-gray-700">รายละเอียด</Label>
                <Input 
                  id="title" 
                  placeholder="เช่น ค่าอาหารกลางวัน" 
                  className="h-11"
                  {...form.register("title")} 
                />
                {form.formState.errors.title && (
                  <p className="text-xs text-red-500">{form.formState.errors.title.message}</p>
                )}
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-gray-700">จำนวนเงิน (บาท)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500 text-lg">฿</span>
                  <Input 
                    type="number" 
                    id="amount" 
                    placeholder="0.00" 
                    className="pl-8 h-11 text-lg font-semibold"
                    {...form.register("amount")} 
                  />
                </div>
                {form.formState.errors.amount && (
                  <p className="text-xs text-red-500">{form.formState.errors.amount.message}</p>
                )}
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label className="text-gray-700">หมวดหมู่</Label>
                <Select 
                  onValueChange={(val) => form.setValue("category", val)} 
                  defaultValue={form.getValues("category")}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="เลือกหมวดหมู่" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => {
                      const Icon = cat.icon;
                      return (
                        <SelectItem key={cat.id} value={cat.label} className="py-2.5">
                          <div className="flex items-center gap-2">
                            <div className={cn("p-1.5 rounded-lg", cat.bg)}>
                              <Icon className={cn("h-4 w-4", cat.color)} />
                            </div>
                            <span>{cat.label}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-lg shadow-indigo-500/25"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "กำลังบันทึก..." : "บันทึกรายการ"}
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
            placeholder="ค้นหารายการ..." 
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
                  ตัวกรอง
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-xl">
                <DropdownMenuLabel>ประเภทรายการ</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={filterType} onValueChange={setFilterType}>
                  <DropdownMenuRadioItem value="ALL">ทั้งหมด</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="INCOME">รายรับ</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="EXPENSE">รายจ่าย</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
           </DropdownMenu>

           <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 flex-1 sm:flex-none h-11 rounded-xl border-gray-200 hover:bg-gray-50">
                  <SlidersHorizontal className="h-4 w-4" />
                  เรียงลำดับ
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-xl">
                <DropdownMenuLabel>เรียงลำดับตาม</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={sortOrder} onValueChange={setSortOrder}>
                  <DropdownMenuRadioItem value="newest">ล่าสุดก่อน</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="oldest">เก่าสุดก่อน</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="highest">ยอดเงินสูงสุด</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="lowest">ยอดเงินต่ำสุด</DropdownMenuRadioItem>
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
                <p className="mt-4 text-muted-foreground">กำลังโหลดข้อมูล...</p>
             </div>
        ) : transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                <div className="rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 p-8 mb-6">
                    <Receipt className="h-12 w-12 text-indigo-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">ยังไม่มีรายการ</h3>
                <p className="text-muted-foreground max-w-sm mt-2 mb-6">
                  เริ่มจดบันทึกรายรับ-รายจ่ายรายการแรกของคุณได้เลย
                </p>
                <Button 
                  onClick={() => setIsDialogOpen(true)}
                  className="gap-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 shadow-lg shadow-indigo-500/20"
                >
                  <PlusIcon className="h-4 w-4" />
                  เริ่มบันทึกรายการ
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
                      className="group flex items-center justify-between p-4 transition-all duration-200 hover:bg-gray-50/80"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                        <div className="flex items-center gap-4">
                            <div className={cn(
                                "flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-200 group-hover:scale-105",
                                categoryConfig.bg,
                                categoryConfig.color
                            )}>
                                <Icon className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">{tx.title}</p>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                  <Calendar className="h-3.5 w-3.5" />
                                  <span>{format(new Date(tx.date), "dd MMM yyyy", { locale: th })}</span>
                                  <span className="text-gray-300">•</span>
                                  <Tag className="h-3.5 w-3.5" />
                                  <span>{tx.category}</span>
                                </div>
                            </div>
                        </div>
                        <div className={cn(
                          "text-lg font-bold transition-transform duration-200 group-hover:scale-105",
                          tx.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'
                        )}>
                            {tx.type === 'INCOME' ? '+' : '-'}{tx.amount.toLocaleString()} ฿
                        </div>
                    </div>
                );})}
                {filteredTransactions.length === 0 && (
                  <div className="p-12 text-center text-muted-foreground">
                    <Search className="h-8 w-8 mx-auto mb-3 text-gray-300" />
                    <p>ไม่พบรายการที่ค้นหา</p>
                  </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
}
