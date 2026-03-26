<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';
	let { data, form }: PageProps = $props();
</script>

<header><h1>New ledger</h1></header>

<main>
	<form method="POST" use:enhance>
		<label>
			<span>Ledger name</span>
			<input type="text" name="ledger-name" required autocapitalize="sentences" />
			{#if form?.nameMissing}<small>Name is required</small>{/if}
		</label>

		<fieldset>
			<legend>Choose a template</legend>
			<label>
				<input type="radio" id="blank" name="ledger-template" value="blank" checked />
				Blank ledger — no expenses and 50/50 split.
			</label>

			{#each data.templates as template}
				<label>
					<input type="radio" name="ledger-template" value={template.id} />
					{template.name} <a href="/ledgers/templates/{template.id}">View template</a>
				</label>
			{/each}
		</fieldset>

		<hr />

		<small>You can add new templates via ledger detail pages.</small>

		<hr />

		<input type="submit" value="Add ledger" />
	</form>
</main>
