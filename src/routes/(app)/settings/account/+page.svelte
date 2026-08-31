<script lang="ts">
	import { enhance } from '$app/forms';
	import { ArrowLeftIcon } from 'phosphor-svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import { resolve } from '$app/paths';
</script>

<header class="header-sticky--back">
	<a href={resolve('/')} class="btn--circle" aria-label="Back home">
		<ArrowLeftIcon />
	</a>
	<h1>Account</h1>
</header>

<main>
	<EmptyState title="Coming soon" subtitle="Ask Mark to update your account details." />
	<form method="POST" action="?/logout" use:enhance>
		<button class="btn" data-variant="line" type="submit"><span>Log out</span></button>
	</form>
</main>
