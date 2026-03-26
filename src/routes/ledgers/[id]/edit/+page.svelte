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
	<form method="POST" use:enhance>
		<fieldset class="grid">
			<label>
				Name
				<input
					type="text"
					name="ledger-name"
					value={data.ledger.name}
					required
					autocapitalize="sentences"
				/>
				{#if form?.nameMissing}<small>Name is required</small>{/if}
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
					required
					bind:value={ownerPercentage}
					oninput={() => {
						if (ownerPercentage === null || isNaN(ownerPercentage)) return;
						ownerPercentage = Math.min(100, Math.max(0, ownerPercentage));
						partnerPercentage = Math.round(100 - ownerPercentage);
					}}
					onblur={() => {
						if (ownerPercentage === null || isNaN(ownerPercentage)) {
							ownerPercentage = 0;
							partnerPercentage = 100;
						}
					}}
				/>
				{#if form?.fractionMissing}<small>{data.owner.name}’s share is required</small>{/if}
			</label>
			<label>
				<span>{data.partner.name}’s share</span>
				<input
					type="number"
					min="0"
					max="100"
					step="1"
					name="partner-percentage"
					bind:value={partnerPercentage}
					oninput={() => {
						if (partnerPercentage === null || isNaN(partnerPercentage)) return;
						partnerPercentage = Math.min(100, Math.max(0, partnerPercentage));
						ownerPercentage = Math.round(100 - partnerPercentage);
					}}
					onblur={() => {
						if (partnerPercentage === null || isNaN(partnerPercentage)) {
							partnerPercentage = 0;
							ownerPercentage = 100;
						}
					}}
				/>
			</label>
		</fieldset>
		<input type="submit" value="Save changes" />
	</form>
</main>
