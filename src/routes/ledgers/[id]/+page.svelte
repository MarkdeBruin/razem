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

<header class="header--ledger">
	<h1>{data.ledger.name}</h1>
</header>

<main class="stack">
	<section class="balance--section">
		<h2>
			<span class="sr-only">Your balance:</span>
			{#if data.currentBalance > 0}&plus;{/if}{Math.round(data.currentBalance)}
		</h2>
	</section>

	<select class="margin-block-end-half" bind:value={filter}>
		<option value="all">All expenses</option>
		<option value="current">{data.currentUser.name}'s expesnes</option>
		<option value="other">{data.otherUser.name}'s expenses</option>
	</select>

	<section class="list--section tabular-nums">
		<header>
			<h2>Totals</h2>
		</header>
		<ul>
			{#each filteredByCategory as category (category.id)}
				{#if category.total > 0}
					<li>
						<p>
							<span>{category.name}</span>
							<span>{Math.round(category.total)}</span>
						</p>
					</li>
				{/if}
			{/each}
			<li>
				<p>
					<strong>Sum</strong>
					<strong>{filteredTotal}</strong>
				</p>
			</li>
		</ul>
	</section>

	<a class="btn margin-block-end-half" href="/expenses/new?ledger={data.ledger.id}">Add expense</a>

	<section class="list--section tabular-nums">
		<header>
			<h2>Expenses</h2>
		</header>
		<ul>
			{#each filteredExpenses as expense (expense.id)}
				<li>
					<a href="/expenses/{expense.id}/edit">
						<span>{expense.description}</span>
						<span>{expense.amount}</span>
					</a>
				</li>
			{/each}
		</ul>
	</section>
</main>

<footer hidden>
	<ul>
		<li><a href="/ledgers/{data.ledger.id}/delete">Delete ledger</a></li>
		<li><a href="/ledgers/templates/new?from={data.ledger.id}">Create template from ledger</a></li>
	</ul>
</footer>
