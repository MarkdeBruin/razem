import * as z from "zod";

export const categorySchema = z.object({
  id: z.string(),
  name: z.string().min(1),
});

export type Category = z.infer<typeof categorySchema>;

export const newKeywordSchema = z.object({
  name: z.string().min(1),
  categoryId: z.string(),
});

export const keywordSchema = newKeywordSchema.extend({
  id: z.string(),
});

export type NewKeyword = z.infer<typeof newKeywordSchema>;
export type Keyword = z.infer<typeof keywordSchema>;