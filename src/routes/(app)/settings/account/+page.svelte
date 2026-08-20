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
	<h1>Account</h1>
</header>

<main>
	<form method="POST" action="?/logout" use:enhance>
		<button class="btn" data-variant="line" type="submit"><span>Log out</span></button>
	</form>
</main>
