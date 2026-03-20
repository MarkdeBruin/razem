<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<header>
	<hgroup>
		<h1>New ledger tempalte</h1>
		<p>Tempaltes allow you to create new ledgers with pre-filled expenses and split setting.</p>
	</hgroup>
</header>

<main>
	{#if form?.success}
		<hr />
		<h2>Template created</h2>
		<button onclick={() => history.back()}>Back to {data.ledger.name}</button>
	{:else}
		<form method="POST" action="?/create" use:enhance>
			<input type="text" name="name" placeholder="Name" required />
			<input type="submit" value="Create template" />
			{#if form?.error}
				<mark>{form.error}</mark>
			{/if}
		</form>
	{/if}
</main>
