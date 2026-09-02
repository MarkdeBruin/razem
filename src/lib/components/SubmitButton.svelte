<script lang="ts">
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import type { SubmitState } from '$lib/utils/submitForm.svelte';

	interface Props {
		submitState: SubmitState;
		idleLabel: string;
		pendingLabel: string;
		disabled?: boolean;
	}
	let { submitState, idleLabel, pendingLabel, disabled = false }: Props = $props();
</script>

<button class="btn sticky" type="submit" disabled={submitState === 'submitting' || disabled}>
	{#key submitState}
		<span
			in:fly={{ y: -8, duration: 200, delay: 150, easing: cubicOut }}
			out:fly={{ y: 8, duration: 150 }}
		>
			{submitState === 'submitting' ? pendingLabel : idleLabel}
		</span>
	{/key}
</button>
