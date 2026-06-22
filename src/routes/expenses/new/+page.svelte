<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';
	import { matchCategory } from '$lib/utils/categories';
	import { ArrowLeftIcon } from 'phosphor-svelte';
	import SelectWrapper from '$lib/components/SelectWrapper.svelte';
	import { attachObserveHeader } from '$lib/utils/headerObserver';

	let { data, form }: PageProps = $props();

	let description = $state('');
	let selectedCategoryId = $state('');
	let isNewKeyword = $state(false);
	let match: string;

	let headerSpan = $state<HTMLElement>();
</script>

<header class="header-sticky--back">
	<a href={data.backUrl} class="btn--circle" aria-label="Back">
		<ArrowLeftIcon />
	</a>
	<span bind:this={headerSpan} aria-hidden="true">New expense</span>
</header>

<main>
	<form method="POST" use:enhance>
		<h1 {@attach attachObserveHeader(headerSpan)}>New Expense</h1>

		<label>
			Description
			<input
				type="text"
				name="exp-description"
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
			<input type="number" name="exp-amount" min="1" inputmode="numeric" required />
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

				{#if isNewKeyword && selectedCategoryId}
					<label>
						<input type="checkbox" name="save-keyword" value="true" />
						Auto-fill category in future
					</label>
				{/if}

				{#if form?.expenseCategoryMissing}
					<small>Please select a category</small>
				{/if}
			</div>
		</fieldset>

		<fieldset>
			<legend><span>User</span></legend>
			<div class="stack--small">
				<label>
					<input type="radio" name="exp-user-id" value={data.currentUser.id} checked required />
					{data.currentUser.name}
				</label>
				<label>
					<input type="radio" name="exp-user-id" value={data.otherUser.id} required />
					{data.otherUser.name}
				</label>

				{#if form?.expenseUserIdMissing}
					<small>Please select a user</small>
				{/if}
			</div>
		</fieldset>

		<label>
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
			
			{#if form?.expenseLedgerIdMissing}<small>Ledger is required</small>{/if}
		</label>

		<button class="btn sticky" type="submit"><span>Add expense</span></button>
	</form>
</main>
