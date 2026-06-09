<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';
	import { ArrowLeftIcon } from 'phosphor-svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';

	let { data }: PageProps = $props();
</script>

<header class="header-sticky--ledger">
	<a href="/settings/templates" class="btn--circle" aria-label="Templates overview">
		<ArrowLeftIcon />
	</a>
	<h1>{data.template.name}</h1>
</header>

<main class="stack">
	<section class="list--section margin-block-start">
		<header><h2>Info</h2></header>
		<ul>
			<li>
				<p>
					<span>{data.owner.name}’s share</span>
					<span>{data.template.ownerFraction * 100}%</span>
				</p>
			</li>
			<li>
				<p>
					<span>{data.otherUser.name}’s share</span>
					<span>{(1 - data.template.ownerFraction) * 100}%</span>
				</p>
			</li>
		</ul>
	</section>

	<section class="list--section margin-block-start">
		<header><h2>Expenses</h2></header>
		{#if data.expenses.length}
			<ul>
				{#each data.expenses as expense (expense.id)}
					<li>
						<a href="/expenses/{expense.id}/manage">
							<span>{expense.description}</span>
							<span>{expense.amount}</span>
						</a>
					</li>
				{/each}
			</ul>
		{:else}
			<EmptyState title="No expenses" subtitle="Managing expenses on here is not yet supported. Create a new template via a ledger." />
		{/if}
	</section>

	<form method="POST" action="?/delete" use:enhance>
		<h2>Delete template</h2>
		<label>
			<input type="checkbox" name="confirm-delete" required />
			Permanently delete template
		</label>
		<button class="btn line" type="submit"><span>Delete template</span></button>
	</form>
</main>
