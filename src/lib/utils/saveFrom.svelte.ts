import type { SaveState } from '$lib/components/SaveButton.svelte';

export function useSaveForm() {
  let saveState = $state<SaveState>('idle');
  const minDelay = () => new Promise((resolve) => setTimeout(resolve, 600));

  function enhance() {
    saveState = 'saving';
    const delay = minDelay();
    return async ({ update }: { update: (o?: { reset?: boolean }) => Promise<void> }) => {
      await Promise.all([update({ reset: false }), delay]);
      saveState = 'idle';
    };
  }

  return {
    get saveState() { return saveState; },
    enhance,
  };
}