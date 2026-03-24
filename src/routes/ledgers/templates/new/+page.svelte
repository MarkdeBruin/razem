<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
</script>

<header>
	<hgroup>
		<h1>New ledger template</h1>
		{#if data.prefill}
			<p>from <a href="/ledgers/{data.ledger.id}">{data.ledger?.name}</a></p>
		{/if}
	</hgroup>
</header>

<main>
	<form method="POST" use:enhance>
		<input type="text" name="name" placeholder="Name" required />
		{#if form?.templateNameMissing}<mark>Name is required</mark>{/if}
		<input type="hidden" name="ledger-id" value="{data.ledger.id}">
		<input type="submit" value="Create template" />
	</form>
</main>
