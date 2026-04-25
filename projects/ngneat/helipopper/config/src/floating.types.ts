import type { Middleware, Placement } from '@floating-ui/dom';
import { ElementRef, InjectionToken, Type } from '@angular/core';
import { Observable, of } from 'rxjs';
import type { Content, ResolveViewRef, ViewOptions } from '@ngneat/overview';

export interface FloatingInstance {
  id: number;
  reference: HTMLElement;
  popper: HTMLElement;
  props: FloatingProps;
  state: {
    isVisible: boolean;
    isEnabled: boolean;
    isMounted: boolean;
    isDestroyed: boolean;
  };
  data?: any;
  show(): void;
  hide(): void;
  enable(): void;
  disable(): void;
  destroy(): void;
  setProps(props: Partial<FloatingProps>): void;
  setContent(content: string | Element | null | undefined): void;
}

export interface FloatingProps {
  placement: Placement;
  offset: [number, number] | number;
  arrow: boolean;
  animation: string | undefined;
  duration: [number, number];
  delay: number | [number, number];
  interactive: boolean;
  interactiveBorder: number;
  trigger: string;
  triggerTarget: HTMLElement | null;
  hideOnClick: boolean | 'toggle';
  showOnCreate: boolean;
  appendTo: 'parent' | Element | ((ref: Element) => Element);
  zIndex: number;
  maxWidth: number | string;
  theme: string | null | undefined;
  allowHTML: boolean;
  getReferenceClientRect: (() => DOMRect) | null;
  middleware: Middleware[];
  onShow: ((instance: FloatingInstance) => void | false) | null;
  onHide: ((instance: FloatingInstance) => void) | null;
  onMount: ((instance: FloatingInstance) => void) | null;
  onCreate: ((instance: FloatingInstance) => void) | null;
  onHidden: ((instance: FloatingInstance) => void) | null;
}

export interface ExtendedFloatingProps extends FloatingProps {
  variations: Record<string, Partial<FloatingProps>>;
  defaultVariation: keyof ExtendedFloatingProps['variations'];
  beforeRender?: (text: string) => string;
  zIndexGetter?(): number;
}

export type FloatingElement = ElementRef | Element;
export type FloatingConfig = Partial<ExtendedFloatingProps>;
export type FloatingContent = Content | (() => Promise<Type<any>>);

export interface CreateOptions extends Partial<FloatingProps>, ViewOptions {
  variation: string;
  preserveView: boolean;
  className: string | string[];
  data: any;
}

export interface ExtendedFloatingInstance<T> extends FloatingInstance {
  view: ResolveViewRef<T> | null;
  $viewOptions: ViewOptions;
  context?: ViewOptions['context'];
}

export type FloatingLoader = () => unknown;

export const FLOATING_LOADER = new InjectionToken<FloatingLoader>(
  ngDevMode ? 'FLOATING_LOADER' : '',
  // Default: load @floating-ui/dom lazily so it lands in a separate chunk.
  // Override via provideFloatingLoader() if you need a custom loader.
  { factory: () => () => import('@floating-ui/dom') },
);

export const FLOATING_CONFIG = new InjectionToken<FloatingConfig>(
  ngDevMode ? 'FLOATING_CONFIG' : '',
);

export const FLOATING_LOADER_COMPONENT = new InjectionToken<Type<unknown>>(
  ngDevMode ? 'FLOATING_LOADER_COMPONENT' : '',
);

export type FloatingLoaderTiming = Observable<void>;

export const FLOATING_LOADER_TIMING = new InjectionToken<FloatingLoaderTiming>(
  ngDevMode ? 'FLOATING_LOADER_TIMING' : '',
  { factory: () => of(undefined) },
);

// ---------------------------------------------------------------------------
// Deprecated aliases kept for backwards compatibility
// ---------------------------------------------------------------------------

/** @deprecated Use `FloatingInstance` instead. */
export type TippyInstance = FloatingInstance;
/** @deprecated Use `FloatingProps` instead. */
export type TippyProps = FloatingProps;
/** @deprecated Use `ExtendedFloatingProps` instead. */
export type ExtendedTippyProps = ExtendedFloatingProps;
/** @deprecated Use `FloatingElement` instead. */
export type TippyElement = FloatingElement;
/** @deprecated Use `ExtendedFloatingInstance` instead. */
export type ExtendedTippyInstance<T> = ExtendedFloatingInstance<T>;
/** @deprecated Use `FloatingConfig` instead. */
export type TippyConfig = FloatingConfig;
/** @deprecated Use `FloatingContent` instead. */
export type TippyContent = FloatingContent;
/** @deprecated Use `FloatingLoader` instead. */
export type TippyLoader = FloatingLoader;
/** @deprecated Use `FLOATING_LOADER` instead. */
export const TIPPY_LOADER = FLOATING_LOADER;
/** @deprecated Use `FLOATING_CONFIG` instead. */
export const TIPPY_CONFIG = FLOATING_CONFIG;
/** @deprecated Use `FLOATING_LOADER_COMPONENT` instead. */
export const TIPPY_LOADER_COMPONENT = FLOATING_LOADER_COMPONENT;
/** @deprecated Use `FLOATING_LOADER_TIMING` instead. */
export const TIPPY_LOADER_TIMING = FLOATING_LOADER_TIMING;
/** @deprecated Use `FloatingLoaderTiming` instead. */
export type TippyLoaderTiming = FloatingLoaderTiming;
