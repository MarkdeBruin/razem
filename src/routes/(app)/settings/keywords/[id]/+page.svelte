<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';
	import { ArrowLeftIcon } from 'phosphor-svelte';
	import { matchCategory } from '$lib/utils/categories';
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
	const deleteButtonLabels = deleteLabels('keyword');
	const deleteAnnounceLabels = deleteAnnounce('keyword');

	// svelte-ignore state_referenced_locally
	let keyword = $state(data.keyword.name);
	let isDuplicate = $state(false);
</script>

<header class="header-sticky--back">
	<a
		href={resolve('/(app)/settings/categories')}
		class="btn--circle"
		aria-label="Back to categories"
	>
		<ArrowLeftIcon />
	</a>
	<h1>Manage {data.keyword.name}</h1>
</header>

<main class="stack">
	<form method="POST" action="?/update" use:enhance={editSubmit.enhance}>
		<h2>Edit keyword</h2>

		<label>
			Keyword
			<input
				type="text"
				name="keyword"
				required
				autocapitalize="sentences"
				bind:value={keyword}
				oninput={() => {
					if (keyword === data.keyword.name) {
						isDuplicate = false;
						return;
					}
					isDuplicate = !!matchCategory(keyword, data.keywords, data.keyword.id);
				}}
			/>
			{#if isDuplicate}<small>“{keyword}” already exists</small>{/if}
			{#if form?.keywordDuplicate}<small>"{form.duplicateName}" already exists</small>{/if}
			{#if form?.errors?.name}<small>{form.errors.name[0]}</small>{/if}
		</label>
		<fieldset>
			<legend><span>Category</span></legend>
			<div class="stack--small">
				{#each data.categories as category (category.id)}
					<label>
						<input
							type="radio"
							name="category"
							value={category.id}
							checked={category.id === data.keyword.categoryId}
							required
						/>
						{category.name}
					</label>
				{/each}
				{#if form?.errors?.categoryId}<small>{form.errors.categoryId[0]}</small>{/if}
			</div>
		</fieldset>
		
		<SubmitButton submitState={editSubmit.submitState} {...editButtonLabels} />
		<SubmitAnnouncer submitState={editSubmit.submitState} labels={editAnnounceLabels} />
	</form>

	<form method="POST" action="?/delete" use:enhance={deleteSubmit.enhance}>
		<h2>Delete keyword</h2>
		
		<label>
			<input type="checkbox" name="confirm-delete" required />
			Permanently delete keyword
		</label>
		
		<SubmitButton submitState={deleteSubmit.submitState} {...deleteButtonLabels} />
		<SubmitAnnouncer submitState={deleteSubmit.submitState} labels={deleteAnnounceLabels} />
	</form>
</main>
