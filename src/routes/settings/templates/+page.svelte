<script lang="ts">
	import type { PageProps } from './$types';
	import { ArrowLeftIcon } from 'phosphor-svelte';
	import { attachObserveHeader } from '$lib/utils/headerObserver';
	import EmptyState from '$lib/components/EmptyState.svelte';

	let { data }: PageProps = $props();
	let headerSpan = $state<HTMLElement>();
</script>

<header class="header-sticky--back">
	<a href="/" class="btn--circle" aria-label="Back home"><ArrowLeftIcon /></a>
	<span bind:this={headerSpan} aria-hidden="true">Ledger templates</span>
</header>

<main>
	<section class="list--section margin-block-start">
		<header><h1 {@attach attachObserveHeader(headerSpan)}>Ledger templates</h1></header>
		{#if data.templates.length}
		<ul>
			{#each data.templates as template (template.id)}
				<li>
					<a href="templates/{template.id}">{template.name}</a>
				</li>
			{/each}
		</ul>
		{:else}
			<EmptyState title="No templates" subtitle="Create a new template via a ledger’s manage page." />
		{/if}
	</section>
</main>
