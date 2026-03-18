import type { Expense, NewExpense } from '$lib/types';
import { notFoundError } from '$lib/utils/errors';

import { mockExpenses } from '$lib/mock/data';

export async function getExpenses(ledgerId: string): Promise<Expense[]> {
	return mockExpenses.filter((expense) => expense.ledgerId === ledgerId);
}

export async function getExpense(id: string): Promise<Expense> {
	const expense = mockExpenses.find((expense) => expense.id === id);

	if (!expense) throw notFoundError('Expense', id);

	return expense;
}

export async function createExpense(expense: NewExpense): Promise<Expense> {
	const newExpense: Expense = {
		...expense,
		id: `exp-${crypto.randomUUID()}`
	};
	mockExpenses.push(newExpense);
	return newExpense;
}

export async function updateExpense(id: string, data: NewExpense): Promise<Expense> {
	const index = mockExpenses.findIndex((expense) => expense.id === id);

	if (index === -1) throw notFoundError('Expense', id);

	const updatedExpense: Expense = { ...data, id };
	mockExpenses[index] = updatedExpense;

	return updatedExpense;
}

export async function deleteExpense(id: string): Promise<void> {
	const index = mockExpenses.findIndex((expense) => expense.id === id);

	if (index === -1) throw notFoundError('Expense', id);

	mockExpenses.splice(index, 1);
}
