<script lang="ts">
	import type { PageProps } from './$types';
	import { enhance } from '$app/forms';
	import { matchCategory } from '$lib/utils/categories';
	import { ArrowLeftIcon, QuestionMarkIcon } from 'phosphor-svelte';

	let { data, form }: PageProps = $props();
	let keyword = $state('');
	let isDuplicate = $state(false);
</script>

<header class="header-sticky--back">
	<a href="/" class="btn--circle" aria-label="Back home"><ArrowLeftIcon /></a>
	<h1>Categories & Keywords</h1>
</header>

<main class="stack">
	<form method="POST" use:enhance>
		<h2>New keyword</h2>
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

	{#each data.categories as category (category.id)}
		{@const categoryKeywords = data.keywords.filter(
			(keyword) => keyword.categoryId === category.id
		)}
		<section class="list--section">
			{#if categoryKeywords.length > 0}
				<header>
					<h2>{category.name}</h2>
				</header>
				<ul>
					{#each [...categoryKeywords] as keyword (keyword.id)}
						<li><a href="/settings/keywords/{keyword.id}">{keyword.name}</a></li>
					{/each}
				</ul>
			{/if}
		</section>
	{/each}
</main>
