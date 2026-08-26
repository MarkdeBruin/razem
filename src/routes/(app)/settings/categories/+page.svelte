<script lang="ts">
	import EmptyState from '$lib/components/EmptyState.svelte';
	import type { PageProps } from './$types';
	import { ArrowLeftIcon, PlusIcon } from 'phosphor-svelte';
	import { resolve } from '$app/paths';

	let { data }: PageProps = $props();
</script>

<header class="header-sticky--back">
	<a href={resolve('/')} class="btn--circle" aria-label="Back home"><ArrowLeftIcon /></a>
	<h1>Categories & Keywords</h1>
	{#if data.keywords.length}
		<a class="btn--circle" href={resolve('/(app)/settings/keywords/new')} aria-label="Add keyword">
			<PlusIcon />
		</a>
	{/if}
</header>

<main class="stack pad-block-start">
	{#if data.keywords.length}
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
							<li>
								<a href={resolve('/(app)/settings/keywords/[id]', { id: keyword.id })}>
									{keyword.name}
								</a>
							</li>
						{/each}
					</ul>
				{/if}
			</section>
		{/each}
	{:else}
		<EmptyState
			title="Keywords auto-fill expense categories"
			subtitle="You can also create them while adding expenses."
			cta="Add keyword"
			url={resolve('/(app)/settings/keywords/new')}
		/>
	{/if}
</main>
