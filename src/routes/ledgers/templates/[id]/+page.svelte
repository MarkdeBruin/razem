<script lang="ts">
	import type { PageProps } from './$types';
	let { data }: PageProps = $props();
</script>

<header>
	<h1>{data.template.name}</h1>
	<p>TODO: Add overview once components are set up.</p>
</header>
