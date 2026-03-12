import { z } from "zod";

export const transactionSchema = z.object({
  amount: z.number().positive("validation.amountPositive"),
  title: z.string().min(1, "validation.titleRequired"),
  date: z.string().min(1, "validation.dateRequired"),
  type: z.enum(["INCOME", "EXPENSE"]),
  category: z.string().optional(),
});

export type TransactionInput = z.infer<typeof transactionSchema>;
