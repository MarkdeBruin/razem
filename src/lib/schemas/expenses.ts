import * as z from "zod";

export const newExpenseSchema = z.object({
  description: z.string().min(1),
  amount: z.coerce.number().positive(),
  userId: z.string(),
  ledgerId: z.string(),
  categoryId: z.string(),
});

export const expenseSchema = newExpenseSchema.extend({
  id: z.string(),
});

export type NewExpense = z.infer<typeof newExpenseSchema>;
export type Expense = z.infer<typeof expenseSchema>;