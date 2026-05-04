<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

	import '/src/styles/_global.css';
	import '/src/styles/_reset.css';
	import '/src/styles/base.css';
	import '/src/styles/font-face.css';
	import '/src/styles/inputs.css'
	import '/src/styles/balance.css';
	import '/src/styles/buttons.css';
	import '/src/styles/headers.css';
	import '/src/styles/layout.css';
	import '/src/styles/lists.css';
	import '/src/styles/utilities.css';

	import { IconContext } from 'phosphor-svelte';

	let { children } = $props();
</script>

<svelte:head>
	<title>Razem</title>
	<link rel="icon" href={favicon} />
	<link
		rel="preload"
		href="/assets/fonts/spaceGrotesk.woff2"
		as="font"
		type="font/woff2"
		crossorigin="anonymous"
	/>
</svelte:head>

<IconContext values={{ color: 'currentColor', size: '1.2em', mirrored: false, weight: 'bold' }}>
	{@render children()}
</IconContext>
