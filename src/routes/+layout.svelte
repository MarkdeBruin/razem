<script lang="ts">
	import { IconContext } from 'phosphor-svelte';

	import '/src/styles/_global.css';
	import '/src/styles/_reset.css';
	import '/src/styles/base.css';
	import '/src/styles/font-face.css';
	import '/src/styles/inputs.css';
	import '/src/styles/balance.css';
	import '/src/styles/buttons.css';
	import '/src/styles/error-message.css';
	import '/src/styles/empty.css';
	import '/src/styles/headers.css';
	import '/src/styles/layout.css';
	import '/src/styles/lists.css';
	import '/src/styles/utilities.css';

	let { children } = $props();
</script>

<IconContext values={{ color: 'currentColor', size: '1.2em', mirrored: false, weight: 'bold' }}>
	{@render children()}
</IconContext>
