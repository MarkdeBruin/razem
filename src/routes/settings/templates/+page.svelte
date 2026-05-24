<script lang="ts">
	import type { PageProps } from './$types';
	import { ArrowLeftIcon, QuestionMarkIcon } from 'phosphor-svelte';

	let { data }: PageProps = $props();
</script>

<header class="header-sticky--back">
	<a href="/" class="btn--circle" aria-label="Back home"><ArrowLeftIcon /></a>
	<h1>Ledger templates</h1>
	<button class="btn--circle" aria-label="Help"><QuestionMarkIcon /></button>
</header>

<main>
	<section class="list--section margin-block-start">
		<header>
			<h2>Templates</h2>
		</header>
		<ul>
			{#each data.templates as template (template.id)}
				<li>
					<a href="templates/{template.id}">{template.name}</a>
				</li>
			{/each}
		</ul>
	</section>
</main>
