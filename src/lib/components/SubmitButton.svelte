<script lang="ts">
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import type { SubmitState } from '$lib/utils/submitFrom.svelte';

	interface Props {
		submitState: SubmitState;
		disabled?: boolean;
	}

	let { submitState = 'idle', disabled = false }: Props = $props();
</script>

<button class="btn sticky" type="submit" disabled={submitState === 'submitting' || disabled}>
	{#key submitState}
		<span
			in:fly={{ y: -8, duration: 200, delay: 150, easing: cubicOut }}
			out:fly={{ y: 8, duration: 150 }}
		>
			{#if submitState === 'submitting'}
				Saving…
			{:else if submitState === 'error'}
				Try again
			{:else}
				Save changes
			{/if}
		</span>
	{/key}
</button>
