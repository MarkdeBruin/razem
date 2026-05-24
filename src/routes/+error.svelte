<script lang="ts">
	import { page } from '$app/state';
</script>

<error-message>
	<header>
		<h1>{page.status}</h1>
		{#if page.error}
			<p>{page.error.message}</p>
		{/if}
	</header>
	<a class="btn line" href="/">Back to home</a>
</error-message>
