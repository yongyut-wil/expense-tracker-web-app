import { 
  Utensils, 
  Car, 
  ShoppingBag, 
  Clapperboard, 
  Zap, 
  Stethoscope, 
  GraduationCap, 
  Package,
  Briefcase,
  Laptop,
  TrendingUp,
  Gift
} from "lucide-react";

export const EXPENSE_CATEGORIES = [
  { id: "food", label: "Food & Dining", icon: Utensils, color: "text-orange-500", bg: "bg-orange-100" },
  { id: "transport", label: "Transportation", icon: Car, color: "text-blue-500", bg: "bg-blue-100" },
  { id: "shopping", label: "Shopping", icon: ShoppingBag, color: "text-pink-500", bg: "bg-pink-100" },
  { id: "entertainment", label: "Entertainment", icon: Clapperboard, color: "text-purple-500", bg: "bg-purple-100" },
  { id: "bills", label: "Bills & Utilities", icon: Zap, color: "text-yellow-500", bg: "bg-yellow-100" },
  { id: "healthcare", label: "Healthcare", icon: Stethoscope, color: "text-red-500", bg: "bg-red-100" },
  { id: "education", label: "Education", icon: GraduationCap, color: "text-indigo-500", bg: "bg-indigo-100" },
  { id: "other_expense", label: "Other", icon: Package, color: "text-gray-500", bg: "bg-gray-100" },
];

export const INCOME_CATEGORIES = [
  { id: "salary", label: "Salary", icon: Briefcase, color: "text-green-600", bg: "bg-green-100" },
  { id: "freelance", label: "Freelance", icon: Laptop, color: "text-cyan-500", bg: "bg-cyan-100" },
  { id: "investment", label: "Investment", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-100" },
  { id: "gift", label: "Gift", icon: Gift, color: "text-rose-500", bg: "bg-rose-100" },
  { id: "other_income", label: "Other", icon: Package, color: "text-gray-500", bg: "bg-gray-100" },
];

export function getCategoryConfig(categoryLabel: string, type: "INCOME" | "EXPENSE") {
  const categories = type === "INCOME" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  // Try to find by label match or default to 'other'
  const config = categories.find(c => c.label === categoryLabel) || 
                 categories.find(c => c.id.includes("other"))!;
  return config;
}
