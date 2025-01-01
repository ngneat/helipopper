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

export const TIPPY_LOADER = new InjectionToken<TippyLoader>(
  typeof ngDevMode !== 'undefined' && ngDevMode ? 'TIPPY_LOADER' : ''
);

export const TIPPY_CONFIG = new InjectionToken<TippyConfig>(
  typeof ngDevMode !== 'undefined' && ngDevMode ? 'TIPPY_CONFIG' : ''
);

/** @internal */
declare global {
  // Indicates whether the application is operating in development mode.
  // `ngDevMode` is a global flag set by Angular CLI.
  // https://github.com/angular/angular-cli/blob/9b883fe28862c96720c7899b431174e9b47ad7e4/packages/angular/build/src/tools/esbuild/application-code-bundle.ts#L604
  const ngDevMode: boolean;
}
