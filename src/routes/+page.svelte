<script lang="ts">
	import type { PageProps } from './$types';
	import { PlusIcon } from "phosphor-svelte"
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
			<a class="btn--circle" href="ledgers/new" aria-label="Add ledger"><PlusIcon /></a>
		</header>
		{#if data.ledgers.length === 0}
			<p>No ledgers yet.</p>
		{:else}
			<ul>
				{#each data.ledgers as ledger (ledger.id)}
					<li>
						<a href="ledgers/{ledger.id}">{ledger.name}</a>
					</li>
				{/each}
				<li><a class="btn--text-only" href="/ledgers">All ledgers</a></li>
			</ul>
		{/if}
	</section>

	{#if data.ledgers.length !== 0}
		<a class="btn margin-block-end-half" href="/expenses/new?ledger={data.ledgers[0].id}"
			>Add expense</a
		>
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
