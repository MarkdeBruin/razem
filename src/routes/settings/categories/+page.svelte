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
	<button class="btn--circle" aria-label="Help"><QuestionMarkIcon /></button>
</header>

<main class="stack">
	<form class="margin-block-end-double" method="POST" use:enhance>
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
					isDuplicate = !!matchCategory(keyword, data.categories);
				}}
			/>
			{#if isDuplicate}
				<small>“{keyword}” already exists</small>
			{/if}
			{#if form?.keywordMissing}
				<small>Keyword is required</small>
			{/if}
		</label>

		<fieldset>
			<legend>Category</legend>
			{#each data.categories as category (category.id)}
				<label>
					<input type="radio" name="category" value={category.id} required />
					{category.name}
				</label>
			{/each}
		</fieldset>
		{#if form?.categoryMissing}
			<small>Please select a category</small>
		{/if}

		<input class="btn" type="submit" value="Add keyword" disabled={isDuplicate} />
	</form>

	{#each data.categories as category (category.id)}
		<section class="list--section">
			<header>
				<h2>{category.name}</h2>
			</header>
			{#if category.keywords.length > 0}<ul>
					{#each category.keywords as keyword}
						<li><p>{keyword}</p></li>
					{/each}
				</ul>{/if}
		</section>
	{/each}
</main>
