<script lang="ts">
	import type { PageProps } from './$types';
	import { ArrowLeftIcon, FadersHorizontalIcon } from 'phosphor-svelte';
	import SelectWrapper from '$lib/components/SelectWrapper.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';

	let { data }: PageProps = $props();

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
		data.categories
			.map((category) => ({
				...category,
				total: filteredExpenses
					.filter((expense) => expense.categoryId === category.id)
					.reduce((sum, expense) => sum + expense.amount, 0)
			}))
			.filter((category) => category.total > 0) // only show categories with expenses
	);
</script>

<header class="header-sticky--ledger">
	<a href="/" class="btn--circle" aria-label="Go home"><ArrowLeftIcon /></a>
	<h1>{data.ledger.name}</h1>
	<a href="{data.ledger.id}/manage" class="btn--circle" aria-label="Edit ledger"
		><FadersHorizontalIcon /></a
	>
</header>

<main class="stack">
	<section class="balance--section">
		<div>
			{(data.currentBalance > 0 ? '+' : '') + data.currentBalance}<span
				class="visibility-hidden"
				aria-hidden="true"
			>
				{data.currentBalance === 0 ? '' : data.currentBalance > 0 ? '+' : '-'}
			</span>
		</div>

		<h2>
			{data.currentBalance > 0
				? `${data.otherUser.name} owes you`
				: `You owe ${data.otherUser.name}`}
			<span class="sr-only">{Math.abs(data.currentBalance)}</span>
		</h2>
	</section>

	<label class="margin-block-end-half hide-no-js">
		<span class="sr-only">Filter expenses</span>
		<SelectWrapper>
			<select bind:value={filter}>
				<option value="all">All expenses</option>
				<option value="current">{data.currentUser.name}'s expenses</option>
				<option value="other">{data.otherUser.name}'s expenses</option>
			</select>
		</SelectWrapper>
	</label>

	{#if !filteredExpenses.length}
		<EmptyState
			title="Nothing here yet"
			subtitle="Expenses and their totals will show here."
			cta="Add expense"
			url="/expenses/new?ledger={data.ledger.id}&from=ledger"
		/>
	{:else}
		<section class="list--section tabular-nums">
			<header>
				<h2>Totals</h2>
			</header>
			<ul>
				{#each filteredByCategory as category (category.id)}
					<li>
						<p>
							<span>{category.name}</span>
							<span>{Math.round(category.total)}</span>
						</p>
					</li>
				{/each}
				{#if filteredByCategory.length > 1}
					<li>
						<p>
							<strong>Sum</strong>
							<strong>{filteredTotal}</strong>
						</p>
					</li>
				{/if}
			</ul>
		</section>

		<a class="btn margin-block-end-half" href="/expenses/new?ledger={data.ledger.id}&from=ledger"
			>Add expense</a
		>

		<section id="exp" class="list--section tabular-nums">
			<header>
				<h2>Expenses</h2>
			</header>
			<ul>
				{#each filteredExpenses as expense (expense.id)}
					<li>
						<a href="/expenses/{expense.id}/manage">
							<span>{expense.description}</span>
							<span>{expense.amount}</span>
						</a>
					</li>
				{/each}
			</ul>
		</section>
	{/if}
</main>

<footer hidden>
	<ul>
		<li><a href="/ledgers/{data.ledger.id}/delete">Delete ledger</a></li>
		<li><a href="/ledgers/templates/new?from={data.ledger.id}">Create template from ledger</a></li>
	</ul>
</footer>
