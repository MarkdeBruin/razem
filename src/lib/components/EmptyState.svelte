<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		subtitle: string;
		cta: string;
		url: string;
		children?: Snippet;
	}

	let { title, subtitle, cta, url, children }: Props = $props();
</script>

<empty-state>
	{#if children}
		{@render children()}
	{/if}
	<h3>{title}</h3>
	<p>{subtitle}</p>
	<a class="btn" href={url}>{cta}</a>
</empty-state>
