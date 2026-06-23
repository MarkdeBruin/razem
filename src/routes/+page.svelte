<script lang="ts">
	import type { PageProps } from './$types';
	import { PlusIcon } from 'phosphor-svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	let { data }: PageProps = $props();
</script>

<header class="header--home">
	<h1 class="sr-only">Home</h1>
	<svg
		width="108"
		height="86"
		viewBox="0 0 108 86"
		fill="currentColor"
		xmlns="http://www.w3.org/2000/svg"
	>
		<circle cx="32" cy="10" r="10" />
		<circle cx="76" cy="10" r="10" />
		<circle cx="10" cy="32" r="10" />
		<circle cx="32" cy="32" r="10" />
		<circle cx="54" cy="32" r="10" />
		<circle cx="76" cy="32" r="10" />
		<circle cx="98" cy="32" r="10" />
		<circle cx="32" cy="54" r="10" />
		<circle cx="54" cy="54" r="10" />
		<circle cx="76" cy="54" r="10" />
		<circle cx="54" cy="76" r="10" />
	</svg>
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
				{#each data.ledgers.slice(0, 4) as ledger (ledger.id)}
					<li>
						<a href="ledgers/{ledger.id}">{ledger.name}</a>
					</li>
				{/each}
				{#if data.ledgers.length > 4 || data.templates.length > 0}
					<li><a href="/ledgers">All ledgers & templates</a></li>
				{/if}
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
		<a class="btn" href="/expenses/new?ledger={data.ledgers[0].id}">
			<span>Add expense</span>
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
