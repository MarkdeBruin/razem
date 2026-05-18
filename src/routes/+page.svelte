<script lang="ts">
	import type { PageProps } from './$types';
	import { PlusIcon } from 'phosphor-svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	let { data }: PageProps = $props();
</script>

<header class="header--home">
	<h1 class="sr-only">Home</h1>
	<h1>♥</h1>
</header>

<main class="stack">
	<section class="list--section">
		<header>
			<h2>Ledgers</h2>
			{#if data.ledgers.length}
				<a class="btn--circle" href="ledgers/new" aria-label="Add ledger"><PlusIcon /></a>
			{/if}
		</header>
		{#if data.ledgers.length}
			<ul>
				{#each data.ledgers as ledger (ledger.id)}
					<li>
						<a href="ledgers/{ledger.id}">{ledger.name}</a>
					</li>
				{/each}
				<li><a class="btn--text-only" href="/ledgers">All ledgers</a></li>
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

	{#if data.ledgers.length}
		<a class="btn margin-block-end-half" href="/expenses/new?ledger={data.ledgers[0].id}&from=home">
			Add expense
		</a>
	{/if}

	<section class="list--section">
		<header>
			<h2>Settings</h2>
		</header>
		<ul>
			<li>
				<a href="/settings/account">Account</a>
			</li>
			<li>
				<a href="/settings/categories">Categories &amp; Keywords</a>
			</li>
		</ul>
		<br />
	</section>
</main>
