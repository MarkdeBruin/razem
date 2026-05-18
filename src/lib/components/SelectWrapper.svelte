<script lang="ts">
	import type { Snippet } from 'svelte';
	import { CaretUpDownIcon } from 'phosphor-svelte';
	
	let { children }: { children: Snippet } = $props();
</script>

<select-wrapper>
	{@render children()}
	<CaretUpDownIcon />
</select-wrapper>
