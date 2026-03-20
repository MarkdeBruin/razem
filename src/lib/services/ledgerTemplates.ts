import type { LedgerTemplate, NewLedgerTemplate } from '$lib/types';
import { notFoundError } from '$lib/utils/errors';

import { mockTemplates } from '$lib/mock/data';

export async function getLedgerTemplates(): Promise<LedgerTemplate[]> {
	return mockTemplates;
}

export async function getLedgerTemplate(id: string): Promise<LedgerTemplate | undefined> {
	return mockTemplates.find((template) => template.id === id);
}

export async function createLedgerTemplate(template: NewLedgerTemplate): Promise<LedgerTemplate> {
	const newTemplate: LedgerTemplate = {
		...template,
		id: `template-${crypto.randomUUID()}`
	};

	mockTemplates.push(newTemplate);

	return newTemplate;
}

export async function updateLedgerTemplate(id: string, data: NewLedgerTemplate): Promise<LedgerTemplate> {
	const index = mockTemplates.findIndex((template) => template.id === id);

	if (index === -1) throw notFoundError('Tempalte', id);

	const updatedTemplate: LedgerTemplate = { ...data, id };
	mockTemplates[index] = updatedTemplate;

	return mockTemplates[index];
}

export async function deleteLedgerTemplate(id: string): Promise<void> {
	const index = mockTemplates.findIndex((template) => template.id === id);

	if (index === -1) throw notFoundError('Tempalte', id);

	mockTemplates.splice(index, 1);
}