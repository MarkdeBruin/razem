<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
</script>

<header>
	<h1>{data.template.name}</h1>
	<p>TODO: Add overview once components are set up.</p>
</header>
