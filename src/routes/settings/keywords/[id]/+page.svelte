<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';
	import { ArrowLeftIcon } from 'phosphor-svelte';
	import SelectWrapper from '$lib/components/SelectWrapper.svelte';
	import { matchCategory } from '$lib/utils/categories';

	let { data, form }: PageProps = $props();
	// svelte-ignore state_referenced_locally
	let keyword = $state(data.keyword.name);
	let isDuplicate = $state(false);
</script>

<header class="header-sticky--back">
	<a href="/settings/categories" class="btn--circle" aria-label="Back to categories">
		<ArrowLeftIcon />
	</a>
	<h1>Manage {data.keyword.name}</h1>
</header>

<main class="stack">
	<form method="POST" action="?/update" use:enhance>
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
					isDuplicate = !!matchCategory(keyword, data.keywords);
				}}
			/>
			{#if isDuplicate}
				<small>"{keyword}" already exists</small>
			{/if}
			{#if form?.keywordDuplicate}
				<small>{form.duplicateName} already exists</small>
			{/if}
			{#if form?.keywordMissing}<small>Keyword is required</small>{/if}
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
				{#if form?.categoryMissing}
					<small>Please select a category</small>
				{/if}
			</div>
		</fieldset>
		<button class="btn" type="submit" disabled={isDuplicate}><span>Save changes</span></button>
	</form>

	<form class="margin-block-start-double" method="POST" action="?/delete" use:enhance>
		<h2>Delete keyword</h2>
		<label>
			<input type="checkbox" name="confirm-delete" required />
			Permanently delete keyword
		</label>
		<button class="btn line" type="submit"><span>Delete keyword</span></button>
	</form>
</main>
