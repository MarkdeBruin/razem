<script lang="ts">
	import type { PageProps } from './$types';
	import { PlusIcon, ArrowLeftIcon } from 'phosphor-svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import SelectWrapper from '$lib/components/SelectWrapper.svelte';

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
	<a href="/" class="btn--circle" aria-label="Back home"><ArrowLeftIcon /></a>
	<h1>Ledgers overview</h1>
	{#if data.ledgers.length}
		<a class="btn--circle" href="ledgers/new?from=overview" aria-label="Add ledger"><PlusIcon /></a>
	{/if}
</header>

<main class="stack">
	<section class="list--section margin-block-start" id="ledgers">
		<label class="margin-block-end hide-no-js">
			<span class="sr-only">Filter ledgers and templates</span>
			<SelectWrapper>
				<select name="expenses-filter" bind:value={filter}>
					<option value="all">All ledgers</option>
					<option value="templates">Templates</option>
				</select>
			</SelectWrapper>
		</label>

		{#if filteredLedgers.length}
			<ul>
				{#each filteredLedgers as ledger (ledger.id)}
					<li>
						<a href="ledgers/{ledger.id}?from=overview">{ledger.name}</a>
					</li>
				{/each}
			</ul>
		{:else}
			<EmptyState
				title="Nothing here yet"
				subtitle={emptySubtitle}
				cta="Add ledger"
				url="ledgers/new"
			/>
		{/if}
	</section>
</main>
