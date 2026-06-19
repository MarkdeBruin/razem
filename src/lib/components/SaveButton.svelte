<script lang="ts" module>
  export type SaveState = 'idle' | 'saving';
</script>

<script lang="ts">
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	let { saveState = 'idle', disabled = false }: { saveState: SaveState, disabled?: boolean } = $props();
</script>

<button class="btn" type="submit" disabled={saveState !== 'idle' || disabled}>
	<span style="display: grid; overflow: hidden;">
		{#key saveState}
			<span
				style="grid-area: 1/1"
				in:fly={{ y: -8, duration: 200, delay: 150, easing: cubicOut }}
				out:fly={{ y: 8, duration: 150 }}
			>
				{saveState === 'saving' ? 'Saving…' : 'Save changes'}
			</span>
		{/key}
	</span>
</button>
