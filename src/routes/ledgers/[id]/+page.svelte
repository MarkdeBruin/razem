<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

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
		{#each filteredByCategory as category (category.id)}
			<dl>
				<dt>{category.name}</dt>
				<dd>€{Math.round(category.total)}</dd>
			</dl>
		{/each}
	</section>

	<a href="/expenses/new?ledger={data.ledger.id}">Add expense</a>

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
				{#each filteredExpenses as expense (expense.id)}
					<tr>
						<th scope="row">{expense.description}</th>
						<td>{expense.amount}</td>
						<td>{expense.categoryName}</td>
						<td>
							<a href="/expenses/{expense.id}/edit">Edit</a>
							<a href="/expenses/{expense.id}/delete">Delete</a>
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
