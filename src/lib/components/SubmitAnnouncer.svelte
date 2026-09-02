<script lang="ts">
	import type { SubmitState, AnnounceLabels } from '$lib/utils/submitForm.svelte';

	interface Props {
		submitState: SubmitState;
		labels: AnnounceLabels;
		succeeded?: boolean;
	}
	let { submitState, labels, succeeded = false }: Props = $props();
</script>

{#if submitState === 'error'}
	<small>{labels.error}</small>
{/if}

<span class="sr-only" aria-live="polite" aria-atomic="true">
	{#if submitState === 'submitting'}
		{labels.pending}
	{:else if submitState === 'error'}
		{labels.error}
	{:else if succeeded && labels.success}
		{labels.success}
	{/if}
</span>
