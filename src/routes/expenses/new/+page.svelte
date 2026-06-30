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
			{#if form?.errors?.description}<small>{form.errors.description[0]}</small>{/if}
		</label>
		<label>
			Amount
			<input type="number" name="exp-amount" min="1" inputmode="numeric" required />
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
						Auto-fill category in future
					</label>
				{/if}

				{#if form?.errors?.categoryId}<small>{form.errors.categoryId[0]}</small>{/if}
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

				{#if form?.errors?.userId}<small>{form.errors.userId[0]}</small>{/if}
			</div>
		</fieldset>

		<label>
			Ledger
			<SelectWrapper>
				<select name="ledger-id">
					{#if data.ledgers.length > 0}
						{#each data.ledgers as ledger (ledger.id)}
							<option value={ledger.id} selected={ledger.id === data.ledgerId}>
								{ledger.name}
							</option>
						{/each}
					{/if}

					{#if data.templates.length > 0}
						<hr />
						<optgroup label="Templates">
							{#each data.templates as template (template.id)}
								<option value={template.id}>
									{template.name}
								</option>
							{/each}
						</optgroup>
					{/if}
				</select>
			</SelectWrapper>

			{#if form?.errors?.ledgerId}<small>{form.errors.ledgerId[0]}</small>{/if}
		</label>

		<button class="btn sticky" type="submit"><span>Add expense</span></button>
	</form>
</main>
