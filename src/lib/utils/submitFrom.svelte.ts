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