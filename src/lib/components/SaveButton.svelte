<script lang="ts">
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import type { SaveState } from '$lib/utils/saveFrom.svelte';

	interface Props {
		saveState: SaveState;
		disabled?: boolean;
	}

	let { saveState = 'idle', disabled = false }: Props = $props();
</script>

<button class="btn sticky" type="submit" disabled={saveState === 'saving' || disabled}>
	{#key saveState}
		<span
			in:fly={{ y: -8, duration: 200, delay: 150, easing: cubicOut }}
			out:fly={{ y: 8, duration: 150 }}
		>
			{#if saveState === 'saving'}
				Saving…
			{:else if saveState === 'error'}
				Try again
			{:else}
				Save changes
			{/if}
		</span>
	{/key}
</button>
