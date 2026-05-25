<script lang="ts">
	import type { PageProps } from './$types';
	import { ArrowLeftIcon } from 'phosphor-svelte';
	import { attachObserveHeader } from '$lib/utils/headerObserver';

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
		<ul>
			{#each data.templates as template (template.id)}
				<li>
					<a href="templates/{template.id}">{template.name}</a>
				</li>
			{/each}
		</ul>
	</section>
</main>
