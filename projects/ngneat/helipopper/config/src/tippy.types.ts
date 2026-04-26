import type tippy from 'tippy.js';
import type { Instance, Props } from 'tippy.js';
import { ElementRef, InjectionToken, Type } from '@angular/core';
import { Observable, of } from 'rxjs';
import type { Content, ResolveViewRef, ViewOptions } from '@ngneat/overview';

export interface CreateOptions extends Partial<TippyProps>, ViewOptions {
  variation: string;
  preserveView: boolean;
  className: string | string[];
  data: any;
}

export interface TippyInstance extends Instance {
  data?: any;
}

export type TippyProps = Props;

// Extends tippy props with isContextMenu so any named variation (not just one
// called 'contextMenu') can opt into right-click listener behaviour.
export type VariationConfig = Partial<TippyProps> & { isContextMenu?: boolean };

export interface ExtendedTippyProps extends TippyProps {
  variations: Record<string, VariationConfig>;
  defaultVariation: keyof ExtendedTippyProps['variations'];
  beforeRender?: (text: string) => string;
  zIndexGetter?(): number;
}

export type TippyElement = ElementRef | Element;

export interface ExtendedTippyInstance<T> extends TippyInstance {
  view: ResolveViewRef<T> | null;
  $viewOptions: ViewOptions;
  context?: ViewOptions['context'];
}

export type TippyConfig = Partial<ExtendedTippyProps>;

export type TippyContent = Content | (() => Promise<Type<any>>);

export type TippyLoader = () => typeof tippy | Promise<{ default: typeof tippy }>;

export const TIPPY_LOADER = new InjectionToken<TippyLoader>(
  ngDevMode ? 'TIPPY_LOADER' : '',
);

export const TIPPY_CONFIG = new InjectionToken<TippyConfig>(
  ngDevMode ? 'TIPPY_CONFIG' : '',
);

export const TIPPY_LOADER_COMPONENT = new InjectionToken<Type<unknown>>(
  ngDevMode ? 'TIPPY_LOADER_COMPONENT' : '',
);

export type TippyLoaderTiming = Observable<void>;

export const TIPPY_LOADER_TIMING = new InjectionToken<TippyLoaderTiming>(
  ngDevMode ? 'TIPPY_LOADER_TIMING' : '',
  { factory: () => of(undefined) },
);
