import { Props } from 'tippy.js';
import { InjectionToken, TemplateRef, Type } from '@angular/core';

export type NgChanges<Component extends object, Props = ExcludeFunctions<Component>> = {
  [Key in keyof Props]: {
    previousValue: Props[Key];
    currentValue: Props[Key];
    firstChange: boolean;
    isFirstChange(): boolean;
  };
};

type MarkFunctionPropertyNames<Component> = {
  [Key in keyof Component]: Component[Key] extends Function ? never : Key;
}[keyof Component];

type ExcludeFunctions<T extends object> = Pick<T, MarkFunctionPropertyNames<T>>;

export type Content = TemplateRef<any> | Type<any> | string;

export const TIPPY_CONFIG = new InjectionToken<Partial<TippyConfig>>('Tippy config', {
  providedIn: 'root',
  factory() {
    return {};
  }
});

export interface TippyConfig extends Props {
  variations: Record<string, Partial<Props>>;
  defaultVariation: keyof TippyConfig['variations'];
}
