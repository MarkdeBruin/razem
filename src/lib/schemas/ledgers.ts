import * as z from "zod";

const newLedgerSchema = z.object({
	name: z.string().min(1),
	ownerFraction: z.coerce.number().min(0).max(1),
	isTemplate: z.boolean(),
});

export const ledgerSchema = newLedgerSchema.extend({
  id: z.string(),
});

export type NewLedger = z.infer<typeof newLedgerSchema>;
export type Ledger = z.infer<typeof ledgerSchema>;