import type { Attachment } from 'svelte/attachments';

export type ObserverHandle = {
	destroy: () => void;
};

export function attachObserveHeader(headerSpan: HTMLElement): Attachment<HTMLElement> {
	return (targetH1: HTMLElement) => {
		const handle = observeHeader({ headerSpan, targetH1 });
		return () => handle.destroy();
	};
}

export function observeHeader(opts: {
	headerSpan: HTMLElement;
	targetH1: HTMLElement;
}): ObserverHandle {
	const headerHeight = parseFloat(getComputedStyle(document.documentElement).fontSize || '20') * 3;
	let isVisible = false;

	function onIntersect(entries: IntersectionObserverEntry[]) {
		for (const entry of entries) {
			const scrolledPastHeader =
				entry.boundingClientRect.top < headerHeight && entry.intersectionRatio === 0;

			if (isVisible !== scrolledPastHeader) {
				opts.headerSpan.classList.toggle('visible', scrolledPastHeader);
				isVisible = scrolledPastHeader;
			}
		}
	}

	const io = new IntersectionObserver(onIntersect, {
		rootMargin: `-${headerHeight}px 0px 0px 0px`,
		threshold: [0]
	});

	io.observe(opts.targetH1);

	return {
		destroy: () => io.disconnect()
	};
}
