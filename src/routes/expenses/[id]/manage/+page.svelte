<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';
	import { matchCategory } from '$lib/utils/categories';
	import { ArrowLeftIcon } from 'phosphor-svelte';
	import SelectWrapper from '$lib/components/SelectWrapper.svelte';

	let { data, form }: PageProps = $props();
	
	// svelte-ignore state_referenced_locally
	const backUrl = data.expense.ledgerId.startsWith('template')
		? `/settings/templates/${data.expense.ledgerId}`
		: `/ledgers/${data.expense.ledgerId}`;

	// svelte-ignore state_referenced_locally
	let description = $state(data.expense.description);
	// svelte-ignore state_referenced_locally
	let selectedCategoryId = $state(data.expense.categoryId);

	let isNewKeyword = $state(false);
	let match: string;
</script>

<header class="header-sticky--back">
	<a href={backUrl} class="btn--circle" aria-label="Back to ledger">
		<ArrowLeftIcon />
	</a>
	<h1>Manage {data.expense.description}</h1>
</header>

<main class="stack">
	<form method="POST" action="?/update" use:enhance>
		<h2>Edit expense</h2>
		{#if data.expense.ledgerId.startsWith('template')}
			<input type="hidden" name="ledger-id" value={data.expense.ledgerId} />
		{:else}
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
		{/if}
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
					match = matchCategory(description, data.keywords);
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

		<fieldset>
			<legend><span>Category</span></legend>
			<div class="stack--small">
				{#each data.categories as category (category.id)}
					<label>
						<input
							type="radio"
							name="exp-category"
							value={category.id}
							bind:group={selectedCategoryId}
							required
						/>
						{category.name}
					</label>
				{/each}
				{#if form?.categoryMissing}
					<small>Please select a category</small>
				{/if}
			</div>
		</fieldset>

		{#if isNewKeyword && selectedCategoryId}
			<label>
				<input type="checkbox" name="save-keyword" value="true" />
				Auto-fill category for {description.trim()}
			</label>
		{/if}
		<button class="btn" type="submit"><span>Save changes</span></button>
	</form>

	<form method="POST" action="?/delete" use:enhance>
		<h2>Delete expense</h2>
		<label>
			<input type="checkbox" name="confirm-delete" required />
			Permanently delete expense
		</label>
		<input type="hidden" name="ledger-id" value={data.expense.ledgerId} />
		<button class="btn line" type="submit"><span>Delete expense</span></button>
	</form>
</main>
