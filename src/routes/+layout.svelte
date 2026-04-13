<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

	import '/src/styles/_global.css';
	import '/src/styles/_reset.css';
	import '/src/styles/base.css';
	import '/src/styles/buttons.css';
	import '/src/styles/headers.css';
	import '/src/styles/layout.css';
	import '/src/styles/ledgers.css';
	import '/src/styles/utilities.css';

	let { children } = $props();
</script>

<svelte:head>
	<title>Razem</title>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
