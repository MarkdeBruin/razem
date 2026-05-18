<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';
	import { ArrowLeftIcon, TrashSimpleIcon } from 'phosphor-svelte';

	let { data }: PageProps = $props();
</script>

<header class="header-sticky--back">
	<a href="/ledgers/{data.ledger.id}/edit" class="btn--circle" aria-label="Back to ledger">
		<ArrowLeftIcon />
	</a>
	<h1><span class="sr-only">Delete</span> {data.ledger.name}</h1>
</header>

<main>
	<form method="POST" use:enhance>
		<header>
			<h2>Delete ledger</h2>
			<p>This action cannot be undone.</p>
		</header>
		<button class="btn" type="submit">Delete ledger</button>
	</form>
</main>
