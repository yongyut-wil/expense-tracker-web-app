import { z } from "zod";

export const transactionSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  title: z.string().min(1, "Title is required"),
  date: z.string().min(1, "Date is required"),
  type: z.enum(["INCOME", "EXPENSE"]),
  category: z.string().optional(),
});

export type TransactionInput = z.infer<typeof transactionSchema>;
