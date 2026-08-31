<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';
	import { matchCategory } from '$lib/utils/categories';
	import { ArrowLeftIcon } from 'phosphor-svelte';
	import SelectWrapper from '$lib/components/SelectWrapper.svelte';
	import SubmitButton from '$lib/components/SubmitButton.svelte';
	import SubmitAnnouncer from '$lib/components/SubmitAnnouncer.svelte';
	import {
		useSubmitForm,
		editAnnounce,
		editLabels,
		deleteAnnounce,
		deleteLabels
	} from '$lib/utils/submitForm.svelte';
	import { resolve } from '$app/paths';

	let { data, form }: PageProps = $props();

	const editSubmit = useSubmitForm();
	const editButtonLabels = editLabels();
	const editAnnounceLabels = editAnnounce();

	const deleteSubmit = useSubmitForm();
	const deleteButtonLabels = deleteLabels('expense');
	const deleteAnnounceLabels = deleteAnnounce('expense');

	// svelte-ignore state_referenced_locally
	let description = $state(data.expense.description);
	// svelte-ignore state_referenced_locally
	let selectedCategoryId = $state(data.expense.categoryId);

	let isNewKeyword = $state(false);
	let match: string;
</script>

<header class="header-sticky--back">
	<a
		href={resolve('/(app)/ledgers/[id]', { id: data.expense.ledgerId })}
		class="btn--circle"
		aria-label="Back to ledger"
	>
		<ArrowLeftIcon />
	</a>
	<h1>Manage {data.expense.description}</h1>
</header>

<main class="stack">
	<form method="POST" action="?/update" use:enhance={editSubmit.enhance}>
		<h2>Edit expense</h2>
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
			{#if form?.errors?.description}<small>{form.errors.description[0]}</small>{/if}
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
			{#if form?.errors?.amount}<small>{form.errors.amount[0]}</small>{/if}
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
						Auto-fill category for {description.trim()}
					</label>
				{/if}

				{#if form?.errors?.categoryId}<small>{form.errors.categoryId[0]}</small>{/if}
			</div>
		</fieldset>

		<fieldset>
			<legend><span>User</span></legend>
			<div class="stack--small">
				<label>
					<input
						type="radio"
						name="exp-user-id"
						value={data.currentUser.id}
						checked={data.currentUser.id === data.expense.userId}
						required
					/>
					{data.currentUser.name}
				</label>
				<label>
					<input
						type="radio"
						name="exp-user-id"
						value={data.otherUser.id}
						checked={data.otherUser.id === data.expense.userId}
						required
					/>
					{data.otherUser.name}
				</label>

				{#if form?.errors?.userId}<small>{form.errors.userId[0]}</small>{/if}
			</div>
		</fieldset>

		<label>
			Ledger
			<SelectWrapper>
				<select name="ledger-id">
					{#if data.ledgers.length > 0}
						{#each data.ledgers as ledger (ledger.id)}
							<option value={ledger.id} selected={ledger.id === data.expense.ledgerId}>
								{ledger.name}
							</option>
						{/each}
					{/if}

					{#if data.templates.length > 0}
						<hr />
						<optgroup label="Templates">
							{#each data.templates as template (template.id)}
								<option value={template.id} selected={template.id === data.expense.ledgerId}>
									{template.name}
								</option>
							{/each}
						</optgroup>
					{/if}
				</select>
			</SelectWrapper>
			{#if form?.errors?.ledgerId}<small>{form.errors.ledgerId[0]}</small>{/if}
		</label>

		<SubmitButton submitState={editSubmit.submitState} {...editButtonLabels} />
		<SubmitAnnouncer submitState={editSubmit.submitState} labels={editAnnounceLabels} />
	</form>

	<form method="POST" action="?/delete" use:enhance={deleteSubmit.enhance}>
		<h2>Delete expense</h2>

		<label>
			<input type="checkbox" name="confirm-delete" required />
			Permanently delete expense
		</label>
		<input type="hidden" name="ledger-id" value={data.expense.ledgerId} />

		<SubmitButton submitState={deleteSubmit.submitState} {...deleteButtonLabels} />
		<SubmitAnnouncer submitState={deleteSubmit.submitState} labels={deleteAnnounceLabels} />
	</form>
</main>
