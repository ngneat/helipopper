import { Props } from 'tippy.js';
import { Variation } from './helipopper.types';
import { Options as PopperOptions } from '@popperjs/core';
import { Injector } from '@angular/core';

export interface HelipopperOptions {
  helipopperOptions: Partial<Props>;
  helipopperTextOverflow: boolean;
  triggerTarget: Element;
  helipopperAppendTo: string | HTMLElement;
  helipopperTrigger: string | undefined;
  helipopperClass: string | Array<string> | undefined;
  helipopperOffset: [number, number] | undefined;
  helipopperInjector: Injector | undefined;
  helipopperPlacement: PopperOptions['placement'];
  helipopperVariation: Variation;
  helipopperDisabled: boolean;
  helipopperSticky: boolean;
}
