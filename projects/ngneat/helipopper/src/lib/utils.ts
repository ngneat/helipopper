import { fromEvent, Observable } from 'rxjs';
import { auditTime, distinctUntilChanged, map, take } from 'rxjs/operators';
import { ElementRef, EmbeddedViewRef, TemplateRef } from '@angular/core';

const hasSupport = 'IntersectionObserver' in window;

export function inView(
  element: HTMLElement,
  options: IntersectionObserverInit = {
    root: null,
    threshold: 0.3
  }
) {
  return new Observable(subscriber => {
    if (!hasSupport) {
      subscriber.next();
      subscriber.complete();
    }

    const observer = new IntersectionObserver(([entry]) => {
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

const isSupportResizeObserver = 'ResizeObserver' in window;
const AUDIT_TIME = 150;

export function dimensionsChanges(target: HTMLElement, options?: ResizeObserverOptions) {
  return isSupportResizeObserver
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
  viewRef: EmbeddedViewRef<any>;

  constructor(tpl: TemplateRef<any>) {
    this.viewRef = tpl.createEmbeddedView({});
    this.viewRef.detectChanges();
  }

  get elementRef() {
    return this.viewRef.rootNodes[0] as HTMLElement;
  }

  destroy() {
    this.viewRef.destroy();
  }
}
