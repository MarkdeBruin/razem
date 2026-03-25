<script lang="ts">
	import type { PageProps } from './$types';
	import { enhance } from '$app/forms';

	let { data, form }: PageProps = $props();

	let rawKeyword = $state('');

	const cleanedKeyword = $derived(rawKeyword.trim().replace(/^\w/, c => c.toUpperCase()));
	const isDuplicate = $derived(data.keywords.includes(cleanedKeyword));
</script>

<header>
	<hgroup>
		<h1>Expense categories</h1>
		<p>Keywords are used to automatically select the right category when adding an expense.</p>
	</hgroup>
</header>

<main>
	<section>
		<form method="POST" use:enhance>
			<label>
				<span>Keyword</span>
				<input type="text" name="keyword" bind:value={rawKeyword} required />
				{#if isDuplicate}
					<small>"{cleanedKeyword}" already exists</small>
				{/if}
				{#if form?.keywordMissing}
					<small>Keyword is required</small>
				{/if}
			</label>

			<fieldset class="grid">
				<legend>Category</legend>
				{#each data.categories as category}
					<label>
						<input type="radio" name="exp-category" value={category.id} required />
						{category.name}
					</label>
				{/each}
			</fieldset>
			{#if form?.categoryMissing}
				<small>Please select a category</small>
			{/if}

			<button type="submit" disabled={isDuplicate}> Add keyword </button>
		</form>
	</section>
	<hr />
	<section>
		<ul class="grid">
			{#each data.categories as category}
				<li>
					<p>{category.name}</p>
					{#if category.keywords.length > 0}
						<ul>
							{#each category.keywords as keyword}
								<li>{keyword}</li>
							{/each}
						</ul>
					{/if}
				</li>
			{/each}
		</ul>
	</section>
</main>
