import { Observable } from 'rxjs';
import { auditTime } from 'rxjs/operators';

declare const ResizeObserver: any;

let supportsIntersectionObserver = false;
let supportsResizeObserver = false;

if (typeof window !== 'undefined') {
  supportsIntersectionObserver = 'IntersectionObserver' in window;
  supportsResizeObserver = 'ResizeObserver' in window;
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

export function dimensionsChanges(target: HTMLElement) {
  return resizeObserverStrategy(target).pipe(auditTime(150));
}

function resizeObserverStrategy(target: HTMLElement): Observable<boolean> {
  return new Observable(subscriber => {
    if (!supportsResizeObserver) {
      subscriber.next();
      subscriber.complete();
      return;
    }

    const observer = new ResizeObserver(() => subscriber.next(true));

    observer.observe(target);

    return () => observer.disconnect();
  });
}
