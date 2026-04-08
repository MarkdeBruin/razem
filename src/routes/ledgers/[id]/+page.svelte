<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';
	import { matchCategory } from '$lib/utils/categories';

	let { data, form }: PageProps = $props();

	let description = $state('');
	let selectedCategoryId = $state('');
	let isNewKeyword = $state(false);
	let match: string;

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
					(expense) =>
						expense.userId === (filter === 'current' ? data.currentUser.id : data.otherUser.id)
				)
	);

	const filteredTotal = $derived(
		filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0)
	);

	const filteredByCategory = $derived(
		data.categories.map((category) => ({
			...category,
			total: filteredExpenses
				.filter((expense) => expense.categoryId === category.id)
				.reduce((sum, expense) => sum + expense.amount, 0)
		}))
		//.filter((category) => category.total > 0) // only show categories with expenses
	);
</script>

<header>
	<h1>{data.ledger.name}</h1>
</header>

<main>
	<section>
		<dl>
			<dt>{data.currentUser.name}</dt>
			<dd>{Math.round(data.currentBalance)}</dd>
		</dl>
		<dl>
			<dt>{data.otherUser.name}</dt>
			<dd>{Math.round(data.otherBalance)}</dd>
		</dl>
		<dl>
			<dt>Split {data.owner.name}/{data.partner.name}</dt>
			<dd>{formatSplit(data.ledger.ownerFraction)} <a href="{data.ledger.id}/edit">Edit</a></dd>
		</dl>
	</section>

	<section>
		<form method="POST" use:enhance>
			<fieldset>
				<div>
					<input
						type="text"
						name="exp-description"
						placeholder="Description"
						required
						autocapitalize="sentences"
						bind:value={description}
						oninput={() => {
							match = matchCategory(description, data.categories);
							if (match) {
								selectedCategoryId = match;
								isNewKeyword = false;
							}
						}}
						onblur={() => (isNewKeyword = description.trim().length > 0 && !match)}
					/>
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

			<fieldset>
				<legend>Category</legend>
				{#each data.categories as category}
					<label>
						<input
							type="radio"
							name="exp-category"
							value={category.id}
							required
							bind:group={selectedCategoryId}
						/>
						{category.name}
					</label>
				{/each}
			</fieldset>
			{#if form?.categoryMissing}
				<small>Please select a category</small>
			{/if}

			{#if isNewKeyword && selectedCategoryId}
				<label>
					<input type="checkbox" name="save-keyword" value="true" />
					Auto-fill this category next time I add {description.trim()}
				</label>
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
			<label for="other">{data.otherUser.name}’s</label>
		</fieldset>
	</section>

	<section>
		<dl>
			<dt>Total expenses</dt>
			<dd>€{filteredTotal}</dd>
		</dl>
		{#each filteredByCategory as category}
			<dl>
				<dt>{category.name}</dt>
				<dd>€{Math.round(category.total)}</dd>
			</dl>
		{/each}
	</section>

	<section>
		<table>
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
							<a href="/ledgers/{data.ledger.id}/{expense.id}/edit">Edit</a>
							<a href="/ledgers/{data.ledger.id}/{expense.id}/delete">Delete</a>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</section>
</main>

<footer>
	<ul>
		<li><a href="/ledgers/{data.ledger.id}/delete">Delete ledger</a></li>
		<li><a href="/ledgers/templates/new?from={data.ledger.id}">Create template from ledger</a></li>
	</ul>
</footer>
