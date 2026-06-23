<script lang="ts">
	import type { PageProps } from './$types';
	import { enhance } from '$app/forms';
	import { matchCategory } from '$lib/utils/categories';
	import { ArrowLeftIcon } from 'phosphor-svelte';
	import { attachObserveHeader } from '$lib/utils/headerObserver';

	let { data, form }: PageProps = $props();
	let headerSpan = $state<HTMLElement>();

	let keyword = $state('');
	let isDuplicate = $state(false);
</script>

<header class="header-sticky--back">
	<a href="/settings/categories" class="btn--circle" aria-label="Categories & Keywords"
		><ArrowLeftIcon /></a
	>
	<span bind:this={headerSpan} aria-hidden="true">New keyword</span>
</header>

<main class="stack">
	<form method="POST" use:enhance>
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
			{#if isDuplicate}
				<small>“{keyword.trim()}” already exists</small>
			{/if}
			{#if form?.keywordMissing}
				<small>Keyword is required</small>
			{/if}
			{#if form?.keywordDuplicate}
				<small>{form.duplicateName} already exists</small>
			{/if}
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
				{#if form?.categoryMissing}
					<small>Please select a category</small>
				{/if}
			</div>
		</fieldset>

		<button class="btn" type="submit" disabled={isDuplicate}><span>Add keyword</span></button>
	</form>
</main>
