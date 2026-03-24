<script lang="ts">
	import type { PageProps } from './$types';
	let { data }: PageProps = $props();
</script>

<header>
	<hgroup>
		<h1>Expense categories</h1>
		<p>Keywords are used to automatically select the right category when adding an expense.</p>
	</hgroup>
</header>

<main>
	<ul>
		{#each data.categories as category}
			<li>
				<a href="settings/catagories/{category.id}">{category.name}</a>
				{#if category.keywords.length > 0}
					<ul>
						<small>Keywords:</small>
						{#each category.keywords as keyword}
							<li>{keyword}</li>
						{/each}
					</ul>
				{/if}
			</li>
		{/each}
	</ul>
</main>
