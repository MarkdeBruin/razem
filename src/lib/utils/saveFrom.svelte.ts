import type { SubmitFunction } from '@sveltejs/kit';

const MIN_SAVE_DELAY_MS = 600;

export type SaveState = 'idle' | 'saving' | 'error';

export function useSaveForm() {
	let saveState = $state<SaveState>('idle');
	const enhance: SubmitFunction = () => {
		saveState = 'saving';
		const minDelay = new Promise((resolve) => setTimeout(resolve, MIN_SAVE_DELAY_MS));
		return async ({ update }) => {
			try {
				await Promise.all([update({ reset: false }), minDelay]);
				saveState = 'idle';
			} catch {
				saveState = 'error';
			}
		};
	};
	return {
		get saveState() {
			return saveState;
		},
		enhance
	};
}