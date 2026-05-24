<script lang="ts">
	import type { PageProps } from './$types';
	let { data }: PageProps = $props();
</script>

<header>
	<hgroup>
		<h1>Ledger templates</h1>
		<p>You can create templates via a ledger’s page</p>
	</hgroup>
</header>

<main>
	<ul>
		{#each data.templates as template (template.id)}
			<li>
				<a href="templates/{template.id}">{template.name}</a>
			</li>
		{/each}
	</ul>
</main>
