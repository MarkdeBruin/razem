import { getLedgerTemplate } from "$lib/services/ledgerTemplates";
import { error } from "@sveltejs/kit";


export async function load({ params }) {
  const template = await getLedgerTemplate(params.id);
  if (!template) error(404, { message: 'Ledger not found' });
  
  return { template };
}