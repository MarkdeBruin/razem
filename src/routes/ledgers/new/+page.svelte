<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';
	import { ArrowLeftIcon } from 'phosphor-svelte';
	import { attachObserveHeader } from '$lib/utils/headerObserver';

	let { data, form }: PageProps = $props();
	let headerSpan = $state<HTMLElement>();
</script>

<header class="header-sticky--back">
	<a href={data.backUrl} class="btn--circle" aria-label="Back home">
		<ArrowLeftIcon />
	</a>
	<span bind:this={headerSpan} aria-hidden="true">New ledger</span>
</header>

<main>
	<form method="POST" use:enhance>
		<h1 {@attach attachObserveHeader(headerSpan)}>New ledger</h1>
		<label>
			Name
			<input type="text" name="ledger-name" required autocapitalize="sentences" />
			{#if form?.nameMissing}<small>Name is required</small>{/if}
		</label>

		<fieldset>
			<legend><span>Choose a template</span></legend>
			<div class="stack--small">
			<label>
				<input type="radio" id="blank" name="ledger-template" value="blank" checked />
				Blank ledger
			</label>

			{#each data.templates as template (template.id)}
				<label>
					<input type="radio" name="ledger-template" value={template.id} />
					{template.name}
				</label>
			{/each}
			</div>
		</fieldset>

		<button class="btn" type="submit"><span>Add ledger</span></button>
	</form>
</main>
