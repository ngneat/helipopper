import type tippy from 'tippy.js';
import type { Instance, Props } from 'tippy.js';
import { ElementRef, InjectionToken, type InputSignal } from '@angular/core';
import { ResolveViewRef, ViewOptions } from '@ngneat/overview';

export interface CreateOptions extends Partial<TippyProps>, ViewOptions {
  variation: string;
  preserveView: boolean;
  className: string | string[];
  data: any;
}

type InferInputSignalType<T> = T extends InputSignal<infer R> ? R : T;

export type NgChanges<Component extends object, Props = ExcludeFunctions<Component>> = {
  [Key in keyof Props]: {
    previousValue: InferInputSignalType<Props[Key]>;
    currentValue: InferInputSignalType<Props[Key]>;
    firstChange: boolean;
    isFirstChange(): boolean;
  };
};

type MarkFunctionPropertyNames<Component> = {
  [Key in keyof Component]: Component[Key] extends InputSignal<any>
    ? Key
    : Component[Key] extends Function
    ? never
    : Key;
}[keyof Component];

type ExcludeFunctions<T extends object> = Pick<T, MarkFunctionPropertyNames<T>>;

export const TIPPY_REF = new InjectionToken<TippyInstance>('TIPPY_REF');

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
  view: ResolveViewRef<T>;
  $viewOptions: ViewOptions;
  context?: ViewOptions['context'];
}

export interface TippyConfig extends Partial<ExtendedTippyProps> {
  loader: () => typeof tippy | Promise<{ default: typeof tippy }>;
}

export const TIPPY_CONFIG = new InjectionToken<TippyConfig>('Tippy config');
