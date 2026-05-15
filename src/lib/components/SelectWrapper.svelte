<script lang="ts">
	let { children } = $props();
	import { CaretUpDownIcon } from 'phosphor-svelte';
</script>

<div class="select-wrapper">
	{@render children()}
	<CaretUpDownIcon />
</div>