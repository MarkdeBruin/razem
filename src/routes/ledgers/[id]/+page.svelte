<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

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
			<dd>{Math.round(currentBalance)}</dd>
		</dl>
		<dl>
			<dt>{otherUser.name}</dt>
			<dd>{Math.round(otherBalance)}</dd>
		</dl>
		<dl>
			<dt>Split {data.owner.name}/{data.partner.name}</dt>
			<dd>{formatSplit(data.ledger.ownerFraction)} <a href="{data.ledger.id}/edit">Edit</a></dd>
		</dl>
	</section>

	<section>
		<form method="POST" action="?/create-expense" use:enhance>
			<fieldset class="grid">
				<div>
					<input type="text" name="exp-description" placeholder="Description" required />
					{#if form?.expenseDescMissing}<small>Description is required</small>{/if}
				</div>
				<div>
					<input
						type="number"
						name="exp-amount"
						placeholder="Amount"
						min="1"
						inputmode="numeric"
						required
					/>
					{#if form?.expenseAmountMissing}<small>Amount is required</small>{/if}
				</div>
			</fieldset>
			
			<fieldset class="grid">
				<legend>Category</legend>
				{#each data.categories as category}
					<label>
						<input type="radio" name="exp-category" value={category.id} required />
						{category.name}
					</label>
				{/each}
			</fieldset>
			{#if form?.categoryMissing}
				<small>Please select a category</small>
			{/if}
			
			<input type="submit" value="Add expense" />
		</form>
	</section>

	<section>
		<fieldset>
			<legend>Filter expenses</legend>
			<input type="radio" id="all" name="expenses" bind:group={filter} value="all" />
			<label for="all">All</label>
			<input type="radio" id="current" name="expenses" bind:group={filter} value="current" />
			<label for="current">{data.currentUser.name}’s</label>
			<input type="radio" id="other" name="expenses" bind:group={filter} value="other" />
			<label for="other">{otherUser.name}’s</label>
		</fieldset>
	</section>

	<section class="overflow-auto">
		<table class="striped">
			<thead>
				<tr>
					<th scope="col">Expense</th>
					<th scope="col">Amount (€)</th>
					<th scope="col">Category</th>
					<th scope="col">Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each filteredExpenses as expense}
					<tr>
						<th scope="row">{expense.description}</th>
						<td>{expense.amount}</td>
						<td>{expense.categoryName}</td>
						<td>
							<form method="POST" action="?/delete-expense" use:enhance>
								<input type="hidden" name="id" value={expense.id} />
								<button type="submit" class="outline secondary">Delete</button>
							</form>
						</td>
					</tr>
				{/each}
			</tbody>
			<tfoot>
				<tr>
					<th scope="row">Total</th>
					<td>{filteredTotal}</td>
					<td></td>
					<td></td>
				</tr>
			</tfoot>
		</table>
	</section>
</main>

<footer>
	<ul>
		<li><a href="/ledgers/{data.ledger.id}/delete">Delete ledger</a></li>
		<li><a href="/ledgers/templates/new?from={data.ledger.id}">Create template from ledger</a></li>
	</ul>
</footer>
