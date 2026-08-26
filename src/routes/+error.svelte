<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
</script>

<error-message>
	<header>
		<h1>{page.status}</h1>
		{#if page.error}
			<p>{page.error.message}</p>
		{/if}
	</header>
	<a class="btn" data-variant="line" href={resolve('/')}>Back to home</a>
</error-message>
