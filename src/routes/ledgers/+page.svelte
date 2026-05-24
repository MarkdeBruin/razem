<script lang="ts">
	import type { PageProps } from './$types';
	import { PlusIcon, ArrowLeftIcon } from 'phosphor-svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	let { data }: PageProps = $props();
</script>

<header class="header-sticky--back">
	<a href="/" class="btn--circle" aria-label="Back home"><ArrowLeftIcon /></a>
	<h1>All Ledgers</h1>
	{#if data.ledgers.length}
		<a class="btn--circle" href="ledgers/new?from=overview" aria-label="Add ledger"><PlusIcon /></a>
	{/if}
</header>

<main class="stack">
	<section class="list--section margin-block-start-double">
		{#if data.ledgers.length}
			<ul>
				{#each data.ledgers as ledger (ledger.id)}
					<li>
						<a href="ledgers/{ledger.id}?from=overview">{ledger.name}</a>
					</li>
				{/each}
			</ul>
		{:else}
			<EmptyState
				title="Get started"
				subtitle="Add a ledger to start tracking your shared expenses."
				cta="Add ledger"
				url="ledgers/new"
			/>
		{/if}
	</section>
</main>
