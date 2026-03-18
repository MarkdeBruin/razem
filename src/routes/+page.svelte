<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
</script>

<header>
	<hgroup class="grid">
		<h1>Ledgers</h1>
		<a href="/ledgers/new">+ Add ledger</a>
	</hgroup>
</header>

<main>
	<ul>
		{#each data.ledgers as ledger}
			<li>
				<a href="/ledgers/{ledger.id}">{ledger.name}</a>
			</li>
		{/each}
	</ul>
</main>
