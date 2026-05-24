<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';
	import { ArrowLeftIcon } from 'phosphor-svelte';

	let { data, form }: PageProps = $props();

	// svelte-ignore state_referenced_locally
	let fraction = data.ledger.ownerFraction;
	let ownerPercentage = $state(Math.round(fraction * 100));
	let partnerPercentage = $state(Math.round((1 - fraction) * 100));
</script>

<header class="header-sticky--back">
	<a href="/ledgers/{data.ledger.id}" class="btn--circle" aria-label="Back to ledger">
		<ArrowLeftIcon />
	</a>
	<h1><span class="sr-only">Manage</span> {data.ledger.name}</h1>
</header>

<main class="stack">
	<form method="POST" action="?/update" use:enhance>
		<h2>Edit ledger</h2>
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
			{data.partner.name}’s share
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
		<button class="btn" type="submit"><span>Save changes</span></button>
	</form>
	<form method="POST" action="?/template" use:enhance>
		<header>
			<h2>New template</h2>
			<p class="text-subtle">From all current expenses and the split setting</p>
		</header>
		<label>
			Name
			<input type="text" name="template-name" required />
			{#if form?.templateNameMissing}<mark>Name is required</mark>{/if}
		</label>

		<button class="btn line" type="submit"><span>Create template</span></button>
	</form>
	<form method="POST" action="?/delete" use:enhance>
		<header>
			<h2>Delete ledger</h2>
			<p class="text-subtle">And all expenses</p>
		</header>
		<label>
			<input type="checkbox" name="confirm-delete" required />
			Permanently delete ledger
		</label>
		<button class="btn line" type="submit"><span>Delete ledger</span></button>
	</form>
</main>
