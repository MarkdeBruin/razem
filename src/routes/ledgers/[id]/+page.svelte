<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const totalExpenses = $derived(data.expenses.reduce((sum, expense) => sum + expense.amount, 0));

	function totalByUser(userId: string): number {
		return data.expenses
			.filter((expense) => expense.userId === userId)
			.reduce((sum, expense) => sum + expense.amount, 0);
	}

	const ownerTotal = $derived(totalByUser(data.owner.id));
	const partnerTotal = $derived(totalByUser(data.partner.id));

	const ownerShare = $derived(totalExpenses * data.ledger.ownerFraction);
	const partnerShare = $derived(totalExpenses * (1 - data.ledger.ownerFraction));

	const ownerBalance = $derived(ownerTotal - ownerShare);
	const partnerBalance = $derived(partnerTotal - partnerShare);

	const currentBalance = $derived(
		data.currentUser.id === data.owner.id ? ownerBalance : partnerBalance
	);
	const otherBalance = $derived(
		data.currentUser.id === data.owner.id ? partnerBalance : ownerBalance
	);
	const otherUser = $derived(data.currentUser.id === data.owner.id ? data.partner : data.owner);

	function formatSplit(ownerFraction: number): string {
		const owner = Math.round(ownerFraction * 100);
		const partner = 100 - owner;

		return `${owner}/${partner}`;
	}

	let filter = $state<'all' | 'current' | 'other'>('all');

	const filteredExpenses = $derived(
		filter === 'all'
			? data.expenses
			: data.expenses.filter(
					(e) => e.userId === (filter === 'current' ? data.currentUser.id : otherUser.id)
				)
	);

	const filteredTotal = $derived(
		filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0)
	);
</script>

<header>
	<h1>{data.ledger.name}</h1>
</header>

<main>
	<section class="grid">
		<dl>
			<dt>{data.currentUser.name}</dt>
			<dd>{currentBalance}</dd>
		</dl>
		<dl>
			<dt>{otherUser.name}</dt>
			<dd>{otherBalance}</dd>
		</dl>
		<dl>
			<dt>Split {data.owner.name}/{data.partner.name}</dt>
			<dd>{formatSplit(data.ledger.ownerFraction)} <u>Edit</u></dd>
		</dl>
	</section>

	<section>
		<form method="POST" action="?/create" use:enhance>
			<fieldset class="grid">
				<input type="text" name="description" placeholder="Description" required />
				<input type="number" name="amount" placeholder="Amount" min="1" required />
				<input type="submit" value="Add expense" />
			</fieldset>
			{#if form?.error}
				<mark>{form.error}</mark>
			{/if}
		</form>
	</section>

	<section>
		<fieldset>
			<legend>Filter expenses</legend>
			<input type="radio" id="all" name="expenses" bind:group={filter} value="all" />
			<label for="all">All</label>
			<input type="radio" id="current" name="expenses" bind:group={filter} value="current" />
			<label for="current">{data.currentUser.name}'s</label>
			<input type="radio" id="other" name="expenses" bind:group={filter} value="other" />
			<label for="other">{otherUser.name}'s</label>
		</fieldset>
	</section>

	<section class="overflow-auto">
		<table>
			<thead>
				<tr>
					<th scope="col">Expense</th>
					<th scope="col">Amount (€)</th>
				</tr>
			</thead>
			<tbody>
				{#each filteredExpenses as expense}
					<tr>
						<th scope="row">{expense.description}</th>
						<td>{expense.amount}</td>
					</tr>
				{/each}
			</tbody>
			<tfoot>
				<tr>
					<th scope="row">Total</th>
					<td>{filteredTotal}</td>
				</tr>
			</tfoot>
		</table>
	</section>
</main>

<footer>
	<details name="example">
		<summary><strong>Turn ledger into template</strong></summary>
		<form action="">
			<fieldset class="grid">
				<input type="text" placeholder="Name" required />

				<input type="submit" value="Create template" />
			</fieldset>
			<small
				>This will include all {data.expenses.length} expenses and the {formatSplit(
					data.ledger.ownerFraction
				)} split setting.</small
			>
		</form>
	</details>
	<hr />
</footer>
