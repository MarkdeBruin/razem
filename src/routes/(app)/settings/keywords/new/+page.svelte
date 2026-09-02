<script lang="ts">
	import type { PageProps } from './$types';
	import { enhance } from '$app/forms';
	import { matchCategory } from '$lib/utils/categories';
	import { ArrowLeftIcon } from 'phosphor-svelte';
	import { attachObserveHeader } from '$lib/utils/headerObserver';
	import SubmitAnnouncer from '$lib/components/SubmitAnnouncer.svelte';
	import SubmitButton from '$lib/components/SubmitButton.svelte';
	import { useSubmitForm, addAnnounce, addLabels } from '$lib/utils/submitForm.svelte';
	import { resolve } from '$app/paths';

	let { data, form }: PageProps = $props();
	let headerSpan = $state<HTMLElement>();
	
	let keyword = $state('');
	let isDuplicate = $state(false);

	const submit = useSubmitForm();
	const buttonLabels = addLabels('keyword');
	const announceLabels = addAnnounce('keyword');
</script>

<header class="header-sticky--back">
	<a
		href={resolve('/(app)/settings/categories')}
		class="btn--circle"
		aria-label="Categories & Keywords"
	>
		<ArrowLeftIcon />
	</a>
	<span bind:this={headerSpan} aria-hidden="true">New keyword</span>
</header>

<main class="stack">
	<form method="POST" use:enhance={submit.enhance}>
		<h1 {@attach attachObserveHeader(headerSpan)}>New keyword</h1>
		<label>
			Keyword
			<input
				type="text"
				name="keyword"
				bind:value={keyword}
				required
				autocapitalize="sentences"
				oninput={() => {
					isDuplicate = !!matchCategory(keyword, data.keywords);
				}}
			/>
			{#if isDuplicate}<small>“{keyword.trim()}” already exists</small>{/if}
			{#if form?.keywordDuplicate}<small>"{form.duplicateName}" already exists</small>{/if}
			{#if form?.errors?.name}<small>{form.errors.name[0]}</small>{/if}
		</label>

		<fieldset>
			<legend><span>Category</span></legend>
			<div class="stack--small">
				{#each data.categories as category (category.id)}
					<label>
						<input type="radio" name="category" value={category.id} required />
						{category.name}
					</label>
				{/each}
				{#if form?.errors?.categoryId}<small>{form.errors.categoryId[0]}</small>{/if}
			</div>
		</fieldset>

		<SubmitButton submitState={submit.submitState} {...buttonLabels} />
		<SubmitAnnouncer submitState={submit.submitState} labels={announceLabels} />
	</form>
</main>
