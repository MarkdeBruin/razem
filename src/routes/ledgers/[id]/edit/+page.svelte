<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	// svelte-ignore state_referenced_locally
	let fraction = data.ledger.ownerFraction;

	let ownerPercentage = $state(Math.round(fraction * 100));
	let partnerPercentage = $state(Math.round((1 - fraction) * 100));
</script>

<header><h1>Edit ledger</h1></header>

<main>
	<form method="POST" action="?/update" use:enhance>
		<fieldset class="grid">
			<label>
				Name
				<input type="text" name="name" value={data.ledger.name} />
			</label>
			<label>
				{data.owner.name}’s share
				<input
					type="number"
					min="0"
					max="100"
					step="1"
					inputmode="numeric"
					name="owner-percentage"
					bind:value={ownerPercentage}
					oninput={() => {
						if (ownerPercentage === null || isNaN(ownerPercentage)) return;
						ownerPercentage = Math.min(100, Math.max(0, ownerPercentage));
						partnerPercentage = Math.round(100 - ownerPercentage);
					}}
				/>
			</label>
			<label>
				<span>{data.partner.name}‘s share</span>
				<input
					type="number"
					min="0"
					max="100"
					step="1"
					bind:value={partnerPercentage}
					oninput={() => {
						if (partnerPercentage === null || isNaN(partnerPercentage)) return;
						partnerPercentage = Math.min(100, Math.max(0, partnerPercentage));
						ownerPercentage = Math.round(100 - partnerPercentage);
					}}
				/>
			</label>
		</fieldset>

		<input type="submit" value="Save changes" />

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
