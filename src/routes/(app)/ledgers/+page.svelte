<script lang="ts">
	import type { PageProps } from './$types';
	import { PlusIcon, ArrowLeftIcon } from 'phosphor-svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import { resolve } from '$app/paths';

	let { data }: PageProps = $props();

	let filter = $state<'all' | 'templates'>('all');
	const filteredLedgers = $derived(
		{
			all: () => data.ledgers,
			templates: () => data.ledgers.filter((ledger) => ledger.isTemplate)
		}[filter]()
	);

	const emptySubtitle = $derived(
		{
			all: 'Add a ledger to start tracking your shared expenses.',
			templates: 'Create a template to speed up adding new ledgers.'
		}[filter]
	);
</script>

<header class="header-sticky--back">
	<a href={resolve('/')} class="btn--circle" aria-label="Back home"><ArrowLeftIcon /></a>
	<h1>Ledgers overview</h1>
	{#if data.ledgers.length}
		<a
			class="btn--circle"
			href={resolve('/(app)/ledgers/new?from=overview')}
			aria-label="Add ledger"><PlusIcon /></a
		>
	{/if}
</header>

<main class="stack">
	<section class="list--section margin-block-start">
		<fieldset class="segmented margin-block-end hide-no-js">
			<legend><span class="sr-only">Filter ledgers and templates</span></legend>

			<label>
				<input type="radio" name="ledgers-filter" value="all" bind:group={filter} />
				<span>All ledgers</span>
			</label>

			<label>
				<input type="radio" name="ledgers-filter" value="templates" bind:group={filter} />
				<span>Templates</span>
			</label>
		</fieldset>

		{#if filteredLedgers.length}
			<ul>
				{#each filteredLedgers as ledger (ledger.id)}
					<li>
						<a href={resolve(`/(app)/ledgers/[id]?from=overview`, { id: ledger.id })}>
							{ledger.name}
						</a>
					</li>
				{/each}
			</ul>
		{:else}
			<EmptyState
				title="Nothing here yet"
				subtitle={emptySubtitle}
				cta="Add ledger"
				url={resolve('/(app)/ledgers/new')}
			/>
		{/if}
	</section>
</main>
