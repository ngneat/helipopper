import { Observable } from 'rxjs';
import { auditTime, map } from 'rxjs/operators';
import { TippyElement } from './tippy.types';
import { ElementRef } from '@angular/core';

declare const ResizeObserver: any;

let supportsIntersectionObserver = false;
let supportsResizeObserver = false;

if (typeof window !== 'undefined') {
  supportsIntersectionObserver = 'IntersectionObserver' in window;
  supportsResizeObserver = 'ResizeObserver' in window;
}

export function inView(
  host: TippyElement,
  options: IntersectionObserverInit = {
    root: null,
    threshold: 0.3,
  }
) {
  const element = coerceElement(host);

  return new Observable((subscriber) => {
    if (!supportsIntersectionObserver) {
      subscriber.next();
      subscriber.complete();
      return;
    }

    const observer = new IntersectionObserver((entries) => {
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

export function isElementOverflow(host: HTMLElement): boolean {
  // Don't access the `offsetWidth` multiple times since it triggers layout updates.
  const hostOffsetWidth = host.offsetWidth;

  return hostOffsetWidth > host.parentElement.offsetWidth || hostOffsetWidth < host.scrollWidth;
}

export function overflowChanges(host: TippyElement) {
  const element = coerceElement(host);

  return dimensionsChanges(element).pipe(
    auditTime(150),
    map(() => isElementOverflow(element))
  );
}

export function dimensionsChanges(target: HTMLElement) {
  return resizeObserverStrategy(target);
}

function resizeObserverStrategy(target: HTMLElement): Observable<boolean> {
  return new Observable((subscriber) => {
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

export function onlyTippyProps(allProps: any) {
  const tippyProps = {};

  const ownProps = [
    'useTextContent',
    'variations',
    'useHostWidth',
    'defaultVariation',
    'beforeRender',
    'isLazy',
    'variation',
    'isEnabled',
    'className',
    'onlyTextOverflow',
    'data',
    'content',
    'context',
    'hideOnEscape',
    'customHost',
    'injector',
    'preserveView',
    'vcr',
    'popperWidth',
    'zIndexGetter',
    'staticWidthHost',
  ];

  const overriddenMethods = ['onShow', 'onHidden', 'onCreate'];

  Object.keys(allProps).forEach((prop) => {
    if (!ownProps.includes(prop) && !overriddenMethods.includes(prop)) {
      tippyProps[prop] = allProps[prop];
    }
  });

  return tippyProps;
}

export function normalizeClassName(className: string | string[]): string[] {
  const classes = isString(className) ? className.split(' ') : className;

  return classes.map((klass) => klass?.trim()).filter(Boolean);
}

export function coerceCssPixelValue<T>(value: T): string {
  if (isNil(value)) {
    return '';
  }

  return typeof value === 'string' ? value : `${value}px`;
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isNil(value: any): value is undefined | null {
  return value === undefined || value === null;
}

function coerceElement(element: TippyElement) {
  return element instanceof ElementRef ? element.nativeElement : element;
}

let observer: IntersectionObserver;
const elementHiddenHandlers = new WeakMap<Element, () => void>();
export function observeVisibility(host: Element, hiddenHandler: () => void) {
  observer ??= new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        elementHiddenHandlers.get(entry.target)!();
      }
    });
  });
  elementHiddenHandlers.set(host, hiddenHandler);
  observer.observe(host);

  return () => {
    elementHiddenHandlers.delete(host);
    observer.unobserve(host);
  };
}
