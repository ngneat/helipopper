import { inject, InjectionToken, Injector } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Options as PopperOptions } from '@popperjs/core';
import { Props } from 'tippy.js';
import { Variation } from './helipopper.types';

export const INITIAL_HELIPOPPER_OPTIONS = new InjectionToken<Partial<HelipopperOptions>>('InitialHelipopperOptions', {
  providedIn: 'root',
  factory: () => {
    const document = inject(DOCUMENT);
    // The code actually shouldn't be executed on the server-side,
    // but these options are "statically" initialized, thus Universal
    // will throw an error "document is not defined".
    return {
      options: {},
      textOverflow: false,
      appendTo: document.body,
      placement: 'top',
      variation: 'tooltip',
      disabled: false,
      allowClose: true
    };
  }
});

export interface HelipopperOptions {
  options: Partial<Props>;
  textOverflow: boolean;
  triggerTarget: Element;
  appendTo: string | HTMLElement;
  trigger: string | undefined;
  class: string | Array<string> | undefined;
  offset: [number, number] | undefined;
  injector: Injector | undefined;
  placement: PopperOptions['placement'];
  variation: Variation;
  disabled: boolean;
  sticky: boolean;
  allowClose: boolean;
}

// This type exists because it is acceptable to the AOT compiler.
// The AOT compiler throws:
// `Could not resolve type Partial`
// This happens if we use the `Partial` type in constructor, for instance:
// `@Inject(OPTIONS) options: Partial<Options>`
export type PartialHelipopperOptions = Partial<HelipopperOptions>;
