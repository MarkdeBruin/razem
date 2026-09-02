<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';
	import { ArrowLeftIcon } from 'phosphor-svelte';
	import { attachObserveHeader } from '$lib/utils/headerObserver';
	import SubmitAnnouncer from '$lib/components/SubmitAnnouncer.svelte';
	import SubmitButton from '$lib/components/SubmitButton.svelte';
	import { useSubmitForm, addAnnounce, addLabels } from '$lib/utils/submitForm.svelte';
	import { resolve } from '$app/paths';

	let { data, form }: PageProps = $props();
	let headerSpan = $state<HTMLElement>();

	const submit = useSubmitForm();
	const buttonLabels = addLabels('ledger');
	const announceLabels = addAnnounce('ledger');
</script>

<header class="header-sticky--back">
	<a href={resolve(data.backTo.route)} class="btn--circle" aria-label="Back">
		<ArrowLeftIcon />
	</a>
	<span bind:this={headerSpan} aria-hidden="true">New ledger</span>
</header>

<main>
	<form method="POST" use:enhance={submit.enhance}>
		<h1 {@attach attachObserveHeader(headerSpan)}>New ledger</h1>
		<label>
			Name
			<input type="text" name="ledger-name" required autocapitalize="sentences" />
			{#if form?.errors?.name}<small>{form.errors.name[0]}</small>{/if}
		</label>

		<fieldset>
			<legend><span>Choose a template</span></legend>
			<div class="stack--small">
				<label>
					<input type="radio" id="blank" name="ledger-template" value="blank" checked />
					Blank ledger
				</label>

				{#each data.templates as template (template.id)}
					<label>
						<input type="radio" name="ledger-template" value={template.id} />
						{template.name}
					</label>
				{/each}
			</div>
		</fieldset>

		<label>
			<input type="checkbox" name="is-template" value="true" />
			Create as template
		</label>

		<SubmitButton submitState={submit.submitState} {...buttonLabels} />
		<SubmitAnnouncer submitState={submit.submitState} labels={announceLabels} />
	</form>
</main>
