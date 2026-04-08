<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '/src/styles/_global.css';
	import '/src/styles/_reset.css';
	import '/src/styles/base.css';

	let { children } = $props();
</script>

<svelte:head>
    <title>Razem</title>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
