<script lang="ts">
	import type { PageProps } from './$types';
	import { ArrowLeftIcon, PlusIcon } from 'phosphor-svelte';

	let { data}: PageProps = $props();
</script>

<header class="header-sticky--back">
	<a href="/" class="btn--circle" aria-label="Back home"><ArrowLeftIcon /></a>
	<h1>Categories & Keywords</h1>
	<a class="btn--circle" href="/settings/keywords/new" aria-label="Add keyword"><PlusIcon /></a>
</header>

<main class="stack pad-block-start">

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
