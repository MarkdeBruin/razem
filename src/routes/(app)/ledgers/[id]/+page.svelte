<script lang="ts">
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import type { PageProps } from './$types';
	import { ArrowLeftIcon, FadersHorizontalIcon } from 'phosphor-svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import { resolve } from '$app/paths';
	import NumberFlow from '@number-flow/svelte';

	let { data }: PageProps = $props();

	let copied = $state(false);
	let copyTimeout: ReturnType<typeof setTimeout>;

	async function copyBalance() {
		try {
			await navigator.clipboard.writeText(String(Math.abs(data.currentBalance)));
			copied = true;
			clearTimeout(copyTimeout);
			copyTimeout = setTimeout(() => (copied = false), 1500);
		} catch (error) {
			console.error('Copy failed:', error);
		}
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
	<a href={resolve(data.backTo.route)} class="btn--circle" aria-label="Back"><ArrowLeftIcon /></a>
	<h1>{data.ledger.name}</h1>
	<a
		href={resolve('/(app)/ledgers/[id]/manage', { id: data.ledger.id })}
		class="btn--circle"
		aria-label="Edit ledger"
	>
		<FadersHorizontalIcon />
	</a>
</header>

<main class="stack">
	<section class="balance--section">
		<h2 class="sr-only">Balance</h2>

		<div>
			<span aria-hidden="true">{(data.currentBalance > 0 ? '+' : '') + data.currentBalance}</span>
			<span class="visibility-hidden" aria-hidden="true">
				{data.currentBalance === 0 ? '' : data.currentBalance > 0 ? '+' : '-'}
			</span>
			<button type="button" onclick={copyBalance}>
				<span class="sr-only">{copied ? 'Copied to clipboard' : 'Copy balance to clipboard'}</span>
			</button>
		</div>

		<p>
			{#key copied}
				<span
					in:fly={{ y: -8, duration: 200, delay: 150, easing: cubicOut }}
					out:fly={{ y: 8, duration: 150 }}
				>
					{copied
						? 'Copied to clipboard'
						: data.currentBalance > 0
							? `${data.otherUser.name} owes you`
							: `You owe ${data.otherUser.name}`}
				</span>
			{/key}
			<span class="sr-only">{Math.abs(data.currentBalance)}</span>
		</p>
	</section>

	<fieldset class="segmented hide-no-js">
		<legend><span class="sr-only">Filter expenses</span></legend>

		<label>
			<input type="radio" name="expenses-filter" value="all" bind:group={filter} />
			<span>All</span>
		</label>

		<label>
			<input type="radio" name="expenses-filter" value="current" bind:group={filter} />
			<span>{data.currentUser.name}{data.currentUser.name.endsWith('s') ? '’' : '’s'}</span>
		</label>

		<label>
			<input type="radio" name="expenses-filter" value="other" bind:group={filter} />
			<span>
				{data.otherUser.name}{data.otherUser.name.endsWith('s') ? '’' : '’s'}
			</span>
		</label>
	</fieldset>

	{#if !filteredExpenses.length}
		<EmptyState
			title="Nothing here yet"
			subtitle="Expenses and their totals will show here."
			cta="Add expense"
			url={resolve(`/(app)/expenses/new?ledger=${data.ledger.id}&from=ledger`)}
		/>
	{:else}
		<section class="list--section tabular-nums">
			<header>
				<h2>Totals</h2>
			</header>
			<ul>
				{#each filteredByCategory as category (category.id)}
					<li animate:flip={{ duration: 180 }}>
						<p>
							<span>{category.name}</span>
							<NumberFlow value={category.total} format={{ useGrouping: false }} />
						</p>
					</li>
				{/each}
				{#if filteredByCategory.length > 1}
					<li>
						<p>
							<strong>Sum</strong>
							<strong><NumberFlow value={filteredTotal} format={{ useGrouping: false }} /></strong>
						</p>
					</li>
				{/if}
			</ul>
		</section>

		<a class="btn" href={resolve(`/(app)/expenses/new?ledger=${data.ledger.id}&from=ledger`)}>
			<span>Add expense</span>
		</a>

		<section id="exp" class="list--section tabular-nums">
			<header>
				<h2>Expenses</h2>
			</header>
			<ul>
				{#each filteredExpenses as expense (expense.id)}
					<li animate:flip={{ duration: 180 }}>
						<a href={resolve('/(app)/expenses/[id]', { id: expense.id })}>
							<span>{expense.description}</span>
							<span>{expense.amount}</span>
						</a>
					</li>
				{/each}
			</ul>
		</section>
	{/if}
</main>
