<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';
	import { ArrowLeftIcon } from 'phosphor-svelte';

	let { data, form }: PageProps = $props();
</script>

<header class="header-sticky--back">
	<a href="/" class="btn--circle" aria-label="Back home">
		<ArrowLeftIcon />
	</a>
</header>

<main>
	<form method="POST" use:enhance>
		<h1>New ledger</h1>
		<label>
			Name
			<input type="text" name="ledger-name" required autocapitalize="sentences" />
			{#if form?.nameMissing}<small>Name is required</small>{/if}
		</label>

		<fieldset>
			<legend>Choose a template</legend>
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
		</fieldset>

		<input class="btn" type="submit" value="Add ledger" />
	</form>
</main>
