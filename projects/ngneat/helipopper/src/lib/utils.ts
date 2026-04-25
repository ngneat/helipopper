import { ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { auditTime, map } from 'rxjs/operators';
import type { FloatingElement } from '@ngneat/helipopper/config';

import { IntersectionObserver } from './intersection-observer';

let supportsIntersectionObserver = false;
let supportsResizeObserver = false;

if (typeof window !== 'undefined') {
  supportsIntersectionObserver = 'IntersectionObserver' in window;
  supportsResizeObserver = 'ResizeObserver' in window;
}

export const enum TippyErrorCode {
  TippyNotProvided = 1,
}

export function inView(
  host: FloatingElement,
  options: IntersectionObserverInit = {
    root: null,
    threshold: 0.3,
  },
) {
  const element = coerceElement(host);

  return new Observable<void>((subscriber) => {
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
  // Don't access the `offsetWidth`/`offsetHeight` multiple times since it triggers layout updates.
  const hostOffsetWidth = host.offsetWidth;
  const hostOffsetHeight = host.offsetHeight;

  return (
    hostOffsetWidth > host.parentElement!.offsetWidth ||
    hostOffsetWidth < host.scrollWidth ||
    hostOffsetHeight < host.scrollHeight
  );
}

export function overflowChanges(host: FloatingElement) {
  const element = coerceElement(host);

  return dimensionsChanges(element).pipe(
    auditTime(150),
    map(() => isElementOverflow(element)),
  );
}

export function dimensionsChanges(target: HTMLElement) {
  return new Observable<void>((subscriber) => {
    if (!supportsResizeObserver) {
      subscriber.next();
      subscriber.complete();
      return;
    }

    const observer = new ResizeObserver(() => subscriber.next());
    observer.observe(target);
    return () => observer.disconnect();
  });
}

export function onlyFloatingProps(allProps: any) {
  const floatingProps: any = {};

  if (!allProps) {
    return floatingProps;
  }

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
    'bindings',
    'directives',
    'popperOptions',
  ];

  const overriddenMethods = ['onShow', 'onHidden', 'onCreate'];

  Object.keys(allProps).forEach((prop) => {
    if (!ownProps.includes(prop) && !overriddenMethods.includes(prop)) {
      floatingProps[prop] = allProps[prop];
    }
  });

  return floatingProps;
}

/** @deprecated Use `onlyFloatingProps` instead. */
export const onlyTippyProps = onlyFloatingProps;

export function normalizeClassName(className: string | string[]): string[] {
  const classes = typeof className === 'string' ? className.split(' ') : className;

  return classes.map((klass) => klass?.trim()).filter(Boolean);
}

export function coerceCssPixelValue<T>(value: T): string {
  if (value == null) {
    return '';
  }

  return typeof value === 'string' ? value : `${value}px`;
}

function coerceElement(element: FloatingElement) {
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
