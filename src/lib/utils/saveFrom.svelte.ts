import type { SubmitFunction } from '@sveltejs/kit';

export type SaveState = 'idle' | 'saving';

const MIN_SAVE_DELAY_MS = 600;

export function useSaveForm() {
	let saveState = $state<SaveState>('idle');

	const enhance: SubmitFunction = () => {
		saveState = 'saving';
		const minDelay = new Promise((resolve) => setTimeout(resolve, MIN_SAVE_DELAY_MS));

		return async ({ update }) => {
			await Promise.all([update({ reset: false }), minDelay]);
			saveState = 'idle';
		};
	};

	return {
		get saveState() {
			return saveState;
		},
		enhance
	};
}
