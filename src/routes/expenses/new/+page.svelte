<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';
	import { matchCategory } from '$lib/utils/categories';
	import { ArrowLeftIcon } from 'phosphor-svelte';
	import SelectWrapper from '$lib/components/SelectWrapper.svelte';

	let { data, form }: PageProps = $props();

	let description = $state('');
	let selectedCategoryId = $state('');
	let isNewKeyword = $state(false);
	let match: string;
</script>

<header class="header-sticky--back">
	<a href={data.backUrl} class="btn--circle" aria-label="Back">
		<ArrowLeftIcon />
	</a>
</header>

<main>
	<form method="POST" use:enhance>
		<h1>New Expense</h1>
		<label for="ledger-id">
			Ledger
			<SelectWrapper>
				<select name="ledger-id">
					{#each data.ledgers as ledger (ledger.id)}
						<option value={ledger.id} selected={ledger.id === data.ledgerId}>
							{ledger.name}
						</option>
					{/each}
				</select>
			</SelectWrapper>
		</label>
		{#if form?.expenseLedgerIdMissing}<small>Ledger is required</small>{/if}
		<label>
			Description
			<input
				type="text"
				name="exp-description"
				required
				autocapitalize="sentences"
				bind:value={description}
				oninput={() => {
					match = matchCategory(description, data.categories);
					if (match) {
						selectedCategoryId = match;
						isNewKeyword = false;
					}
				}}
				onblur={() => (isNewKeyword = description.trim().length > 0 && !match)}
			/>
			{#if form?.expenseDescMissing}<small>Description is required</small>{/if}
		</label>
		<label>
			Amount
			<input type="number" name="exp-amount" min="1" inputmode="numeric" required />
			{#if form?.expenseAmountMissing}<small>Amount is required</small>{/if}
		</label>

		<label>
			Category
			<SelectWrapper>
				<select name="exp-category" required bind:value={selectedCategoryId}>
					{#each data.categories as category (category.id)}
						<option value={category.id}>{category.name}</option>
					{/each}
				</select>
			</SelectWrapper>
			{#if form?.categoryMissing}
				<small>Please select a category</small>
			{/if}
		</label>

		{#if isNewKeyword && selectedCategoryId}
			<label>
				<input type="checkbox" name="save-keyword" value="true" />
				Auto-fill this category next time I add “{description.trim()}”
			</label>
		{/if}

		<input class="btn" type="submit" value="Add expense" />
	</form>
</main>
