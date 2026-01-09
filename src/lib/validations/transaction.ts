import { z } from "zod";

export const transactionSchema = z.object({
  amount: z.coerce.number().positive("Amount must be positive"),
  title: z.string().min(1, "Title is required"),
  date: z.date(),
  type: z.enum(["INCOME", "EXPENSE"]),
  category: z.string().optional(),
});

export type TransactionInput = {
    amount: number;
    title: string;
    date: Date;
    type: "INCOME" | "EXPENSE";
    category?: string;
};
