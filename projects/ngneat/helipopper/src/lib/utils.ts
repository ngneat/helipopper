import { Observable } from 'rxjs';
import { auditTime } from 'rxjs/operators';

let supportsIntersectionObserver = false;
if (typeof window !== 'undefined') {
  supportsIntersectionObserver = 'IntersectionObserver' in window;
}

export function inView(
  element: HTMLElement,
  options: IntersectionObserverInit = {
    root: null,
    threshold: 0.3
  }
) {
  return new Observable(subscriber => {
    if (!supportsIntersectionObserver) {
      subscriber.next();
      subscriber.complete();
      // If the browser doesn't support the `IntersectionObserver` then
      // we "return" since it will throw `IntersectionObserver is not defined`.
      return;
    }

    const observer = new IntersectionObserver(entries => {
      // Several changes may occur in the same tick, we want to check the latest entry state.
      const entry = entries[entries.length - 1];
      if (entry.isIntersecting) {
        subscriber.next();
        subscriber.complete();
      }
    }, options);

    observer.observe(element);

    return () => observer.disconnect();
  });
}

interface Window {
  ResizeObserver: typeof ResizeObserver;
}

interface ResizeObserverOptions {
  box?: 'content-box' | 'border-box';
}

interface ResizeObserverSize {
  inlineSize: number;
  blockSize: number;
}

declare class ResizeObserver {
  constructor(callback: ResizeObserverCallback);

  disconnect(): void;

  observe(target: Element, options?: ResizeObserverOptions): void;

  unobserve(target: Element): void;
}

type ResizeObserverCallback = (entries: ReadonlyArray<ResizeObserverEntry>, observer: ResizeObserver) => void;

interface ResizeObserverEntry {
  readonly target: Element;
  readonly contentRect: DOMRectReadOnly;
  readonly borderBoxSize: ResizeObserverSize;
  readonly contentBoxSize: ResizeObserverSize;
}

export function dimensionsChanges(target: HTMLElement, options?: ResizeObserverOptions) {
  return resizeObserverStrategy(target, options).pipe(auditTime(150));
}

function resizeObserverStrategy(
  target: HTMLElement,
  options: ResizeObserverOptions = { box: 'border-box' }
): Observable<boolean> {
  return new Observable(subscriber => {
    const observer = new ResizeObserver(() => subscriber.next(true));

    observer.observe(target, options);

    return () => observer.disconnect();
  });
}
