import type tippy from 'tippy.js';
import type { Instance, Props } from 'tippy.js';
import { ElementRef, InjectionToken } from '@angular/core';
import type { ResolveViewRef, ViewOptions } from '@ngneat/overview';

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

export interface ExtendedTippyProps extends TippyProps {
  variations: Record<string, Partial<TippyProps>>;
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

export type TippyLoader = () => typeof tippy | Promise<{ default: typeof tippy }>;

export const TIPPY_LOADER = new InjectionToken<TippyLoader>('TIPPY_LOADER');

export const TIPPY_REF = /* @__PURE__ */ new InjectionToken<TippyInstance>('TIPPY_REF');

export const TIPPY_CONFIG = new InjectionToken<TippyConfig>('Tippy config');
