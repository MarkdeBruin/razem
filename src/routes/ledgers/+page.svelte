<script lang="ts">
	import type { PageProps } from './$types';
	import { PlusIcon, ArrowLeftIcon, RecycleIcon } from 'phosphor-svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	let { data }: PageProps = $props();
</script>

<header class="header-sticky--back">
	<a href="/" class="btn--circle" aria-label="Back home"><ArrowLeftIcon /></a>
	<h1><a href="#ledgers">Ledgers</a> & <a href="#templates">Templates</a></h1>
	{#if data.ledgers.length}
		<a class="btn--circle" href="ledgers/new?from=overview" aria-label="Add ledger"><PlusIcon /></a>
	{/if}
</header>

<main class="stack">
	<section class="list--section margin-block-start" id="ledgers">
		<header>
			<h2>Ledgers</h2>
		</header>
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

	{#if data.templates.length}
		<section class="list--section" id="templates">
			<header>
				<h2>Templates</h2>
			</header>
			<ul>
				{#each data.templates as template (template.id)}
					<li>
						<a href="ledgers/{template.id}?from=overview">{template.name}</a>
					</li>
				{/each}
			</ul>
		</section>
	{/if}
</main>
