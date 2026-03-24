<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<header>
	<hgroup>
		<h1>Delete {data.ledger.name}</h1>
		<mark>This action is perminent!</mark>
	</hgroup>
</header>

<main>
	<form method="POST" use:enhance>
		<button type="submit" class="secondary">Delete ledger</button>
	</form>
</main>
