<script lang="ts">
	import type { PageProps } from './$types';
	let { data }: PageProps = $props();
</script>

<header class="header--home">
	<h1>Ledgers</h1>
	<a class="btn" href="ledgers/new">Add</a>
</header>

<main>
	{#if data.ledgers.length === 0}
		<p>No ledgers yet.</p>
	{:else}
		<ul class="ledgers--list">
			{#each data.ledgers as ledger (ledger.id)}
				<li>
					<a href="ledgers/{ledger.id}">{ledger.name}</a>
				</li>
			{/each}
		</ul>
	{/if}
</main>
