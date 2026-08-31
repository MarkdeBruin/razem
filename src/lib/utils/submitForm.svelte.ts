import type { SubmitFunction } from '@sveltejs/kit';

const MIN_SUBMIT_DELAY_MS = 600;

export type SubmitState = 'idle' | 'submitting' | 'error';

export function useSubmitForm() {
	let submitState = $state<SubmitState>('idle');
	const enhance: SubmitFunction = () => {
		submitState = 'submitting';
		const minDelay = new Promise((resolve) => setTimeout(resolve, MIN_SUBMIT_DELAY_MS));
		return async ({ update }) => {
			try {
				await Promise.all([update({ reset: false }), minDelay]);
				submitState = 'idle';
			} catch {
				submitState = 'error';
			}
		};
	};
	return {
		get submitState() {
			return submitState;
		},
		enhance
	};
}

export interface SubmitButtonLabels {
	idleLabel: string;
	pendingLabel: string;
}

export interface AnnounceLabels {
	pending: string;
	error: string;
	success?: string;
}

export function editLabels(): SubmitButtonLabels {
	return {
		idleLabel: 'Save changes',
		pendingLabel: 'Saving…'
	};
}
export function addLabels(thing: string): SubmitButtonLabels {
	return {
		idleLabel: `Add ${thing}`,
		pendingLabel: 'Adding…'
	};
}
export function deleteLabels(thing: string): SubmitButtonLabels {
	return {
		idleLabel: `Delete ${thing}`,
		pendingLabel: 'Deleting…'
	};
}

export function editAnnounce(): AnnounceLabels {
	return {
		pending: 'Saving changes',
		error: 'Something went wrong, please try again',
		success: 'Changes saved'
	};
}
export function addAnnounce(thing: string): AnnounceLabels {
  return {
    pending: `AddingR ${thing}`,
    error: 'Something went wrong, please try again'
  };
}
export function deleteAnnounce(thing: string): AnnounceLabels {
  return {
    pending: `Deleting ${thing}`,
    error: 'Something went wrong, please try again'
  };
}
