<script lang="ts">
	import type { PageProps } from './$types';
	import { enhance } from '$app/forms';
	import { matchCategory } from '$lib/utils/categories';

	let { data, form }: PageProps = $props();
	let keyword = $state('');
	let isDuplicate = $state(false);
</script>

<header>
	<hgroup>
		<h1>Categories & Keywords</h1>
		<p>Keywords are used to automatically select the right category when adding an expense.</p>
	</hgroup>
</header>

<main>
	<section>
		<form method="POST" use:enhance>
			<label>
				<span>Keyword</span>
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
					<small>"{keyword}" already exists</small>
				{/if}
				{#if form?.keywordMissing}
					<small>Keyword is required</small>
				{/if}
			</label>

			<fieldset>
				<legend>Category</legend>
				{#each data.categories as category}
					<label>
						<input type="radio" name="category" value={category.id} required />
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
		<ul>
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
