<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';
	import { matchCategory } from '$lib/utils/categories';

	let { data, form }: PageProps = $props();
	
	// svelte-ignore state_referenced_locally
	let description = $state(data.expense.description);
	// svelte-ignore state_referenced_locally
	let selectedCategoryId = $state(data.expense.categoryId);

	let isNewKeyword = $state(false);
	let match: string;

	$effect(() => {
		
	});
</script>

<header><h1>Edit ledger</h1></header>

<main>
	<form method="POST" use:enhance>
		<fieldset class="grid">
			<div>
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
			</div>
			<div>
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
			</div>
		</fieldset>

		<fieldset class="grid">
			<legend>Category</legend>
			{#each data.categories as category}
				<label>
					<input
						type="radio"
						name="exp-category"
						value={category.id}
						required
						bind:group={selectedCategoryId}
					/>
					{category.name}
				</label>
			{/each}
		</fieldset>
		{#if form?.categoryMissing}
			<small>Please select a category</small>
		{/if}

		{#if isNewKeyword && selectedCategoryId}
			<label>
				<input type="checkbox" name="save-keyword" value="true" />
				Auto-fill this category next time I add {description.trim()}
			</label>
		{/if}
		<input type="submit" value="Save changes" />
	</form>
</main>
