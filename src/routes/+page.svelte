<script lang="ts">
	import type { PageProps } from './$types';
	let { data }: PageProps = $props();
</script>

<header>
	<nav>
		<ul>
			<li><h1>Ledgers</h1></li>
		</ul>
		<ul>
			<li>
				{#if data.ledgers.length > 0}<a href="/ledgers/new">+ Add ledger</a>{/if}
			</li>
			<li><a href="/settings/expense-categories">Expense categories</a></li>
		</ul>
	</nav>
</header>

<main>
	{#if data.ledgers.length === 0}
		<h2><a href="ledgers/new">+ Add ledger</a></h2>
	{:else}
		<ul>
			{#each data.ledgers as ledger}
				<li>
					<a href="ledgers/{ledger.id}">{ledger.name}</a>
					<span> | </span>
					<a href="ledgers/{ledger.id}/delete" class="secondary">Delete ledger</a>
				</li>
			{/each}
		</ul>
	{/if}
</main>
