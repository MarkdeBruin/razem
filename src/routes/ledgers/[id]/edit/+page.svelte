<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';
	let { data, form }: PageProps = $props();
</script>

<header><h1>New ledger</h1></header>

<main>
	<form method="POST" action="?/update" use:enhance>
		<fieldset class="grid">
			<label>
				Name
				<input type="text" name="name" value={data.ledger.name} />
			</label>
			<label>
				{data.owner.name}’s fraction
				<input
					type="number"
					min="0"
					max="1"
					step="0.1"
					name="owner-fraction"
					value={data.ledger.ownerFraction}
				/>
				<input type="submit" value="Save change" class="outline secondary" />
			</label>
		</fieldset>

		{#if form?.error}
			<hr />
			<mark>{form?.error}</mark>
		{/if}
	</form>
</main>

<footer>
	<hr />
	<details name="action">
		<summary><strong>Danger zone</strong></summary>
		<form method="POST" action="?/delete" use:enhance>
			<button type="submit" class="outline secondary">Delete ledger</button>
		</form>
	</details>
	<hr />
</footer>
