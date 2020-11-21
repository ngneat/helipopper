import { fromEvent, Observable } from 'rxjs';
import { auditTime, distinctUntilChanged, map } from 'rxjs/operators';
import { ElementRef, EmbeddedViewRef, TemplateRef } from '@angular/core';

let supportsIntersectionObserver = false,
  supportsResizeObserver = false;
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
      // If the browser doesn't support the `IntersectionObserver` then
      // we "return" since it will throw `IntersectionObserver is not defined`.
      return;
    }

    const observer = new IntersectionObserver(entries => {
      // Several changes may occur in the same tick, we want to check the latest entry state.
      const entry = last(entries);
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

type ElementDimensions = {
  width: number;
  height: number;
};

const AUDIT_TIME = 150;

export function dimensionsChanges(target: HTMLElement, options?: ResizeObserverOptions) {
  return supportsResizeObserver
    ? resizeObserverStrategy(target, options).pipe(auditTime(AUDIT_TIME))
    : resizeWindowStrategy(target);
}

function resizeWindowStrategy(target: HTMLElement): Observable<ElementDimensions> {
  return fromEvent(window, 'resize').pipe(
    auditTime(AUDIT_TIME),
    map(() => ({
      width: target.offsetWidth,
      height: target.offsetHeight
    })),
    distinctUntilChanged((prev, current) => {
      return prev.width === current.width && prev.height === current.height;
    })
  );
}

function resizeObserverStrategy(
  target: HTMLElement,
  options: ResizeObserverOptions = { box: 'border-box' }
): Observable<ElementDimensions> {
  return new Observable(subscriber => {
    const observer = new ResizeObserver(([entry]) => {
      // Currently, only Firefox supports `borderBoxSize` property which
      // gives the border-box value include padding and border
      if (entry.borderBoxSize) {
        subscriber.next({
          width: entry.borderBoxSize.inlineSize,
          height: entry.borderBoxSize.blockSize
        });
      } else {
        subscriber.next({
          width: (entry.target as HTMLElement).offsetWidth,
          height: (entry.target as HTMLElement).offsetHeight
        });
      }
    });

    observer.observe(target, options);

    return () => observer.disconnect();
  });
}

export function coerceElement<T>(elementOrRef: ElementRef<T> | T): T {
  return elementOrRef instanceof ElementRef ? elementOrRef.nativeElement : elementOrRef;
}

export function isString(value: any): value is string {
  return typeof value === 'string';
}

export function addClass(element, className: string | string[]): void {
  if (Array.isArray(className)) {
    className.forEach(name => element.classList.add(name));
  } else {
    element.classList.add(className);
  }
}

export function createElement(tagName: string) {
  return document.createElement(tagName);
}

export function closest(element: Element, selector: string) {
  if (window['Element'] && !Element.prototype.closest) {
    Element.prototype.closest = function(s) {
      let matches = (this.document || this.ownerDocument).querySelectorAll(s),
        i,
        el = this;
      do {
        i = matches.length;
        while (--i >= 0 && matches.item(i) !== el) {}
      } while (i < 0 && (el = el.parentElement));
      return el;
    };
  }

  return element.closest(selector);
}

export class TemplatePortal {
  viewRef: EmbeddedViewRef<{}>;
  elementRef: HTMLElement;

  private wrapper: HTMLElement | null = null;

  constructor(tpl: TemplateRef<{}>) {
    this.viewRef = tpl.createEmbeddedView({});
    this.viewRef.detectChanges();

    if (this.viewRef.rootNodes.length === 1) {
      this.elementRef = this.viewRef.rootNodes[0];
    } else {
      this.wrapper = document.createElement('div');
      // The `node` might be an instance of the `Comment` class,
      // which is an `ng-container` element. We shouldn't filter it
      // out since there can be `ngIf` or any other directive bound
      // to the `ng-container`.
      this.wrapper.append(...this.viewRef.rootNodes);
      this.elementRef = this.wrapper;
    }
  }

  destroy(): void {
    if (this.wrapper !== null) {
      this.wrapper.parentNode.removeChild(this.wrapper);
      this.wrapper = null;
    }

    this.viewRef.destroy();
  }
}

function last<T>(arr: T[]): T {
  return arr[arr.length - 1];
}
