<script lang="ts">
	import type { PageProps } from './$types';
	import { enhance } from '$app/forms';

	let { data }: PageProps = $props();
</script>

<header>
	<hgroup class="grid">
		<h1>Ledgers</h1>
		{#if data.ledgers.length > 0}<a href="/ledgers/new">+ Add ledger</a>{/if}
	</hgroup>
</header>

<main>
	{#if data.ledgers.length === 0}
		<h2><a href="/ledgers/new">+ Add ledger</a></h2>
	{:else}
		<ul>
			{#each data.ledgers as ledger}
				<li class="grid">
					<h2><a href="/ledgers/{ledger.id}">{ledger.name}</a></h2>
					<form method="POST" action="?/delete-ledger" use:enhance>
						<input type="hidden" name="id" value={ledger.id} />
						<button type="submit" class="outline secondary">Delete ledger</button>
					</form>
				</li>
			{/each}
		</ul>
	{/if}
</main>
