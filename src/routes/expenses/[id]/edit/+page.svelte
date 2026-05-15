<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';
	import { matchCategory } from '$lib/utils/categories';
	import { ArrowLeftIcon, TrashSimpleIcon } from 'phosphor-svelte';
	import SelectWrapper from '$lib/components/SelectWrapper.svelte';

	let { data, form }: PageProps = $props();

	// svelte-ignore state_referenced_locally
	let description = $state(data.expense.description);
	// svelte-ignore state_referenced_locally
	let selectedCategoryId = $state(data.expense.categoryId);

	let isNewKeyword = $state(false);
	let match: string;
</script>

<header class="header-sticky--back">
	<a href="/ledgers/{data.expense.ledgerId}" class="btn--circle" aria-label="Back to ledger">
		<ArrowLeftIcon />
	</a>
	<h1>{data.expense.description}</h1>
	<a href="/expenses/{data.expense.id}/delete" class="btn--circle" aria-label="Delete ledger">
		<TrashSimpleIcon />
	</a>
</header>

<main>
	<form method="POST" use:enhance>
		<h2>Edit expense</h2>
		<label for="ledger-id">
			Ledger
			<SelectWrapper>
				<select name="ledger-id">
					{#each data.ledgers as ledger (ledger.id)}
						<option value={ledger.id} selected={ledger.id === data.expense.ledgerId}>
							{ledger.name}
						</option>
					{/each}
				</select>
			</SelectWrapper>
			{#if form?.expenseLedgerIdMissing}<small>Ledger is required</small>{/if}
		</label>
		<label>
			Description
			<input
				type="text"
				name="exp-description"
				placeholder="Description"
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
			<input
				type="number"
				name="exp-amount"
				placeholder="Amount"
				value={data.expense.amount}
				min="1"
				inputmode="numeric"
				required
			/>
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
				Auto-fill this category next time I add {description.trim()}
			</label>
		{/if}
		<input class="btn" type="submit" value="Save changes" />
	</form>
</main>
