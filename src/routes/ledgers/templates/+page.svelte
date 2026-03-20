<script lang="ts">
    import type { PageData } from "./$types";
	let { data }: { data: PageData } = $props();
</script>

<header>
	<hgroup>
		<h1>Ledger templates</h1>
		<p>You can create templates via a leder’s page</p>
	</hgroup>
</header>

<main>
	<ul>
		{#each data.templates as template}
			<li>
				<a href="templates/{template.id}">{template.name}</a>
			</li>
		{/each}
	</ul>
</main>
